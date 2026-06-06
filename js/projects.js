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
    var overlay = null;
    var siblings = [];
    var currentIdx = 0;

    function openLightbox(imgs, idx) {
      siblings = imgs;
      currentIdx = idx;

      overlay = document.createElement("div");
      overlay.className = "lightbox";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");

      var img = document.createElement("img");
      img.className = "lightbox-img";

      var close = document.createElement("button");
      close.type = "button";
      close.className = "lightbox-close";
      close.setAttribute("aria-label", "Close image");
      close.textContent = "×";

      var prev = document.createElement("button");
      prev.type = "button";
      prev.className = "lightbox-nav lightbox-prev";
      prev.setAttribute("aria-label", "Previous image");
      prev.textContent = "←";

      var next = document.createElement("button");
      next.type = "button";
      next.className = "lightbox-nav lightbox-next";
      next.setAttribute("aria-label", "Next image");
      next.textContent = "→";

      var caption = document.createElement("p");
      caption.className = "lightbox-caption";

      overlay.appendChild(img);
      overlay.appendChild(caption);
      overlay.appendChild(close);
      overlay.appendChild(prev);
      overlay.appendChild(next);
      document.body.appendChild(overlay);
      document.body.classList.add("lightbox-open");

      function show(i) {
        currentIdx = (i + siblings.length) % siblings.length;
        img.src = siblings[currentIdx].src;
        img.alt = siblings[currentIdx].alt || "";
        overlay.setAttribute("aria-label", img.alt || "Image");
        var desc = siblings[currentIdx].getAttribute("data-description") || "";
        caption.textContent = desc;
        caption.style.display = desc ? "" : "none";
        prev.style.display = siblings.length > 1 ? "" : "none";
        next.style.display = siblings.length > 1 ? "" : "none";
      }

      show(currentIdx);
      close.focus();

      prev.addEventListener("click", function (e) { e.stopPropagation(); show(currentIdx - 1); });
      next.addEventListener("click", function (e) { e.stopPropagation(); show(currentIdx + 1); });

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
      siblings = [];
      document.removeEventListener("keydown", onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") { var p = overlay && overlay.querySelector(".lightbox-prev"); if (p) p.click(); }
      if (e.key === "ArrowRight") { var n = overlay && overlay.querySelector(".lightbox-next"); if (n) n.click(); }
    }

    document.querySelectorAll(".screenshot-strip").forEach(function (strip) {
      var imgs = Array.from(strip.querySelectorAll(".gallery-img"));
      imgs.forEach(function (img, i) {
        img.addEventListener("click", function () {
          openLightbox(imgs, i);
        });
      });
    });

    document.querySelectorAll(".gdd-slides-btn").forEach(function (btn) {
      var strip = btn.closest(".project-zone-1-info").querySelector(".gdd-slides-strip");
      if (!strip) return;
      var imgs = Array.from(strip.querySelectorAll(".gallery-img"));
      btn.addEventListener("click", function () {
        openLightbox(imgs, 0);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProjectFilters();
    initLightbox();
  });
})();
