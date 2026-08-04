type EditorialRichTextProps = {
  text: string;
  language?: "uk" | "en";
};

type TextBlock =
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

const bulletPattern = /^[-•–]\s+/;
const numberedPattern = /^\d+[.)]\s+/;

function parseText(text: string): TextBlock[] {
  return text
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.length > 0 && lines.every((line) => bulletPattern.test(line) || numberedPattern.test(line))) {
        return {
          type: "list" as const,
          items: lines.map((line) => line.replace(bulletPattern, "").replace(numberedPattern, "")),
        };
      }
      if (/^#{1,3}\s+/.test(block)) {
        return { type: "heading" as const, text: block.replace(/^#{1,3}\s+/, "") };
      }
      return { type: "paragraph" as const, text: block.replace(/\n+/g, " ") };
    });
}

export function EditorialRichText({ text, language = "uk" }: EditorialRichTextProps) {
  const blocks = parseText(text);
  const sectionLabel = language === "uk" ? "Фрагмент" : "Section";

  return <div className="editorial-richtext">
    {blocks.map((block, index) => {
      if (block.type === "heading") return <h2 key={`${block.text}-${index}`}>{block.text}</h2>;
      if (block.type === "list") return <div className="editorial-list" key={`list-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
      return <div className="editorial-paragraph" key={`${block.text.slice(0, 24)}-${index}`}>
        <span><b>{String(index + 1).padStart(2, "0")}</b>{sectionLabel}</span>
        <p>{block.text}</p>
      </div>;
    })}
  </div>;
}
