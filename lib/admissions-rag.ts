import index from "./admissions-rag-index.json";

type IndexedPage = {
  id: string;
  file: string;
  title: string;
  page: number;
  href: string;
  text: string;
};

export type ApplicantRagSource = {
  id: string;
  title: string;
  page: number;
  href: string;
  excerpt: string;
};

export type ApplicantRagAnswer = {
  status: "found" | "not_found";
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: ApplicantRagSource[];
};

const stopWords = new Set([
  "аби", "або", "але", "без", "був", "була", "були", "бути", "вам", "вас", "вже", "вона",
  "вони", "воно", "все", "для", "його", "йому", "коли", "мене", "мені", "можна", "навіщо",
  "потрібно", "про", "при", "таке", "також", "такий", "треба", "цей", "через", "чого", "щодо",
  "яка", "яке", "який", "які", "якщо",
]);

const topicDocuments: Array<{ terms: string[]; file: string }> = [
  { terms: ["апеляц"], file: "10-poriadok-podannia-apeliatsii.pdf" },
  { terms: ["інозем"], file: "07-poriadok-pryiomu-inozemtsiv.pdf" },
  { terms: ["інклюз", "особлив"], file: "05-poriadok-inkliuzyvnosti-vstupnoi-kampanii.pdf" },
  { terms: ["зберіган", "збережен"], file: "06-poriadok-zberihannia-robit-vstupnykiv.pdf" },
  { terms: ["медіа", "журналіст"], file: "09-poriadok-akredytatsii-media.pdf" },
  { terms: ["загроз", "тривог", "воєн"], file: "04-poriadok-dii-pk-v-umovakh-zahroz.pdf" },
  { terms: ["дистанц", "онлайн"], file: "11-dodatok-8.pdf" },
  { terms: ["випробув", "іспит"], file: "08-poriadok-provedennia-vstupnykh-vyprobuvan.pdf" },
  { terms: ["комісі"], file: "02-polozhennia-pro-pryimalnu-komisiiu.pdf" },
];

function normalize(value: string) {
  return value
    .toLocaleLowerCase("uk-UA")
    .replace(/[’'`ʼ]/g, "")
    .replace(/[^а-яіїєґa-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length >= 3 && !stopWords.has(token));
}

function tokenKey(token: string) {
  const knownRoot = [
    "апеля", "дистанц", "зберіган", "загроз", "інклюз", "інозем", "комісі",
    "особлив", "пізн", "пода", "строк", "термін", "випробув",
  ].find((root) => token.startsWith(root));
  if (knownRoot) return knownRoot;
  if (token.length >= 8) return token.slice(0, 6);
  if (token.length >= 6) return token.slice(0, 5);
  return token;
}

const pages = (index.pages as IndexedPage[]).map((page) => {
  const pageTokens = tokens(`${page.title} ${page.text}`);
  const frequency = new Map<string, number>();
  for (const token of pageTokens) {
    const key = tokenKey(token);
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  }
  return { ...page, normalizedTitle: normalize(page.title), normalizedText: normalize(page.text), frequency };
});

function excerptFor(page: IndexedPage & { normalizedText: string }, queryKeys: string[]) {
  const lower = page.text.toLocaleLowerCase("uk-UA");
  const positions = queryKeys.flatMap((key) => {
    const matches: number[] = [];
    let position = lower.indexOf(key);
    while (position >= 0 && matches.length < 30) {
      matches.push(position);
      position = lower.indexOf(key, position + key.length);
    }
    return matches;
  });
  const hit = positions.reduce((best, position) => {
    const window = lower.slice(Math.max(0, position - 220), position + 520);
    const score = queryKeys.reduce((sum, key) => sum + (window.includes(key) ? 1 : 0), 0);
    return score > best.score ? { position, score } : best;
  }, { position: 0, score: -1 }).position;
  let start = Math.max(0, hit - 140);
  let end = Math.min(page.text.length, hit + 430);
  const before = page.text.lastIndexOf(".", start);
  if (before >= Math.max(0, start - 120)) start = before + 1;
  const after = page.text.indexOf(".", end);
  if (after >= 0 && after <= end + 150) end = after + 1;
  const excerpt = page.text.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${excerpt}${end < page.text.length ? "…" : ""}`;
}

export function answerApplicantQuestion(rawQuestion: string): ApplicantRagAnswer {
  const question = rawQuestion.trim().slice(0, 600);
  const queryTokens = [...new Set(tokens(question))];
  const queryKeys = [...new Set([
    ...queryTokens.map(tokenKey),
    ...(normalize(question).includes("коли") ? ["строк", "термін", "пізн", "дата"] : []),
  ])];
  if (question.length < 3 || queryKeys.length === 0) {
    return {
      status: "not_found",
      answer: "Уточніть запитання: наприклад, про строки, апеляцію, вступні випробування, інклюзивність або вступ іноземців.",
      confidence: "low",
      sources: [],
    };
  }

  const topicFiles = new Set(
    topicDocuments
      .filter((topic) => topic.terms.some((term) => normalize(question).includes(term)))
      .map((topic) => topic.file),
  );

  const scored = pages.map((page) => {
    let score = 0;
    let coverage = 0;
    for (const key of queryKeys) {
      const frequency = page.frequency.get(key) ?? 0;
      if (frequency > 0) {
        coverage += 1;
        score += 2.2 + Math.log1p(frequency);
        if (page.normalizedTitle.includes(key)) score += 3.5;
      }
    }
    if (topicFiles.has(page.file)) score += 9;
    if (page.normalizedText.includes(normalize(question))) score += 8;
    score *= 0.65 + (coverage / queryKeys.length) * 0.7;
    return { page, score, coverage };
  }).filter((result) => result.coverage > 0 || topicFiles.has(result.page.file))
    .sort((left, right) => right.score - left.score || left.page.page - right.page.page);

  const best = scored[0];
  if (!best || best.score < 2.2) {
    return {
      status: "not_found",
      answer: "У завантажених нормативних документах не знайдено достатнього підтвердження. Сформулюйте запитання точніше або зверніться до Приймальної комісії.",
      confidence: "low",
      sources: [],
    };
  }

  const selected: typeof scored = [];
  const seenPages = new Set<string>();
  for (const result of scored) {
    const key = `${result.page.file}:${result.page.page}`;
    if (seenPages.has(key) || result.score < Math.max(2.2, best.score * 0.42)) continue;
    selected.push(result);
    seenPages.add(key);
    if (selected.length === 4) break;
  }

  const sources = selected.map(({ page }) => ({
    id: page.id,
    title: page.title,
    page: page.page,
    href: page.href,
    excerpt: excerptFor(page, queryKeys),
  }));
  const coverageRatio = best.coverage / queryKeys.length;
  const confidence = best.score >= 14 && coverageRatio >= 0.5
    ? "high"
    : best.score >= 7
      ? "medium"
      : "low";

  return {
    status: "found",
    answer: sources[0].excerpt,
    confidence,
    sources,
  };
}
