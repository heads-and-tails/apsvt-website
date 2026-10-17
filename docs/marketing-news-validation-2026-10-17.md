# Marketing department news

## Expected result and scope

Remove the three automatically selected news cards shown in the publication request from `/programs/marketing#department-news`. Retain all department-authored editorial entries and the existing News navigation. The three Academy-wide articles remain published at their own URLs. Other programme feeds and the English marketing page retain their current behavior.

The department currently displays an automatic keyword/fallback feed above 29 department-authored news entries. Remove that automatic feed from the marketing branch only, so unrelated fallback cards cannot replace the removed cards. Reuse the existing editorial renderer; add no public replacement copy or panels.

## Strategy recorded before implementation

- Inspect the supplied screenshot and capture production baselines at 1440×1000 and 390×844. Directly inspect full-page and detail images before editing.
- Record the three automatic card URLs and a SHA-256 of the department-authored rendered text. Compare that text with production after release.
- Add a rendered-route regression proving the marketing page omits those URLs, their individual articles and the main news index still respond, and finance retains its automatic feed.
- Exercise opening News, returning to the section directory, and reopening News. Inspect desktop/mobile layout, wrapping, existing photographs, overflow, console errors and failed network requests.
- Compare finance News and `/en/programs/marketing` as representative regressions. Preserve all other marketing sections and editorial behavior.
- Run `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build:vercel` against the final revision before committing. Keep builds sequential with TypeScript checks.
- Merge the scoped green PR, verify the resulting main SHA and READY production deployment/public alias, then repeat the affected functional and visual checks on the public domain before replying.

Baseline inspection found existing failures for `/apsvt-campus-real.jpg`, `/apsvt-building.png`, `/en/departments`, and `/en/research/theses`. Record them separately; do not accept new failed requests or browser errors. Existing nested `department-news` identifiers are outside this one-line feed change; baseline automation targets the outer container explicitly.

## Results

`npm run lint` passed with 84 existing warnings and no errors. `npx tsc --noEmit`, all 86 tests in `npm test`, and `npm run build:vercel` passed. `git diff --check` passed.

The final local browser run passed all six route/viewport combinations, News open/back/reopen, all three original article responses, and the main news response. Finance card URLs matched baseline. There were no console errors, failed requests, page errors or horizontal overflow. Full and detail screenshots were directly inspected, including finance and English regressions after normal scroll-triggered content settled.

The local environment has no production department database, so its retained editorial area is empty; the production text-hash comparison verifies preservation of the 29 real items after release. No production fixture or content mutation is needed for this change. The exact merged deployment and live evidence are recorded privately after release. Screenshots and command logs are retained outside the public repository.
