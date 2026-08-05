-- 001_extensions.sql
-- Base extensions and a reusable trigger to keep updated_at current.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
