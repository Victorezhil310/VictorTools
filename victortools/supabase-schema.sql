-- ============================================================
-- VictorTools Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro')),
  razorpay_customer_id text,
  stripe_customer_id text,
  plan_updated_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Usage tracking table
create table public.usage (
  id uuid default uuid_generate_v4() primary key,
  identifier text not null,
  tool_id text not null,
  date date not null default current_date,
  count integer default 1,
  created_at timestamptz default now(),
  unique(identifier, tool_id, date)
);

-- Files table (for tracking uploaded files)
create table public.files (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  size integer not null,
  type text not null,
  storage_path text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Orders table (for payment tracking)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('razorpay', 'stripe')),
  order_id text not null,
  amount integer not null,
  currency text default 'INR',
  status text default 'pending',
  created_at timestamptz default now()
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('razorpay', 'stripe')),
  subscription_id text not null,
  plan_id text,
  status text default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.usage enable row level security;
alter table public.files enable row level security;
alter table public.orders enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: Users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Usage: Users can view their own usage, service role can do everything
create policy "Users can view own usage"
  on public.usage for select
  using (identifier = auth.uid()::text or identifier like 'anon_%');

create policy "Service role can manage usage"
  on public.usage for all
  using (auth.role() = 'service_role');

-- Files: Users can manage their own files
create policy "Users can view own files"
  on public.files for select
  using (user_id = auth.uid());

create policy "Users can insert own files"
  on public.files for insert
  with check (user_id = auth.uid());

create policy "Users can delete own files"
  on public.files for delete
  using (user_id = auth.uid());

-- Orders: Users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (user_id = auth.uid());

-- Subscriptions: Users can view their own subscriptions
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (user_id = auth.uid());

-- ============================================================
-- Indexes for performance
-- ============================================================

create index idx_usage_identifier_date on public.usage(identifier, date);
create index idx_usage_tool_date on public.usage(tool_id, date);
create index idx_files_user_id on public.files(user_id);
create index idx_files_expires on public.files(expires_at);
create index idx_profiles_email on public.profiles(email);

-- ============================================================
-- Function to auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Function to clean up expired files
-- ============================================================

create or replace function public.cleanup_expired_files()
returns void as $$
begin
  delete from public.files where expires_at < now();
end;
$$ language plpgsql security definer;
