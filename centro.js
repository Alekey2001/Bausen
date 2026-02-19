/* =========================
   centro.js — Bausen Centro
   - Theme toggle (desktop + mobile)
   - Mobile menu (open/close + overlay + ESC)
   - Language dropdown (ES/EN/PT)
   - Reveal on scroll (IntersectionObserver)
   - Tilt effect (data-tilt)
   - Course filters
   - CV form UX (file name + basic validate)
   - FAQ accordion
   - Smooth anchor scroll with header offset
========================= */

(() => {
  "use strict";

  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const html = document.documentElement;
  const body = document.body;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elements
  const header = $("#siteHeader");

  // Theme
  const themeToggle = $("#themeToggle");
  const themeToggleMobile = $("#themeToggleMobile");

  // Language
  const langBtn = $("#langBtn");
  const langList = $("#langList");
  const langCode = $("#langCode");
  const langFlag = langBtn ? $(".lang__flag", langBtn) : null;

  // Mobile menu
  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const mobileMenu = $("#mobileMenu");
  const mobileMenuOverlay = $("#mobileMenuOverlay");

  // Courses / filters
  const courseGrid = $("#courseGrid");
  const chips = $$(".chip");
  const courses = $$(".course");

  // CV form
  const cvForm = $("#cvForm");
  const cvFile = $("#cvFile");
  const cvFileName = $("#cvFileName");
  const cvMsg = $("#cvMsg");

  // FAQ
  const faq = $("#faq");

  /* -------------------------
     Theme
  ------------------------- */
  function getTheme() {
    return html.getAttribute("data-theme") || "dark";
  }
  function setTheme(next) {
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("bausen_theme", next); } catch (_) {}
    syncThemeIcon(next);
  }
  function syncThemeIcon(theme) {
    const icon = themeToggle ? $("i", themeToggle) : null;
    if (!icon) return;
    // Moon icon looks OK for dark; switch for light
    icon.classList.remove("fa-moon", "fa-sun");
    icon.classList.add(theme === "light" ? "fa-sun" : "fa-moon");
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("bausen_theme"); } catch (_) {}
    if (saved === "light" || saved === "dark") setTheme(saved);
    else syncThemeIcon(getTheme());

    const onToggle = () => setTheme(getTheme() === "dark" ? "light" : "dark");
    if (themeToggle) themeToggle.addEventListener("click", onToggle);
    if (themeToggleMobile) themeToggleMobile.addEventListener("click", onToggle);
  }

  /* -------------------------
     Language dropdown
  ------------------------- */
  /* -------------------------
     Language dropdown (ES/EN/DE/PT/FR/IT) — reference parity
  ------------------------- */
  const LANG_KEY = "bausen_lang";

  // Flags SVG (copiado del patrón de prensa.js)
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
  

  const normalizeLang = (lang) => {
    const v = String(lang || "").trim();
    const up = v.toUpperCase();

    if (up === "EN" || up === "ES" || up === "DE" || up === "PT" || up === "FR" || up === "IT") return up;
    if (v.toLowerCase().startsWith("en")) return "EN";
    if (v.toLowerCase().startsWith("es")) return "ES";
    if (v.toLowerCase().startsWith("pt")) return "PT";
    if (v.toLowerCase().startsWith("fr")) return "FR";
    if (v.toLowerCase().startsWith("it")) return "IT";
    if (v.toLowerCase().startsWith("de")) return "DE";
    return "ES"; // mantenemos ES como default en centro (no cambiamos tu base)
  };
  // Nombres para mostrar en el dropdown (no cambia IDs ni estructura externa)
  const LANG_LABEL = {
    ES: "Español",
    EN: "English",
    DE: "Deutsch",
    PT: "Português",
    FR: "Français",
    IT: "Italiano",
  };

  const LANG_TO_HTML = {
    ES: "es",
    EN: "en",
    DE: "de",
    PT: "pt",
    FR: "fr",
    IT: "it",
  };
  /* -------------------------
     i18n (ES/EN) — traducción de TODO el HTML
     - No toca estilos, solo cambia texto/attrs via data-i18n*
     - ES usa el contenido base del HTML (snapshot). EN usa diccionario.
  ------------------------- */
  const I18N_EN = {
    // Header/Nav
    "nav.home": "Home",
    "nav.press": "Press",
    "nav.services": "Services",
    "nav.news": "News",
    "nav.training": "Training Center",
    "nav.about": "About",
    "header.collab": "Are you a collaborator?",

    // UI (aria-labels)
    "ui.openMenu": "Open menu",
    "ui.closeMenu": "Close menu",
    "ui.langSelect": "Select language",
    "ui.goHome": "Go to home",
    "ui.toggleTheme": "Toggle light/dark theme",

    // Language labels (dropdown)
    "lang.es": "ES — Spanish",
    "lang.en": "EN — English",
    "lang.de": "DE — German",
    "lang.pt": "PT — Portuguese",
    "lang.fr": "FR — French",
    "lang.it": "IT — Italian",

    // Hero
    "centro.heroAria": "Training Center",
    "centro.heroPill": "Certified Professional Training",
    "centro.heroTitle": "Transform your<br />\n            <span class=\"hero__accent\">Career</span><br />\n            Today",
    "centro.heroSubtitle":
      "Build the skills the market demands with specialized courses and internationally recognized certifications.",
    "centro.ctaExplore": "Explore Courses",
    "centro.ctaDemo": "Book a Demo",
    "centro.panelTag": "Integrated solutions",
    "centro.feature1Title": "Learn at your pace",
    "centro.feature1Desc": "24/7 access to all content",
    "centro.feature2Title": "Certification included",
    "centro.feature2Desc": "Professional recognition",
    "centro.feature3Title": "Active community",
    "centro.feature3Desc": "Network of professionals",
    "centro.panelHint": "Space for your corporate image",

    // How it works
    "centro.howTitle": "How does it work?",
    "centro.howSub": "A clear path with a practical, measurable approach.",
    "centro.step1k": "STEP 1",
    "centro.step1t": "Initial Assessment",
    "centro.step1p": "We identify your current level and professional goals.",
    "centro.step2k": "STEP 2",
    "centro.step2t": "Personalized Plan",
    "centro.step2p": "We create a learning roadmap tailored to your needs.",
    "centro.step3k": "STEP 3",
    "centro.step3t": "Hands-on Training",
    "centro.step3p": "Learn with real cases and applicable projects.",
    "centro.step4k": "STEP 4",
    "centro.step4t": "Certification",
    "centro.step4p": "Get your certificate and move forward in your career.",

    // Catalog / filters
    "centro.catalogTitle": "Course Catalog",
    "centro.catalogSub": "Find the perfect program for you",
    "centro.filtersAria": "Course filters",
    "centro.filterAll": "All Courses",
    "centro.filterGestion": "Management",
    "centro.filterLiderazgo": "Leadership",
    "centro.filterFinanzas": "Finance",
    "centro.filterMarketing": "Marketing",

    // Badges / common
    "centro.badgeBeginner": "Beginner",
    "centro.badgeIntermediate": "Intermediate",
    "centro.badgeAdvanced": "Advanced",
    "centro.viewCourse": "View Course",
    "centro.students245": "(245 students)",
    "centro.students189": "(189 students)",
    "centro.students156": "(156 students)",
    "centro.students203": "(203 students)",
    "centro.students171": "(171 students)",
    "centro.students132": "(132 students)",

    // Courses
    "centro.course1Title": "Business Management",
    "centro.course1Desc": "Learn the foundations of modern business management with proven strategies.",
    "centro.course1Tag1": "Capstone project",
    "centro.course1Tag2": "Simulations",
    "centro.course1Tag3": "Lifetime access",
    "centro.course1Weeks": "10 weeks",
    "centro.course1Modules": "12 modules",

    "centro.course2Title": "Leadership & Teams",
    "centro.course2Desc": "Develop effective leadership skills and manage high-performance teams.",
    "centro.course2Tag1": "Real cases",
    "centro.course2Tag2": "Mentorship",
    "centro.course2Tag3": "Assessment",
    "centro.course2Weeks": "8 weeks",
    "centro.course2Modules": "10 modules",

    "centro.course3Title": "Business Strategy",
    "centro.course3Desc": "Master strategic planning and decision-making for growth.",
    "centro.course3Modules": "15 modules",

    "centro.course4Title": "Corporate Finance",
    "centro.course4Desc": "Understand financial principles and economic management in business environments.",
    "centro.course4Tag1": "Advanced Excel",
    "centro.course4Tag2": "Real analysis",
    "centro.course4Tag3": "Toolkit",
    "centro.course4Weeks": "12 weeks",
    "centro.course4Modules": "14 modules",

    "centro.course5Title": "Productivity & Management",
    "centro.course5Desc": "Build habits, systems, and KPIs to drive sustainable results.",
    "centro.course5Tag1": "Templates",
    "centro.course5Tag2": "KPIs",
    "centro.course5Tag3": "Routines",
    "centro.course5Weeks": "6 weeks",
    "centro.course5Modules": "9 modules",

    "centro.course6Title": "Growth Marketing",
    "centro.course6Desc": "Strategy, funnels, and optimization focused on measurable outcomes.",
    "centro.course6Tag1": "Growth",
    "centro.course6Tag2": "Funnel",
    "centro.course6Tag3": "Experiments",
    "centro.course6Weeks": "9 weeks",
    "centro.course6Modules": "11 modules",

    // Offer / form
    "centro.offerTitle": "What do we offer?",
    "centro.offer1Title": "Real Experience",
    "centro.offer1Desc": "Work on real projects with impact in the business world.",
    "centro.offer2Title": "Personalized Mentorship",
    "centro.offer2Desc": "Get guidance from experienced professionals in your area of interest.",
    "centro.offer3Title": "Certification",
    "centro.offer3Desc": "Earn certificates that validate your work experience.",
    "centro.offer4Title": "Possible Hiring",
    "centro.offer4Desc": "Opportunity to be hired by partner companies.",

    "centro.formTitle": "Quick application",
    "centro.formDesc": "Leave your details and attach your CV. (Real submission logic can be integrated later.)",
    "centro.fieldName": "Full name",
    "centro.phName": "Your name",
    "centro.fieldEmail": "Email",
    "centro.phEmail": "you@email.com",
    "centro.fieldArea": "Area of interest",
    "centro.areaPlaceholder": "Select an area",
    "centro.area1": "Human Resources",
    "centro.area2": "Organizational Development",
    "centro.area3": "Accounting Services",
    "centro.area4": "Legal Services",
    "centro.area5": "Marketing",
    "centro.fieldCV": "Attach CV",
    "centro.chooseFile": "Choose file",
    "centro.noFile": "No file chosen",
    "centro.sendCV": "Send CV",

    // Why choose us
    "centro.whyTitle": "Why choose us?",
    "centro.whySub": "Benefits that make the difference",
    "centro.benefit1Title": "Certified quality",
    "centro.benefit1Desc": "Programs aligned with professional standards.",
    "centro.benefit2Title": "Mentorship and community",
    "centro.benefit2Desc": "Support + professional networking.",
    "centro.benefit3Title": "Applicable projects",
    "centro.benefit3Desc": "Learning based on real practice.",

    // Testimonials
    "centro.testNote": "More than 2,500 professionals have transformed their careers",
    "centro.fiveStars": "5 stars",
    "centro.test1Quote":
      "“The courses helped me get promoted. The quality is outstanding and the content is highly applicable.”",
    "centro.test1Role": "Operations Manager — TechCorp",
    "centro.test2Quote":
      "“Excellent platform. Top-level instructors with real experience. Recommended to accelerate your career.”",
    "centro.test2Role": "Chief Executive Officer — Innovate Solutions",
    "centro.test3Quote":
      "“I’ve taken several courses and all exceeded my expectations. Practical and effective methodology.”",
    "centro.test3Role": "Business Consultant — Business Advisors",

    // Internships
    "centro.jobsPill": "Job Opportunities",
    "centro.internTitle": "Professional Internships",
    "centro.internSub": "Connect with leading companies and gain real-world experience",
    "centro.internHowTitle": "How does it work?",
    "centro.internStep1Title": "Submit your CV",
    "centro.internStep1Desc": "Complete your professional profile and upload your updated resume.",
    "centro.internStep2Title": "Assessment & Matching",
    "centro.internStep2Desc":
      "We evaluate your profile and connect you with opportunities aligned with your interests.",
    "centro.internStep3Title": "Start the Internship",
    "centro.internStep3Desc":
      "Begin in recognized companies with follow-up and continuous mentorship.",
    "centro.internBenefitsTitle": "Internship Benefits",
    "centro.internB1": "Real work experience",
    "centro.internB2": "Professional mentorship",
    "centro.internB3": "Possible hiring",
    "centro.internB4": "Internship certificate",
    "centro.internB5": "Professional network",
    "centro.sendMyCV": "Send my CV",
    "centro.companiesTitle": "Participating Companies",
    "centro.companiesSub": "Work with the best companies in the sector",

    // Final CTA
    "centro.finalOfferPill": "Limited-time offer",
    "centro.finalTitle": "Start your professional transformation today!",
    "centro.finalSub": "Join more than 2,500 professionals already advancing their careers.",
    "centro.finalBtnCourses": "View courses",
    "centro.finalBtnApply": "Apply",

    // FAQ
    "centro.faqTitle": "Frequently Asked Questions",
    "centro.faqSub": "Everything you need to know",
    "centro.faq1q": "Do I need prior experience to take the courses?",
    "centro.faq1a":
      "Not necessarily. We offer courses for all levels; each course indicates prerequisites.",
    "centro.faq2q": "Are the certificates internationally recognized?",
    "centro.faq2a":
      "Yes. They include unique verification and are aligned with professional standards.",
    "centro.faq3q": "How long do I have access to the course content?",
    "centro.faq3a":
      "Lifetime access to the course material, including future updates.",
    "centro.faq4q": "Do you offer payment plans or financing?",
    "centro.faq4a": "Yes. Flexible plans (up to 12 months) and corporate options.",
    "centro.faq5q": "What if I’m not satisfied with the course?",
    "centro.faq5a":
      "30-day satisfaction guarantee. If you’re not satisfied, we refund your investment.",
    "centro.faq6q": "Can I take multiple courses at the same time?",
    "centro.faq6a":
      "Yes. We recommend combining paths and bundles to optimize your learning.",
    "centro.moreQuestions": "Do you have more questions?",
    "centro.contactSupport": "Contact Support",

    // Footer
    "footer.desc":
      "Your strategic ally in integrated business solutions.<br />We transform organizations from the inside out.",
    "footer.hoursTitle": "Business hours",
    "footer.hoursValue": "Monday - Friday: 9:00 - 18:00",
    "footer.follow": "Follow us",
    "footer.company": "Company",
    "footer.servicesTitle": "Services",
    "footer.contactTitle": "Contact",
    "footer.contactLink": "Contact",
    "footer.s1": "Human Resources",
    "footer.s2": "Legal Services",
    "footer.s3": "Accounting Services",
    "footer.s4": "Organizational Development",
    "footer.soon": "<strong>Coming soon.</strong> No active branches were found.",
    "footer.phone": "Phone",
    "footer.email": "Email",
    "footer.maps": "View on Google Maps",
    "footer.rights": "© 2026 Bausen. All rights reserved",
    "footer.privacy": "Privacy policy",
    "footer.terms": "Terms of service",
    "footer.cookies": "Cookie policy",
  };

  // Snapshot de valores ES base (HTML) para poder volver a ES sin diccionario completo
  const I18N_DEFAULTS = { done: false };

  function snapshotI18nDefaults() {
    if (I18N_DEFAULTS.done) return;
    I18N_DEFAULTS.done = true;

    $$("[data-i18n]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultHtml) el.dataset.i18nDefaultHtml = el.innerHTML;
    });
    $$("[data-i18n-text]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultText) el.dataset.i18nDefaultText = el.textContent || "";
    });
    $$("[data-i18n-placeholder]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultPlaceholder) el.dataset.i18nDefaultPlaceholder = el.getAttribute("placeholder") || "";
    });
    $$("[data-i18n-aria]", document).forEach((el) => {
      if (!el.dataset.i18nDefaultAria) el.dataset.i18nDefaultAria = el.getAttribute("aria-label") || "";
    });
  }

  function applyTranslations(lang) {
    const L = String(lang || "ES").toUpperCase() === "EN" ? "EN" : "ES";

    // ES: restaurar defaults (HTML base)
    if (L === "ES") {
      $$("[data-i18n]", document).forEach((el) => {
        if (el.dataset.i18nDefaultHtml) el.innerHTML = el.dataset.i18nDefaultHtml;
      });
      $$("[data-i18n-text]", document).forEach((el) => {
        if (el.dataset.i18nDefaultText != null) el.textContent = el.dataset.i18nDefaultText;
      });
      $$("[data-i18n-placeholder]", document).forEach((el) => {
        if (el.dataset.i18nDefaultPlaceholder != null) el.setAttribute("placeholder", el.dataset.i18nDefaultPlaceholder);
      });
      $$("[data-i18n-aria]", document).forEach((el) => {
        if (el.dataset.i18nDefaultAria != null) el.setAttribute("aria-label", el.dataset.i18nDefaultAria);
      });
      return;
    }

    // EN: aplicar diccionario
    $$("[data-i18n]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.innerHTML = val;
    });

    $$("[data-i18n-text]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n-text");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.textContent = val;
    });

    $$("[data-i18n-placeholder]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.setAttribute("placeholder", val);
    });

    $$("[data-i18n-aria]", document).forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      const val = I18N_EN[key];
      if (val != null) el.setAttribute("aria-label", val);
    });
  }

    function renderLangOptions() {
    if (!langList) return;

    $$("#langList li", document).forEach((li) => {
      const code = normalizeLang(li.getAttribute("data-lang") || "ES");

      // Inyecta bandera + texto dentro del <li> (sin tocar IDs)
      li.innerHTML = `
        <span class="lang__opt-flag" aria-hidden="true">
          ${FLAG_SVG[code] || FLAG_SVG.ES}
        </span>
        <span class="lang__opt-text">${LANG_LABEL[code] || code} (${code})</span>
      `.trim();

      // Accesibilidad (opcional pero recomendado)
      li.setAttribute("aria-label", `${LANG_LABEL[code] || code} (${code})`);
    });
  }


  function setLang(code) {
    const raw = normalizeLang(code);
    const L = (raw === "EN" || raw === "ES") ? raw : "ES";

    if (langCode) langCode.textContent = L;

    // IMPORTANTE: ahora es SVG (innerHTML), no emoji (textContent)
    if (langFlag) langFlag.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;

    // lang semántico del documento
    document.documentElement.setAttribute("lang", LANG_TO_HTML[L] || (L === "EN" ? "en" : "es"));

    try { localStorage.setItem(LANG_KEY, L); } catch (_) {}

    // Traduce contenido (solo ES/EN)
    applyTranslations(L);
  }

  function openLang() {
    if (!langList || !langBtn) return;
    langList.style.display = "block";
    langBtn.setAttribute("aria-expanded", "true");
  }
  function closeLang() {
    if (!langList || !langBtn) return;
    langList.style.display = "none";
    langBtn.setAttribute("aria-expanded", "false");
  }
  function toggleLang() {
    if (!langList || !langBtn) return;
    const open = langBtn.getAttribute("aria-expanded") === "true";
    open ? closeLang() : openLang();
  }

  function initLang() {
    if (!langBtn || !langList) return;

    // Snapshot base ES (antes de traducir)
    snapshotI18nDefaults();

    // Restore
    let saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (_) {}
    setLang(saved || (langCode ? langCode.textContent : "ES"));
    renderLangOptions();
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLang();
    });

    // Pick (lee tus <li data-lang="XX">)
    $$("#langList li", document).forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = normalizeLang(li.getAttribute("data-lang") || "ES");
        // Solo soportamos ES/EN en esta página (según requerimiento)
        if (code !== "ES" && code !== "EN") {
          closeLang();
          return;
        }
        setLang(code);
        closeLang();
      });
    });

    // Close outside
    document.addEventListener("click", () => closeLang());

    // ESC close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLang();
    });
  }


  /* -------------------------
     Mobile menu
  ------------------------- */
  function lockScroll(locked) {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    body.style.overflow = locked ? "hidden" : "";
  }

  function openMenu() {
    if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;

    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");

    mobileMenuOverlay.hidden = false;
    // allow CSS transition
    requestAnimationFrame(() => mobileMenuOverlay.classList.add("show"));

    menuToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);

    // focus first link
    const first = $(".mobile-nav__link", mobileMenu);
    if (first) setTimeout(() => first.focus(), 50);
  }

  function closeMenu() {
    if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;

    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");

    mobileMenuOverlay.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    lockScroll(false);

    // hide overlay after fade
    setTimeout(() => { mobileMenuOverlay.hidden = true; }, 220);

    // return focus
    menuToggle.focus();
  }

  function initMobileMenu() {
    if (!menuToggle || !mobileMenu || !mobileMenuOverlay) return;

    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
      
    });

    if (menuClose) menuClose.addEventListener("click", closeMenu);

    mobileMenuOverlay.addEventListener("click", closeMenu);

    // Close when clicking a link
    $$(".mobile-nav__link", mobileMenu).forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        if (expanded) closeMenu();
      }
    });

    // Safety: on resize to desktop, close
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        if (expanded) closeMenu();
      }
    });
  }

  /* -------------------------
     Reveal on scroll
  ------------------------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((el) => io.observe(el));
  }

  /* -------------------------
     Tilt effect (lightweight)
  ------------------------- */
  function initTilt() {
    if (prefersReducedMotion) return;

    const els = $$("[data-tilt]");
    if (!els.length) return;

    const max = 8; // degrees
    const scale = 1.01;

    const onMove = (e, el) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1

      const rx = (py - 0.5) * -2 * max;
      const ry = (px - 0.5) *  2 * max;

      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
    };

    const onLeave = (el) => {
      el.style.transform = "";
    };

    els.forEach((el) => {
      el.style.willChange = "transform";
      el.addEventListener("mousemove", (e) => onMove(e, el));
      el.addEventListener("mouseleave", () => onLeave(el));
      el.addEventListener("blur", () => onLeave(el), true);
    });
  }

  /* -------------------------
     Course filters
  ------------------------- */
  function updateCounts() {
    // Optional: update the "Todos (N)" count dynamically if you change courses later
    const countAll = $("#countAll");
    if (!countAll) return;
    countAll.textContent = `(${courses.length})`;
  }

  function applyFilter(filter) {
    courses.forEach((card) => {
      const cat = (card.getAttribute("data-cat") || "").toLowerCase();
      const show = filter === "all" ? true : cat === filter;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function initFilters() {
    if (!chips.length || !courses.length) return;

    updateCounts();

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");

        const filter = (chip.getAttribute("data-filter") || "all").toLowerCase();
        applyFilter(filter);
      });
    });
  }

  /* -------------------------
     CV form: file name + validation
  ------------------------- */
  function setFormMsg(type, text) {
    if (!cvMsg) return;
    cvMsg.classList.remove("is-ok", "is-bad");
    if (type === "ok") cvMsg.classList.add("is-ok");
    if (type === "bad") cvMsg.classList.add("is-bad");
    cvMsg.textContent = text || "";
  }

  function initCVForm() {
    if (!cvForm) return;

    if (cvFile && cvFileName) {
      cvFile.addEventListener("change", () => {
        const f = cvFile.files && cvFile.files[0];
        cvFileName.textContent = f ? f.name : "No se eligió ningún archivo";
      });
    }

    cvForm.addEventListener("submit", (e) => {
      e.preventDefault();
      setFormMsg("", "");

      const name = $("input[name='name']", cvForm);
      const email = $("input[name='email']", cvForm);
      const area = $("select[name='area']", cvForm);

      const errors = [];

      if (!name || !name.value.trim()) errors.push("Escribe tu nombre completo.");
      if (!email || !email.value.trim()) errors.push("Escribe un correo válido.");
      else {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        if (!ok) errors.push("El correo no parece válido.");
      }
      if (!area || !area.value) errors.push("Selecciona un área de interés.");

      // Archivo opcional (según tu copy). Si quieres hacerlo obligatorio, descomenta:
      // if (!cvFile || !cvFile.files || !cvFile.files[0]) errors.push("Adjunta tu CV.");

      if (errors.length) {
        setFormMsg("bad", errors[0]);
        return;
      }

      // UX placeholder (sin backend)
      setFormMsg("ok", "Listo. Tu postulación fue capturada (demo). Integraremos el envío real después.");
      cvForm.reset();
      if (cvFileName) cvFileName.textContent = "No se eligió ningún archivo";
    });
  }

  /* -------------------------
     FAQ accordion
  ------------------------- */
  function initFAQ() {
    if (!faq) return;
    const items = $$(".faq__item", faq);
    if (!items.length) return;

    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        // Close others (accordion)
        items.forEach((b) => b.setAttribute("aria-expanded", "false"));
        // Toggle current
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  /* -------------------------
     Smooth anchor scroll with header offset
  ------------------------- */
  function getHeaderOffset() {
    if (!header) return 0;
    const rect = header.getBoundingClientRect();
    return Math.ceil(rect.height) + 10;
  }

  function smoothScrollTo(hash) {
    const target = $(hash);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function initAnchors() {
    // internal anchors only
    $$("a[href^='#']").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(href);
      });
    });

    // If page loads with hash
    if (location.hash) {
      setTimeout(() => smoothScrollTo(location.hash), 40);
    }
  }

  /* -------------------------
     Init
  ------------------------- */
  function init() {
    initTheme();
    initLang();
    initMobileMenu();
    initReveal();
    initTilt();
    initFilters();
    initCVForm();
    initFAQ();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
