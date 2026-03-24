# Simple Document Editor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the card-heavy post composer with a document-like editor that feels closer to writing in a clean article canvas while preserving the current content blocks and publishing capabilities.

**Architecture:** Keep `posts` and `content_json` as the source of truth, but reshape the authoring UI into a single document-first surface. The left/main column should behave like a long-form manuscript, while the right side becomes lightweight metadata and preview support only when it adds value. Preserve existing block types and server actions, but reduce visual fragmentation and scrolling overhead.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Supabase, current post block serializers.

---

### Task 1: Define the document editor layout

**Files:**
- Modify: `src/components/admin/post-editor-composer.tsx`
- Modify: `src/components/admin/create-post-form.tsx`
- Modify: `src/components/admin/post-editor-item.tsx`

**Step 1: Review the current composer and identify the parts that make it feel like cards instead of a document.**

**Step 2: Rewrite the visual structure so the editor reads as one continuous article canvas with a lighter toolbar and fewer nested panels.**

**Step 3: Keep the existing block types, but make their presentation flatter and more manuscript-like.**

**Step 4: Verify the page still composes, edits, and submits posts correctly.**

**Step 5: Commit the layout refactor.**

### Task 2: Simplify the block interaction model

**Files:**
- Modify: `src/components/admin/post-editor-composer.tsx`
- Modify: `src/components/blog/post-blocks.tsx`

**Step 1: Reduce the amount of UI chrome around each block.**

**Step 2: Make image, quote, and callout blocks feel like inserted content inside the document rather than separate control cards.**

**Step 3: Keep ordering, duplication, and deletion available, but make the controls smaller and secondary.**

**Step 4: Verify block serialization and preview rendering stay aligned.**

**Step 5: Commit the block UX simplification.**

### Task 3: Make the preview secondary

**Files:**
- Modify: `src/components/admin/post-editor-composer.tsx`

**Step 1: Move the preview to a less dominant position or collapse it behind a toggle on smaller widths.**

**Step 2: Ensure the writing canvas gets the majority of the width.**

**Step 3: Keep a preview available for validation, but do not let it compete with the editor.**

**Step 4: Verify the editor remains readable at common desktop widths.**

**Step 5: Commit the preview adjustment.**

### Task 4: Preserve save and publish behavior

**Files:**
- Inspect: `src/app/admin/posts/actions.ts`
- Inspect: `src/components/admin/create-post-form.tsx`
- Inspect: `src/components/admin/post-editor-item.tsx`

**Step 1: Confirm the direct form submit path still works for create/update/delete actions.**

**Step 2: Confirm hidden `content_json` and `content_md` fields still serialize correctly.**

**Step 3: Confirm image upload actions still resolve to a valid media URL.**

**Step 4: Run lint, typecheck, and build.**

**Step 5: Commit the verified editor refactor.**

### Task 5: Visual QA pass

**Files:**
- Inspect: `src/components/admin/post-editor-composer.tsx`
- Inspect: `src/components/admin/post-editor-item.tsx`
- Inspect: `src/components/admin/create-post-form.tsx`

**Step 1: Open the admin posts page locally and validate spacing, hierarchy, and readability.**

**Step 2: Check a long article, a short article, and an image-heavy article.**

**Step 3: Tweak only spacing and width if the canvas still feels too narrow or too fragmented.**

**Step 4: Run final verification.**

**Step 5: Commit the polish pass.**
