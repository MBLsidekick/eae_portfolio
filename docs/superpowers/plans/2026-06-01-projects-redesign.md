# Projects Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the card-grid layout on `projects.html` with 3 full-width scrolling project sections, each containing a YouTube embed, image gallery, GDD card, and code snippets.

**Architecture:** The page is a static HTML/CSS/JS site with no build step. Each project gets a `<section class="project-section">` element with two zones: a two-column header row (info + video) and a three-column details row (gallery + GDD card + code snippets). A lightbox for images is added as vanilla JS. All content is placeholder.

**Tech Stack:** Vanilla HTML5, CSS custom properties (no preprocessor), vanilla JavaScript (ES5-compatible IIFEs matching existing code style), no external dependencies.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `projects.html` | Rewrite main content | Filter bar (trimmed) + 3 project sections |
| `css/style.css` | Append new rules | `.project-section`, `.project-zone-1`, `.project-zone-2`, `.project-video-wrap`, `.project-gallery`, `.gdd-card`, `.code-snippet-block`, `.lightbox` |
| `css/responsive.css` | Append new rules | Responsive overrides for new layout classes at 1024px, 768px, 480px |
| `js/projects.js` | Rewrite | Remove `initExpandableProjects()`, add `initLightbox()`, keep `initProjectFilters()` (updated to target sections) |

---

## Task 1: Trim the filter bar and scaffold project sections in `projects.html`

**Files:**
- Modify: `projects.html`

Replace the contents of `<div id="projects-filters" ...>` and `<div class="projects-grid">` with the new filter buttons and three bare project section scaffolds. No content yet — just structure.

- [ ] **Step 1: Replace the filter bar buttons**

In `projects.html`, find the `<div id="projects-filters" ...>` block and replace its contents with:

```html
<div id="projects-filters" class="filters" role="toolbar" aria-label="Project filters">
  <button type="button" class="filter-btn is-active" data-filter="all">All</button>
  <button type="button" class="filter-btn" data-filter="unity">Unity</button>
  <button type="button" class="filter-btn" data-filter="action">Action</button>
  <button type="button" class="filter-btn" data-filter="rpg">RPG</button>
  <button type="button" class="filter-btn" data-filter="mobile">Mobile</button>
  <button type="button" class="filter-btn" data-filter="prototype">Prototype</button>
</div>
```

- [ ] **Step 2: Replace `.projects-grid` with project sections scaffold**

Remove the entire `<div class="projects-grid">...</div>` block and replace with:

```html
<div class="projects-list">

  <!-- ── PROJECT 1: Drift in Dread ───────────────────────── -->
  <section
    class="project-section reveal"
    id="project-drift-in-dread"
    data-engine="unity"
    data-genre="action"
    data-type="prototype"
    aria-labelledby="proj1-title"
  >
    <!-- Zone 1 and Zone 2 go here in Task 2 -->
  </section>

  <hr class="project-divider" aria-hidden="true" />

  <!-- ── PROJECT 2: Diablo-like Project ──────────────────── -->
  <section
    class="project-section reveal"
    id="project-diablo-like"
    data-engine="unity"
    data-genre="rpg"
    data-type="prototype"
    aria-labelledby="proj2-title"
  >
    <!-- Zone 1 and Zone 2 go here in Task 2 -->
  </section>

  <hr class="project-divider" aria-hidden="true" />

  <!-- ── PROJECT 3: Mobile Game ───────────────────────────── -->
  <section
    class="project-section reveal"
    id="project-mobile-game"
    data-engine="unity"
    data-genre="mobile"
    data-type="prototype"
    aria-labelledby="proj3-title"
  >
    <!-- Zone 1 and Zone 2 go here in Task 2 -->
  </section>

</div>
```

- [ ] **Step 3: Update `projects.js` filter logic to target `.project-section` elements**

In `js/projects.js`, replace the entire file with:

```js
(function () {
  "use strict";

  function initProjectFilters() {
    var root = document.getElementById("projects-filters");
    if (!root) return;

    var buttons = root.querySelectorAll(".filter-btn");
    var sections = document.querySelectorAll(".project-section");

    function applyFilter(filter) {
      sections.forEach(function (section) {
        var match =
          filter === "all" ||
          section.getAttribute("data-engine") === filter ||
          section.getAttribute("data-genre") === filter ||
          section.getAttribute("data-type") === filter;
        section.hidden = !match;
        // Also hide the <hr> that follows the section when hidden
        var next = section.nextElementSibling;
        if (next && next.classList.contains("project-divider")) {
          next.hidden = !match;
        }
      });

      buttons.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-filter") === filter);
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter") || "all");
      });
    });

    applyFilter("all");
  }

  function initLightbox() {
    // Populated in Task 4
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProjectFilters();
    initLightbox();
  });
})();
```

- [ ] **Step 4: Open `projects.html` in a browser and confirm the filter buttons render, no JS errors in the console, and the page loads without the old cards**

---

## Task 2: Add Zone 1 (header row) content to all 3 project sections

**Files:**
- Modify: `projects.html`

Zone 1 is a two-column grid: left = title/tags/description/links, right = YouTube embed placeholder.

- [ ] **Step 1: Add Zone 1 to Project 1 — Drift in Dread**

Replace the `<!-- Zone 1 and Zone 2 go here in Task 2 -->` comment inside `#project-drift-in-dread` with:

```html
<div class="project-zone-1">
  <div class="project-zone-1-info">
    <div class="project-meta">
      <span class="tag">Unity</span>
      <span class="tag">Action</span>
      <span class="tag">Prototype</span>
    </div>
    <h2 id="proj1-title">Drift in Dread</h2>
    <p class="project-tagline">Survive. Escape. Return to Earth.</p>
    <p>
      A third-person action game set aboard a space station gone wrong. You play a
      genetic experiment subject with the ability to generate light — the weakest
      power among the mutants. Navigate hostile machinery and mutants to reach an
      escape pod.
    </p>
    <p class="timeline-inline">Timeline: TBD</p>
    <div class="project-links">
      <a href="#" rel="noopener noreferrer" target="_blank">Play demo</a>
      <a href="https://github.com/" rel="noopener noreferrer" target="_blank">Source</a>
      <a href="documents/gdd-neon-drift.html" rel="noopener noreferrer" target="_blank">Game Design Doc</a>
      <a href="https://www.youtube.com/" rel="noopener noreferrer" target="_blank">Gameplay video</a>
    </div>
  </div>
  <div class="project-video-wrap">
    <div class="project-video-placeholder" aria-label="Gameplay video placeholder">
      <span class="project-video-play" aria-hidden="true">▶</span>
      <span class="project-video-label">Gameplay Video</span>
    </div>
    <!-- Replace the placeholder div above with an <iframe> when a YouTube URL is ready:
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID"
      title="Drift in Dread gameplay"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
    -->
  </div>
</div>
<!-- Zone 2 goes here in Task 3 -->
```

- [ ] **Step 2: Add Zone 1 to Project 2 — Diablo-like Project**

Replace the `<!-- Zone 1 and Zone 2 go here in Task 2 -->` comment inside `#project-diablo-like` with:

```html
<div class="project-zone-1">
  <div class="project-zone-1-info">
    <div class="project-meta">
      <span class="tag">Unity</span>
      <span class="tag">RPG</span>
      <span class="tag">Prototype</span>
    </div>
    <h2 id="proj2-title">Diablo-like Project</h2>
    <p class="project-tagline">Top-down action RPG in development.</p>
    <p>
      A top-down action RPG prototype inspired by the Diablo series. Built in Unity,
      focused on combat feel, loot systems, and dungeon traversal. Details TBD as
      the project develops.
    </p>
    <p class="timeline-inline">Timeline: TBD</p>
    <div class="project-links">
      <a href="https://github.com/" rel="noopener noreferrer" target="_blank">Source</a>
      <a href="documents/gdd-echo-ruins.html" rel="noopener noreferrer" target="_blank">Game Design Doc</a>
    </div>
  </div>
  <div class="project-video-wrap">
    <div class="project-video-placeholder" aria-label="Gameplay video placeholder">
      <span class="project-video-play" aria-hidden="true">▶</span>
      <span class="project-video-label">Gameplay Video</span>
    </div>
  </div>
</div>
<!-- Zone 2 goes here in Task 3 -->
```

- [ ] **Step 3: Add Zone 1 to Project 3 — Mobile Game**

Replace the `<!-- Zone 1 and Zone 2 goes here in Task 2 -->` comment inside `#project-mobile-game` with:

```html
<div class="project-zone-1">
  <div class="project-zone-1-info">
    <div class="project-meta">
      <span class="tag">Unity</span>
      <span class="tag">Mobile</span>
      <span class="tag">Prototype</span>
    </div>
    <h2 id="proj3-title">Mobile Game</h2>
    <p class="project-tagline">Coming soon.</p>
    <p>
      A mobile game in early development. Gameplay details are not finalised yet.
      Check back for updates.
    </p>
    <p class="timeline-inline">Timeline: TBD</p>
    <div class="project-links">
      <a href="https://github.com/" rel="noopener noreferrer" target="_blank">Source</a>
    </div>
  </div>
  <div class="project-video-wrap">
    <div class="project-video-placeholder" aria-label="Gameplay video placeholder">
      <span class="project-video-play" aria-hidden="true">▶</span>
      <span class="project-video-label">Gameplay Video</span>
    </div>
  </div>
</div>
<!-- Zone 2 goes here in Task 3 -->
```

- [ ] **Step 4: Add Zone 1 CSS to the bottom of `css/style.css`**

```css
/* ─── Project Sections (full-width redesign) ─────────────────── */

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.project-section {
  padding: 4rem 0;
}

.project-section:nth-child(odd) {
  background: var(--bg-surface);
}

.project-section:nth-child(even) {
  background: var(--bg-elevated);
}

.project-divider {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: 0;
}

.project-zone-1 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
  padding: 0 0 2.5rem;
}

.project-zone-1-info h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  margin: 0.5rem 0 0.35rem;
  color: var(--text-primary);
}

.project-tagline {
  font-size: 1rem;
  font-weight: 500;
  color: var(--accent-primary);
  margin: 0 0 0.75rem;
}

.project-video-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  transition: box-shadow var(--transition-smooth);
}

.project-video-wrap:hover {
  box-shadow: var(--shadow-glow);
  border-color: var(--border-accent);
}

.project-video-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.project-video-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-deep) 100%);
  cursor: default;
}

.project-video-play {
  font-size: 2.5rem;
  color: var(--accent-primary);
  opacity: 0.5;
}

.project-video-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Open the browser and verify Zone 1 renders for all 3 projects — two-column layout, video placeholder box, tags, description, links**

---

## Task 3: Add Zone 2 (gallery + GDD card + code snippets)

**Files:**
- Modify: `projects.html`
- Append to: `css/style.css`

- [ ] **Step 1: Add Zone 2 to Project 1 — Drift in Dread**

Replace `<!-- Zone 2 goes here in Task 3 -->` inside `#project-drift-in-dread` with:

```html
<div class="project-zone-2">

  <!-- Gallery -->
  <div class="project-gallery">
    <h3 class="zone-label">Screenshots</h3>
    <div class="gallery-grid">
      <img
        class="gallery-img"
        src="images/projects/neon-drift.svg"
        alt="Drift in Dread — placeholder screenshot 1"
        width="400" height="250" loading="lazy"
      />
      <img
        class="gallery-img"
        src="images/projects/neon-drift.svg"
        alt="Drift in Dread — placeholder screenshot 2"
        width="400" height="250" loading="lazy"
      />
      <img
        class="gallery-img"
        src="images/projects/neon-drift.svg"
        alt="Drift in Dread — placeholder screenshot 3"
        width="400" height="250" loading="lazy"
      />
    </div>
  </div>

  <!-- GDD Card -->
  <div class="gdd-card">
    <h3 class="zone-label">Game Design Doc</h3>
    <p class="gdd-card-title">Drift in Dread — GDD</p>
    <ul class="gdd-card-bullets">
      <li>Player ability: generate light (weakest power)</li>
      <li>Goal: reach the escape pod to return to Earth</li>
      <li>Hostile environment: mutants + machinery</li>
      <li>Stealth and light management as core mechanics</li>
      <li>Space station setting — modular level design</li>
    </ul>
    <a
      class="gdd-card-link"
      href="documents/gdd-neon-drift.html"
      target="_blank"
      rel="noopener noreferrer"
    >Read full GDD →</a>
  </div>

  <!-- Code Snippets -->
  <div class="code-snippets">
    <h3 class="zone-label">Code Highlights</h3>
    <div class="code-snippet-block">
      <span class="code-snippet-label">Light Mechanic</span>
      <pre><code>// Player emits a radius of light
// Enemies outside radius become passive
void UpdateLightRadius(float intensity) {
    lightSource.range = baseLightRange * intensity;
    Physics.OverlapSphere(transform.position,
        lightSource.range, enemyLayer);
}</code></pre>
    </div>
    <div class="code-snippet-block">
      <span class="code-snippet-label">Enemy State Machine</span>
      <pre><code>// Mutant AI: idle → patrol → chase → attack
enum MutantState { Idle, Patrol, Chase, Attack }

void OnPlayerDetected() {
    if (IsInLightRange(player)) {
        TransitionTo(MutantState.Chase);
    }
}</code></pre>
    </div>
  </div>

</div>
```

- [ ] **Step 2: Add Zone 2 to Project 2 — Diablo-like Project**

Replace `<!-- Zone 2 goes here in Task 3 -->` inside `#project-diablo-like` with:

```html
<div class="project-zone-2">

  <div class="project-gallery">
    <h3 class="zone-label">Screenshots</h3>
    <div class="gallery-grid">
      <img
        class="gallery-img"
        src="images/projects/echo-ruins.svg"
        alt="Diablo-like Project — placeholder screenshot 1"
        width="400" height="250" loading="lazy"
      />
      <img
        class="gallery-img"
        src="images/projects/echo-ruins.svg"
        alt="Diablo-like Project — placeholder screenshot 2"
        width="400" height="250" loading="lazy"
      />
    </div>
  </div>

  <div class="gdd-card">
    <h3 class="zone-label">Game Design Doc</h3>
    <p class="gdd-card-title">Diablo-like Project — GDD</p>
    <ul class="gdd-card-bullets">
      <li>Top-down action RPG perspective</li>
      <li>Procedural loot and itemisation system</li>
      <li>Dungeon traversal with combat encounters</li>
      <li>Character class and ability progression</li>
      <li>Placeholder — full doc in progress</li>
    </ul>
    <a
      class="gdd-card-link"
      href="documents/gdd-echo-ruins.html"
      target="_blank"
      rel="noopener noreferrer"
    >Read full GDD →</a>
  </div>

  <div class="code-snippets">
    <h3 class="zone-label">Code Highlights</h3>
    <div class="code-snippet-block">
      <span class="code-snippet-label">Loot Drop System</span>
      <pre><code>// Weighted random loot table
Item RollLoot(LootTable table) {
    float roll = Random.value;
    float cumulative = 0f;
    foreach (var entry in table.entries) {
        cumulative += entry.weight;
        if (roll <= cumulative) return entry.item;
    }
    return table.fallback;
}</code></pre>
    </div>
    <div class="code-snippet-block">
      <span class="code-snippet-label">Combat Hit Detection</span>
      <pre><code>// Melee swing arc detection
void OnSwing(float arcAngle, float range) {
    Collider[] hits = Physics.OverlapSphere(
        transform.position, range, enemyLayer);
    foreach (var hit in hits) {
        if (InArc(hit.transform, arcAngle))
            hit.GetComponent&lt;Health&gt;().TakeDamage(damage);
    }
}</code></pre>
    </div>
  </div>

</div>
```

- [ ] **Step 3: Add Zone 2 to Project 3 — Mobile Game**

Replace `<!-- Zone 2 goes here in Task 3 -->` inside `#project-mobile-game` with:

```html
<div class="project-zone-2">

  <div class="project-gallery">
    <h3 class="zone-label">Screenshots</h3>
    <div class="gallery-grid">
      <img
        class="gallery-img"
        src="images/projects/garden-gnome.svg"
        alt="Mobile Game — placeholder screenshot 1"
        width="400" height="250" loading="lazy"
      />
      <img
        class="gallery-img"
        src="images/projects/garden-gnome.svg"
        alt="Mobile Game — placeholder screenshot 2"
        width="400" height="250" loading="lazy"
      />
    </div>
  </div>

  <div class="gdd-card">
    <h3 class="zone-label">Game Design Doc</h3>
    <p class="gdd-card-title">Mobile Game — GDD</p>
    <ul class="gdd-card-bullets">
      <li>Mobile-first Unity project</li>
      <li>Gameplay mechanics in early design phase</li>
      <li>Touch controls and portrait orientation target</li>
      <li>Placeholder — GDD not yet written</li>
    </ul>
    <!-- No GDD link: document does not exist yet -->
  </div>

  <div class="code-snippets">
    <h3 class="zone-label">Code Highlights</h3>
    <div class="code-snippet-block">
      <span class="code-snippet-label">Touch Input Handler</span>
      <pre><code>// Mobile swipe detection placeholder
void Update() {
    if (Input.touchCount > 0) {
        Touch touch = Input.GetTouch(0);
        if (touch.phase == TouchPhase.Began)
            OnTouchStart(touch.position);
    }
}</code></pre>
    </div>
  </div>

</div>
```

- [ ] **Step 4: Add Zone 2 CSS to the bottom of `css/style.css`**

```css
/* ─── Zone 2: Gallery + GDD Card + Code Snippets ───────────── */

.project-zone-2 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.zone-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin: 0 0 0.75rem;
}

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.gallery-grid img:first-child:last-child {
  grid-column: span 2;
}

.gallery-img {
  width: 100%;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--bg-elevated);
}

.gallery-img:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-soft);
}

/* GDD Card */
.gdd-card {
  background: var(--bg-elevated);
  border-left: 3px solid var(--accent-warm);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  padding: 1.25rem 1.25rem 1rem;
}

.gdd-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0 0 0.75rem;
}

.gdd-card-bullets {
  margin: 0 0 1rem;
  padding-left: 1.2rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.gdd-card-bullets li {
  margin-bottom: 0.25rem;
}

.gdd-card-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-warm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.gdd-card-link:hover {
  color: var(--accent-secondary);
}

/* Code Snippets */
.code-snippets {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.code-snippet-block {
  background: #0d1117;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.code-snippet-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-primary);
  background: rgba(45, 212, 191, 0.07);
  padding: 0.4rem 0.85rem;
  border-bottom: 1px solid var(--border-subtle);
}

.code-snippet-block pre {
  margin: 0;
  padding: 0.85rem;
  overflow-x: auto;
}

.code-snippet-block code {
  font-family: "SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace;
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre;
}
```

- [ ] **Step 5: Open the browser and verify all 3 projects show Zone 2 — gallery thumbnails, GDD card with orange left-border, code blocks with teal label**

---

## Task 4: Implement the image lightbox

**Files:**
- Modify: `js/projects.js`

- [ ] **Step 1: Replace the empty `initLightbox()` stub in `js/projects.js` with the full implementation**

```js
function initLightbox() {
  var overlay = null;

  function openLightbox(src, alt) {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", alt || "Image");

    var img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.className = "lightbox-img";

    var close = document.createElement("button");
    close.type = "button";
    close.className = "lightbox-close";
    close.setAttribute("aria-label", "Close image");
    close.textContent = "×";

    overlay.appendChild(img);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
    document.body.classList.add("lightbox-open");

    // Focus close button for accessibility
    close.focus();

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target === close) closeLightbox();
    });

    document.addEventListener("keydown", onKeyDown);
  }

  function closeLightbox() {
    if (!overlay) return;
    document.body.removeChild(overlay);
    document.body.classList.remove("lightbox-open");
    overlay = null;
    document.removeEventListener("keydown", onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closeLightbox();
  }

  document.querySelectorAll(".gallery-img").forEach(function (img) {
    img.addEventListener("click", function () {
      openLightbox(img.src, img.alt);
    });
  });
}
```

- [ ] **Step 2: Add lightbox CSS to the bottom of `css/style.css`**

```css
/* ─── Lightbox ───────────────────────────────────────────────── */

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: lightboxIn 0.2s ease;
}

@keyframes lightboxIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-img {
  max-width: min(90vw, 1200px);
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.75rem;
  line-height: 1;
  color: var(--text-primary);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}

.lightbox-close:hover {
  background: var(--bg-hover);
}

body.lightbox-open {
  overflow: hidden;
}
```

- [ ] **Step 3: Open the browser, click a gallery image, and verify:**
  - Lightbox overlay appears with the full-size image
  - Clicking the `×` button closes it
  - Clicking outside the image closes it
  - Pressing `Escape` closes it

---

## Task 5: Add responsive CSS overrides

**Files:**
- Append to: `css/responsive.css`

- [ ] **Step 1: Add breakpoint overrides to `css/responsive.css`**

```css
/* ─── Project Sections responsive ───────────────────────────── */

@media (max-width: 1024px) {
  .project-zone-2 {
    grid-template-columns: 1fr 1fr;
  }

  .project-zone-2 .code-snippets {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .project-zone-1 {
    grid-template-columns: 1fr;
  }

  .project-zone-1 .project-video-wrap {
    order: -1;
  }

  .project-zone-2 {
    grid-template-columns: 1fr;
  }

  .project-zone-2 .code-snippets {
    grid-column: span 1;
  }

  .project-section {
    padding: 2.5rem 0;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid img:first-child:last-child {
    grid-column: span 1;
  }
}
```

- [ ] **Step 2: Test at 1024px wide — Zone 2 should be 2-column, code snippets spanning full width**

- [ ] **Step 3: Test at 768px wide — Zone 1 stacks vertically (video above info), Zone 2 stacks vertically**

- [ ] **Step 4: Test at 480px wide — gallery is single column**

---

## Task 6: Final cleanup and commit

**Files:**
- Modify: `css/style.css` — remove old `.projects-grid`, `.project-card`, `.project-thumb`, `.project-body`, `.project-expand`, `.project-details` rules (they are now dead code)

- [ ] **Step 1: Remove dead CSS rules from `css/style.css`**

Delete the following rule blocks (they no longer have corresponding HTML):

- `.projects-grid { ... }`
- `.project-card { ... }` and `.project-card:hover`, `.project-card[hidden]`
- `.project-thumb { ... }` and `.project-thumb img`, `.project-card:hover .project-thumb img`
- `.project-body { ... }` and `.project-body h2`, `.project-body > p`
- `.project-expand { ... }` and all `.project-expand` variants
- `.project-details { ... }` and `.project-details.is-open`, `.project-details-inner`, `.project-details-content`, `.project-details-content ul`

Keep: `.project-meta`, `.tag`, `.tag.unreal`, `.tag.godot`, `.project-links`, `.timeline-inline` — these are still used.

- [ ] **Step 2: Verify the page still renders correctly after CSS cleanup**

- [ ] **Step 3: Test light mode — toggle to light theme and verify all new components (GDD card, code blocks, video placeholder, zone labels) look correct**

- [ ] **Step 4: Test dark mode — toggle back to dark and verify**

- [ ] **Step 5: Check the browser console for JS errors — there should be none**
