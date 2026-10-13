import { createElement, type ReactNode } from "react";
import { editorialLink, editorialTextDocument, type EditorialTextNode } from "@/lib/editorial-text";

type EditorialRichTextProps = { text: string; language?: "uk" | "en"; headingOffset?: number };

function renderNode(node: EditorialTextNode, key: string, offset: number): ReactNode {
  if (node.type === "text") {
    let text: ReactNode = node.text || "";
    for (const [index, mark] of (node.marks || []).entries()) {
      const markKey = `${key}-mark-${index}`;
      if (mark.type === "link") {
        const href = editorialLink(mark.attrs?.href);
        if (href) text = <a href={href} target="_blank" rel="noopener noreferrer" key={markKey}>{text}</a>;
      } else {
        const tag = ({ bold: "strong", italic: "em", underline: "u", strike: "s", code: "code" } as Record<string, string>)[mark.type];
        if (tag) text = createElement(tag, { key: markKey }, text);
      }
    }
    return <span key={key}>{text}</span>;
  }
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type === "horizontalRule") return <hr key={key} />;
  const children = (node.content || []).map((child, index) => renderNode(child, `${key}-${index}`, offset));
  if (node.type === "heading") return createElement(`h${Math.min(6, (node.attrs?.level || 2) + offset)}`, { key }, children);
  if (node.type === "orderedList") return <ol start={node.attrs?.start || 1} key={key}>{children}</ol>;
  if (node.type === "codeBlock") return <pre key={key}><code>{children}</code></pre>;
  const tag = ({ paragraph: "p", bulletList: "ul", listItem: "li", blockquote: "blockquote" } as Record<string, string>)[node.type];
  return tag ? createElement(tag, { key }, children) : null;
}

export function EditorialRichText({ text, headingOffset = 0 }: EditorialRichTextProps) {
  const doc = editorialTextDocument(text);
  if (!doc.content?.length) return null;
  return <div className="editorial-richtext">{doc.content.map((node, index) => renderNode(node, String(index), headingOffset))}</div>;
}
