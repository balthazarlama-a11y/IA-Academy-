# Editorial Post CMS Reset Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the flat markdown-based blog workflow with a structured editorial CMS while resetting the public `tools` content to a clean slate for the new phase.

**Architecture:** Keep `posts` as the single canonical editorial table and move article bodies to structured `content_json` with a `subtitle`, image captions, and block-based rendering. Preserve `post_tools` as the relational bridge to `tools`. Reset `tools` data only once the new schema is in place, then seed fresh tools through the new admin flow.

**Tech Stack:** Next.js App Router, React, Supabase/Postgres, Tiptap, TypeScript, server actions.

---

### Task 1: Lock the target model

**Files:**
- Modify: `supabase/migrations/*`
- Modify: `src/lib/types/post.ts` or equivalent post type file
- Modify: `src/lib/repositories/posts-repo.ts` or equivalent post repository

**Step 1: Write the failing test**

Create a small TypeScript assertion or repo-level test that fails until `posts` exposes:
- `subtitle`
- `content_json`
- `hero_image_alt`
- `hero_image_caption`

**Step 2: Run test to verify it fails**

Run: `npm exec tsc -- --noEmit`
Expected: fail until the new fields are wired through.

**Step 3: Write minimal implementation**

Add the new `posts` columns in a migration and update the mapped post type/repository so the app can read them.

**Step 4: Run test to verify it passes**

Run: `npm exec tsc -- --noEmit`
Expected: pass.

**Step 5: Commit**

```bash
git add supabase/migrations src/lib/types src/lib/repositories
git commit -m "feat(posts): add structured editorial fields"
```

### Task 2: Reset the public tools dataset

**Files:**
- Add: `supabase/migrations/*tools_reset*.sql`
- Modify: `src/lib/repositories/tools-repo.ts`
- Modify: `src/lib/types/tool.ts`
- Modify: admin tool create/edit files as needed

**Step 1: Write the failing test**

Add a simple repository-level assertion or schema verification that expects:
- zero legacy tool rows after reset
- only the new `areas` and `use_cases` taxonomy

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: fail or show mismatched assumptions until the reset migration and mappings are updated.

**Step 3: Write minimal implementation**

Create a destructive migration that:
- truncates `tools`
- clears legacy joins if any remain
- keeps the new taxonomy tables intact
- leaves RLS policies in place for the new phase

**Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: pass with empty `tools` and intact schema.

**Step 5: Commit**

```bash
git add supabase/migrations src/lib/types src/lib/repositories
git commit -m "feat(tools): reset dataset for editorial phase"
```

### Task 3: Build the editorial editor

**Files:**
- Add: `src/components/admin/post-editor/*.tsx`
- Modify: `src/components/admin/create-post-form.tsx`
- Modify: `src/components/admin/post-editor-item.tsx`
- Modify: `src/app/admin/posts/actions.ts`
- Modify: `src/app/admin/posts/page.tsx`

**Step 1: Write the failing test**

Add a basic component or route assertion that confirms the editor expects structured fields instead of only `content_md`.

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: fail or surface missing structured editor wiring.

**Step 3: Write minimal implementation**

Replace the textarea-first UX with:
- title
- subtitle
- hero image
- structured body editor
- image blocks
- caption support
- tool embed support

Use Tiptap as the editor surface if the repo already supports the dependency path cleanly.

**Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: pass.

**Step 5: Commit**

```bash
git add src/components/admin src/app/admin/posts
git commit -m "feat(posts): add structured editorial editor"
```

### Task 4: Rebuild the public article renderer

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/components/blog/post-content.tsx`
- Add or modify: `src/components/blog/post-blocks/*.tsx`

**Step 1: Write the failing test**

Add a rendering assertion that expects:
- subtitle visible under title
- hero caption support
- image blocks between paragraphs
- block-based rendering fallback from `content_md`

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: fail or show old renderer assumptions.

**Step 3: Write minimal implementation**

Render `content_json` first.
Fallback to `content_md` only if structured data is absent.

**Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: pass.

**Step 5: Commit**

```bash
git add src/app/blog src/components/blog
git commit -m "feat(blog): render structured editorial blocks"
```

### Task 5: Migrate existing editorial content

**Files:**
- Add: `supabase/migrations/*content_migration*.sql`
- Modify: seed or conversion helpers if needed

**Step 1: Write the failing test**

Add a migration sanity check or repo assertion for the existing posts so the old content still renders after conversion.

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: fail if post data is still relying on the old shape.

**Step 3: Write minimal implementation**

Convert existing posts into minimal structured JSON blocks and preserve the old markdown as fallback during transition.

**Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: pass.

**Step 5: Commit**

```bash
git add supabase/migrations
git commit -m "feat(posts): migrate content to structured blocks"
```

### Task 6: Verify and clean up

**Files:**
- Review all touched files
- Update any docs or comments that mention the old markdown-only flow

**Step 1: Run validation**

Run:
- `npm run lint`
- `npm exec tsc -- --noEmit`
- `npm run build`

**Step 2: Inspect diffs**

Ensure no legacy `content_md` assumptions remain in the editor path except the intended fallback.

**Step 3: Commit**

```bash
git add .
git commit -m "chore(posts): finalize editorial cms reset"
```

---

## Notes

- Do not split `posts` into `blogs`, `guides`, or `news`.
- Do not create a separate content-block table yet.
- Keep `tools` reset isolated from the article editor changes so the content reset is easy to reason about.
- Prefer smaller commits after each task.
