# Marketing repository

The requested repository must be a separate marketing hub destination with a stable public anchor and its own editable content. Preserve all nine existing hub controls and student/science content. Use only the requested title until genuine materials are supplied; do not copy example thesis files or add placeholder prose.

Before implementation, capture and directly inspect the existing nine-control hub at 1440×1000 and 390×844; retain its text/control inventory as the baseline. Reuse the existing editorial renderer and media forms, publication guards and server rendering. Add no dependencies, migrations, auth or environment changes.

Validate keyboard hub activation, direct-link reload, menu close/reopen, empty section, and real local PDF/news upload, publication, edits, persistence, drafts, downloads and deletion. Verify original uploaded bytes and correct canonical news return/English destination. Keep repository entries out of general News; remove isolated local fixtures. No fake production content or editor writes.

Inspect fresh full/detail and resulting-state screenshots at both sizes, checking Ukrainian wrapping, images, spacing, navigation and overflow. Recheck both student subsections and profiles, Science/club, marketing News, finance and English. Compare console/network failures with baseline. Run lint, TypeScript, npm test and Vercel build sequentially; review the final diff and publication filtering. After normal green PR merge, verify the exact main production deployment and domain, then repeat the read-only public flow and visual checks. Actual results and private screenshot paths are retained in the maintenance run.

## Final local results

`npm run lint` passed with 84 existing warnings and no errors; `npx tsc --noEmit` passed; `npm test` passed all 92 tests with none skipped; `npm run build:vercel` and `git diff --check` passed. Actual UI PDF/news create/upload/publish/edit/persist/draft/delete flows passed. Original PDF/image upload hashes and browser PDF navigation passed; fixture deletion and absence were verified. Canonical news returns to the repository and uses the available English news index.

At 1440×1000 and 390×844, keyboard navigation, direct reload and reopen passed. Original nine hub labels/destinations and nine profile text/image-reference hashes match baseline. Student subsections, four Science cards, marketing News, finance and English regressions passed. Fresh full/detail, shared-control, editor, published and returned screenshots were directly inspected; no unexpected console/network errors or horizontal overflow. No demo files or invented repository content were added. Production read-only results and exact deployment references will be recorded privately after merge.
