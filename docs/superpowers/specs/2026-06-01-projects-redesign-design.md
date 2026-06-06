# Projects Page Redesign — Design Spec
Date: 2026-06-01

## Overview

Replace the existing card-grid layout on `projects.html` with 3 full-width scrolling project sections, each displaying a YouTube embed, image gallery, GDD card, and code snippets. Retain the filter bar (trimmed to relevant filters). Match the existing site theme (dark teal + orange, Plus Jakarta Sans / Inter fonts, CSS custom properties).

---

## Projects

| # | Name | Engine | Genre/Type |
|---|------|--------|------------|
| 1 | Drift in Dread | Unity | Action / Prototype |
| 2 | Diablo-like Project | Unity | RPG / Prototype |
| 3 | Mobile Game | Unity | TBD / Prototype |

All content is placeholder until the owner swaps in real URLs, images, and text.

---

## Page Structure

```
[Filter bar]
[Project Section 1 — Drift in Dread]
[divider]
[Project Section 2 — Diablo-like Project]
[divider]
[Project Section 3 — Mobile Game]
[Footer]
```

---

## Filter Bar

Remove filters that no longer match any project: `unreal`, `godot`, `racing`, `puzzle`.

Remaining filters:
- All
- Unity
- Strategy
- Jam
- Prototype

The filter logic in `projects.js` uses `data-engine`, `data-genre`, `data-type` attributes on each section. No JS rewrite needed — just update the HTML attributes and button set.

---

## Per-Project Section Layout

Each project `<section>` contains two zones:

### Zone 1 — Header Row (2-column grid)

**Left column:**
- Project title (`<h2>`, `Plus Jakarta Sans`, ~2rem, `var(--text-primary)`)
- Subtitle / tagline in `var(--accent-primary)` teal
- Engine + genre tags (reuse existing `.tag` classes)
- Description paragraph (`var(--text-secondary)`)
- Timeline line (reuse `.timeline-inline`)
- Action links: Play demo, Repo, GDD, Gameplay video — reuse `.project-links` styles

**Right column:**
- YouTube `<iframe>` embed, 16:9 aspect ratio, `width: 100%`
- Placeholder: `src="about:blank"` with a styled poster overlay showing "▶ Gameplay Video" until a real URL is added
- Border-radius matches `var(--radius-lg)`, teal glow on hover via `var(--shadow-glow)`

### Zone 2 — Media + Details Row (3-column grid)

**Column 1 — Image Gallery**
- 2–3 `<img>` thumbnails in a grid (2-up or 3-up depending on count)
- Clicking an image opens a simple lightbox (fullscreen overlay, click outside to close)
- Placeholder: SVG images from existing `images/projects/` folder
- Images have `border-radius: var(--radius-md)`, hover scale `1.03`

**Column 2 — GDD Card**
- Styled card with `border-left: 3px solid var(--accent-warm)` (orange)
- Card header: "Game Design Doc" label + project name
- Body: 3–5 bullet points summarising key design pillars (placeholder text)
- Footer: "Read full GDD →" link pointing to `documents/gdd-<slug>.html`
- GDD links are only rendered if the corresponding document file exists. Projects 1 and 2 have placeholder GDD files; Project 3 (Mobile Game) has none yet — omit the link for that project

**Column 3 — Code Snippets**
- 2–3 `<pre><code>` blocks, each with a small label above (e.g. "Light Mechanic", "Enemy AI")
- Dark background `#0d1117`, teal (`var(--accent-primary)`) for keywords/comments
- Font: monospace system stack
- Placeholder: representative pseudocode matching the project theme

---

## Visual Treatment

- Section backgrounds alternate: odd sections use `var(--bg-surface)`, even sections use `var(--bg-elevated)`
- Sections have `padding: 4rem 0`, separated by a `1px solid var(--border-subtle)` divider
- No new CSS variables introduced — reuse all existing tokens
- Responsive: on mobile (`< 768px`), both zone grids collapse to single column

---

## Responsive Behaviour

| Breakpoint | Zone 1 | Zone 2 |
|------------|--------|--------|
| ≥ 1024px | 2 cols (50/50) | 3 cols (equal) |
| 768–1023px | 2 cols (50/50) | 2 cols + snippet below |
| < 768px | 1 col (video below header) | 1 col stacked |

---

## JavaScript Changes

### `projects.js`
- `initProjectFilters()` — no logic change; HTML `data-*` attribute updates handle filter matching
- `initExpandableProjects()` — remove (no expand buttons in new design)
- Add: `initLightbox()` — simple image lightbox
  - On `.gallery-img` click: create overlay div, display full image, click overlay to close
  - No external library; ~30 lines vanilla JS

### `main.js` / `animations.js`
- No changes required; existing reveal animations apply automatically to new sections via `.reveal` class

---

## Files Changed

| File | Change |
|------|--------|
| `projects.html` | Full rewrite of main content (filter bar + project sections) |
| `css/style.css` | Add new rules: `.project-section`, `.project-zone-1`, `.project-zone-2`, `.project-video-wrap`, `.project-gallery`, `.gdd-card`, `.code-snippet-block`, `.lightbox` |
| `css/responsive.css` | Add responsive overrides for new layout classes |
| `js/projects.js` | Remove `initExpandableProjects()`, add `initLightbox()` |

---

## Out of Scope

- No real content (videos, images, GDD text, code) — all placeholder
- No new pages created
- No changes to `index.html`, `gdd.html`, or any document files
- No backend or build tooling
