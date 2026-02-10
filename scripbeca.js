/* scripbeca.js — BAUSEN (ONE i18n ENGINE + Netlify Forms)
   ✅ Mantiene:
   - Netlify Forms (name/form-name/honeypot/POST) sin romper lógica
   - Menú, tema, loader, tabs, carrusel, etc.
   ✅ i18n:
   - Un solo motor (data-i18n / data-i18n-text / data-i18n-placeholder)
   - storage key única: bausen_lang (compat: preferred-language)
   - Default: EN
   ✅ Footer incluido y estable
*/

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =========================
     Helpers
  ========================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

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
      "header.collab": "¿Eres colaborador?",

      // Hero
      "hero.pill": "Soluciones empresariales integrales",
      "hero.title": "Impulsamos<br /><span class='hero-accent'>tu talento</span>",
      "hero.subtitle":
        "Capital Humano, Desarrollo Organizacional y Management<br />Servicios para cada etapa de tu crecimiento.",
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
    },

    EN: {
      // Header/Nav
      "nav.home": "Home",
      "nav.press": "Press",
      "nav.services": "Services",
      "nav.news": "News",
      "nav.training": "Training Center",
      "nav.about": "About",
      "header.collab": "Are you a collaborator?",

      // Hero
      "hero.pill": "Integrated business solutions",
      "hero.title": "We empower<br /><span class='hero-accent'>your talent</span>",
      "hero.subtitle":
        "Human Capital, Organizational Development and Management<br />Services for every growth stage.",
      "hero.ctaServices": "View Services",
      "hero.ctaContact": "Contact",
      "kpi.years": "Years of experience",
      "kpi.clients": "Clients",
      "kpi.sat": "Satisfaction",
      "toast.title": "Certified",

      // Services
      "services.kicker": "What we do",
      "services.title": "Our Services",
      "services.subtitle": "Integrated solutions designed to optimize every aspect of your organization",
      "services.card1.title": "Human Capital",
      "services.card1.text": "Boost efficiency and results for your business.",
      "services.card2.title": "Specialized Services",
      "services.card2.text": "Boost efficiency and results for your business.",
      "services.card3.title": "Tax Services",
      "services.card3.text": "Optimize your tax burden with certified experts.",
      "services.more": "Learn more",

      // Press
      "press.kicker": "Press room",
      "press.title": "Press <span class='accent'>Releases</span>",
      "press.subtitle": "Stay informed about the latest BAUSEN news and announcements",
      "press.cta": "View all releases",

      // Training
      "training.kicker": "Talent development",
      "training.title": "BAUSEN Training Center",
      "training.subtitle": "We train and connect future talent with the best<br />opportunities",
      "training.tab.events": "Events",
      "training.tab.webinars": "Institutional Webinars",
      "training.tab.interns": "Internship Program",
      "training.leftTitle.events": "Events",
      "training.leftTitle.webinars": "Institutional Webinars",
      "training.leftTitle.interns": "Internship Program",
      "training.panel.events.title": "Events",
      "training.panel.events.text": "Active participation in events with schools and universities",
      "training.panel.webinars.title": "Institutional Webinars",
      "training.panel.webinars.text": "Specialized training and webinars with educational institutions",
      "training.panel.interns.title": "Internship Program",
      "training.panel.interns.text": "Comprehensive program for training and developing young talent",
      "training.more": "Learn more",

      // News
      "news.kicker": "Blog & news",
      "news.title": "Latest <span class='accent'>News</span>",
      "news.subtitle": "Discover articles, success stories and industry trends",
      "news.cta": "View all news",

      // Connect
      "connect.kicker": "Connect with us",
      "connect.title": "Together we shape<br /><span class='connect-accent'>your path to success</span>",
      "connect.text":
        "Ready to take your business to the next level? Schedule a<br />meeting with our specialists and discover how we can<br />help you.",
      "connect.cta": "Schedule now!",
      "connect.follow": "Follow us on social!",

      // Awards
      "awards.kicker": "Recognized excellence",
      "awards.title": "Our <span class='accent'>Recognitions</span>",
      "awards.subtitle": "Certifications and partnerships that back our commitment to excellence",
      "awards.card1.k": "Recognition 01",
      "awards.card1.t": "Human Resources Council",
      "awards.card2.k": "Recognition 02",
      "awards.card2.t": "Humanitarian Companies Distinction",
      "awards.card3.k": "Recognition 03",
      "awards.card3.t": "Decent Work Certification",
      "awards.card4.k": "Recognition 04",
      "awards.card4.t": "Professional Specialists Registry",
      "awards.card5.k": "Recognition 05",
      "awards.card5.t": "Human Resources Council",
      "awards.card6.k": "Recognition 06",
      "awards.card6.t": "ISO Certification",
      "awards.card7.k": "Recognition 07",
      "awards.card7.t": "NOM Compliance",
      "awards.card8.k": "Recognition 08",
      "awards.card8.t": "REPSE Registry",

      // Contact
      "contact.kicker": "Ready to connect?",
      "contact.title": "Let’s talk about <span class='contact-accent'>your project</span>",
      "contact.subtitle":
        "Tell us your ideas, needs or questions and our team will contact you<br />shortly. We’re here to help you transform your operations!",
      "contact.formTitle": "Send us a message",
      "contact.formSubtitle": "Fill out the form and we’ll contact you soon.",
      "contact.infoTitle": "Contact Information",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.location": "Location",
      "contact.locationValue": "Querétaro, Mexico",
      "contact.hours": "Hours",
      "contact.hoursValue": "Mon - Fri: 9:00 - 18:00",
      "contact.follow": "Follow us on social",

      // Map
      "map.kicker": "OUR LOCATIONS",
      "map.noBranches": "No active branches found",
      "map.retry": "Retry",
      "map.searching": "Searching…",

      // Footer
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
      "footer.note": "Coming soon. No active branches found.",
      "footer.phoneLabel": "Phone",
      "footer.emailLabel": "Email",
      "footer.maps": "View on Google Maps",
      "footer.rights": "All rights reserved",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.cookies": "Cookie Policy",

      // Form
      "form.fullNamePh": "Full name",
      "form.emailPh": "you@email.com",
      "form.messagePh": "How can we help you?",
      "form.send": "Send message",
      "form.err.required": "Please complete your name, email and message.",
      "form.err.email": "Please enter a valid email.",
      "form.ok": "Message sent. We’ll contact you shortly.",
      "form.sending": "Sending…",
      "form.fail": "Something went wrong. Please try again.",

      // UI
      "ui.openMenu": "Open menu",
      "ui.closeMenu": "Close menu",
      "ui.langSelect": "Select language",
      "ui.goHome": "Go to home",
      "ui.toggleTheme": "Toggle light/dark theme",
      "ui.scrollNext": "Scroll to next section",
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
    const closeMenu = $("#close-menu");
    if (closeMenu) closeMenu.setAttribute("aria-label", t(L, "ui.closeMenu"));
    const themeToggle = $("#theme-toggle");
    if (themeToggle) themeToggle.setAttribute("aria-label", t(L, "ui.toggleTheme"));
    const langBtn = $("#language-btn");
    if (langBtn) langBtn.setAttribute("aria-label", t(L, "ui.langSelect"));
    const logoLink = $(".logo-link");
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

  /* =========================
     Loader
  ========================= */
  function initLoader() {
    const pageLoader = $("#page-loader");
    if (!pageLoader) return;

    body.style.overflow = "hidden";

    const hide = () => {
      if (pageLoader.classList.contains("hidden")) return;
      pageLoader.classList.add("hidden");
      body.style.overflow = "";
    };

    if (document.readyState === "complete") {
      setTimeout(hide, prefersReducedMotion ? 120 : 350);
    } else {
      window.addEventListener("load", () => setTimeout(hide, prefersReducedMotion ? 120 : 350), { once: true });
    }

    setTimeout(hide, 3500);
  }

  /* =========================
     Theme
  ========================= */
  function initTheme() {
    const KEY = "theme";
    const themeToggle = $("#theme-toggle");

    const apply = (mode) => {
      const isDark = mode === "dark";
      body.classList.toggle("theme-dark", isDark);
      storage.set(KEY, isDark ? "dark" : "light");
    };

    const saved = storage.get(KEY);
    if (saved === "dark" || saved === "light") apply(saved);
    else {
      const osDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      apply(osDark ? "dark" : "light");
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = body.classList.contains("theme-dark");
        apply(isDark ? "light" : "dark");
      });
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
  function initActiveLink() {
    const mainNavLinks = $$(".nav-link, .mobile-nav-link");
    const file = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const pageNoExt = file.replace(".html", "").replace(".htm", "");

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
    };

    const currentKey = alias[pageNoExt] || pageNoExt || "index";

    mainNavLinks.forEach((link) => {
      const key = (link.getAttribute("data-page") || "").toLowerCase();
      link.classList.toggle("active", key === currentKey);
    });
  }

  /* =========================
     Footer year
  ========================= */
  function initYear() {
    const currentYear = $("#current-year");
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());
  }

  /* =========================
     Reveal animations
  ========================= */
  function initReveal() {
    const els = $$("[data-animate]");
    if (!els.length) return;

    els.forEach((el) => {
      const d = parseInt(el.getAttribute("data-delay") || "0", 10);
      if (!Number.isNaN(d) && d > 0) el.style.transitionDelay = `${d}ms`;
    });

    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
  }

  /* =========================
     Scroll indicator
  ========================= */
  function initScrollIndicator() {
    const scrollIndicator = $(".scroll-indicator");
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener("click", () => {
      const heroSection = $("#hero") || $(".hero");
      const next =
        (heroSection && heroSection.nextElementSibling) ||
        $("#services") ||
        $(".services") ||
        $("main section:nth-of-type(2)");

      if (next) next.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      else window.scrollTo({ top: window.innerHeight * 0.9, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* =========================
     Custom Cursor
  ========================= */
  function initCursor() {
    const cursorDot = $("#cursor-dot");
    const cursorRing = $("#cursor-ring");
    if (!cursorDot || !cursorRing) return;
    if (!hasFinePointer || prefersReducedMotion) return;

    body.classList.add("has-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let ringX = mouseX, ringY = mouseY;

    let raf = null;

    const setPos = (el, x, y) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      dotX += (mouseX - dotX) * 0.6;
      dotY += (mouseY - dotY) * 0.6;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      setPos(cursorDot, dotX, dotY);
      setPos(cursorRing, ringX, ringY);

      raf = null;
    };

    const isInteractive = (tEl) =>
      !!tEl.closest(
        "a, button, input, textarea, select, .btn, [role='button'], .service-card, .social-card, .training-tab, .award-card"
      );

    const isSoftInteractive = (tEl) => !!tEl.closest(".media-card, .nav-link, .language-btn, .theme-toggle");

    const onOver = (e) => {
      const tEl = e.target;
      cursorRing.classList.toggle("hover", isInteractive(tEl));
      cursorRing.classList.toggle("interactive", isSoftInteractive(tEl));
    };

    const onOut = () => cursorRing.classList.remove("hover", "interactive");

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
  }

  /* =========================
     Hero parallax
  ========================= */
  function initHeroParallax() {
    const hero = $("#hero");
    const mediaCard = $("#media-card");
    if (!hero || !mediaCard) return;
    if (!hasFinePointer || prefersReducedMotion) return;

    let raf = null;
    let tx = 0, ty = 0;

    const orb1 = $(".hero-orb-1");
    const orb2 = $(".hero-orb-2");
    const orb3 = $(".hero-orb-3");

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      tx = Math.max(-0.6, Math.min(0.6, x));
      ty = Math.max(-0.6, Math.min(0.6, y));

      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        mediaCard.style.transform = `translate3d(${tx * 12}px, ${ty * 9}px, 0)`;
        if (orb1) orb1.style.transform = `translate3d(${tx * 18}px, ${ty * 12}px, 0)`;
        if (orb2) orb2.style.transform = `translate3d(${tx * -14}px, ${ty * -10}px, 0)`;
        if (orb3) orb3.style.transform = `translate3d(${tx * 10}px, ${ty * -8}px, 0)`;
      });
    };

    const onLeave = () => {
      mediaCard.style.transform = "";
      if (orb1) orb1.style.transform = "";
      if (orb2) orb2.style.transform = "";
      if (orb3) orb3.style.transform = "";
    };

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave, { passive: true });
  }

  /* =========================
     Training tabs (robusto + i18n)
  ========================= */
  function initTrainingTabs() {
    const trainingRoot = $("#training");
    if (!trainingRoot) return;

    const trainingTabs = $$(".training-tab", trainingRoot);
    const trainingPanels = $$(".training-panel", trainingRoot);

    if (!trainingTabs.length || !trainingPanels.length) return;

    const AUTO_MS = 5200;
    const FADE_MS = 280;

    const progressBar = $(".training-progress-left .training-progress-bar", trainingRoot);
    const dots = $$(".training-dot", trainingRoot);

    let currentKey = "becarios";
    let timer = null;

    const keyFromId = (id) => {
      const lower = String(id || "").toLowerCase();
      if (lower.includes("eventos")) return "eventos";
      if (lower.includes("webinars")) return "webinars";
      if (lower.includes("becarios")) return "becarios";
      return "";
    };

    const leftTitleKey = (key) => {
      if (key === "eventos") return "training.leftTitle.events";
      if (key === "webinars") return "training.leftTitle.webinars";
      return "training.leftTitle.interns";
    };

    const setLeftTitle = () => {
      const leftTitle = $("#trainingLeftTitle") || $(".training-image-title", trainingRoot);
      if (!leftTitle) return;
      const lang = getLang();
      leftTitle.textContent = t(lang, leftTitleKey(currentKey));
    };

    const setDotsActive = (key) => {
      dots.forEach((b) => b.classList.toggle("is-active", (b.dataset.go || "").toLowerCase() === key));
    };

    const resetProgress = () => {
      if (!progressBar || prefersReducedMotion) return;
      progressBar.style.animation = "none";
      progressBar.style.width = "0%";
      progressBar.offsetHeight;
      progressBar.style.animation = `trainingProgressFill ${AUTO_MS}ms linear forwards`;
    };

    const stopAuto = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const startAuto = () => {
      if (prefersReducedMotion) return;
      stopAuto();
      timer = setTimeout(() => {
        const order = ["eventos", "webinars", "becarios"];
        const idx = order.indexOf(currentKey);
        const next = order[(idx + 1) % order.length];
        showPanel(next);
      }, AUTO_MS);
    };

    const showPanel = (key) => {
      currentKey = key;

      trainingTabs.forEach((tab) => {
        const is = (tab.dataset.tab || "").toLowerCase() === key;
        tab.classList.toggle("is-active", is);
        tab.setAttribute("aria-selected", is ? "true" : "false");
      });

      // Left big icon swap
      const leftIconWrap = trainingRoot.querySelector(".training-card-left .training-image-icon");
      const activeTab = trainingTabs.find((tEl) => (tEl.dataset.tab || "").toLowerCase() === key);
      if (leftIconWrap && activeTab && activeTab.dataset.icon) {
        leftIconWrap.innerHTML = `<i class="${activeTab.dataset.icon}" aria-hidden="true"></i>`;
        if (window.FontAwesome?.dom?.i2svg) window.FontAwesome.dom.i2svg({ node: leftIconWrap });
        leftIconWrap.classList.add("is-swap");
        setTimeout(() => leftIconWrap.classList.remove("is-swap"), 180);
      }

      const currentActive = trainingPanels.find((p) => p.classList.contains("is-active"));

      trainingPanels.forEach((panel) => {
        const pKey = keyFromId(panel.id);
        const shouldBeActive = pKey === key;

        if (shouldBeActive) {
          panel.removeAttribute("hidden");
          panel.classList.remove("is-active");
          panel.offsetHeight;
          panel.classList.add("is-active");
        } else {
          if (panel === currentActive) {
            panel.classList.remove("is-active");
            setTimeout(() => panel.setAttribute("hidden", ""), FADE_MS);
          } else {
            panel.classList.remove("is-active");
            panel.setAttribute("hidden", "");
          }
        }
      });

      setLeftTitle();
      setDotsActive(key);
      resetProgress();
      startAuto();

      // Re-apply translations to keep everything consistent
      applyTranslations(getLang());
    };

    trainingTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = (tab.dataset.tab || "").toLowerCase();
        if (!key) return;
        showPanel(key);
      });
    });

    dots.forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        const key = (b.dataset.go || "").toLowerCase();
        if (!key) return;
        showPanel(key);
      });
    });

    const initialTab = trainingTabs.find((tEl) => tEl.classList.contains("is-active")) || trainingTabs[0];
    showPanel((initialTab?.dataset.tab || "becarios").toLowerCase());
  }

  /* =========================
     Awards carousel
  ========================= */
  function initAwardsCarousel() {
    const awardsRoot = $("#awards");
    const awardsTrack = awardsRoot ? $(".awards-track", awardsRoot) : null;
    const awardCards = awardsTrack ? $$(".award-card", awardsTrack) : [];
    const awardIndicators = awardsRoot ? $$(".award-indicator", awardsRoot) : [];

    if (!awardsTrack || !awardCards.length) return;

    const canScroll = () => awardsTrack.scrollWidth > awardsTrack.clientWidth + 5;

    const setIndicator = (idx) => {
      if (!awardIndicators.length) return;
      awardIndicators.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };

    const mapCardToDot = (cardIndex) => {
      if (!awardIndicators.length) return 0;
      if (awardCards.length === 1) return 0;
      const ratio = cardIndex / (awardCards.length - 1);
      return Math.round(ratio * (awardIndicators.length - 1));
    };

    const nearestCardIndex = () => {
      const rect = awardsTrack.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      let best = 0;
      let bestDist = Infinity;

      awardCards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const dist = Math.abs(c - centerX);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      return best;
    };

    const updateIndicators = () => {
      const cardIdx = nearestCardIndex();
      setIndicator(mapCardToDot(cardIdx));
    };

    if (awardIndicators.length) {
      awardIndicators.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          const targetCardIdx =
            awardIndicators.length === 1
              ? 0
              : Math.round((i / (awardIndicators.length - 1)) * (awardCards.length - 1));

          const target = awardCards[targetCardIdx];
          if (!target) return;

          target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            inline: "center",
            block: "nearest",
          });

          setIndicator(i);
        });
      });
    }

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e) => {
      if (!canScroll()) return;
      isDown = true;
      awardsTrack.classList.add("is-dragging");
      startX = e.clientX;
      startScroll = awardsTrack.scrollLeft;
    };

    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      awardsTrack.scrollLeft = startScroll - dx;
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      awardsTrack.classList.remove("is-dragging");
      updateIndicators();
    };

    awardsTrack.addEventListener("mousedown", onDown);
    awardsTrack.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    let tDown = false;
    let tStartX = 0;
    let tStartScroll = 0;

    awardsTrack.addEventListener(
      "touchstart",
      (e) => {
        if (!canScroll()) return;
        tDown = true;
        tStartX = e.touches[0].clientX;
        tStartScroll = awardsTrack.scrollLeft;
      },
      { passive: true }
    );

    awardsTrack.addEventListener(
      "touchmove",
      (e) => {
        if (!tDown) return;
        const dx = e.touches[0].clientX - tStartX;
        awardsTrack.scrollLeft = tStartScroll - dx;
      },
      { passive: true }
    );

    awardsTrack.addEventListener(
      "touchend",
      () => {
        if (!tDown) return;
        tDown = false;
        updateIndicators();
      },
      { passive: true }
    );

    let st = null;
    awardsTrack.addEventListener("scroll", () => {
      if (st) clearTimeout(st);
      st = setTimeout(updateIndicators, 90);
    });

    updateIndicators();
  }

  /* =========================
     Map retry (i18n stable)
  ========================= */
  function initMapRetry() {
    const mapRetryBtn = $("#mapRetryBtn") || $(".contact-map-retry");
    if (!mapRetryBtn) return;

    mapRetryBtn.addEventListener("click", () => {
      const btn = mapRetryBtn;
      if (btn.classList.contains("is-loading")) return;

      btn.classList.add("is-loading");
      btn.disabled = true;

      const title = document.querySelector(".contact-map-alert-title");
      const lang = getLang();

      if (title) title.textContent = t(lang, "map.searching");

      setTimeout(() => {
        if (title) title.textContent = t(lang, "map.noBranches");
        btn.classList.remove("is-loading");
        btn.disabled = false;
      }, 1100);
    });
  }

  /* =========================
     Contact form (Netlify + AJAX)
     ✅ POST robusto a "/"
  ========================= */
  function initContactForm() {
    const contactForm = $("#contactForm");
    const formStatus = $("#formStatus");
    if (!contactForm || !formStatus) return;

    const setStatus = (msg, ok) => {
      formStatus.textContent = msg || "";
      formStatus.style.opacity = msg ? "1" : "0";
      formStatus.style.marginTop = msg ? "12px" : "";
      formStatus.style.fontWeight = "900";
      formStatus.style.color = ok ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)";
    };

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

    const encodeFormData = (formData) => {
      const params = new URLSearchParams();
      for (const [k, v] of formData.entries()) params.append(k, v);
      return params.toString();
    };

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const lang = getLang();

      const fullName = ($("#fullName")?.value || "").trim();
      const email = ($("#email")?.value || "").trim();
      const message = ($("#message")?.value || "").trim();

      if (!fullName || !email || !message) {
        setStatus(t(lang, "form.err.required"), false);
        return;
      }
      if (!isEmail(email)) {
        setStatus(t(lang, "form.err.email"), false);
        return;
      }

      // honeypot
      const botField = contactForm.querySelector("input[name='bot-field']");
      if (botField && String(botField.value || "").trim().length > 0) return;

      const btn = $("#contactSubmitBtn") || contactForm.querySelector("button[type='submit']");
      const oldBtnHTML = btn ? btn.innerHTML : "";

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>${t(lang, "form.sending")}</span>`;
      }
      setStatus("", true);

      try {
        const formData = new FormData(contactForm);

        // ✅ Netlify Forms recomendado para AJAX: POST a "/"
        const postUrl = "/";

        const res = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encodeFormData(formData),
        });

        if (!res.ok) throw new Error(`Netlify form error: ${res.status}`);

        setStatus(t(lang, "form.ok"), true);
        contactForm.reset();

        setTimeout(() => setStatus("", true), 4500);
      } catch (err) {
        console.error(err);
        setStatus(t(lang, "form.fail"), false);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = oldBtnHTML;
        }
      }
    });
  }

  /* =========================
     Boot
  ========================= */
  initLoader();
  initTheme();
  initLanguage();
  initMobileMenu();
  initActiveLink();
  initYear();
  initReveal();
  initScrollIndicator();
  initCursor();
  initHeroParallax();
  initTrainingTabs();
  initAwardsCarousel();
  initMapRetry();
  initContactForm();
});
