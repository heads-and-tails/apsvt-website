create table if not exists public.editorial_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'Документ',
  page_path text not null,
  file_url text not null,
  file_name text not null,
  mime_type text not null default 'application/octet-stream',
  file_size bigint not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_email text not null
);

create index if not exists editorial_documents_page_status_idx
  on public.editorial_documents(page_path, status, sort_order, created_at desc);

alter table public.editorial_documents enable row level security;
grant select on public.editorial_documents to anon, authenticated;
grant insert, update, delete on public.editorial_documents to authenticated;

drop policy if exists "Public can read published documents" on public.editorial_documents;
create policy "Public can read published documents" on public.editorial_documents
  for select to anon, authenticated using (status = 'published');

drop policy if exists "Approved editors manage documents" on public.editorial_documents;
create policy "Approved editors manage documents" on public.editorial_documents
  for all to authenticated
  using ((select private.is_approved_editor()))
  with check ((select private.is_approved_editor()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'editorial-documents',
  'editorial-documents',
  true,
  20971520,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view editorial documents" on storage.objects;
create policy "Public can view editorial documents" on storage.objects
  for select to anon, authenticated using (bucket_id = 'editorial-documents');

drop policy if exists "Approved editors upload documents" on storage.objects;
create policy "Approved editors upload documents" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'editorial-documents' and (select private.is_approved_editor()));

drop policy if exists "Approved editors update documents" on storage.objects;
create policy "Approved editors update documents" on storage.objects
  for update to authenticated
  using (bucket_id = 'editorial-documents' and (select private.is_approved_editor()))
  with check (bucket_id = 'editorial-documents' and (select private.is_approved_editor()));

drop policy if exists "Approved editors delete documents" on storage.objects;
create policy "Approved editors delete documents" on storage.objects
  for delete to authenticated
  using (bucket_id = 'editorial-documents' and (select private.is_approved_editor()));
