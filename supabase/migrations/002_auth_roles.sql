-- 002_auth_roles.sql
-- Admin roles for the /admin panel. Public storefront visitors never get a row here.

create type app_role as enum ('proprietario', 'administrador', 'editor');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Helper used throughout RLS policies below.
create or replace function has_role(check_role app_role)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid()
      and (role = check_role
        or (check_role = 'editor' and role in ('administrador', 'proprietario'))
        or (check_role = 'administrador' and role = 'proprietario'))
  );
$$;

create or replace function is_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from user_roles where user_id = auth.uid());
$$;

alter table profiles enable row level security;
alter table user_roles enable row level security;

create policy "profiles: self read" on profiles
  for select using (auth.uid() = id);

create policy "profiles: self update" on profiles
  for update using (auth.uid() = id);

create policy "user_roles: staff read own" on user_roles
  for select using (auth.uid() = user_id or has_role('administrador'));

create policy "user_roles: owner manages" on user_roles
  for all using (has_role('proprietario')) with check (has_role('proprietario'));
