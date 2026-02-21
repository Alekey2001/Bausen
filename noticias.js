/* =========================================================
   BAUSEN — Noticias (LIGHT ONLY)
   ✅ Mantiene: menú móvil, selector de idioma, modal newsletter, reveal simple
   ❌ Eliminado: tema oscuro, buscador, categorías (ya no existen en HTML)
========================================================= */

(function () {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // Force light (por seguridad)
  root.setAttribute("data-theme", "light");
  try { localStorage.removeItem("theme"); localStorage.removeItem("bausen_theme"); } catch {}

  // =========================
  // Menú móvil (mismo patrón que BAUSEN)
  // =========================
  const menuToggle = $("#menu-toggle");
  const menuClose  = $("#close-menu");
  const mobileMenu  = $("#mobile-menu");
  const mobileOverlay = $("#mobile-menu-overlay");

  function openMenu(){
    if(!mobileMenu || !mobileOverlay || !menuToggle) return;
    mobileMenu.classList.add("open");
    mobileOverlay.classList.add("show");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileOverlay.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu(){
    if(!mobileMenu || !mobileOverlay || !menuToggle) return;
    mobileMenu.classList.remove("open");
    mobileOverlay.classList.remove("show");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileOverlay.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
  }

  menuToggle && menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu && mobileMenu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });
  menuClose && menuClose.addEventListener("click", closeMenu);
  mobileOverlay && mobileOverlay.addEventListener("click", closeMenu);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // =========================
  // Idiomas (ES / EN) — aplica a data-i18n-text / data-i18n / data-i18n-placeholder
  // =========================
  const I18N = {
    ES: {
      "nav.home": "Inicio",
      "nav.press": "Prensa",
      "nav.services": "Servicios",
      "nav.news": "Noticias",
      "nav.training": "Centro de Formación",
      "nav.about": "Acerca de",
      "header.collab": "¿Eres colaborador?",
      "nav.svc.payroll": "Procesamiento de nómina",
"nav.svc.specialized": "Servicios especializados",
"nav.svc.tax": "Consultoría fiscal",

      "newspage.pill": "Blog & Actualidad",
      "newspage.h1": "Noticias y Actualidad",
      "newspage.subtitle": "Actualizaciones, comunicados y eventos relevantes para tu organización.",
      "newspage.modalTitle": "Suscripción a Newsletter",
      "newspage.modalText": "Recibe actualizaciones periódicas sobre noticias y eventos relevantes para tu empresa.",
      "newspage.fieldName": "Nombre",
      "newspage.fieldNamePh": "Tu nombre",
      "newspage.fieldEmail": "Correo electrónico",
      "newspage.fieldEmailPh": "tucorreo@empresa.com",
      "newspage.modalSubmit": "Suscribirme",
      "newspage.statusProcessing": "Procesando suscripción...",
      "newspage.statusDone": "Listo. Suscripción registrada (demo).",
    },
    EN: {
      "nav.home": "Home",
      "nav.press": "Press",
      "nav.services": "Services",
      "nav.news": "News",
      "nav.training": "Training Center",
      "nav.about": "About",
      "header.collab": "Are you a collaborator?",
      "nav.svc.payroll": "Payroll processing",
"nav.svc.specialized": "Specialized services",
"nav.svc.tax": "Tax consulting",

      "newspage.pill": "Blog & Updates",
      "newspage.h1": "News & Updates",
      "newspage.subtitle": "Updates, releases, and featured events relevant to your organization.",
      "newspage.modalTitle": "Newsletter Subscription",
      "newspage.modalText": "Get periodic updates about news and featured events relevant to your business.",
      "newspage.fieldName": "Name",
      "newspage.fieldNamePh": "Your name",
      "newspage.fieldEmail": "Email",
      "newspage.fieldEmailPh": "you@company.com",
      "newspage.modalSubmit": "Subscribe",
      "newspage.statusProcessing": "Processing subscription...",
      "newspage.statusDone": "Done. Subscription registered (demo).",
    }
  };

  const langBtn  = $("#language-btn");
  const langList = $("#language-dropdown");
  const langCode = $("#language-code");
  const langFlag = $("#language-flag");

  const storageKey = "bausen_lang";
  function getLang(){
    try {
      const v = localStorage.getItem(storageKey);
      return (v || "EN").toUpperCase();
    } catch { return "EN"; }
  }
  function setLang(lang){
    const L = (lang || "EN").toUpperCase();
    try { localStorage.setItem(storageKey, L); } catch {}
    applyLang(L);
  }

  function applyLang(lang){
    const dict = I18N[lang] || I18N.EN;
    if (langCode) langCode.textContent = lang;
    if (langFlag) langFlag.setAttribute("data-flag", lang);

    // innerHTML keys
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    // textContent keys
    $$("[data-i18n-text]").forEach(el => {
      const key = el.getAttribute("data-i18n-text");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    // placeholder keys
    $$("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });
    // aria-label keys
    $$("[data-i18n-aria-label]").forEach(el => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });

    // Title
    if (dict["doc.title"]) document.title = dict["doc.title"];
  }

  function toggleLangList(force){
    if(!langList || !langBtn) return;
    const isOpen = langList.classList.contains("show");
    const next = (typeof force === "boolean") ? force : !isOpen;
    langList.classList.toggle("show", next);
    langBtn.setAttribute("aria-expanded", next ? "true" : "false");
  }


  // Exponer hooks mínimos para helpers de hover (solo desktop)
  try{
    window.__bausenNews = window.__bausenNews || {};
    window.__bausenNews.openMenu = openMenu;
    window.__bausenNews.closeMenu = closeMenu;
    window.__bausenNews.toggleLangList = toggleLangList;
  }catch{}

  langBtn && langBtn.addEventListener("click", () => toggleLangList());
  document.addEventListener("click", (e) => {
    if (!langList || !langBtn) return;
    if (langBtn.contains(e.target) || langList.contains(e.target)) return;
    toggleLangList(false);
  });
  $$(".language-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang") || "EN";
      setLang(lang);
      toggleLangList(false);
    });
  });

  applyLang(getLang());

  // =========================
  // Noticias: empty-state inteligente
  // - El recuadro "No hay noticias disponibles" se mantiene como contenedor.
  // - Si hay tarjetas dentro de #newsGrid, ocultamos el mensaje vacío y mostramos las tarjetas.
  // =========================
  const emptyState = $("#emptyState");
  const newsGrid = $("#newsGrid");

  function syncEmptyState(){
    if(!emptyState || !newsGrid) return;
    const hasItems = newsGrid.children && newsGrid.children.length > 0;

    const icon  = $(".empty-icon", emptyState);
    const title = $(".empty-title", emptyState);
    const sub   = $(".empty-sub", emptyState);
    const future = $(".empty-future", emptyState);

    // Cuando hay contenido: ocultar mensaje vacío
    [icon, title, sub, future].forEach(el => {
      if(!el) return;
      el.style.display = hasItems ? "none" : "";
    });

    // Cuando no hay contenido: ocultar el grid (para no dejar espacios)
    if(!hasItems){
      newsGrid.style.display = "none";
    }else{
      newsGrid.style.display = "";
    }
  }

  // Ejecutar al cargar
  syncEmptyState();

  // Si en el futuro agregas/quitás noticias por JS, mantenemos el estado sincronizado
  if (newsGrid && "MutationObserver" in window){
    const mo = new MutationObserver(syncEmptyState);
    mo.observe(newsGrid, { childList: true });
  }


// ===== FIX #3: Hover-open behavior (language + menu) =====
(function hoverUI(){
  // Idioma: hover abre/cierra
  const langWrap = document.querySelector(".language-selector");
  if (langWrap && typeof toggleLangList === "function") {
    let langT;
    langWrap.addEventListener("mouseenter", () => {
      clearTimeout(langT);
      toggleLangList(true);
    });
    langWrap.addEventListener("mouseleave", () => {
      langT = setTimeout(() => toggleLangList(false), 140);
    });
  }

  // Menú hamburguesa: hover abre, al salir cierra
  const menuBtn = document.querySelector("#menu-toggle");
  const menuPanel = document.querySelector("#mobile-menu");
  const overlay = document.querySelector("#mobile-menu-overlay");

  if (menuBtn && menuPanel && typeof openMenu === "function" && typeof closeMenu === "function") {
    let t;

    menuBtn.addEventListener("mouseenter", () => {
      clearTimeout(t);
      openMenu();
    });

    // Si el mouse se va del panel y no está sobre el botón ni overlay, cierra
    const scheduleClose = () => {
      t = setTimeout(() => {
        const overBtn = menuBtn.matches(":hover");
        const overPanel = menuPanel.matches(":hover");
        const overOverlay = overlay ? overlay.matches(":hover") : false;
        if (!overBtn && !overPanel && !overOverlay) closeMenu();
      }, 160);
    };

    menuBtn.addEventListener("mouseleave", scheduleClose);
    menuPanel.addEventListener("mouseleave", scheduleClose);
    overlay && overlay.addEventListener("mouseleave", scheduleClose);
    menuPanel.addEventListener("mouseenter", () => clearTimeout(t));

    // Submenús (Inicio/Noticias): hover abre/cierra <details> automáticamente
    const detailsList = Array.from(document.querySelectorAll("#mobile-menu details.menu-details"));
    detailsList.forEach((d) => {
      let tt;

      d.addEventListener("mouseenter", () => {
        clearTimeout(tt);
        d.open = true;
      });

      d.addEventListener("mouseleave", () => {
        tt = setTimeout(() => { d.open = false; }, 140);
      });
    });

  }
})();
// =========================
// Modal Evento: "Leer más" (sin redirección)
// =========================
const eventModal = document.getElementById("eventModal");
const eventModalKicker = document.getElementById("eventModalKicker");
const eventModalTitle = document.getElementById("eventModalTitle");
const eventModalMeta = document.getElementById("eventModalMeta");
const eventModalContent = document.getElementById("eventModalContent");

function openEventModal(fromCard){
  if(!eventModal || !fromCard) return;

  const metaPill = fromCard.querySelector(".event-pill")?.textContent?.trim() || "Evento";
  const metaDate = fromCard.querySelector(".event-date")?.textContent?.trim() || "";
  const title = fromCard.querySelector(".event-card__title")?.textContent?.trim() || "";
  const full = fromCard.querySelector(".event-card__full");

  if (eventModalKicker) eventModalKicker.textContent = metaPill;
  if (eventModalTitle) eventModalTitle.textContent = title;
  if (eventModalMeta) eventModalMeta.textContent = metaDate;

  // Inyectar contenido completo (incluye slots de imágenes)
  if (eventModalContent){
    eventModalContent.innerHTML = "";
    if (full){
      eventModalContent.appendChild(full.cloneNode(true));
      const cloned = eventModalContent.querySelector(".event-card__full");
      if (cloned) cloned.hidden = false;
    }
  }

  eventModal.classList.add("is-open");
  eventModal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeEventModal(){
  if(!eventModal) return;
  eventModal.classList.remove("is-open");
  eventModal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  if (eventModalContent) eventModalContent.innerHTML = "";
}

// Delegación: clicks a botones Leer más y cierres del modal
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open-event]");
  if (btn){
    const card = btn.closest(".event-card");
    openEventModal(card);
    return;
  }

  if (e.target.closest("[data-close=\"event\"]")){
    closeEventModal();
  }
});

// ESC cierra modal de evento (sin afectar otros)
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeEventModal();
});
  // =========================
  // Modal Newsletter (demo)
  // =========================
  const openNewsletter = $("#openNewsletter");
  const newsletterModal = $("#newsletterModal");
  const newsletterClosers = newsletterModal ? $$("[data-close=\"modal\"]", newsletterModal) : [];
    const newsletterForm = $("#newsletterForm");
  const newsletterStatus = $("#newsletterStatus");

  function openModal(){
    if(!newsletterModal) return;
    newsletterModal.classList.add("is-open");
    newsletterModal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    if(!newsletterModal) return;
    newsletterModal.classList.remove("is-open");
    newsletterModal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  openNewsletter && openNewsletter.addEventListener("click", openModal);
  (newsletterClosers || []).forEach((el)=> el.addEventListener("click", closeModal));
  window.addEventListener("keydown", (e) => { if(e.key==="Escape") closeModal(); });

  newsletterForm && newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!newsletterStatus) return;
    const lang = getLang();
    const dict = I18N[lang] || I18N.EN;
    newsletterStatus.textContent = dict["newspage.statusProcessing"] || "Processing...";
    setTimeout(() => {
      newsletterStatus.textContent = dict["newspage.statusDone"] || "Done.";
    }, 850);
  });

  // =========================
  // Reveal simple
  // =========================
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          ent.target.classList.add("is-in");
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el=>io.observe(el));
  }
})();
// ===== Hover open/close (solo desktop con hover real) =====
(function hoverOpenDesktop(){
  const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if(!canHover) return;

  const hooks = window.__bausenNews || {};
  const toggleLangList = hooks.toggleLangList;
  const openMenu = hooks.openMenu;
  const closeMenu = hooks.closeMenu;

  // Idioma (hover abre/cierra)
  const langWrap = document.querySelector(".language-selector");
  if (langWrap && typeof toggleLangList === "function") {
    let t;
    langWrap.addEventListener("mouseenter", () => { clearTimeout(t); toggleLangList(true); });
    langWrap.addEventListener("mouseleave", () => { t = setTimeout(() => toggleLangList(false), 120); });
  }

  // Menú (hover abre, al salir cierra)
  const menuBtn = document.querySelector("#menu-toggle");
  const menuPanel = document.querySelector("#mobile-menu");
  const overlay = document.querySelector("#mobile-menu-overlay");

  if(menuBtn && menuPanel && typeof openMenu === "function" && typeof closeMenu === "function"){
    let t;
    menuBtn.addEventListener("mouseenter", () => { clearTimeout(t); openMenu(); });

    const scheduleClose = () => {
      t = setTimeout(() => {
        const overBtn = menuBtn.matches(":hover");
        const overPanel = menuPanel.matches(":hover");
        const overOverlay = overlay ? overlay.matches(":hover") : false;
        if(!overBtn && !overPanel && !overOverlay) closeMenu();
      }, 140);
    };

    menuBtn.addEventListener("mouseleave", scheduleClose);
    menuPanel.addEventListener("mouseleave", scheduleClose);
    overlay && overlay.addEventListener("mouseleave", scheduleClose);
    menuPanel.addEventListener("mouseenter", () => clearTimeout(t));

    // Submenús (Inicio/Noticias): hover abre/cierra <details>
    const detailsList = Array.from(document.querySelectorAll("#mobile-menu details.menu-details"));
    detailsList.forEach((d) => {
      let tt;
      d.addEventListener("mouseenter", () => { clearTimeout(tt); d.open = true; });
      d.addEventListener("mouseleave", () => { tt = setTimeout(() => { d.open = false; }, 140); });
    });
  }
})();