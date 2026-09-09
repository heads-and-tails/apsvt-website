import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('exports', 'require', code)(exports, (name) => load(path.relative(root, path.resolve(path.dirname(file), `${name}.ts`))));
  return exports;
}
const structure = load('lib/law-faculty-structure.ts');
const access = load('lib/editorial-access.ts');
const registry = load('lib/editorial-sections.ts');

test('faculty sections are separate and normative documents replace quality', () => {
  const ids = structure.lawFacultyStructure.map((section) => section.id);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of ['faculty-council', 'faculty-student-government', 'faculty-science-clubs', 'municipal-law-school', 'faculty-repository', 'faculty-discussion', 'faculty-documents']) assert.ok(ids.includes(id));
  assert.ok(!ids.includes('faculty-quality'));
});
test('every supplied subsection has a unique editable URL', () => {
  const pages = structure.lawFacultySubpages;
  assert.equal(pages.length, new Set(pages.map((page) => page.path)).size);
  for (const page of pages) {
    assert.ok(access.isEditorialPagePath(page.path), page.path);
    assert.equal(registry.editorialSectionsForPage(page.path)[0].label, page.title);
  }
});
test('faculty editors can manage faculty subsections and constituent departments only', () => {
  const faculty = { role: 'editor', accessScopes: [structure.lawFacultyPath] };
  for (const page of structure.lawFacultySubpages) assert.ok(access.canEditPage(faculty, page.path));
  for (const page of ['/departments/constitutional-law', '/departments/criminal-law', '/departments/private-law', '/programs/law/legal-clinic', '/programs/public-administration']) assert.ok(access.canEditPage(faculty, page));
  for (const page of ['/programs/marketing', '/programs/finance', '/panel', '/departments/law-faculty-other']) assert.equal(access.canEditPage(faculty, page), false);
  assert.equal(access.canEditPage({ role: 'editor', accessScopes: ['/departments/constitutional-law'] }, structure.lawFacultySubpages[0].path), false);
});
test('both finance projects and empty publishing slots are available in editor', () => {
  const ids = registry.editorialSectionsForPage('/programs/finance').map((section) => section.id);
  for (const id of ['greenfinedu', 'eu-financial-sector', 'eu-financial-sector-about', 'eu-financial-sector-documents']) assert.ok(ids.includes(id));
});
test('faculty content is rendered on demand after editorial changes', () => {
  const source = fs.readFileSync(path.join(root, 'app/departments/law-faculty/page.tsx'), 'utf8');
  assert.ok(source.includes('export const dynamic = "force-dynamic"'));
  assert.ok(source.includes('extraContent={sectionExtras}'));
});
