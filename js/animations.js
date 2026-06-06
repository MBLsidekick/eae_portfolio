/**
 * animations.js — Scroll reveals, skill bar animation, site loader
 * Customise IntersectionObserver thresholds or disable reveals if preferred.
 */

(function () {
  "use strict";

  /**
   * Hides the full-screen loader after assets settle.
   */
  function initSiteLoader() {
    var loader = document.getElementById("site-loader");
    if (!loader) return;

    var hide = function () {
      loader.classList.add("is-hidden");
      loader.setAttribute("hidden", "");
      document.body.classList.remove("overflow-hidden");
    };

    if (document.readyState === "complete") {
      window.setTimeout(hide, 400);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(hide, 500);
      });
    }
  }

  /**
   * Adds .is-visible to .reveal elements when they enter the viewport.
   */
  function initScrollReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Animates skill bar widths when the skills section is visible.
   */
  function initSkillBars() {
    var section = document.getElementById("skills");
    if (!section) return;

    var fills = section.querySelectorAll(".skill-bar-fill[data-width]");
    if (!fills.length) return;

    function runAnimation() {
      fills.forEach(function (fill) {
        var w = fill.getAttribute("data-width");
        if (w) fill.style.width = w;
      });
    }

    if (!("IntersectionObserver" in window)) {
      runAnimation();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
  }

  /**
   * Lazy-load images with loading="lazy" fallback for older browsers (native lazy is enough).
   */
  function initLazyImages() {
    if ("loading" in HTMLImageElement.prototype) return;

    var images = document.querySelectorAll("img[data-src]");
    if (!images.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          io.unobserve(img);
        }
      });
    });

    images.forEach(function (img) {
      io.observe(img);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSiteLoader();
    initScrollReveal();
    initSkillBars();
    initLazyImages();
  });
})();
