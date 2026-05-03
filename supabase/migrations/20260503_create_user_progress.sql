-- User progress table for CampusBeninTrack
-- Stores the checked item IDs per authenticated user.

create table if not exists public.user_progress (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  checked_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.user_progress enable row level security;

-- Users can only read their own row
create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

-- Users can insert their own row
create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

-- Users can update their own row
create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
