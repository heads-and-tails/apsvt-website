# D4 doctoral programme materials

## Acceptance and strategy recorded before implementation

Publish the seven supplied originals: approved ONP, full-time/part-time curricula,
teaching-team qualification evidence (DOC), draft ONP and two draft curricula.
Use the existing doctoral programme page and preserve its navigation/editorial
content. The approved stamped 2025 PDF replaces the existing unstamped copy at
its established URL, so current catalogue links also receive the supplied file.
Keep draft documents in a distinct, explicitly labelled group. Add only the
provided guarantor and accreditation facts; do not invent an EDEBO ID, certificate
or missing departmental protocols. Preserve the 2025 year stated on the approved
title page.

Affected route:
`/departments/law-faculty/faculty-programmes/d4-public-administration-phd`.
Check the shared faculty subpage, official-document catalogue and current D4
doctoral document consumers. Existing law and D4 master/bachelor pages must remain
unchanged in this release. No auth, schema, dependency or environment changes.

Fresh baseline screenshots at 1440×1000 and 390×844 under
`/tmp/apsvt-email-1016/programme-material-baseline/phd-*` were directly inspected
before editing. Source title/certificate previews and full document extraction
are preserved in the private run directory. Compare the final UI with those
sources: plain factual information and named document links, without filler
panels or invented biographies. Preserve the established page design.

Regression tests will verify that the configured seven files exist, are unique,
match their original SHA-256 hashes and appear in the correct published/draft
groups in generated HTML. Browser checks will open/close the draft group, follow
the PDF and DOC links, check parent/sibling navigation, responsive layout,
console/network errors and overflow. Inspect fresh full/detail desktop and mobile
images. Check an unchanged law programme and English programmes.

Run required lint, TypeScript, tests and Vercel build. Review/merge a green PR,
verify the exact production main SHA and alias, hash all seven live downloads,
repeat affected interactions and directly inspect production desktop/mobile
screenshots. Then reply in the selected source thread and mark only that message
read after confirming delivery. Future supplied materials belong to subsequent
updates.

## Local results

- Lint and TypeScript passed; all 78 tests passed; Vercel build passed.
- Browser checks passed at both sizes: facts and document links, closed/expanded
  draft groups and return navigation. All seven HTTP downloads matched the
  original hashes; an actual DOC download also matched its supplied original.
- Fresh full and detail images under `/tmp/apsvt-email-1016/phd-local/` were
  directly inspected. No page errors, unexpected requests or overflow occurred.
- Existing law and English programme regression checks passed; their desktop and
  mobile screenshots under `phd-regressions/` were directly inspected.
- Reviewed TSX/server rendering, stable keys, semantic disclosure/link controls
  and scoped CSS. The new visible content consists of supplied facts, document
  labels and necessary section headings.
- Exact production release, live hashes and fresh production visual checks remain
  required and are recorded in the private run after merge.
