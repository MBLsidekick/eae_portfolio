/**
 * main.js — Navigation, mobile menu, contact form validation, localStorage prefs, page transitions
 * Replace placeholder contact handler with a real backend or form service URL when deploying.
 */

(function () {
  "use strict";

  var STORAGE_KEY = "portfolioPrefs_v1";

  /**
   * Smooth scroll for same-page anchor links.
   */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link || link.getAttribute("href") === "#") return;
      var id = link.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileNav();
    });
  }

  /**
   * Mobile navigation toggle + backdrop + Escape to close.
   */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    var backdrop = document.querySelector(".nav-backdrop");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      if (backdrop) backdrop.classList.toggle("is-visible", open);
    }

    function closeMobileNav() {
      setOpen(false);
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    if (backdrop) {
      backdrop.addEventListener("click", closeMobileNav);
    }

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });

    window.closeMobileNav = closeMobileNav;
  }

  /**
   * Client-side contact form validation (name, email, message).
   */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var successEl = form.querySelector(".form-success");

    function showError(group, message) {
      group.classList.add("has-error");
      var err = group.querySelector(".form-error");
      if (err) err.textContent = message;
    }

    function clearError(group) {
      group.classList.remove("has-error");
    }

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameG = form.querySelector('[data-field="name"]');
      var emailG = form.querySelector('[data-field="email"]');
      var msgG = form.querySelector('[data-field="message"]');

      var name = nameG.querySelector("input").value.trim();
      var email = emailG.querySelector("input").value.trim();
      var message = msgG.querySelector("textarea").value.trim();

      if (successEl) successEl.classList.remove("is-visible");

      clearError(nameG);
      clearError(emailG);
      clearError(msgG);

      var valid = true;

      if (name.length < 2) {
        showError(nameG, "Please enter your name (at least 2 characters).");
        valid = false;
      }

      if (!validateEmail(email)) {
        showError(emailG, "Please enter a valid email address.");
        valid = false;
      }

      if (message.length < 10) {
        showError(msgG, "Please enter a message (at least 10 characters).");
        valid = false;
      }

      if (!valid) return;

      /* Demo only: no server. Replace with fetch() to your endpoint. */
      console.log("Contact form (demo):", { name: name, email: email, message: message });

      if (successEl) successEl.classList.add("is-visible");
      form.reset();
    });
  }

  /**
   * Loads and saves compact UI preferences (e.g. reduced motion hint).
   */
  function initPreferences() {
    var checkbox = document.getElementById("pref-animations");
    if (!checkbox) return;

    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var prefs = raw ? JSON.parse(raw) : {};
      if (prefs.animationsOff === true) {
        checkbox.checked = true;
        document.documentElement.classList.add("pref-motion-reduce");
      }
    } catch (err) {
      /* ignore */
    }

    checkbox.addEventListener("change", function () {
      var off = checkbox.checked;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ animationsOff: off })
        );
      } catch (e) {
        /* ignore */
      }
      document.documentElement.classList.toggle("pref-motion-reduce", off);
    });
  }

  /**
   * Subtle fade when navigating between local HTML pages (same directory / same origin).
   */
  function initPageTransitions() {
    var content = document.querySelector(".page-content");
    if (!content) return;

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      var hrefAttr = link.getAttribute("href");
      if (!hrefAttr || hrefAttr.indexOf("#") === 0) return;

      try {
        var url = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }

      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      var path = url.pathname.toLowerCase();
      if (path.indexOf(".html") === -1 && path.slice(-1) !== "/") return;

      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      document.body.classList.add("page-transitioning");
      window.setTimeout(function () {
        window.location.href = link.href;
      }, 150);
    });
  }

  /**
   * Light / dark theme (aligned with Space Ahead: localStorage + html.light / html.dark).
   */
  var THEME_KEY = "portfolioTheme";

  function initThemeToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    function syncLabel() {
      var dark = document.documentElement.classList.contains("dark");
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }

    syncLabel();

    btn.addEventListener("click", function () {
      var root = document.documentElement;
      var next = root.classList.contains("dark") ? "light" : "dark";
      root.classList.remove("light", "dark");
      root.classList.add(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* ignore */
      }
      syncLabel();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSmoothScroll();
    initMobileNav();
    initContactForm();
    initPreferences();
    initPageTransitions();
    initThemeToggle();
  });
})();
