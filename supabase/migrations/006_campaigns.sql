-- 006_campaigns.sql

create type campaign_status as enum ('draft', 'scheduled', 'active', 'ended');

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text,
  image_desktop_url text,
  image_mobile_url text,
  button_label text,
  button_link text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status campaign_status not null default 'draft',
  priority int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  check (ends_at > starts_at)
);

create trigger campaigns_set_updated_at
  before update on campaigns
  for each row execute function set_updated_at();

create table campaign_stores (
  campaign_id uuid not null references campaigns(id) on delete cascade,
  store_id uuid not null references stores(id) on delete cascade,
  primary key (campaign_id, store_id)
);

create table campaign_products (
  campaign_id uuid not null references campaigns(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  primary key (campaign_id, product_id)
);

-- A campaign is publicly visible once its status allows it AND it is
-- inside its date window. Status doesn't need a manual flip from
-- "scheduled" to "active" — the date window is the real switch; "draft"
-- and "ended" are the only statuses that force it hidden regardless of
-- dates, for manual override.
alter table campaigns enable row level security;
alter table campaign_stores enable row level security;
alter table campaign_products enable row level security;

create policy "campaigns: public read active in window" on campaigns
  for select using (
    (status in ('scheduled', 'active') and now() between starts_at and ends_at) or is_staff()
  );
create policy "campaigns: editor write" on campaigns
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "campaign_stores: public read" on campaign_stores
  for select using (true);
create policy "campaign_stores: editor write" on campaign_stores
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "campaign_products: public read" on campaign_products
  for select using (true);
create policy "campaign_products: editor write" on campaign_products
  for all using (has_role('editor')) with check (has_role('editor'));
