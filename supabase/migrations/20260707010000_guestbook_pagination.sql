create or replace function public.list_guestbook_entries(page_size integer, page_number integer)
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
  limit least(greatest(page_size, 1), 25)
  offset greatest(page_number - 1, 0) * least(greatest(page_size, 1), 25);
$$;

revoke all on function public.list_guestbook_entries(integer, integer) from public;
grant execute on function public.list_guestbook_entries(integer, integer) to anon, authenticated;
