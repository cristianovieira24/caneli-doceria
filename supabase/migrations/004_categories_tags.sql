-- 004_categories_tags.sql

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  icon text,
  display_order int not null default 0,
  visible boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on categories
  for each row execute function set_updated_at();

create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

alter table categories enable row level security;
alter table tags enable row level security;

create policy "categories: public read visible" on categories
  for select using (visible or is_staff());
create policy "categories: editor write" on categories
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "tags: public read" on tags
  for select using (true);
create policy "tags: editor write" on tags
  for all using (has_role('editor')) with check (has_role('editor'));
