-- 003_stores.sql

create type store_status as enum ('active', 'temporarily_closed');
create type order_mode as enum ('whatsapp', 'external_link', 'menu_only', 'internal');

create table stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  neighborhood text not null,
  address text not null,
  city text not null default 'Goiânia',
  state text not null default 'GO',
  zip_code text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  whatsapp text not null,
  phone text,
  order_mode order_mode not null default 'whatsapp',
  external_delivery_links jsonb not null default '[]'::jsonb,
  photo_url text,
  description text,
  status store_status not null default 'active',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create trigger stores_set_updated_at
  before update on stores
  for each row execute function set_updated_at();

create table store_hours (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6), -- 0 = domingo
  opens_at time,
  closes_at time,
  closed boolean not null default false,
  unique (store_id, weekday)
);

create table special_hours (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  date date not null,
  opens_at time,
  closes_at time,
  closed boolean not null default false,
  note text,
  unique (store_id, date)
);

alter table stores enable row level security;
alter table store_hours enable row level security;
alter table special_hours enable row level security;

create policy "stores: public read active" on stores
  for select using (status = 'active' or is_staff());

create policy "stores: editor write" on stores
  for insert with check (has_role('editor'));
create policy "stores: editor update" on stores
  for update using (has_role('editor'));
create policy "stores: admin delete" on stores
  for delete using (has_role('administrador'));

create policy "store_hours: public read" on store_hours
  for select using (true);
create policy "store_hours: editor write" on store_hours
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "special_hours: public read" on special_hours
  for select using (true);
create policy "special_hours: editor write" on special_hours
  for all using (has_role('editor')) with check (has_role('editor'));
