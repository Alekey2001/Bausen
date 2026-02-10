/* scripbeca.js — BAUSEN (i18n + Netlify Forms)
   ✅ Mantiene:
   - Netlify Forms (name/form-name/honeypot/POST) sin romper lógica
   - Menú, tema, loader, tabs, carrusel, etc.
   ✅ i18n:
   - Traducción completa ES y EN
   - Idiomas extra (DE/PT/FR/IT) se conservan en UI y hacen fallback a ES
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
     i18n dictionaries
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

      // Services section
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

      // Press section
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

      // News section
      "news.kicker": "Blog y noticias",
      "news.title": "Últimas <span class='accent'>Noticias</span>",
      "news.subtitle": "Descubre artículos, casos de éxito y tendencias del sector",
      "news.cta": "Ver todas las noticias",

      // Connect section
      "connect.kicker": "Conecta con nosotros",
      "connect.title": "Juntos trazamos<br /><span class='connect-accent'>tu camino al éxito</span>",
      "connect.text":
        "¿Listo para llevar tu negocio al siguiente nivel? Agenda una<br />reunión con nuestros especialistas y descubre cómo podemos<br />ayudarte.",
      "connect.cta": "¡Agenda ahora!",
      "connect.follow": "¡Síguenos en redes!",

      // Awards section
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

      // Contact section
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
      "map.kicker": "NUESTRAS UBICACIONES",

      // Footer (company/services)
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
      "ui.retry": "Reintentar",
      "ui.searching": "Buscando…",
      "ui.noBranches": "No se encontraron sucursales activas",
      "ui.scrollNext": "Bajar a la siguiente sección",
      "ui.langSelect": "Seleccionar idioma",
      "ui.goHome": "Ir a inicio",
      "ui.toggleTheme": "Cambiar tema claro/oscuro",
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

      // Services section
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

      // Press section
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

      // News section
      "news.kicker": "Blog & news",
      "news.title": "Latest <span class='accent'>News</span>",
      "news.subtitle": "Discover articles, success stories and industry trends",
      "news.cta": "View all news",

      // Connect section
      "connect.kicker": "Connect with us",
      "connect.title": "Together we shape<br /><span class='connect-accent'>your path to success</span>",
      "connect.text":
        "Ready to take your business to the next level? Schedule a<br />meeting with our specialists and discover how we can<br />help you.",
      "connect.cta": "Schedule now!",
      "connect.follow": "Follow us on social!",

      // Awards section
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

      // Contact section
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
      "map.kicker": "OUR LOCATIONS",

      // Footer (company/services)
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
      "ui.retry": "Retry",
      "ui.searching": "Searching…",
      "ui.noBranches": "No active branches found",
      "ui.scrollNext": "Scroll to next section",
      "ui.langSelect": "Select language",
      "ui.goHome": "Go to home",
      "ui.toggleTheme": "Toggle light/dark theme",
    },
  };

  // Flags (keep all)
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

  // ES/EN are real; other codes stay in UI but fallback to ES content
  const normalizeLang = (lang) => {
    const L = String(lang || "ES").toUpperCase();
    return L; // keep raw code (ES/EN/DE/PT/FR/IT) for UI
  };

  const t = (lang, key) => {
    const L = normalizeLang(lang);
    const dict = I18N[L] || I18N.ES; // fallback to ES
    return dict[key] ?? (I18N.ES[key] ?? key);
  };

  const setTextOrHTML = (el, value) => {
    if (!el) return;
    if (/<[a-z][\s\S]*>/i.test(value)) el.innerHTML = value;
    else el.textContent = value;
  };

  /* =========================
     Translator: robust mapping (no fragile text matching)
  ========================= */
  function applyWholePageTranslations(lang) {
    const L = normalizeLang(lang);

    // HTML lang attribute
    document.documentElement.setAttribute("lang", L === "EN" ? "en" : "es");

    // Header CTA
    const collabBtn = $(".header-controls a[href='acceso.html']");
    if (collabBtn) setTextOrHTML(collabBtn, t(L, "header.collab"));

    // Nav items (already have data-i18n in your HTML, but this ensures coverage)
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.innerHTML = t(L, key);
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(L, key));
    });

    // ARIA (menu/theme/lang/scroll/home)
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

    // Hero KPI labels
    const kpi1 = $(".hero-kpis .kpi:nth-child(1) .kpi-label");
    const kpi2 = $(".hero-kpis .kpi:nth-child(2) .kpi-label");
    const kpi3 = $(".hero-kpis .kpi:nth-child(3) .kpi-label");
    if (kpi1) setTextOrHTML(kpi1, t(L, "kpi.years"));
    if (kpi2) setTextOrHTML(kpi2, t(L, "kpi.clients"));
    if (kpi3) setTextOrHTML(kpi3, t(L, "kpi.sat"));

    // Toast in hero
    const toastTitle = $("#toast-card .toast-title");
    if (toastTitle) setTextOrHTML(toastTitle, t(L, "toast.title"));

    // Services section headings
    const services = $("#services");
    if (services) {
      const kicker = $(".section-head .section-pill", services);
      const title = $(".section-head .section-title", services);
      const sub = $(".section-head .section-subtitle", services);
      if (kicker) setTextOrHTML(kicker, t(L, "services.kicker"));
      if (title) setTextOrHTML(title, t(L, "services.title"));
      if (sub) setTextOrHTML(sub, t(L, "services.subtitle"));

      // service cards
      const cards = $$(".services-grid .service-card", services);
      if (cards[0]) {
        const h3 = $(".service-title", cards[0]);
        const p = $(".service-text", cards[0]);
        const a = $(".service-link", cards[0]);
        if (h3) setTextOrHTML(h3, t(L, "services.card1.title"));
        if (p) setTextOrHTML(p, t(L, "services.card1.text"));
        if (a) a.innerHTML = `${t(L, "services.more")} <i class="fas fa-arrow-right"></i>`;
      }
      if (cards[1]) {
        const h3 = $(".service-title", cards[1]);
        const p = $(".service-text", cards[1]);
        const a = $(".service-link", cards[1]);
        if (h3) setTextOrHTML(h3, t(L, "services.card2.title"));
        if (p) setTextOrHTML(p, t(L, "services.card2.text"));
        if (a) a.innerHTML = `${t(L, "services.more")} <i class="fas fa-arrow-right"></i>`;
      }
      if (cards[2]) {
        const h3 = $(".service-title", cards[2]);
        const p = $(".service-text", cards[2]);
        const a = $(".service-link", cards[2]);
        if (h3) setTextOrHTML(h3, t(L, "services.card3.title"));
        if (p) setTextOrHTML(p, t(L, "services.card3.text"));
        if (a) a.innerHTML = `${t(L, "services.more")} <i class="fas fa-arrow-right"></i>`;
      }
    }

    // Press section
    const press = $("#press");
    if (press) {
      const kicker = $(".section-pill span", press) || $(".section-pill", press);
      const title = $(".section-title", press);
      const sub = $(".section-subtitle", press);
      const cta = $(".btn.btn-primary span", press);
      if (kicker) setTextOrHTML(kicker, t(L, "press.kicker"));
      if (title) setTextOrHTML(title, t(L, "press.title"));
      if (sub) setTextOrHTML(sub, t(L, "press.subtitle"));
      if (cta) setTextOrHTML(cta, t(L, "press.cta"));
    }

    // Training section
    const training = $("#training");
    if (training) {
      const pillSpan = $(".training-pill span", training);
      const title = $(".training-title", training);
      const sub = $(".training-subtitle", training);
      if (pillSpan) setTextOrHTML(pillSpan, t(L, "training.kicker"));
      if (title) setTextOrHTML(title, t(L, "training.title"));
      if (sub) setTextOrHTML(sub, t(L, "training.subtitle"));

      const tabEvents = $("#tab-eventos span");
      const tabWeb = $("#tab-webinars span");
      const tabBec = $("#tab-becarios span");
      if (tabEvents) setTextOrHTML(tabEvents, t(L, "training.tab.events"));
      if (tabWeb) setTextOrHTML(tabWeb, t(L, "training.tab.webinars"));
      if (tabBec) setTextOrHTML(tabBec, t(L, "training.tab.interns"));

      const panelEventsTitle = $("#panel-eventos .training-panel-title");
      const panelEventsText = $("#panel-eventos .training-panel-text");
      const panelWebTitle = $("#panel-webinars .training-panel-title");
      const panelWebText = $("#panel-webinars .training-panel-text");
      const panelBecTitle = $("#panel-becarios .training-panel-title");
      const panelBecText = $("#panel-becarios .training-panel-text");

      if (panelEventsTitle) setTextOrHTML(panelEventsTitle, t(L, "training.panel.events.title"));
      if (panelEventsText) setTextOrHTML(panelEventsText, t(L, "training.panel.events.text"));
      if (panelWebTitle) setTextOrHTML(panelWebTitle, t(L, "training.panel.webinars.title"));
      if (panelWebText) setTextOrHTML(panelWebText, t(L, "training.panel.webinars.text"));
      if (panelBecTitle) setTextOrHTML(panelBecTitle, t(L, "training.panel.interns.title"));
      if (panelBecText) setTextOrHTML(panelBecText, t(L, "training.panel.interns.text"));

      $$("#panel-eventos a.btn span, #panel-webinars a.btn span, #panel-becarios a.btn span").forEach((s) => {
        setTextOrHTML(s, t(L, "training.more"));
      });

      // Left card title (dynamic via initTrainingTabs too)
      const leftTitle = $(".training-image-title", training);
      if (leftTitle) {
        const activeKey =
          $("#tab-eventos")?.classList.contains("is-active") ? "events" :
          $("#tab-webinars")?.classList.contains("is-active") ? "webinars" : "interns";
        const map = {
          events: "training.leftTitle.events",
          webinars: "training.leftTitle.webinars",
          interns: "training.leftTitle.interns",
        };
        setTextOrHTML(leftTitle, t(L, map[activeKey] || "training.leftTitle.interns"));
      }
    }

    // News section
    const news = $("#news");
    if (news) {
      const pillSpan = $(".section-pill span", news) || $(".section-pill", news);
      const title = $(".section-title", news);
      const sub = $(".section-subtitle", news);
      const cta = $(".btn.btn-primary span", news);
      if (pillSpan) setTextOrHTML(pillSpan, t(L, "news.kicker"));
      if (title) setTextOrHTML(title, t(L, "news.title"));
      if (sub) setTextOrHTML(sub, t(L, "news.subtitle"));
      if (cta) setTextOrHTML(cta, t(L, "news.cta"));
    }

    // Connect section
    const connect = $("#connect");
    if (connect) {
      const pillSpan = $(".connect-pill span", connect);
      const title = $(".connect-title", connect);
      const text = $(".connect-text", connect);
      const ctaSpan = $(".btn.btn-primary span", connect);
      const follow = $(".connect-right-title", connect);
      if (pillSpan) setTextOrHTML(pillSpan, t(L, "connect.kicker"));
      if (title) setTextOrHTML(title, t(L, "connect.title"));
      if (text) setTextOrHTML(text, t(L, "connect.text"));
      if (ctaSpan) setTextOrHTML(ctaSpan, t(L, "connect.cta"));
      if (follow) setTextOrHTML(follow, t(L, "connect.follow"));
    }

    // Awards section + cards content
    const awards = $("#awards");
    if (awards) {
      const pillSpan = $(".section-pill span", awards) || $(".section-pill", awards);
      const title = $(".section-title", awards);
      const sub = $(".section-subtitle", awards);
      if (pillSpan) setTextOrHTML(pillSpan, t(L, "awards.kicker"));
      if (title) setTextOrHTML(title, t(L, "awards.title"));
      if (sub) setTextOrHTML(sub, t(L, "awards.subtitle"));

      const cards = $$("#awardsTrack .award-card");
      const map = [
        ["awards.card1.k", "awards.card1.t"],
        ["awards.card2.k", "awards.card2.t"],
        ["awards.card3.k", "awards.card3.t"],
        ["awards.card4.k", "awards.card4.t"],
        ["awards.card5.k", "awards.card5.t"],
        ["awards.card6.k", "awards.card6.t"],
        ["awards.card7.k", "awards.card7.t"],
        ["awards.card8.k", "awards.card8.t"],
      ];
      cards.forEach((card, idx) => {
        const k = $(".award-kicker", card);
        const h = $(".award-title", card);
        const keys = map[idx];
        if (!keys) return;
        if (k) setTextOrHTML(k, t(L, keys[0]));
        if (h) setTextOrHTML(h, t(L, keys[1]));
      });
    }

    // Contact section headings + info labels
    const contact = $("#contacto");
    if (contact) {
      const pillSpan = $(".contact-pill span", contact);
      const title = $(".contact-title", contact);
      const sub = $(".contact-subtitle", contact);
      const formTitle = $(".contact-form-title", contact);
      const formSub = $(".contact-form-subtitle", contact);
      if (pillSpan) setTextOrHTML(pillSpan, t(L, "contact.kicker"));
      if (title) setTextOrHTML(title, t(L, "contact.title"));
      if (sub) setTextOrHTML(sub, t(L, "contact.subtitle"));
      if (formTitle) setTextOrHTML(formTitle, t(L, "contact.formTitle"));
      if (formSub) setTextOrHTML(formSub, t(L, "contact.formSubtitle"));

      const infoTitle = $(".contact-info-title", contact);
      if (infoTitle) setTextOrHTML(infoTitle, t(L, "contact.infoTitle"));

      const phoneLabel = $(".contact-info-item:nth-child(1) .contact-info-label", contact);
      const emailLabel = $(".contact-info-item:nth-child(2) .contact-info-label", contact);
      const locLabel = $(".contact-info-item:nth-child(3) .contact-info-label", contact);
      const locValue = $(".contact-info-item:nth-child(3) .contact-info-value", contact);
      const hoursLabel = $(".contact-info-item:nth-child(4) .contact-info-label", contact);
      const hoursValue = $(".contact-info-item:nth-child(4) .contact-info-value", contact);

      if (phoneLabel) setTextOrHTML(phoneLabel, t(L, "contact.phone"));
      if (emailLabel) setTextOrHTML(emailLabel, t(L, "contact.email"));
      if (locLabel) setTextOrHTML(locLabel, t(L, "contact.location"));
      if (locValue) setTextOrHTML(locValue, t(L, "contact.locationValue"));
      if (hoursLabel) setTextOrHTML(hoursLabel, t(L, "contact.hours"));
      if (hoursValue) setTextOrHTML(hoursValue, t(L, "contact.hoursValue"));

      const follow = $(".contact-social-title", contact);
      if (follow) setTextOrHTML(follow, t(L, "contact.follow"));

      const mapKicker = $(".contact-map-kicker", contact);
      if (mapKicker) setTextOrHTML(mapKicker, t(L, "map.kicker"));
    }

    // Footer headings + link texts
    const footerCompanyH4 = $("nav[aria-label='Empresa'] h4");
    const footerServicesH4 = $("nav[aria-label='Servicios'] h4");
    if (footerCompanyH4) setTextOrHTML(footerCompanyH4, t(L, "footer.company"));
    if (footerServicesH4) setTextOrHTML(footerServicesH4, t(L, "footer.services"));

    // Footer links (by href to avoid breaking structure)
    const setFooterLink = (href, key) => {
      const a = $(`nav[aria-label='Empresa'] a[href='${href}']`) || $(`nav[aria-label='Servicios'] a[href='${href}']`);
      if (a) setTextOrHTML(a, t(L, key));
    };

    // Company links
    setFooterLink("acercade.html", "footer.about");
    setFooterLink("acerca.html", "footer.about"); // if exists
    setFooterLink("servicios.html", "footer.servicesLink");
    setFooterLink("noticias.html", "footer.news");
    setFooterLink("prensa.html", "footer.press");
    setFooterLink("contacto.html", "footer.contact");

    // Services links (anchors)
    setFooterLink("servicios.html#capital-humano", "footer.svc.capital");
    setFooterLink("servicios.html#servicios-legales", "footer.svc.legal");
    setFooterLink("servicios.html#servicios-contables", "footer.svc.accounting");
    setFooterLink("servicios.html#desarrollo-organizacional", "footer.svc.orgdev");
  }

  /* =========================
     Language UI + persist
  ========================= */
  function initLanguage() {
    const KEY = "preferred-language";

    const languageBtn = $("#language-btn");
    const languageDropdown = $("#language-dropdown");
    const languageOptions = $$(".language-option");
    const languageCode = $("#language-code");
    const mobileLanguageSelect = $("#mobile-language-select");

    const setLang = (lang) => {
      const safe = String(lang || "ES").toUpperCase();
      storage.set(KEY, safe);

      if (languageCode) languageCode.textContent = safe;
      if (mobileLanguageSelect) mobileLanguageSelect.value = safe;

      // main flag
      const flagEl = $("#language-flag");
      if (flagEl) flagEl.innerHTML = FLAG_SVG[safe] || FLAG_SVG.ES;

      // dropdown flags
      $$("[data-flag]").forEach((el) => {
        const code = (el.getAttribute("data-flag") || "ES").toUpperCase();
        el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
      });

      // apply translations (ES/EN full; others fallback ES)
      try {
        applyWholePageTranslations(safe);
      } catch (e) {
        console.error("i18n apply error:", e);
      }
    };

    // init
    setLang(storage.get(KEY, "ES"));

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
     Training tabs (NO se rompe)
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

    const tabLabelFromKey = (key) => {
      const tab = trainingTabs.find((tEl) => (tEl.dataset.tab || "").toLowerCase() === key);
      return tab ? (tab.querySelector("span")?.textContent || "").trim() : "";
    };

    const setLeftTitle = () => {
      const leftTitle = $(".training-image-title", trainingRoot);
      const label = tabLabelFromKey(currentKey);
      if (leftTitle && label) leftTitle.textContent = label;
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

      // Re-apply translations for the left title (language may be EN)
      const lang = storage.get("preferred-language", "ES");
      try {
        applyWholePageTranslations(lang);
      } catch {}
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
     Map retry (UI)
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
      const lang = storage.get("preferred-language", "ES");

      if (title) title.textContent = t(lang, "ui.searching");

      setTimeout(() => {
        if (title) title.textContent = t(lang, "ui.noBranches");
        btn.classList.remove("is-loading");
        btn.disabled = false;
      }, 1100);
    });
  }

  /* =========================
     Contact form (Netlify + AJAX)
     ✅ No rompe Netlify (form-name, name="contact", honeypot)
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
  initTrainingTabs();
  initAwardsCarousel();
  initMapRetry();
  initContactForm();
});
