# Separate staff profile pages

## Acceptance and strategy recorded before implementation

Published editorial teacher records must have stable individual URLs and retain
their full authored biography, qualifications, disciplines, scientific links,
portrait and attachments. Department cards show a short introduction and a link
to the full profile. The seven existing digital-technologies teachers must work
without re-entry; static cards elsewhere keep their current behavior. Existing
editor fields remain the source of truth; saving or renaming keeps the same URL.
Hidden, draft, missing and non-teacher records must not be public profiles.

Production baseline screenshots, captured before edits at 1440×1000 and 390×844,
are under `/tmp/apsvt-email-1016/baseline/staff-*` and were directly inspected.
They show seven long inline cards. The public structured card data was saved to
`/tmp/apsvt-email-1016/staff-baseline-profiles.json` for content comparison.

Use the existing published-record lookup and editorial data model; add no
authorization, schema, dependency or environment changes. Check generated links,
summary boundaries, 404 guards and representative existing news/people routes.
Verify Ukrainian and English profile navigation without inventing translations
of authored Ukrainian biographies. Preserve the existing portrait fit/focus.

In isolated local data, publish a complete teacher fixture, follow its department
link, save changes through the existing editor, reload the same detail URL,
unpublish/hide and verify 404, then restore/delete fixtures. Check rich text and
links without exposing editorial author metadata. Inspect fresh full/close-up
desktop/mobile list and detail screenshots, keyboard link navigation, back links,
console/network failures and overflow. Check an existing static faculty card and
the English people index for regressions.

Run lint, TypeScript, full tests and Vercel build, review the complete diff, merge
a green PR, verify the exact production main SHA and public alias, then repeat
all seven real teacher links/content checks and directly inspect fresh production
desktop/mobile list and profile screenshots. Close the source email only after
both this outcome and the preceding programme-team release are verified live.

## Local results

- Lint passed with the same 84 existing image warnings; TypeScript passed.
- All 76 tests passed; Vercel production build passed.
- Browser checks passed for short card → full profile → source-page return at
  both sizes; full summary, rich biography, discipline, portrait and attachment
  were retained. Editing the same record through the panel changed the name and
  biography at the same URL. Draft/hidden records returned 404 in both languages;
  wrong-type records returned 404. Fixtures were deleted afterward.
- Directly inspected fresh list, full/detail profile and saved-editor screenshots
  under `/tmp/apsvt-email-1016/staff-local/`; no page errors or overflow observed.
- Static public-administration cards, English people and the programme-team
  section passed desktop/mobile regression checks with no unexpected network or
  console errors. Screenshots are under `staff-regressions/` and were inspected.
- Reviewed the TSX changes against the React skill: server rendering, focused
  components, stable keys, semantic links, no new effects/client state, preserved
  publication guards and scoped CSS. Public additions contain only authored
  profile data and necessary navigation/section labels.
- Exact production release and all seven real profiles remain a required gate;
  final deployment and live evidence are stored in the private email run record.
