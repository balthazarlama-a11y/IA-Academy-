# YourAI — Start Here

## Estado actual (limpio)
- Landing **glassmorphism colorida** con fondo neural animado.
- One-page enfocada en 3 pilares:
  1. Gratis para Estudiantes
  2. Áreas y Especialidades
  3. IA del Día a Día
- Estructura shadcn válida (`src/components/ui`).
- Tailwind + TypeScript + Next.js listos.

## Archivos clave
- `src/app/page.tsx` → entrypoint principal
- `src/components/ui/glassmorphism-trust-hero.tsx` → landing glass
- `src/components/ui/neural-background.tsx` → fondo neural canvas
- `src/lib/utils.ts` → helper `cn`

## Comandos
```bash
npm install
npm run dev
```

## Ajustes inmediatos que debes hacer
- Reemplazar links placeholder de WhatsApp:
  - `https://chat.whatsapp.com/tu-enlace-general`

## Siguiente paso recomendado
Crear secciones reales para cada pilar (sin perder una sola pantalla visual):
- Modal / panel lateral por pilar con publicaciones,
- CTA a grupo WhatsApp específico por área,
- feed corto de updates del día.
