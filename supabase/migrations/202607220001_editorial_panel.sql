create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table if not exists public.editorial_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'editor' check (role in ('editor', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'suspended')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null
);

create table if not exists public.editorial_posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null,
  category text not null,
  image_url text not null default '',
  image_alt text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_email text not null
);

create table if not exists public.editorial_content_items (
  id text primary key,
  kind text not null check (kind in ('lesson', 'exam', 'library_book', 'event', 'research_resource', 'admission_timeline')),
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_email text not null
);

create index if not exists editorial_posts_public_idx on public.editorial_posts(status, featured desc, published_at desc);
create index if not exists editorial_content_kind_sort_idx on public.editorial_content_items(kind, sort_order);
create index if not exists editorial_profiles_status_idx on public.editorial_profiles(status, role);

create or replace function private.is_approved_editor()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.editorial_profiles
    where id = (select auth.uid()) and status = 'approved' and role in ('editor', 'admin')
  );
$$;

create or replace function private.is_editorial_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.editorial_profiles
    where id = (select auth.uid()) and status = 'approved' and role = 'admin'
  );
$$;

create or replace function public.handle_new_editorial_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.editorial_profiles (id, email, display_name)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_editorial on auth.users;
create trigger on_auth_user_created_editorial
  after insert on auth.users
  for each row execute procedure public.handle_new_editorial_user();

alter table public.editorial_profiles enable row level security;
alter table public.editorial_posts enable row level security;
alter table public.editorial_content_items enable row level security;

grant select on public.editorial_posts to anon, authenticated;
grant select on public.editorial_content_items to anon, authenticated;
grant select, insert, update, delete on public.editorial_profiles to authenticated;
grant insert, update, delete on public.editorial_posts to authenticated;
grant insert, update, delete on public.editorial_content_items to authenticated;

drop policy if exists "Public can read published posts" on public.editorial_posts;
create policy "Public can read published posts" on public.editorial_posts
  for select to anon, authenticated using (status = 'published');
drop policy if exists "Approved editors manage posts" on public.editorial_posts;
create policy "Approved editors manage posts" on public.editorial_posts
  for all to authenticated using ((select private.is_approved_editor())) with check ((select private.is_approved_editor()));

drop policy if exists "Public can read operational content" on public.editorial_content_items;
create policy "Public can read operational content" on public.editorial_content_items
  for select to anon, authenticated using (true);
drop policy if exists "Approved editors manage operational content" on public.editorial_content_items;
create policy "Approved editors manage operational content" on public.editorial_content_items
  for all to authenticated using ((select private.is_approved_editor())) with check ((select private.is_approved_editor()));

drop policy if exists "Users can read their profile" on public.editorial_profiles;
create policy "Users can read their profile" on public.editorial_profiles
  for select to authenticated using (id = (select auth.uid()) or (select private.is_editorial_admin()));
drop policy if exists "Admins manage editorial profiles" on public.editorial_profiles;
create policy "Admins manage editorial profiles" on public.editorial_profiles
  for update to authenticated using ((select private.is_editorial_admin())) with check ((select private.is_editorial_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('editorial-media', 'editorial-media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view editorial media" on storage.objects;
create policy "Public can view editorial media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'editorial-media');
drop policy if exists "Approved editors upload editorial media" on storage.objects;
create policy "Approved editors upload editorial media" on storage.objects
  for insert to authenticated with check (bucket_id = 'editorial-media' and (select private.is_approved_editor()));
drop policy if exists "Approved editors update editorial media" on storage.objects;
create policy "Approved editors update editorial media" on storage.objects
  for update to authenticated using (bucket_id = 'editorial-media' and (select private.is_approved_editor())) with check (bucket_id = 'editorial-media' and (select private.is_approved_editor()));
drop policy if exists "Approved editors delete editorial media" on storage.objects;
create policy "Approved editors delete editorial media" on storage.objects
  for delete to authenticated using (bucket_id = 'editorial-media' and (select private.is_approved_editor()));
