-- 008_storage.sql
-- Public bucket for product/store/campaign photos. Files are publicly
-- readable (they're marketing photos), but only staff can upload/delete.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media bucket: public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media bucket: editor upload"
  on storage.objects for insert
  with check (bucket_id = 'media' and has_role('editor'));

create policy "media bucket: editor update"
  on storage.objects for update
  using (bucket_id = 'media' and has_role('editor'));

create policy "media bucket: editor delete"
  on storage.objects for delete
  using (bucket_id = 'media' and has_role('editor'));
