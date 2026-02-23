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
      "services.card3.title": " Consultoria Fiscal ",
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
      "nav.svc.payroll": "Payroll processing",
      "nav.svc.specialized": "Specialized services",
      "nav.svc.tax": "Tax consulting",
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
     i18n engine (compatible con referencia)
  ========================= */
  const LANG_KEY = "bausen_lang";
  const LEGACY_KEY = "preferred-language";

  const getInitialLang = () => {
    const stored = storage.get(LANG_KEY) || storage.get(LEGACY_KEY);
    const norm = (stored || "EN").toString().trim().toUpperCase();
    return I18N[norm] ? norm : "EN";
  };

  let currentLang = getInitialLang();

  const applyI18n = (lang) => {
    const dict = I18N[lang] || I18N.EN;

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
  };

  const initLanguage = () => {
    const btn = $("#language-btn");
    const dropdown = $("#language-dropdown");
    const options = $$(".language-option");

    setLangUI(currentLang);
    applyI18n(currentLang);

    const closeDropdown = () => {
      if (!dropdown || !btn) return;
      dropdown.classList.remove("show");
      btn.setAttribute("aria-expanded", "false");
    };

    const openDropdown = () => {
      if (!dropdown || !btn) return;
      dropdown.classList.add("show");
      btn.setAttribute("aria-expanded", "true");
    };

    if (btn && dropdown) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const expanded = btn.getAttribute("aria-expanded") === "true";
        expanded ? closeDropdown() : openDropdown();
      });

      document.addEventListener("click", () => closeDropdown());
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDropdown();
      });
    }

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const lang = (opt.getAttribute("data-lang") || "EN").toUpperCase();
        currentLang = I18N[lang] ? lang : "EN";
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

    const openMenu = () => {
      mobileMenu.classList.add("open");
      overlay.classList.add("show");
      document.body.classList.add("menu-open");
      menuToggle.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      overlay.classList.remove("show");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Cerrar al navegar
    $$("#mobile-menu a").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // Hover UX para <details> en pointer fine (como referencia)
    if (hasFinePointer && !prefersReducedMotion) {
      const details = $$("#mobile-menu details.menu-details");
      details.forEach((d) => {
        let openT = null;
        let closeT = null;

        const scheduleOpen = () => {
          clearTimeout(closeT);
          openT = setTimeout(() => {
            d.open = true;
          }, 140);
        };

        const scheduleClose = () => {
          clearTimeout(openT);
          closeT = setTimeout(() => {
            d.open = false;
          }, 180);
        };

        d.addEventListener("mouseenter", scheduleOpen);
        d.addEventListener("mouseleave", scheduleClose);
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
