-- Create profiles table to store user additional information
-- This table is linked to auth.users and automatically cleaned up when user is deleted
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on user id for faster lookups
create index if not exists profiles_id_idx on public.profiles(id);

-- Enable row level security
alter table public.profiles enable row level security;

-- Create policies for profiles table
-- Users can view their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Users can delete their own profile
create policy "Users can delete own profile" on public.profiles
  for delete using (auth.uid() = id);
