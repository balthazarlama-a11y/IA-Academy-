# Editorial Minimalism Audit — 2026-03-18

## Scope
- Repo audited: `C:\Users\Rodrigo\Documents\IAacademy\IANEXUS\05-web`
- Base branch reviewed: `mvpv2`
- Method:
  - code inspection of public layout/page components
  - browser inspection with Playwright against `http://localhost:3000`
- Pages reviewed:
  - `/`
  - `/estudiantes`
  - `/areas`
  - `/blog`
  - `/dia-a-dia`
  - `/herramientas/github-copilot`
  - `/login`

## Executive Summary
The product is moving in the right direction. It already feels more editorial than the previous landing-page version, especially in `Blog` and `Carreras`. The main issue now is not lack of structure, but excess of visual signals.

The UI still carries several traits that make it feel "AI-generated" instead of intentionally designed:
- too many pills, badges and micro-panels competing at once
- too much radius in major containers
- too many explanatory blocks saying similar things
- large hero zones that dominate the page before the content earns that space
- persistent CTA pressure, especially WhatsApp, across contexts where editorial calm would work better

The strongest visual problem is not color. It is density imbalance. Some pages are sparse and oversized, while the cards inside them are over-labeled. That creates a paradoxical effect: the interface feels both empty and noisy.

## What Is Working
1. `Blog` is the closest page to the intended editorial direction.
- Strong archive framing.
- Better hierarchy between featured piece and supporting content.
- Better use of columns and page rhythm.
- Relevant files:
  - `src/app/blog/page.tsx`
  - `src/components/blog/blog-post-card.tsx`
  - `src/components/blog/latest-updates-section.tsx`

2. `Carreras` has a clear proposition.
- The headline is strong and understandable.
- The page explains its value quickly.
- The filter block is understandable and useful.
- Relevant files:
  - `src/app/areas/page.tsx`
  - `src/components/areas/areas-toolbar.tsx`
  - `src/components/areas/area-tool-card.tsx`

3. The shared top shell is calmer than before.
- The global header is much more sober than the earlier SaaS-like version.
- The navigation works visually as a shared editorial shell.
- Relevant file:
  - `src/components/layout/header.tsx`

4. The type scale is mostly solid.
- Big headlines are readable.
- Small labels are consistent enough.
- The issue is not typography quality, but overuse of supporting UI chrome.

## Problems Ordered By Impact

### 1. Home still behaves like a product hero instead of a media front page
Impact: very high

`/` still over-invests in the hero. The left column is visually dominant, the right column is still a "featured card" composition, and the page opens more like a startup front page than a newsroom or media surface.

Symptoms:
- oversized H1 in `src/app/page.tsx`
- too much width and vertical presence given to the opening block
- route stats row adds UI density without adding much editorial value
- top section feels like a polished pitch, not a front page

Files most responsible:
- `src/app/page.tsx`
- `src/components/home/editorial-card.tsx`
- `src/components/home/editorial-topbar.tsx`
- `src/components/home/editorial-section-header.tsx`

Recommendation direction:
- compress hero height
- reduce the number of chips/stats in the first screen
- make content blocks start sooner
- let the homepage feel like a front page with lead story + sections, not a sales hero

### 2. Excess of pills, badges and label chrome across the app
Impact: very high

The interface uses too many rounded pills for taxonomy, status, section framing and metadata. This is one of the strongest "AI slop" signals in the current product.

Symptoms:
- pills for section eyebrow
- pills for taxonomy
- pills for plan
- pills for educational verification
- pills for filters
- pills for stats
- pills for CTA framing

This creates visual chatter. Instead of guiding the eye, it flattens everything into a repeated badge language.

Most affected files:
- `src/app/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/estudiantes/page.tsx`
- `src/components/areas/area-tool-card.tsx`
- `src/components/tools/tool-detail.tsx`
- `src/components/students/student-tool-card.tsx`
- `src/components/home/editorial-card.tsx`

Recommendation direction:
- keep only one badge system for taxonomy
- demote status labels into inline metadata where possible
- stop using pills for every small semantic distinction

### 3. Radius is still too soft for a serious editorial product
Impact: high

There are too many `rounded-2xl`, `rounded-3xl` and soft white cards. This softens the entire product and pushes it toward premium-template aesthetics.

Symptoms:
- major panels are very rounded
- cards, CTA buttons, metadata containers and detail shells all share a soft radius language
- combined with pale backgrounds, this removes tension and makes the UI feel generic

Most affected files:
- `src/app/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/estudiantes/page.tsx`
- `src/components/tools/tool-detail.tsx`
- `src/components/areas/area-tool-card.tsx`

Recommendation direction:
- reserve larger radius for small controls only
- reduce major surfaces to a more editorial radius system
- use sharper cards for archives, feeds and content detail blocks

### 4. Students page is oversized and over-explained
Impact: high

`/estudiantes` is visually useful but still too padded and too explanatory in the opening section. The three support cards repeat what the headline and CTA already suggest.

Symptoms:
- very large hero-like opening block
- three explanatory cards that feel like feature marketing more than editorial guidance
- strong WhatsApp CTA dominates the page emotionally and visually

Files:
- `src/app/estudiantes/page.tsx`
- `src/components/students/students-toolbar.tsx`
- `src/components/students/student-tool-card.tsx`

Recommendation direction:
- cut the intro block down significantly
- reduce the support cards to a single compact explainer row or inline list
- demote WhatsApp CTA weight so the catalog remains primary

### 5. Tool detail still feels like a startup feature sheet
Impact: high

The detail page for a tool is still very badge-heavy and centered around a giant rounded card. It reads more like a SaaS product detail shell than a media/editorial entry.

Symptoms:
- large floating rounded shell in `tool-detail`
- breadcrumb still says `Areas`, which is also conceptually stale
- too many meta pills under the main description
- the content below the fold is sparse relative to the prominence of the top box

Files:
- `src/components/tools/tool-detail.tsx`
- `src/components/tools/tool-meta-badges.tsx`

Recommendation direction:
- reduce shell size and roundness
- flatten metadata into one cleaner row
- increase relation between editorial content and tool detail
- treat the page more like an article-supported catalog entry

### 6. Día a Día still opens with an oversized system panel aesthetic
Impact: medium-high

`/dia-a-dia` is much better conceptually, but the opening still feels too dashboard-like. The numeric cards on the right feel like admin/system widgets, not editorial framing.

Symptoms:
- right-side numeric boxes are visually too strong
- top section still behaves like a composed feature panel instead of a living feed
- too much emphasis on system summary versus discoverable content

Files:
- `src/app/dia-a-dia/page.tsx`
- `src/components/day-to-day/day-feed-layout.tsx`
- `src/components/day-to-day/day-filter-bar.tsx`

Recommendation direction:
- reduce metrics prominence
- move feed content closer to the top
- make the page feel more like a stream and less like a dashboard header

### 7. Login looks detached from the editorial product language
Impact: medium

`/login` is clean but generic. It feels like a standard auth card floating over a decorative background, not part of the same editorial system.

Symptoms:
- isolated central auth card
- strong gradient button signals generic app auth
- background treatment still leans decorative instead of product-specific

Files:
- likely login route and auth form components
- screenshot confirms the mismatch even without deep component tracing

Recommendation direction:
- align auth with the editorial shell
- reduce decorative softness
- make the page feel like a continuation of the product, not a detached auth template

### 8. The floating WhatsApp CTA is too omnipresent
Impact: medium

It is useful, but it competes with page-specific CTAs and with the calmness expected from an editorial product.

Symptoms:
- always visible on pages where the main task is reading or filtering
- creates a persistent bright focal point in the lower right corner

Files:
- `src/components/layout/whatsapp-sticky-button.tsx`
- `src/components/marketing/tracked-whatsapp-link.tsx`

Recommendation direction:
- restrict it by context
- reduce its visual weight on reading-heavy pages
- avoid stacking it against large page-level CTAs

### 9. The visual system is too dependent on explanatory support cards
Impact: medium

Several pages repeat a pattern of “headline + three helper cards”. It works once, but repeated across sections it becomes templated and predictable.

Files:
- `src/app/areas/page.tsx`
- `src/app/estudiantes/page.tsx`
- `src/app/page.tsx`

Recommendation direction:
- replace repeated helper cards with denser editorial summaries, inline metadata, or section intros with fewer supporting blocks

### 10. Content scarcity amplifies design weaknesses
Impact: medium

Because there is still very little real editorial content, every oversized layout decision becomes more obvious. For example, one featured post called `Hola` inside large editorial framing makes the page feel underfilled.

Files/pages affected:
- `/`
- `/blog`
- `/dia-a-dia`

Recommendation direction:
- until content volume grows, the layout should be tighter and less ceremonious

## What To Keep
1. The general direction toward editorial framing.
2. The calmer shared header shell.
3. The overall light palette and restrained color use.
4. The core card concept in `Blog`.
5. The move from “areas” to “carreras” as product framing.
6. The feed concept in `Día a Día`.

## What To Simplify
1. Homepage hero system.
2. Students intro block.
3. Tool detail top section.
4. Support cards that repeat obvious information.
5. Metadata presentation across cards.

## What To Reduce
1. Number of pills/badges per screen.
2. Radius on major panels.
3. Number of explanatory micro-panels.
4. CTA visual aggression.
5. Decorative gradients and soft halo effects behind already large white cards.

## 10 Prioritized Recommendations
1. Reduce the home hero by 25 to 35 percent.
- File focus: `src/app/page.tsx`
- Keep the lead message, but shrink the first fold and surface more actual content immediately.

2. Replace the route stats row on home with one compact editorial metadata line.
- File focus: `src/app/page.tsx`
- The current four stat boxes add UI weight without strong editorial payoff.

3. Standardize a stricter radius scale for editorial surfaces.
- File focus: shared components and high-level page containers
- Large shells should stop feeling pill-like.

4. Cut badge count per card roughly in half.
- File focus:
  - `src/components/areas/area-tool-card.tsx`
  - `src/components/students/student-tool-card.tsx`
  - `src/components/tools/tool-meta-badges.tsx`
- Keep taxonomy and one status indicator; demote the rest.

5. Remove or soften one whole layer of support cards from `Estudiantes` and `Carreras` intros.
- File focus:
  - `src/app/estudiantes/page.tsx`
  - `src/app/areas/page.tsx`
- These sections already explain themselves with the headline and filters.

6. Rework tool detail into a tighter article-like header.
- File focus:
  - `src/components/tools/tool-detail.tsx`
- Less floating-card feel, more structured content hierarchy.

7. Demote WhatsApp as a universal focal point.
- File focus:
  - `src/components/layout/whatsapp-sticky-button.tsx`
  - `src/components/marketing/tracked-whatsapp-link.tsx`
- Keep it available, but stop letting it compete with reading and discovery flows.

8. Replace repeated pills with cleaner text metadata rows.
- File focus:
  - `src/components/home/editorial-card.tsx`
  - `src/components/blog/blog-post-card.tsx`
  - `src/components/tools/tool-detail.tsx`
- Editorial products usually feel stronger when metadata is typographic, not badge-based.

9. Make `Día a Día` start with feed relevance, not system summary.
- File focus:
  - `src/app/dia-a-dia/page.tsx`
  - `src/components/day-to-day/day-feed-layout.tsx`
- The first screen should say “here is what to read/use now”, not “here are 3 counters”.

10. Align Login with the editorial shell.
- File focus: login route/auth UI
- The auth page should feel like part of the same publication ecosystem, not a separate app skin.

## Page-Specific Notes

### Home (`src/app/page.tsx`)
- Stronger than before, but still too ceremonious.
- Feels designed as a polished launch surface, not a disciplined front page.
- Biggest fix: compression and reduction of chips/stats.

### Estudiantes (`src/app/estudiantes/page.tsx`)
- Useful proposition, but too much hero and CTA weight.
- Needs to feel more like a curated index, less like a marketing landing section.

### Carreras (`src/app/areas/page.tsx`, `src/components/areas/*`)
- Good direction and understandable proposition.
- Still somewhat verbose and over-framed.
- Could become one of the strongest sections with less support chrome.

### Blog (`src/app/blog/page.tsx`, `src/components/blog/*`)
- Best visual direction today.
- Still has a bit too much hero treatment, but it is the closest to a convincing editorial archive.

### Día a Día (`src/app/dia-a-dia/page.tsx`, `src/components/day-to-day/*`)
- Conceptually valuable.
- Visually still halfway between feed and dashboard.

### Tool Detail (`src/components/tools/tool-detail.tsx`)
- Useful but still too card-heavy and startup-like.
- Needs stronger content density and less badge theater.

### Login
- Clean, but generic.
- Does not yet belong to the same editorial world.

## Evidence Used
Browser inspection was used.

Generated captures:
- `output/playwright/home.png`
- `output/playwright/home-editorial-audit.png`
- `output/playwright/estudiantes.png`
- `output/playwright/areas.png`
- `output/playwright/blog.png`
- `output/playwright/dia-a-dia.png`
- `output/playwright/tool-github-copilot.png`
- `output/playwright/login.png`

## Merge Risk
Low.

This workstream only adds documentation and screenshots. No source code, config, schema or package changes are included.
