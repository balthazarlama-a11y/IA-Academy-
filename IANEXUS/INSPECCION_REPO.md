# 🔍 Inspección del Repositorio IANEXUS
> Generado: 2026-03-12 | Estado: Snapshot actual para seguimiento de cambios

---

## 📌 Resumen Ejecutivo

**IA NEXUS** es una plataforma web orientada a estudiantes que quieren aprender y usar Inteligencia Artificial. Su propuesta de valor tiene 3 pilares:

1. 📚 **Directorio de herramientas IA verificadas** (por área académica/profesional)
2. 💬 **Comunidades de WhatsApp** segmentadas por área
3. 📰 **Noticias y guías de IA del día a día** (formato blog)

La fase actual corresponde a **Fase 3 – Producto Dinámico**: la landing page está terminada visualmente y el backend con Supabase está parcialmente integrado.

---

## 🏗️ Estructura del Repositorio

```
IANEXUS/
├── 00-ORDEN-IMPLEMENTACION.md   ← Hoja de ruta por fases (1 a 4)
├── IMPLEMENTACION_COMPLETADA.md ← Log del sprint v3 (13/13 pasos ✅)
├── README.md                    ← Descripción original del MVP
└── 05-web/                      ← Proyecto Next.js (app principal)
```

> ⚠️ Solo existe **una carpeta de código activo** (`05-web`). Las carpetas `01-design`, `02-content`, `03-product` y `04-next-supabase-plan` mencionadas en el README original ya no están presentes en este directorio.

---

## 🚀 Stack Tecnológico (`05-web`)

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.3 |
| Estilos | Tailwind CSS | ^4 |
| Componentes | shadcn/ui | via components.json |
| Base de Datos | Supabase (PostgreSQL) | ^2.98.0 |
| Autenticación | Supabase Auth + SSR | ^0.9.0 |
| Tipado | TypeScript | ^5 |
| Iconos | Lucide React | ^0.542.0 |
| Build | Webpack (forzado via `--webpack`) | — |

---

## 📁 Estructura de `05-web/src`

```
src/
├── app/                    ← Rutas (Next.js App Router)
│   ├── page.tsx            ← Landing page principal (8 secciones, 15578 bytes)
│   ├── layout.tsx          ← Root layout + metadata + WhatsApp sticky button
│   ├── globals.css         ← Estilos globales + keyframes de animación
│   ├── admin/              ← Panel administrativo (protegido por RBAC)
│   │   ├── page.tsx        ← Dashboard admin
│   │   ├── layout.tsx      ← Layout admin
│   │   ├── posts/          ← CRUD de posts/noticias
│   │   ├── tools/          ← CRUD de herramientas IA
│   │   ├── relations/      ← Gestión relaciones post↔tool
│   │   ├── settings/       ← Configuración
│   │   ├── users/          ← Gestión de usuarios
│   │   ├── denied/         ← Página de acceso denegado
│   │   └── upload-actions.ts
│   ├── areas/              ← Explorador por áreas académicas
│   │   └── page.tsx
│   ├── blog/               ← Artículos y guías
│   ├── dia-a-dia/          ← Noticias de IA cotidiana
│   ├── estudiantes/        ← Sección para estudiantes
│   ├── herramientas/       ← Directorio de herramientas
│   ├── login/              ← Autenticación
│   └── api/                ← API routes
│
├── components/             ← Componentes React organizados por dominio
│   ├── home/
│   │   ├── pillar-cards.tsx     ← 3 cards glass de los pilares
│   │   └── typewriter-title.tsx ← Hero con efecto typewriter
│   ├── layout/
│   │   ├── header.tsx           ← Header con glass blanco + nav (16672 bytes)
│   │   ├── footer.tsx           ← Footer glass
│   │   └── whatsapp-sticky-button.tsx ← Botón flotante WhatsApp
│   ├── areas/
│   │   ├── area-tool-card.tsx   ← Card individual de herramienta
│   │   ├── area-tools-grid.tsx  ← Grid de herramientas
│   │   ├── areas-empty-state.tsx
│   │   └── areas-toolbar.tsx    ← Barra de búsqueda/filtros (20611 bytes)
│   ├── admin/                   ← Componentes del panel admin
│   ├── auth/                    ← Componentes de autenticación
│   ├── backgrounds/             ← Fondos animados (liquid background, etc.)
│   ├── blog/                    ← Cards de posts, etc.
│   ├── day-to-day/              ← Sección dia-a-dia
│   ├── effects/                 ← Efectos visuales (glass filter, etc.)
│   ├── fundamentals/            ← Componentes base
│   ├── marketing/               ← CTAs, trust strip, etc.
│   ├── posts/                   ← Viewer de posts
│   ├── staff/                   ← Componentes de equipo
│   ├── students/                ← Sección estudiantes
│   └── tools/                   ← Componentes de herramientas
│
└── lib/
    ├── repositories/            ← Capa de acceso a datos (Patrón Repository)
    │   ├── tools-repo.ts        ← Queries de herramientas (12337 bytes)
    │   ├── post-tools-repo.ts   ← Relaciones post↔tool (11159 bytes)
    │   ├── areas-repo.ts        ← Queries de áreas (4546 bytes)
    │   └── fundamentals-repo.ts ← Queries de fundamentos
    ├── supabase/                ← Clientes Supabase (server/client/auth)
    ├── types/
    │   └── tool.ts              ← Tipos TypeScript de herramientas
    ├── analytics/               ← Tracking de eventos
    └── utils.ts                 ← Utilidades generales (cn, etc.)
```

---

## 🗄️ Base de Datos (Supabase – Migraciones)

Se encuentran **7 archivos de migración SQL** en `supabase/migrations/`:

| Archivo | Contenido |
|---|---|
| `20260303_init_blog.sql` | Tablas iniciales de blog/posts |
| `20260304_tools_schema.sql` | Esquema completo de herramientas |
| `20260304_add_cover_image_url_to_tools.sql` | Campo imagen de portada |
| `20260304_2322_optimize_rls_policies.sql` | Optimización de políticas RLS |
| `20260304_2341_security_fixes_search_path_and_rls.sql` | Fix de seguridad en search_path |
| `20260305_fix_multiple_permissive_policies.sql` | Fix políticas permisivas múltiples |
| `20260305_analytics_events.sql` | Tabla de eventos de analytics |

### Modelos de datos principales
- **`posts`** → Artículos, noticias, guías. Soporta Markdown. Campo `post_kind`.
- **`tools`** → Directorio de herramientas IA con campos `plan`, `level`, `edu_verified`, `cover_image_url`.
- **`post_tools`** → Relación N:N entre posts y herramientas.
- **`profiles`** → Usuarios con campo `role` (values: `user`, `admin`, `master`).
- **`analytics_events`** → Registro de eventos de uso.

---

## 🔐 Autenticación y Seguridad

### Middleware (`middleware.ts`)
Protege el prefijo `/admin`. Flujo:
1. Si no hay sesión → redirect a `/login`
2. Si hay sesión pero `role` no es `admin` ni `master` → redirect a `/admin/denied`
3. Rol obtenido de la tabla `profiles` en Supabase

### Headers de Seguridad (`next.config.ts`)
Configurados para todas las rutas `(.*)`:
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `X-Frame-Options: ALLOWALL` ← permite embed en iframes (desarrollo)
- `Content-Security-Policy: frame-ancestors *` ← idem

> ⚠️ **Nota para producción:** Cambiar `frame-ancestors *` y `ALLOWALL` por el dominio real.

---

## 🎨 Sistema de Diseño – Estado Actual (v3)

El sprint de implementación v3 (completado el 03/Mar/2026) estableció el siguiente sistema visual:

| Elemento | Valor |
|---|---|
| Fondo base | `#09090f` (dark near-black) |
| Blobs animados | Azul eléctrico · Violeta · Esmeralda · Fucsia |
| Surfaces (cards/header) | `rgba(255,255,255,0.30)` glass blanco |
| Texto en surfaces | `zinc-900` (#18181b) oscuro sobre glass |
| Efecto glass | SVG filter con turbulencia + especularidad |
| Fuente | Inter (Google Fonts, variable `--font-inter`) |
| Estilo general | Liquid Glass / Apple visionOS inspired |

### Estructura de la landing page (`/`)
```
1. GlassFilter        ← SVG filter global (invisible)
2. LiquidBackground   ← Blobs animados en fondo
3. Header             ← Nav + logo + CTA
4. Hero               ← Typewriter title + subtítulo
5. Pillar Cards       ← 3 cards de los pilares
6. Bento Features     ← 4 bloques informativos grid
7. Trust Strip        ← Logos tipográficos (ChatGPT · Claude · Gemini…)
8. AI Demo Input      ← Input visual con cursor animado
9. CTA Band           ← Franja de llamada a acción
10. Footer            ← Links + redes sociales
```

---

## 📋 Rutas de la Aplicación

| Ruta | Estado | Descripción |
|---|---|---|
| `/` | ✅ Implementada (visual completa) | Landing page |
| `/areas` | ✅ Implementada | Explorador de herramientas por área |
| `/herramientas` | ✅ Implementada | Directorio general de herramientas |
| `/blog` | ✅ Implementada | Artículos y guías |
| `/dia-a-dia` | ✅ Implementada | Noticias de IA cotidiana |
| `/estudiantes` | ✅ Implementada | Recursos para estudiantes |
| `/login` | ✅ Implementada | Auth con Supabase |
| `/admin` | ✅ Implementada (RBAC) | Dashboard admin |
| `/admin/posts` | ✅ Implementada | CRUD de posts |
| `/admin/tools` | ✅ Implementada | CRUD de herramientas |
| `/admin/users` | ✅ Implementada | Gestión de usuarios |
| `/admin/relations` | ✅ Implementada | Relaciones post↔tool |
| `/admin/settings` | ✅ Implementada | Configuración |
| `/admin/denied` | ✅ Implementada | Acceso denegado |

---

## 🔧 Configuración de Desarrollo

```bash
# Servidor de desarrollo (puerto default 3000)
npm run dev         # usa --webpack forzado

# Build de producción
npm run build       # también usa --webpack

# Linting
npm run lint

# Validación rápida (Windows)
./run_checks.bat
```

**Variables de entorno** requeridas (`.env`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ⏳ Próximos Pasos Pendientes (según docs internos)

De `IMPLEMENTACION_COMPLETADA.md` — Fase 2 pendiente:
- [ ] Implementar modales reales para los 3 pilares en la landing
- [ ] Agregar command-search en `/areas`
- [ ] Conectar Supabase para datos reales de herramientas y posts
- [ ] Implementar copiar prompts al portapapeles
- [ ] Reemplazar placeholders de WhatsApp por enlaces reales
- [ ] En producción: cambiar `frame-ancestors *` por dominio real

---

## 📎 Documentos de Referencia en el Repo

| Archivo | Contenido |
|---|---|
| `GEMINI.md` | Contexto técnico para IA (convenciones, arquitectura) |
| `DEPLOY_VERCEL_CHECKLIST.md` | Checklist de deploy a Vercel |
| `START_HERE.md` | Guía de onboarding para nuevos contribuidores |
| `security_best_practices_report.md` | Reporte de seguridad |
| `IMPLEMENTACION_COMPLETADA.md` | Log del sprint v3 (13 pasos) |
| `00-ORDEN-IMPLEMENTACION.md` | Hoja de ruta general (4 fases) |

---

> 📅 **Última actualización de este documento:** 2026-03-12
> 🤖 **Generado por:** Antigravity — inspección automática del repositorio
