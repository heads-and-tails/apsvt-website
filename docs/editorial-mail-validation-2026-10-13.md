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
- node tests/news-date-flow.test.mjs http://localhost:5197: passed real D1
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

## Production completion of PR #33

Merged PR: https://github.com/heads-and-tails/apsvt-website/pull/33
Main commit: d2eb1dc377c267c8deb1079e675c17226ea9b28e
Deployment: apsvt-academy-website-1mwg2xy89-signal-media.vercel.app
Deployment ID: dpl_3eVqN94zAPbfD2kfMxR6wDUuaEMr
Vercel reported READY, production, and the matching main SHA. Inspecting
www.socosvita.kiev.ua resolved to that same deployment ID. Live Ukrainian,
English, and department pages returned 200, with no overflow, page exceptions,
or failed requests. Fresh desktop/mobile production screenshots in
/tmp/apsvt-mail-validation/production were opened and directly inspected.
No generic appended quote or template-invented author appeared. No real account
credentials were changed and no test news was published to the production DB.

## Department content implementation — strategy before editing

Scope: the 12 October 14:02 content-management request and the 22:24 formatting
and image requirements, with the staff-specific controls reviewed subsequently.
Keep existing authored information, navigation, colours, and typography. Fix
nested wrappers and forced-height image cropping; do not generate descriptions,
biographies, empty paragraph cards, or additional generic text boxes.

- Capture and inspect fresh baseline about/staff views of each law department
  at 1440×1000, 768×1024, and 390×844. Use the actual stored 3295-character,
  21-line-break description as a local fixture, rather than inventing copy.
- Rich-text tests: Word-style pasted paragraphs/headings/lists/bold/links,
  keyboard editing, undo, save/reopen, empty content, legacy plain text and
  Markdown, and malicious markup/unsafe URLs. Inspect semantic public output.
- Media tests: original upload bytes retained; original image dimensions;
  portrait/logo/poster/banner displayed proportionally; whole-image default,
  optional controlled crop/focus; replace/remove; useful size/format guidance.
- Section/article/news/staff content can carry PDFs and sensible named links;
  verify attachments and multiple news photos after save and reload.
- Test all five sections and existing-profile preservation on all four pages.
  Inspect loading/empty/error states and failed network requests. Use a real
  isolated D1/R2 development database for fixtures; no fake production content.
- Check the public content API returns all rendering flags and timestamps.
  Check client-rendered pages as well as server-rendered law pages. Include
  an unchecked date option with no manually entered date, using the actual
  creation timestamp as the publication-date fallback.
- Inspect desktop/tablet/mobile final screenshots and relevant interaction
  states, plus Ukrainian/English news and representative shared profile pages.
- Run lint, TypeScript, all repository tests, functional upload/content checks,
  and the optimized Vercel build on the final code. Review the full diff,
  satisfy PR checks, merge, and verify the matching production deployment and
  live screenshots. No required check may be skipped.

Staff preservation is part of this implementation, because the existing native
card edit action does not load the complete biography, role, tags, or links.
Validate a photo-only edit against a full card snapshot, with and without a
photo; preserve all other fields. A seeded card must stay removed when deleting
its override (use an explicit visibility tombstone rather than accidentally
restoring the old card). Verify new/renamed/reordered/hidden profiles separately.

Additional discovered boundaries: the shared public API omitted rendering flags
and timestamps; uploads had a Supabase-only client path despite a working D1/R2
server fallback. Validate both actual configurations and preserve original file
bytes. Default publication timestamps must be set on first publication, including
draft-to-published transitions, rather than substituting an earlier draft date.

Programme validation exposed another local-storage gap: document uploads worked
with R2 but publishing required Supabase exclusively. Add the same isolated D1
fallback used by other content, keeping the existing production Supabase path.
Keep document records out of public research-resource lists. Validate create,
read, update, draft visibility, delete and category separation at all six levels
using real local uploads; inspect empty category headings and preserve existing
programme links. No production test documents or authentication changes.

### Department content, staff and programme results

- Word paste retained paragraphs, hard breaks, heading levels, bold, bullet
  lists, ordered lists starting at 3 and links. Scripts in pasted markup did
  not execute. Save/reopen and semantic public rendering passed at 1440×1000,
  768×1024 and 390×844. Empty content stays empty. Undo history is reset for
  each editing session, including after a save, to avoid restoring another
  record's biography or previously saved text into a blank form.
- Real D1/R2 uploads passed original SHA-256 comparisons for a 4 MB JPEG and
  a 1 MB repository PDF. The new fallback sends original bytes, avoiding
  vinext's progressive multipart action limit; production continues to use
  signed Supabase uploads. The Documents form now uses that shared client too.
- Browser staff checks passed on all four departments and the faculty page:
  source binding, complete role/summary/biography/tag/link preservation during
  photo-only edits, adding missing photos, replacing/removing photos, controlled
  crop/focus save/reopen, deleting/hiding and restoring a seeded person, adding,
  renaming and permanently deleting a new person. Dean photo-only editing also
  preserved the entire profile, and seeded rename/reorder preserved metadata.
  Existing profiles are replaced once rather than duplicated in section extras.
- Real API tests passed for both document categories at all six programme
  levels, including drafts, updates, deletion, empty headings and research-list
  isolation. A real PDF was uploaded and assigned through the Documents UI.
- Client-rendered /about checks passed for hidden and visible dates, default
  publication timestamp and hidden-entry filtering. Public flags and media
  round-trip through /api/page-materials without exposing authorEmail. First
  publication uses the publish transition, preserving stored dates thereafter.
- Existing news-date integration test passed again for Academy, department and
  English cards/articles, reversal, retained timestamps and invalid booleans.
- Configured faculty editor scopes permit all four departments, the faculty
  and all its subpages, while unrelated news, schedules and departments are
  denied. No role or account credentials changed. An authenticated production
  write as the sender was not performed: Vercel does not export the protected
  service credential, and no password reset or email was requested.
- The existing automated render check confirms council meetings/decisions/
  protocols and faculty discussion URLs return 404; remaining council pages
  return 200. All six programme pages retain distinct labelled categories.
- Browser evidence/logs: /tmp/apsvt-law-content/{word-results,staff-results,
  extra-results}.json, content-flow.log and news-regression.log. All fixtures
  stay in the isolated worktree database; none were published to production.
- React review: stable keys isolate editor history; headings and controls are
  labelled; whole-image rendering preserves proportions; safe links use
  noopener/noreferrer; scoped page checks remain in every write route.

Final required checks, full responsive screenshot inspection and production
verification are pending the release review below.

### Final release validation

All required checks passed on the final implementation: npm run lint (0 errors,
84 existing image warnings), npx tsc --noEmit, npm test (64 passed, 0 skipped),
and npm run build:vercel. Both real API flow scripts passed again. Responsive
browser verification passed 93 scenarios at 1440×1000, 768×1024 and 390×844:
all five section controls on all four departments, all six programme pages,
faculty leadership and staff, shared finance profiles, and Ukrainian/English
news. Console/page-error and HTTP/network-failure arrays are empty; no horizontal
overflow. Dynamic articles no longer request unsupported page-material URLs.
Screenshots are in /tmp/apsvt-law-content/final, including full pages and text,
photo and editor close-ups; affected layouts and representative regressions were
opened and directly inspected. Instant scrolling during capture lets the site's
existing reveal animations paint every row; it does not modify website behavior.
Baseline views and authored text/image comparisons are in the baseline directory.

Mobile editor inspection additionally checked internal media-panel scroll width,
since page-level overflow can hide a clipped grid track. Explicit minimum-zero
tracks and bounded file controls now fit within the form; refreshed tablet/mobile
photo-editor screenshots and the internal-boundary assertions passed. Teacher
photo descriptions are retained in the public image alt attribute; the real API
flow includes this assertion. Required checks are rerun after these final fixes.

The required checks also passed on the final mobile-boundary/alt-description
revision: lint 0 errors (84 existing warnings), TypeScript, 64 tests with zero
skips, and optimized Vercel build. The real content/upload/category test and
refreshed tablet/mobile editor checks passed after the fix. Release SHA,
deployment identity and live verification are recorded on the release PR.

### Email disposition

Times below use Kyiv time. All ten messages remain unread in Gmail.

| Email | Before this audit | Verified disposition |
| --- | --- | --- |
| 9 Oct 21:16: hide publication dates | Academy option existed; department/English flows incomplete | Fixed across cards/articles, with reversible storage and default publication dates |
| 12 Oct 09:56: earlier work not completed | Follow-up on the date request | Original request rechecked and fixed |
| 12 Oct 14:02: five department sections and self-service content | Structure in PR #26; complete editing/media flows incomplete | Four consistent department templates; rich text, media, PDFs, staff and contact editing verified |
| 12 Oct 14:03: council meetings and decisions/protocols | Implemented in PR #26 | Navigation absent; retired routes 404; remaining council pages retained |
| 12 Oct 14:05: working programmes and annotations | Categories present; empty headings and document uploads needed fixes | Both categories on all six levels, upload/save/draft/edit/delete verified |
| 12 Oct 14:06: faculty public discussion removal | Implemented in PR #26 | Faculty navigation and routes removed; programme quality materials retained |
| 12 Oct 18:36: thank-you | Acknowledgement | No additional work requested |
| 12 Oct 21:05: thank-you | Acknowledgement | No additional work requested |
| 12 Oct 22:24: formatting and proportional images | Incomplete | Word formatting, readable semantics, whole-image/crop/focus controls and original uploads verified |
| 12 Oct 22:29: teacher/photo management | Incomplete | Complete profiles, photo-only preservation, new cards, rename/order/hide/delete/restore verified |

Main integration: PR #34's finance document/course changes and PR #35's editor
follow-up landed during validation. The release integrates both. Preserve the
legacy imageFit field and existing selections, including native image overrides,
while defaulting new uploads to whole-image display. The visual editor retains
the follow-up's bold/link/ordered-list/line-break support and adds Word paste,
semantic rendering and complete media/profile management. Recheck legacy fit
round-trips, all required checks, staff preservation and shared finance views
against the integrated branch before merge.

Legacy-content review found named teacher image overrides stored against the
old department layout. Preserve those explicitly named uploads when resolving
native profiles; current whole-profile edits take precedence, so removal does
not resurrect an old picture. Validate with copies of the actual public records
in the isolated database, confirm every named photo appears exactly once, and
confirm photo-only editing retains that picture and the rest of the profile.

The integrated branch passed all API/UI scenarios again, plus 93 responsive
public scenarios with empty error/failure arrays. Seven actual, explicitly named
legacy photo uploads appeared once each; removing a photo from its full profile
kept it removed. Fresh integrated screenshots are in integrated-final. Shared
programme quality sections now use the same rich renderer: real API and desktop/
mobile browser checks retained bold and ordered lists without exposing technical
rich-text data. Final required checks are run after this compatibility update.
