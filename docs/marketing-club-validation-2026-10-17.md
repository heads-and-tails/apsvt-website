# Marketing scientific club

## Expected outcome

Retain and emphasize the scientific-club subsection under Science on `/programs/marketing`, remove its link to the article of 24 April 2026, and allow editors to add, edit and delete text, photos, documents and club news directly in that subsection. Keep the other science publications, student achievement PDFs and international text.

## Strategy recorded before editing

- Capture and directly inspect the existing Science page and local editorial section picker at 1440×1000 and 390×844. The old control links to `/materials/3331-0b35c55db.html`; the empty club has no editor slot.
- Preserve the existing four-card design, enlarge the club label and emphasize that control with the established cobalt/gold palette. Use a semantic anchor and stable `#science-club` destination, including direct links from outside the page. Add no invented club information or filler panels.
- Reuse the existing section registry, editorial renderer, persistence and media forms. Keep club content out of the general News view, preserve publication guards and make the empty editor slot selectable before content exists.
- Through the actual local panel, create text, photo, PDF and news entries; verify public display, real file uploads/downloads, edit/reload persistence, draft and delete behavior. Remove all isolated local fixtures and uploaded media. No fake production submissions.
- Verify that uploaded document addresses satisfy the form's native URL validation. The first local flow found that relative R2 addresses were rejected after successful upload; normalize uploaded document URLs against the current origin in the existing form callback. Absolute storage URLs retain their value.
- Verify that opening a club news article and following its return link reopens the club. Other departmental news return links retain their existing destination.
- Verify the club article's EN control against the available `/en/news` index. Existing departmental article URLs have no English counterpart (a real published article's English URL returned 404 in baseline); use the existing header override for club news without inventing a translation or changing other articles.
- Verify the other three science cards, achievement PDFs and international text against baseline. Exercise navigation and keyboard access, both viewports, marketing News, finance and English marketing regressions. Inspect console/network failures and fresh full/detail screenshots directly.
- Run lint, TypeScript, all `npm test` cases and `npm run build:vercel` against the final source. Keep builds sequential with TypeScript checks. Review changed components for focused server rendering, semantic controls, accessible labels, safe publication states and absence of unnecessary client code.
- Merge a scoped green PR, verify the exact main deployment and public alias, then repeat the affected navigation and visual checks in production before replying. Record any production editor writes not performed.

Baseline browser evidence records the existing failed prefetch for the old static HTML material link. Its removal should eliminate that request. Earlier marketing regression baselines separately record unrelated missing campus images and English routes.

## Results

- `npm run lint`: passed, with 84 existing warnings and no errors. `npx tsc --noEmit`: passed. `npm test`: all 88 tests passed, none skipped. `npm run build:vercel`: passed. `git diff --check`: passed.
- Actual local editor flows created, uploaded, published, edited and deleted text, photo, PDF and news content. Four original uploads passed byte/hash checks; draft content was absent from the public club and its canonical news URL. All fixture entries were deleted and their absence checked.
- At 1440×1000 and 390×844, keyboard navigation, direct-link reload, section reopening, news return and EN navigation passed. The other three science cards, achievement text, international text and original 2025/2026 PDFs matched the baseline.
- Directly inspected baseline and final local full/detail images, filled editor forms, published content, returned states and expanded achievement states. Marketing News, finance and English marketing regressions passed without new console errors, failed requests or horizontal overflow.
- Production validation will repeat the read-only public scenarios after the exact merge deployment is Ready. No production test content or editor writes are authorized by this validation plan. Deployment references and private screenshot paths are retained in the maintenance run.
