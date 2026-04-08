-- Create checklist_items table for user security checklists
create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  completed boolean default false,
  priority text default 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_priority check (priority in ('low', 'medium', 'high', 'critical')),
  constraint valid_category check (category in ('account', 'device', 'network', 'data', 'password', 'software'))
);

-- Create indexes for better query performance
create index if not exists checklist_items_user_id_idx on public.checklist_items(user_id);
create index if not exists checklist_items_user_id_completed_idx on public.checklist_items(user_id, completed);
create index if not exists checklist_items_category_idx on public.checklist_items(category);

-- Enable row level security
alter table public.checklist_items enable row level security;

-- Create policies
-- Users can view their own checklist items
create policy "Users can view own checklist items" on public.checklist_items
  for select using (auth.uid() = user_id);

-- Users can insert their own checklist items
create policy "Users can insert own checklist items" on public.checklist_items
  for insert with check (auth.uid() = user_id);

-- Users can update their own checklist items
create policy "Users can update own checklist items" on public.checklist_items
  for update using (auth.uid() = user_id);

-- Users can delete their own checklist items
create policy "Users can delete own checklist items" on public.checklist_items
  for delete using (auth.uid() = user_id);
