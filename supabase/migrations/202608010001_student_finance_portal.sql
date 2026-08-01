create table if not exists public.student_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  student_number text not null unique,
  programme text not null,
  degree_level text not null check (degree_level in ('bachelor', 'master', 'phd')),
  study_form text not null check (study_form in ('full_time', 'part_time')),
  course integer not null check (course between 1 and 6),
  group_name text not null default '',
  status text not null default 'active' check (status in ('active', 'academic_leave', 'graduated', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_contracts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  contract_number text not null,
  title text not null,
  signed_at date,
  valid_from date,
  valid_to date,
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  currency text not null default 'UAH',
  status text not null default 'active' check (status in ('draft', 'active', 'completed', 'terminated')),
  file_path text,
  file_name text,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, contract_number)
);

create table if not exists public.student_charges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  contract_id uuid references public.student_contracts(id) on delete set null,
  title text not null,
  period text not null default '',
  amount numeric(12,2) not null check (amount > 0),
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  due_date date not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'due', 'overdue', 'paid', 'cancelled')),
  payment_purpose text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  charge_id uuid references public.student_charges(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  paid_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'failed', 'refunded')),
  provider text not null default 'manual',
  provider_reference text not null default '',
  receipt_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.student_notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  category text not null default 'general' check (category in ('payment', 'overdue', 'contract', 'general')),
  title text not null,
  message text not null,
  action_url text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists student_profiles_email_idx on public.student_profiles(lower(email));
create index if not exists student_contracts_student_idx on public.student_contracts(student_id, created_at desc);
create index if not exists student_charges_student_due_idx on public.student_charges(student_id, due_date desc);
create index if not exists student_payments_student_paid_idx on public.student_payments(student_id, paid_at desc);
create index if not exists student_notifications_student_created_idx on public.student_notifications(student_id, created_at desc);

create or replace function public.handle_new_editorial_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'account_type', 'editorial') <> 'student' then
    insert into public.editorial_profiles (id, email, display_name)
    values (
      new.id,
      lower(coalesce(new.email, '')),
      coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', new.email)
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

alter table public.student_profiles enable row level security;
alter table public.student_contracts enable row level security;
alter table public.student_charges enable row level security;
alter table public.student_payments enable row level security;
alter table public.student_notifications enable row level security;

grant select on public.student_profiles to authenticated;
grant select on public.student_contracts to authenticated;
grant select on public.student_charges to authenticated;
grant select on public.student_payments to authenticated;
grant select on public.student_notifications to authenticated;

drop policy if exists "Students read own profile" on public.student_profiles;
create policy "Students read own profile" on public.student_profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "Students read own contracts" on public.student_contracts;
create policy "Students read own contracts" on public.student_contracts
  for select to authenticated using (student_id = (select auth.uid()));

drop policy if exists "Students read own charges" on public.student_charges;
create policy "Students read own charges" on public.student_charges
  for select to authenticated using (student_id = (select auth.uid()));

drop policy if exists "Students read own payments" on public.student_payments;
create policy "Students read own payments" on public.student_payments
  for select to authenticated using (student_id = (select auth.uid()));

drop policy if exists "Students read own notifications" on public.student_notifications;
create policy "Students read own notifications" on public.student_notifications
  for select to authenticated using (student_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'student-contracts',
  'student-contracts',
  false,
  20971520,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
