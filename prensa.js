

(() => {
  // Evita doble inicialización si por error cargas el script 2 veces
  if (window.__bausen_prensa_inited) return;
  window.__bausen_prensa_inited = true;

  const root = document.documentElement;
  const body = document.body;
  root.classList.remove("no-js");
  root.classList.add("js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ✅ Config: si quieres que el CTA del menú móvil sea SIEMPRE “¿Eres colaborador?”
  // ponlo en true. Si lo dejas false, respeta tu HTML (Contacto de Prensa).
  const FORCE_MOBILE_PRIMARY_CTA_TO_COLLAB = false;

  /* =========================
     Theme
  ========================= */
  function initTheme() {
    // ✅ Light-only: force the page to stay in light mode.
    // Remove any persisted theme values from older builds.
    try {
      localStorage.removeItem("bausen_theme");
      localStorage.removeItem("theme");
    } catch {}

    root.setAttribute("data-theme", "light");
    body.classList.remove("theme-dark");

    // If the toggle exists (other pages), hide it.
    const themeToggle = $("#theme-toggle") || $("#themeToggle");
    if (themeToggle) {
      themeToggle.style.display = "none";
      themeToggle.setAttribute("aria-pressed", "false");
    }
  }

  /* =========================
     Language (i18n) - copied from reference
  ========================= */
  const storage = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
      } catch {
        return fallback;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, String(val));
      } catch {}
    },
  };

  /* =========================
     i18n dictionaries (ES/EN full)
     NOTE: reference keys preserved; page-specific keys appended with presspage.*
  ========================= */
  const I18N = {
    ES: {
      // Header/Nav
      "nav.home": "Inicio",
      "nav.press": "Prensa",
      "nav.services": "Servicios",
      "nav.news": "Noticias",
      "nav.training": "Centro de Formación",
      "nav.about": "Acerca de",
      "header.collab": "¿Eres colaborador?",'nav.contact': 'Contacto',
      'nav.news.social': 'Social',
      'nav.news.press': 'Prensa',
      'nav.svc.payroll': 'Procesamiento de nómina',
      'nav.svc.specialized': 'Servicios especializados',
      'nav.svc.tax': 'Consultoría fiscal',

      // UI
      "ui.openMenu": "Abrir menú",
      "ui.closeMenu": "Cerrar menú",
      "ui.langSelect": "Seleccionar idioma",
      "ui.goHome": "Ir a inicio",
      "ui.toggleTheme": "Cambiar tema claro/oscuro",
      "ui.scrollNext": "Bajar a la siguiente sección",

      // Footer (shared)
      "footer.brandText":
        "Tu aliado estratégico en soluciones empresariales integrales.<br />Transformamos organizaciones desde adentro.",
      "footer.hoursLabel": "Horario de atención",
      "footer.hoursValue": "Lunes - Viernes: 9:00 - 18:00",
      "footer.follow": "Síguenos en redes",
      "footer.company": "EMPRESA",
      "footer.services": "SERVICIOS",
      "footer.about": "Acerca de",
      "footer.servicesLink": "Servicios",
      "footer.news": "Noticias",
      "footer.press": "Prensa",
      "footer.contact": "Contacto",
      "footer.svc.capital": "Capital Humano",
      "footer.svc.legal": "Servicios Legales",
      "footer.svc.accounting": "Servicios Contables",
      "footer.svc.orgdev": "Desarrollo Organizacional",
      "footer.contactTitle": "CONTACTO",
      "footer.phoneLabel": "Teléfono",
      "footer.emailLabel": "Email",
      "footer.maps": "Ver en Google Maps",
      "footer.privacy": "Política de privacidad",
      "footer.terms": "Términos de servicio",
      "footer.cookies": "Política de cookies",

      /* =========================
         Press page (this file) - appended
      ========================= */
      "presspage.pill": "Comunicados Oficiales",
      "presspage.heroTitle": "Sala de<br />Prensa",
      "presspage.heroSubtitle": "Información institucional, novedades y comunicados oficiales.",
      "presspage.ctaContact": "Contacto de Prensa",
      "presspage.ctaView": "Ver Comunicados",
      "presspage.kpi.comms": "Comunicados emitidos",
      "presspage.kpi.years": "Años de trayectoria",
      "presspage.kpi.media": "Cobertura mediática",
      "presspage.kpi.commit": "Compromiso",
      "presspage.panelChip": "Transparencia",
      "presspage.panelText":
        "Publicamos información verificada y oportuna para medios, aliados y comunidad.",
      "presspage.listTitle": "Nuestros <span class='grad'>Comunicados</span>",
      "presspage.listSubtitle": "Información oficial sobre nuestras actividades, logros y novedades.",
      "presspage.searchPh": "Buscar por título o contenido...",
      "presspage.yearFilterAria": "Filtrar por año",
      "presspage.yearAll": "Todos los años",
      "presspage.emptyTitle": "No hay comunicados disponibles",
      "presspage.emptyText": "Cuando publiquemos un nuevo contenido aparecerá aquí automáticamente.",
      "presspage.emptyPlaceholder": "Área reservada para futuros comunicados",
      "presspage.resultsMeta": "Mostrando {n} comunicados",
      "presspage.contactTitle": "¿Eres medio de <span class='grad'>comunicación</span>?",
      "presspage.contactText":
        "Contáctanos para solicitar información, entrevistas o material de prensa. Nuestro equipo de comunicación está disponible para atenderte.",
      "presspage.contactCtaNews": "Ver comunicados",
      "presspage.footerSoon": "Próximamente.",
      "presspage.footerNoteRest": "No se encontraron sucursales activas.",
      "presspage.footerRights": "© 2026 Bausen. Todos los derechos reservados",
      "presspage.mobileMenuTitle": "Menú",
      "presspage.cardCta": "Ver comunicado",
      "presspage.badgeFeatured": "Destacado",
      "presspage.badgeDefault": "Comunicado",
    },

    EN: {
      // Header/Nav
      "nav.home": "Home",
      "nav.press": "Press",
      "nav.services": "Services",
      "nav.news": "News",
      "nav.training": "Training Center",
      "nav.about": "About",
      "header.collab": "Are you a collaborator?",'nav.contact': 'Contact',
      'nav.news.social': 'Social',
      'nav.news.press': 'Press',
      'nav.svc.payroll': 'Payroll processing',
      'nav.svc.specialized': 'Specialized services',
      'nav.svc.tax': 'Tax consulting',

      // UI
      "ui.openMenu": "Open menu",
      "ui.closeMenu": "Close menu",
      "ui.langSelect": "Select language",
      "ui.goHome": "Go to home",
      "ui.toggleTheme": "Toggle light/dark theme",
      "ui.scrollNext": "Scroll to next section",

      // Footer (shared)
      "footer.brandText":
        "Your strategic ally in integrated business solutions.<br />We transform organizations from the inside out.",
      "footer.hoursLabel": "Business hours",
      "footer.hoursValue": "Mon - Fri: 9:00 - 18:00",
      "footer.follow": "Follow us on social",
      "footer.company": "COMPANY",
      "footer.services": "SERVICES",
      "footer.about": "About",
      "footer.servicesLink": "Services",
      "footer.news": "News",
      "footer.press": "Press",
      "footer.contact": "Contact",
      "footer.svc.capital": "Human Capital",
      "footer.svc.legal": "Legal Services",
      "footer.svc.accounting": "Accounting Services",
      "footer.svc.orgdev": "Organizational Development",
      "footer.contactTitle": "CONTACT",
      "footer.phoneLabel": "Phone",
      "footer.emailLabel": "Email",
      "footer.maps": "View on Google Maps",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.cookies": "Cookie Policy",

      /* =========================
         Press page (this file) - appended
      ========================= */
      "presspage.pill": "Official Releases",
      "presspage.heroTitle": "Press<br />Room",
      "presspage.heroSubtitle": "Institutional updates and official announcements.",
      "presspage.ctaContact": "Press Contact",
      "presspage.ctaView": "View Releases",
      "presspage.kpi.comms": "Releases published",
      "presspage.kpi.years": "Years of track record",
      "presspage.kpi.media": "Media coverage",
      "presspage.kpi.commit": "Commitment",
      "presspage.panelChip": "Transparency",
      "presspage.panelText":
        "We publish verified and timely information for media, partners and our community.",
      "presspage.listTitle": "Our <span class='grad'>Releases</span>",
      "presspage.listSubtitle": "Official information about our activities, achievements and updates.",
      "presspage.searchPh": "Search by title or content...",
      "presspage.yearFilterAria": "Filter by year",
      "presspage.yearAll": "All years",
      "presspage.emptyTitle": "No releases available",
      "presspage.emptyText": "When we publish new content, it will appear here automatically.",
      "presspage.emptyPlaceholder": "Reserved area for future releases",
      "presspage.resultsMeta": "Showing {n} releases",
      "presspage.contactTitle": "Are you a <span class='grad'>media outlet</span>?",
      "presspage.contactText":
        "Contact us to request information, interviews, or press materials. Our communications team is available to assist you.",
      "presspage.contactCtaNews": "View releases",
      "presspage.footerSoon": "Coming soon.",
      "presspage.footerNoteRest": "No active branches found.",
      "presspage.footerRights": "© 2026 Bausen. All rights reserved",
      "presspage.mobileMenuTitle": "Menu",
      "presspage.cardCta": "View release",
      "presspage.badgeFeatured": "Featured",
      "presspage.badgeDefault": "Release",
    },
  };

  /* =========================
     Flags (keep all)
  ========================= */
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

  /* =========================
     ONE language source of truth
  ========================= */
  const LANG_KEY = "bausen_lang";

  const normalizeLang = (lang) => {
    const v = String(lang || "").trim();
    const up = v.toUpperCase();

    // accept common variants
    if (up === "EN" || up === "ES" || up === "DE" || up === "PT" || up === "FR" || up === "IT") return up;
    if (v.toLowerCase().startsWith("en")) return "EN";
    if (v.toLowerCase().startsWith("es")) return "ES";
    if (v.toLowerCase().startsWith("pt")) return "PT";
    if (v.toLowerCase().startsWith("fr")) return "FR";
    if (v.toLowerCase().startsWith("it")) return "IT";
    if (v.toLowerCase().startsWith("de")) return "DE";
    return "EN"; // ✅ default site language
  };

  const getLang = () => {
    // compat: if you previously stored preferred-language
    const saved = storage.get(LANG_KEY, null) || storage.get("preferred-language", null);
    // Reference behavior: default to EN when there is no saved preference
    return normalizeLang(saved || "EN");
  };

  let CURRENT_LANG = getLang();

  const t = (lang, key) => {
    const L = normalizeLang(lang);
    const dict = I18N[L] || I18N.ES; // fallback ES for non-EN/ES
    return dict[key] ?? (I18N.ES[key] ?? key);
  };

  const format = (lang, key, vars = {}) => {
    let s = String(t(lang, key));
    Object.entries(vars).forEach(([k, v]) => {
      s = s.replaceAll(`{${k}}`, String(v));
    });
    return s;
  };

  /* =========================
     Translator (ONLY data-i18n*)
  ========================= */
  function applyTranslations(lang) {
    const L = normalizeLang(lang);
    CURRENT_LANG = L;

    // semantic html lang
    document.documentElement.setAttribute("lang", L === "EN" ? "en" : "es");

    // translate innerHTML
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.innerHTML = t(L, key);
    });

    // translate textContent
    $$("[data-i18n-text]").forEach((el) => {
      const key = el.getAttribute("data-i18n-text");
      if (!key) return;
      el.textContent = t(L, key);
    });

    // placeholders
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", t(L, key));
    });

    // ARIA / UI labels (stable)
    const menuToggleEl = $("#menu-toggle") || $("#menuToggle");
    if (menuToggleEl) menuToggleEl.setAttribute("aria-label", t(L, "ui.openMenu"));
    const closeMenuEl = $("#close-menu") || $("#menuClose");
    if (closeMenuEl) closeMenuEl.setAttribute("aria-label", t(L, "ui.closeMenu"));
    const themeToggleEl = $("#theme-toggle") || $("#themeToggle");
    if (themeToggleEl) themeToggleEl.setAttribute("aria-label", t(L, "ui.toggleTheme"));
    const langBtn = $("#language-btn");
    if (langBtn) langBtn.setAttribute("aria-label", t(L, "ui.langSelect"));
    const logoLink = $(".logo-link") || $(".brand");
    if (logoLink) logoLink.setAttribute("aria-label", t(L, "ui.goHome"));

    const yearSelect = $("#yearSelect");
    if (yearSelect) yearSelect.setAttribute("aria-label", t(L, "presspage.yearFilterAria"));

    // sync language code + flag
    const languageCode = $("#language-code");
    const mobileSelect = $("#mobile-language-select");
    if (languageCode) languageCode.textContent = L;
    if (mobileSelect) {
      mobileSelect.value = L;
      mobileSelect.setAttribute('aria-label', t(L, 'ui.langSelect'));
    }

    const flagEl = $("#language-flag");
    if (flagEl) flagEl.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;

    $$("[data-flag]").forEach((el) => {
      const code = normalizeLang(el.getAttribute("data-flag") || "ES");
      el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
    });
  }

  const setLang = (lang) => {
    const L = normalizeLang(lang);
    storage.set(LANG_KEY, L);
    // compat keep
    storage.set("preferred-language", L);
    applyTranslations(L);
    // hook for dynamic content
    onLanguageChange.forEach((fn) => {
      try { fn(L); } catch {}
    });
  };

  const onLanguageChange = [];

  /* =========================
     Language UI
  ========================= */
  function initLanguage() {
    const languageBtn = $("#language-btn");
    const languageDropdown = $("#language-dropdown");
    const languageOptions = $$(".language-option");
    const mobileLanguageSelect = $("#mobile-language-select");

    // init apply
    applyTranslations(CURRENT_LANG);

    // desktop dropdown
    if (languageBtn && languageDropdown) {
      const open = () => {
        languageBtn.setAttribute("aria-expanded", "true");
        languageDropdown.classList.add("show");
      };
      const close = () => {
        languageBtn.setAttribute("aria-expanded", "false");
        languageDropdown.classList.remove("show");
      };

      // expose for mobile-menu open if needed
      window.__bausenCloseLang = close;

      languageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = languageBtn.getAttribute("aria-expanded") === "true";
        expanded ? close() : open();
      });

      languageOptions.forEach((opt) => {
        opt.addEventListener("click", () => {
          const lang = opt.getAttribute("data-lang") || "EN";
          setLang(lang);
          close();
        });
      });

      document.addEventListener("click", (e) => {
        if (!languageDropdown.classList.contains("show")) return;
        if (languageBtn.contains(e.target) || languageDropdown.contains(e.target)) return;
        close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }

    // mobile select
    if (mobileLanguageSelect) {
      mobileLanguageSelect.addEventListener("change", (e) => setLang(e.target.value));
    }
  }

/* =========================
     Mobile menu
  ========================= */
  function initMobileMenu() {
    const toggleBtn =
      document.getElementById("menu-toggle") ||
      document.querySelector(".menu-toggle") ||
      document.querySelector(".nav__toggle");

    const panel =
      document.getElementById("mobile-menu") ||
      document.querySelector(".mobile-menu") ||
      document.querySelector(".nav__panel");

    const overlay =
      document.getElementById("mobile-menu-overlay") ||
      document.querySelector(".mobile-menu-overlay") ||
      document.querySelector(".nav__overlay");

    const closeBtn =
      document.getElementById("close-menu") ||
      document.querySelector(".close-menu") ||
      document.querySelector(".nav__close");

    if (!toggleBtn || !panel || !overlay) return;

    const rootEl = document.documentElement;

    const setLocked = (locked) => {
      rootEl.style.overflow = locked ? "hidden" : "";
      body.style.overflow = locked ? "hidden" : "";
      body.classList.toggle("menu-open", locked);
    };

    const openMenu = () => {
      panel.classList.add("open");
      overlay.classList.add("show");
      toggleBtn.setAttribute("aria-expanded", "true");
      setLocked(true);

      window.setTimeout(() => {
        const firstLink = panel.querySelector(".mobile-nav-link") || panel.querySelector("a[href]") || panel.querySelector("button");
        if (firstLink) firstLink.focus();
      }, 80);
    };

    const closeMenuFn = () => {
      panel.classList.remove("open");
      overlay.classList.remove("show");
      toggleBtn.setAttribute("aria-expanded", "false");
      setLocked(false);
      window.setTimeout(() => toggleBtn.focus(), 0);
    };

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      panel.classList.contains("open") ? closeMenuFn() : openMenu();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeMenuFn();
      });
    }

    overlay.addEventListener("click", closeMenuFn);

    panel.querySelectorAll("a, .mobile-nav-link").forEach((el) => {
      el.addEventListener("click", () => closeMenuFn());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) closeMenuFn();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && panel.classList.contains("open")) closeMenuFn();
    });
  }

  /* =========================
     Active link (data-page)
  ========================= */

  /* =========================
     Reveal on scroll (single observer)
  ========================= */
  let REVEAL_IO = null;

  function ensureRevealObserver() {
    if (REVEAL_IO) return REVEAL_IO;

    REVEAL_IO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("in-view");
          REVEAL_IO.unobserve(en.target);
        });
      },
      { threshold: 0.12 }
    );

    return REVEAL_IO;
  }

  function observeReveals(elements) {
    const io = ensureRevealObserver();
    const els = Array.isArray(elements) ? elements : [elements];

    els.forEach((el) => {
      if (!el || !(el instanceof Element)) return;
      if (el.dataset.revealObserved === "1") return;
      el.dataset.revealObserved = "1";
      io.observe(el);
    });
  }

  function initReveal() {
    const els = $$(".reveal");
    if (!els.length) return;
    observeReveals(els);
  }

  /* =========================
     Tilt 3D (no duplicates)
  ========================= */
  function initTiltFor(elements) {
    const els = Array.isArray(elements) ? elements : [elements];
    if (!els.length) return;

    // No tilt en touch
    if (matchMedia("(pointer: coarse)").matches) return;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    els.forEach((card) => {
      if (!card || !(card instanceof Element)) return;
      if (!card.hasAttribute("data-tilt")) return;
      if (card.dataset.tiltInit === "1") return;

      card.dataset.tiltInit = "1";

      let raf = null;

      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / (r.width / 2);
        const dy = (e.clientY - cy) / (r.height / 2);

        const rx = clamp(-dy * 5, -6, 6);
        const ry = clamp(dx * 6, -7, 7);

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
        });
      };

      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  }

  function initTilt() {
    initTiltFor($$("[data-tilt]"));
  }

  /* =========================
     Press: data + render (demo)
  ========================= */
  const PRESS_ITEMS = [
    {
      id: "pr-001",
      year: 2026,
      dateISO: "2026-02-06",
      dateLabel: { ES: "Febrero 2026", EN: "February 2026" },
      tags: [{ ES: "Institucional", EN: "Institutional" }],
      title: {
        ES: "BAUSEN anuncia expansión de su Training Center",
        EN: "BAUSEN announces expansion of its Training Center",
      },
      excerpt: {
        ES: "Nuevos programas y certificaciones en alianza con universidades y socios estratégicos.",
        EN: "New programs and certifications in partnership with universities and strategic partners.",
      },
      href: "#",
    },
    {
      id: "pr-002",
      year: 2026,
      dateISO: "2026-01-18",
      dateLabel: { ES: "Enero 2026", EN: "January 2026" },
      tags: [{ ES: "Caso de éxito", EN: "Success story" }],
      title: {
        ES: "Caso de éxito: reducción de rotación en 28%",
        EN: "Success story: 28% turnover reduction",
      },
      excerpt: {
        ES: "Implementación de un modelo de desarrollo organizacional con impacto medible en seis meses.",
        EN: "Implementation of an organizational development model with measurable impact in six months.",
      },
      href: "#",
    },
    {
      id: "pr-003",
      year: 2025,
      dateISO: "2025-11-02",
      dateLabel: { ES: "Noviembre 2025", EN: "November 2025" },
      tags: [{ ES: "Novedad", EN: "Update" }],
      title: {
        ES: "Nueva unidad de Servicios Contables y Fiscales",
        EN: "New Accounting and Tax Services unit",
      },
      excerpt: {
        ES: "Acompañamiento integral en cumplimiento, estrategia y optimización fiscal para PYMEs.",
        EN: "End-to-end support for compliance, strategy and tax optimization for SMEs.",
      },
      href: "#",
    },
  ];

  function initPress() {
    const grid = $("#pressGrid");
    const empty = $("#emptyState");
    const meta = $("#resultsMeta");
    const searchInput = $("#searchInput");
    const yearSelect = $("#yearSelect");
    if (!grid || !empty || !meta || !searchInput || !yearSelect) return;

    // Populate years (sin duplicar)
    const existing = new Set($$("option", yearSelect).map((o) => o.value));
    const years = Array.from(new Set(PRESS_ITEMS.map((x) => x.year))).sort((a, b) => b - a);

    years.forEach((y) => {
      const v = String(y);
      if (existing.has(v)) return;
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      yearSelect.appendChild(opt);
    });

    const normalize = (s) => (s || "").toLowerCase().trim();

    const pickI18nValue = (v) => {
    // Allows PRESS_ITEMS fields to be either string or { ES, EN }
    if (v && typeof v === "object") return v[CURRENT_LANG] || v.ES || v.EN || "";
    return v ?? "";
  };

  const pickTag = (tag) => pickI18nValue(tag);

  const render = (items) => {
      grid.innerHTML = "";

      if (!items.length) {
        empty.hidden = false;
        meta.textContent = format(CURRENT_LANG, 'presspage.resultsMeta', { n: 0 });
        return;
      }

      empty.hidden = true;
      meta.textContent = format(CURRENT_LANG, 'presspage.resultsMeta', { n: items.length });

      const newCards = [];

      items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "press-card reveal";
        card.setAttribute("data-tilt", "");

        const badgeLabel = item.featured ? t(CURRENT_LANG, 'presspage.badgeFeatured') : t(CURRENT_LANG, 'presspage.badgeDefault');

        card.innerHTML = `
          <div class="press-card__top">
            <span class="badge ${item.featured ? "badge--featured" : ""}">
              <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
              ${badgeLabel}
            </span>
            <span class="press-card__date">${pickI18nValue(item.dateLabel)}</span>
          </div>

          <div class="press-card__body">
            <h3 class="press-card__title">${pickI18nValue(item.title)}</h3>
            <p class="press-card__excerpt">${pickI18nValue(item.excerpt)}</p>
          </div>

          <div class="press-card__footer">
            ${(item.tags || [])
              .slice(0, 3)
              .map((t) => `<span class="tag">${t}</span>`)
              .join("")}

            <a class="btn btn--ghost btn--pill press-card__cta" href="#">
              ${t(CURRENT_LANG, 'presspage.cardCta')} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        `;

        grid.appendChild(card);
        newCards.push(card);
      });

      observeReveals(newCards);
      initTiltFor(newCards);
    };

    const applyFilters = () => {
      const q = normalize(searchInput.value);
      const y = yearSelect.value;

      let items = [...PRESS_ITEMS];

      // Orden: destacados primero, luego por año
      items.sort((a, b) => {
        const fa = a.featured ? 1 : 0;
        const fb = b.featured ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return (b.year || 0) - (a.year || 0);
      });

      if (y !== "all") items = items.filter((it) => String(it.year) === y);

      if (q) {
        items = items.filter((it) => {
          const hay =
            normalize(it.title) +
            " " +
            normalize(it.excerpt) +
            " " +
            normalize((it.tags || []).join(" "));
          return hay.includes(q);
        });
      }

      render(items);
    };

    // Re-render list when language changes (CTA labels / meta)
    onLanguageChange.push(() => {
      applyFilters();
    });

    // Listeners (no duplicates por guard global)
    searchInput.addEventListener("input", applyFilters);
    yearSelect.addEventListener("change", applyFilters);

    applyFilters();
  }

  
function initActiveLink() {
    // Soporta tanto desktop (.nav__link) como menú móvil (.mobile-nav-link)
    const links = $$(".nav__link, .mobile-nav-link");
    if (!links.length) return;

    const file = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const pageNoExt = file.split("?")[0].split("#")[0].replace(".html", "").replace(".htm", "");

    const alias = {
      indexbeca: "index",
      index: "index",
      inicio: "index",
      contacto: "contacto",
      acercade: "acercade",
      servicios: "servicios",
      noticias: "noticias",
      prensa: "prensa",
      centro: "centro",
      acerca: "acerca",
    };

    const currentKey = alias[pageNoExt] || pageNoExt || "index";

    const keyFromLink = (a) => {
      const dp = (a.getAttribute("data-page") || "").trim().toLowerCase();
      if (dp) return dp;

      const href = (a.getAttribute("href") || "").trim().toLowerCase();
      if (!href) return "";

      const last = href.split("/").pop().split("?")[0].split("#")[0];
      const noExt = last.replace(".html", "").replace(".htm", "");
      return alias[noExt] || noExt;
    };

    links.forEach((a) => {
      const key = keyFromLink(a);
      const isCurrent = key === currentKey;

      // Clases usadas por este diseño (prensa.css)
      a.classList.toggle("is-active", isCurrent);

      // Compat (si algún estilo externo usa .active)
      a.classList.toggle("active", isCurrent);

      // Accesibilidad
      if (isCurrent) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }



/* =========================
     Init
  ========================= */
  initTheme();
  initLanguage();
  initMobileMenu();
  initActiveLink();
  initReveal();
  initTilt();
  initPress();
})();
(function () {
  if (window.__PRNSA_MENU_REVEAL_PATCH_V2__) return;
  window.__PRNSA_MENU_REVEAL_PATCH_V2__ = true;

  var doc = document;
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }

  function getEls() {
    return {
      menuToggle: $('#menuToggle, #menu-toggle'),
      mobileMenu: $('#mobileMenu, #mobile-menu'),
      overlay: $('#mobile-menu-overlay, .overlay'),
      closeBtn: $('#close-menu')
    };
  }

  function isFineDesktop() {
    var mqHover = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false;
    return mqHover && window.innerWidth >= 981;
  }

  function setMenuState(open) {
    var els = getEls();
    var menuToggle = els.menuToggle, mobileMenu = els.mobileMenu, overlay = els.overlay;
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.toggle('open', !!open);
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (overlay) {
      overlay.classList.toggle('show', !!open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

    // Bloquear scroll solo si realmente está abierto
    doc.body.style.overflow = open ? 'hidden' : '';
  }

  function initDesktopDrawerHover() {
    if (!isFineDesktop()) return;

    var els = getEls();
    var menuToggle = els.menuToggle, mobileMenu = els.mobileMenu, overlay = els.overlay;
    if (!menuToggle || !mobileMenu) return;
    if (menuToggle.dataset.pcHoverBound === '1') return;
    menuToggle.dataset.pcHoverBound = '1';

    var t = 0;
    function clearT() { if (t) { clearTimeout(t); t = 0; } }
    function openNow() { clearT(); setMenuState(true); }
    function closeLater() {
      clearT();
      t = setTimeout(function () {
        var overBtn = false, overPanel = false, overOverlay = false;
        try { overBtn = menuToggle.matches(':hover'); } catch(_){}
        try { overPanel = mobileMenu.matches(':hover'); } catch(_){}
        if (overlay) { try { overOverlay = overlay.matches(':hover'); } catch(_){} }
        if (!overBtn && !overPanel && !overOverlay) setMenuState(false);
      }, 140);
    }

    menuToggle.addEventListener('mouseenter', openNow);
    menuToggle.addEventListener('mouseleave', closeLater);

    mobileMenu.addEventListener('mouseenter', function(){ clearT(); });
    mobileMenu.addEventListener('mouseleave', closeLater);

    if (overlay) {
      overlay.addEventListener('mouseenter', closeLater);
      overlay.addEventListener('mouseleave', closeLater);
    }

    // Si el usuario cambia a móvil, no forzar comportamiento hover.
    window.addEventListener('resize', function () {
      if (window.innerWidth < 981) {
        clearT();
      }
    });
  }

  function initMobileServicesAccordion() {
    var mobileMenu = $('#mobileMenu, #mobile-menu');
    if (!mobileMenu) return;

    var detailsList = $all('details.menu-details', mobileMenu);
    if (!detailsList.length) return;

    detailsList.forEach(function (details) {
      var summary = $('summary.mobile-nav-summary', details);
      var summaryLink = $('.mobile-summary-link', details);
      if (!summary) return;
      if (summary.dataset.patchBound === '1') return;
      summary.dataset.patchBound = '1';

      summary.addEventListener('click', function (e) {
        var clickedInsideAnchor = summaryLink && (e.target === summaryLink || summaryLink.contains(e.target));
        if (clickedInsideAnchor) {
          return; // navegación normal al link principal
        }
        e.preventDefault();
        details.open = !details.open;
        e.stopPropagation();
      });

      // Hover desktop (submenus)
      if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var closeTimer;
        details.addEventListener('mouseenter', function () {
          clearTimeout(closeTimer);
          details.open = true;
        });
        details.addEventListener('mouseleave', function () {
          closeTimer = setTimeout(function () { details.open = false; }, 120);
        });
        details.addEventListener('focusin', function () {
          clearTimeout(closeTimer);
          details.open = true;
        });
        details.addEventListener('focusout', function () {
          closeTimer = setTimeout(function () { details.open = false; }, 150);
        });
      }
    });

    // Detecta link actual en subrutas de servicios
    var currentPath = (location.pathname || '').replace(/\/+$/, '');
    detailsList.forEach(function (details) {
      var subLinks = $all('.mobile-sub-link', details);
      var summary = $('summary.mobile-nav-summary', details);
      var hasCurrent = subLinks.some(function (a) {
        try {
          var href = new URL(a.getAttribute('href'), location.origin).pathname.replace(/\/+$/, '');
          var match = !!href && (href === currentPath);
          if (match) {
            a.classList.add('is-active');
            a.setAttribute('aria-current', 'page');
          }
          return match;
        } catch (_) { return false; }
      });
      if (hasCurrent) {
        details.open = true;
        if (summary) summary.classList.add('active');
      }
    });
  }

  function initRevealScroll() {
    var revealEls = $all('.reveal');
    if (!revealEls.length) return;

    function show(el) {
      el.classList.add('in-view');
      el.classList.add('is-in');
      el.classList.add('is-visible');
    }

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(show);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    revealEls.forEach(function (el) {
      if (el.classList.contains('in-view') || el.classList.contains('is-in') || el.classList.contains('is-visible')) return;
      io.observe(el);
    });
  }

  function init() {
    initDesktopDrawerHover();
    initMobileServicesAccordion();
    initRevealScroll();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
