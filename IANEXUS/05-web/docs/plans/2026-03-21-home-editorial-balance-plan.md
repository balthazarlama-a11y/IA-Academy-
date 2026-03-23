# Home Editorial Balance Iteration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dar más presencia visual y color a la portada, agrandar el bloque izquierdo, reducir el rail de tendencias y bajar la altura de la imagen principal para que el título quede visible apenas se entra.

**Architecture:** Esta iteración solo toca `src/app/page.tsx`. Mantiene la estructura general ya aprobada, pero redistribuye las columnas para favorecer el bloque `Mapa editorial`, compacta `Trending Tools`, y usa más color suave en iconos/superficies para evitar sensación de vacío.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, componentes server-side existentes, data actual de posts y tendencias.

---

### Task 1: Rebalance the cover layout

**Files:**
- Modify: `src/app/page.tsx`

**Step 1:** Change the desktop grid proportions so the left editorial rail is wider and the right trending rail is narrower.

**Step 2:** Make the `Mapa editorial` card visually larger and more present.

**Step 3:** Reduce the vertical dominance of the cover image so the cover title is visible sooner on first load.

### Task 2: Increase controlled visual color

**Files:**
- Modify: `src/app/page.tsx`

**Step 1:** Add more pastel presence through surfaces and icon treatments.

**Step 2:** Color the editorial icons and supporting surfaces more intentionally.

**Step 3:** Keep the result calm and clean, not noisy.

### Task 3: Validate the iteration

**Files:**
- No new files expected

**Step 1:** Run `npm run lint`

**Step 2:** Run `npm run build`

**Step 3:** Fix any issues introduced by the iteration and re-run verification.
