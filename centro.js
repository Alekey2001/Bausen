/* =========================
   centro.js — Bausen Centro
   - Theme toggle (desktop + mobile)
   - Mobile menu (open/close + overlay + ESC)
   - Language dropdown (ES/EN/PT)
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

  const html = document.documentElement;
  const body = document.body;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elements
  const header = $("#siteHeader");

  // Theme
  const themeToggle = $("#themeToggle");
  const themeToggleMobile = $("#themeToggleMobile");

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
  const courseGrid = $("#courseGrid");
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
     Theme
  ------------------------- */
  function getTheme() {
    return html.getAttribute("data-theme") || "dark";
  }
  function setTheme(next) {
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("bausen_theme", next); } catch (_) {}
    syncThemeIcon(next);
  }
  function syncThemeIcon(theme) {
    const icon = themeToggle ? $("i", themeToggle) : null;
    if (!icon) return;
    // Moon icon looks OK for dark; switch for light
    icon.classList.remove("fa-moon", "fa-sun");
    icon.classList.add(theme === "light" ? "fa-sun" : "fa-moon");
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("bausen_theme"); } catch (_) {}
    if (saved === "light" || saved === "dark") setTheme(saved);
    else syncThemeIcon(getTheme());

    const onToggle = () => setTheme(getTheme() === "dark" ? "light" : "dark");
    if (themeToggle) themeToggle.addEventListener("click", onToggle);
    if (themeToggleMobile) themeToggleMobile.addEventListener("click", onToggle);
  }

  /* -------------------------
     Language dropdown
  ------------------------- */
  const LANGS = {
    ES: { code: "ES", flag: "🇲🇽" },
    EN: { code: "EN", flag: "🇺🇸" },
    PT: { code: "PT", flag: "🇧🇷" },
  };

  function setLang(code) {
    const lang = LANGS[code] || LANGS.ES;
    if (langCode) langCode.textContent = lang.code;
    if (langFlag) langFlag.textContent = lang.flag;
    try { localStorage.setItem("bausen_lang", lang.code); } catch (_) {}
  }

  function openLang() {
    if (!langList || !langBtn) return;
    langList.style.display = "block";
    langBtn.setAttribute("aria-expanded", "true");
  }
  function closeLang() {
    if (!langList || !langBtn) return;
    langList.style.display = "none";
    langBtn.setAttribute("aria-expanded", "false");
  }
  function toggleLang() {
    if (!langList || !langBtn) return;
    const open = langBtn.getAttribute("aria-expanded") === "true";
    open ? closeLang() : openLang();
  }

  function initLang() {
    if (!langBtn || !langList) return;

    // Restore
    let saved = null;
    try { saved = localStorage.getItem("bausen_lang"); } catch (_) {}
    if (saved) setLang(saved);

    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLang();
    });

    // Pick
    $$("#langList li", document).forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = li.getAttribute("data-lang") || "ES";
        setLang(code);
        closeLang();
      });
    });

    // Close outside
    document.addEventListener("click", () => closeLang());

    // ESC close
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
    // allow CSS transition
    requestAnimationFrame(() => mobileMenuOverlay.classList.add("show"));

    menuToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);

    // focus first link
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

    // hide overlay after fade
    setTimeout(() => { mobileMenuOverlay.hidden = true; }, 220);

    // return focus
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
    $$(".mobile-nav__link", mobileMenu).forEach((a) => {
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

    const max = 8; // degrees
    const scale = 1.01;

    const onMove = (e, el) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1

      const rx = (py - 0.5) * -2 * max;
      const ry = (px - 0.5) *  2 * max;

      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
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
  function updateCounts() {
    // Optional: update the "Todos (N)" count dynamically if you change courses later
    const countAll = $("#countAll");
    if (!countAll) return;
    countAll.textContent = `(${courses.length})`;
  }

  function applyFilter(filter) {
    courses.forEach((card) => {
      const cat = (card.getAttribute("data-cat") || "").toLowerCase();
      const show = filter === "all" ? true : cat === filter;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function initFilters() {
    if (!chips.length || !courses.length) return;

    updateCounts();

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

      // Archivo opcional (según tu copy). Si quieres hacerlo obligatorio, descomenta:
      // if (!cvFile || !cvFile.files || !cvFile.files[0]) errors.push("Adjunta tu CV.");

      if (errors.length) {
        setFormMsg("bad", errors[0]);
        return;
      }

      // UX placeholder (sin backend)
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
        // Close others (accordion)
        items.forEach((b) => b.setAttribute("aria-expanded", "false"));
        // Toggle current
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
    // internal anchors only
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

    // If page loads with hash
    if (location.hash) {
      setTimeout(() => smoothScrollTo(location.hash), 40);
    }
  }

  /* -------------------------
     Init
  ------------------------- */
  function init() {
    initTheme();
    initLang();
    initMobileMenu();
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
