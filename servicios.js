/* =========================
   Bausen - Servicios (JS final)
   - Menú móvil
   - Tema claro/oscuro con persistencia
   - Dropdown idioma
   - KPIs count-up
   - Reveal on scroll
   - Ajuste de padding-top por header fijo
========================= */

(function () {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  const header = $("#siteHeader");

  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const mobileMenu = $("#mobileMenu");
  const mobileOverlay = $("#mobileOverlay");

  const themeToggle = $("#themeToggle");
  const mobileTheme = $("#mobileTheme");

  const langBtn = $("#langBtn");
  const langList = $("#langList");
  const langCode = $("#langCode");

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function setCSSVar(name, px) {
    root.style.setProperty(name, `${px}px`);
  }

  function measureHeader() {
    if (!header) return;
    const hh = Math.round(header.getBoundingClientRect().height) || 66;
    setCSSVar("--header-h", hh);
  }

  // =========================
  // Theme
  // =========================
  function setThemeIcon(theme) {
    const icon = themeToggle ? themeToggle.querySelector("i") : null;
    if (!icon) return;
    icon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }

  function applyTheme(theme) {
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", theme);
    localStorage.setItem("bausen_theme", theme);
    setThemeIcon(theme);

    window.setTimeout(() => root.classList.remove("theme-transition"), 380);
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  const savedTheme = localStorage.getItem("bausen_theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (mobileTheme) mobileTheme.addEventListener("click", toggleTheme);

  // =========================
  // Language dropdown
  // =========================
  function closeLang() {
    if (!langList || !langBtn) return;
    langList.classList.remove("is-open");
    langBtn.setAttribute("aria-expanded", "false");
  }

  function toggleLang() {
    if (!langList || !langBtn) return;
    const open = langList.classList.toggle("is-open");
    langBtn.setAttribute("aria-expanded", String(open));
  }

  if (langBtn && langList) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLang();
    });

    $$(".lang__item", langList).forEach((item) => {
      item.addEventListener("click", () => {
        const code = item.dataset.lang || "ES";
        langCode.textContent = code;

        $$(".lang__item", langList).forEach((i) => i.setAttribute("aria-selected", "false"));
        item.setAttribute("aria-selected", "true");

        closeLang();
        localStorage.setItem("bausen_lang", code);
      });
    });

    document.addEventListener("click", closeLang);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLang();
    });

    const savedLang = localStorage.getItem("bausen_lang");
    if (savedLang) {
      langCode.textContent = savedLang;
      $$(".lang__item", langList).forEach((i) => {
        i.setAttribute("aria-selected", String(i.dataset.lang === savedLang));
      });
    }
  }

  // =========================
  // Mobile menu
  // =========================
  const lockScroll = (locked) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
  };

  function openMenu() {
    if (!mobileMenu || !mobileOverlay || !menuToggle) return;
    mobileMenu.hidden = false;
    mobileOverlay.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);

    setTimeout(() => {
      const first = $(".mobile-nav__link", mobileMenu);
      if (first) first.focus();
    }, 30);
  }

  function closeMenu() {
    if (!mobileMenu || !mobileOverlay || !menuToggle) return;
    mobileMenu.hidden = true;
    mobileOverlay.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    lockScroll(false);
    menuToggle.focus();
  }

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // =========================
  // Reveal on scroll
  // =========================
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    const revealEls = $$(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  // =========================
  // KPI count-up
  // =========================
  function animateCount(el, to, duration = 900) {
    const start = performance.now();
    const from = 0;

    function frame(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = String(val);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const kpiNums = $$(".kpi__num[data-count]");
  if (kpiNums.length) {
    const ioKpi = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const to = parseInt(el.getAttribute("data-count"), 10) || 0;
          animateCount(el, to, 850);
          ioKpi.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );

    kpiNums.forEach((el) => ioKpi.observe(el));
  }

  // =========================
  // Header height -> CSS var
  // =========================
  measureHeader();

  const ro = new ResizeObserver(() => measureHeader());
  if (header) ro.observe(header);

  window.addEventListener("resize", () => measureHeader());
})();
// Sync idioma (mobile select -> header code)
(() => {
  const mobileSelect = document.getElementById("mobileLangSelect");
  const langCode = document.getElementById("langCode");
  const langList = document.getElementById("langList");

  if (!mobileSelect) return;

  const apply = (code) => {
    if (langCode) langCode.textContent = code;
    if (langList) {
      langList.querySelectorAll(".lang__item").forEach((li) => {
        li.setAttribute("aria-selected", li.dataset.lang === code ? "true" : "false");
      });
    }
  };

  mobileSelect.addEventListener("change", () => apply(mobileSelect.value));
})();
