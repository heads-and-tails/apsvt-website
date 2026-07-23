create table if not exists public.scheduler_items (
  id uuid primary key,
  kind text not null check (kind in ('staff','availability','requirement','run','question')),
  status text not null default 'active',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_email text not null
);

create index if not exists scheduler_items_kind_updated_idx
  on public.scheduler_items (kind, updated_at desc);

alter table public.scheduler_items enable row level security;

drop policy if exists "Approved editorial users can read scheduler" on public.scheduler_items;
create policy "Approved editorial users can read scheduler"
on public.scheduler_items for select
to authenticated
using (
  exists (
    select 1 from public.editorial_profiles profile
    where profile.id = auth.uid() and profile.status = 'approved'
  )
);

revoke all on public.scheduler_items from anon;
grant select on public.scheduler_items to authenticated;
