alter table public.editorial_profiles
  drop constraint if exists editorial_profiles_access_scope_check;

alter table public.editorial_profiles
  add constraint editorial_profiles_access_scope_check
  check (
    access_scope = '*'
    or access_scope ~ '^/[^,]+(,/[^,]+)*$'
  );

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
        or target_path = any(string_to_array(access_scope, ','))
      )
  );
$$;
