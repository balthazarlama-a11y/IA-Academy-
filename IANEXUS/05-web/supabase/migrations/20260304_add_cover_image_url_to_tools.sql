-- Add cover_image_url column to tools table
-- Required by admin tools UI and server actions

alter table public.tools
  add column if not exists cover_image_url text;
