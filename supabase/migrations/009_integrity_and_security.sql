-- 009_integrity_and_security.sql
-- Repairs data-integrity gaps found after the admin panel started receiving
-- real content. This migration is safe to run on an existing installation.

-- Keep only one primary marker per product before enforcing the invariant.
-- Other gallery rows are preserved; saving a product through the updated
-- panel will intentionally reduce it to the single photo supported by the UI.
with ranked_primary_images as (
  select
    id,
    row_number() over (
      partition by product_id
      order by display_order asc, id asc
    ) as position
  from product_images
  where is_primary = true
)
update product_images as image
set is_primary = false
from ranked_primary_images as ranked
where image.id = ranked.id
  and ranked.position > 1;

create unique index if not exists product_images_one_primary_per_product
  on product_images(product_id)
  where is_primary = true;

-- The browser validates these too, but bucket-level limits prevent bypassing
-- those checks through a direct Storage API call.
update storage.buckets
set
  file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[]
where id = 'media';

-- Editors may create and edit content. Destructive actions that can remove
-- important records are reserved for administrators and proprietors.
drop policy if exists "products: editor write" on products;
create policy "products: editor insert" on products
  for insert with check (has_role('editor'));
create policy "products: editor update" on products
  for update using (has_role('editor')) with check (has_role('editor'));
create policy "products: admin delete" on products
  for delete using (has_role('administrador'));

drop policy if exists "categories: editor write" on categories;
create policy "categories: editor insert" on categories
  for insert with check (has_role('editor'));
create policy "categories: editor update" on categories
  for update using (has_role('editor')) with check (has_role('editor'));
create policy "categories: admin delete" on categories
  for delete using (has_role('administrador'));

drop policy if exists "campaigns: editor write" on campaigns;
create policy "campaigns: editor insert" on campaigns
  for insert with check (has_role('editor'));
create policy "campaigns: editor update" on campaigns
  for update using (has_role('editor')) with check (has_role('editor'));
create policy "campaigns: admin delete" on campaigns
  for delete using (has_role('administrador'));

-- Anonymous lead submissions must always represent a newly-created,
-- consented request. The server action supplies these values explicitly.
drop policy if exists "leads: public insert" on leads;
create policy "leads: public insert constrained" on leads
  for insert with check (
    consent = true
    and status = 'novo'
    and char_length(trim(name)) >= 2
    and char_length(trim(whatsapp)) >= 10
    and char_length(trim(description)) >= 10
  );

-- Child rows must not reveal information belonging to draft products or
-- inactive campaigns when queried directly through the anonymous API.
drop policy if exists "product_images: public read" on product_images;
create policy "product_images: public read published product" on product_images
  for select using (
    is_staff()
    or exists (
      select 1 from products
      where products.id = product_images.product_id
        and products.status = 'published'
    )
  );

drop policy if exists "product_variants: public read" on product_variants;
create policy "product_variants: public read published product" on product_variants
  for select using (
    is_staff()
    or exists (
      select 1 from products
      where products.id = product_variants.product_id
        and products.status = 'published'
    )
  );

drop policy if exists "product_addons: public read" on product_addons;
create policy "product_addons: public read published product" on product_addons
  for select using (
    is_staff()
    or exists (
      select 1 from products
      where products.id = product_addons.product_id
        and products.status = 'published'
    )
  );

drop policy if exists "product_tags: public read" on product_tags;
create policy "product_tags: public read published product" on product_tags
  for select using (
    is_staff()
    or exists (
      select 1 from products
      where products.id = product_tags.product_id
        and products.status = 'published'
    )
  );

drop policy if exists "store_products: public read available" on store_products;
create policy "store_products: public read active catalog" on store_products
  for select using (
    is_staff()
    or (
      not hidden
      and exists (
        select 1 from products
        where products.id = store_products.product_id
          and products.status = 'published'
      )
      and exists (
        select 1 from stores
        where stores.id = store_products.store_id
          and stores.status = 'active'
      )
    )
  );

drop policy if exists "campaign_stores: public read" on campaign_stores;
create policy "campaign_stores: public read active campaign" on campaign_stores
  for select using (
    is_staff()
    or exists (
      select 1 from campaigns
      where campaigns.id = campaign_stores.campaign_id
        and campaigns.status in ('scheduled', 'active')
        and now() between campaigns.starts_at and campaigns.ends_at
    )
  );

drop policy if exists "campaign_products: public read" on campaign_products;
create policy "campaign_products: public read active campaign" on campaign_products
  for select using (
    is_staff()
    or exists (
      select 1 from campaigns
      where campaigns.id = campaign_products.campaign_id
        and campaigns.status in ('scheduled', 'active')
        and now() between campaigns.starts_at and campaigns.ends_at
    )
  );

-- Reject unsafe campaign destinations on all future writes, including direct
-- database/API access. NOT VALID avoids blocking deploy because of an old row;
-- PostgreSQL still enforces it for new and updated rows.
alter table campaigns
  add constraint campaigns_button_link_safe
  check (
    button_link is null
    or button_link = ''
    or (button_link like '/%' and button_link not like '//%')
    or button_link ~* '^https?://'
  ) not valid;
