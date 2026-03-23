# IA NEXUS Editorial Content Architecture Plan

**Date:** 2026-03-23  
**Scope:** database simplification, `posts` redesign, and editorial authoring architecture  
**Status:** planning only

---

## Goal

Replace the current flat blog authoring flow with a cleaner editorial content system that:

- keeps the database simple
- treats `posts` as the single content entity
- supports richer article structure
- makes writing feel closer to a real editorial tool instead of a markdown textarea
- preserves the existing relationship between articles and tools

This document does **not** define a PRD. It defines the architecture and migration plan.

---

## What We Have Today

### Public tables currently in Supabase

Observed via Supabase MCP on project `iktxzveqylzdypvpfhdp`:

- `profiles`
- `posts`
- `tools`
- `career_paths`
- `tool_careers`
- `post_tools`
- `analytics_events`

### Important observation

There are **not** separate tables for blog, guide, and news.

Today the editorial model is already centered on a single table:

- `posts`

And it uses:

- `post_kind = blog | tool | guide | news`

So the real issue is **not too many tables**. The real issue is that the editorial model is too flat and the editor is too primitive.

### Current `posts` shape

Current columns in `public.posts`:

- `id`
- `title`
- `slug`
- `excerpt`
- `content_md`
- `cover_image_url`
- `post_kind`
- `ia_type`
- `status`
- `published_at`
- `author_id`
- `created_at`
- `updated_at`

### Current authoring flow

Current admin post creation/editing is built around:

- `title`
- `slug`
- `cover_image_url`
- `ia_type`
- `post_kind`
- `status`
- `published_at`
- `excerpt`
- `content_md`

Main files:

- `src/components/admin/create-post-form.tsx`
- `src/components/admin/post-editor-item.tsx`
- `src/app/admin/posts/actions.ts`
- `src/app/admin/posts/page.tsx`

### Current rendering model

Current post rendering uses manual markdown-like parsing from `content_md`:

- headings
- paragraphs
- simple bullet lists

Main files:

- `src/app/blog/[slug]/page.tsx`
- `src/components/blog/post-content.tsx`

This is the main reason the editorial experience feels limited.

---

## Core Diagnosis

### Problem 1: the content model is too flat

A real editorial article needs more than:

- title
- excerpt
- single cover image
- one markdown field

The current model makes it hard to express:

- subtitle/dek
- structured body content
- images between paragraphs
- image captions
- pull quotes
- callouts
- embedded tool references
- richer editorial layout logic

### Problem 2: the authoring UX is too technical

Today writing a post feels like filling an admin form and pasting markdown into a textarea.

That is acceptable for a prototype, but not for a media platform.

### Problem 3: `post_kind` is overloaded

Today `post_kind` mixes:

- format
- editorial intent
- content type

Examples:

- `guide` is closer to a presentation/layout or editorial intent than a distinct storage entity
- `tool` as a post kind conflicts conceptually with the actual `tools` table

### Problem 4: the article renderer is not future-proof

Parsing `content_md` manually is not enough for:

- embedded media
n- structured sections
- reusable blocks
- richer article layout patterns
- flexible previews

---

## Architecture Decision

## Keep one canonical content table: `posts`

Do **not** split content into separate tables such as:

- `blogs`
- `guides`
- `news`

That would create unnecessary duplication, routing complexity, admin complexity, and migration overhead.

Instead:

- keep `posts` as the canonical editorial content table
- keep `post_tools` as the relational bridge between posts and tools
- keep `tools` separate as its own canonical entity

### Why this is the right choice

Because IA NEXUS is not dealing with fundamentally different persistence models for blog/news/guides. It is dealing with different editorial presentations of the same base entity: an article-like piece of content.

---

## Target Data Model

## `posts` should evolve into this

### Keep

- `id`
- `slug`
- `title`
- `excerpt`
- `cover_image_url`
- `status`
- `published_at`
- `author_id`
- `created_at`
- `updated_at`

### Add

- `subtitle`
- `content_json`
- `hero_image_alt`
- `hero_image_caption`
- `visibility`
- `plain_text`

### Review / simplify later

- `post_kind`
- `ia_type`

---

## Proposed `posts` design

### `title`
Primary article title.

### `subtitle`
Short deck/subtitle directly under the title.

This is essential if the experience is meant to feel closer to Substack or an editorial CMS.

### `excerpt`
Compact summary used for:

- cards
- social previews
- SEO descriptions
- fallback summaries

### `cover_image_url`
Primary visual asset for cards and standard article cover use.

### `hero_image_alt`
Accessible alt text for the hero image.

### `hero_image_caption`
Optional caption/credit under the hero image.

### `content_json`
Canonical structured body content.

This should become the main article body field.

Recommended type:

- `jsonb`

### `plain_text`
Generated or synchronized plain text representation.

Useful for:

- search
- previews
- fallback excerpts
- analytics/search indexing later

### `visibility`
Controls access model.

Recommended initial values:

- `public`
- `members`

This fits your current login-gated article preview approach much better than hardcoding display behavior only in React.

### `post_kind`
Keep temporarily for compatibility, but simplify later.

Recommended long-term values:

- `article`
- `news`

And move old distinctions such as `guide` to presentation or tag-level semantics.

---

## Recommended Content Body Format

## Move from `content_md` to `content_json`

`content_md` should stop being the primary source of truth.

It can stay temporarily during migration, but the long-term source should be `content_json`.

### Why `jsonb`

Because it allows block-based authoring without creating a separate table for every block.

That keeps the database simple while making the editor much more powerful.

### Recommended block types for phase 1

- `paragraph`
- `heading`
- `image`
- `quote`
- `bulleted_list`
- `numbered_list`
- `divider`
- `callout`
- `tool_embed`

This is enough to support real editorial articles without over-engineering.

---

## Recommended Editor Architecture

## Use a rich editor, not a textarea

Recommended editor stack:

- `Tiptap`

### Why Tiptap

Because it gives a good balance of:

- rich editing
- JSON output
- React compatibility
- extensibility for custom nodes
- cleaner editorial UX than markdown

### Why not stay on markdown

Markdown is fine for technical writing, but it is not a good primary authoring experience for the kind of editorial product IA NEXUS wants to become.

### Why not create `post_blocks` table now

That would add too much complexity too early.

A `jsonb` content body is the right intermediate architecture:

- flexible enough for editorial content
- simple enough for current scale
- easier to migrate than a fully normalized block schema

---

## Recommended Editor UX

The post editor should become a true composition surface.

### Fields above the editor

- title
- subtitle
- slug
- hero image
- hero image alt
- hero image caption
- visibility
- status
- published_at
- post kind
- related tools selector

### Editor body

Block-based article composition with:

- paragraphs
- headings
- inline image insertions
- pull quotes
- tool embeds
- callouts

### Right-side or secondary metadata panel

Optional later:

- SEO summary
- preview card
- publish settings
- related tools

---

## Database Simplification Strategy

## Keep these tables

- `profiles`
- `posts`
- `tools`
- `career_paths`
- `tool_careers`
- `post_tools`
- `analytics_events`

## Do not add these tables now

- `blogs`
- `guides`
- `news`
- `post_blocks`
- `editor_documents`

## Why

Because the current product does not need more entity separation. It needs better authoring and rendering around the entities it already has.

---

## Recommended Evolution of `post_kind`

### Current

- `blog`
- `tool`
- `guide`
- `news`

### Recommended target

Short-term:

- keep current enum for compatibility

Mid-term:

- migrate toward:
  - `article`
  - `news`

### Interpretation

- `guide` becomes an article presentation/style, not a storage type
- `tool` should stop being a post kind; tools are already first-class entities in `tools`

---

## Rendering Architecture

## Replace manual markdown parsing with structured rendering

Current renderer:

- reads `content_md`
- splits text blocks manually
- supports only basic headings and lists

Target renderer:

- reads `content_json`
- renders by block type
- supports richer layouts

### Required block renderers

- paragraph renderer
- heading renderer
- image renderer
- quote renderer
- list renderer
- callout renderer
- tool embed renderer

### Backward compatibility rule

During migration:

- if `content_json` exists, render it
- otherwise, render `content_md`

This keeps rollout safe.

---

## Migration Plan

## Phase 1: stabilize the conceptual model

Goal:

- declare `posts` as the canonical editorial table
- avoid new content tables

Tasks:

- document this architecture
- stop planning separate `blog/news/guide` tables
- keep `post_tools` as the main article-to-tool relationship

## Phase 2: extend `posts`

Goal:

- prepare the database for real editorial content

Add columns:

- `subtitle text null`
- `content_json jsonb null`
- `hero_image_alt text null`
- `hero_image_caption text null`
- `visibility text not null default 'public'`
- `plain_text text null`

Notes:

- `visibility` can stay as text initially
- if needed later, it can become an enum

## Phase 3: support dual-rendering

Goal:

- allow old and new content to coexist

Rules:

- `content_json` preferred if present
- `content_md` used as fallback

## Phase 4: replace the editor

Goal:

- move admin post creation/editing away from textarea markdown

Tasks:

- build `Tiptap` editor component
- add structured toolbar and block insertion
- add image block support
- add tool embed block support
- add subtitle + caption fields

## Phase 5: migrate existing posts

Goal:

- move old content into the new model safely

Current dataset is small enough that this can be done cheaply.

Strategy:

- convert current `content_md` into minimal `content_json`
- preserve original markdown during transition

## Phase 6: simplify `post_kind`

Goal:

- reduce semantic confusion

Tasks:

- audit current usage of `guide` and `tool`
- migrate to a smaller enum
- update admin filters and frontend labels

---

## File Areas Likely Affected Later

### Database / schema

- Supabase migration files
- any shared TypeScript types for posts

### Server data layer

- `src/lib/supabase/server.ts`
- `src/app/admin/posts/actions.ts`

### Admin editor UI

- `src/components/admin/create-post-form.tsx`
- `src/components/admin/post-editor-item.tsx`
- new editor component(s)

### Post rendering

- `src/app/blog/[slug]/page.tsx`
- `src/components/blog/post-content.tsx`

### Relations

- `src/lib/repositories/post-tools-repo.ts`

---

## Non-Goals

These are explicitly out of scope for this architecture phase:

- full PRD writing
- newsletter product design
- comments/community layer
- version history/editor collaboration
- separate content tables by editorial type
- full CMS rewrite beyond posts

---

## Final Recommendation

The correct next move is **not** to split the database further.

The correct next move is:

1. keep `posts` as the canonical editorial content table
2. redesign `posts` to support structured content
3. move from `content_md` to `content_json`
4. build a proper editor experience with `Tiptap`
5. keep `post_tools` as the bridge between editorial and tools
6. simplify `post_kind` only after the new model is in place

This gives IA NEXUS:

- a cleaner base model
- a more serious editorial workflow
- a blog that feels closer to a real publishing product
- lower schema complexity than splitting everything into separate content tables
