# Historical bachelor's programme discussions

## Acceptance and strategy recorded before implementation

Restore the supplied invitations and discussion reports dated 18 April 2023,
7 March 2024 and 19 May 2025: six archived articles, the source paragraphs,
three corresponding draft OPP PDFs, and two supplied original photographs per
report. Keep original historical dates and source wording, including invitations'
historical future tense. Do not invent participants, event details or publication
times. Do not add these historical records to the current news feed.

Use stable native archive routes, the existing archive search/year controls,
existing article typography and uncropped image component. Add plain archive
links on the bachelor's programme page. Preserve every existing archive record.
The supplied Word files are migration sources. Old node IDs lack a verified
record-by-record mapping, so no guessed redirects are introduced.

Desktop 1440×1000 and mobile 390×844 baseline screenshots under
`/tmp/apsvt-email-1016/archive-baseline/` were captured and directly inspected;
search for `Публічне управління` returned zero records. The archive currently
contains 745 news records. The bachelor's programme baseline is its verified
production release under `bachelor-production/`. All six source photographs
were directly inspected before implementation.

Verify archive search returns exactly these six additions, and year filters
return two for each year. Navigate from search and programme links to every
article; compare every paragraph, historical date, project PDF and photograph
against the sources. Check unknown article 404, programme/archive return links,
image loading, full-image aspect ratio, long headings and horizontal overflow.
Inspect browser console and network failures. Directly inspect fresh desktop
and mobile full pages and article/gallery close-ups. Check current news,
master's programme and English representative pages for regressions.

Add automated coverage for the six dated source records, original text hashes,
original image hashes, archive indexing and isolation from current news. Run
lint, TypeScript, all tests and Vercel build before committing. Review/merge a
green PR, verify exact main SHA, READY deployment and public alias, then repeat
the complete archive/article/photo flow and visual inspection on production.
Only after this gate may the bachelor's source email receive its consolidated
completion reply and read-status update.

The news-page archive teaser has a fixed catalogue count. Its existing desktop/
mobile rendering under `archive-news-baseline/` was inspected before updating
745 to 751; keep all current news cards unchanged. Check that teaser in final
local and production screenshots as well.

## Final local results

- Lint passed with 84 existing image warnings and no errors. TypeScript, all
  84 tests and the Vercel build passed after the final scoped heading adjustment.
- Every one of the 29 source paragraphs, six original JPEG hashes and three
  original project PDF hashes passed. All 938 pre-existing index records are
  unchanged; the six additions bring the news archive from 745 to 751 records.
- All six articles passed at desktop 1440×1000 and mobile 390×844: search/year
  filtering, article and programme links, return navigation, actual project-PDF
  browser clicks, historical dates, uncropped images and unknown-record 404.
  Current news contains none of the six historical article URLs.
- No console/page errors, unexpected failed requests or horizontal overflow.
  Full screenshots of all six articles at both sizes, search results, programme
  links and gallery close-ups under `/tmp/apsvt-email-1016/archive-local/` were
  directly inspected. Initial loading-transition captures were replaced with
  settled captures; long desktop headings were corrected within the new route.
- News teaser, master's page and English programme regression captures passed
  at both sizes and were directly inspected under `archive-regressions/`.
- React review: static server-rendered content, typed source data, stable keys,
  semantic links/dates and existing rich-text/image components. No client state,
  new dependencies, invented public facts or filler panels were introduced.
- Exact production commit/alias, live flows and production screenshots remain
  the post-merge gate, recorded in the private run ledger.
