/* scripbeca.js — BAUSEN (i18n + Netlify Forms)
   ✅ Mantiene:
   - Netlify Forms (name/form-name/honeypot/POST) sin romper lógica
   - Menú, tema, loader, tabs, carrusel, etc.
   ✅ i18n:
   - Traducción completa ES/EN
   - Idiomas extra (DE/PT/FR/IT) se conservan en UI y hacen fallback a ES por ahora
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
     i18n dictionaries (ES + EN)
  ========================= */
  const I18N = {
    ES: {
      // NAV
      "nav.home": "Inicio",
      "nav.press": "Prensa",
      "nav.services": "Servicios",
      "nav.news": "Noticias",
      "nav.training": "Centro de Formación",
      "nav.about": "Acerca de",

      // HEADER CTA
      "header.collaborator": "¿Eres colaborador?",

      // HERO
      "hero.pill": "Soluciones empresariales integrales",
      "hero.title": "Impulsamos<br /><span class='hero-accent'>tu talento</span>",
      "hero.subtitle":
        "Capital Humano, Desarrollo Organizacional y Management<br />Servicios para cada etapa de tu crecimiento.",
      "hero.ctaServices": "Ver Servicios",
      "hero.ctaContact": "Contactar",

      // Toast
      "toast.title": "Certificados",
      "toast.sub": "REPSE · ISO · NOM",

      // KPIs
      "kpi.years": "Años de experiencia",
      "kpi.clients": "Clientes",
      "kpi.satisfaction": "Satisfacción",

      // SERVICES section
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

      // PRESS
      "press.kicker": "Sala de prensa",
      "press.title": "Comunicados de <span class='accent'>Prensa</span>",
      "press.subtitle": "Mantente informado sobre las últimas noticias y anuncios de BAUSEN",
      "press.cta": "Ver todos los comunicados",

      // TRAINING
      "training.kicker": "Formación de talento",
      "training.subtitle":
        "Formamos y conectamos el talento del futuro con las mejores<br />oportunidades",
      "training.leftTitle": "Sistema de Becarios",
      "training.tab.events": "Eventos",
      "training.tab.webinars": "Webinars Institucionales",
      "training.tab.interns": "Sistema de Becarios",
      "training.panel.events.text": "Participación activa en eventos con escuelas y universidades",
      "training.panel.webinars.text": "Capacitaciones y webinars especializados con instituciones educativas",
      "training.panel.interns.text": "Programa integral de formación y desarrollo de talento joven",
      "training.more": "Más información",
      "training.dot.events": "Ir a Eventos",
      "training.dot.webinars": "Ir a Webinars Institucionales",
      "training.dot.interns": "Ir a Sistema de Becarios",

      // NEWS
      "news.kicker": "Blog y noticias",
      "news.title": "Últimas <span class='accent'>Noticias</span>",
      "news.subtitle": "Descubre artículos, casos de éxito y tendencias del sector",
      "news.cta": "Ver todas las noticias",

      // CONNECT
      "connect.kicker": "Conecta con nosotros",
      "connect.title": "Juntos trazamos<br /><span class='connect-accent'>tu camino al éxito</span>",
      "connect.text":
        "¿Listo para llevar tu negocio al siguiente nivel? Agenda una<br />reunión con nuestros especialistas y descubre cómo podemos<br />ayudarte.",
      "connect.cta": "¡Agenda ahora!",
      "connect.follow": "¡Síguenos en redes!",

      // AWARDS
      "awards.kicker": "Excelencia reconocida",
      "awards.title": "Nuestros <span class='accent'>Reconocimientos</span>",
      "awards.subtitle": "Certificaciones y alianzas que respaldan nuestro compromiso con la excelencia",

      // Awards cards (carousel)
      "awards.card1.kicker": "Reconocimiento 01",
      "awards.card1.title": "Consejo de Recursos Humanos",
      "awards.card2.kicker": "Reconocimiento 02",
      "awards.card2.title": "Distintivo de Empresas Humanitarias",
      "awards.card3.kicker": "Reconocimiento 03",
      "awards.card3.title": "Certificación de Trabajo Digno",
      "awards.card4.kicker": "Reconocimiento 04",
      "awards.card4.title": "Registro de Especialistas Profesionales",
      "awards.card5.kicker": "Reconocimiento 05",
      "awards.card5.title": "Concilio de Recursos Humanos",
      "awards.card6.kicker": "Reconocimiento 06",
      "awards.card6.title": "Certificación ISO",
      "awards.card7.kicker": "Reconocimiento 07",
      "awards.card7.title": "Cumplimiento NOM",
      "awards.card8.kicker": "Reconocimiento 08",
      "awards.card8.title": "Registro REPSE",

      // CONTACT section
      "contact.kicker": "¿Listo para conectar?",
      "contact.title": "Hablemos sobre <span class='contact-accent'>tu proyecto</span>",
      "contact.subtitle":
        "Cuéntanos tus ideas, necesidades o dudas y nuestro equipo te contactará a la<br />brevedad. ¡Estamos aquí para ayudarte a transformar tu operación!",
      "contact.formTitle": "Envíanos un mensaje",
      "contact.formSubtitle": "Completa el formulario y te contactaremos pronto.",

      // Contact info block
      "contact.infoTitle": "Información de Contacto",
      "contact.phoneLabel": "Teléfono",
      "contact.emailLabel": "Email",
      "contact.locationLabel": "Ubicación",
      "contact.locationValue": "Querétaro, México",
      "contact.hoursLabel": "Horario",
      "contact.hoursValue": "Lun - Vie: 9:00 - 18:00",
      "contact.follow": "Síguenos en redes",

      // FORM
      "form.fullNamePh": "Tu nombre completo",
      "form.emailPh": "tu@email.com",
      "form.messagePh": "¿En qué podemos ayudarte?",
      "form.send": "Enviar mensaje",

      "form.err.required": "Por favor completa tu nombre, email y mensaje.",
      "form.err.email": "Por favor ingresa un email válido.",
      "form.ok": "Mensaje enviado. Nos pondremos en contacto a la brevedad.",
      "form.sending": "Enviando…",
      "form.fail": "Ocurrió un error. Por favor intenta de nuevo.",

      // MAP
      "map.kicker": "NUESTRAS UBICACIONES",

      // FOOTER headings
      "footer.company": "EMPRESA",
      "footer.services": "SERVICIOS",

      // FOOTER company links
      "footer.link.about": "Acerca de",
      "footer.link.services": "Servicios",
      "footer.link.news": "Noticias",
      "footer.link.press": "Prensa",
      "footer.link.contact": "Contacto",

      // FOOTER services links
      "footer.svc.capital": "Capital Humano",
      "footer.svc.legal": "Servicios Legales",
      "footer.svc.accounting": "Servicios Contables",
      "footer.svc.orgdev": "Desarrollo Organizacional",

      // UI
      "ui.openMenu": "Abrir menú",
      "ui.closeMenu": "Cerrar menú",
      "ui.retry": "Reintentar",
      "ui.searching": "Buscando…",
      "ui.noBranches": "No se encontraron sucursales activas",
      "ui.scrollNext": "Bajar a la siguiente sección",
      "ui.langSelect": "Seleccionar idioma",
      "ui.goHome": "Ir a inicio",
      "ui.toggleTheme": "Cambiar tema claro/oscuro",
    },

    EN: {
      // NAV
      "nav.home": "Home",
      "nav.press": "Press",
      "nav.services": "Services",
      "nav.news": "News",
      "nav.training": "Training Center",
      "nav.about": "About",

      // HEADER CTA
      "header.collaborator": "Are you a collaborator?",

      // HERO
      "hero.pill": "Integrated business solutions",
      "hero.title": "We empower<br /><span class='hero-accent'>your talent</span>",
      "hero.subtitle":
        "Human Capital, Organizational Development and Management<br />Services for every growth stage.",
      "hero.ctaServices": "View Services",
      "hero.ctaContact": "Contact",

      // Toast
      "toast.title": "Certified",
      "toast.sub": "REPSE · ISO · NOM",

      // KPIs
      "kpi.years": "Years of experience",
      "kpi.clients": "Clients",
      "kpi.satisfaction": "Satisfaction",

      // SERVICES section
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

      // PRESS
      "press.kicker": "Press room",
      "press.title": "Press <span class='accent'>Releases</span>",
      "press.subtitle": "Stay informed about the latest BAUSEN news and announcements",
      "press.cta": "View all releases",

      // TRAINING
      "training.kicker": "Talent development",
      "training.subtitle":
        "We train and connect future talent with the best<br />opportunities",
      "training.leftTitle": "Internship Program",
      "training.tab.events": "Events",
      "training.tab.webinars": "Institutional Webinars",
      "training.tab.interns": "Internship Program",
      "training.panel.events.text": "Active participation in events with schools and universities",
      "training.panel.webinars.text": "Specialized training and webinars with educational institutions",
      "training.panel.interns.text": "Comprehensive program for training and developing young talent",
      "training.more": "Learn more",
      "training.dot.events": "Go to Events",
      "training.dot.webinars": "Go to Institutional Webinars",
      "training.dot.interns": "Go to Internship Program",

      // NEWS
      "news.kicker": "Blog & news",
      "news.title": "Latest <span class='accent'>News</span>",
      "news.subtitle": "Discover articles, success stories and industry trends",
      "news.cta": "View all news",

      // CONNECT
      "connect.kicker": "Connect with us",
      "connect.title": "Together we shape<br /><span class='connect-accent'>your path to success</span>",
      "connect.text":
        "Ready to take your business to the next level? Schedule a<br />meeting with our specialists and discover how we can<br />help you.",
      "connect.cta": "Schedule now!",
      "connect.follow": "Follow us on social!",

      // AWARDS
      "awards.kicker": "Recognized excellence",
      "awards.title": "Our <span class='accent'>Recognitions</span>",
      "awards.subtitle": "Certifications and partnerships that back our commitment to excellence",

      // Awards cards (carousel)
      "awards.card1.kicker": "Recognition 01",
      "awards.card1.title": "Human Resources Council",
      "awards.card2.kicker": "Recognition 02",
      "awards.card2.title": "Humanitarian Companies Distinction",
      "awards.card3.kicker": "Recognition 03",
      "awards.card3.title": "Decent Work Certification",
      "awards.card4.kicker": "Recognition 04",
      "awards.card4.title": "Professional Specialists Registry",
      "awards.card5.kicker": "Recognition 05",
      "awards.card5.title": "Human Resources Council",
      "awards.card6.kicker": "Recognition 06",
      "awards.card6.title": "ISO Certification",
      "awards.card7.kicker": "Recognition 07",
      "awards.card7.title": "NOM Compliance",
      "awards.card8.kicker": "Recognition 08",
      "awards.card8.title": "REPSE Registry",

      // CONTACT section
      "contact.kicker": "Ready to connect?",
      "contact.title": "Let’s talk about <span class='contact-accent'>your project</span>",
      "contact.subtitle":
        "Tell us your ideas, needs or questions and our team will contact you<br />shortly. We’re here to help you transform your operations!",
      "contact.formTitle": "Send us a message",
      "contact.formSubtitle": "Fill out the form and we’ll contact you soon.",

      // Contact info block
      "contact.infoTitle": "Contact Information",
      "contact.phoneLabel": "Phone",
      "contact.emailLabel": "Email",
      "contact.locationLabel": "Location",
      "contact.locationValue": "Querétaro, Mexico",
      "contact.hoursLabel": "Hours",
      "contact.hoursValue": "Mon - Fri: 9:00 - 18:00",
      "contact.follow": "Follow us on social",

      // FORM
      "form.fullNamePh": "Full name",
      "form.emailPh": "you@email.com",
      "form.messagePh": "How can we help you?",
      "form.send": "Send message",

      "form.err.required": "Please complete your name, email and message.",
      "form.err.email": "Please enter a valid email.",
      "form.ok": "Message sent. We’ll contact you shortly.",
      "form.sending": "Sending…",
      "form.fail": "Something went wrong. Please try again.",

      // MAP
      "map.kicker": "OUR LOCATIONS",

      // FOOTER headings
      "footer.company": "COMPANY",
      "footer.services": "SERVICES",

      // FOOTER company links
      "footer.link.about": "About",
      "footer.link.services": "Services",
      "footer.link.news": "News",
      "footer.link.press": "Press",
      "footer.link.contact": "Contact",

      // FOOTER services links
      "footer.svc.capital": "Human Capital",
      "footer.svc.legal": "Legal Services",
      "footer.svc.accounting": "Accounting Services",
      "footer.svc.orgdev": "Organizational Development",

      // UI
      "ui.openMenu": "Open menu",
      "ui.closeMenu": "Close menu",
      "ui.retry": "Retry",
      "ui.searching": "Searching…",
      "ui.noBranches": "No active branches found",
      "ui.scrollNext": "Scroll to next section",
      "ui.langSelect": "Select language",
      "ui.goHome": "Go to home",
      "ui.toggleTheme": "Toggle light/dark theme",
    },
  };

  // Banderas SVG (conservar todas)
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

  // Solo ES/EN traducen. Otros => fallback a ES, pero se conservan en UI.
  const normalizeLang = (lang) => {
    const L = String(lang || "ES").toUpperCase();
    return L === "EN" ? "EN" : L; // DE/PT/FR/IT se quedan como valor, traducción => ES
  };

  const t = (lang, key) => {
    const L = normalizeLang(lang);
    const dict = I18N[L] || I18N.ES;
    return dict[key] ?? (I18N.ES[key] ?? key);
  };

  const setTextOrHTML = (el, value) => {
    if (!el) return;
    if (/<[a-z][\s\S]*>/i.test(value)) el.innerHTML = value;
    else el.textContent = value;
  };

  // ✅ i18n por selectores (para texto que NO tiene data-i18n)
  const I18N_BY_SELECTOR = {
    ES: {
      // ARIA / UI
      ".logo-link[aria-label]": { attr: "aria-label", key: "ui.goHome" },
      "#theme-toggle[aria-label]": { attr: "aria-label", key: "ui.toggleTheme" },
      "#menu-toggle[aria-label]": { attr: "aria-label", key: "ui.openMenu" },
      "#close-menu[aria-label]": { attr: "aria-label", key: "ui.closeMenu" },
      ".scroll-indicator[aria-label]": { attr: "aria-label", key: "ui.scrollNext" },
      "#language-btn[aria-label]": { attr: "aria-label", key: "ui.langSelect" },

      // HEADER CTA
      ".header-controls a[href='acceso.html']": { text: "header.collaborator" },

      // CONTACT INFO title/labels
      "#contacto .contact-info-title": { text: "contact.infoTitle" },
      "#contacto .contact-info-list .contact-info-item:nth-child(1) .contact-info-label": { text: "contact.phoneLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(2) .contact-info-label": { text: "contact.emailLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(3) .contact-info-label": { text: "contact.locationLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(3) .contact-info-value": { text: "contact.locationValue" },
      "#contacto .contact-info-list .contact-info-item:nth-child(4) .contact-info-label": { text: "contact.hoursLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(4) .contact-info-value": { text: "contact.hoursValue" },
      "#contacto .contact-social-title": { text: "contact.follow" },

      // FOOTER headings
      "nav[aria-label='Empresa'] h4": { text: "footer.company" },
      "nav[aria-label='Servicios'] h4": { text: "footer.services" },

      // FOOTER: COMPANY links (por href)
      "nav[aria-label='Empresa'] a[href='acercade.html']": { text: "footer.link.about" },
      "nav[aria-label='Empresa'] a[href='acerca.html']": { text: "footer.link.about" }, // por si existe
      "nav[aria-label='Empresa'] a[href='servicios.html']": { text: "footer.link.services" },
      "nav[aria-label='Empresa'] a[href='noticias.html']": { text: "footer.link.news" },
      "nav[aria-label='Empresa'] a[href='prensa.html']": { text: "footer.link.press" },
      "nav[aria-label='Empresa'] a[href='contacto.html']": { text: "footer.link.contact" },

      // FOOTER: SERVICES links (por href + anchors)
      "nav[aria-label='Servicios'] a[href='servicios.html#capital-humano']": { text: "footer.svc.capital" },
      "nav[aria-label='Servicios'] a[href='servicios.html#servicios-legales']": { text: "footer.svc.legal" },
      "nav[aria-label='Servicios'] a[href='servicios.html#servicios-contables']": { text: "footer.svc.accounting" },
      "nav[aria-label='Servicios'] a[href='servicios.html#desarrollo-organizacional']": { text: "footer.svc.orgdev" },
    },

    EN: {
      // ARIA / UI
      ".logo-link[aria-label]": { attr: "aria-label", key: "ui.goHome" },
      "#theme-toggle[aria-label]": { attr: "aria-label", key: "ui.toggleTheme" },
      "#menu-toggle[aria-label]": { attr: "aria-label", key: "ui.openMenu" },
      "#close-menu[aria-label]": { attr: "aria-label", key: "ui.closeMenu" },
      ".scroll-indicator[aria-label]": { attr: "aria-label", key: "ui.scrollNext" },
      "#language-btn[aria-label]": { attr: "aria-label", key: "ui.langSelect" },

      // HEADER CTA
      ".header-controls a[href='acceso.html']": { text: "header.collaborator" },

      // CONTACT INFO title/labels
      "#contacto .contact-info-title": { text: "contact.infoTitle" },
      "#contacto .contact-info-list .contact-info-item:nth-child(1) .contact-info-label": { text: "contact.phoneLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(2) .contact-info-label": { text: "contact.emailLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(3) .contact-info-label": { text: "contact.locationLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(3) .contact-info-value": { text: "contact.locationValue" },
      "#contacto .contact-info-list .contact-info-item:nth-child(4) .contact-info-label": { text: "contact.hoursLabel" },
      "#contacto .contact-info-list .contact-info-item:nth-child(4) .contact-info-value": { text: "contact.hoursValue" },
      "#contacto .contact-social-title": { text: "contact.follow" },

      // FOOTER headings
      "nav[aria-label='Empresa'] h4": { text: "footer.company" },
      "nav[aria-label='Servicios'] h4": { text: "footer.services" },

      // FOOTER: COMPANY links (por href)
      "nav[aria-label='Empresa'] a[href='acercade.html']": { text: "footer.link.about" },
      "nav[aria-label='Empresa'] a[href='acerca.html']": { text: "footer.link.about" }, // por si existe
      "nav[aria-label='Empresa'] a[href='servicios.html']": { text: "footer.link.services" },
      "nav[aria-label='Empresa'] a[href='noticias.html']": { text: "footer.link.news" },
      "nav[aria-label='Empresa'] a[href='prensa.html']": { text: "footer.link.press" },
      "nav[aria-label='Empresa'] a[href='contacto.html']": { text: "footer.link.contact" },

      // FOOTER: SERVICES links (por href + anchors)
      "nav[aria-label='Servicios'] a[href='servicios.html#capital-humano']": { text: "footer.svc.capital" },
      "nav[aria-label='Servicios'] a[href='servicios.html#servicios-legales']": { text: "footer.svc.legal" },
      "nav[aria-label='Servicios'] a[href='servicios.html#servicios-contables']": { text: "footer.svc.accounting" },
      "nav[aria-label='Servicios'] a[href='servicios.html#desarrollo-organizacional']": { text: "footer.svc.orgdev" },
    },
  };

  function applySelectorTranslations(lang) {
    const L = normalizeLang(lang);
    const map = I18N_BY_SELECTOR[L] || I18N_BY_SELECTOR.ES;

    Object.entries(map).forEach(([selector, rule]) => {
      const els = $$(selector);
      if (!els.length) return;

      els.forEach((el) => {
        if (!el) return;

        if (rule.attr) {
          const value = t(L, rule.key);
          el.setAttribute(rule.attr, value);
          return;
        }
        if (rule.text) {
          const value = t(L, rule.text);
          setTextOrHTML(el, value);
          return;
        }
      });
    });
  }

  function applyTranslations(lang) {
    const L = normalizeLang(lang);

    // data-i18n
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.innerHTML = t(L, key);
    });

    // placeholders
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", t(L, key));
    });

    // bandera principal
    const flagEl = $("#language-flag");
    if (flagEl) flagEl.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;

    // banderas dropdown (todas)
    $$("[data-flag]").forEach((el) => {
      const code = (el.getAttribute("data-flag") || "ES").toUpperCase();
      el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
    });

    // lang attr del documento
    document.documentElement.setAttribute("lang", L === "EN" ? "en" : "es");

    // traducciones por selectores (footer + extras)
    applySelectorTranslations(L);
  }

  /* =========================
     Elements
  ========================= */
  const pageLoader = $("#page-loader");
  const themeToggle = $("#theme-toggle");

  const languageBtn = $("#language-btn");
  const languageDropdown = $("#language-dropdown");
  const languageOptions = $$(".language-option");
  const languageCode = $("#language-code");
  const mobileLanguageSelect = $("#mobile-language-select");

  const mainNavLinks = $$(".nav-link, .mobile-nav-link");
  const currentYear = $("#current-year");

  const cursorDot = $("#cursor-dot");
  const cursorRing = $("#cursor-ring");

  const hero = $("#hero");
  const mediaCard = $("#media-card");
  const orb1 = $(".hero-orb-1");
  const orb2 = $(".hero-orb-2");
  const orb3 = $(".hero-orb-3");

  const scrollIndicator = $(".scroll-indicator");

  const trainingRoot = $("#training");
  const trainingTabs = trainingRoot ? $$(".training-tab", trainingRoot) : [];
  const trainingPanels = trainingRoot ? $$(".training-panel", trainingRoot) : [];

  const awardsRoot = $("#awards");
  const awardsTrack = awardsRoot ? $(".awards-track", awardsRoot) : null;
  const awardCards = awardsTrack ? $$(".award-card", awardsTrack) : [];
  const awardIndicators = awardsRoot ? $$(".award-indicator", awardsRoot) : [];

  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");
  const mapRetryBtn = $("#mapRetryBtn") || $(".contact-map-retry");

  /* =========================
     Loader
  ========================= */
  function initLoader() {
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
     Theme (persist)
  ========================= */
  function initTheme() {
    const KEY = "theme";

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
     Language (persist + i18n)
  ========================= */
  function initLanguage() {
    const KEY = "preferred-language";

    const setLang = (lang) => {
      const safe = String(lang || "ES").toUpperCase();
      storage.set(KEY, safe);

      if (languageCode) languageCode.textContent = safe;
      if (mobileLanguageSelect) mobileLanguageSelect.value = safe;

      applyTranslations(safe);
    };

    setLang(storage.get(KEY, "ES"));

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
        languageBtn.getAttribute("aria-expanded") === "true" ? close() : open();
      });

      languageOptions.forEach((opt) => {
        opt.addEventListener("click", () => {
          const lang = opt.getAttribute("data-lang") || "ES";
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

    if (mobileLanguageSelect) {
      mobileLanguageSelect.addEventListener("change", (e) => setLang(e.target.value));
    }
  }

  /* =========================
     Mobile menu (robusto)
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

    const bodyEl = document.body;
    const rootEl = document.documentElement;

    const setLocked = (locked) => {
      rootEl.style.overflow = locked ? "hidden" : "";
      bodyEl.style.overflow = locked ? "hidden" : "";
      bodyEl.classList.toggle("menu-open", locked);
    };

    const openMenu = () => {
      panel.classList.add("open");
      overlay.classList.add("show");
      toggleBtn.setAttribute("aria-expanded", "true");
      setLocked(true);
      window.setTimeout(() => {
        const firstLink = panel.querySelector("a[href], button");
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

    if (closeBtn) closeBtn.addEventListener("click", (e) => (e.preventDefault(), closeMenuFn()));
    overlay.addEventListener("click", closeMenuFn);

    panel.querySelectorAll("a, .mobile-nav-link").forEach((el) => el.addEventListener("click", closeMenuFn));

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
     Awards carousel (mantener)
  ========================= */
  function initAwardsCarousel() {
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
     Map retry (UI)
  ========================= */
  function initMapRetry() {
    if (!mapRetryBtn) return;

    mapRetryBtn.addEventListener("click", () => {
      const btn = mapRetryBtn;
      if (btn.classList.contains("is-loading")) return;

      btn.classList.add("is-loading");
      btn.disabled = true;

      const title = document.querySelector(".contact-map-alert-title");

      const lang = storage.get("preferred-language", "ES");
      const searchingMsg = t(lang, "ui.searching");
      const defaultMsg = t(lang, "ui.noBranches");

      if (title) title.textContent = searchingMsg;

      setTimeout(() => {
        if (title) title.textContent = defaultMsg;
        btn.classList.remove("is-loading");
        btn.disabled = false;
      }, 1100);
    });
  }

  /* =========================
     Contact form (Netlify + AJAX)
     ✅ No rompe Netlify
  ========================= */
  function initContactForm() {
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

      const lang = storage.get("preferred-language", "ES");

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
        const action = contactForm.getAttribute("action") || "/";

        const res = await fetch(action, {
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
  initAwardsCarousel();
  initMapRetry();
  initContactForm();
});
