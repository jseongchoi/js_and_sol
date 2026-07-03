-- Run this in Supabase SQL Editor.
-- Replace CHANGE_ME_ADMIN_PASSWORD with the shared admin delete password.

create extension if not exists pgcrypto;

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 20),
  message text not null check (char_length(trim(message)) between 1 and 300),
  entry_password text not null check (char_length(entry_password) between 1 and 30),
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook_admin (
  id boolean primary key default true check (id),
  password text not null check (char_length(password) between 1 and 30)
);

insert into public.guestbook_admin (id, password)
values (true, 'CHANGE_ME_ADMIN_PASSWORD')
on conflict (id) do update set password = excluded.password;

alter table public.guestbook_entries enable row level security;
alter table public.guestbook_admin enable row level security;

drop policy if exists guestbook_entries_insert on public.guestbook_entries;

create policy guestbook_entries_insert
on public.guestbook_entries
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 1 and 20
  and char_length(trim(message)) between 1 and 300
  and char_length(entry_password) between 1 and 30
);

revoke all on public.guestbook_entries from anon, authenticated;
grant insert on public.guestbook_entries to anon, authenticated;
revoke all on public.guestbook_admin from anon, authenticated;

create or replace function public.list_guestbook_entries()
returns table (
  id uuid,
  name text,
  message text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select id, name, message, created_at
  from public.guestbook_entries
  order by created_at desc
  limit 50;
$$;

create or replace function public.delete_guestbook_entry(entry_id uuid, input_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.guestbook_entries
  where id = entry_id
    and (
      entry_password = input_password
      or exists (
        select 1
        from public.guestbook_admin
        where id = true and password = input_password
      )
    );

  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

revoke all on function public.list_guestbook_entries() from public;
revoke all on function public.delete_guestbook_entry(uuid, text) from public;
grant execute on function public.list_guestbook_entries() to anon, authenticated;
grant execute on function public.delete_guestbook_entry(uuid, text) to anon, authenticated;
