-- Voxa 2.0 optional shared demo backend
-- Run this file in Supabase SQL Editor.
-- WARNING: These policies intentionally allow anonymous demo access.
-- Do not use them for a production social platform.

create table if not exists public.voxa_demo_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.voxa_demo_state enable row level security;

drop policy if exists "public demo read" on public.voxa_demo_state;
create policy "public demo read"
on public.voxa_demo_state for select
to anon, authenticated
using (true);

drop policy if exists "public demo insert" on public.voxa_demo_state;
create policy "public demo insert"
on public.voxa_demo_state for insert
to anon, authenticated
with check (true);

drop policy if exists "public demo update" on public.voxa_demo_state;
create policy "public demo update"
on public.voxa_demo_state for update
to anon, authenticated
using (true)
with check (true);

alter publication supabase_realtime add table public.voxa_demo_state;

insert into public.voxa_demo_state (id, payload)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- Production migration guidance (not wired to the static demo adapter):
-- Create normalized tables for profiles, rooms, room_seats, room_messages,
-- follows, gifts, transactions, notifications, reports, withdrawals,
-- room_moderators, room_invites, task_progress and admin_activity.
-- Use Supabase Auth user IDs and restrictive row-level-security policies.
