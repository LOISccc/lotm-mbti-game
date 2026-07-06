create table if not exists public.game_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  player_state jsonb not null,
  event_log jsonb not null default '[]'::jsonb
);

alter table public.game_runs enable row level security;

create policy "Allow anonymous prototype reads"
on public.game_runs
for select
to anon
using (true);

create policy "Allow anonymous prototype inserts"
on public.game_runs
for insert
to anon
with check (true);

create policy "Allow anonymous prototype updates"
on public.game_runs
for update
to anon
using (true)
with check (true);
