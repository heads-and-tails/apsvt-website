import { readFile as readLocalFile, readdir as readLocalDirectory } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));
const manifest = JSON.parse(await readLocalFile(new URL("../lib/hosted-documents.json", import.meta.url), "utf8"));
const files = new Map(manifest.map((file) => [file.path.slice(7), file]));
const downloads = new Map();

function relativePath(path) {
  const name = path instanceof URL ? fileURLToPath(path) : String(path);
  return name.startsWith(publicRoot) ? name.slice(publicRoot.length) : null;
}

// Preserve content/hash regressions for originals that now live in shared storage.
export async function readFile(path, options) {
  const file = files.get(relativePath(path));
  if (!file) return readLocalFile(path, options);
  if (!downloads.has(file.url)) {
    downloads.set(file.url, (async () => {
      const response = await fetch(file.url, { signal: AbortSignal.timeout(60_000) });
      if (!response.ok) throw new Error(`Document download failed: ${file.path} (${response.status})`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length !== file.bytes || createHash("sha256").update(bytes).digest("hex") !== file.sha256) {
        throw new Error(`Published document differs from the original: ${file.path}`);
      }
      return bytes;
    })());
  }
  const bytes = await downloads.get(file.url);
  const encoding = typeof options === "string" ? options : options?.encoding;
  return encoding ? bytes.toString(encoding) : bytes;
}

export async function readdir(path, options) {
  const prefix = relativePath(path)?.replace(/\/?$/, "/");
  if (!prefix?.startsWith("documents/")) return readLocalDirectory(path, options);
  const children = [...files.keys()].filter((name) => name.startsWith(prefix))
    .map((name) => name.slice(prefix.length).split("/")[0]);
  if (!children.length) return readLocalDirectory(path, options);
  return [...new Set(children)].sort();
}
