create table if not exists public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 20),
  attending boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_responses_created_at_idx
on public.rsvp_responses (created_at desc);

alter table public.rsvp_responses enable row level security;

drop policy if exists rsvp_responses_insert on public.rsvp_responses;

create policy rsvp_responses_insert
on public.rsvp_responses
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 1 and 20
);

revoke all on public.rsvp_responses from anon, authenticated;
grant insert on public.rsvp_responses to anon, authenticated;
