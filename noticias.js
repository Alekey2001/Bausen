/* =========================
   Bausen - Noticias (JS parche)
   - Tema claro/oscuro persistente
   - Idiomas dropdown
   - Menú móvil
   - Reveal on scroll
   - Hover 3D + glow en categorías (tilt)
   - Buscador: estructura lista para lógica futura
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

  const openNewsletter = $("#openNewsletter");
  const newsletterModal = $("#newsletterModal");
  const newsletterForm = $("#newsletterForm");
  const newsletterStatus = $("#newsletterStatus");

  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");

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

  applyTheme(localStorage.getItem("bausen_theme") || "dark");

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
        if (langCode) langCode.textContent = code;

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
    if (savedLang && langCode) {
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

  // =========================
  // Newsletter modal
  // =========================
  function openModal() {
    if (!newsletterModal) return;
    newsletterModal.classList.add("is-open");
    newsletterModal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setTimeout(() => $("#nlName")?.focus(), 60);
  }

  function closeModal() {
    if (!newsletterModal) return;
    newsletterModal.classList.remove("is-open");
    newsletterModal.setAttribute("aria-hidden", "true");
    lockScroll(false);
  }

  if (openNewsletter) openNewsletter.addEventListener("click", openModal);

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.matches('[data-close="modal"]') || t.closest('[data-close="modal"]')) closeModal();
  });

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!newsletterStatus) return;

      newsletterStatus.textContent = "Procesando suscripción...";
      newsletterStatus.style.color = "";

      // TODO: Integrar backend real: POST /api/newsletter {name,email}
      await new Promise((r) => setTimeout(r, 650));

      newsletterStatus.textContent = "Listo. Suscripción registrada (demo).";
      newsletterStatus.style.color = "currentColor";

      setTimeout(() => {
        closeModal();
        newsletterForm.reset();
        newsletterStatus.textContent = "";
      }, 950);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      closeModal();
    }
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
  // Buscador (estructura lista para lógica futura)
  // =========================
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const q = (searchInput.value || "").trim();

      // Hook futuro:
      // - cuando exista backend: GET /api/news?q=...
      // - o filtrar un array local de noticias.
      // Por ahora solo deja la UX lista sin romper estructura.
      if (!q) {
        searchInput.focus();
        return;
      }

      // Demo: feedback no intrusivo
      searchInput.blur();
      // Si quieres, aquí puedes abrir un toast o hacer scroll a "Noticias Más Recientes".
      document.getElementById("recientes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // =========================
  // Hover 3D real (tilt) para las 3 cards de categoría
  // =========================
  function attachTilt(el) {
    const strength = 10; // sutil
    const lift = 6;      // elevación al hover

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      const rx = (0.5 - py) * strength;
      const ry = (px - 0.5) * strength;

      el.style.transform = `translateY(-${lift}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  }

  if (!prefersReduced && window.matchMedia("(min-width: 980px)").matches) {
    $$(".cat-card").forEach(attachTilt);
  }

  // =========================
  // Header measurement
  // =========================
  measureHeader();
  const ro = new ResizeObserver(() => measureHeader());
  if (header) ro.observe(header);
  window.addEventListener("resize", () => measureHeader());
})();
// Sync idioma: select del menú móvil -> header + localStorage
(() => {
  const mobileSelect = document.getElementById("mobileLangSelect");
  const langCode = document.getElementById("langCode");
  const langList = document.getElementById("langList");

  if (!mobileSelect) return;

  // Inicializa el select con el idioma guardado (si existe)
  try {
    const saved = localStorage.getItem("bausen_lang");
    if (saved) mobileSelect.value = saved;
  } catch {}

  const apply = (code) => {
    if (langCode) langCode.textContent = code;

    if (langList) {
      langList.querySelectorAll(".lang__item").forEach((li) => {
        li.setAttribute("aria-selected", li.dataset.lang === code ? "true" : "false");
      });
    }

    try { localStorage.setItem("bausen_lang", code); } catch {}
  };

  mobileSelect.addEventListener("change", () => apply(mobileSelect.value));
})();
