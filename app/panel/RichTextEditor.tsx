"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { editorialLink, editorialTextDocument, encodeEditorialText } from "@/lib/editorial-text";

function pastedWordHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,style,meta,link,iframe,object").forEach((node) => node.remove());
  doc.querySelectorAll("h1").forEach((node) => { const heading = doc.createElement("h2"); heading.innerHTML = node.innerHTML; node.replaceWith(heading); });
  for (const paragraph of doc.querySelectorAll("p")) {
    const style = paragraph.getAttribute("style") || "";
    const className = paragraph.className;
    const heading = className.match(/MsoHeading([1-6])/i) || style.match(/mso-outline-level:\s*([1-6])/i);
    if (heading) {
      const node = doc.createElement(`h${Math.max(2, Number(heading[1]))}`);
      node.innerHTML = paragraph.innerHTML; paragraph.replaceWith(node);
    } else if (/mso-list:/i.test(style)) {
      const prefix = paragraph.textContent?.match(/^\s*(?:([-•·–\uF02D\uF0B7])|(\d+)[.)])\s*/);
      if (!prefix) continue;
      const type = prefix[2] ? "ol" : "ul";
      const previous = paragraph.previousElementSibling;
      const list = previous?.tagName.toLowerCase() === type ? previous : doc.createElement(type);
      if (list !== previous) { if (prefix[2]) list.setAttribute("start", prefix[2]); paragraph.before(list); }
      paragraph.querySelectorAll('[style*="mso-list:Ignore"], [style*="mso-list: Ignore"]').forEach((node) => node.remove());
      if (paragraph.textContent?.match(/^\s*(?:[-•·–\uF02D\uF0B7]|\d+[.)])\s*/)) {
        const first = paragraph.firstChild;
        if (first?.nodeType === Node.TEXT_NODE) first.textContent = (first.textContent || "").replace(/^\s*(?:[-•·–\uF02D\uF0B7]|\d+[.)])\s*/, "");
      }
      const item = doc.createElement("li"); item.innerHTML = paragraph.innerHTML; list.appendChild(item); paragraph.remove();
    }
  }
  return doc.body.innerHTML;
}

export function RichTextEditor({ value, onChange, label = "Повний текст" }: { value: string; onChange: (value: string) => void; label?: string }) {
  const id = useId();
  const emitted = useRef(value);
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState("");
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] }, link: { openOnClick: false, isAllowedUri: (url) => Boolean(editorialLink(url)) } })],
    content: editorialTextDocument(value),
    immediatelyRender: false,
    editorProps: { attributes: { role: "textbox", "aria-label": label, "aria-multiline": "true", id, spellcheck: "true" }, transformPastedHTML: pastedWordHtml },
    onUpdate: ({ editor }) => { const next = encodeEditorialText(editor.getJSON()); emitted.current = next; onChange(next); },
  });
  const state = useEditorState({ editor, selector: ({ editor }) => ({
    bold: editor?.isActive("bold") || false,
    bullet: editor?.isActive("bulletList") || false,
    ordered: editor?.isActive("orderedList") || false,
    heading: editor?.isActive("heading") ? Number(editor.getAttributes("heading").level) : 0,
  }) });

  useEffect(() => {
    if (editor && value !== emitted.current) {
      emitted.current = value;
      editor.commands.setContent(editorialTextDocument(value), { emitUpdate: false });
    }
  }, [editor, value]);

  return <div className="wide rich-text-editor">
    <span className="rich-text-label" id={`${id}-label`}>{label}</span>
    <div className="rich-text-toolbar" role="group" aria-label={`Форматування · ${label}`}>
      <select aria-label="Рівень заголовка" disabled={!editor} value={state?.heading || 0} onChange={(event) => { const level = Number(event.target.value); if (level) editor?.chain().focus().setHeading({ level: level as 2 | 3 | 4 | 5 | 6 }).run(); else editor?.chain().focus().setParagraph().run(); }}>
        <option value={0}>Звичайний текст</option>{[2, 3, 4, 5, 6].map((level) => <option value={level} key={level}>Заголовок {level}</option>)}
      </select>
      <button type="button" disabled={!editor} aria-pressed={state?.bold || false} onClick={() => editor?.chain().focus().toggleBold().run()}>Жирний</button>
      <button type="button" disabled={!editor} aria-pressed={state?.bullet || false} onClick={() => editor?.chain().focus().toggleBulletList().run()}>Маркований список</button>
      <button type="button" disabled={!editor} aria-pressed={state?.ordered || false} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Нумерований список</button>
      <button type="button" disabled={!editor} onClick={() => { setLink(editor?.getAttributes("link").href || ""); setLinkOpen((open) => !open); }}>Посилання</button>
      <button type="button" disabled={!editor} onClick={() => editor?.chain().focus().undo().run()}>Скасувати дію</button>
    </div>
    {linkOpen && <div className="rich-text-link"><label>Адреса посилання<input type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://…" /></label><button type="button" disabled={!editorialLink(link)} onClick={() => { const href = editorialLink(link); if (href) editor?.chain().focus().extendMarkRange("link").setLink({ href }).run(); setLinkOpen(false); }}>Застосувати</button><button type="button" onClick={() => { editor?.chain().focus().extendMarkRange("link").unsetLink().run(); setLinkOpen(false); }}>Прибрати посилання</button></div>}
    <EditorContent editor={editor} />
  </div>;
}
