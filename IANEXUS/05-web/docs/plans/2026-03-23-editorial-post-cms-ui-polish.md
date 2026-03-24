# Editorial Post CMS UI Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the admin posts page and editorial composer feel like a focused Substack-style writing environment with cleaner hierarchy, better scanability, and stronger editorial control.

**Architecture:** Keep the `posts` model and `content_json` pipeline intact. Refine the admin shell, the create/edit post forms, and the block composer so writing is the dominant action while metadata and publishing controls stay secondary. Reuse shared presentational patterns where possible so create/edit stay consistent and easy to maintain.

**Tech Stack:** Next.js App Router, React client components, Tailwind CSS, Supabase server actions, structured post blocks in JSON.

---

### Task 1: Polish the admin posts shell

**Files:**
- Modify: `src/app/admin/posts/page.tsx`

**Step 1: Refine the page hierarchy**
- Add a stronger editorial hero at the top of the page.
- Surface summary metrics and the current content state.
- Add a search/filter row for the archive so large post lists are easier to scan.

**Step 2: Keep the create form prominent**
- Preserve the “Nuevo post” entry point, but present it inside a clearer editorial card.
- Ensure the archive list is visually subordinate to the creation surface.

**Step 3: Verify the shell still renders**
- Open `/admin/posts` and confirm the hero, create form, and archive stack remain readable at desktop and mobile widths.

### Task 2: Rebuild the create/edit forms as an editorial workspace

**Files:**
- Modify: `src/components/admin/create-post-form.tsx`
- Modify: `src/components/admin/post-editor-item.tsx`
- Modify: `src/components/admin/upload-image-field.tsx` if needed for spacing/preview polish

**Step 1: Separate metadata from the writing surface**
- Keep title, subtitle, slug, status, kind, published date, excerpt, and hero media in clear editorial sections.
- Make the writing composer the dominant element, not the metadata grid.

**Step 2: Improve the summary and collapsible editor row**
- Make the collapsed post item show title, subtitle, status, and timestamps more elegantly.
- Make the expanded editor feel like a composed article workspace rather than a raw form.

**Step 3: Tighten the visual system**
- Use consistent spacing, border radii, and helper text across create/edit.
- Keep action buttons visible but secondary.

### Task 3: Polish the block composer itself

**Files:**
- Modify: `src/components/admin/post-editor-composer.tsx`
- Modify: `src/components/blog/post-blocks.tsx` if needed for preview polish

**Step 1: Strengthen the composer shell**
- Add a clearer header and helper copy.
- Keep the block-insert controls obvious but not noisy.
- Make the preview sidebar feel editorial and stable.

**Step 2: Improve block cards**
- Refine block headers, controls, and empty states.
- Keep image, quote, callout, list, divider, and tool embed blocks legible and compact.

**Step 3: Verify the preview matches the public renderer**
- Ensure the composer preview remains a faithful approximation of the public blog rendering.

### Task 4: Validate and clean up

**Files:**
- Any touched files from Tasks 1-3

**Step 1: Run quality checks**
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

**Step 2: Smoke test in the browser**
- Confirm `/admin/posts` renders the improved shell.
- Confirm create/edit posts still submit correctly.
- Confirm the composer still serializes `content_json` and `content_md`.

**Step 3: Commit**
- Commit the polished editor/admin pass once validation is clean.
