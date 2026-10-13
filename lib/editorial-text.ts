export type EditorialTextMark = { type: string; attrs?: { href?: string } };
export type EditorialTextNode = {
  type: string;
  text?: string;
  attrs?: { level?: number; start?: number };
  marks?: EditorialTextMark[];
  content?: EditorialTextNode[];
};
export type EditorialTextDocument = EditorialTextNode & { type: "doc" };

const marker = "<!-- APSVT_RICH_TEXT_V1 -->\n";
const nodeTypes = new Set(["doc", "paragraph", "heading", "text", "bulletList", "orderedList", "listItem", "hardBreak", "blockquote", "codeBlock", "horizontalRule"]);
const markTypes = new Set(["bold", "italic", "underline", "strike", "code", "link"]);

export function editorialLink(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const href = value.trim();
  if (!/^(?:https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href)) return null;
  try {
    const url = new URL(href, "https://www.socosvita.kiev.ua");
    if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol) || url.username || url.password) return null;
    return href;
  } catch { return null; }
}

function normalizeNode(value: unknown, depth = 0): EditorialTextNode | null {
  if (!value || typeof value !== "object" || depth > 20) return null;
  const input = value as Record<string, unknown>;
  if (typeof input.type !== "string" || !nodeTypes.has(input.type)) return null;
  const node: EditorialTextNode = { type: input.type };
  if (node.type === "text") {
    if (typeof input.text !== "string") return null;
    node.text = input.text;
  }
  const attrs = input.attrs as Record<string, unknown> | undefined;
  if (node.type === "heading") node.attrs = { level: Math.max(2, Math.min(6, typeof attrs?.level === "number" && Number.isFinite(attrs.level) ? Math.floor(attrs.level) : 2)) };
  if (node.type === "orderedList") node.attrs = { start: typeof attrs?.start === "number" && Number.isFinite(attrs.start) ? Math.max(1, Math.floor(attrs.start)) : 1 };
  if (Array.isArray(input.marks)) {
    node.marks = input.marks.flatMap((value): EditorialTextMark[] => {
      if (!value || typeof value !== "object" || !markTypes.has(value.type)) return [];
      if (value.type !== "link") return [{ type: value.type }];
      const href = editorialLink(value.attrs?.href);
      return href ? [{ type: "link", attrs: { href } }] : [];
    });
  }
  if (Array.isArray(input.content)) node.content = input.content.slice(0, 10000).flatMap((value) => {
    const child = normalizeNode(value, depth + 1);
    return child ? [child] : [];
  });
  return node;
}

function inlineText(text: string): EditorialTextNode[] {
  const pattern = /\[([^\]\n]+)\]\(([^\s]+)\)|\*\*([^*\n]+)\*\*|https?:\/\/[^\s<>]+/g;
  const nodes: EditorialTextNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index!;
    if (index > cursor) nodes.push({ type: "text", text: text.slice(cursor, index) });
    if (match[3]) nodes.push({ type: "text", text: match[3], marks: [{ type: "bold" }] });
    else {
      const raw = match[2] || match[0];
      let url = match[2] ? raw : raw.replace(/[.,;:!?]+$/, "");
      while (!match[2] && url.endsWith(")") && (url.match(/\)/g)?.length || 0) > (url.match(/\(/g)?.length || 0)) url = url.slice(0, -1);
      const href = editorialLink(url);
      nodes.push({ type: "text", text: href ? match[1] || url : match[0], ...(href ? { marks: [{ type: "link", attrs: { href } }] } : {}) });
      if (href && !match[2] && raw.length > url.length) nodes.push({ type: "text", text: raw.slice(url.length) });
    }
    cursor = index + match[0].length;
  }
  if (cursor < text.length) nodes.push({ type: "text", text: text.slice(cursor) });
  return nodes;
}

function plainDocument(text: string): EditorialTextDocument {
  const content: EditorialTextNode[] = [];
  let paragraph: string[] = [];
  let list: EditorialTextNode | null = null;
  const flush = () => {
    if (paragraph.length) content.push({ type: "paragraph", content: paragraph.flatMap((line, index) => [...(index ? [{ type: "hardBreak" }] : []), ...inlineText(line)]) });
    if (list) content.push(list);
    paragraph = []; list = null;
  };
  for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
    const heading = line.match(/^\s*(#{1,6})\s+(.+)$/);
    const bullet = line.match(/^\s*(?:([-•–\uF02D\uF0B7\uF0A7])|(\d+)[.)])\s+(.+)$/);
    if (!line.trim() || heading) {
      flush();
      if (heading) content.push({ type: "heading", attrs: { level: Math.max(2, heading[1].length) }, content: inlineText(heading[2]) });
    } else if (bullet) {
      if (paragraph.length) flush();
      const type = bullet[1] ? "bulletList" : "orderedList";
      if (list && list.type !== type) flush();
      list ??= { type, ...(type === "orderedList" ? { attrs: { start: Number(bullet[2]) } } : {}), content: [] };
      list.content!.push({ type: "listItem", content: [{ type: "paragraph", content: inlineText(bullet[3]) }] });
    } else {
      if (list || paragraph.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return { type: "doc", content };
}

export function editorialTextDocument(text: string): EditorialTextDocument {
  if (!text.startsWith(marker)) return plainDocument(text);
  try {
    const doc = normalizeNode(JSON.parse(text.slice(marker.length)));
    if (doc?.type === "doc") return doc as EditorialTextDocument;
  } catch { /* Corrupt encoded data must not appear as technical JSON on a page. */ }
  return { type: "doc", content: [] };
}

export function encodeEditorialText(value: unknown): string {
  const doc = normalizeNode(value);
  return doc?.type === "doc" && doc.content?.some((node) => node.type !== "paragraph" || node.content?.length)
    ? marker + JSON.stringify(doc) : "";
}

export function editorialTextIsValid(value: string): boolean {
  if (!value.startsWith(marker)) return true;
  const inline = new Set(["text", "hardBreak"]);
  const blocks = new Set(["paragraph", "heading", "bulletList", "orderedList", "blockquote", "codeBlock", "horizontalRule"]);
  const validNode = (value: unknown, parent: string, depth: number): boolean => {
    if (!value || typeof value !== "object" || depth > 20) return false;
    const node = value as EditorialTextNode;
    if (!nodeTypes.has(node.type)) return false;
    if (parent === "root" ? node.type !== "doc" : ["paragraph", "heading", "codeBlock"].includes(parent) ? !inline.has(node.type) : ["bulletList", "orderedList"].includes(parent) ? node.type !== "listItem" : !blocks.has(node.type)) return false;
    if (node.type === "text" && (typeof node.text !== "string" || !node.text)) return false;
    if (node.marks !== undefined && (!Array.isArray(node.marks) || node.marks.some((mark) => !mark || !markTypes.has(mark.type) || mark.type === "link" && !editorialLink(mark.attrs?.href)))) return false;
    if (["text", "hardBreak", "horizontalRule"].includes(node.type)) return node.content === undefined;
    if (node.content === undefined) return ["paragraph", "heading", "codeBlock"].includes(node.type);
    return Array.isArray(node.content) && node.content.length <= 10000 && node.content.every((child) => validNode(child, node.type, depth + 1));
  };
  try { return validNode(JSON.parse(value.slice(marker.length)), "root", 0); } catch { return false; }
}

export function editorialTextPlain(value: string): string {
  const textFor = (node: EditorialTextNode): string => node.type === "text" ? node.text || "" : node.type === "hardBreak" ? "\n" : (node.content || []).map(textFor).join(["paragraph", "heading"].includes(node.type) ? "" : "\n");
  return textFor(editorialTextDocument(value)).trim();
}
