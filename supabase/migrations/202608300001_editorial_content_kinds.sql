alter table public.editorial_content_items
  drop constraint if exists editorial_content_items_kind_check;

alter table public.editorial_content_items
  add constraint editorial_content_items_kind_check
  check (kind in (
    'lesson',
    'exam',
    'library_book',
    'event',
    'research_resource',
    'student_thesis',
    'admission_timeline',
    'vacancy'
  ));
