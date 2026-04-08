-- Create function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to automatically create profile when new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update profile updated_at timestamp
create or replace function public.handle_profile_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_profile_updated on public.profiles;

-- Create trigger to update updated_at timestamp
create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute function public.handle_profile_updated();

-- Create similar triggers for other tables
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Apply updated_at trigger to checklist_items
drop trigger if exists on_checklist_items_updated on public.checklist_items;
create trigger on_checklist_items_updated
  before update on public.checklist_items
  for each row
  execute function public.handle_updated_at();

-- Apply updated_at trigger to feed_posts
drop trigger if exists on_feed_posts_updated on public.feed_posts;
create trigger on_feed_posts_updated
  before update on public.feed_posts
  for each row
  execute function public.handle_updated_at();

-- Apply updated_at trigger to encyclopedia_articles
drop trigger if exists on_encyclopedia_articles_updated on public.encyclopedia_articles;
create trigger on_encyclopedia_articles_updated
  before update on public.encyclopedia_articles
  for each row
  execute function public.handle_updated_at();
