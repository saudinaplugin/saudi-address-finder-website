// Site-wide EN/AR language toggle.
//
// Each page defines window.PAGE_STRINGS = { key: { en: "...", ar: "..." } }
// before including this script, then marks translatable elements with
// data-i18n="key" (sets innerHTML) or data-i18n-src="key" (sets the src
// attribute, used for the screenshot images on help.html). This script
// handles applying the saved/selected language and the toggle button.
(function () {
  var STORAGE_KEY = "sa_finder_lang";

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    var strings = window.PAGE_STRINGS || {};

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var entry = strings[el.getAttribute("data-i18n")];
      if (entry && entry[lang]) el.innerHTML = entry[lang];
    });

    document.querySelectorAll("[data-i18n-src]").forEach(function (el) {
      var entry = strings[el.getAttribute("data-i18n-src")];
      if (entry && entry[lang]) el.src = entry[lang];
    });

    var toggleBtn = document.getElementById("lang-toggle-btn");
    if (toggleBtn) toggleBtn.textContent = lang === "ar" ? "English" : "العربية";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());
    var btn = document.getElementById("lang-toggle-btn");
    if (btn) {
      btn.addEventListener("click", function () {
        setLang(getLang() === "ar" ? "en" : "ar");
      });
    }
  });
})();
