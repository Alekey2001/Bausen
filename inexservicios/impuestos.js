/* impuestos.js (UPDATED)
   ✅ Paleta fija (sin tema claro/oscuro)
   ✅ Header desktop: solo 3 controles (colaborador + idioma + hamburguesa)
   ✅ Navegación completa vive en el drawer (PC + móvil)
   ✅ i18n por data-i18n / data-i18n-text / data-i18n-placeholder
*/

document.addEventListener("DOMContentLoaded", () => {
  'use strict';

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

  const I18N = {
    ES: {
      // Header/Nav
      "nav.home": "Inicio",
      "nav.press": "Prensa",
      "nav.services": "Servicios",
      "nav.svc.payroll": "Procesamiento de nómina",
      "nav.svc.specialized": "Servicios especializados",
      "nav.svc.tax": "Consultoría fiscal",
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
      "services.card1.title": "Procesamiento de nómina",
      "services.card1.text": "Aumenta la eficiencia y resultados de tu negocio.",
      "services.card2.title": "Servicios especializados",
      "services.card2.text": "Aumenta la eficiencia y resultados de tu negocio.",
      "services.card3.title": "<span class=\'split-royal\'>Consultoria</span> <span class=\'split-black\'>Fiscal</span>",
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
      "footer.contact": "Contáctanos",
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
  };


  

  /* =========================
     i18n engine (compatible con referencia)
  ========================= */
  const LANG_KEY = "bausen_lang";
  const LEGACY_KEY = "preferred-language";

  const getInitialLang = () => 'ES';

  let currentLang = 'ES';

  const applyI18n = (lang) => {
    const dict = I18N[lang] || I18N.ES;

    // data-i18n: innerHTML (permite <br/> y spans)
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = dict[key];
      if (typeof val === "string") el.innerHTML = val;
    });

    // data-i18n-text: textContent (texto plano)
    $$("[data-i18n-text]").forEach((el) => {
      const key = el.getAttribute("data-i18n-text");
      if (!key) return;
      const val = dict[key];
      if (typeof val === "string") el.textContent = val;
    });

    // data-i18n-placeholder: placeholder (inputs)
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = dict[key];
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });
  };

  /* =========================
     Flags (SVG inline) — como referencia
  ========================= */
  const FLAGS = {
    ES: `<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="18" height="18" rx="4" fill="#C60B1E"/>
      <rect y="5" width="18" height="8" fill="#FFC400"/>
    </svg>`,
    EN: `<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="18" height="18" rx="4" fill="#012169"/>
      <path d="M0 0 L18 18 M18 0 L0 18" stroke="#FFF" stroke-width="4"/>
      <path d="M0 0 L18 18 M18 0 L0 18" stroke="#C8102E" stroke-width="2"/>
      <path d="M9 0 V18 M0 9 H18" stroke="#FFF" stroke-width="6"/>
      <path d="M9 0 V18 M0 9 H18" stroke="#C8102E" stroke-width="3"/>
    </svg>`,
  };

 const setLangUI = (lang) => {
  const codeEl = $("#language-code");
  const flagEl = $("#language-flag");

  if (codeEl) codeEl.textContent = lang;
  if (flagEl) flagEl.innerHTML = FLAGS[lang] || "";

  $$("[data-flag]").forEach((el) => {
    const flagKey = (el.getAttribute("data-flag") || "").trim().toUpperCase();
    el.innerHTML = FLAGS[flagKey] || "";
  });
};

  const initLanguage = () => {
    const btn = $("#language-btn");
    const dropdown = $("#language-dropdown");
    const options = $$(".language-option");
    const wrap = btn?.closest(".language-selector");

    setLangUI(currentLang);
    applyI18n(currentLang);

    let closeTimer = null;

    const closeDropdown = (delay = 0) => {
      if (!dropdown || !btn) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        dropdown.classList.remove("show");
        btn.setAttribute("aria-expanded", "false");
      }, delay);
    };

    const openDropdown = () => {
      if (!dropdown || !btn) return;
      clearTimeout(closeTimer);
      dropdown.classList.add("show");
      btn.setAttribute("aria-expanded", "true");
    };

    if (btn && dropdown) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const expanded = btn.getAttribute("aria-expanded") === "true";
        expanded ? closeDropdown() : openDropdown();
      });

      document.addEventListener("pointerdown", (e) => {
        if (wrap && !wrap.contains(e.target)) closeDropdown(0);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDropdown(0);
      });

      if (wrap && hasFinePointer) {
        wrap.addEventListener("pointerenter", openDropdown);
        wrap.addEventListener("pointerleave", () => closeDropdown(120));
      }
    }

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const lang = (opt.getAttribute("data-lang") || "ES").toUpperCase();
        currentLang = I18N[lang] ? lang : "ES";
        storage.set(LANG_KEY, currentLang);
        storage.set(LEGACY_KEY, currentLang);
        setLangUI(currentLang);
        applyI18n(currentLang);
        closeDropdown();
      });
    });
  };

  /* =========================
     Drawer (overlay + menú)
  ========================= */
  const initDrawer = () => {
    const menuToggle = $("#menu-toggle");
    const mobileMenu = $("#mobile-menu");
    const overlay = $("#mobile-menu-overlay");
    const closeBtn = $("#close-menu");

    if (!menuToggle || !mobileMenu || !overlay) return;

    const lockScroll = (locked) => {
      document.documentElement.style.overflow = locked ? "hidden" : "";
      document.body.style.overflow = locked ? "hidden" : "";
    };

    const openMenu = () => {
      overlay.hidden = false;
      overlay.classList.add("show");
      mobileMenu.classList.add("open");
      mobileMenu.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
      menuToggle.setAttribute("aria-expanded", "true");
      lockScroll(true);

      setTimeout(() => {
        const first = mobileMenu.querySelector("a.mobile-nav-link, a.mobile-sub-link, button, [tabindex]:not([tabindex='-1'])");
        first?.focus();
      }, 50);
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      lockScroll(false);
      overlay.classList.remove("show");

      setTimeout(() => {
        overlay.hidden = true;
      }, 220);

      menuToggle.focus();
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);
    closeBtn?.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) closeMenu();
    });

    $$("#mobile-menu a").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    if (hasFinePointer) {
      let openTimer = null;

      menuToggle.addEventListener("pointerenter", () => {
        clearTimeout(openTimer);
        openTimer = setTimeout(() => {
          if (!mobileMenu.classList.contains("open")) openMenu();
        }, 120);
      });

      menuToggle.addEventListener("pointerleave", () => {
        clearTimeout(openTimer);
      });

      mobileMenu.addEventListener("pointerleave", () => {
        setTimeout(() => {
          if (mobileMenu.classList.contains("open")) closeMenu();
        }, 220);
      });

      overlay.addEventListener("pointerleave", (e) => {
        if (!mobileMenu.classList.contains("open")) return;
        const to = e.relatedTarget;
        if (to && (mobileMenu.contains(to) || menuToggle.contains(to))) return;
        closeMenu();
      });

      const details = $$("#mobile-menu details.menu-details");
      details.forEach((d) => {
        let timer = null;

        d.addEventListener("pointerenter", () => {
          clearTimeout(timer);
          d.open = true;
        });

        d.addEventListener("pointerleave", () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            d.open = false;
          }, 140);
        });
      });
    }
  };

  /* =========================
     Active state (resalta página actual)
  ========================= */
  const initActive = () => {
    const path = (location.pathname || "").toLowerCase();

    const normalize = (href) => {
      try {
        const url = new URL(href, location.origin);
        return url.pathname.toLowerCase();
      } catch {
        return (href || "").toLowerCase();
      }
    };

    const allLinks = $$(".mobile-nav-link, .mobile-sub-link, .mobile-summary-link");
    allLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      const p = normalize(href);
      if (p && p === path) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  };

  initLanguage();
  initDrawer();
  initActive();
});