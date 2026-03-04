-- IA NEXUS - Seed Fase 2: Tool Categories + Tools para estudiantes
-- Requiere: 20260303_init_blog.sql + 20260304_tools_schema.sql ejecutados previamente
-- Idempotente: usa INSERT ... ON CONFLICT DO NOTHING

-- ─────────────────────────────────────────────
-- CATEGORÍAS (7 áreas principales)
-- ─────────────────────────────────────────────

insert into public.tool_categories (id, name, slug, description, color_accent, icon_name, sort_order)
values
  ('11111111-0001-0000-0000-000000000000', 'Todas las áreas',   'todas',        'Herramientas de uso general',                       '#6366f1', 'Sparkles',       0),
  ('11111111-0002-0000-0000-000000000000', 'Programación',      'programacion', 'Código, desarrollo, DevOps y herramientas de IA',   '#3b82f6', 'Code',           1),
  ('11111111-0003-0000-0000-000000000000', 'Investigación',     'investigacion','Búsqueda, síntesis y análisis de información',      '#8b5cf6', 'Search',         2),
  ('11111111-0004-0000-0000-000000000000', 'Diseño',            'diseno',       'Creación visual, UI/UX e imágenes con IA',          '#ec4899', 'Palette',        3),
  ('11111111-0005-0000-0000-000000000000', 'Matemáticas',       'matematicas',  'Cálculo, álgebra, estadística y resolución',        '#f59e0b', 'Calculator',     4),
  ('11111111-0006-0000-0000-000000000000', 'Salud y Ciencias',  'salud',        'Medicina, biología y ciencias de la salud',         '#10b981', 'Microscope',     5),
  ('11111111-0007-0000-0000-000000000000', 'Escritura',         'escritura',    'Redacción, edición y contenido académico',          '#f97316', 'PenLine',        6)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────
-- TOOLS (22 herramientas reales)
-- ─────────────────────────────────────────────

insert into public.tools
  (name, slug, description, url, plan, level, ia_type, category_id, verified, edu_verified, featured, status, sort_order)
values

-- ── TODAS LAS ÁREAS ──────────────────────────
(
  'ChatGPT Plus (.edu)',
  'chatgpt-plus-edu',
  'Acceso gratuito a GPT-4o para estudiantes verificados con correo .edu. Ideal para escritura, código, matemáticas y más.',
  'https://chatgpt.com',
  'edu_free', 'all', 'ChatGPT',
  '11111111-0001-0000-0000-000000000000',
  true, true, true, 'published', 1
),
(
  'Gemini Advanced (Google One)',
  'gemini-advanced',
  'Gemini 1.5 Pro incluido con Google One AI Premium. Gratis 2 meses para nuevos usuarios universitarios con Google Workspace.',
  'https://gemini.google.com',
  'freemium', 'all', 'Gemini',
  '11111111-0001-0000-0000-000000000000',
  true, true, true, 'published', 2
),
(
  'Microsoft Copilot',
  'microsoft-copilot',
  'Asistente IA integrado en Office 365, Teams y Bing. Gratis para estudiantes con cuenta institucional Microsoft 365.',
  'https://copilot.microsoft.com',
  'edu_free', 'all', 'Copilot',
  '11111111-0001-0000-0000-000000000000',
  true, true, false, 'published', 3
),
(
  'Notion AI',
  'notion-ai',
  'IA integrada en el espacio de trabajo Notion. Resumir notas, generar contenido y organizar proyectos académicos.',
  'https://notion.so',
  'freemium', 'all', 'Custom',
  '11111111-0001-0000-0000-000000000000',
  true, false, false, 'published', 4
),

-- ── PROGRAMACIÓN ─────────────────────────────
(
  'GitHub Copilot',
  'github-copilot',
  'Autocompletado de código con IA en VS Code, JetBrains y más. Gratis para estudiantes verificados con GitHub Education.',
  'https://github.com/features/copilot',
  'edu_free', 'intermediate', 'Copilot',
  '11111111-0002-0000-0000-000000000000',
  true, true, true, 'published', 1
),
(
  'Cursor IDE',
  'cursor-ide',
  'Editor de código basado en VS Code con IA integrada (GPT-4o, Claude). Gratis con límite mensual generoso.',
  'https://cursor.sh',
  'freemium', 'intermediate', 'GPT-4o/Claude',
  '11111111-0002-0000-0000-000000000000',
  true, false, true, 'published', 2
),
(
  'Replit AI',
  'replit-ai',
  'IDE en la nube con asistente IA. Crear, ejecutar y desplegar apps desde el navegador. Plan Edu gratuito.',
  'https://replit.com',
  'edu_free', 'beginner', 'Custom',
  '11111111-0002-0000-0000-000000000000',
  true, true, false, 'published', 3
),
(
  'Tabnine',
  'tabnine',
  'Autocompletado de código offline y en la nube. Compatible con 30+ lenguajes. Plan gratuito disponible.',
  'https://tabnine.com',
  'freemium', 'intermediate', 'Custom',
  '11111111-0002-0000-0000-000000000000',
  true, false, false, 'published', 4
),
(
  'Codeium',
  'codeium',
  'Extensión gratuita de autocompletado IA para cualquier IDE. Sin límite en el plan free. Alternativa open a Copilot.',
  'https://codeium.com',
  'free', 'intermediate', 'Custom',
  '11111111-0002-0000-0000-000000000000',
  true, false, false, 'published', 5
),

-- ── INVESTIGACIÓN ────────────────────────────
(
  'Perplexity Pro',
  'perplexity-pro',
  'Motor de búsqueda con IA que cita fuentes en tiempo real. Pro gratis para estudiantes universitarios verificados.',
  'https://perplexity.ai',
  'edu_free', 'all', 'Custom',
  '11111111-0003-0000-0000-000000000000',
  true, true, true, 'published', 1
),
(
  'Consensus',
  'consensus',
  'Búsqueda de papers científicos con IA. Responde preguntas con evidencia de estudios reales. Freemium con plan académico.',
  'https://consensus.app',
  'freemium', 'advanced', 'Custom',
  '11111111-0003-0000-0000-000000000000',
  true, false, false, 'published', 2
),
(
  'Elicit',
  'elicit',
  'Asistente para revisión de literatura científica. Extrae datos de papers y resume estudios automáticamente.',
  'https://elicit.com',
  'freemium', 'advanced', 'Custom',
  '11111111-0003-0000-0000-000000000000',
  true, false, false, 'published', 3
),
(
  'Semantic Scholar',
  'semantic-scholar',
  'Base de datos de 200M+ papers con IA para encontrar papers relevantes y detectar citas clave. Totalmente gratuito.',
  'https://semanticscholar.org',
  'free', 'intermediate', 'Custom',
  '11111111-0003-0000-0000-000000000000',
  true, false, false, 'published', 4
),
(
  'ResearchRabbit',
  'research-rabbit',
  'Mapa visual de papers relacionados. Encuentra trabajos conectados y sigue autores. Gratis para investigadores.',
  'https://researchrabbit.ai',
  'free', 'intermediate', 'Custom',
  '11111111-0003-0000-0000-000000000000',
  true, false, false, 'published', 5
),

-- ── DISEÑO ───────────────────────────────────
(
  'Canva AI',
  'canva-ai',
  'Suite de diseño con IA (Magic Design, text-to-image, background remover). Pro gratis para estudiantes.',
  'https://canva.com/education',
  'edu_free', 'beginner', 'Custom',
  '11111111-0004-0000-0000-000000000000',
  true, true, true, 'published', 1
),
(
  'Adobe Firefly',
  'adobe-firefly',
  'Generación de imágenes con IA de Adobe. Integrado en Photoshop y Express. Gratis con cuenta Adobe (25 créditos/mes).',
  'https://firefly.adobe.com',
  'freemium', 'intermediate', 'Firefly',
  '11111111-0004-0000-0000-000000000000',
  true, false, false, 'published', 2
),
(
  'Figma AI',
  'figma-ai',
  'Herramientas de IA en Figma: auto-layout, prototipos con IA y generación de diseños. Plan Edu gratuito.',
  'https://figma.com/education',
  'edu_free', 'intermediate', 'Custom',
  '11111111-0004-0000-0000-000000000000',
  true, true, false, 'published', 3
),

-- ── MATEMÁTICAS ──────────────────────────────
(
  'Wolfram Alpha',
  'wolfram-alpha',
  'Motor de cálculo simbólico con IA. Resuelve integrales, ecuaciones, estadísticas y más. Free con funciones básicas.',
  'https://wolframalpha.com',
  'freemium', 'intermediate', 'Wolfram',
  '11111111-0005-0000-0000-000000000000',
  true, false, true, 'published', 1
),
(
  'Photomath',
  'photomath',
  'Escanea problemas matemáticos escritos a mano y los resuelve paso a paso. App gratuita para iOS y Android.',
  'https://photomath.com',
  'freemium', 'beginner', 'Custom',
  '11111111-0005-0000-0000-000000000000',
  true, false, false, 'published', 2
),
(
  'Symbolab',
  'symbolab',
  'Resuelve problemas de álgebra, cálculo y geometría paso a paso. Gratis con límite diario.',
  'https://symbolab.com',
  'freemium', 'intermediate', 'Custom',
  '11111111-0005-0000-0000-000000000000',
  true, false, false, 'published', 3
),

-- ── SALUD Y CIENCIAS ─────────────────────────
(
  'OpenEvidence',
  'open-evidence',
  'IA entrenada con evidencia médica para estudiantes de medicina. Respuestas clínicas citadas con fuentes.',
  'https://openevidence.com',
  'free', 'advanced', 'Custom',
  '11111111-0006-0000-0000-000000000000',
  true, false, true, 'published', 1
),

-- ── ESCRITURA ────────────────────────────────
(
  'Grammarly',
  'grammarly',
  'Corrección gramatical, estilo y claridad en inglés. Plan Premium gratis para estudiantes vía Grammarly for Education.',
  'https://grammarly.com/edu',
  'edu_free', 'all', 'Custom',
  '11111111-0007-0000-0000-000000000000',
  true, true, false, 'published', 1
),
(
  'Hemingway Editor',
  'hemingway-editor',
  'Simplifica y mejora la escritura. Detecta frases complejas, voz pasiva y errores de claridad. Web gratuita.',
  'https://hemingwayapp.com',
  'free', 'all', 'Custom',
  '11111111-0007-0000-0000-000000000000',
  true, false, false, 'published', 2
)

on conflict (slug) do nothing;
