-- Replace only the requested outdated link in the two Marketing discussion notices.
-- Other text, event dates and editorial metadata remain unchanged; reruns are harmless.
UPDATE public.editorial_posts
SET body = replace(body, 'З ОПП «Маркетинг» можна ознайомитися за посиланням: https://drive.google.com/drive/folders/1dcgVBio_3E2kyrMCDS-neHA2SDEBT3pr?usp=drive_link', '[Проєкт ОПП «Маркетинг»](/documents/marketing/programmes/project-marketing-master-2026.pdf)')
WHERE id IN ('seed-marketing-discussion-march-2026', 'seed-marketing-discussion-may-2026')
  AND strpos(body, 'З ОПП «Маркетинг» можна ознайомитися за посиланням: https://drive.google.com/drive/folders/1dcgVBio_3E2kyrMCDS-neHA2SDEBT3pr?usp=drive_link') > 0;
