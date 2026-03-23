# 2026-03-23 Source Cleanup Plan

## Objetivo
Dejar `src` mas limpio, menos ambiguo y mas facil de mantener sin romper la app actual ni alterar la direccion editorial reciente.

## Fase 1: Inventario y congelamiento de scope
- Limpiar solo dentro de `IANEXUS/05-web/src` y `docs/plans`
- No tocar `images/` ni `output/stitch/`
- Confirmar candidatos claros a borrado y consolidacion

## Fase 2: Codigo muerto y wrappers innecesarios
- Eliminar componentes sin usos reales:
  - `components/home/typewriter-title.tsx`
  - `components/home/pillar-cards.tsx`
  - `components/backgrounds/liquid-background.tsx`
- Eliminar wrapper de compatibilidad `components/home/editorial-topbar.tsx`
- Reemplazar su uso por import directo de `Header`

## Fase 3: Consolidacion de `/areas`
- Sacar tipos, constantes, normalizacion y mapeo fuera de `components/areas/areas-data.ts`
- Reubicar esa logica en `src/lib/areas/`
- Mantener en `components/areas/` solo componentes de UI

## Fase 4: Eliminar caminos redundantes de repositorio
- Borrar `lib/repositories/areas-repo.ts` si sigue sin usos
- Eliminar `getAreasToolsPage()` y otros aliases muertos si ya no los consume nadie
- Dejar una sola fuente de verdad para fetch y shape de herramientas

## Fase 5: Limpieza tecnica menor y consistencia
- Cerrar warning de `<img>` en `components/tools/tool-detail.tsx`
- Quitar exports muertos o aliases redundantes de repositorios si quedan sin uso
- Ordenar imports y dependencias locales tras el refactor

## Fase 6: Verificacion y arquitectura resultante
- Ejecutar `npm run lint`
- Ejecutar `npm exec tsc -- --noEmit`
- Ejecutar `npm run build`
- Resumir la arquitectura resultante y los cambios aplicados
