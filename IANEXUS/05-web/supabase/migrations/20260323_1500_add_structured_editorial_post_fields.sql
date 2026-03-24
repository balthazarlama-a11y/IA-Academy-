alter table public.posts
  add column if not exists subtitle text,
  add column if not exists content_json jsonb not null default '[]'::jsonb,
  add column if not exists hero_image_alt text,
  add column if not exists hero_image_caption text;

update public.posts
set content_json = coalesce(content_json, '[]'::jsonb);

comment on column public.posts.subtitle is 'Editorial deck or subtitle shown below the title.';
comment on column public.posts.content_json is 'Structured editorial body rendered as blocks.';
comment on column public.posts.hero_image_alt is 'Accessible alt text for the hero image.';
comment on column public.posts.hero_image_caption is 'Caption shown below the hero image when available.';
