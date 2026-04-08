-- Create quiz_results table to track user quiz attempts and scores
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id text not null,
  quiz_title text not null,
  total_questions integer not null,
  correct_answers integer not null,
  score numeric(5, 2) not null,
  time_spent_seconds integer,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_score check (score >= 0 and score <= 100),
  constraint valid_answers check (correct_answers >= 0 and correct_answers <= total_questions)
);

-- Create indexes for better query performance
create index if not exists quiz_results_user_id_idx on public.quiz_results(user_id);
create index if not exists quiz_results_quiz_id_idx on public.quiz_results(quiz_id);
create index if not exists quiz_results_user_id_completed_at_idx on public.quiz_results(user_id, completed_at);

-- Enable row level security
alter table public.quiz_results enable row level security;

-- Create policies
-- Users can view their own quiz results
create policy "Users can view own quiz results" on public.quiz_results
  for select using (auth.uid() = user_id);

-- Users can insert their own quiz results
create policy "Users can insert own quiz results" on public.quiz_results
  for insert with check (auth.uid() = user_id);

-- Users can update their own quiz results
create policy "Users can update own quiz results" on public.quiz_results
  for update using (auth.uid() = user_id);

-- Users can delete their own quiz results
create policy "Users can delete own quiz results" on public.quiz_results
  for delete using (auth.uid() = user_id);
