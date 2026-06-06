/**
 * gdd.js — Search and category filtering for Game Design Documents listing
 */

(function () {
  "use strict";

  function normalise(s) {
    return (s || "").toLowerCase().trim();
  }

  function initGddFilters() {
    var searchInput = document.getElementById("gdd-search");
    var categoryButtons = document.querySelectorAll(".gdd-cat-btn");
    var cards = document.querySelectorAll(".gdd-card");
    if (!cards.length) return;

    var currentCat = "all";
    var currentQuery = "";

    function cardMatches(card) {
      var cat = card.getAttribute("data-category") || "";
      var title = card.getAttribute("data-title") || "";
      var text = card.textContent || "";

      if (currentCat !== "all" && cat !== currentCat) return false;

      if (currentQuery) {
        var hay = normalise(title + " " + text);
        if (hay.indexOf(currentQuery) === -1) return false;
      }

      return true;
    }

    function apply() {
      cards.forEach(function (card) {
        card.hidden = !cardMatches(card);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        currentQuery = normalise(searchInput.value);
        apply();
      });
    }

    categoryButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentCat = btn.getAttribute("data-category") || "all";
        categoryButtons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        apply();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initGddFilters);
})();
