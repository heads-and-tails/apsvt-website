# Faculty profile binding validation — 13 October 2026

Production screenshot review of PR #36 found old position-based faculty overrides
painting a saved photo/biography onto a different teacher after insertion/reorder.
Baseline: /tmp/apsvt-law-content/production/faculty-teachers-{desktop,mobile}.png.

Expected: resolve legacy faculty card edits against their original seeded person
before applying full profile edits and sorting. Keep the original identity in the
editor snapshot, retain authored names/biographies/portraits, and prevent the client
from applying the old selectors again. New complete profiles must take precedence,
including explicit photo removal, hiding and deletion. Do not mutate stored records.

Plan before edits:
- Copy public faculty entries into isolated local D1; no production writes.
- Assert old photo/title/summary edits follow their original person even when a
  managed teacher sorts first; newest named photo wins; modern profile removal wins.
- Inspect actual public records and saved editor snapshots for every faculty card,
  desktop 1440×1000, tablet 768×1024 and mobile 390×844; compare baseline screenshots.
- Exercise photo-only editing and reorder with the resolved source identity.
- Recheck leadership and one department/shared finance profile page, plus UA/EN news.
- Inspect console/network failures; investigate production-only 400/404 requests
  found by the preceding full live pass (93 scenarios completed, error checks failed).
- Run lint, TypeScript, all repository tests and optimized Vercel build; normal PR
  merge, matching production SHA/alias, fresh live screenshots and association checks.

Results before merge: lint passed (0 errors, 84 existing image warnings),
TypeScript passed, npm test passed (65 tests, 0 skipped), and build:vercel passed
with exit 0. Copies of 54 actual public faculty records were tested in local D1.
The profile association assertions passed for all ten cards, including the authored
rename to Карина Ящук, newest named portraits and intentionally empty biographies.
The editor retained the original source identity; saving at order 0 with the photo
removed neither duplicated the card nor resurrected its legacy portrait. Other
portraits and names stayed bound correctly. A test locator initially used the wrong
label for the order field; the corrected editor scenario passed independently.

A fresh complete read-only browser rerun passed 18 scenarios (six routes at
1440×1000, 768×1024 and 390×844), with no page errors, HTTP failures or horizontal
overflow locally. Screenshots/full pages/profile close-ups in
/tmp/apsvt-law-content/binding-final were opened and directly inspected against
the production baseline. Faculty leadership, the constitutional-law department,
shared finance profiles, and Ukrainian/English news remained intact. The existing
faculty hero loads directly, avoiding the rejected image-optimizer request without
changing global image configuration. No migrations, environment/auth changes,
production data writes or new institutional copy. The merged SHA/deployment and
fresh live validation results are recorded on this follow-up PR after release.
