-- Create feed_posts table for security awareness posts
create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null,
  tags text[] default array[]::text[],
  likes_count integer default 0,
  comments_count integer default 0,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_category check (category in ('malware', 'phishing', 'ransomware', 'tips', 'news', 'other'))
);

-- Create indexes for better query performance
create index if not exists feed_posts_user_id_idx on public.feed_posts(user_id);
create index if not exists feed_posts_published_idx on public.feed_posts(published);
create index if not exists feed_posts_created_at_idx on public.feed_posts(created_at desc);
create index if not exists feed_posts_category_idx on public.feed_posts(category);

-- Enable row level security
alter table public.feed_posts enable row level security;

-- Create policies
-- Everyone can view published posts
create policy "Everyone can view published posts" on public.feed_posts
  for select using (published = true);

-- Users can view all posts they created
create policy "Users can view own posts" on public.feed_posts
  for select using (auth.uid() = user_id);

-- Users can insert their own posts
create policy "Users can insert own posts" on public.feed_posts
  for insert with check (auth.uid() = user_id);

-- Users can update their own posts
create policy "Users can update own posts" on public.feed_posts
  for update using (auth.uid() = user_id);

-- Users can delete their own posts
create policy "Users can delete own posts" on public.feed_posts
  for delete using (auth.uid() = user_id);
