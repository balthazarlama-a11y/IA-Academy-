-- YourAI - Initial database schema for auth roles + blog/posts
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum ('master', 'admin', 'user');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.post_kind as enum ('blog', 'tool', 'guide', 'news');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content_md text not null,
  cover_image_url text,
  post_kind public.post_kind not null default 'blog',
  ia_type text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  author_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_idx on public.posts(status, published_at desc);
create index if not exists posts_kind_idx on public.posts(post_kind);
create index if not exists posts_author_idx on public.posts(author_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if public.current_app_role() <> 'master' then
      raise exception 'Only master can change roles';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_prevent_role_escalation on public.profiles;
create trigger trg_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_role_escalation();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

drop policy if exists profiles_select_own_or_staff on public.profiles;
create policy profiles_select_own_or_staff
on public.profiles
for select
using (
  id = auth.uid()
  or public.current_app_role() in ('admin', 'master')
);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists profiles_master_update_all on public.profiles;
create policy profiles_master_update_all
on public.profiles
for update
using (public.current_app_role() = 'master')
with check (public.current_app_role() = 'master');

drop policy if exists posts_public_read_published on public.posts;
create policy posts_public_read_published
on public.posts
for select
using (
  status = 'published'
  and (published_at is null or published_at <= now())
);

drop policy if exists posts_staff_all on public.posts;
create policy posts_staff_all
on public.posts
for all
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

