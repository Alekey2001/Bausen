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


  const header = $("#siteHeader");

  const menuToggle = $("#menu-toggle");
  const menuClose = $("#close-menu");
  const mobileMenu = $("#mobile-menu");
  const mobileOverlay = $("#mobile-menu-overlay");
  const themeToggle = null;
  const mobileTheme = null;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* =========================
     Desktop hover behavior (reference fix)
     - Open on hover over burger
     - Do NOT close when moving mouse from burger -> panel
     - Close only after leaving both burger + panel (delay)
     - Uses relatedTarget safe-zone checks
  ========================= */

  const isDesktopHover = () => hasFinePointer;

  let hoverCloseTimer = null;

  const clearHoverTimer = () => {
    if (hoverCloseTimer) {
      window.clearTimeout(hoverCloseTimer);
      hoverCloseTimer = null;
    }
  };

  // If the mouse leaves the toggle heading into the panel/overlay, don't close
  const leavingToMenuZone = (e) => {
    const to = e.relatedTarget;
    if (!to) return false;
    return (mobileMenu && mobileMenu.contains(to)) || (mobileOverlay && mobileOverlay.contains(to));
  };

  // If the mouse leaves the panel heading into the toggle/overlay, don't close
  const leavingToToggleZone = (e) => {
    const to = e.relatedTarget;
    if (!to) return false;
    return (menuToggle && menuToggle.contains(to)) || (mobileOverlay && mobileOverlay.contains(to));
  };

  const scheduleHoverClose = () => {
    if (!isDesktopHover()) return;
    clearHoverTimer();

    // extra time so cursor can reach the panel without flicker
    hoverCloseTimer = window.setTimeout(() => {
      const overToggle = !!(menuToggle && menuToggle.matches(":hover"));
      const overPanel = !!(mobileMenu && mobileMenu.matches(":hover"));
      if (!overToggle && !overPanel) closeMenu();
    }, 320);
  };

  if (isDesktopHover() && menuToggle && mobileMenu && mobileOverlay) {
    // Open when hovering the burger
    menuToggle.addEventListener("mouseenter", () => {
      clearHoverTimer();
      openMenu();
    });

    // When leaving burger, only close if NOT going into panel/overlay
    menuToggle.addEventListener("mouseleave", (e) => {
      if (leavingToMenuZone(e)) return;
      scheduleHoverClose();
    });

    // Keep open when entering panel/overlay
    mobileMenu.addEventListener("mouseenter", () => clearHoverTimer());
    mobileOverlay.addEventListener("mouseenter", () => clearHoverTimer());

    // When leaving panel, only close if NOT going into burger/overlay
    mobileMenu.addEventListener("mouseleave", (e) => {
      if (leavingToToggleZone(e)) return;
      scheduleHoverClose();
    });

    // Overlay mouseleave should not force close; use scheduler
    }

  /* =========================
     Submenus: open on hover (desktop) with small delays
  ========================= */
  function initHamburgerSubmenuHover() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;
    if (!mobileMenu) return;

    const groups = mobileMenu.querySelectorAll("details");
    if (!groups.length) return;

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
  document.addEventListener("DOMContentLoaded", initHamburgerSubmenuHover);

  // Dropdown idioma hover (kept as in current file)
  const langWrap = document.querySelector(".language-selector");
  if (hasFinePointer && langWrap) {
    let tIn = null, tOut = null;
    const openLang = () => {
      const btn = document.getElementById("language-btn");
      const dd = document.getElementById("language-dropdown");
      if (btn && dd) {
        btn.setAttribute("aria-expanded", "true");
        dd.classList.add("show");
      }
    };
    const closeLang = () => {
      const btn = document.getElementById("language-btn");
      const dd = document.getElementById("language-dropdown");
      if (btn && dd) {
        btn.setAttribute("aria-expanded", "false");
        dd.classList.remove("show");
      }
    };
    const clear = () => { if (tIn) clearTimeout(tIn); if (tOut) clearTimeout(tOut); tIn = tOut = null; };
    langWrap.addEventListener("mouseenter", () => { clear(); tIn = setTimeout(openLang, 140); });
    langWrap.addEventListener("mouseleave", () => { clear(); tOut = setTimeout(closeLang, 220); });
  }



  const I18N = {
    ES: {
      // Header/Nav
      "nav.home": "Inicio",
      "nav.press": "Prensa",
      "nav.services": "Servicios",
      "nav.svc.tax": "Consultoría fiscal",
      "nav.svc.specialized": "Servicios especializados",
      "nav.svc.payroll": "Procesamiento de nómina",
      "nav.news": "Noticias",
      "nav.training": "Centro de Formación",
      "nav.about": "Acerca de",
      "header.collab": "¿Eres colaborador?",

      // Hero
      "hero.pill": "Soluciones empresariales integrales",
      "hero.title": "Servicios<br /><span class='hero-accent'></span>",
      "hero.subtitle":
        " Soluciones integrales diseñadas para optimizar cada aspecto de tu organización",
      "hero.ctaServices": "Ver Servicios",
      "hero.ctaContact": "Contactar",
      "kpi.years": "Años de experiencia",
      "kpi.clients": "Clientes",
      "kpi.sat": "Satisfacción",
      "toast.title": "Certificados",

      // Services
      "services.kicker": "Lo que hacemos",
      "services.title": "Nuestros Servicios",
      "services.subtitle": "Soluciones integrales diseñadas para optimizar cada aspecto de tu organización",
      "services.card1.title": "Capital humano",
      "services.card1.text": "Aumenta la eficiencia y resultados de tu negocio.",
      "services.card2.title": "Servicios especializados",
      "services.card2.text": "Aumenta la eficiencia y resultados de tu negocio.",
      "services.card3.title": "Servicios de Impuestos",
      "services.card3.text": "Optimiza tu carga fiscal con expertos certificados.",
      "services.more": "Conocer más",

      // Líneas de servicio (página Servicios)
      "lines.title": "Nuestras Líneas de Servicio",
      "lines.subtitle": "Soluciones especializadas diseñadas para la necesidad de tu negocio.",
      "lines.includedTag": "Servicios incluidos",

      "lines.card1.desc": "Potenciamos el crecimiento y éxito a través de soluciones integrales de gestión del talento.",
      "lines.card1.item1": "Servicios Especializados",
      "lines.card1.item2": "Payrolling",
      "lines.card1.item3": "Atracción de Talento",

      "lines.card2.title": "Desarrollo Organizacional",
      "lines.card2.desc": "Estrategias y metodologías para transformar tu empresa desde dentro.",
      "lines.card2.item1": "Capacitación Empresarial",
      "lines.card2.item2": "Consultoría Organizacional",
      "lines.card2.item3": "NOM-035",

      "lines.card3.title": "Management Services",
      "lines.card3.desc": "Servicios administrativos y operativos para una gestión integral.",
      "lines.card3.item1": "Servicios Contables",
      "lines.card3.item2": "Servicios Legales",
      "lines.card3.item3": "Servicios PyME",

      // CTA
      "cta.contact": "Contáctanos",
      "cta.learnMore": "Conocer más",

      // Press
      "press.kicker": "Sala de prensa",
      "press.title": "Comunicados de <span class='accent'>Prensa</span>",
      "press.subtitle": "Mantente informado sobre las últimas noticias y anuncios de BAUSEN",
      "press.cta": "Ver todos los comunicados",

      // Training
      "training.kicker": "Formación de talento",
      "training.title": "BAUSEN Training Center",
      "training.subtitle": "Formamos y conectamos el talento del futuro con las mejores<br />oportunidades",
      "training.tab.events": "Eventos",
      "training.tab.webinars": "Webinars Institucionales",
      "training.tab.interns": "Sistema de Becarios",
      "training.leftTitle.events": "Eventos",
      "training.leftTitle.webinars": "Webinars Institucionales",
      "training.leftTitle.interns": "Sistema de Becarios",
      "training.panel.events.title": "Eventos",
      "training.panel.events.text": "Participación activa en eventos con escuelas y universidades",
      "training.panel.webinars.title": "Webinars Institucionales",
      "training.panel.webinars.text": "Capacitaciones y webinars especializados con instituciones educativas",
      "training.panel.interns.title": "Sistema de Becarios",
      "training.panel.interns.text": "Programa integral de formación y desarrollo de talento joven",
      "training.more": "Más información",

      // News
      "news.kicker": "Blog y noticias",
      "news.title": "Últimas <span class='accent'>Noticias</span>",
      "news.subtitle": "Descubre artículos, casos de éxito y tendencias del sector",
      "news.cta": "Ver todas las noticias",

      // Connect
      "connect.kicker": "Conecta con nosotros",
      "connect.title": "Juntos trazamos<br /><span class='connect-accent'>tu camino al éxito</span>",
      "connect.text":
        "¿Listo para llevar tu negocio al siguiente nivel? Agenda una<br />reunión con nuestros especialistas y descubre cómo podemos<br />ayudarte.",
      "connect.cta": "¡Agenda ahora!",
      "connect.follow": "¡Síguenos en redes!",

      // Awards
      "awards.kicker": "Excelencia reconocida",
      "awards.title": "Nuestros <span class='accent'>Reconocimientos</span>",
      "awards.subtitle": "Certificaciones y alianzas que respaldan nuestro compromiso con la excelencia",
      "awards.card1.k": "Reconocimiento 01",
      "awards.card1.t": "Consejo de Recursos Humanos",
      "awards.card2.k": "Reconocimiento 02",
      "awards.card2.t": "Distintivo de Empresas Humanitarias",
      "awards.card3.k": "Reconocimiento 03",
      "awards.card3.t": "Certificación de Trabajo Digno",
      "awards.card4.k": "Reconocimiento 04",
      "awards.card4.t": "Registro de Especialistas Profesionales",
      "awards.card5.k": "Reconocimiento 05",
      "awards.card5.t": "Concilio de Recursos Humanos",
      "awards.card6.k": "Reconocimiento 06",
      "awards.card6.t": "Certificación ISO",
      "awards.card7.k": "Reconocimiento 07",
      "awards.card7.t": "Cumplimiento NOM",
      "awards.card8.k": "Reconocimiento 08",
      "awards.card8.t": "Registro REPSE",

      // Contact
      "contact.kicker": "¿Listo para conectar?",
      "contact.title": "Hablemos sobre <span class='contact-accent'>tu proyecto</span>",
      "contact.subtitle":
        "Cuéntanos tus ideas, necesidades o dudas y nuestro equipo te contactará a la<br />brevedad. ¡Estamos aquí para ayudarte a transformar tu operación!",
      "contact.formTitle": "Envíanos un mensaje",
      "contact.formSubtitle": "Completa el formulario y te contactaremos pronto.",
      "contact.infoTitle": "Información de Contacto",
      "contact.phone": "Teléfono",
      "contact.email": "Email",
      "contact.location": "Ubicación",
      "contact.locationValue": "Querétaro, México",
      "contact.hours": "Horario",
      "contact.hoursValue": "Lun - Vie: 9:00 - 18:00",
      "contact.follow": "Síguenos en redes",

      // Map
      "map.kicker": "NUESTRAS UBICACIONES",
      "map.noBranches": "No se encontraron sucursales activas",
      "map.retry": "Reintentar",
      "map.searching": "Buscando…",

      // Footer
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
      "footer.note": "Próximamente. No se encontraron sucursales activas.",
      "footer.phoneLabel": "Teléfono",
      "footer.emailLabel": "Email",
      "footer.maps": "Ver en Google Maps",
      "footer.rights": "Todos los derechos reservados",
      "footer.privacy": "Política de privacidad",
      "footer.terms": "Términos de servicio",
      "footer.cookies": "Política de cookies",

      // Form
      "form.fullNamePh": "Tu nombre completo",
      "form.emailPh": "tu@email.com",
      "form.messagePh": "¿En qué podemos ayudarte?",
      "form.send": "Enviar mensaje",
      "form.err.required": "Por favor completa tu nombre, email y mensaje.",
      "form.err.email": "Por favor ingresa un email válido.",
      "form.ok": "Mensaje enviado. Nos pondremos en contacto a la brevedad.",
      "form.sending": "Enviando…",
      "form.fail": "Ocurrió un error. Por favor intenta de nuevo.",

      // UI
      "ui.openMenu": "Abrir menú",
      "ui.closeMenu": "Cerrar menú",
      "ui.langSelect": "Seleccionar idioma",
      "ui.goHome": "Ir a inicio",
      "ui.toggleTheme": "Cambiar tema claro/oscuro",
      "ui.scrollNext": "Bajar a la siguiente sección",
      "cta.title": "¿Listo para impulsar tu empresa?",
"cta.text": "Nuestro equipo de expertos está listo para ayudarte a encontrar la solución perfecta para tus necesidades.",

    },
  };


  /* =========================
     Language engine (copied from reference)
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
    return normalizeLang(saved || "EN");
  };

  const setLang = (lang) => {
    const L = normalizeLang(lang);
    storage.set(LANG_KEY, L);
    // compat keep
    storage.set("preferred-language", L);
    applyTranslations(L);
  };

  const t = (lang, key) => {
    const L = normalizeLang(lang);
    const dict = I18N[L] || I18N.ES; // fallback ES for non-EN/ES
    return dict[key] ?? (I18N.ES[key] ?? key);
  };

  /* =========================
     Translator (ONLY data-i18n*)
  ========================= */
  function applyTranslations(lang) {
    const L = normalizeLang(lang);

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
    const menuToggle = $("#menu-toggle");
    if (menuToggle) menuToggle.setAttribute("aria-label", t(L, "ui.openMenu"));
    const closeMenu = $("#menuClose");
    if (closeMenu) closeMenu.setAttribute("aria-label", t(L, "ui.closeMenu"));
  const themeToggle = null;
if (themeToggle) themeToggle.setAttribute("aria-label", t(L, "ui.toggleTheme"));
    const langBtn = $("#language-btn");
    if (langBtn) langBtn.setAttribute("aria-label", t(L, "ui.langSelect"));
    const logoLink = $(".brand");
    if (logoLink) logoLink.setAttribute("aria-label", t(L, "ui.goHome"));
    const scrollBtn = $(".scroll-indicator");
    if (scrollBtn) scrollBtn.setAttribute("aria-label", t(L, "ui.scrollNext"));

    // sync language code + flag
    const languageCode = $("#language-code");
    const mobileSelect = $("#mobile-language-select");
    if (languageCode) languageCode.textContent = L;
    if (mobileSelect) mobileSelect.value = L;

    const flagEl = $("#language-flag");
    if (flagEl) flagEl.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;

    $$("[data-flag]").forEach((el) => {
      const code = normalizeLang(el.getAttribute("data-flag") || "ES");
      el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
    });
  }

  /* =========================
     Language UI
  ========================= */
  function initLanguage() {
    const languageBtn = $("#language-btn");
    const languageDropdown = $("#language-dropdown");
    const languageOptions = $$(".language-option");
    const mobileLanguageSelect = $("#mobile-language-select");

    // init apply
    applyTranslations(getLang());

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

  function toggleTheme(){
    // Light-only: theme toggle removed
    if(typeof applyTheme === "function") applyTheme("light");
    try{ document.documentElement.setAttribute("data-theme","light"); }catch(e){}
  }

  const savedTheme = "light";
  applyTheme(savedTheme);
if (themeToggle) themeToggle && themeToggle.addEventListener("click", toggleTheme);
  if (mobileTheme) mobileTheme.addEventListener("click", toggleTheme);


  // =========================
  // i18n init
  // =========================
  initLanguage();

  // =========================
  // Mobile menu
  // =========================
  const lockScroll = (locked) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
    document.body.classList.toggle("menu-open", locked);
  };

  function openMenu() {
    if (!mobileMenu || !mobileOverlay || !menuToggle) return;

    mobileMenu.classList.add("open");
    mobileOverlay.classList.add("show");
    menuToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);

    window.setTimeout(() => {
      const first =
        $(".mobile-nav__link", mobileMenu) ||
        $("a[href]", mobileMenu) ||
        $("button", mobileMenu);
      if (first) first.focus();
    }, 80);
  }

  function closeMenu() {
    if (!mobileMenu || !mobileOverlay || !menuToggle) return;

    mobileMenu.classList.remove("open");
    mobileOverlay.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    lockScroll(false);
    window.setTimeout(() => menuToggle.focus(), 0);
  }

  if (menuToggle)
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
    });

  if (menuClose)
    menuClose.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });

  if (mobileOverlay)
    mobileOverlay.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("open")) closeMenu();
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