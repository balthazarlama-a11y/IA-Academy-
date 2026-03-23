alter table public.tools
add column if not exists editorial_summary text;

comment on column public.tools.editorial_summary is
'Resumen editorial largo para la ficha pública de la herramienta.';
