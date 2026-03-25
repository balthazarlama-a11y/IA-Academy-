# Post Editor Word Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the post CMS into a dedicated full-page workspace that feels like a simplified document editor, while preserving the current block system, media pipeline, and publish flow.

**Architecture:** Keep `/admin/posts` as the archive and entry surface, but move create/edit into dedicated routes with a wide writing canvas, a sticky right sidebar for metadata/publishing, and a top utility bar. The editor should reuse the current `content_json` block model and image pipeline, but the layout must stop feeling like a stacked admin form. The writing surface should dominate the page, with controls becoming secondary and collapsible.

**Tech Stack:** Next.js App Router, React, Supabase, Tailwind CSS, existing block renderer, server actions, Playwright for visual verification.

---

### Task 1: Split archive vs workspace routes

**Files:**
- Modify: `src/app/admin/posts/page.tsx`
- Create: `src/app/admin/posts/new/page.tsx`
- Create: `src/app/admin/posts/[id]/edit/page.tsx`
- Modify: `src/components/admin/paginated-posts-list.tsx`
- Modify: `src/components/admin/post-editor-item.tsx`

**Step 1: Define the route contract**

- Keep `/admin/posts` as the archive/list page.
- Move creation to `/admin/posts/new`.
- Move editing to `/admin/posts/[id]/edit`.
- Make the archive page surface clear CTAs into the new workspace routes.

**Step 2: Implement the route wrappers**

- Build the new pages so they reuse the same data/actions already available for posts.
- The new routes should render the workspace shell, not the archive layout.

**Step 3: Update navigation from the archive**

- Add a prominent "Nuevo post" CTA.
- Make each post row open the edit workspace.
- Keep the archive searchable and browseable.

**Step 4: Verify route behavior**

- Open `/admin/posts`.
- Confirm the list still renders.
- Confirm the new CTA points to `/admin/posts/new`.
- Confirm existing posts open `/admin/posts/[id]/edit`.

---

### Task 2: Build the document-style workspace shell

**Files:**
- Create: `src/components/admin/post-editor-workspace.tsx`
- Modify: `src/components/admin/create-post-form.tsx`
- Modify: `src/components/admin/post-editor-item.tsx`

**Step 1: Create the workspace layout**

- Use a two-column desktop shell:
  - left: writing canvas
  - right: sticky metadata/publishing sidebar
- On smaller screens, collapse to a single stacked flow.
- Keep the page width wide enough to feel like a document, not a narrow card stack.

**Step 2: Move controls into the sidebar**

- Put slug, type, status, published date, and related metadata in the right rail.
- Keep title, subtitle, excerpt, and body composition in the main writing area.
- Preserve the existing editorial hierarchy, but reduce visual fragmentation.

**Step 3: Reuse the current post form fields**

- Do not rebuild the data model.
- Reuse `title`, `subtitle`, `excerpt`, `cover_image_url`, `hero_image_alt`, `hero_image_caption`, `post_kind`, `status`, `published_at`, and the block composer.

**Step 4: Verify layout behavior**

- Check that the editor visually reads as a single document workspace.
- Confirm the right sidebar stays secondary and sticky on large screens.

---

### Task 3: Turn the block composer into a Word-like canvas

**Files:**
- Modify: `src/components/admin/post-editor-composer.tsx`
- Modify: `src/components/blog/post-blocks.tsx`
- Modify: `src/lib/types/post.ts`

**Step 1: Simplify the chrome**

- Reduce the heavy card framing around each block.
- Make the editor feel like a page with sections, not a dashboard of widgets.
- Keep block actions available, but visually quieter.

**Step 2: Keep the same block set**

- Preserve:
  - paragraph
  - heading
  - image
  - quote
  - callout
  - list
  - divider
  - tool embed
- Do not add new block types yet.

**Step 3: Improve the writing flow**

- Make the body area occupy the main column width.
- Keep inline image insertion.
- Keep live preview, but subordinate it to the writing area.

**Step 4: Verify rendering parity**

- Ensure `content_json` still serializes correctly.
- Ensure the public blog renderer still renders every block type.
- Ensure `content_md` fallback still works.

---

### Task 4: Make media and metadata feel secondary, not fragmented

**Files:**
- Modify: `src/components/admin/upload-image-field.tsx`
- Modify: `src/app/admin/upload-actions.ts`
- Modify: `src/app/admin/posts/actions.ts`
- Modify: `src/lib/supabase/admin-storage.ts`

**Step 1: Keep the current image pipeline**

- Preserve the existing upload/compress/replace flow.
- Keep the current storage cleanup rules.
- Do not reintroduce multiple image slots in the post editor.

**Step 2: Present media in one editorial section**

- The cover image should have a single visible slot.
- Alt and caption should sit directly below it.
- Avoid splitting the same concept into multiple cards.

**Step 3: Verify upload behavior**

- A new cover image should replace the current one in the form preview.
- The post should still save with the same media fields.
- The public detail page should still render the image correctly.

---

### Task 5: Tighten the admin integration and remove obsolete surface glue

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/components/admin/sidebar.tsx`
- Modify: `src/components/admin/header.tsx`
- Modify: `src/components/admin/analytics-kpi-section.tsx`

**Step 1: Route the admin entrypoints cleanly**

- Make the dashboard point users toward the archive and workspace split.
- Keep the admin shell consistent with the new editor.

**Step 2: Remove leftover compact-editor assumptions**

- Eliminate any UI that still implies the editor is a small embedded form.
- Preserve the admin dashboard, but make it clearly separate from the writing workspace.

**Step 3: Verify the full admin loop**

- `/admin` should remain the overview surface.
- `/admin/posts` should be the archive.
- `/admin/posts/new` and `/admin/posts/[id]/edit` should be the writing workspace.

---

### Task 6: Validate visually and functionally before merge

**Files:**
- Test: `src/app/admin/posts/page.tsx`
- Test: `src/app/admin/posts/new/page.tsx`
- Test: `src/app/admin/posts/[id]/edit/page.tsx`
- Test: `src/components/admin/post-editor-workspace.tsx`

**Step 1: Run code checks**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected:
- `lint` passes with no new errors
- `tsc` passes
- `build` passes

**Step 2: Run a browser smoke test**

- Open `/admin/posts`.
- Open `/admin/posts/new`.
- Open an existing post in `/admin/posts/[id]/edit`.
- Confirm the workspace feels wide, document-like, and not card-dense.

**Step 3: Commit**

```bash
git add src/app/admin/posts src/components/admin src/lib/types/post.ts src/lib/supabase/admin-storage.ts src/app/admin/upload-actions.ts docs/plans/2026-03-24-post-editor-word-layout-plan.md
git commit -m "feat(posts): move editor to word-like workspace"
```

---

### Notes for implementation

- Keep `/admin/posts` as the archive and browsing surface.
- Treat the dedicated editor page as the primary writing surface.
- Preserve the current content model and media pipeline; only change the composition and page hierarchy.
- Do not add a PDF workflow or a separate document export in this phase.
- Do not introduce a second editor system alongside the current one; migrate the current one into the new workspace.
