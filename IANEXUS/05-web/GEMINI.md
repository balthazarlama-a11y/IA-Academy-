# GEMINI.md — Contexto de IA NEXUS

Este archivo proporciona el contexto técnico, arquitectónico y las convenciones del proyecto **IA NEXUS** para optimizar las interacciones con Gemini CLI.

## 🚀 Descripción del Proyecto
**IA NEXUS** es una plataforma comunitaria y un directorio de herramientas de Inteligencia Artificial verificadas para estudiantes. Incluye prompts para Gemini, noticias de IA del "día a día" y comunidades divididas por áreas académicas/profesionales.

### Tecnologías Clave
- **Framework:** [Next.js 16+](https://nextjs.org) (App Router).
- **Frontend:** [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com).
- **Backend/Base de Datos:** [Supabase](https://supabase.com) (PostgreSQL, Auth, SSR, Storage).
- **Tipado:** TypeScript riguroso.
- **Iconos:** Lucide React.

---

## 🏗️ Arquitectura y Estructura
El proyecto sigue una estructura modular dentro de `src/`:

- `src/app/`: Rutas, layouts y Server Components.
  - `/admin/`: Panel de gestión (protegido por middleware).
  - `/herramientas/`: Directorio de IAs.
  - `/blog/`: Noticias y guías.
- `src/components/`:
  - `admin/`: Componentes específicos del dashboard.
  - `ui/`: Componentes base (shadcn/ui).
  - `layout/`: Header, Footer y estructuras globales.
- `src/lib/`:
  - `repositories/`: Capa de acceso a datos (Queries de Supabase centralizadas).
  - `supabase/`: Configuración del cliente (server/client/auth).
  - `types/`: Definiciones de interfaces y tipos globales.

---

## 🛠️ Comandos de Desarrollo
| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo (con Webpack). |
| `npm run build` | Compila la aplicación para producción. |
| `npm run lint` | Ejecuta el análisis estático de código (ESLint). |
| `run_checks.bat` | Script local para validación rápida. |

---

## 📝 Convenciones de Código y Estilo

### Acceso a Datos (Patrón Repository)
No realices llamadas directas a Supabase desde los componentes si existe un repositorio.
- **Ejemplo:** Usa `getTools()` de `@/lib/repositories/tools-repo.ts` en lugar de `supabase.from('tools').select()`.

### Estilo Visual
- **Glassmorphism:** El proyecto utiliza un estilo visual moderno con efectos de cristal y fondos animados (`neural-background.tsx`).
- **Tailwind 4:** Utiliza las nuevas capacidades de Tailwind 4. Evita configurar colores manuales si puedes usar variables CSS.
- **Fuentes:** Se utiliza la variable `--font-inter` para la tipografía principal.

### Autenticación y Seguridad
- **RBAC:** El acceso a `/admin` requiere roles `admin` o `master` definidos en la tabla `profiles`.
- **Middleware:** `middleware.ts` gestiona la protección de rutas administrativas y la actualización de sesiones de Supabase.

---

## 🗄️ Modelos de Datos Principales
- **Posts:** Contenido de blog, guías y noticias (`post_kind`). Soporta Markdown.
- **Tools:** Directorio de herramientas con metadata específica (`plan`, `level`, `edu_verified`).
- **Post_Tools:** Relación N:N para vincular herramientas con artículos o guías.

---

## 🚩 Notas de Implementación Actual
- **WhatsApp:** Los enlaces de comunidad son placeholders (`https://chat.whatsapp.com/tu-enlace-general`). Deben ser reemplazados.
- **Imágenes:** Las imágenes de Supabase Storage están configuradas en `next.config.ts`.
- **Pendiente:** Implementar modales reales para los 3 pilares de la landing page sin perder la estética actual.
