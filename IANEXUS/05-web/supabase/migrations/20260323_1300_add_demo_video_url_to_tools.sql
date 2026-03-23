alter table public.tools
  add column if not exists demo_video_url text;

comment on column public.tools.demo_video_url is
  'Optional public demo video URL for tool detail pages. Intended primarily for YouTube embeds.';
