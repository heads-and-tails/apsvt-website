alter table public.editorial_profiles
  add column if not exists access_scope text not null default '*';

update public.editorial_profiles
set access_scope = '*'
where access_scope is null or access_scope = '';

alter table public.editorial_profiles
  drop constraint if exists editorial_profiles_access_scope_check;

alter table public.editorial_profiles
  add constraint editorial_profiles_access_scope_check
  check (access_scope = '*' or access_scope like '/%');

create index if not exists editorial_profiles_access_scope_idx
  on public.editorial_profiles(access_scope);

create or replace function private.can_edit_page(target_path text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.editorial_profiles
    where id = (select auth.uid())
      and status = 'approved'
      and (
        role = 'admin'
        or access_scope = '*'
        or access_scope = target_path
      )
  );
$$;

drop policy if exists "Approved editors manage posts" on public.editorial_posts;
create policy "Approved editors manage posts" on public.editorial_posts
  for all to authenticated
  using ((select private.can_edit_page('/news')))
  with check ((select private.can_edit_page('/news')));

drop policy if exists "Approved editors manage operational content" on public.editorial_content_items;
create policy "Approved editors manage operational content" on public.editorial_content_items
  for all to authenticated
  using ((select private.can_edit_page(
    case kind
      when 'lesson' then '/schedule'
      when 'exam' then '/exam-schedule'
      when 'library_book' then '/facilities/library'
      when 'event' then '/events'
      when 'research_resource' then '/research'
      when 'admission_timeline' then '/admissions'
      else ''
    end
  )))
  with check ((select private.can_edit_page(
    case kind
      when 'lesson' then '/schedule'
      when 'exam' then '/exam-schedule'
      when 'library_book' then '/facilities/library'
      when 'event' then '/events'
      when 'research_resource' then '/research'
      when 'admission_timeline' then '/admissions'
      else ''
    end
  )));

drop policy if exists "Approved editors manage documents" on public.editorial_documents;
create policy "Approved editors manage documents" on public.editorial_documents
  for all to authenticated
  using ((select private.can_edit_page(page_path)))
  with check ((select private.can_edit_page(page_path)));
