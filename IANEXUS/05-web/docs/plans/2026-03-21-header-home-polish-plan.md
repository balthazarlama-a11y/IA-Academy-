# Header And Home Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unificar el header global con la línea editorial de la nueva home y devolverle un poco más de color suave a la portada sin perder sobriedad.

**Architecture:** El trabajo se concentra en dos superficies. `src/components/layout/header.tsx` se redibuja como una sola barra editorial full width, manteniendo intacta la lógica de sesión y admin. `src/app/page.tsx` y `src/app/globals.css` se ajustan para suavizar la jerarquía, mejorar paddings y sumar acentos pastel discretos que acompañen la composición inspirada en Stitch.

**Tech Stack:** Next.js App Router, React client component para header, Tailwind CSS v4, `next/font/google` ya configurado con Fraunces + Inter.

---

### Task 1: Reframe the global header into one editorial bar

**Files:**
- Modify: `src/components/layout/header.tsx`

**Step 1:** Remove the current split visual treatment between brand block and action pills.

**Step 2:** Rebuild the header as one full-width editorial bar with:
- brand cluster anchored left
- utility actions aligned right
- navigation integrated into the same visual language

**Step 3:** Keep all current behavior working:
- login/logout
- staff actions
- search link
- mobile menu

**Step 4:** Restyle session/admin/tool/post/logout controls so they look like part of the header system rather than detached app chips.

### Task 2: Add restrained pastel color and spacing polish to the home

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Step 1:** Keep the current 3-column organization inspired by Stitch.

**Step 2:** Reintroduce soft color through subtle surfaces and accents only:
- blue ink
- lavender smoke
- pale mint

**Step 3:** Adjust spacing and padding so the masthead, hero and right rail feel more balanced under the new header.

**Step 4:** Do not change the overall information architecture of the home.

### Task 3: Validate the integrated result

**Files:**
- No new files expected

**Step 1:** Run `npm run lint`

**Step 2:** Run `npm exec tsc -- --noEmit`

**Step 3:** Run `npm run build`

**Step 4:** Fix any issues introduced by the header/home polish and re-run verification.
