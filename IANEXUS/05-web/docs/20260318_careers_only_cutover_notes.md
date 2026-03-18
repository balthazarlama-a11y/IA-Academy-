# Careers-Only Cutover Notes

## Target Schema

Canonical tables after the cutover:

- `public.profiles`
- `public.posts`
- `public.tools`
- `public.career_paths`
- `public.tool_careers`
- `public.post_tools`

Objects intentionally removed:

- `public.tool_categories`
- `public.tools.category_id`
- `public.tools.logo_url`
- `public.tool_career_catalog`

## Why `post_tools` stays

`post_tools` is still justified even though it is empty today.

Reason:

- the product already models editorial linking between content and tools
- the application has public and admin code for this relationship
- removing it now would simplify the database a little, but would also create unnecessary code churn outside the taxonomy refactor

So this cutover focuses on taxonomy simplification, not content-linking removal.

## Drop Order

1. Verify every tool has at least one row in `tool_careers`
2. Backfill `cover_image_url` from `logo_url` if needed
3. Drop `public.tool_career_catalog`
4. Drop FK `tools_category_id_fkey`
5. Drop `public.tools.category_id`
6. Drop `public.tools.logo_url`
7. Drop `public.tool_categories`

## Rollback / Safety Notes

This migration is destructive.

Do **not** apply it until all of the following are true:

- the app reads careers as the only taxonomy
- admin no longer derives legacy `category_id`
- the public catalog no longer joins `tool_categories`
- the preflight SQL returns:
  - zero unmapped tools
  - zero orphaned `tool_careers`
  - zero duplicate `(tool_id, career_path_id)` rows

Recommended safety workflow:

1. run `docs/sql/20260318_careers_only_preflight.sql`
2. take a database backup
3. apply `supabase/migrations/20260318_0300_careers_only_schema_cutover.sql`
4. run smoke tests on:
   - `/areas`
   - `/herramientas/[slug]`
   - `/admin/tools`
   - related posts/tools flows

If rollback is needed:

- restore from backup
- or re-add the dropped schema objects from the last stable migration set before this cutover

## Exact Final Tables

### `public.career_paths`

- `id uuid primary key`
- `name text unique not null`
- `slug text unique not null`
- `description text null`
- `icon_name text null`
- `color_accent text null`
- `sort_order smallint not null default 0`
- `status content_status not null default 'published'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `public.tools`

- `id uuid primary key`
- `name text not null`
- `slug text unique not null`
- `description text null`
- `url text not null`
- `cover_image_url text null`
- `plan tool_plan not null default 'free'`
- `level tool_level not null default 'all'`
- `ia_type text null`
- `verified boolean not null default false`
- `edu_verified boolean not null default false`
- `featured boolean not null default false`
- `status content_status not null default 'published'`
- `sort_order smallint not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `public.tool_careers`

- `tool_id uuid not null references public.tools(id)`
- `career_path_id uuid not null references public.career_paths(id)`
- `sort_order smallint not null default 0`
- `created_at timestamptz not null default now()`
- primary key `(tool_id, career_path_id)`

### `public.posts`

- unchanged by this cutover

### `public.post_tools`

- unchanged by this cutover
