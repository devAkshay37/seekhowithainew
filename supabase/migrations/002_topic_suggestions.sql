-- ─── topic_suggestions ──────────────────────────────────────────
create table if not exists topic_suggestions (
  id uuid default gen_random_uuid() primary key,
  board text not null,
  class text not null,
  subject text not null,
  topic text not null,
  created_at timestamptz default now()
);

-- Indexing for fast lookups by board, class, and subject
create index if not exists idx_topic_suggestions_lookup on topic_suggestions(board, class, subject);

-- Enable Row Level Security
alter table topic_suggestions enable row level security;

-- Allow anyone to read topic suggestions
create policy "Anyone can read topic suggestions"
  on topic_suggestions for select
  using (true);
