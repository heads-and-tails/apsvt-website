import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const archive = path.join(root, 'public/documents/licenses/email-archive-2026-10');

test('emailed historical accreditation scans are present once and remain separate from current certificates', () => {
  const files = fs.readdirSync(archive).filter((file) => file.endsWith('.jpg'));
  assert.equal(files.length, 28);
  assert.ok(files.includes('ba29a-01.jpg'));
  assert.ok(files.includes('ba29a-02.jpg'));
  assert.ok(!files.some((file) => file.startsWith('b3a0e-')));
  for (const file of files) {
    const bytes = fs.readFileSync(path.join(archive, file));
    assert.ok(bytes.length > 20_000, file);
    assert.equal(bytes[0], 0xff, file);
    assert.equal(bytes[1], 0xd8, file);
  }
  const page = fs.readFileSync(path.join(root, 'app/about/licenses/page.tsx'), 'utf8');
  assert.ok(page.includes('historicalCertificateGroups'));
  assert.ok(page.includes('historicalLicensePages'));
  assert.ok(page.includes('не підтвердження чинної ліцензії'));
});
