/* =========================
   Bausen - Noticias (JS parche)
   - Tema claro/oscuro persistente
   - Idiomas dropdown
   - Menú móvil
   - Reveal on scroll
   - Hover 3D + glow en categorías (tilt)
   - Buscador: estructura lista para lógica futura
========================= */

(function () {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

 const header = document.querySelector(".site-header");

const menuToggle = $("#menu-toggle");
const menuClose  = $("#close-menu");
const mobileMenu  = $("#mobile-menu");
const mobileOverlay = $("#mobile-menu-overlay");

const themeToggle = $("#theme-toggle");
const mobileTheme = $("#mobile-theme-toggle"); // si no existe en HTML, queda null y NO rompe


const langBtn  = $("#language-btn");
const langList = $("#language-dropdown");
const langCode = $("#language-code");
const langFlag = $("#language-flag");


  const openNewsletter = $("#openNewsletter");
  const newsletterModal = $("#newsletterModal");
  const newsletterForm = $("#newsletterForm");
  const newsletterStatus = $("#newsletterStatus");

  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");
  // =========================
  // i18n (ES / EN) - aplica a TODO el HTML con data-i18n*
  // Nota: el selector conserva sus opciones (EN, ES, DE, PT, FR, IT),
  // pero el contenido traducible se soporta para ES y EN. Otros códigos -> fallback a EN.
  // =========================
  const I18N = {
    ES: {
      "doc.title": "Bausen | Noticias y Actualidad",

      "nav.home": "Inicio",
      "nav.press": "Prensa",
      "nav.services": "Servicios",
      "nav.news": "Noticias",
      "nav.training": "Centro de Formación",
      "nav.about": "Sobre Nosotros",

      "header.collab": "¿Eres colaborador?",

      "newspage.pill": "Blog y Noticias",
      "newspage.h1": "Noticias y Actualidad",
      "newspage.subtitle":
        "Blog corporativo, eventos destacados y actualizaciones sobre cambios legislativos que impactan tus operaciones empresariales.",
      "newspage.ctaNewsletter": "Suscribirme al newsletter",

      "newspage.searchAria": "Buscador de noticias",
      "newspage.searchPlaceholder": "Buscar noticias, temas o palabras clave...",
      "newspage.searchInputAria": "Buscar noticias",
      "newspage.searchBtn": "Buscar",
      "newspage.searchHint": "Buscador próximamente disponible (estructura lista para integrar noticias).",

      "newspage.recentTitleHtml": 'Noticias <span class="title-accent">Más Recientes</span>',
      "newspage.recentSub": "Mantente al día con lo más relevante de la industria.",

      "newspage.emptyTitle": "No hay noticias disponibles",
      "newspage.emptySub": "Cuando publiquemos contenido nuevo, aparecerá aquí automáticamente.",

      "newspage.catTitleHtml": 'Explora por <span class="title-accent">categoría</span>',
      "newspage.catSub": "Explora contenido por tema",

      "newspage.catBlogAria": "Blog corporativo",
      "newspage.catBlogTitle": "Blog Corporativo",
      "newspage.catBlogSub": "Insights, guías y mejores prácticas",
      "newspage.kpiArticles": "artículos",

      "newspage.catEventsAria": "Eventos destacados",
      "newspage.catEventsTitle": "Eventos Destacados",
      "newspage.catEventsSub": "Conferencias, webinars y highlights",
      "newspage.kpiEvents": "eventos",

      "newspage.catLegalAria": "Cambios legislativos",
      "newspage.catLegalTitle": "Cambios Legislativos",
      "newspage.catLegalSub": "Actualizaciones legales y su impacto",
      "newspage.kpiUpdates": "actualizaciones",

      "newspage.modalAria": "Suscripción a newsletter",
      "newspage.modalTitle": "Suscripción a Newsletter",
      "newspage.modalCloseAria": "Cerrar",
      "newspage.modalText":
        "Recibe actualizaciones periódicas sobre noticias, eventos y cambios legislativos relevantes para tu empresa.",
      "newspage.fieldName": "Nombre",
      "newspage.fieldNamePh": "Tu nombre",
      "newspage.fieldEmail": "Correo electrónico",
      "newspage.fieldEmailPh": "tucorreo@empresa.com",
      "newspage.modalSubmit": "Suscribirme",

      "newspage.statusProcessing": "Procesando suscripción...",
      "newspage.statusDone": "Listo. Suscripción registrada (demo).",

      "footer.brandText":
        "Tu aliado estratégico en soluciones empresariales integrales. Transformamos organizaciones desde adentro.",
      "footer.hoursLabel": "Horario de atención",
      "footer.hoursValue": "Lunes - Viernes: 9:00 - 18:00",
      "footer.follow": "Síguenos en redes / CONTACTO",

      "footer.company": "Empresa",
      "footer.about": "Sobre Nosotros",
      "footer.services": "Servicios",
      "footer.news": "Noticias",
      "footer.press": "Prensa",
      "footer.contact": "Contacto",

      "footer.servicesLink": "SERVICIOS",
      "footer.svc.capital": "Capital Humano",
      "footer.svc.legal": "Servicios Legales",
      "footer.svc.accounting": "Servicios Contables",
      "footer.svc.orgdev": "Desarrollo Organizacional",

      "footer.contactTitle": "CONTACTO",
      "presspage.footerSoon": "Próximamente.",
      "presspage.footerNoteRest": "No se encontraron sucursales activas.",

      "footer.phoneLabel": "Teléfono",
      "footer.emailLabel": "Email",
      "footer.maps": "Ver en Google Maps",

      "presspage.footerRights": "© 2026 Bausen. Todos los derechos reservados.",
      "footer.privacy": "Política de privacidad",
      "footer.terms": "Términos de servicio",
      "footer.cookies": "Política de cookies",
    },

    EN: {
      "doc.title": "Bausen | News & Updates",

      "nav.home": "Home",
      "nav.press": "Press",
      "nav.services": "Services",
      "nav.news": "News",
      "nav.training": "Training",
      "nav.about": "About Us",

      "header.collab": "Are you a collaborator?",

      "newspage.pill": "Blog & News",
      "newspage.h1": "News & Updates",
      "newspage.subtitle":
        "Corporate blog, featured events, and updates on legislative changes that impact your business operations.",
      "newspage.ctaNewsletter": "Subscribe to the newsletter",

      "newspage.searchAria": "News search",
      "newspage.searchPlaceholder": "Search news, topics, or keywords...",
      "newspage.searchInputAria": "Search news",
      "newspage.searchBtn": "Search",
      "newspage.searchHint": "Search coming soon (structure ready to integrate news).",

      "newspage.recentTitleHtml": 'Latest <span class="title-accent">News</span>',
      "newspage.recentSub": "Stay up to date with the most relevant industry updates.",

      "newspage.emptyTitle": "No news available",
      "newspage.emptySub": "When we publish new content, it will appear here automatically.",

      "newspage.catTitleHtml": 'Browse by <span class="title-accent">category</span>',
      "newspage.catSub": "Explore content by topic",

      "newspage.catBlogAria": "Corporate blog",
      "newspage.catBlogTitle": "Corporate Blog",
      "newspage.catBlogSub": "Insights, guides, and best practices",
      "newspage.kpiArticles": "articles",

      "newspage.catEventsAria": "Featured events",
      "newspage.catEventsTitle": "Featured Events",
      "newspage.catEventsSub": "Conferences, webinars, and highlights",
      "newspage.kpiEvents": "events",

      "newspage.catLegalAria": "Legislative changes",
      "newspage.catLegalTitle": "Legislative Changes",
      "newspage.catLegalSub": "Legal updates and their impact",
      "newspage.kpiUpdates": "updates",

      "newspage.modalAria": "Newsletter subscription",
      "newspage.modalTitle": "Newsletter Subscription",
      "newspage.modalCloseAria": "Close",
      "newspage.modalText":
        "Receive periodic updates about news, events, and legislative changes relevant to your business.",
      "newspage.fieldName": "Name",
      "newspage.fieldNamePh": "Your name",
      "newspage.fieldEmail": "Email",
      "newspage.fieldEmailPh": "youremail@company.com",
      "newspage.modalSubmit": "Subscribe",

      "newspage.statusProcessing": "Processing subscription...",
      "newspage.statusDone": "Done. Subscription registered (demo).",

      "footer.brandText":
        "Your strategic ally in comprehensive business solutions. We transform organizations from within.",
      "footer.hoursLabel": "Business hours",
      "footer.hoursValue": "Monday - Friday: 9:00 - 18:00",
      "footer.follow": "Follow us on social / CONTACT",

      "footer.company": "Company",
      "footer.about": "About Us",
      "footer.services": "Services",
      "footer.news": "News",
      "footer.press": "Press",
      "footer.contact": "Contact",

      "footer.servicesLink": "SERVICES",
      "footer.svc.capital": "Human Capital",
      "footer.svc.legal": "Legal Services",
      "footer.svc.accounting": "Accounting Services",
      "footer.svc.orgdev": "Organizational Development",

      "footer.contactTitle": "CONTACT",
      "presspage.footerSoon": "Coming soon.",
      "presspage.footerNoteRest": "No active branches found.",

      "footer.phoneLabel": "Phone",
      "footer.emailLabel": "Email",
      "footer.maps": "View on Google Maps",

      "presspage.footerRights": "© 2026 Bausen. All rights reserved.",
      "footer.privacy": "Privacy policy",
      "footer.terms": "Terms of service",
      "footer.cookies": "Cookie policy",
    },
  };

  let currentLang = "EN";
  const normLang = (code) => (code === "ES" ? "ES" : "EN");

  function t(key) {
    const dict = I18N[currentLang] || I18N.EN;
    return dict[key];
  }

  function applyTranslations() {
    const dict = I18N[currentLang] || I18N.EN;

    document.documentElement.lang = currentLang === "ES" ? "es" : "en";
    if (dict["doc.title"]) document.title = dict["doc.title"];

    $$("[data-i18n-text]").forEach((el) => {
      const key = el.getAttribute("data-i18n-text");
      if (key && dict[key] != null) el.textContent = dict[key];
    });

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key] != null) el.innerHTML = dict[key];
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });

    $$("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (key && dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });
  }

  function setLanguage(code) {
    currentLang = normLang(code);
    applyTranslations();
  }


  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

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

  applyTheme(localStorage.getItem("bausen_theme") || "dark");

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (mobileTheme) mobileTheme.addEventListener("click", toggleTheme);

  // =========================
// Language dropdown (HTML real: language-*)
// =========================
// =========================
// Flags (igual que referencia: SVG por JS)
// =========================
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

const normFlagLang = (v) => {
  const up = String(v || "").trim().toUpperCase();
  if (FLAG_SVG[up]) return up;
  // fallback seguro
  return "ES";
};

function setFlag(code) {
  const L = normFlagLang(code);

  // Flag principal (botón)
  if (langFlag) {
    langFlag.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;
  }

  // Flags dentro del dropdown (tus spans .flag con data-flag)
  document.querySelectorAll("[data-flag]").forEach((el) => {
    const c = normFlagLang(el.getAttribute("data-flag") || "ES");
    el.innerHTML = FLAG_SVG[c] || FLAG_SVG.ES;
  });
}


function closeLang(){
  if (!langList || !langBtn) return;
  langList.classList.remove("show");
  langBtn.setAttribute("aria-expanded", "false");
}

function toggleLang(){
  if (!langList || !langBtn) return;
  const open = langList.classList.toggle("show");
  langBtn.setAttribute("aria-expanded", String(open));
}

if (langBtn && langList){
  langBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLang();
  });

  $$(".language-option", langList).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const code = btn.dataset.lang || "EN";

     if (langCode) langCode.textContent = code;
setFlag(code);
setLanguage(code);


      $$(".language-option", langList).forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");

      localStorage.setItem("bausen_lang", code);
      closeLang();
    });
  });

  document.addEventListener("click", closeLang);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLang();
  });

  const saved = localStorage.getItem("bausen_lang");
  if (saved){
    setLanguage(saved);

    if (langCode) langCode.textContent = saved;
    setFlag(saved);
    const match = $(`.language-option[data-lang="${saved}"]`, langList);
    if (match) match.setAttribute("aria-selected", "true");
  } else {
    // default visual coherente con tu HTML (EN)
    setFlag(langCode?.textContent || "EN");
  }
}


 // =========================
// Mobile menu (HTML real: mobile-menu / mobile-menu-overlay)
// =========================
const lockScroll = (locked) => {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
};

function openMenu(){
  if (!mobileMenu || !mobileOverlay || !menuToggle) return;

  mobileMenu.classList.add("open");
  mobileOverlay.classList.add("show");

  mobileMenu.setAttribute("aria-hidden", "false");
  mobileOverlay.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");

  lockScroll(true);

  setTimeout(() => {
    const first = $(".mobile-nav-link", mobileMenu);
    if (first) first.focus();
  }, 30);
}

function closeMenu(){
  if (!mobileMenu || !mobileOverlay || !menuToggle) return;

  mobileMenu.classList.remove("open");
  mobileOverlay.classList.remove("show");

  mobileMenu.setAttribute("aria-hidden", "true");
  mobileOverlay.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");

  lockScroll(false);
  menuToggle.focus();
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (menuClose) menuClose.addEventListener("click", closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

// Cierra al hacer click en un link del menú móvil
if (mobileMenu){
  $$(".mobile-nav-link", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));
}

// Escape cierra menú
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

  // =========================
  // Newsletter modal
  // =========================
  function openModal() {
    if (!newsletterModal) return;
    newsletterModal.classList.add("is-open");
    newsletterModal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setTimeout(() => $("#nlName")?.focus(), 60);
  }

  function closeModal() {
    if (!newsletterModal) return;
    newsletterModal.classList.remove("is-open");
    newsletterModal.setAttribute("aria-hidden", "true");
    lockScroll(false);
  }

  if (openNewsletter) openNewsletter.addEventListener("click", openModal);

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.matches('[data-close="modal"]') || t.closest('[data-close="modal"]')) closeModal();
  });

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!newsletterStatus) return;

      newsletterStatus.textContent = t("newspage.statusProcessing") || "Procesando suscripción...";
      newsletterStatus.style.color = "";

      // TODO: Integrar backend real: POST /api/newsletter {name,email}
      await new Promise((r) => setTimeout(r, 650));

      newsletterStatus.textContent = t("newspage.statusDone") || "Listo. Suscripción registrada (demo).";
      newsletterStatus.style.color = "currentColor";

      setTimeout(() => {
        closeModal();
        newsletterForm.reset();
        newsletterStatus.textContent = "";
      }, 950);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      closeModal();
    }
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
  // Buscador (estructura lista para lógica futura)
  // =========================
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const q = (searchInput.value || "").trim();

      // Hook futuro:
      // - cuando exista backend: GET /api/news?q=...
      // - o filtrar un array local de noticias.
      // Por ahora solo deja la UX lista sin romper estructura.
      if (!q) {
        searchInput.focus();
        return;
      }

      // Demo: feedback no intrusivo
      searchInput.blur();
      // Si quieres, aquí puedes abrir un toast o hacer scroll a "Noticias Más Recientes".
      document.getElementById("recientes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // =========================
  // Hover 3D real (tilt) para las 3 cards de categoría
  // =========================
  function attachTilt(el) {
    const strength = 10; // sutil
    const lift = 6;      // elevación al hover

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      const rx = (0.5 - py) * strength;
      const ry = (px - 0.5) * strength;

      el.style.transform = `translateY(-${lift}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  }

  if (!prefersReduced && window.matchMedia("(min-width: 980px)").matches) {
    $$(".cat-card").forEach(attachTilt);
  }

  // =========================
  // Header measurement
  // =========================
  measureHeader();
  const ro = new ResizeObserver(() => measureHeader());
  if (header) ro.observe(header);
  window.addEventListener("resize", () => measureHeader());
})();
// Sync idioma: select del menú móvil -> header + localStorage
(() => {
  const mobileSelect = document.getElementById("mobileLangSelect");
  const langCode = document.getElementById("langCode");
  const langList = document.getElementById("langList");

  if (!mobileSelect) return;

  // Inicializa el select con el idioma guardado (si existe)
  try {
    const saved = localStorage.getItem("bausen_lang");
    if (saved) mobileSelect.value = saved;
  } catch {}

  const apply = (code) => {
    if (langCode) langCode.textContent = code;

    if (langList) {
      langList.querySelectorAll(".lang__item").forEach((li) => {
        li.setAttribute("aria-selected", li.dataset.lang === code ? "true" : "false");
      });
    }

    try { localStorage.setItem("bausen_lang", code); } catch {}
  };

  mobileSelect.addEventListener("change", () => apply(mobileSelect.value));
})();
