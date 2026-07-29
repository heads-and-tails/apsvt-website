import { strFromU8, unzipSync } from "fflate";
import {
  draftTargetConfigs,
  payloadToDraftRecord,
  type EditorialAiDraft,
  type EditorialDraftTarget,
} from "@/lib/editorial-drafts";

const MAX_EXTRACTED_TEXT = 90_000;

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function textFromDocx(bytes: Uint8Array): string {
  const archive = unzipSync(bytes);
  const document = archive["word/document.xml"];
  if (!document) throw new Error("DOCX_TEXT_NOT_FOUND");
  const xml = strFromU8(document)
    .replace(/<w:(?:tab|br)\b[^>]*\/>/g, " ")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<\/w:tr>/g, "\n");
  return [...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|(\n)/g)]
    .map((match) => match[1] ? decodeXml(match[1]) : "\n")
    .join("")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_EXTRACTED_TEXT);
}

export function extractEditorialFileText(file: File, bytes: Uint8Array): string {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "docx") return textFromDocx(bytes);
  if (extension === "txt" || file.type.startsWith("text/")) {
    return new TextDecoder("utf-8").decode(bytes).slice(0, MAX_EXTRACTED_TEXT);
  }
  return "";
}

function fallbackDraft(target: EditorialDraftTarget, fileName: string, text: string): EditorialAiDraft {
  const config = draftTargetConfigs.find((entry) => entry.id === target)!;
  const cleanTitle = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  const paragraphs = text.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  const first = paragraphs[0] || cleanTitle;
  const second = paragraphs.slice(1, 3).join(" ").slice(0, 420);
  const defaults: Record<string, string> = {};
  for (const field of config.fields) defaults[field.key] = "";
  if ("title" in defaults) defaults.title = first.slice(0, 180);
  if ("description" in defaults) defaults.description = second || first;
  if ("excerpt" in defaults) defaults.excerpt = second || first;
  if ("body" in defaults) defaults.body = text.slice(0, 20_000);
  if ("category" in defaults) defaults.category = target === "news" ? "Новини" : "Офіційний документ";
  if ("status" in defaults) defaults.status = target === "vacancy" ? "Незабаром" : "";
  if ("count" in defaults) defaults.count = "1";
  const generatedRecords = target === "vacancy" ? vacancyRecordsFromText(text, config.fields) : [];
  return {
    target,
    title: first.slice(0, 180),
    summary: second || "Текст розпізнано з файла. Перевірте поля перед публікацією.",
    body: text.slice(0, 20_000),
    records: generatedRecords.length ? generatedRecords : [payloadToDraftRecord(defaults, config.fields)],
    warnings: ["AI ще не активовано на сервері. Створено базовий чернетковий варіант із тексту файла — перевірте й відредагуйте його."],
    sourceFileName: fileName,
    usedAi: false,
  };
}

function vacancyRecordsFromText(
  text: string,
  fields: (typeof draftTargetConfigs)[number]["fields"],
) {
  const lines = text.split(/\n+/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const deadlineMatch = text.match(/(?:до|не пізніше)\s+(\d{1,2})[./](\d{1,2})[./](\d{4})/i);
  const deadline = deadlineMatch
    ? `${deadlineMatch[3]}-${deadlineMatch[2].padStart(2, "0")}-${deadlineMatch[1].padStart(2, "0")}`
    : "";
  let faculty = "";
  let department = "";
  const records: ReturnType<typeof payloadToDraftRecord>[] = [];
  const rolePattern = /(завідувач(?:ка)?\s+кафедри|професор|доцент|старший\s+викладач|викладач)/gi;
  for (const line of lines) {
    if (/факультет/i.test(line) && !/кафедр/i.test(line) && line.length < 220) {
      faculty = line.replace(/^[\d\s.:–—-]+/, "").trim();
    }
    if (/(?:^|[\s:])кафедр[аи]\s+/i.test(line) && !/завідувач/i.test(line) && line.length < 260) {
      department = line.replace(/^[\d\s.:–—-]+/, "").trim();
    }
    const matches = [...line.matchAll(rolePattern)];
    for (const match of matches) {
      const after = line.slice((match.index || 0) + match[0].length);
      const count = after.match(/(?:[-–—:]\s*)?(\d+)\s*(?:штат|посад|одиниц|ваканс)?/i)?.[1] || "1";
      const payload = {
        faculty,
        department,
        title: match[0].replace(/\s+/g, " ").replace(/^./, (letter) => letter.toUpperCase()),
        count,
        deadline,
        status: deadline && new Date(`${deadline}T23:59:59Z`).getTime() < Date.now() ? "Архів" : "Відкрито",
        note: "",
      };
      records.push(payloadToDraftRecord(payload, fields));
    }
  }
  return records.filter((record, index, all) => {
    const payload = Object.fromEntries(record.fields.map((field) => [field.key, field.value]));
    return all.findIndex((candidate) => {
      const compare = Object.fromEntries(candidate.fields.map((field) => [field.key, field.value]));
      return compare.faculty === payload.faculty
        && compare.department === payload.department
        && compare.title === payload.title;
    }) === index;
  });
}

type OpenAiResponse = {
  output?: { type?: string; content?: { type?: string; text?: string }[] }[];
  error?: { message?: string };
};

function outputText(response: OpenAiResponse): string {
  return response.output
    ?.flatMap((item) => item.content || [])
    .find((item) => item.type === "output_text")
    ?.text || "";
}

function normalizeDraft(
  value: unknown,
  target: EditorialDraftTarget,
  fileName: string,
): EditorialAiDraft {
  const config = draftTargetConfigs.find((entry) => entry.id === target)!;
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const records = Array.isArray(raw.records) ? raw.records.slice(0, 60) : [];
  const normalizedRecords = records.map((record) => {
    const rawFields = record && typeof record === "object" && Array.isArray((record as Record<string, unknown>).fields)
      ? (record as { fields: unknown[] }).fields
      : [];
    const values = new Map<string, string>();
    for (const field of rawFields) {
      if (!field || typeof field !== "object") continue;
      const item = field as Record<string, unknown>;
      if (typeof item.key === "string" && typeof item.value === "string") values.set(item.key, item.value.trim());
    }
    return {
      fields: config.fields.map((field) => ({ key: field.key, value: values.get(field.key) || "" })),
    };
  });
  return {
    target,
    title: typeof raw.title === "string" ? raw.title.trim() : fileName,
    summary: typeof raw.summary === "string" ? raw.summary.trim() : "",
    body: typeof raw.body === "string" ? raw.body.trim() : "",
    records: normalizedRecords.length ? normalizedRecords : [payloadToDraftRecord({}, config.fields)],
    warnings: Array.isArray(raw.warnings)
      ? raw.warnings.filter((item): item is string => typeof item === "string").slice(0, 12)
      : [],
    sourceFileName: fileName,
    usedAi: true,
  };
}

export async function createEditorialDraft(input: {
  file: File;
  bytes: Uint8Array;
  target: EditorialDraftTarget;
  instruction: string;
  editorEmail: string;
}): Promise<EditorialAiDraft> {
  const config = draftTargetConfigs.find((entry) => entry.id === input.target);
  if (!config) throw new Error("UNKNOWN_TARGET");
  const extractedText = extractEditorialFileText(input.file, input.bytes);
  const directApiKey = process.env.OPENAI_API_KEY;
  const gatewayApiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  const apiKey = directApiKey || gatewayApiKey;
  if (!apiKey) return fallbackDraft(input.target, input.file.name, extractedText);
  const apiUrl = directApiKey
    ? "https://api.openai.com/v1/responses"
    : "https://ai-gateway.vercel.sh/v1/responses";
  const model = directApiKey
    ? process.env.OPENAI_EDITORIAL_MODEL || "gpt-5.6-sol"
    : process.env.AI_GATEWAY_EDITORIAL_MODEL || "openai/gpt-5.6-sol";

  const allowedFields = config.fields.map((field) => `${field.key} (${field.label})`).join(", ");
  const instructions = [
    "You are the editorial assistant for the official Ukrainian website of АПСВТ.",
    "Transform the supplied source into a clear, factual, publication-ready Ukrainian draft that matches an academic institution.",
    "Preserve names, dates, quantities, contacts and official wording. Never invent missing facts.",
    "Remove duplicated text, broken line wraps, boilerplate and filename noise.",
    `Destination: ${config.label}. Required record fields: ${allowedFields}.`,
    "If the source contains several separate entries, return a separate record for each one.",
    "Use ISO YYYY-MM-DD for date fields when the exact date is known.",
    "Put every uncertainty or missing essential fact in warnings.",
    "This is a draft for human approval. Do not claim that anything has been published.",
    input.instruction ? `Editor's placement note: ${input.instruction}` : "",
  ].filter(Boolean).join("\n");

  const content: Record<string, unknown>[] = [
    {
      type: "input_text",
      text: extractedText
        ? `Source file: ${input.file.name}\n\nExtracted text:\n${extractedText}`
        : `Source file: ${input.file.name}. Read the attached file and prepare the draft.`,
    },
  ];
  if (!extractedText && input.file.type === "application/pdf") {
    content.push({
      type: "input_file",
      filename: input.file.name,
      file_data: `data:application/pdf;base64,${Buffer.from(input.bytes).toString("base64")}`,
      detail: "auto",
    });
  } else if (!extractedText && input.file.type.startsWith("image/")) {
    content.push({
      type: "input_image",
      image_url: `data:${input.file.type};base64,${Buffer.from(input.bytes).toString("base64")}`,
      detail: "high",
    });
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      reasoning: { effort: "medium" },
      store: false,
      instructions,
      input: [{ role: "user", content }],
      max_output_tokens: 6000,
      text: {
        format: {
          type: "json_schema",
          name: "editorial_website_draft",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              body: { type: "string" },
              records: {
                type: "array",
                maxItems: 60,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    fields: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: { key: { type: "string" }, value: { type: "string" } },
                        required: ["key", "value"],
                      },
                    },
                  },
                  required: ["fields"],
                },
              },
              warnings: { type: "array", items: { type: "string" } },
            },
            required: ["title", "summary", "body", "records", "warnings"],
          },
        },
      },
      safety_identifier: await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.editorEmail))
        .then((hash) => Buffer.from(hash).toString("hex").slice(0, 32)),
    }),
  });
  const result = await response.json() as OpenAiResponse;
  if (!response.ok) throw new Error(result.error?.message || "OPENAI_REQUEST_FAILED");
  const text = outputText(result);
  if (!text) throw new Error("OPENAI_EMPTY_RESPONSE");
  return normalizeDraft(JSON.parse(text), input.target, input.file.name);
}
