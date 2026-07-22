create table if not exists public.workspace_items (
  id text primary key,
  title text not null,
  description text not null,
  system text not null check (system in ('workspace', 'website', 'documents', 'assessment', 'records', 'integration')),
  status text not null default 'planned' check (status in ('backlog', 'planned', 'in_progress', 'review', 'pilot', 'live', 'blocked', 'archived')),
  priority text not null default 'medium' check (priority in ('critical', 'high', 'medium', 'low')),
  owner text not null,
  progress integer not null default 0 check (progress between 0 and 100),
  due_date date,
  external_url text,
  notes text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_email text not null
);

create index if not exists workspace_items_status_sort_idx on public.workspace_items(status, sort_order);
create index if not exists workspace_items_system_idx on public.workspace_items(system);

alter table public.workspace_items enable row level security;
grant select, insert, update, delete on public.workspace_items to authenticated;

drop policy if exists "Approved users can read workspace" on public.workspace_items;
create policy "Approved users can read workspace" on public.workspace_items
  for select to authenticated using ((select private.is_approved_editor()));

drop policy if exists "Approved users create workspace items" on public.workspace_items;
create policy "Approved users create workspace items" on public.workspace_items
  for insert to authenticated with check ((select private.is_approved_editor()));

drop policy if exists "Approved users update workspace details" on public.workspace_items;
create policy "Approved users update workspace details" on public.workspace_items
  for update to authenticated using ((select private.is_approved_editor())) with check ((select private.is_approved_editor()));

drop policy if exists "Admins delete workspace items" on public.workspace_items;
create policy "Admins delete workspace items" on public.workspace_items
  for delete to authenticated using ((select private.is_editorial_admin()));

create or replace function private.protect_workspace_status()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.status is distinct from new.status
    and coalesce((select auth.role()), '') <> 'service_role'
    and not (select private.is_editorial_admin()) then
    raise exception 'Only administrators can change workspace status';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_workspace_status on public.workspace_items;
create trigger protect_workspace_status
  before update of status on public.workspace_items
  for each row execute procedure private.protect_workspace_status();
