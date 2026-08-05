-- 007_content_leads.sql

create type lead_status as enum ('novo', 'em_contato', 'orcamento_enviado', 'confirmado', 'concluido', 'cancelado');

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  order_type text not null,
  preferred_store_id uuid references stores(id),
  desired_date date,
  people_count int,
  budget_hint text,
  description text not null,
  reference_image_url text,
  consent boolean not null default false,
  status lead_status not null default 'novo',
  created_at timestamptz not null default now()
);

create table lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  visible boolean not null default true
);

create table external_links (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  label text not null, -- "iFood", "99Food", "VucaFood"
  url text not null,
  display_order int not null default 0
);

-- Structured, predictable content blocks (hero copy, sobre, rodapé) —
-- deliberately not a freeform page builder, per project brief.
create table content_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique, -- e.g. "home_hero", "sobre_intro", "footer_note"
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create trigger content_sections_set_updated_at
  before update on content_sections
  for each row execute function set_updated_at();

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  file_name text not null,
  alt text not null default '',
  size_bytes int,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null, -- e.g. "product.update", "store.delete"
  entity_type text not null,
  entity_id uuid,
  diff jsonb,
  created_at timestamptz not null default now()
);

alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table faq_items enable row level security;
alter table external_links enable row level security;
alter table content_sections enable row level security;
alter table site_settings enable row level security;
alter table media enable row level security;
alter table audit_logs enable row level security;

-- Anyone can submit an encomenda lead; only staff can read/manage them.
create policy "leads: public insert" on leads
  for insert with check (true);
create policy "leads: staff read" on leads
  for select using (is_staff());
create policy "leads: staff update" on leads
  for update using (has_role('editor'));

create policy "lead_notes: staff only" on lead_notes
  for all using (is_staff()) with check (is_staff());

create policy "faq_items: public read visible" on faq_items
  for select using (visible or is_staff());
create policy "faq_items: editor write" on faq_items
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "external_links: public read" on external_links
  for select using (true);
create policy "external_links: editor write" on external_links
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "content_sections: public read" on content_sections
  for select using (true);
create policy "content_sections: editor write" on content_sections
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "site_settings: public read" on site_settings
  for select using (true);
create policy "site_settings: admin write" on site_settings
  for all using (has_role('administrador')) with check (has_role('administrador'));

create policy "media: staff read" on media
  for select using (is_staff());
create policy "media: editor write" on media
  for all using (has_role('editor')) with check (has_role('editor'));

create policy "audit_logs: admin read" on audit_logs
  for select using (has_role('administrador'));
create policy "audit_logs: staff insert" on audit_logs
  for insert with check (is_staff());
