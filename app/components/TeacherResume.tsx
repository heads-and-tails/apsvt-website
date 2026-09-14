import { Fragment, type ReactNode } from "react";

// Only web links are accepted; authored HTML is always rendered as plain text.
function webLink(value: string): string | null {
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? value : null;
  } catch { return null; }
}

function inline(text: string): ReactNode[] {
  const pattern = /\[([^\]\n]+)\]\(([^\s]+)\)|\*\*([^*\n]+)\*\*|https?:\/\/[^\s<>]+/g;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index!;
    parts.push(text.slice(cursor, index));
    if (match[3]) {
      parts.push(<strong key={index}>{match[3]}</strong>);
    } else {
      const raw = match[2] || match[0];
      // Sentence punctuation is not part of a pasted bare URL.
      let url = match[2] ? raw : raw.replace(/[.,;:!?]+$/, "");
      if (!match[2]) {
        while (url.endsWith(")") && (url.match(/\)/g)?.length || 0) > (url.match(/\(/g)?.length || 0)) url = url.slice(0, -1);
      }
      const href = webLink(url);
      parts.push(href ? <Fragment key={index}><a href={href} target="_blank" rel="noopener noreferrer">{match[1] || url}</a>{match[2] ? "" : raw.slice(url.length)}</Fragment> : match[0]);
    }
    cursor = index + match[0].length;
  }
  parts.push(text.slice(cursor));
  return parts;
}

export function TeacherResumeText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let paragraph: string[] = [];
  let items: string[] = [];
  let ordered = false;
  const flushParagraph = () => {
    if (paragraph.length) blocks.push(<p key={blocks.length}>{inline(paragraph.join("\n"))}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (items.length) {
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={blocks.length}>{items.map((item, index) => <li key={index}>{inline(item)}</li>)}</List>);
    }
    items = [];
  };
  for (const line of lines) {
    const heading = line.match(/^\s*#{1,6}\s+(.+)$/);
    const bullet = line.match(/^\s*(?:([-•–])|\d+[.)])\s+(.+)$/);
    if (!line.trim() || heading) {
      flushParagraph(); flushList();
      if (heading) blocks.push(<h4 key={blocks.length}>{inline(heading[1])}</h4>);
    } else if (bullet) {
      flushParagraph();
      const nextOrdered = !bullet[1];
      if (items.length && nextOrdered !== ordered) flushList();
      ordered = nextOrdered;
      items.push(bullet[2]);
    } else {
      flushList(); paragraph.push(line);
    }
  }
  flushParagraph(); flushList();
  return <div className="teacher-resume-text">{blocks}</div>;
}

export function TeacherResume({ text, name }: { text: string; name: string }) {
  if (!text.trim()) return null;
  return <details className="teacher-resume" name="department-teacher-resumes">
    <summary aria-label={`Резюме та наукові профілі — ${name}`}>Резюме та наукові профілі <span aria-hidden="true">+</span></summary>
    <TeacherResumeText text={text} />
  </details>;
}
