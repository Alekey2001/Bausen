/* acerca.js
   Funciones:
   - Toggle tema (dark/light) con persistencia
   - Menú móvil (overlay + ESC + focus)
   - Selector de idioma (dropdown accesible)
   - FAQ: acordeón + buscador
   - Reveal on scroll
   - Tilt 3D (data-tilt) sin librerías
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const html = document.documentElement;
  const body = document.body;

  /* =========================
     Theme
  ========================= */
  const THEME_KEY = "bausen_theme";
  const themeToggle = $("#themeToggle");
  const themeToggleMobile = $("#themeToggleMobile");

  const applyTheme = (theme) => {
    const next = theme === "light" ? "light" : "dark";
    html.setAttribute("data-theme", next);

    // Icon swap (optional): moon for dark, sun for light
    const iconClass = next === "light" ? "fa-sun" : "fa-moon";
    const iconAltClass = next === "light" ? "fa-moon" : "fa-sun";

    const swapIcon = (btn) => {
      if (!btn) return;
      const i = btn.querySelector("i");
      if (!i) return;
      i.classList.remove(iconAltClass);
      i.classList.add(iconClass);
    };
    swapIcon(themeToggle);
    swapIcon(themeToggleMobile);
  };

  const initTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
      return;
    }
    // Default: respect HTML attribute; if missing, use prefers-color-scheme
    const attr = html.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") {
      applyTheme(attr);
      return;
    }
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  };

  const toggleTheme = () => {
    const current = html.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  themeToggle?.addEventListener("click", toggleTheme);
  themeToggleMobile?.addEventListener("click", toggleTheme);

  /* =========================
     Mobile menu
  ========================= */
  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const mobileMenu = $("#mobileMenu");
  const mobileMenuOverlay = $("#mobileMenuOverlay");

  const lockScroll = (locked) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    body.style.overflow = locked ? "hidden" : "";
  };

  const openMenu = () => {
    if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;
    mobileMenuOverlay.hidden = false;
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);

    // focus first link
    setTimeout(() => {
      const first = $(".mobile-nav__link", mobileMenu);
      first?.focus();
    }, 50);
  };

  const closeMenu = () => {
    if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    lockScroll(false);

    // Wait for transition before hiding overlay (keeps animation smooth)
    setTimeout(() => {
      mobileMenuOverlay.hidden = true;
    }, 220);

    menuToggle.focus();
  };

  menuToggle?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  mobileMenuOverlay?.addEventListener("click", closeMenu);

  /* =========================
     Language dropdown
  ========================= */
  const langBtn = $("#langBtn");
  const langList = $("#langList");
  const langCode = $("#langCode");
  const langFlag = $(".lang__flag", langBtn || document);

  const LANG_MAP = {
    ES: "🇲🇽",
    EN: "🇺🇸",
    PT: "🇧🇷",
  };

  const closeLang = () => {
    if (!langBtn || !langList) return;
    langBtn.setAttribute("aria-expanded", "false");
    langList.classList.remove("is-open");
  };

  const openLang = () => {
    if (!langBtn || !langList) return;
    langBtn.setAttribute("aria-expanded", "true");
    langList.classList.add("is-open");
  };

  const toggleLang = () => {
    if (!langBtn || !langList) return;
    const expanded = langBtn.getAttribute("aria-expanded") === "true";
    expanded ? closeLang() : openLang();
  };

  langBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleLang();
  });

  // click on options
  if (langList) {
    $$("li[role='option']", langList).forEach((opt) => {
      opt.addEventListener("click", () => {
        const code = opt.getAttribute("data-lang") || "ES";
        if (langCode) langCode.textContent = code;
        if (langFlag) langFlag.textContent = LANG_MAP[code] || "🌐";
        closeLang();
      });
    });
  }

  // outside click
  document.addEventListener("click", (e) => {
    if (!langBtn || !langList) return;
    const target = e.target;
    const inside = langBtn.contains(target) || langList.contains(target);
    if (!inside) closeLang();
  });

  /* =========================
     FAQ (accordion + search)
  ========================= */
  const faqSearch = $("#faqSearch");
  const faqList = $("#faqList");
  const faqEmpty = $("#faqEmpty");

  const faqItems = faqList ? $$(".faq__item", faqList) : [];

  const setFaqExpanded = (btn, expanded) => {
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  faqItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      // close others (premium behavior)
      faqItems.forEach((b) => b !== btn && setFaqExpanded(b, false));
      setFaqExpanded(btn, !isOpen);
    });
  });

  const normalize = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const filterFaq = () => {
    if (!faqSearch || !faqList) return;
    const q = normalize(faqSearch.value.trim());
    let visibleCount = 0;

    faqItems.forEach((btn) => {
      const qText = normalize($(".faq__q", btn)?.textContent || "");
      const aText = normalize($(".faq__a", btn)?.textContent || "");
      const match = !q || qText.includes(q) || aText.includes(q);

      btn.hidden = !match;
      if (match) visibleCount += 1;

      // collapse hidden items to avoid layout weirdness
      if (!match) setFaqExpanded(btn, false);
    });

    if (faqEmpty) faqEmpty.hidden = visibleCount !== 0;
  };

  faqSearch?.addEventListener("input", filterFaq);

  /* =========================
     Reveal on scroll
  ========================= */
  const initReveal = () => {
    const items = $$(".reveal");
    if (!items.length) return;

    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduce) {
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
      { threshold: 0.12 }
    );

    items.forEach((el) => io.observe(el));
  };

  /* =========================
     Tilt 3D (data-tilt)
  ========================= */
  const initTilt = () => {
    const cards = $$("[data-tilt]");
    if (!cards.length) return;

    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const onMove = (el, ev) => {
      const rect = el.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width;  // 0..1
      const py = (ev.clientY - rect.top) / rect.height;  // 0..1
      const ry = (px - 0.5) * 10; // deg
      const rx = (0.5 - py) * 10; // deg
      el.style.setProperty("--tilt-rx", `${clamp(rx, -10, 10)}deg`);
      el.style.setProperty("--tilt-ry", `${clamp(ry, -10, 10)}deg`);
      el.style.setProperty("--tilt-z", `0px`);
      el.classList.add("is-tilting");
    };

    const onLeave = (el) => {
      el.style.setProperty("--tilt-rx", `0deg`);
      el.style.setProperty("--tilt-ry", `0deg`);
      el.style.setProperty("--tilt-z", `0px`);
      el.classList.remove("is-tilting");
    };

    cards.forEach((el) => {
      el.addEventListener("mousemove", (ev) => onMove(el, ev));
      el.addEventListener("mouseleave", () => onLeave(el));
      el.addEventListener("blur", () => onLeave(el));
    });
  };

  /* =========================
     CTA mini (fake send -> feedback)
  ========================= */
  const ctaBtn = $("#ctaSend");
  const ctaQuestion = $("#ctaQuestion");
  const ctaEmail = $("#ctaEmail");
  const ctaMsg = $("#ctaMsg");

  const showCtaMsg = (text, ok = true) => {
    if (!ctaMsg) return;
    ctaMsg.textContent = text;
    ctaMsg.style.color = ok ? "" : "var(--danger)";
    // auto clear
    clearTimeout(showCtaMsg._t);
    showCtaMsg._t = setTimeout(() => {
      if (ctaMsg) ctaMsg.textContent = "";
    }, 3800);
  };

  ctaBtn?.addEventListener("click", () => {
    const q = (ctaQuestion?.value || "").trim();
    const e = (ctaEmail?.value || "").trim();

    if (!q || q.length < 5) {
      showCtaMsg("Escribe tu pregunta (mínimo 5 caracteres).", false);
      ctaQuestion?.focus();
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    if (!emailOk) {
      showCtaMsg("Ingresa un correo válido para poder responderte.", false);
      ctaEmail?.focus();
      return;
    }

    // Aquí podrías integrar tu backend / EmailJS / API.
    showCtaMsg("Listo. Recibimos tu mensaje y te responderemos pronto.", true);

    if (ctaQuestion) ctaQuestion.value = "";
    if (ctaEmail) ctaEmail.value = "";
  });

  /* =========================
     Global key handling
  ========================= */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLang();
      if (mobileMenu && mobileMenu.classList.contains("open")) closeMenu();
    }
  });

  /* =========================
     Init
  ========================= */
  initTheme();
  initReveal();
  initTilt();

  // initial FAQ filter (keeps empty state consistent)
  filterFaq();
})();
