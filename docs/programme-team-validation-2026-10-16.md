# Programme guarantor and teaching team

## Acceptance and strategy recorded before implementation

Add «Гарант і група забезпечення ОП» to all five A5 programme pages and the
matching Step 1 editor picker. Existing teacher fields must save role, profile,
scientific links and educational components to this section. Preserve all
existing sections, content and editorial access. No membership assignments or
public explanatory panels are to be invented. This release covers the section;
individual staff pages are a separate request and release.

The existing production baseline at cf69aba has nine programme sections. Fresh
desktop (1440×1000) and mobile (390×844) screenshots were captured and directly
inspected under `/tmp/apsvt-email-1016/baseline/` before edits. The Ukrainian A5
page's English-language prefetch currently returns 404; the English management
programme remains a representative existing English consumer. Record this
pre-existing limitation rather than claiming an A5 translation exists.

Verify all five routes expose the same new section without losing the nine old
sections, and the editor registry has the same ID/label. Through the isolated
local panel, select the section, publish a teacher with role/profile/components,
reload the public page, verify the correct destination, then remove the fixture.
Inspect empty and populated states, navigation and back control at both sizes.
Check representative existing Ukrainian and English programmes for regressions,
console errors, failed requests and horizontal overflow.

Add regression coverage for public/editor registration and generated HTML. Run
lint, TypeScript, full tests and the Vercel build sequentially where generated
types could race. Review the final diff, merge a green PR through normal checks,
verify its exact resulting main SHA and READY production deployment, then repeat
the public section/navigation and desktop/mobile visual checks on the live domain.
No migration, auth, CI, dependency or environment change is needed.

## Results

- `npm run lint`: passed (84 existing image-element warnings, no errors).
- `npx tsc --noEmit`: passed.
- `npm test`: 72 passed, zero failed/skipped.
- `npm run build:vercel`: passed.
- Local browser: editor section selection, role/profile/component publication,
  API response, public reload and fixture deletion verified. Screenshots of the
  picker, populated and empty sections, full programme page and English management
  regression at both planned sizes were captured under
  `/tmp/apsvt-email-1016/{programme-editor,programme-local}/` and directly inspected.
  No console errors, unexpected failed requests or horizontal overflow observed.
- Production release and fresh live evidence are tracked in the private mail run
  record; they remain required before this request can be closed.
