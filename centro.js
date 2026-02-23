/* =========================
   centro.js — Bausen Centro
   - Mobile menu (open/close + overlay + ESC)
   - Language dropdown (ES/EN/PT...) + i18n ES/EN via data-i18n*
   - Reveal on scroll (IntersectionObserver)
   - Tilt effect (data-tilt)
   - Course filters
   - CV form UX (file name + basic validate)
   - FAQ accordion
   - Smooth anchor scroll with header offset
========================= */

(() => {
  "use strict";

  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elements
  const header = $("#siteHeader");

  // Language
  const langBtn = $("#langBtn");
  const langList = $("#langList");
  const langCode = $("#langCode");
  const langFlag = langBtn ? $(".lang__flag", langBtn) : null;

  // Mobile menu
  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const mobileMenu = $("#mobileMenu");
  const mobileMenuOverlay = $("#mobileMenuOverlay");

  // Courses / filters
  const chips = $$(".chip");
  const courses = $$(".course");

  // CV form
  const cvForm = $("#cvForm");
  const cvFile = $("#cvFile");
  const cvFileName = $("#cvFileName");
  const cvMsg = $("#cvMsg");

  // FAQ
  const faq = $("#faq");

  /* -------------------------
     Language dropdown (ES/EN/DE/PT/FR/IT) — reference parity
  ------------------------- */
  const LANG_KEY = "bausen_lang";

  const FLAG_SVG = {
    ES: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#AA151B"></rect>
          <rect y="7" width="24" height="10" fill="#F1BF00"></rect>
        </svg>`,
    EN: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#012169"></rect>
          <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFF" stroke-width="5"/>
          <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" stroke-width="3"/>
        </svg>`,
    DE: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#000"></rect>
          <rect y="8" width="24" height="8" fill="#DD0000"></rect>
          <rect y="16" width="24" height="8" fill="#FFCE00"></rect>
        </svg>`,
    PT: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#006600"></rect>
          <circle cx="10" cy="12" r="6" fill="#FF0000"></circle>
        </svg>`,
    FR: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#FFF"></rect>
          <rect width="8" height="24" rx="6" fill="#0055A4"></rect>
          <rect x="16" width="8" height="24" rx="6" fill="#EF4135"></rect>
        </svg>`,
    IT: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#FFF"></rect>
          <rect width="8" height="24" rx="6" fill="#009246"></rect>
          <rect x="16" width="8" height="24" rx="6" fill="#CE2B37"></rect>
        </svg>`,
  };

  const normalizeLang = (lang) => {
    const v = String(lang || "").trim();
    const up = v.toUpperCase();

    if (up === "EN" || up === "ES" || up === "DE" || up === "PT" || up === "FR" || up === "IT") return up;
    if (v.toLowerCase().startsWith("en")) return "EN";
    if (v.toLowerCase().startsWith("es")) return "ES";
    if (v.toLowerCase().startsWith("pt")) return "PT";
    if (v.toLowerCase().startsWith("fr")) return "FR";
    if (v.toLowerCase().startsWith("it")) return "IT";
    if (v.toLowerCase().startsWith("de")) return "DE";
    return "ES";
  };

  const LANG_LABEL = {
    ES: "Español",
    EN: "English",
    DE: "Deutsch",
    PT: "Português",
    FR: "Français",
    IT: "Italiano",
  };

  const LANG_TO_HTML = {
    ES: "es",
    EN: "en",
    DE: "de",
    PT: "pt",
    FR: "fr",
    IT: "it",
  };

  /* -------------------------
     i18n (ES/EN) — traducción de TODO el HTML via data-i18n*
     - ES usa el contenido base del HTML (snapshot). EN usa diccionario.
  ------------------------- */
  const I18N_EN = {
    "nav.home": "Home",
    "nav.press": "Press",
    "nav.services": "Services",
    "nav.news": "News",
    "nav.training": "Training Center",
    "nav.about": "About",
    "header.collab": "Are you a collaborator?",
    "ui.openMenu": "Open menu",
    "ui.closeMenu": "Close menu",
    "ui.langSelect": "Select language",
    "ui.goHome": "Go to home",
    "ui.toggleTheme": "Toggle light/dark theme",
    // ... (tu diccionario EN completo se queda igual, no lo recorto aquí)
  };

  const I18N_DEFAULTS = { done: false };

  function snapshotI18nDefaults() {
    if (I18N_DEFAULTS.done) return;
    I18N_DEFAULTS.done = true;

    $$("[data-i18n]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultHtml) el.dataset.i18nDefaultHtml = el.innerHTML;
    });
    $$("[data-i18n-text]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultText) el.dataset.i18nDefaultText = el.textContent || "";
    });
    $$("[data-i18n-placeholder]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultPlaceholder) el.dataset.i18nDefaultPlaceholder = el.getAttribute("placeholder") || "";
    });
    $$("[data-i18n-aria]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultAria) el.dataset.i18nDefaultAria = el.getAttribute("aria-label") || "";
    });
  }

  function applyTranslations(lang) {
    const L = String(lang || "ES").toUpperCase() === "EN" ? "EN" : "ES";

    if (L === "ES") {
      $$("[data-i18n]", document).forEach((el) => {
        if (el.dataset.i18nDefaultHtml) el.innerHTML = el.dataset.i18nDefaultHtml;
      });
      $$("[data-i18n-text]", document).forEach((el) => {
        if (el.dataset.i18nDefaultText != null) el.textContent = el.dataset.i18nDefaultText;
      });
      $$("[data-i18n-placeholder]", document).forEach((el) => {
        if (el.dataset.i18nDefaultPlaceholder != null) el.setAttribute("placeholder", el.dataset.i18nDefaultPlaceholder);
      });
      $$("[data-i18n-aria]", document).forEach((el) => {
        if (el.dataset.i18nDefaultAria != null) el.setAttribute("aria-label", el.dataset.i18nDefaultAria);
      });
      return;
    }

    $$("[data-i18n]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.innerHTML = val;
    });

    $$("[data-i18n-text]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n-text");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.textContent = val;
    });

    $$("[data-i18n-placeholder]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.setAttribute("placeholder", val);
    });

    $$("[data-i18n-aria]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.setAttribute("aria-label", val);
    });
  }

  function renderLangOptions() {
    if (!langList) return;

    $$("#langList li", document).forEach((li) => {
      const code = normalizeLang(li.getAttribute("data-lang") || "ES");
      li.innerHTML = `
        <span class="lang__opt-flag" aria-hidden="true">
          ${FLAG_SVG[code] || FLAG_SVG.ES}
        </span>
        <span class="lang__opt-text">${LANG_LABEL[code] || code} (${code})</span>
      `.trim();
      li.setAttribute("aria-label", `${LANG_LABEL[code] || code} (${code})`);
    });
  }

  function setLang(code) {
    const raw = normalizeLang(code);
    const L = raw === "EN" || raw === "ES" ? raw : "ES";

    if (langCode) langCode.textContent = L;
    if (langFlag) langFlag.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;

    document.documentElement.setAttribute("lang", LANG_TO_HTML[L] || (L === "EN" ? "en" : "es"));

    try {
      localStorage.setItem(LANG_KEY, L);
    } catch (_) {}

    applyTranslations(L);
  }

  function openLang() {
    if (!langList || !langBtn) return;
    langList.classList.add("show");
    langBtn.setAttribute("aria-expanded", "true");
  }
  function closeLang() {
    if (!langList || !langBtn) return;
    langList.classList.remove("show");
    langBtn.setAttribute("aria-expanded", "false");
  }
  function toggleLang() {
    if (!langList || !langBtn) return;
    const open = langBtn.getAttribute("aria-expanded") === "true";
    open ? closeLang() : openLang();
  }

  function initLang() {
    if (!langBtn || !langList) return;

    snapshotI18nDefaults();

    let saved = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch (_) {}

    setLang(saved || (langCode ? langCode.textContent : "ES"));
    renderLangOptions();

    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLang();
    });

    $$("#langList li", document).forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = normalizeLang(li.getAttribute("data-lang") || "ES");
        if (code !== "ES" && code !== "EN") {
          closeLang();
          return;
        }
        setLang(code);
        closeLang();
      });
    });

    document.addEventListener("click", () => closeLang());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLang();
    });
  }

  /* -------------------------
     Mobile menu
  ------------------------- */
  function lockScroll(locked) {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    body.style.overflow = locked ? "hidden" : "";
  }

  function openMenu() {
    if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;

    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");

    mobileMenuOverlay.hidden = false;
    requestAnimationFrame(() => mobileMenuOverlay.classList.add("show"));

    menuToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);

    const first = $(".mobile-nav__link", mobileMenu);
    if (first) setTimeout(() => first.focus(), 50);
  }

  function closeMenu() {
    if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;

    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");

    mobileMenuOverlay.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    lockScroll(false);

    setTimeout(() => {
      mobileMenuOverlay.hidden = true;
    }, 220);

    menuToggle.focus();
  }

  function initMobileMenu() {
    if (!menuToggle || !mobileMenu || !mobileMenuOverlay) return;

    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    if (menuClose) menuClose.addEventListener("click", closeMenu);

    mobileMenuOverlay.addEventListener("click", closeMenu);

    // Close when clicking a link
    $$(".mobile-nav-link, .mobile-sub-link, .mobile-summary-link", mobileMenu).forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        if (expanded) closeMenu();
      }
    });

    // Safety: on resize to desktop, close
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        if (expanded) closeMenu();
      }
    });
  }

  /* -------------------------
     Hover UX (desktop pointer fine)
  ------------------------- */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function initHoverUX() {
    if (!finePointer) return;

    // LANG hover open/close
    if (langBtn && langList) {
      let langTimer = null;
      const clearLangTimer = () => {
        if (langTimer) {
          clearTimeout(langTimer);
          langTimer = null;
        }
      };

      const scheduleLangClose = () => {
        clearLangTimer();
        langTimer = window.setTimeout(() => {
          const overBtn = langBtn.matches(":hover");
          const overDrop = langList.matches(":hover");
          if (!overBtn && !overDrop) closeLang();
        }, 180);
      };

      langBtn.addEventListener("mouseenter", () => {
        clearLangTimer();
        openLang();
      });
      langList.addEventListener("mouseenter", () => {
        clearLangTimer();
      });
      langBtn.addEventListener("mouseleave", scheduleLangClose);
      langList.addEventListener("mouseleave", scheduleLangClose);
    }

    // MENU hover open/close
    if (menuToggle && mobileMenu && mobileMenuOverlay) {
      let menuTimer = null;
      const clearMenuTimer = () => {
        if (menuTimer) {
          clearTimeout(menuTimer);
          menuTimer = null;
        }
      };

      const scheduleMenuClose = () => {
        clearMenuTimer();
        menuTimer = window.setTimeout(() => {
          const overBtn = menuToggle.matches(":hover");
          const overPanel = mobileMenu.matches(":hover");
          if (!overBtn && !overPanel) closeMenu();
        }, 200);
      };

      menuToggle.addEventListener("mouseenter", () => {
        clearMenuTimer();
        openMenu();
      });
      menuToggle.addEventListener("mouseleave", scheduleMenuClose);
      mobileMenu.addEventListener("mouseenter", () => {
        clearMenuTimer();
      });
      mobileMenu.addEventListener("mouseleave", scheduleMenuClose);
    }

    // <details> hover open/close
    const groups = mobileMenu ? mobileMenu.querySelectorAll("details.menu-details") : [];
    if (groups && groups.length) {
      groups.forEach((details) => {
        let t;
        details.addEventListener("mouseenter", () => {
          clearTimeout(t);
          details.open = true;
        });
        details.addEventListener("mouseleave", () => {
          t = setTimeout(() => (details.open = false), 120);
        });
        details.addEventListener("focusin", () => {
          clearTimeout(t);
          details.open = true;
        });
        details.addEventListener("focusout", () => {
          t = setTimeout(() => (details.open = false), 150);
        });
      });
    }
  }

  /* -------------------------
     Active link (menu hamburguesa)
  ------------------------- */
  function initActiveLink() {
    const links = $$(".mobile-nav-link, .mobile-sub-link, .nav__link, .nav-link");
    const file = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const pageNoExt = file.replace(".html", "").replace(".htm", "");

    const alias = {
      index: "index",
      inicio: "index",
      acercade: "acerca",
      acerca: "acerca",
      servicios: "servicios",
      noticias: "noticias",
      prensa: "prensa",
      centro: "centro",
      contacto: "contacto",
    };

    const currentKey = alias[pageNoExt] || pageNoExt || "index";

    const keyFromLink = (a) => {
      const dp = (a.getAttribute("data-page") || "").trim().toLowerCase();
      if (dp) return alias[dp] || dp;

      const href = (a.getAttribute("href") || "").trim().toLowerCase();
      const last = href.split("/").pop().split("?")[0].split("#")[0];
      const noExt = last.replace(".html", "").replace(".htm", "");
      return alias[noExt] || noExt;
    };

    links.forEach((a) => {
      const key = keyFromLink(a);
      const isCurrent = key === currentKey;

      a.classList.toggle("active", isCurrent);
      if (isCurrent) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* -------------------------
     Reveal on scroll
  ------------------------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((el) => io.observe(el));
  }

  /* -------------------------
     Tilt effect (lightweight)
  ------------------------- */
  function initTilt() {
    if (prefersReducedMotion) return;

    const els = $$("[data-tilt]");
    if (!els.length) return;

    const max = 8;
    const scale = 1.01;

    const onMove = (e, el) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rx = (py - 0.5) * -2 * max;
      const ry = (px - 0.5) * 2 * max;

      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(
        2
      )}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
    };

    const onLeave = (el) => {
      el.style.transform = "";
    };

    els.forEach((el) => {
      el.style.willChange = "transform";
      el.addEventListener("mousemove", (e) => onMove(e, el));
      el.addEventListener("mouseleave", () => onLeave(el));
      el.addEventListener("blur", () => onLeave(el), true);
    });
  }

  /* -------------------------
     Course filters
  ------------------------- */
  function applyFilter(filter) {
    courses.forEach((card) => {
      const cat = (card.getAttribute("data-cat") || "").toLowerCase();
      const show = filter === "all" ? true : cat === filter;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function initFilters() {
    if (!chips.length || !courses.length) return;

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");

        const filter = (chip.getAttribute("data-filter") || "all").toLowerCase();
        applyFilter(filter);
      });
    });
  }

  /* -------------------------
     CV form: file name + validation
  ------------------------- */
  function setFormMsg(type, text) {
    if (!cvMsg) return;
    cvMsg.classList.remove("is-ok", "is-bad");
    if (type === "ok") cvMsg.classList.add("is-ok");
    if (type === "bad") cvMsg.classList.add("is-bad");
    cvMsg.textContent = text || "";
  }

  function initCVForm() {
    if (!cvForm) return;

    if (cvFile && cvFileName) {
      cvFile.addEventListener("change", () => {
        const f = cvFile.files && cvFile.files[0];
        cvFileName.textContent = f ? f.name : "No se eligió ningún archivo";
      });
    }

    cvForm.addEventListener("submit", (e) => {
      e.preventDefault();
      setFormMsg("", "");

      const name = $("input[name='name']", cvForm);
      const email = $("input[name='email']", cvForm);
      const area = $("select[name='area']", cvForm);

      const errors = [];

      if (!name || !name.value.trim()) errors.push("Escribe tu nombre completo.");
      if (!email || !email.value.trim()) errors.push("Escribe un correo válido.");
      else {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        if (!ok) errors.push("El correo no parece válido.");
      }
      if (!area || !area.value) errors.push("Selecciona un área de interés.");

      if (errors.length) {
        setFormMsg("bad", errors[0]);
        return;
      }

      setFormMsg("ok", "Listo. Tu postulación fue capturada (demo). Integraremos el envío real después.");
      cvForm.reset();
      if (cvFileName) cvFileName.textContent = "No se eligió ningún archivo";
    });
  }

  /* -------------------------
     FAQ accordion
  ------------------------- */
  function initFAQ() {
    if (!faq) return;
    const items = $$(".faq__item", faq);
    if (!items.length) return;

    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        items.forEach((b) => b.setAttribute("aria-expanded", "false"));
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  /* -------------------------
     Smooth anchor scroll with header offset
  ------------------------- */
  function getHeaderOffset() {
    if (!header) return 0;
    const rect = header.getBoundingClientRect();
    return Math.ceil(rect.height) + 10;
  }

  function smoothScrollTo(hash) {
    const target = $(hash);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function initAnchors() {
    $$("a[href^='#']").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(href);
      });
    });

    if (location.hash) {
      setTimeout(() => smoothScrollTo(location.hash), 40);
    }
  }

  /* -------------------------
     Init
  ------------------------- */
  function init() {
    initLang();
    initMobileMenu();
    initHoverUX();
    initActiveLink();
    initReveal();
    initTilt();
    initFilters();
    initCVForm();
    initFAQ();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();