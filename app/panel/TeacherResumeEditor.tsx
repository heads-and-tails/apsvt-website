"use client";

import { RichTextEditor } from "./RichTextEditor";

export function TeacherResumeEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <RichTextEditor value={value} onChange={onChange} label="Резюме та наукові профілі" />;
}
