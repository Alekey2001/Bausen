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

  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const mobileMenu = $("#mobileMenu");
  const mobileOverlay = $("#mobileOverlay");

  const themeToggle = $("#themeToggle");
  const mobileTheme = $("#mobileTheme");

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

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

      // Service lines (Services page)
      "lines.title": "Our Service Lines",
      "lines.subtitle": "Specialized solutions designed for your business needs.",
      "lines.includedTag": "Included services",

      "lines.card1.desc": "We boost growth and success through comprehensive talent management solutions.",
      "lines.card1.item1": "Specialized Services",
      "lines.card1.item2": "Payrolling",
      "lines.card1.item3": "Talent Acquisition",

      "lines.card2.title": "Organizational Development",
      "lines.card2.desc": "Strategies and methodologies to transform your company from within.",
      "lines.card2.item1": "Business Training",
      "lines.card2.item2": "Organizational Consulting",
      "lines.card2.item3": "NOM-035",

      "lines.card3.title": "Management Services",
      "lines.card3.desc": "Administrative and operational services for end-to-end management.",
      "lines.card3.item1": "Accounting Services",
      "lines.card3.item2": "Legal Services",
      "lines.card3.item3": "SME Services",

      // CTA
      "cta.contact": "Contact us",
      "cta.learnMore": "Learn more",

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
      "cta.title": "Ready to boost your business?",
"cta.text": "Our team of experts is ready to help you find the perfect solution for your needs.",

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
    const menuToggle = $("#menuToggle");
    if (menuToggle) menuToggle.setAttribute("aria-label", t(L, "ui.openMenu"));
    const closeMenu = $("#menuClose");
    if (closeMenu) closeMenu.setAttribute("aria-label", t(L, "ui.closeMenu"));
    const themeToggle = $("#themeToggle");
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

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  const savedTheme = localStorage.getItem("bausen_theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
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
