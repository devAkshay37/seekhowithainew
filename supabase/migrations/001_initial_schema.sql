-- ============================================================
-- SeekhoWithAI — Initial Schema Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- ─── profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null default '',
  school_name text,
  mobile text,
  board text,
  classes text[] default '{}',
  subjects text[] default '{}',
  language_preference text default 'English',
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ─── teachpacks ───────────────────────────────────────────────
create table if not exists teachpacks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  board text,
  class text,
  subject text,
  topic text not null,
  duration integer,
  language text,
  content jsonb not null default '{}',
  addons jsonb default '[]',
  is_starred boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table teachpacks enable row level security;

create policy "Users can CRUD own teachpacks"
  on teachpacks for all
  using (auth.uid() = user_id);

-- ─── lastminpreps ─────────────────────────────────────────────
create table if not exists lastminpreps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  class text,
  subject text,
  topic text not null,
  depth text default 'deep',
  content jsonb not null default '{}',
  created_at timestamptz default now()
);

alter table lastminpreps enable row level security;

create policy "Users can CRUD own lastminpreps"
  on lastminpreps for all
  using (auth.uid() = user_id);

-- ─── mindmaps ─────────────────────────────────────────────────
create table if not exists mindmaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  class text,
  subject text,
  topic text not null,
  depth text default 'standard',
  content jsonb not null default '{}',
  is_starred boolean default false,
  created_at timestamptz default now()
);

alter table mindmaps enable row level security;

create policy "Users can CRUD own mindmaps"
  on mindmaps for all
  using (auth.uid() = user_id);

-- ─── quizzes ──────────────────────────────────────────────────
create table if not exists quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  class text,
  subject text,
  topics text[] default '{}',
  total_marks integer,
  duration integer,
  difficulty text default 'mixed',
  question_types text[] default '{}',
  include_answer_key boolean default true,
  content jsonb not null default '{}',
  is_starred boolean default false,
  created_at timestamptz default now()
);

alter table quizzes enable row level security;

create policy "Users can CRUD own quizzes"
  on quizzes for all
  using (auth.uid() = user_id);

-- ─── activities ───────────────────────────────────────────────
create table if not exists activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  class text,
  subject text,
  topic text not null,
  activity_type text,
  group_size text,
  duration integer,
  content jsonb not null default '{}',
  is_starred boolean default false,
  created_at timestamptz default now()
);

alter table activities enable row level security;

create policy "Users can CRUD own activities"
  on activities for all
  using (auth.uid() = user_id);

-- ─── Auto-create profile trigger ─────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Updated_at trigger for teachpacks ───────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger teachpacks_updated_at
  before update on teachpacks
  for each row execute procedure public.handle_updated_at();
