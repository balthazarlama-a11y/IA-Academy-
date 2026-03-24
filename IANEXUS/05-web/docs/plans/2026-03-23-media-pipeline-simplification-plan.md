# Media Pipeline Simplification Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make image handling simpler and safer by compressing uploads, removing redundant assets, reusing storage cleanly, and ensuring the editor and frontend always render full images without accidental cropping.

**Architecture:** Keep Supabase Storage as the single media bucket, but treat the database as metadata only. The upload pipeline should normalize, compress, and store variants consistently; the UI should only store URLs and captions/alt text. Replaced images should be removed from storage, and the rendering layer should respect full image dimensions when the content asks for it.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Supabase Storage, Sharp, server actions.

---

### Task 1: Audit the current upload and render path

**Files:**
- Inspect: `src/lib/supabase/admin-storage.ts`
- Inspect: `src/app/admin/upload-actions.ts`
- Inspect: `src/components/admin/upload-image-field.tsx`
- Inspect: `src/components/blog/post-blocks.tsx`
- Inspect: `src/components/admin/post-editor-composer.tsx`

**Step 1: Trace how files move from the client to Supabase Storage and back into the editor preview.**

**Step 2: Identify where full-image rendering is being replaced by crop-based or aspect-ratio-based presentation.**

**Step 3: Confirm which handlers own upload, replace, and delete behavior.**

**Step 4: Document the minimum set of fixes needed before changing code.**

**Step 5: Commit the audit notes if they change any tracked doc.**

### Task 2: Normalize upload behavior

**Files:**
- Modify: `src/lib/supabase/admin-storage.ts`
- Modify: `src/app/admin/upload-actions.ts`
- Modify: `src/components/admin/upload-image-field.tsx`

**Step 1: Make upload normalization explicit per usage type.**

**Step 2: Keep compression enabled, but avoid storing unnecessarily large originals when a smaller editorial asset is enough.**

**Step 3: Ensure replace flows return a stable public URL and do not leave temporary assets behind.**

**Step 4: Verify uploads still work for posts and tools.**

**Step 5: Commit the upload normalization pass.**

### Task 3: Clean up storage lifecycle

**Files:**
- Modify: `src/app/admin/posts/actions.ts`
- Modify: `src/app/admin/tools/actions.ts`
- Modify: `src/lib/supabase/admin-storage.ts`

**Step 1: Confirm replaced images are deleted after a successful update.**

**Step 2: Confirm failed creates/updates clean up newly uploaded images when DB writes fail.**

**Step 3: Confirm deletes remove related storage assets when the record is deleted.**

**Step 4: Verify no new orphan patterns were introduced.**

**Step 5: Commit the storage lifecycle cleanup.**

### Task 4: Render full images correctly

**Files:**
- Modify: `src/components/blog/post-blocks.tsx`
- Modify: `src/components/admin/post-editor-composer.tsx`
- Modify: `src/components/tools/tool-detail.tsx` if needed

**Step 1: Remove crop-heavy presentation for article-body images that should render fully.**

**Step 2: Keep editorial images responsive and legible on desktop and mobile.**

**Step 3: Preserve a separate path for logos/thumbnails where square or cropped treatment makes sense.**

**Step 4: Verify article body and editor preview both show the intended image framing.**

**Step 5: Commit the render fix.**

### Task 5: Final media QA

**Files:**
- Inspect: `src/components/admin/upload-image-field.tsx`
- Inspect: `src/components/blog/post-blocks.tsx`
- Inspect: `src/components/admin/post-editor-composer.tsx`

**Step 1: Upload a cover image and confirm the server response is clean.**

**Step 2: Replace an existing image and confirm the old asset is removed.**

**Step 3: Render the same asset in admin preview and frontend article view.**

**Step 4: Run lint, typecheck, and build.**

**Step 5: Commit the verified media pass.**
