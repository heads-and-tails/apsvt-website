import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const [, , inputPath, outputPath = "lib/admissions-rag-index.json"] = process.argv;
if (!inputPath) {
  throw new Error("Usage: node scripts/build-admissions-rag-index.mjs <ocr.ndjson> [output.json]");
}

const documents = {
  "01-pravyla-pryiomu-apsvt-2026.pdf": "Правила прийому на навчання до АПСВТ у 2026 році",
  "02-polozhennia-pro-pryimalnu-komisiiu.pdf": "Положення про Приймальну комісію АПСВТ",
  "03-polozhennia-pro-komisii-vstupnykh-vyprobuvan.pdf": "Положення про комісії для проведення вступних випробувань",
  "04-poriadok-dii-pk-v-umovakh-zahroz.pdf": "Дії Приймальної комісії в умовах загроз",
  "05-poriadok-inkliuzyvnosti-vstupnoi-kampanii.pdf": "Забезпечення інклюзивності вступної кампанії",
  "06-poriadok-zberihannia-robit-vstupnykiv.pdf": "Зберігання робіт вступників",
  "07-poriadok-pryiomu-inozemtsiv.pdf": "Організація прийому іноземців до АПСВТ",
  "08-poriadok-provedennia-vstupnykh-vyprobuvan.pdf": "Проведення вступних випробувань в АПСВТ",
  "09-poriadok-akredytatsii-media.pdf": "Акредитація представників суб’єктів медіа",
  "10-poriadok-podannia-apeliatsii.pdf": "Подання і розгляд апеляцій",
  "11-dodatok-8.pdf": "Додаток 8 — дистанційні вступні випробування",
};

function cleanOCR(text) {
  return text
    .replace(/\u00ad/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const lines = (await readFile(inputPath, "utf8")).split("\n").filter(Boolean);
const pages = lines.map((line) => {
  const record = JSON.parse(line);
  const file = basename(record.file);
  if (!documents[file]) throw new Error(`Unknown admission document: ${file}`);
  return {
    id: `${file.replace(/\.pdf$/i, "")}-p${record.page}`,
    file,
    title: documents[file],
    page: Number(record.page),
    href: `/documents/admissions/${file}#page=${record.page}`,
    text: cleanOCR(record.text),
  };
}).sort((left, right) => left.file.localeCompare(right.file) || left.page - right.page);

await writeFile(outputPath, `${JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), pages }, null, 2)}\n`);
console.log(`Indexed ${pages.length} pages from ${new Set(pages.map((page) => page.file)).size} documents.`);
