# D4 master's programme materials

## Acceptance and strategy recorded before implementation

Publish the eight supplied Drive originals and accreditation certificate on the
existing master's programme page: approved OPP, both 2025–2026 curricula,
pre-diploma practice programme/bases, thesis guidance/topics/application and
certificate No. 6830. Add guarantor Kateryna Mishchenko, EDEBO 56066 and the supplied
accreditation schedule. The certificate's stated validity ends on 1 July 2029;
preserve that distinction from the planned next accreditation in July 2029.

Use the existing publication component and grouping; no invented course texts,
missing discussion records or new explanatory panels. Replace current master's
programme references in the official catalogue and generic programme materials
with the supplied approved file. Preserve all doctoral and law content.
No auth, schema, dependencies or environment changes are needed.

Baseline desktop (1440×1000) and mobile (390×844) master screenshots under
`/tmp/apsvt-email-1016/programme-material-baseline/master-*` were captured and
directly inspected before editing. Source certificate/programme title pages were
also inspected. Compare the final facts and grouped links with those sources.

Verify all nine unique configured files against original SHA-256 hashes and
their generated HTML references. Exercise parent/sibling navigation, open the
approved programme and certificate, verify the complete live file responses,
and inspect console/network errors and overflow at both sizes. Directly inspect
fresh full/detail screenshots. Check the already-published doctoral page and
an English programme for shared-component regressions.

Run required lint, TypeScript, full tests and Vercel build, review/merge a green
PR, verify exact production SHA and alias, then repeat hashes and responsive
browser/visual checks on production. Reply only after that gate; accurately
identify future discussion/course materials as a later publication batch.

## Local results

- Lint/TypeScript passed; all 80 tests passed; Vercel build passed.
- All nine HTTP file bodies matched the supplied originals by SHA-256. The
  approved OPP has 18 pages, matching catalogue metadata.
- Desktop/mobile checks passed for facts, resource groups and return navigation;
  no page errors, unexpected requests or horizontal overflow occurred. Fresh full
  and detail screenshots under `/tmp/apsvt-email-1016/master-local/` were directly
  inspected against the baseline and source previews.
- Existing doctoral and English programme regressions passed; their screenshots
  under `master-regressions/` were directly inspected. Catalogue/overview changes
  affect file destinations only; direct URL and hash checks verify those changes.
- Reviewed the complete scoped diff, publication grouping and source facts. No
  new public filler, placeholder panels or implementation notes were added.
- Production SHA/alias, live downloads and fresh production visual evidence remain
  required and are recorded in the private email run after merge.
