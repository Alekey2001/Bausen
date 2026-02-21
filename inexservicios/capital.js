/* =========================
   Capital Humano - JS (v8 Enhanced + i18n)
   - Mantiene tu UI/animaciones
   - Agrega selector de idioma con banderas + i18n real
========================= */

(() => {
  'use strict';

  // Helpers
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  // Remove no-js class
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // ======================
  // i18n (NEW)
  // ======================
  const storage = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
      } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, String(val)); } catch {}
    }
  };

  const LANG_KEY = 'bausen_lang';

  const normalizeLang = (lang) => {
    const up = String(lang || '').trim().toUpperCase();
    if (['ES','EN','DE','PT','FR','IT'].includes(up)) return up;
    const low = String(lang || '').toLowerCase();
    if (low.startsWith('en')) return 'EN';
    if (low.startsWith('es')) return 'EN';
    if (low.startsWith('de')) return 'DE';
    if (low.startsWith('pt')) return 'PT';
    if (low.startsWith('fr')) return 'FR';
    if (low.startsWith('it')) return 'IT';
    return 'ES';
  };

  let currentLang = normalizeLang(storage.get(LANG_KEY) || storage.get('preferred-language') || 'EN');

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

  // ES y EN completos para TODO lo que marcamos en el HTML.
  // Los demás idiomas por ahora heredan EN (puedes traducirlos después sin tocar lógica).
  const I18N = {
    ES: {
      "head.title": " Procesamiento de nomina| Bausen",

      "ui.skip": "Saltar al contenido",
      "ui.menu": "Menú",
      "ui.langSelect": "Seleccionar idioma",
      "ui.seeMore": "Ver más <svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M5 12h13' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M13 6l6 6-6 6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",

      "nav.home": "inicio",
      "nav.capital": "Servicios",
      "nav.specialized": "Centro de formación",
      "nav.tax": "Noticias",
      "nav.about": "Acerca de",

      "header.collab": "¿Eres colaborador?",

      "hero.back": "Volver a Servicios",
      "hero.badge": "Servicio Premium",
      "hero.title": "<span class='grad'> Procesamiento</span>de nomina",
      "hero.subtitle": "Potencia el crecimiento y éxito de tu empresa con nuestros<br />servicios de  Procesamiento de nomina. ¡Transforma tu empresa con<br />nuestro enfoque estratégico!",
      "hero.cta": "Contactar a BAUSEN <svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M5 12h13' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M13 6l6 6-6 6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",

      "services.title": "<span>Servicios</span> <span class='grad2'>Procesamiento de nomina</span>",
      "services.card1.title": "Servicios Especializados",
      "services.card1.body": "Avalados por la STPS y registrados en el<br />REPSE, garantizando transparencia y<br />cumplimiento legal.",
      "services.card2.title": "Payrolling",
      "services.card2.body": "Desde el alta hasta la desvinculación,<br />incluyendo pagos de cuotas patronales, IMSS,<br />Infonavit, e impuestos.",
      "services.card3.title": "Atracción de Talento",
      "services.card3.body": "Utilizamos estrategias selectivas y entrevistas<br />exhaustivas para presentarte a los candidatos<br />correctos.",

      "benefits.badge": "Beneficios Exclusivos",
      "benefits.title": "Beneficios de <span class='grad'> Procesamiento</span><br /><span class='grad'>de nómina</span>",
      "benefits.item1.title": "Acceso Exclusivo BTC",
      "benefits.item1.body": "Accede a nuestra agenda de cursos gratuitos, avalados por el Colegio de Contadores Públicos de la Ciudad de México.",
      "benefits.item2.title": "Reducción de Costos",
      "benefits.item2.body": "Optimiza los procesos de reclutamiento, selección y gestión de nómina con nuestras soluciones integrales.",
      "benefits.item3.title": "Asesoramiento Personalizado",
      "benefits.item3.body": "Sesiones de asesoramiento personalizado con expertos en Capital Humano para tu empresa.",

      "cta.title": "Todos los servicios en un<br />solo lugar",
      "cta.body": "Solicita una reunión para más información sobre cómo podemos<br />ayudarte a optimizar tu gestión de  Procesamiento de nomina.",
      "cta.book": "<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M8 7V3m8 4V3' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M3 10h18' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z' stroke='currentColor' stroke-width='2' stroke-linejoin='round'/></svg> Agenda una cita",
      "cta.cases": "<i data-lucide='badge-plus' class='icon' aria-hidden='true'></i> Ver casos de éxito",
      "cta.stat": "Empresas",

      "contact.badge": "Contacto",
      "contact.title": "Contáctanos <span class='grad2'>Contáctanos</span>",
      "contact.sub": "Estamos listos para ayudarte a transformar tu empresa",
      "contact.directQ": "¿Prefieres contactarnos directamente?",
      "contact.directMail": "<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M4 6h16v12H4z' stroke='currentColor' stroke-width='2' /><path d='M4 8l8 6 8-6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg> contacto@bausen.com",

      "form.nameLabel": "Tu nombre completo",
      "form.emailLabel": "Tu email",
      "form.msgLabel": "Mensaje",
      "form.namePh": "Tu nombre completo",
      "form.emailPh": "tu@email.com",
      "form.msgPh": "¿En qué podemos ayudarte?",
      "form.sendBtn": "<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M22 2 11 13' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M22 2 15 22l-4-9-9-4 20-7Z' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg> Enviar mensaje",

      "footer.desc": "Tu aliado estratégico en soluciones empresariales integrales.<br />Transformamos organizaciones desde adentro.",
      "footer.hoursTitle": "Horario de atención",
      "footer.hoursSub": "Lunes - Viernes: 9:00 - 18:00",
      "footer.follow": "Síguenos en redes",

      "footer.company": "EMPRESA",
      "footer.services": "Servicios",
      "footer.news": "Noticias",
      "footer.press": "Prensa",
      "footer.contact": "Contacto",

      "footer.servicesUpper": "SERVICIOS",
      "footer.legalServices": "Servicios Legales",
      "footer.accountingServices": "Servicios Contables",
      "footer.orgDev": "Desarrollo Organizacional",

      "footer.contactUpper": "CONTACTO",
      "footer.soon": "Próximamente. No se encontraron sucursales activas.",
      "footer.phone": "Teléfono",
      "footer.email": "Email",
      "footer.maps": "Ver en Google Maps <svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M14 3h7v7' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M10 14 21 3' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>",

      "footer.copy": "© 2026 Bausen. Todos los derechos reservados",
      "footer.privacy": "Política de privacidad",
      "footer.terms": "Términos de servicio",
      "footer.cookies": "Política de cookies",

      // ARIA
      "aria.brandHome": "Bausen - Inicio",
      "aria.mainNav": "Navegación principal",
      "aria.mobileNav": "Navegación móvil",
      "aria.drawerMenu": "Menú",
      "aria.openMenu": "Abrir menú",
      "aria.closeMenu": "Cerrar menú",
      "aria.toggleTheme": "Cambiar tema",
      "aria.langSelect": "Seleccionar idioma",
      "aria.footer": "Pie de página",
      "aria.legal": "Legal",
      "aria.company": "Empresa",
      "aria.footerServices": "Servicios",
      "aria.hero": "Capital Humano",
      "aria.services": "Servicios Capital Humano",
      "aria.benefits": "Beneficios de Capital Humano",
      "aria.cta": "Todos los servicios en un solo lugar",
      "aria.contact": "Contacto",

      // ALT (solo si quieres cambiar alt por JS; aquí lo guardamos como texto)
      "alt.heroImg": "Equipo colaborando en oficina",
      "alt.benefitsImg": "Equipo en reunión",
      "alt.ctaImg": "Persona en llamada de negocio",
    },

    EN: {
      "head.title": "Human Capital | Bausen",

      "ui.skip": "Skip to content",
      "ui.menu": "Menu",
      "ui.langSelect": "Select language",
      "ui.seeMore": "See more <svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M5 12h13' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M13 6l6 6-6 6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",

      "nav.home": "Home",
      "nav.capital": "Payroll processing",
      "nav.specialized": "Specialized services",
      "nav.tax": "Tax services",
      "nav.about": "About",

      "header.collab": "Are you a collaborator?",

      "hero.back": "Back to Services",
      "hero.badge": "Premium Service",
      "hero.title": "<span class='grad'> Payroll </span>  processing",
      "hero.subtitle": "Boost your company’s growth and success with our<br />Payroll processing Transform your business with<br />our strategic approach!",
      "hero.cta": "Contact BAUSEN <svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M5 12h13' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M13 6l6 6-6 6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",

      "services.title": "<span> Payroll </span> <span class='grad2'>processing</span>",
      "services.card1.title": "Specialized Services",
      "services.card1.body": "STPS-certified and registered in<br />REPSE, ensuring transparency and<br />legal compliance.",
      "services.card2.title": "Payroll",
      "services.card2.body": "From onboarding to offboarding,<br />including employer contributions, IMSS,<br />Infonavit, and taxes.",
      "services.card3.title": "Talent Acquisition",
      "services.card3.body": "We use selective strategies and thorough<br />interviews to present the right candidates<br />for your needs.",

      "benefits.badge": "Exclusive Benefits",
      "benefits.title": "Benefits of <span class='grad'>Human</span><br /><span class='grad'>Capital</span>",
      "benefits.item1.title": "Exclusive BTC Access",
      "benefits.item1.body": "Access our schedule of free courses endorsed by the Public Accountants Association of Mexico City.",
      "benefits.item2.title": "Cost Reduction",
      "benefits.item2.body": "Optimize recruitment, selection, and payroll management processes with our integrated solutions.",
      "benefits.item3.title": "Personalized Advisory",
      "benefits.item3.body": "Personalized advisory sessions with Human Capital experts for your company.",

      "cta.title": "All services in<br />one place",
      "cta.body": "Request a meeting to learn how we can help<br />optimize your human capital management.",
      "cta.book": "<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M8 7V3m8 4V3' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M3 10h18' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z' stroke='currentColor' stroke-width='2' stroke-linejoin='round'/></svg> Book an appointment",
      "cta.cases": "<i data-lucide='badge-plus' class='icon' aria-hidden='true'></i> View success cases",
      "cta.stat": "Companies",

      "contact.badge": "Contact",
      "contact.title": "Contact us <span class='grad2'>Contact us</span>",
      "contact.sub": "We’re ready to help transform your company",
      "contact.directQ": "Prefer to contact us directly?",
      "contact.directMail": "<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M4 6h16v12H4z' stroke='currentColor' stroke-width='2' /><path d='M4 8l8 6 8-6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg> contacto@bausen.com",

      "form.nameLabel": "Full name",
      "form.emailLabel": "Email",
      "form.msgLabel": "Message",
      "form.namePh": "Your full name",
      "form.emailPh": "you@email.com",
      "form.msgPh": "How can we help you?",
      "form.sendBtn": "<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M22 2 11 13' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M22 2 15 22l-4-9-9-4 20-7Z' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg> Send message",

      "footer.desc": "Your strategic ally in integrated business solutions.<br />We transform organizations from within.",
      "footer.hoursTitle": "Business hours",
      "footer.hoursSub": "Mon - Fri: 9:00 - 18:00",
      "footer.follow": "Follow us",

      "footer.company": "COMPANY",
      "footer.services": "Services",
      "footer.news": "News",
      "footer.press": "Press",
      "footer.contact": "Contact",

      "footer.servicesUpper": "SERVICES",
      "footer.legalServices": "Legal services",
      "footer.accountingServices": "Accounting services",
      "footer.orgDev": "Organizational development",

      "footer.contactUpper": "CONTACT",
      "footer.soon": "Coming soon. No active branches found.",
      "footer.phone": "Phone",
      "footer.email": "Email",
      "footer.maps": "View on Google Maps <svg viewBox='0 0 24 24' fill='none' aria-hidden='true'><path d='M14 3h7v7' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M10 14 21 3' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>",

      "footer.copy": "© 2026 Bausen. All rights reserved",
      "footer.privacy": "Privacy policy",
      "footer.terms": "Terms of service",
      "footer.cookies": "Cookie policy",

      // ARIA
      "aria.brandHome": "Bausen - Home",
      "aria.mainNav": "Main navigation",
      "aria.mobileNav": "Mobile navigation",
      "aria.drawerMenu": "Menu",
      "aria.openMenu": "Open menu",
      "aria.closeMenu": "Close menu",
      "aria.toggleTheme": "Toggle theme",
      "aria.langSelect": "Select language",
      "aria.footer": "Footer",
      "aria.legal": "Legal",
      "aria.company": "Company",
      "aria.footerServices": "Services",
      "aria.hero": "Human Capital",
      "aria.services": "Human Capital Services",
      "aria.benefits": "Human Capital Benefits",
      "aria.cta": "All services in one place",
      "aria.contact": "Contact",

      "alt.heroImg": "Team collaborating in an office",
      "alt.benefitsImg": "Team meeting",
      "alt.ctaImg": "Person on a business call",
    }
  };

  // Herencia para DE/PT/FR/IT (por ahora toman EN)
  I18N.DE = I18N.EN;
  I18N.PT = I18N.EN;
  I18N.FR = I18N.EN;
  I18N.IT = I18N.EN;

  const t = (key) => {
    const L = normalizeLang(currentLang);
    const dict = I18N[L] || I18N.ES;
    return dict[key] ?? (I18N.ES[key] ?? key);
  };

  const applyTranslations = () => {
    const L = normalizeLang(currentLang);

    // lang html
    document.documentElement.setAttribute('lang', L === 'EN' ? 'en' : 'es');

    // title
    const titleEl = document.querySelector('title[data-i18n-text="head.title"]');
    if (titleEl) titleEl.textContent = t('head.title');

    // innerHTML
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.innerHTML = t(key);
    });

    // textContent
    $$('[data-i18n-text]').forEach(el => {
      const key = el.getAttribute('data-i18n-text');
      if (!key) return;
      el.textContent = t(key);
    });

    // placeholders
    $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      el.setAttribute('placeholder', t(key));
    });

    // ARIA
    $$('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (!key) return;
      el.setAttribute('aria-label', t(key));
    });

    // ALT via data-i18n-aria en imgs (lo dejaste como data-i18n-aria)
    $$('img[data-i18n-aria]').forEach(img => {
      const key = img.getAttribute('data-i18n-aria');
      if (!key) return;
      // si la key empieza con "alt." la usamos como alt
      if (key.startsWith('alt.')) img.setAttribute('alt', t(key));
    });

    // Bandera + código
    const languageCode = $('#language-code');
    const flagEl = $('#language-flag');
    const mobileSelect = $('#mobile-language-select');

    if (languageCode) languageCode.textContent = L;
    if (flagEl) flagEl.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;
    if (mobileSelect) mobileSelect.value = L;

    // Pintar banderas en el dropdown
    $$('[data-flag]').forEach(el => {
      const code = normalizeLang(el.getAttribute('data-flag') || 'ES');
      el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
    });

    // Re-crear icons de lucide si existen (por ejemplo en btn-ghost)
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  const setLang = (lang) => {
    currentLang = normalizeLang(lang);
    storage.set(LANG_KEY, currentLang);
    storage.set('preferred-language', currentLang);
    applyTranslations();
  };

  const initLanguageUI = () => {
    applyTranslations();

    // Dropdown desktop
    const languageBtn = $('#language-btn');
    const dropdown = $('#language-dropdown');
    const options = $$('.language-option');

    if (languageBtn && dropdown) {
      const open = () => {
        languageBtn.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('show');
      };
      const close = () => {
        languageBtn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('show');
      };

      languageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = languageBtn.getAttribute('aria-expanded') === 'true';
        expanded ? close() : open();
      });

      options.forEach(opt => {
        opt.addEventListener('click', () => {
          const lang = opt.getAttribute('data-lang') || 'EN';
          setLang(lang);
          close();
        });
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.classList.contains('show')) return;
        if (languageBtn.contains(e.target) || dropdown.contains(e.target)) return;
        close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    }

    // Select mobile
    const mobileSelect = $('#mobile-language-select');
    if (mobileSelect) {
      mobileSelect.addEventListener('change', (e) => setLang(e.target.value));
    }
  };

  // ======================
  // VIEWPORT PROPERTIES
  // ======================
  let resizeTimer;

  function updateViewportProperties() {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    adjustElementSizes();
  }

  function adjustElementSizes() {
    const cardGrids = $$('.card-grid');
    cardGrids.forEach(grid => {
      if (!grid) return;

      if (window.innerWidth < 640) {
        grid.style.gridTemplateColumns = '1fr';
      } else if (window.innerWidth < 1024) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      } else {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      }
    });

    const heroImages = $$('.media-img');
    heroImages.forEach(img => {
      if (window.innerWidth < 768) {
        img.style.maxHeight = '50vh';
      } else {
        img.style.maxHeight = '';
      }
    });

    if (window.innerWidth < 768) {
      document.documentElement.style.setProperty('--ease', 'cubic-bezier(0.4, 0, 0.2, 1)');

      const tiltCards = $$('.tilt-card');
      tiltCards.forEach(card => {
        card.style.transform = 'none';
        card.style.transition = 'transform 0.3s ease';
      });
    } else {
      document.documentElement.style.setProperty('--ease', 'cubic-bezier(.23,.89,.32,1)');
    }
  }

  updateViewportProperties();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateViewportProperties();
    }, 150);
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      updateViewportProperties();
    }, 100);
  });

  // ======================
  // HEADER SCROLL EFFECT
  // ======================
  const header = $('.site-header');

  function updateHeader() {
    if (!header) return;

    const scrolled = window.scrollY > 20;
    header.classList.toggle('is-scrolled', scrolled);

    const hero = $('.hero');
    if (hero && window.scrollY < window.innerHeight) {
      const scrolledPercent = window.scrollY / window.innerHeight;
      hero.style.setProperty('--parallax', `${scrolledPercent * 20}px`);
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // ======================
  // MOBILE DRAWER
  // ======================
  const drawer = $('#navDrawer');
  const btnOpen = $('#navToggle');
  const btnClose = $('#navClose');
  const backdrop = $('.drawer-backdrop');
  const panel = $('.drawer-panel');

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function lockScroll() {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (header) header.style.paddingRight = `${scrollbarWidth}px`;
  }

  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (header) header.style.paddingRight = '';
  }

  function openDrawer() {
    if (!drawer || !btnOpen) return;

    drawer.hidden = false;
    btnOpen.setAttribute('aria-expanded', 'true');
    btnOpen.setAttribute('aria-label', t('aria.closeMenu'));

    drawer.offsetHeight;
    lockScroll();

    setTimeout(() => {
      btnClose?.focus();
    }, 100);
  }

  function closeDrawer() {
    if (!drawer || !btnOpen) return;

    drawer.hidden = true;
    btnOpen.setAttribute('aria-expanded', 'false');
    btnOpen.setAttribute('aria-label', t('aria.openMenu'));

    unlockScroll();
    btnOpen.focus();
  }

  if (btnOpen) btnOpen.addEventListener('click', openDrawer);
  if (btnClose) btnClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.classList.contains('drawer-link')) {
        closeDrawer();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) {
      closeDrawer();
    }
  });

  const mediaQuery = window.matchMedia('(min-width: 981px)');

  function handleMediaChange(e) {
    if (e.matches && drawer && !drawer.hidden) {
      closeDrawer();
    }
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMediaChange);
  } else {
    mediaQuery.addListener(handleMediaChange);
  }

  if (panel) panel.addEventListener('click', (e) => e.stopPropagation());

/* =========================
   Hover interactions (DESKTOP) — igual referencia (acerca.js)
   - Idioma: hover abre/cierra
   - Hamburguesa: hover abre
   - Submenús (<details>) dentro del drawer: hover abre/cierra
========================= */
(() => {
  const canHover =
    window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  /* 1) IDIOMA */
  const langBtn = document.getElementById('language-btn');
  const langDropdown = document.getElementById('language-dropdown');
  const langWrap = langBtn?.closest('.language-selector');

  if (langBtn && langDropdown && langWrap) {
    let tClose = null;

    const openLang = () => {
      clearTimeout(tClose);
      langDropdown.classList.add('show');
      langBtn.setAttribute('aria-expanded', 'true');
    };

    const closeLang = (delay = 120) => {
      clearTimeout(tClose);
      tClose = setTimeout(() => {
        langDropdown.classList.remove('show');
        langBtn.setAttribute('aria-expanded', 'false');
      }, delay);
    };

    langWrap.addEventListener('pointerenter', openLang);
    langWrap.addEventListener('pointerleave', () => closeLang(140));

    document.addEventListener('pointerdown', (e) => {
      if (!langWrap.contains(e.target)) closeLang(0);
    });
  }

  /* 2) HAMBURGUESA / DRAWER */
  const burger = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');
  const panel = drawer?.querySelector('.drawer-panel');
  const backdrop = drawer?.querySelector('.drawer-backdrop');

  // Reusa openDrawer/closeDrawer del script actual
  const hasFns = (typeof openDrawer === 'function' && typeof closeDrawer === 'function');

  if (burger && drawer && panel && backdrop && hasFns) {
    let openTimer = null;
    let closeTimer = null;

    const scheduleOpen = () => {
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(() => {
        if (drawer.hidden) openDrawer();
      }, 120);
    };

    const scheduleClose = (delay = 180) => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        if (!drawer.hidden) closeDrawer();
      }, delay);
    };

    burger.addEventListener('pointerenter', scheduleOpen);
    burger.addEventListener('pointerleave', () => clearTimeout(openTimer));

    // Mantén abierto si el mouse está en panel o botón; cierra al salir del panel/backdrop
    panel.addEventListener('pointerenter', () => {
      clearTimeout(closeTimer);
    });

    panel.addEventListener('pointerleave', (e) => {
      const to = e.relatedTarget;
      if (to && (burger.contains(to) || backdrop.contains(to))) return;
      scheduleClose(180);
    });

    backdrop.addEventListener('pointerleave', (e) => {
      const to = e.relatedTarget;
      if (to && (panel.contains(to) || burger.contains(to))) return;
      scheduleClose(180);
    });

    backdrop.addEventListener('pointerenter', () => {
      // si está sobre backdrop, dejamos abierto (no cerramos instantáneo)
      clearTimeout(closeTimer);
    });
  }

  /* 3) SUBMENÚS en drawer (<details>) */
  if (drawer) {
    const detailsList = drawer.querySelectorAll('details.drawer-details');

    detailsList.forEach((d) => {
      let t = null;

      d.addEventListener('pointerenter', () => {
        clearTimeout(t);
        d.open = true;
      });

      d.addEventListener('pointerleave', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          d.open = false;
        }, 140);
      });
    });
  }
})();

  
  // ======================
  // REVEAL ANIMATIONS
  // ======================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initRevealAnimations() {
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const revealElements = [
        ...$$('.section > .container'),
        ...$$('.glass-card'),
        ...$$('.benefit'),
        ...$$('.contact-card'),
        ...$$('.footer-grid'),
        ...$$('.section-title'),
        ...$$('.big-title'),
        ...$$('.hero-left'),
        ...$$('.hero-right'),
        ...$$('.media-card'),
        ...$$('.card-grid'),
        ...$$('.two-col')
      ].filter(el => el && el.isConnected);

      const uniqueElements = [...new Set(revealElements)];

      uniqueElements.forEach((el, index) => {
        el.classList.add('reveal');

        let delay = 0;
        const rect = el.getBoundingClientRect();
        const scrollPosition = window.scrollY + rect.top;
        const viewportHeight = window.innerHeight;

        delay = Math.min((scrollPosition / viewportHeight) * 100, 300);
        delay += (index % 6) * 40;

        el.style.setProperty('--d', `${delay}ms`);
      });

      const observerOptions = {
        threshold: window.innerWidth < 768 ? 0.1 : 0.15,
        rootMargin: window.innerWidth < 768 ? '0px 0px -5% 0px' : '0px 0px -10% 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      uniqueElements.forEach(el => observer.observe(el));
    } else {
      $$('.reveal').forEach(el => {
        if (el) {
          el.classList.remove('reveal');
          el.classList.add('is-in');
        }
      });
    }
  }

  // ======================
  // TILT 3D EFFECT FOR CARDS
  // ======================
  function initTiltEffect() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const tiltCards = $$('.glass-card, .media-card, .benefit');

    tiltCards.forEach(card => {
      card.classList.add('tilt-card');

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 2;
        const rotateX = ((centerY - y) / centerY) * 2;

        const limitedRotateY = Math.max(Math.min(rotateY, 2), -2);
        const limitedRotateX = Math.max(Math.min(rotateX, 2), -2);

        card.style.transform = `
          perspective(1000px)
          rotateX(${limitedRotateX}deg)
          rotateY(${limitedRotateY}deg)
          translateZ(10px)
        `;
      };

      const handleMouseLeave = () => {
        card.style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          translateZ(0)
        `;

        card.style.transition = 'transform 0.5s var(--ease)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  // ======================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ======================
  function initSmoothScroll() {
    const anchorLinks = $$('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href === '#' || href.startsWith('#!') || href.startsWith('http')) return;

        const target = $(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = header?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, href);
        } else {
          location.hash = href;
        }
      });
    });
  }

  // ======================
  // FORM ENHANCEMENTS
  // ======================
  function initFormEnhancements() {
    const form = $('.contact-card');
    if (!form) return;

    const inputs = $$('input, textarea', form);

    inputs.forEach(input => {
      const parent = input.closest('.field');
      if (!parent) return;

      const handleFocus = () => {
        parent.classList.add('is-focused');
      };

      const handleBlur = () => {
        if (!input.value) {
          parent.classList.remove('is-focused');
        }
      };

      if (input.value) {
        parent.classList.add('is-focused');
      }

      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.parentElement.classList.add('is-invalid');
        } else {
          input.parentElement.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        const submitBtn = $('button[type="submit"]', form);
        const originalHTML = submitBtn.innerHTML;

        // Texto según idioma (solo el estado, no altera estética)
        submitBtn.innerHTML = currentLang === 'EN' ? 'Sending…' : 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
          alert(currentLang === 'EN'
            ? 'Message sent successfully. We will contact you soon.'
            : 'Mensaje enviado con éxito. Nos pondremos en contacto pronto.'
          );

          form.reset();
          $$('.field', form).forEach(field => {
            field.classList.remove('is-focused', 'is-invalid');
          });

          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;

          // Re-aplica traducciones para restaurar texto correcto si el idioma es EN
          applyTranslations();
        }, 1500);
      }
    });
  }

  // ======================
  // LAZY LOADING ENHANCEMENT
  // ======================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = $$('img[loading="lazy"]');

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            const isMobile = window.innerWidth < 768;
            if (isMobile && img.dataset.srcMobile) {
              img.src = img.dataset.srcMobile;
            } else if (img.dataset.src) {
              img.src = img.dataset.src;
            }

            img.classList.add('is-loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      lazyImages.forEach(img => {
        if (!img.dataset.src && img.src) {
          img.dataset.src = img.src;
          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        }
        imageObserver.observe(img);
      });
    }
  }

  // ======================
  // INITIALIZE EVERYTHING
  // ======================
  function init() {
    // i18n primero para que labels/aria estén correctos desde inicio
    initLanguageUI();

    initRevealAnimations();
    initSmoothScroll();
    initTiltEffect();
    initFormEnhancements();
    initLazyLoading();

    console.log('✅ Bausen Capital Humano - UI Enhancements loaded');
    console.log('🌐 Lang: ' + currentLang);
    console.log('📱 Viewport: ' + window.innerWidth + 'x' + window.innerHeight);
    console.log('🎨 Theme: ' + (document.documentElement.getAttribute('data-theme') || 'dark'));
    console.log('⚡ Performance: ' + (prefersReducedMotion ? 'Reduced motion' : 'Full animations'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Debug API
  window.bausenUI = {
    updateViewportProperties,
    adjustElementSizes,
    setTheme,
    toggleTheme,
    openDrawer,
    closeDrawer,
    setLang
  };
})();
