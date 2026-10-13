# Editorial email validation — 13 October 2026

Source: ten unread messages from tsabenok26@ukr.net, dated 9 and 12 October.
Read state is preserved. Each request is checked against current origin/main,
actual persistence, rendered pages, and the scoped editing interface. A thank-you
or an earlier completion claim is not evidence that an editing flow works.

## 9 October 21:16 — Optional news publication dates

Expected: a per-news checkbox hides only publication-date UI, preserves the
stored date and sorting, works on news cards and individual articles, and can
be reversed. Both Academy and department news must support it. English copies
must respect the original article's setting. No generic quote may be appended
to authored news, and an author must not be invented by the page template.

Checks planned before implementation:
- Baseline Ukrainian news and law department pages at 1440×1000 and 390×844.
- Create local department news with a real date; check/uncheck the option in
  the editor, save, reload, and read the stored entry through its API.
- Inspect both parent card and full article with the setting on and off.
- Reorder entries and verify all editor metadata, including hidden-date state,
  remains unchanged except order. Retain a dated comparison article.
- Exercise Academy news create/update/read and English translated copies.
- Inspect article content for the removed generic quote and invented author.
- Inspect final desktop/mobile screenshots, browser console, failed requests,
  and horizontal overflow on Ukrainian and English representative pages.
- Run npm run lint, npx tsc --noEmit, npm test, and npm run build:vercel.
- Review/merge a scoped PR; verify its production deployment and fresh live
  screenshots. Record results below, without treating unperformed checks as passed.

## 12 October 09:56, 18:36, 21:05 — Follow-up replies

The 09:56 complaint requires verification of the original requests. The other
messages are acknowledgements and add no implementation requirements.

## 12 October 14:02 — Four department pages and content management

Expected: exactly five main sections on each of constitutional law, private
law, criminal law, and public administration: about, head, staff, news,
contacts. Faculty navigation remains intact except the separately requested
removals. Each section supports sensible authored text, photos, PDF documents,
and links; staff can be created, edited, reordered, hidden, and removed.

Plan: inspect baseline and final desktop/mobile screenshots of all four pages;
exercise every section in the scoped editor; create/update/delete test content
in an isolated local database; verify article pages, attachments, and section
filtering. Check existing staff preservation and no duplication, and inspect
browser errors and network failures. Run all four repository checks before
merge and inspect the corresponding deployed pages after release.

## 12 October 14:03 — Faculty council removals

Plan: verify council meetings and decisions/minutes links are absent from
faculty and editor navigation; retired URLs do not expose removed sections;
retain council about, membership, regulation, and work-plan pages.

## 12 October 14:05 — Working programmes and annotations

Plan: verify two distinct categories at all six law/public-administration
education levels; upload one document per category in isolation and verify
correct category placement and links. Empty categories must have clear labels
without fabricated documents or generic descriptive boxes. Preserve existing
programme links and PDFs. Inspect desktop/mobile rendering.

## 12 October 14:06 — Remove faculty public discussion

Plan: verify removed faculty navigation, editor choices, and retired faculty
routes. Do not remove programme-level quality materials or unrelated content.

## 12 October 22:24 — Text formatting and image display

Expected: paragraphs, line breaks, heading levels, ordered/unordered lists,
bold and links survive editing, Word paste, storage and rendering. All law
pages share readable styles. Images retain resolution and proportions, with
explicit whole-image/crop choices and controls that preserve faces, logos,
posters and banners. Show useful file-size/dimension guidance in the editor.

Plan: create formatted text including Word-style HTML, reopen and edit it,
verify semantic output and text in storage, check malicious markup cannot
execute, and exercise PDF/link/image content. Compare whole-image and crop
states using portrait, logo, poster and banner fixtures. Inspect desktop and
mobile screenshots, error/empty/loading states, and representative pages using
shared components. Run all repository checks before merge and repeat live
visual inspection after deployment.

## 12 October 22:29 — Teacher management

Expected: add a photo to a card without one; replace/remove photos; add new
teachers; edit existing staff without duplication or lost details; unify cards
and preserve profiles while reordering/hiding/removing them. Check the actual
editor access scope, without changing account credentials.

Plan: exercise new and existing profiles (with/without photos), save/reopen,
verify stored fields and public cards, remove a photo and confirm the fallback,
reorder/hide/delete and verify the result survives reload. Verify restored or
removed seeded staff behavior is explicit. Test access for the faculty editor
and denial for unrelated scopes. Inspect desktop/mobile editor/public states
and all shared-profile regressions; run required repository checks and verify
production after merge.

## Results

Work in progress. Evidence is recorded only after executing each check.

### Prerequisite discovered during browser verification

The documented local editor crashed with SUPABASE_NOT_CONFIGURED because its
profile-list request was unconditional for the development-only admin. Guard
that request with the existing configuration check. Validate that /panel now
renders against the isolated local database; production access rules and
credentials do not change.

### News date fix — local results

- npm run lint: passed, 0 errors; 88 existing Next.js image warnings.
- npx tsc --noEmit: passed.
- npm test: passed, 59 rendered/server tests, 0 skipped.
- npm run build:vercel: passed, optimized Next.js production build.
- node tests/news-date-flow.mjs http://localhost:5197: passed real D1
  create/read/update/delete tests for Academy and department news, both card
  and article date states, stored-date retention, English copies, and rejection
  of a string masquerading as a boolean. The script refuses non-loopback hosts
  and removes its fixtures/restores the original article in finally.
- Browser: checked the department checkbox, saved it, swapped news order,
  verified persisted metadata, reloaded the editor and confirmed the checked
  setting remained. Inspected hidden-date parent cards and full articles.
- Screenshots: /tmp/apsvt-mail-validation/baseline and
  /tmp/apsvt-mail-validation/final, at 1440×1000 and 390×844, include panel,
  department card/article, Academy article, and English article. Full-page
  images and close-ups of checked/reopened controls were directly inspected.
- Browser error and failed-request arrays were empty; horizontal overflow
  checks passed. Generic appended quote and template-invented author removed.
- React review: accessible implicit checkbox label; controlled state; backwards
  compatible optional data flag; exact batched original-slug lookup for English
  date settings; server/client module boundaries preserved.
- No migrations, production content edits, account changes, or new credentials.
- Pre-existing issue: the recently added AI-training article has no authored
  English translation, so its English route falls back to Ukrainian text.
- Remaining messages (department formatting, images, staff, and faculty
  category/navigation completeness) are still in progress. Production release
  of this fix must be verified before marking this email complete.

Production-build inspection exposed a cache gap not visible in development:
English news shared a statically generated catch-all route. Move only English
news into dedicated dynamic routes so a saved date setting is visible on the
next request. Preserve the existing English news layout and URLs; keep other
English pages' rendering behavior. Rerun all required checks, the API flow,
and desktop/mobile browser checks. Confirm both news routes are marked dynamic
in the optimized production build, rather than relying solely on dev rendering.

After separating the English routes, all four required checks passed again,
as did the API flow and the complete browser scenario. The optimized build
marks both /en/news and /en/news/[slug] as dynamic. Fresh final English and
Ukrainian screenshots were opened and inspected, including the saved/reopened
checkbox and hidden-versus-visible cards. Browser error and failed-request
arrays remained empty. Production verification is pending the PR merge.
