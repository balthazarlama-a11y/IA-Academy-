# 🚀 Checklist de Deploy en Vercel - YourAI

## ✅ Cambios Realizados

### 1. `next.config.ts` - Corregido
- ✅ Eliminado `outputFileTracingRoot` que causaba "not found"
- ✅ Añadida configuración de imágenes para Supabase Storage
- ✅ Añadidos headers de seguridad

### 2. `src/app/herramientas/[slug]/page.tsx` - Optimizado
- ✅ Añadido `revalidate = 300` (ISR cada 5 minutos)
- ✅ Añadido `generateStaticParams` vacío para SSG bajo demanda

### 3. `vercel.json` - Creado
- ✅ Configuración oficial de build para Vercel

---

## 📋 Pasos para Deploy

### Paso 1: Verificar Variables de Entorno en Vercel
Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=https://iktxzveqylzdypvpfhdp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WC4TnHmgXD84jQZiuNXsNQ_U25_wtMT
```

⚠️ **IMPORTANTE**: Asegúrate de que estas variables estén en:
- ✅ Production
- ✅ Preview
- ✅ Development

### Paso 2: Verificar Políticas RLS en Supabase
Ejecuta este SQL en tu consola de Supabase para permitir lectura pública:

```sql
-- Política para tools (lectura pública)
CREATE POLICY "Allow public read access on tools" 
ON tools FOR SELECT 
TO anon, authenticated 
USING (status = 'published');

-- Política para posts (lectura pública)
CREATE POLICY "Allow public read access on posts" 
ON posts FOR SELECT 
TO anon, authenticated 
USING (status = 'published');

-- Política para tool_categories (lectura pública)
CREATE POLICY "Allow public read access on tool_categories" 
ON tool_categories FOR SELECT 
TO anon, authenticated 
USING (true);
```

### Paso 3: Deploy

#### Opción A: Vía Git (Recomendado)
1. Haz commit de los cambios:
```bash
git add .
git commit -m "fix: config for Vercel deploy"
git push
```
2. Vercel hará el deploy automáticamente

#### Opción B: Vercel CLI
```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🔧 Troubleshooting

### "Not Found" en la raíz (/)
**Causa**: El `outputFileTracingRoot` interfería con el enrutamiento.
**Solución**: Ya está corregido en `next.config.ts`.

### "Not Found" en /herramientas/[slug] o /blog/[slug]
**Causa**: Las variables de entorno no están disponibles durante el build.
**Solución**: Verifica que las env vars estén configuradas en Vercel (Paso 1).

### Error de autenticación con Supabase
**Causa**: El `ANON_KEY` no tiene permisos o es inválido.
**Solución**: 
1. Ve a Supabase → Project Settings → API
2. Copia el "anon public" key (empieza con `eyJ...` o `sb_publishable_`)
3. Actualiza la variable en Vercel

### Imágenes no cargan (404)
**Causa**: Falta configuración de dominios de imágenes.
**Solución**: Ya está corregido en `next.config.ts` con `images.remotePatterns`.

---

## 📊 Resumen de Rutas

| Ruta | Tipo | Estado |
|------|------|--------|
| `/` | Estática | ✅ |
| `/areas` | SSR (dinámica) | ✅ |
| `/blog` | Estática (ISR 5m) | ✅ |
| `/blog/[slug]` | SSG bajo demanda | ✅ |
| `/herramientas/[slug]` | SSG bajo demanda | ✅ |
| `/dia-a-dia` | Estática (ISR 5m) | ✅ |
| `/estudiantes` | Estática (ISR 5m) | ✅ |
| `/login` | SSR (dinámica) | ✅ |
| `/admin/*` | SSR (con middleware) | ✅ |

---

## 🎯 Post-Deploy Checklist

- [ ] La página principal (/) carga correctamente
- [ ] /areas muestra las herramientas
- [ ] /blog carga los posts
- [ ] /blog/[slug] funciona para posts individuales
- [ ] /herramientas/[slug] funciona para herramientas
- [ ] Las imágenes se cargan correctamente
- [ ] /login funciona
- [ ] /admin redirige a login (si no estás autenticado)

---

## 📞 Si sigue fallando...

1. Revisa los logs de build en Vercel (Deployments → [tu deploy] → Build Logs)
2. Verifica que las tablas en Supabase tengan datos
3. Confirma que las políticas RLS permiten lectura anónima
4. Prueba las queries de Supabase directamente en el SQL Editor
