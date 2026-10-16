# Archive language navigation follow-up

Production validation of the restored six articles found that the shared EN
control prefetched nonexistent English article routes. Keep the source articles
in Ukrainian and send their EN control to the existing English news index.
Apply the same explicit destination to the archive index. Give the shared header
an optional destination override; preserve every default language mapping.

This changes link destinations only, so no new visual baseline is necessary.
Existing production article/search screenshots are under
`/tmp/apsvt-email-1016/archive-production/`; the failed-prefetch evidence and
console diagnostic identify the actual missing URLs. Inspect fresh article
screenshots after the correction and the resulting English news page at desktop
1440×1000 and mobile 390×844. Exercise EN from the archive and all six articles,
then UA from English news. Verify default UA/EN programme header links separately.

Add a server regression check for the explicit EN destinations and existing
English news route. Run lint, TypeScript, all tests and Vercel build. Repeat the
complete archive flow, original paragraph/photo/project checks, year filters,
programme navigation and responsive screenshots. Record console errors with their
source URLs; exclude only the previously recorded unrelated English department,
thesis and professional-education prefetch failures. Every new archive 404 must
be resolved, never ignored. Merge a green follow-up PR and verify the exact READY
main deployment and public alias before repeating those checks live and closing
the original source email.

## Local results

- Lint (84 existing warnings, no errors), TypeScript, all 85 tests and Vercel
  build passed. The full scoped diff passed review and whitespace checks.
- Fourteen archive/article language round trips passed across desktop and
  mobile. Every EN destination loads the existing English news index; UA returns
  to Ukrainian news. All original article, date, search/year, photo/project hash,
  download and programme-navigation checks passed again with no console/page
  errors, unexpected requests or overflow.
- Fresh archive/article and English-destination captures under
  `/tmp/apsvt-email-1016/archive-final-local/` were captured after the loading
  transition. Representative full pages, gallery, archive/programme links and
  both English-destination views were directly inspected.
- Default management-programme UA→EN→UA navigation also passed at both sizes;
  all four fresh header screenshots under `language-default-regressions/` were
  directly inspected. Existing default language paths and design are preserved.
- No source text, style, auth, schema, environment or dependency change. Exact
  production follow-up SHA/alias and live verification remain required.
