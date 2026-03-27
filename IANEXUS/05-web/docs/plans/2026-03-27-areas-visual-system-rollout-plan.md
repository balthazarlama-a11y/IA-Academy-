# Areas Visual System Rollout to Students and Blog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Llevar el sistema visual de `/areas` a `/estudiantes` y `/blog`, replicando color, tipografía, densidad de cards, chips, estados vacíos y jerarquía editorial-product sin cambiar rutas ni lógica de negocio.

**Architecture:** La implementación debe reutilizar el sistema visual existente de `/areas` como fuente de verdad de UI. No hay que rehacer fetches ni modelos; solo migrar shells, headers, tool cards, blog cards y estados vacíos hacia los mismos tokens, patrones de superficie, espaciado y jerarquía tipográfica. El trabajo se divide en shell de página, filtros/toolbar, cards de contenido y estados auxiliares.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, `lucide-react`, tipografías globales ya cargadas en `src/app/layout.tsx` y tokens de `src/app/globals.css`.

---

## Reference Analysis

### What `/areas` is using now

**Primary visual reference files:**
- `src/components/areas/areas-toolbar.tsx`
- `src/components/areas/area-tool-card.tsx`
- `src/components/areas/areas-empty-state.tsx`
- `src/app/globals.css`

**Observed system to replicate:**
- `ui-shell`, `ui-label`, `ui-title`, `ui-chip`, `ui-input`, `ui-rule`, `ui-empty` utility language.
- Display hierarchy uses `Newsreader` only for true editorial headings, not for every label.
- UI text uses `Public Sans` with tighter spacing and smaller uppercase metadata labels.
- Panels are `rounded-[0.95rem]` to `rounded-[1.5rem]`, not oversized `rounded-3xl` everywhere.
- Surfaces use white / off-white with light border definition and shallow shadows.
- Accent color is data-driven for areas, but the system default remains slate/ink + soft accent, not rainbow cards.
- Filters are dense and low-friction: pills, chips, compact panels, less dashboard-like than `/estudiantes` today.
- Tool cards have a clear structure: top accent strip, logo, plan chip, title/tagline, contextual block, light metadata row, dual CTA.

### What is inconsistent today

**`/estudiantes`:**
- `src/app/estudiantes/page.tsx` still uses an older large hero shell and generic rounded-2xl panel language.
- `src/components/students/students-toolbar.tsx` still behaves like a dashboard filter board instead of the compact editorial-product filter system from `/areas`.
- `src/components/students/student-tool-card.tsx` still uses older gradient-heavy cards with larger radii and louder accents than `/areas`.
- `src/components/students/students-empty-state.tsx` still uses older CTA and empty-state styling.

**`/blog`:**
- `src/app/blog/page.tsx` partially moved toward the new system, but still uses a different page shell, spacing rhythm and section weighting than `/areas`.
- `src/components/blog/blog-post-card.tsx` is closer, but its density, label tone and card proportions still need to be tuned against `/areas`.
- `src/components/blog/blog-empty-state.tsx` and `src/components/blog/latest-updates-section.tsx` need the same shell language and spacing density.

---

### Task 1: Lock the `/areas` visual contract in code comments and extraction targets

**Files:**
- Modify: `src/components/areas/areas-toolbar.tsx`
- Modify: `src/components/areas/area-tool-card.tsx`
- Modify: `src/components/areas/areas-empty-state.tsx`
- Reference: `src/app/globals.css`

**Step 1: Document the UI contract inline**

Add short comments only where needed to mark reusable patterns:
- shell header section
- compact filter panel block
- area selector card block
- result card block

**Step 2: Identify duplicated class clusters to reuse manually**

List repeated class clusters before editing other pages:
- shell container styles
- section panel styles
- compact chip/button styles
- result card styles

**Step 3: Do not extract new abstractions yet**

Keep this pass YAGNI:
- no premature `shared-ui.tsx`
- no design-system refactor
- copy the winning class language first

**Step 4: Verify no behavior changes in `/areas`**

Run:
```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS
- no visual regressions intended

**Step 5: Commit**

```bash
git add src/components/areas/areas-toolbar.tsx src/components/areas/area-tool-card.tsx src/components/areas/areas-empty-state.tsx
git commit -m "chore(ui): lock areas visual reference patterns"
```

### Task 2: Move `/estudiantes` page shell to the `/areas` page language

**Files:**
- Modify: `src/app/estudiantes/page.tsx`
- Reference: `src/app/areas/page.tsx`
- Reference: `src/components/areas/areas-toolbar.tsx`

**Step 1: Write the failing visual checklist**

Create a checklist in the commit notes or scratchpad:
- header card currently too generic
- shell too dashboard-like
- spacing does not match `/areas`
- title hierarchy not aligned with `ui-label` + `ui-title`

**Step 2: Rewrite the `/estudiantes` hero shell minimally**

Replace the current hero container with the same structure pattern as `/areas`:
- `ui-shell` outer section or equivalent border/surface rhythm
- eyebrow label in uppercase microtype
- stronger display heading
- tighter supporting copy
- compact result counter if helpful

**Step 3: Preserve existing data flow**

Do not touch:
- `getToolsPage({ onlyFree: true })`
- props passed to `StudentsToolbar`
- revalidation settings

**Step 4: Verify page still renders**

Run:
```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 5: Commit**

```bash
git add src/app/estudiantes/page.tsx
git commit -m "refactor(estudiantes): align page shell with areas visual system"
```

### Task 3: Rebuild `StudentsToolbar` to mirror the `/areas` filter experience

**Files:**
- Modify: `src/components/students/students-toolbar.tsx`
- Reference: `src/components/areas/areas-toolbar.tsx`

**Step 1: Write a small before/after checklist**

Target outcomes:
- filters read like editorial-product UI, not dashboard controls
- search panel density matches `/areas`
- access filters become calmer and more compact
- active filter chips mirror `/areas`
- result count treatment mirrors `/areas`

**Step 2: Replace the top filter shell**

Port these patterns from `/areas`:
- bordered header with subtle gradient fill
- compact search block with micro-label
- active chip row with clear reset action
- lower section split into left/right filter groups only if density requires it

**Step 3: Keep the student-specific semantics, only restyle them**

Do not change behavior of:
- `scopeValue`
- `includeFreemiumValue`
- `iaTypeValue`
- caching, pagination, ranking, debounce

Only change:
- layout
- class density
- spacing
- chip/button appearance
- section headings

**Step 4: Make student-specific access buttons follow `/areas` sizing logic**

Use:
- rounded pills for active/inactive filters
- compact section panels
- one calmer visual tone per section

Avoid:
- three large CTA tiles with descriptions if they create card stacking again

**Step 5: Verify interactions still work**

Manual checks after `npm run dev`:
- search updates results
- access filters update results
- IA type select updates results
- clear button resets all states
- load more still works

**Step 6: Run verification**

```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 7: Commit**

```bash
git add src/components/students/students-toolbar.tsx
git commit -m "refactor(estudiantes): restyle toolbar to match areas system"
```

### Task 4: Rebuild `StudentToolCard` using `AreaToolCard` as the exact visual template

**Files:**
- Modify: `src/components/students/student-tool-card.tsx`
- Reference: `src/components/areas/area-tool-card.tsx`

**Step 1: Write the failing comparison checklist**

Current problems:
- too much gradient
- too much radius
- louder badges
- different CTA hierarchy
- different contextual block shape

**Step 2: Port the `AreaToolCard` structure**

Match these sections:
- top accent strip
- logo + plan chip row
- title + compact description
- pill metadata row
- contextual block
- verification/footer row
- primary and secondary CTA row

**Step 3: Keep student-specific content rules**

Retain:
- student access summary
- educational verification messaging
- existing tool fields and links

But render them inside the same visual scaffolding as `/areas`.

**Step 4: Tune accent use**

Avoid rainbow gradients.
Use:
- one controlled plan badge tone
- slate base
- optional subtle cyan/emerald only where semantically justified

**Step 5: Verify card grid still holds**

Manual checks:
- 1 card in mobile
- 2 cards in medium
- 3 cards in xl if grid remains there
- no overflow on long titles
- no broken image ratios

**Step 6: Run verification**

```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 7: Commit**

```bash
git add src/components/students/student-tool-card.tsx
git commit -m "refactor(estudiantes): align tool cards with areas card system"
```

### Task 5: Restyle the students empty state with the same language

**Files:**
- Modify: `src/components/students/students-empty-state.tsx`
- Reference: `src/components/areas/areas-empty-state.tsx`
- Reference: `src/components/blog/blog-empty-state.tsx`

**Step 1: Replace the old empty-state shell**

Use:
- same compact border/surface language as `/areas`
- same label sizing and typography rhythm
- quieter CTA styling

**Step 2: Keep copy and behavior simple**

Do not add more actions.
Keep:
- reset link when filters are active
- fallback catalog link when not active

**Step 3: Verify states**

Manual checks:
- with active filters
- without active filters

**Step 4: Run verification**

```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 5: Commit**

```bash
git add src/components/students/students-empty-state.tsx
git commit -m "refactor(estudiantes): restyle empty state with areas language"
```

### Task 6: Align `/blog` page shell to the same editorial-product frame

**Files:**
- Modify: `src/app/blog/page.tsx`
- Reference: `src/components/areas/areas-toolbar.tsx`
- Reference: `src/app/estudiantes/page.tsx`

**Step 1: Write the failing comparison checklist**

Problems to fix:
- page shell still visually separate from `/areas`
- section weights differ too much
- archive and featured block spacing is too roomy
- surfaces feel softer than `/areas`

**Step 2: Normalize the outer page shell**

Bring `/blog` closer to `/areas` by adjusting:
- background restraint
- border/shadow density
- panel radii
- spacing between sections
- metadata label rhythm

**Step 3: Keep blog’s editorial character**

Do not flatten it into a search page.
Keep:
- featured story
- archive sections
- latest updates section

But use the same base system:
- same labels
- same panel structure
- same chip density
- same border/shadow philosophy

**Step 4: Run verification**

```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 5: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "refactor(blog): align page shell with areas visual system"
```

### Task 7: Align `BlogPostCard` to the `/areas` card density

**Files:**
- Modify: `src/components/blog/blog-post-card.tsx`
- Reference: `src/components/areas/area-tool-card.tsx`

**Step 1: Identify differences to normalize**

Normalize:
- border definition
- radius size
- metadata label weight
- card padding
- footer density
- hover elevation

Do not remove:
- image-led behavior
- compact mode
- post-specific metadata

**Step 2: Tune both default and compact variants**

Default card should feel like the same family as `AreaToolCard`.
Compact card should remain larger and more editorial, but still share:
- label styling
- text color balance
- edge radius
- border/shadow tone

**Step 3: Verify archive and featured render correctly**

Manual checks:
- featured card in `/blog`
- archive grid cards
- no layout collapse without cover image

**Step 4: Run verification**

```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 5: Commit**

```bash
git add src/components/blog/blog-post-card.tsx
git commit -m "refactor(blog): align post cards with areas card density"
```

### Task 8: Restyle `LatestUpdatesSection` and `BlogEmptyState` to the same system

**Files:**
- Modify: `src/components/blog/latest-updates-section.tsx`
- Modify: `src/components/blog/blog-empty-state.tsx`
- Reference: `src/components/areas/areas-empty-state.tsx`

**Step 1: Restyle `LatestUpdatesSection`**

Adjust:
- section shell
- heading spacing
- update card density
- CTA/link weight

So it sits naturally between featured and archive, not as a visually separate system.

**Step 2: Restyle `BlogEmptyState`**

Bring it in line with `/areas` empty-state treatment:
- simpler panel
- calmer CTAs
- same label hierarchy

**Step 3: Verify all blog states**

Manual checks:
- with featured + archive
- with featured only
- fully empty archive

**Step 4: Run verification**

```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 5: Commit**

```bash
git add src/components/blog/latest-updates-section.tsx src/components/blog/blog-empty-state.tsx
git commit -m "refactor(blog): align supporting sections with areas system"
```

### Task 9: Mobile pass for `/estudiantes` and `/blog` using `/areas` as the density baseline

**Files:**
- Modify: `src/components/students/students-toolbar.tsx`
- Modify: `src/components/students/student-tool-card.tsx`
- Modify: `src/components/blog/blog-post-card.tsx`
- Modify: `src/app/blog/page.tsx`

**Step 1: Write the mobile checklist**

Check for:
- stacked filters too tall
- cards too padded
- labels colliding with content
- unnecessary vertical whitespace

**Step 2: Apply the same mobile reduction strategy already used in `/areas`**

Reduce in mobile only:
- padding
- radii
- icon sizes
- chip height
- min-heights

**Step 3: Verify manually in responsive mode**

Pages:
- `/estudiantes`
- `/blog`

Look for:
- fewer scroll walls
- better first-screen density
- no text collisions

**Step 4: Run verification**

```bash
npm run lint
npx tsc --noEmit
```

Expected:
- PASS

**Step 5: Commit**

```bash
git add src/components/students/students-toolbar.tsx src/components/students/student-tool-card.tsx src/components/blog/blog-post-card.tsx src/app/blog/page.tsx
git commit -m "refactor(ui): compact students and blog mobile density"
```

### Task 10: Final visual QA and regression sweep

**Files:**
- Review: `src/app/areas/page.tsx`
- Review: `src/app/estudiantes/page.tsx`
- Review: `src/app/blog/page.tsx`
- Review: `src/components/areas/*`
- Review: `src/components/students/*`
- Review: `src/components/blog/*`

**Step 1: Run full static verification**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected:
- PASS
- no new warnings tied to edited files

**Step 2: Run manual visual checks**

Pages to review:
- `/areas`
- `/estudiantes`
- `/blog`

Checklist:
- same UI family
- same typographic hierarchy
- same surface system
- same card density
- no route changes
- no filter regressions
- no broken image states

**Step 3: Final commit**

```bash
git add src/app/estudiantes/page.tsx src/components/students/students-toolbar.tsx src/components/students/student-tool-card.tsx src/components/students/students-empty-state.tsx src/app/blog/page.tsx src/components/blog/blog-post-card.tsx src/components/blog/blog-empty-state.tsx src/components/blog/latest-updates-section.tsx
git commit -m "refactor(ui): roll out areas visual system to students and blog"
```
