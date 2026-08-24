import type { Publisher } from "@/lib/auth";
import { getPublisherByUserId } from "@/lib/auth";
import { createContentItem } from "@/lib/content";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
  type Post,
} from "@/lib/data";
import {
  createDepartmentEntry,
  deleteDepartmentEntry,
  getAllDepartmentEntries,
  getDepartmentEntryById,
  updateDepartmentEntry,
  type DepartmentEntry,
} from "@/lib/department-content";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  type PageDocument,
} from "@/lib/documents";
import { createEditorialDraft, detectEditorialTarget } from "@/lib/editorial-ai";
import { normalizeEducationQualityRubricId } from "@/lib/education-quality";
import {
  draftRecordToPayload,
  draftTargetConfigs,
  type EditorialAiDraft,
  type EditorialDraftTarget,
} from "@/lib/editorial-drafts";
import {
  canEditPage,
  editorialAccessOptions,
  isDepartmentPagePath,
} from "@/lib/editorial-access";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { decideScheduleRun, getSchedulerItems, type RunPayload } from "@/lib/scheduler";
import {
  answerTelegramCallback,
  escapeTelegramHtml,
  getTelegramFile,
  sendTelegramChatAction,
  sendTelegramMessage,
  type TelegramButton,
} from "@/lib/telegram";
import {
  clearTelegramEditorialState,
  createTelegramLinkRequest,
  deleteTelegramAccountLink,
  finishTelegramUpdate,
  getTelegramAccountLink,
  getTelegramEditorialState,
  reserveTelegramUpdate,
  setTelegramEditorialState,
} from "@/lib/telegram-editorial-store";

export type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
};

export type TelegramMessage = {
  message_id: number;
  text?: string;
  caption?: string;
  from?: TelegramUser;
  chat: { id: number; type?: string };
  document?: {
    file_id: string;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  };
  photo?: Array<{
    file_id: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
};

export type TelegramCallbackQuery = {
  id: string;
  data?: string;
  from: TelegramUser;
  message?: TelegramMessage;
};

export type TelegramEditorialUpdate = {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
};

type UploadedSource = {
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

type PendingDraft = {
  draft: EditorialAiDraft;
  source: UploadedSource | null;
  pagePath: string;
};

type DraftListItem = {
  id: string;
  type: "p" | "d" | "g";
  title: string;
  destination: string;
  updatedAt: string;
};

const commandTargets: Record<string, EditorialDraftTarget> = {
  news: "news",
  event: "event",
  document: "document",
  vacancy: "vacancy",
  schedule: "schedule_lesson",
  exam: "schedule_exam",
  book: "library_book",
  thesis: "student_thesis",
  teacher: "department_teacher",
  department: "department_section",
  article: "department_article",
  material: "department_material",
  photo: "department_photo",
};

function cleanCommand(value: string): string {
  return value.replace(/^\/([a-z_]+)(?:@[a-z0-9_]+)?/i, "/$1");
}

function commandName(value: string): string {
  return cleanCommand(value).trim().split(/\s+/)[0]?.replace(/^\//, "").toLowerCase() || "";
}

function commandBody(value: string): string {
  return cleanCommand(value).trim().replace(/^\/[a-z_]+\s*/i, "").trim();
}

function rowButtons(buttons: TelegramButton[], size = 2): TelegramButton[][] {
  const rows: TelegramButton[][] = [];
  for (let index = 0; index < buttons.length; index += size) rows.push(buttons.slice(index, index + size));
  return rows;
}

function accessiblePageOptions(publisher: Publisher, departmentOnly = false) {
  return editorialAccessOptions.filter((option) => option.value !== "*"
    && (!departmentOnly || option.group === "department")
    && canEditPage(publisher, option.value));
}

function pageLabel(pagePath: string) {
  return editorialAccessOptions.find((option) => option.value === pagePath)?.label || pagePath;
}

function targetConfig(target: EditorialDraftTarget) {
  return draftTargetConfigs.find((entry) => entry.id === target)!;
}

function targetNeedsPage(target: EditorialDraftTarget) {
  const config = targetConfig(target);
  return target === "document" || Boolean(config.departmentEntryType);
}

function pageFromInstruction(instruction: string, publisher: Publisher, departmentOnly: boolean) {
  return accessiblePageOptions(publisher, departmentOnly).find((option) => instruction.includes(option.value))?.value || "";
}

function defaultPage(target: EditorialDraftTarget, instruction: string, publisher: Publisher) {
  const config = targetConfig(target);
  if (!targetNeedsPage(target)) return config.pagePath;
  const departmentOnly = Boolean(config.departmentEntryType);
  const explicit = pageFromInstruction(instruction, publisher, departmentOnly);
  if (explicit) return explicit;
  const options = accessiblePageOptions(publisher, departmentOnly);
  return options.length === 1 ? options[0].value : "";
}

function publisherCanUseTarget(publisher: Publisher, target: EditorialDraftTarget) {
  const config = targetConfig(target);
  if (config.departmentEntryType) return accessiblePageOptions(publisher, true).length > 0;
  if (target === "document") return accessiblePageOptions(publisher).length > 0;
  return canEditPage(publisher, config.pagePath);
}

function inferMimeType(fileName: string, declared = "") {
  if (declared) return declared;
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "application/pdf";
  if (extension === "docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (extension === "txt") return "text/plain";
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  return "application/octet-stream";
}

function toFile(bytes: Uint8Array, fileName: string, mimeType: string) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new File([copy.buffer], fileName, { type: mimeType });
}

async function uploadSource(file: File, bytes: Uint8Array, publisher: Publisher): Promise<UploadedSource | null> {
  const isImage = file.type.startsWith("image/");
  const isDocument = file.type === "application/pdf"
    || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (!isImage && !isDocument) return null;
  const maxSize = isImage ? 8 * 1024 * 1024 : 20 * 1024 * 1024;
  if (bytes.byteLength > maxSize) throw new Error(isImage ? "Фото має бути менше 8 МБ" : "Документ має бути менше 20 МБ");
  const extension = isImage
    ? file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
    : file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const purpose = isImage ? "articles" : "documents";
  const bucket = isImage ? "editorial-media" : "editorial-documents";
  const key = `${purpose}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const admin = createSupabaseAdmin();
  const { error } = await admin.storage.from(bucket).upload(key, bytes, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
    metadata: { uploadedBy: publisher.email, source: "telegram-editorial-bot" },
  });
  if (error) throw error;
  const { data } = admin.storage.from(bucket).getPublicUrl(key);
  return { url: data.publicUrl, fileName: file.name, mimeType: file.type, fileSize: bytes.byteLength };
}

async function linkedPublisher(chatId: string): Promise<Publisher | null> {
  const link = await getTelegramAccountLink(chatId);
  if (!link) return null;
  const publisher = await getPublisherByUserId(link.userId);
  if (!publisher || publisher.mustChangePassword) return null;
  return publisher;
}

async function sendLogin(chatId: string, user: TelegramUser, siteUrl: string) {
  const { token } = await createTelegramLinkRequest({
    chatId,
    telegramUserId: String(user.id),
    username: user.username || "",
    firstName: user.first_name || "",
  });
  const url = `${siteUrl}/panel/telegram/connect?token=${encodeURIComponent(token)}`;
  await sendTelegramMessage(chatId,
    "<b>Редакційний бот АПСВТ</b>\n\nУвійдіть до редакційної панелі звичайною поштою та паролем або одноразовим кодом, а потім підтвердьте прив’язку Telegram. Пароль у чат надсилати не потрібно.",
    [[{ text: "🔐 Увійти й підключити Telegram", url }]],
  );
}

async function sendMenu(chatId: string, publisher: Publisher, siteUrl: string) {
  await sendTelegramMessage(chatId,
    `<b>Редакційна панель у Telegram</b>\n${escapeTelegramHtml(publisher.displayName)} · ${publisher.role === "admin" ? "адміністратор" : "редактор"}\n\nНадішліть текст, фото, PDF або Word — AI підготує матеріал і попросить підтвердження.`,
    [
      [
        { text: "✨ Новий матеріал", callback_data: "ed:menu:new" },
        { text: "🗂 Чернетки", callback_data: "ed:menu:drafts" },
      ],
      [
        { text: "👤 Мій доступ", callback_data: "ed:menu:me" },
        { text: "📅 Розклад", callback_data: "ed:menu:schedule" },
      ],
      [
        { text: "🖥 Відкрити панель", url: `${siteUrl}/panel` },
        { text: "❓ Допомога", callback_data: "ed:menu:help" },
      ],
      [{ text: "Від’єднати Telegram", callback_data: "ed:asklogout" }],
    ],
  );
}

async function sendHelp(chatId: string, siteUrl: string) {
  await sendTelegramMessage(chatId,
    "<b>Як працювати з ботом</b>\n\n1. Надішліть текст, фото, PDF або Word.\n2. AI визначить розділ і оформить матеріал.\n3. Перевірте короткий попередній перегляд.\n4. Натисніть «Зберегти чернетку» або «Опублікувати».\n\nКоманди: /menu, /new, /news, /event, /document, /teacher, /material, /drafts, /me, /cancel, /logout.\n\nБот застосовує ті самі права доступу, що й панель на сайті.",
    [[{ text: "Повна редакційна панель", url: `${siteUrl}/panel` }]],
  );
}

async function sendAccess(chatId: string, publisher: Publisher) {
  const scopes = publisher.role === "admin" || publisher.accessScopes.includes("*")
    ? "Увесь сайт"
    : publisher.accessScopes.map(pageLabel).join("\n• ");
  await sendTelegramMessage(chatId,
    `<b>${escapeTelegramHtml(publisher.displayName)}</b>\n${escapeTelegramHtml(publisher.email)}\nРоль: ${publisher.role === "admin" ? "Адміністратор" : "Редактор"}\n\n<b>Доступ:</b>\n• ${escapeTelegramHtml(scopes)}`,
  );
}

function pageChoiceButtons(publisher: Publisher, target: EditorialDraftTarget): TelegramButton[][] {
  const config = targetConfig(target);
  const allowed = accessiblePageOptions(publisher, Boolean(config.departmentEntryType));
  const buttons = allowed.map((option) => {
    const index = editorialAccessOptions.findIndex((item) => item.value === option.value);
    return { text: option.label.slice(0, 42), callback_data: `ed:page:${index}` } satisfies TelegramButton;
  });
  return [...rowButtons(buttons, 1), [{ text: "Скасувати", callback_data: "ed:cancel" }]];
}

async function sendDraftPreview(chatId: string, publisher: Publisher, pending: PendingDraft) {
  const { draft, pagePath } = pending;
  const config = targetConfig(draft.target);
  const firstPayload = draft.records[0] ? draftRecordToPayload(draft.records[0]) : {};
  const fieldPreview = config.fields
    .map((field) => ({ label: field.label, value: firstPayload[field.key] }))
    .filter((field) => field.value?.trim())
    .slice(0, 5)
    .map((field) => `<b>${escapeTelegramHtml(field.label)}:</b> ${escapeTelegramHtml(field.value).slice(0, 420)}`)
    .join("\n");
  const warnings = draft.warnings.slice(0, 3).map((warning) => `• ${escapeTelegramHtml(warning)}`).join("\n");
  const text = [
    `<b>AI-чернетка · ${escapeTelegramHtml(config.label)}</b>`,
    `<b>${escapeTelegramHtml(draft.title || firstPayload.title || "Новий матеріал")}</b>`,
    draft.summary ? escapeTelegramHtml(draft.summary).slice(0, 900) : "",
    fieldPreview,
    `<b>Записів:</b> ${draft.records.length}`,
    pagePath ? `<b>Сторінка:</b> ${escapeTelegramHtml(pageLabel(pagePath))}` : "<b>Оберіть сторінку розміщення:</b>",
    warnings ? `<b>Потрібна увага:</b>\n${warnings}` : "",
  ].filter(Boolean).join("\n\n");
  if (!pagePath && targetNeedsPage(draft.target)) {
    await sendTelegramMessage(chatId, text, pageChoiceButtons(publisher, draft.target));
    return;
  }
  const draftOnly = draft.target === "news" || draft.target === "document" || Boolean(config.departmentEntryType);
  const buttons: TelegramButton[][] = [[
    { text: draftOnly ? "✅ Зберегти чернетку" : "✅ Опублікувати", callback_data: "ed:commit" },
    { text: "❌ Скасувати", callback_data: "ed:cancel" },
  ]];
  if (targetNeedsPage(draft.target)) buttons.push([{ text: "↪️ Змінити сторінку", callback_data: "ed:change-page" }]);
  await sendTelegramMessage(chatId, text, buttons);
}

async function prepareDraft(input: {
  chatId: string;
  publisher: Publisher;
  bytes: Uint8Array;
  fileName: string;
  mimeType: string;
  instruction: string;
  target?: EditorialDraftTarget;
}) {
  if (input.bytes.byteLength > 12 * 1024 * 1024) throw new Error("Файл для AI-обробки має бути менше 12 МБ");
  const file = toFile(input.bytes, input.fileName, input.mimeType);
  const target = input.target || detectEditorialTarget(file, input.bytes, input.instruction);
  if (!publisherCanUseTarget(input.publisher, target)) throw new Error("Ваш акаунт не має доступу до визначеного розділу сайту");
  const config = targetConfig(target);
  const pagePath = defaultPage(target, input.instruction, input.publisher);
  if (pagePath && !canEditPage(input.publisher, pagePath)) throw new Error("Ваш акаунт не має доступу до вибраної сторінки");
  if (config.departmentEntryType && pagePath && !isDepartmentPagePath(pagePath)) throw new Error("Оберіть сторінку кафедри або факультету");
  const [draft, source] = await Promise.all([
    createEditorialDraft({
      file,
      bytes: input.bytes,
      target,
      instruction: input.instruction,
      editorEmail: input.publisher.email,
    }),
    uploadSource(file, input.bytes, input.publisher),
  ]);
  const pending: PendingDraft = { draft, source, pagePath };
  await setTelegramEditorialState(input.chatId, "review", pending, 120);
  await sendDraftPreview(input.chatId, input.publisher, pending);
}

async function commitPendingDraft(chatId: string, publisher: Publisher) {
  const state = await getTelegramEditorialState<PendingDraft>(chatId);
  if (!state || state.stage !== "review") throw new Error("Чернетка застаріла. Надішліть матеріал ще раз");
  const { draft, source, pagePath } = state.data;
  const config = targetConfig(draft.target);
  if (!publisherCanUseTarget(publisher, draft.target)) throw new Error("Доступ до цього розділу відкликано");
  if (targetNeedsPage(draft.target) && (!pagePath || !canEditPage(publisher, pagePath))) throw new Error("Оберіть дозволену сторінку");
  const records = draft.records.filter((record) => record.fields.some((field) => field.value.trim()));
  if (!records.length) throw new Error("У чернетці немає заповнених записів");
  const ids: string[] = [];
  if (draft.target === "news") {
    const payload = draftRecordToPayload(records[0]);
    const post = await createPost({
      title: payload.title || draft.title,
      excerpt: payload.excerpt || draft.summary,
      body: payload.body || draft.body,
      category: payload.category || "Новини",
      imageUrl: source?.mimeType.startsWith("image/") ? source.url : "",
      imageAlt: payload.title || draft.title,
      status: "draft",
      featured: false,
      publishedAt: null,
    }, publisher.email);
    ids.push(post.id);
  } else if (draft.target === "document") {
    if (!source) throw new Error("Для документа потрібен PDF або Word-файл");
    const payload = draftRecordToPayload(records[0]);
    const document = await createDocument({
      title: payload.title || draft.title,
      description: payload.description || draft.summary,
      category: payload.category || "Офіційний документ",
      pagePath,
      fileUrl: source.url,
      fileName: source.fileName,
      mimeType: source.mimeType,
      fileSize: source.fileSize,
      status: "draft",
      sortOrder: Date.now(),
    }, publisher.email);
    ids.push(document.id);
  } else if (config.departmentEntryType) {
    for (let index = 0; index < records.length; index += 1) {
      const payload = draftRecordToPayload(records[index]);
      const sourceIsImage = Boolean(source?.mimeType.startsWith("image/"));
      const sourceIsDocument = Boolean(source && !sourceIsImage);
      if (config.departmentEntryType === "photo" && !sourceIsImage) throw new Error("Для фотогалереї надішліть фото");
      if (config.departmentEntryType === "material" && !sourceIsDocument) throw new Error("Для матеріалу надішліть PDF або Word-файл");
      if (config.departmentEntryType === "teacher" && !payload.role?.trim()) {
        throw new Error("Для профілю викладача потрібно вказати посаду або роль");
      }
      const entry = await createDepartmentEntry({
        pagePath,
        entryType: config.departmentEntryType,
        title: payload.title || draft.title,
        summary: payload.summary || draft.summary,
        body: payload.body || draft.body,
        imageUrl: sourceIsImage ? source?.url || "" : "",
        imageAlt: payload.imageAlt || payload.title || draft.title,
        fileUrl: sourceIsDocument ? source?.url || "" : "",
        fileName: sourceIsDocument ? source?.fileName || "" : "",
        date: payload.date || "",
        role: config.departmentEntryType === "quality" ? normalizeEducationQualityRubricId(payload.role || "", `${payload.title || draft.title} ${payload.summary || draft.summary}`) : payload.role || "",
        email: payload.email || "",
        profileUrl: payload.profileUrl || "",
        status: "draft",
        sortOrder: Date.now() + index,
      }, publisher.email);
      ids.push(entry.id);
    }
  } else {
    if (!config.contentKind) throw new Error("Для цього розділу не налаштовано збереження");
    for (let index = 0; index < records.length; index += 1) {
      const payload = draftRecordToPayload(records[index]);
      if (source) {
        payload.sourceFileUrl = source.url;
        payload.sourceFileName = source.fileName;
        if (draft.target === "student_thesis" && !payload.fileUrl) payload.fileUrl = source.url;
      }
      const item = await createContentItem({ kind: config.contentKind, payload, sortOrder: Date.now() + index }, publisher.email);
      ids.push(item.id);
    }
  }
  await clearTelegramEditorialState(chatId);
  return { ids, draftOnly: draft.target === "news" || draft.target === "document" || Boolean(config.departmentEntryType), label: config.label };
}

async function listDrafts(publisher: Publisher): Promise<DraftListItem[]> {
  const [posts, documents, department] = await Promise.all([
    canEditPage(publisher, "/news") ? getPosts({ includeDrafts: true, limit: 100 }) : Promise.resolve([]),
    getAllDocuments(),
    getAllDepartmentEntries(),
  ]);
  const items: DraftListItem[] = [
    ...posts.filter((item) => item.status === "draft").map((item) => ({ id: item.id, type: "p" as const, title: item.title, destination: "Новини", updatedAt: item.updatedAt })),
    ...documents.filter((item) => item.status === "draft" && canEditPage(publisher, item.pagePath)).map((item) => ({ id: item.id, type: "d" as const, title: item.title, destination: pageLabel(item.pagePath), updatedAt: item.updatedAt })),
    ...department.filter((item) => item.status === "draft" && canEditPage(publisher, item.pagePath)).map((item) => ({ id: item.id, type: "g" as const, title: item.title, destination: pageLabel(item.pagePath), updatedAt: item.updatedAt })),
  ];
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 8);
}

async function sendDrafts(chatId: string, publisher: Publisher) {
  const drafts = await listDrafts(publisher);
  if (!drafts.length) {
    await sendTelegramMessage(chatId, "Чернеток у доступних вам розділах зараз немає.", [[{ text: "✨ Створити матеріал", callback_data: "ed:menu:new" }]]);
    return;
  }
  await sendTelegramMessage(chatId, `<b>Останні чернетки · ${drafts.length}</b>\nМожна опублікувати або видалити без переходу до панелі.`);
  for (const draft of drafts) {
    await sendTelegramMessage(chatId,
      `<b>${escapeTelegramHtml(draft.title)}</b>\n${escapeTelegramHtml(draft.destination)}`,
      [[
        { text: "✅ Опублікувати", callback_data: `ed:pub:${draft.type}:${draft.id}` },
        { text: "🗑 Видалити", callback_data: `ed:askdel:${draft.type}:${draft.id}` },
      ]],
    );
  }
}

async function loadDraftItem(publisher: Publisher, type: DraftListItem["type"], id: string) {
  if (type === "p") {
    if (!canEditPage(publisher, "/news")) return null;
    return (await getPosts({ includeDrafts: true, limit: 100 })).find((item) => item.id === id) || null;
  }
  if (type === "d") {
    const item = await getDocumentById(id);
    return item && canEditPage(publisher, item.pagePath) ? item : null;
  }
  const item = await getDepartmentEntryById(id);
  return item && canEditPage(publisher, item.pagePath) ? item : null;
}

async function publishDraftItem(publisher: Publisher, type: DraftListItem["type"], id: string) {
  const item = await loadDraftItem(publisher, type, id);
  if (!item) throw new Error("Чернетку не знайдено або доступ відкликано");
  if (type === "p") {
    const post = item as Post;
    return updatePost(post.id, { ...post, status: "published", publishedAt: post.publishedAt || new Date().toISOString() }, publisher.email);
  }
  if (type === "d") {
    const document = item as PageDocument;
    return updateDocument(document.id, { ...document, status: "published" }, publisher.email);
  }
  const entry = item as DepartmentEntry;
  return updateDepartmentEntry(entry.id, { ...entry, status: "published" }, publisher.email);
}

async function removeDraftItem(publisher: Publisher, type: DraftListItem["type"], id: string) {
  const item = await loadDraftItem(publisher, type, id);
  if (!item) throw new Error("Чернетку не знайдено або доступ відкликано");
  if (type === "p") await deletePost(id);
  else if (type === "d") await deleteDocument(id);
  else await deleteDepartmentEntry(id);
}

function parseDraftCallback(data: string, prefix: string) {
  const match = data.match(new RegExp(`^${prefix}:([pdg]):(.+)$`));
  return match ? { type: match[1] as DraftListItem["type"], id: match[2] } : null;
}

async function handleEditorialCallback(callback: TelegramCallbackQuery, publisher: Publisher, siteUrl: string) {
  const data = callback.data || "";
  const chatId = String(callback.message?.chat.id || "");
  if (!chatId) return;
  if (data === "ed:menu") {
    await answerTelegramCallback(callback.id, "Головне меню");
    await sendMenu(chatId, publisher, siteUrl);
  } else if (data.startsWith("scheduler:")) {
    const [, decision, runId] = data.split(":");
    if (!canEditPage(publisher, "/schedule") || !["approve", "reject"].includes(decision)) throw new Error("У вас немає права погоджувати розклад");
    const run = (await getSchedulerItems()).find((item) => item.kind === "run" && item.id === runId);
    if (!run || (run.payload as RunPayload).status !== "pending_approval") throw new Error("Ця чернетка вже опрацьована");
    const updated = await decideScheduleRun(run, decision as "approve" | "reject", "Рішення через редакційний Telegram-бот", publisher.email);
    const payload = updated.payload as RunPayload;
    await answerTelegramCallback(callback.id, payload.status === "approved" ? "Розклад погоджено" : "Розклад відхилено");
    await sendTelegramMessage(chatId, `<b>${payload.status === "approved" ? "Розклад погоджено" : "Розклад відхилено"}</b>\n${escapeTelegramHtml(payload.name)}`);
  } else if (data === "ed:menu:new") {
    await answerTelegramCallback(callback.id, "Надішліть матеріал у чат");
    await sendTelegramMessage(chatId, "Надішліть текст, фото, PDF або Word. У підписі можна вказати, куди розмістити матеріал, наприклад: <code>/programs/marketing</code>.\n\nДля точного типу використовуйте /news, /event, /document, /teacher або /material перед текстом.");
  } else if (data === "ed:menu:drafts") {
    await answerTelegramCallback(callback.id, "Відкриваю чернетки");
    await sendDrafts(chatId, publisher);
  } else if (data === "ed:menu:me") {
    await answerTelegramCallback(callback.id, "Ваш доступ");
    await sendAccess(chatId, publisher);
  } else if (data === "ed:menu:schedule") {
    await answerTelegramCallback(callback.id, "Розклад");
    await sendTelegramMessage(chatId, "Керування розкладом доступне командами /status і /availability.", [[{ text: "Планувальник", url: `${siteUrl}/panel/scheduler` }]]);
  } else if (data === "ed:menu:help") {
    await answerTelegramCallback(callback.id, "Інструкція");
    await sendHelp(chatId, siteUrl);
  } else if (data === "ed:asklogout") {
    await answerTelegramCallback(callback.id, "Потрібне підтвердження");
    await sendTelegramMessage(chatId, "Від’єднати цей Telegram від редакційного акаунта?", [[
      { text: "Так, від’єднати", callback_data: "ed:logout" },
      { text: "Скасувати", callback_data: "ed:cancel" },
    ]]);
  } else if (data === "ed:logout") {
    await deleteTelegramAccountLink(chatId);
    await answerTelegramCallback(callback.id, "Telegram від’єднано");
    await sendTelegramMessage(chatId, "Telegram від’єднано від редакційної панелі. Для нового входу натисніть /start.");
  } else if (data === "ed:cancel") {
    await clearTelegramEditorialState(chatId);
    await answerTelegramCallback(callback.id, "Скасовано");
    await sendTelegramMessage(chatId, "Дію скасовано.", [[{ text: "Головне меню", callback_data: "ed:menu" }]]);
  } else if (data === "ed:change-page") {
    const state = await getTelegramEditorialState<PendingDraft>(chatId);
    if (!state || state.stage !== "review") throw new Error("Чернетка застаріла");
    await answerTelegramCallback(callback.id, "Оберіть сторінку");
    await sendTelegramMessage(chatId, "Оберіть сторінку розміщення:", pageChoiceButtons(publisher, state.data.draft.target));
  } else if (data.startsWith("ed:page:")) {
    const index = Number(data.slice("ed:page:".length));
    const option = editorialAccessOptions[index];
    const state = await getTelegramEditorialState<PendingDraft>(chatId);
    if (!state || state.stage !== "review") throw new Error("Чернетка застаріла");
    const config = targetConfig(state.data.draft.target);
    if (!option || option.value === "*" || !canEditPage(publisher, option.value) || (config.departmentEntryType && option.group !== "department")) {
      throw new Error("Ця сторінка недоступна вашому акаунту");
    }
    const pending = { ...state.data, pagePath: option.value };
    await setTelegramEditorialState(chatId, "review", pending, 120);
    await answerTelegramCallback(callback.id, "Сторінку обрано");
    await sendDraftPreview(chatId, publisher, pending);
  } else if (data === "ed:commit") {
    await answerTelegramCallback(callback.id, "Зберігаю");
    const result = await commitPendingDraft(chatId, publisher);
    await sendTelegramMessage(chatId,
      result.draftOnly
        ? `<b>Готово.</b> ${result.ids.length} ${result.ids.length === 1 ? "чернетку збережено" : "чернеток збережено"} у розділі «${escapeTelegramHtml(result.label)}». Тепер її можна опублікувати через /drafts.`
        : `<b>Опубліковано.</b> ${result.ids.length} ${result.ids.length === 1 ? "запис" : "записів"} у розділі «${escapeTelegramHtml(result.label)}».`,
      [[{ text: "🗂 Відкрити чернетки", callback_data: "ed:menu:drafts" }, { text: "🖥 Панель", url: `${siteUrl}/panel` }]],
    );
  } else {
    const publish = parseDraftCallback(data, "ed:pub");
    const askDelete = parseDraftCallback(data, "ed:askdel");
    const confirmDelete = parseDraftCallback(data, "ed:del");
    if (publish) {
      await publishDraftItem(publisher, publish.type, publish.id);
      await answerTelegramCallback(callback.id, "Опубліковано");
      await sendTelegramMessage(chatId, "✅ Чернетку опубліковано на сайті.");
    } else if (askDelete) {
      await answerTelegramCallback(callback.id, "Потрібне підтвердження");
      await sendTelegramMessage(chatId, "Видалити цю чернетку без можливості відновлення?", [[
        { text: "Так, видалити", callback_data: `ed:del:${askDelete.type}:${askDelete.id}` },
        { text: "Скасувати", callback_data: "ed:cancel" },
      ]]);
    } else if (confirmDelete) {
      await removeDraftItem(publisher, confirmDelete.type, confirmDelete.id);
      await answerTelegramCallback(callback.id, "Видалено");
      await sendTelegramMessage(chatId, "🗑 Чернетку видалено.");
    } else {
      await answerTelegramCallback(callback.id, "Команда вже неактуальна");
    }
  }
}

async function handleIncomingMaterial(message: TelegramMessage, publisher: Publisher) {
  const chatId = String(message.chat.id);
  const instructionRaw = message.caption || message.text || "";
  const command = commandName(instructionRaw);
  const target = commandTargets[command];
  const instruction = target || command === "new" ? commandBody(instructionRaw) : instructionRaw.trim();
  await sendTelegramChatAction(chatId, message.photo?.length ? "upload_photo" : message.document ? "upload_document" : "typing");
  if (message.document) {
    if ((message.document.file_size || 0) > 12 * 1024 * 1024) throw new Error("Файл має бути менше 12 МБ");
    const fileName = message.document.file_name || "telegram-document";
    const mimeType = inferMimeType(fileName, message.document.mime_type);
    const allowed = new Set([
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
    if (!allowed.has(mimeType)) throw new Error("Підтримуються PDF, DOCX, TXT, JPG, PNG і WebP");
    const remote = await getTelegramFile(message.document.file_id);
    if (!remote) throw new Error("Не вдалося завантажити файл із Telegram");
    await prepareDraft({ chatId, publisher, bytes: remote.bytes, fileName, mimeType, instruction, target });
    return;
  }
  if (message.photo?.length) {
    const photo = message.photo.at(-1)!;
    if ((photo.file_size || 0) > 8 * 1024 * 1024) throw new Error("Фото має бути менше 8 МБ");
    const remote = await getTelegramFile(photo.file_id);
    if (!remote) throw new Error("Не вдалося завантажити фото з Telegram");
    await prepareDraft({
      chatId,
      publisher,
      bytes: remote.bytes,
      fileName: `telegram-photo-${message.message_id}.jpg`,
      mimeType: "image/jpeg",
      instruction,
      target,
    });
    return;
  }
  const text = target || command === "new" ? commandBody(message.text || "") : (message.text || "").trim();
  if (!text) throw new Error("Додайте текст після команди або надішліть файл");
  const bytes = new TextEncoder().encode(text);
  await prepareDraft({ chatId, publisher, bytes, fileName: "telegram-message.txt", mimeType: "text/plain", instruction: text, target });
}

async function handleMessage(message: TelegramMessage, publisher: Publisher, siteUrl: string) {
  const chatId = String(message.chat.id);
  const text = (message.text || "").trim();
  const command = commandName(text);
  if (command === "start" || command === "menu") await sendMenu(chatId, publisher, siteUrl);
  else if (command === "help") await sendHelp(chatId, siteUrl);
  else if (command === "me") await sendAccess(chatId, publisher);
  else if (command === "drafts") await sendDrafts(chatId, publisher);
  else if (command === "cancel") {
    await clearTelegramEditorialState(chatId);
    await sendTelegramMessage(chatId, "Поточну дію скасовано.");
  } else if (command === "logout") {
    await sendTelegramMessage(chatId, "Від’єднати цей Telegram від редакційного акаунта?", [[
      { text: "Так, від’єднати", callback_data: "ed:logout" },
      { text: "Скасувати", callback_data: "ed:cancel" },
    ]]);
  } else if (command === "availability") {
    await sendTelegramMessage(chatId, `Вкажіть зручний час у планувальнику:\n${siteUrl}/panel/scheduler`);
  } else if (command === "status") {
    const latest = (await getSchedulerItems()).filter((item) => item.kind === "run").at(-1);
    const payload = latest?.payload as RunPayload | undefined;
    await sendTelegramMessage(chatId, payload
      ? `<b>${escapeTelegramHtml(payload.name)}</b>\nСтатус: ${escapeTelegramHtml(payload.status)}\nЗанять: ${payload.scheduledCount} · конфліктів: ${payload.conflictCount}`
      : `Чернеток розкладу поки немає.\n${siteUrl}/panel/scheduler`);
  } else if (command === "login") {
    await sendTelegramMessage(chatId, "Цей Telegram уже підключений до редакційного акаунта.", [[{ text: "Головне меню", callback_data: "ed:menu" }]]);
  } else if (command === "new" && !commandBody(text) && !message.document && !message.photo?.length) {
    await sendTelegramMessage(chatId, "Надішліть наступним повідомленням текст, фото, PDF або Word — AI підготує чернетку.");
  } else {
    await handleIncomingMaterial(message, publisher);
  }
}

export async function handleEditorialTelegramUpdate(update: TelegramEditorialUpdate, siteUrl: string) {
  const fresh = await reserveTelegramUpdate(update.update_id);
  if (!fresh) return;
  try {
    const message = update.message;
    const callback = update.callback_query;
    const chatId = String(message?.chat.id || callback?.message?.chat.id || "");
    const chatType = message?.chat.type || callback?.message?.chat.type;
    const user = message?.from || callback?.from;
    if (!chatId || !user) return;
    if (chatType && chatType !== "private") {
      await sendTelegramMessage(chatId, "З міркувань безпеки редакційний бот працює лише в особистому чаті. Відкрийте профіль бота й натисніть Start.");
      return;
    }
    const publisher = await linkedPublisher(chatId);
    if (!publisher) {
      if (callback) await answerTelegramCallback(callback.id, "Спочатку підключіть редакційний акаунт");
      await sendLogin(chatId, user, siteUrl);
      return;
    }
    try {
      if (callback?.data) await handleEditorialCallback(callback, publisher, siteUrl);
      else if (message) await handleMessage(message, publisher, siteUrl);
    } catch (error) {
      if (callback) await answerTelegramCallback(callback.id, "Не вдалося виконати дію");
      await sendTelegramMessage(chatId, `⚠️ ${escapeTelegramHtml(error instanceof Error ? error.message : "Не вдалося виконати дію")}`);
    }
  } finally {
    await finishTelegramUpdate(update.update_id);
  }
}
