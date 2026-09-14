import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('exports', 'require', code)(exports, (name) => name.startsWith('.')
    ? load(path.relative(root, path.resolve(path.dirname(file), `${name}.tsx`)))
    : name.startsWith('@/') ? load(`${name.slice(2)}.tsx`) : require(name));
  return exports;
}
const { TeacherResume, TeacherResumeText } = load('app/components/TeacherResume.tsx');
const { DepartmentEditorialContent } = load('app/components/DepartmentEditorialContent.tsx');
const { TeacherResumeEditor } = load('app/panel/TeacherResumeEditor.tsx');
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

test('empty resume is absent and non-empty accordion is collapsed and named', () => {
  assert.equal(render(TeacherResume, { text: ' \n', name: 'Викладач' }), '');
  const html = render(TeacherResume, { text: 'Біографія', name: 'Викладач' });
  assert.match(html, /<details class="teacher-resume" name="department-teacher-resumes">/);
  assert.doesNotMatch(html, /<details[^>]* open/);
  assert.match(html, /aria-label="Резюме та наукові профілі — Викладач"/);
});

test('headings, paragraphs, bold text and adjacent ordered and unordered lists', () => {
  const html = render(TeacherResumeText, { text: '## Освіта\nТекст без порожнього рядка.\nДругий рядок.\n\n**Інтереси**\n- Дослідження\n- Педагогіка\n1. Публікація\n2. Монографія' });
  assert.match(html, /<h4>Освіта<\/h4><p>Текст без порожнього рядка\.\nДругий рядок\.<\/p>/);
  assert.match(html, /<strong>Інтереси<\/strong>/);
  assert.match(html, /<ul><li>Дослідження<\/li><li>Педагогіка<\/li><\/ul><ol>/);
});

test('all four scientific platforms support named and bare links', () => {
  const urls = ['https://orcid.org/0000-0000-0000-0000', 'https://scholar.google.com/citations?user=example&hl=uk', 'https://www.scopus.com/authid/detail.uri?authorId=123', 'https://www.webofscience.com/wos/author/record/123'];
  const html = render(TeacherResumeText, { text: `[ORCID](${urls[0]})\n\n${urls.slice(1).join('\n')}.` });
  assert.equal((html.match(/<a /g) || []).length, 4);
  assert.equal((html.match(/rel="noopener noreferrer"/g) || []).length, 4);
  assert.match(html, /href="https:\/\/www.webofscience.com\/wos\/author\/record\/123"/);
});

test('HTML and unsafe protocols cannot execute; malformed links remain text', () => {
  const html = render(TeacherResumeText, { text: '<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n[x](javascript:alert(1))\n[x](data:text/html,test)\n[x](//bad.test)\n[x](https://)\n[x](https://user:password@example.com)' });
  assert.doesNotMatch(html, /<(script|img|a)\b/);
  assert.match(html, /&lt;script&gt;/);
});

test('server teacher cards use stored body without replacing summary or profile', () => {
  const entry = { id:'test', entryType:'teacher', title:'Тестовий викладач', imageUrl:'', role:'Викладач', summary:'Короткий профіль', body:'## Освіта\nЗбережене резюме', email:'', profileUrl:'https://orcid.org/0000-0000-0000-0000' };
  const html = render(DepartmentEditorialContent, { entries:[entry] });
  assert.match(html, /Короткий профіль/);
  assert.match(html, /Науковий профіль/);
  assert.match(html, /<h4>Освіта<\/h4><p>Збережене резюме<\/p>/);
});

test('editor has accessible field, preview and non-submitting formatting tools', () => {
  const html = render(TeacherResumeEditor, { value:'## Біографія\nЗбережений текст', onChange:() => {} });
  assert.equal((html.match(/type="button"/g) || []).length, 4);
  assert.match(html, /aria-label="Форматування резюме"/);
  assert.match(html, /Попередній перегляд резюме/);
  assert.match(html, /<textarea[^>]+aria-describedby=/);
  assert.match(html, /Збережений текст/);
});
