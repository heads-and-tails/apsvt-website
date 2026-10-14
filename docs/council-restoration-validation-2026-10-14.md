# Faculty council material restoration — 14 October 2026

Baseline production data: four published image-based entries still exist on
faculty-council/about, members and plan (one, one and two). Regulations currently
has no published entries or visible documents. The main faculty council panel
renders only a generic link to /documents#governance instead of these entries.
Baseline screenshots/data are in /tmp/apsvt-council-1014.

Acceptance criteria and strategy before edits:
- Show the existing published council subpage materials directly in the faculty
  council panel, with clear links to the four retained subsections and original
  image files. Read from the existing records, preserving IDs/content/media/order;
  no production data migration, copying or new institutional facts.
- Keep individual subpages working and updates visible both there and in the
  council overview. Hidden/draft entries must stay hidden. Empty regulations
  should reflect its current published state. Removed meetings/decisions/protocols
  must remain removed; no unrelated faculty/department content should move.
- Copy the actual four public entries into isolated D1. Reproduce the missing
  overview before editing, then check image/title/order/links and save/reload an
  edit from the subpage editor; verify the overview follows it.
- Capture and directly inspect the council panel and retained subpages at desktop
  1440×1000 and mobile 390×844 (plus tablet 768×1024 for the panel), image loading,
  whole-image proportions, document readability, clipping and horizontal overflow.
  Exercise the council button, subsection links and original-file links.
- Add a regression check with stored fixtures that proves real content reaches
  the overview; check drafts/hidden records, empty and removed routes. Recheck the
  faculty staff panel and one English news page as shared navigation regressions.
- Run lint, TypeScript, all repository tests and optimized Vercel build. Review,
  normal PR merge and READY production release matching its main SHA; repeat fresh
  desktop/mobile visual and data checks on production. Do not report completion
  before these steps finish.

Final local results:
- npm run lint: passed, 0 errors and 84 existing image warnings.
- npx tsc --noEmit: passed.
- npm test: passed, 65 tests, 0 skipped.
- npm run build:vercel: passed, exit 0.
- node tests/council-content-flow.test.mjs http://localhost:5200: passed the
  real D1 publication/update/draft/hidden/removal regression. The initial test
  incorrectly treated the header's separate documents link as part of the council;
  the scoped browser check and corrected content regression pass.
- Browser editor save/reload: passed; a child page summary update appeared on
  both the child page and the overview, the original image was preserved, and
  the isolated fixture was restored. No production data writes.
- Fresh browser rerun: all 15 council panel/subpage scenarios passed at desktop,
  tablet and mobile; four original images loaded once each in the panel, original
  links returned 200, image-box proportions matched the source, and no horizontal
  overflow. Mobile inspection found an inherited 16:10 box shrinking portrait
  documents; the council-specific aspect-ratio reset fixes it. Fresh full-page
  and close-up images in /tmp/apsvt-council-1014/final-local were opened and directly
  inspected against baseline. Faculty staff and English news regressions passed.
- No page exceptions or unexpected console/network failures. Known pre-existing
  unsupported English navigation/search-image URLs are recorded separately in
  the browser results. Retired council routes remain 404.
- Manual React review: server-side data reading, one published-content query,
  stable page/entry keys, existing status/visibility filters, semantic labelled
  sections, safe original-file links, and no extra client state or auth changes.

Production merge SHA/deployment identity and fresh live screenshots are recorded
on the release PR after normal merge. There are no migrations or environment
changes. Empty regulations reflect the current published records; no content was
invented to fill them.
