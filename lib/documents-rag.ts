import index from "./documents-rag-index.json";

type IndexedPassage = {
  id: string;
  file: string;
  documentId?: string;
  category: string;
  title: string;
  page: number | null;
  href: string;
  text: string;
};

export type AdditionalDocumentsRagSource = Pick<IndexedPassage, "id" | "title" | "href" | "text">;

export type DocumentsRagSource = {
  id: string;
  title: string;
  page: number | null;
  href: string;
  excerpt: string;
};

export type DocumentsRagAnswer = {
  status: "found" | "not_found";
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: DocumentsRagSource[];
};

const stopWords = new Set([
  "аби", "або", "але", "без", "був", "була", "були", "бути", "вам", "вас", "вже", "вона",
  "вони", "воно", "все", "для", "його", "йому", "коли", "мене", "мені", "можна", "навіщо",
  "потрібно", "про", "при", "таке", "також", "такий", "треба", "цей", "через", "чого", "щодо",
  "яка", "яке", "який", "які", "якщо", "where", "what", "when", "which", "with", "from", "that",
]);

const topicHints = [
  { terms: ["апеляц"], titles: ["апеляц"] },
  { terms: ["інозем", "invitation"], titles: ["інозем"] },
  { terms: ["вартіст", "оплат", "догов", "tuition"], titles: ["вартість", "договір"] },
  { terms: ["ліценз", "акредитац"], titles: ["ліцензі", "сертифікат"] },
  { terms: ["плагіат", "доброчес"], titles: ["плагіат", "етики"] },
  { terms: ["булінг", "мобінг", "харасмент"], titles: ["булінг"] },
  { terms: ["корупц", "хабар"], titles: ["корупц", "розслідування"] },
  { terms: ["відрах", "поновл", "перевед", "відпуст"], titles: ["відрахування"] },
  { terms: ["індивідуальн", "траєктор"], titles: ["індивідуальний"] },
  { terms: ["стипенді"], titles: ["стипенді"] },
  { terms: ["самоврядуван"], titles: ["самоврядування"] },
  { terms: ["оцінюван", "іспит", "екзамен"], titles: ["освітнього процесу", "випробувань"] },
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
  return normalize(value).split(" ").filter((token) => token.length >= 3 && !stopWords.has(token));
}

function tokenKey(token: string) {
  const root = [
    "академіч", "апеля", "булінг", "відрах", "дистанц", "догов", "доброчес", "зберіган",
    "загроз", "індивіду", "інклюз", "інозем", "комісі", "корупц", "ліценз", "мобінг",
    "оплат", "перевед", "плагіат", "поновл", "самовряду", "стипенді", "строк", "термін",
    "харасмент", "вартіст", "випробув", "оцінюван",
  ].find((candidate) => token.startsWith(candidate));
  if (root) return root;
  if (token.length >= 9) return token.slice(0, 7);
  if (token.length >= 7) return token.slice(0, 6);
  return token;
}

function preparePassage(passage: IndexedPassage) {
  const frequency = new Map<string, number>();
  for (const token of tokens(`${passage.title} ${passage.text}`)) {
    const key = tokenKey(token);
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  }
  return {
    ...passage,
    normalizedTitle: normalize(passage.title),
    normalizedText: normalize(passage.text),
    frequency,
  };
}

const passages = (index.pages as IndexedPassage[]).map(preparePassage);

function excerptFor(passage: IndexedPassage, queryKeys: string[]) {
  const lower = passage.text.toLocaleLowerCase("uk-UA");
  let hit = 0;
  let hitScore = -1;
  for (const key of queryKeys) {
    let position = lower.indexOf(key);
    while (position >= 0) {
      const window = lower.slice(Math.max(0, position - 180), position + 540);
      const score = queryKeys.reduce((sum, queryKey) => sum + (window.includes(queryKey) ? 1 : 0), 0);
      if (score > hitScore) {
        hit = position;
        hitScore = score;
      }
      position = lower.indexOf(key, position + key.length);
    }
  }
  let start = Math.max(0, hit - 120);
  let end = Math.min(passage.text.length, hit + 520);
  const previousSentence = passage.text.lastIndexOf(".", start);
  if (previousSentence >= Math.max(0, start - 130)) start = previousSentence + 1;
  const nextSentence = passage.text.indexOf(".", end);
  if (nextSentence >= 0 && nextSentence <= end + 180) end = nextSentence + 1;
  const excerpt = passage.text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${excerpt}${end < passage.text.length ? "…" : ""}`;
}

export function answerDocumentsQuestion(
  rawQuestion: string,
  additionalSources: AdditionalDocumentsRagSource[] = [],
): DocumentsRagAnswer {
  const question = rawQuestion.trim().slice(0, 600);
  const normalizedQuestion = normalize(question);
  const queryKeys = [...new Set(tokens(question).map(tokenKey))];
  if (question.length < 3 || queryKeys.length === 0) {
    return {
      status: "not_found",
      answer: "Уточніть тему: наприклад, оцінювання, апеляція, переведення, плагіат, ліцензія, оплата або вступ.",
      confidence: "low",
      sources: [],
    };
  }

  const titleHints = topicHints
    .filter((hint) => hint.terms.some((term) => normalizedQuestion.includes(term)))
    .flatMap((hint) => hint.titles);

  const searchablePassages = [
    ...passages,
    ...additionalSources.map((source) => preparePassage({
      ...source,
      file: source.id,
      documentId: source.id,
      category: "departments",
      page: null,
    })),
  ];

  const scored = searchablePassages.map((passage) => {
    let score = 0;
    let coverage = 0;
    for (const key of queryKeys) {
      const frequency = passage.frequency.get(key) ?? 0;
      if (frequency > 0) {
        coverage += 1;
        score += 2.4 + Math.log1p(frequency);
        if (passage.normalizedTitle.includes(key)) score += 4.5;
      }
    }
    if (titleHints.some((hint) => passage.normalizedTitle.includes(hint))) score += 10;
    if (passage.normalizedText.includes(normalizedQuestion)) score += 8;
    score *= 0.65 + (coverage / queryKeys.length) * 0.75;
    return { passage, score, coverage };
  }).filter((result) => result.coverage > 0 || result.score >= 8)
    .sort((left, right) => right.score - left.score);

  const best = scored[0];
  if (!best || best.score < 2.6) {
    return {
      status: "not_found",
      answer: "У відібраних офіційних документах не знайдено достатнього підтвердження. Спробуйте назвати процедуру або документ точніше.",
      confidence: "low",
      sources: [],
    };
  }

  const selected: typeof scored = [];
  const seenDocuments = new Set<string>();
  for (const result of scored) {
    const documentKey = result.passage.documentId || result.passage.file;
    if (seenDocuments.has(documentKey) || result.score < Math.max(2.6, best.score * 0.38)) continue;
    selected.push(result);
    seenDocuments.add(documentKey);
    if (selected.length === 4) break;
  }

  const sources = selected.map(({ passage }) => ({
    id: passage.id,
    title: passage.title,
    page: passage.page,
    href: passage.href,
    excerpt: excerptFor(passage, queryKeys),
  }));
  const coverage = best.coverage / queryKeys.length;
  const confidence = best.score >= 14 && coverage >= 0.5
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
