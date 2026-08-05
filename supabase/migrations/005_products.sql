-- 005_products.sql

create type product_status as enum ('draft', 'published', 'archived');
create type price_prefix as enum ('', 'a partir de');

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  full_description text,
  category_id uuid not null references categories(id) on delete restrict,
  price numeric(10,2) not null check (price >= 0),
  promo_price numeric(10,2) check (promo_price is null or promo_price >= 0),
  price_prefix price_prefix not null default '',
  weight_or_size text,
  yield_info text,
  ingredients text,
  allergen_notes text,
  featured boolean not null default false,
  seasonal boolean not null default false,
  status product_status not null default 'draft',
  display_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index products_category_idx on products(category_id);
create index products_status_idx on products(status);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  is_primary boolean not null default false,
  display_order int not null default 0
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  price_delta numeric(10,2) not null default 0,
  display_order int not null default 0
);

create table product_addons (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  display_order int not null default 0
);

create table product_tags (
  product_id uuid not null references products(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- Per-store availability & price overrides — the menu can legitimately
-- differ between units.
create table store_products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  available boolean not null default true,
  hidden boolean not null default false,
  price_override numeric(10,2),
  promo_price_override numeric(10,2),
  stock_limit int,
  note text,
  external_link text,
  unique (store_id, product_id)
);

alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table product_addons enable row level security;
alter table product_tags enable row level security;
alter table store_products enable row level security;

create policy "products: public read published" on products
  for select using (status = 'published' or is_staff());
create policy "products: editor write" on products
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "product_images: public read" on product_images
  for select using (true);
create policy "product_images: editor write" on product_images
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "product_variants: public read" on product_variants
  for select using (true);
create policy "product_variants: editor write" on product_variants
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "product_addons: public read" on product_addons
  for select using (true);
create policy "product_addons: editor write" on product_addons
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "product_tags: public read" on product_tags
  for select using (true);
create policy "product_tags: editor write" on product_tags
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "store_products: public read available" on store_products
  for select using (not hidden or is_staff());
create policy "store_products: editor write" on store_products
  for all using (has_role('editor')) with check (has_role('editor'));
