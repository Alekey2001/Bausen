/* scripbeca.js — BAUSEN (con i18n + Netlify Forms)
   Incluye:
   - Loader (con failsafe)
   - Tema (persistente)
   - Idioma (i18n real + banderas + persistencia)
   - Menú móvil (overlay + ESC + bloqueo scroll)
   - Active link por data-page
   - Año en footer
   - Reveal on scroll (data-animate + data-delay)
   - Scroll indicator
   - Cursor custom (desktop)
   - Parallax hero
   - Tabs Training Center (3 panels + dots + auto)
   - Carrusel Reconocimientos (scroll + drag + indicadores)
   - Botón “Reintentar” del mapa (UI)
   - Formulario contacto: Netlify Forms + honeypot + status (AJAX)
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
     i18n (traducción real + banderas)
  ========================= */
  const I18N = {
    ES: {
      "nav.home": "Inicio",
      "nav.press": "Prensa",
      "nav.services": "Servicios",
      "nav.news": "Noticias",
      "nav.training": "Centro de Formación",
      "nav.about": "Acerca de",

      "hero.pill": "Soluciones empresariales integrales",
      "hero.title": "Impulsamos<br /><span class='hero-accent'>tu talento</span>",
      "hero.subtitle":
        "Capital Humano, Desarrollo Organizacional y Management<br />Servicios para cada etapa de tu crecimiento.",
      "hero.ctaServices": "Ver Servicios",
      "hero.ctaContact": "Contactar",

      "form.fullNamePh": "Tu nombre completo",
      "form.emailPh": "tu@email.com",
      "form.messagePh": "¿En qué podemos ayudarte?",
      "form.send": "Enviar mensaje",

      "form.err.required": "Por favor completa tu nombre, email y mensaje.",
      "form.err.email": "Por favor ingresa un email válido.",
      "form.ok": "Mensaje enviado. Nos pondremos en contacto a la brevedad.",
      "form.sending": "Enviando…",
      "form.fail": "Ocurrió un error. Por favor intenta de nuevo.",
    },

    EN: {
      "nav.home": "Home",
      "nav.press": "Press",
      "nav.services": "Services",
      "nav.news": "News",
      "nav.training": "Training Center",
      "nav.about": "About",

      "hero.pill": "Integrated business solutions",
      "hero.title": "We empower<br /><span class='hero-accent'>your talent</span>",
      "hero.subtitle":
        "Human Capital, Organizational Development and Management<br />Services for every growth stage.",
      "hero.ctaServices": "View Services",
      "hero.ctaContact": "Contact",

      "form.fullNamePh": "Full name",
      "form.emailPh": "you@email.com",
      "form.messagePh": "How can we help you?",
      "form.send": "Send message",

      "form.err.required": "Please complete your name, email and message.",
      "form.err.email": "Please enter a valid email.",
      "form.ok": "Message sent. We’ll contact you shortly.",
      "form.sending": "Sending…",
      "form.fail": "Something went wrong. Please try again.",
    },
  };

  // Banderas SVG sencillas (ligeras)
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

  const t = (lang, key) => {
    const L = I18N[lang] || I18N.ES;
    return L[key] ?? (I18N.ES[key] ?? key);
  };

  function applyTranslations(lang) {
    // Textos (innerHTML para soportar <br />)
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.innerHTML = t(lang, key);
    });

    // Placeholders
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", t(lang, key));
    });

    // Bandera del botón principal (requiere #language-flag)
    const flagEl = $("#language-flag");
    if (flagEl) flagEl.innerHTML = FLAG_SVG[lang] || FLAG_SVG.ES;

    // Banderas en dropdown: pon spans con data-flag="ES"/"EN"/...
    $$("[data-flag]").forEach((el) => {
      const code = (el.getAttribute("data-flag") || "ES").toUpperCase();
      el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
    });

    // lang attr: mínimo viable
    document.documentElement.setAttribute("lang", lang === "EN" ? "en" : "es");
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
    if (saved === "dark" || saved === "light") {
      apply(saved);
    } else {
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
      const toggle = () => {
        const expanded = languageBtn.getAttribute("aria-expanded") === "true";
        expanded ? close() : open();
      };

      languageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
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
      document.getElementById("menu-toggle") || document.querySelector(".menu-toggle") || document.querySelector(".nav__toggle");

    const panel =
      document.getElementById("mobile-menu") || document.querySelector(".mobile-menu") || document.querySelector(".nav__panel");

    const overlay =
      document.getElementById("mobile-menu-overlay") ||
      document.querySelector(".mobile-menu-overlay") ||
      document.querySelector(".nav__overlay");

    const closeBtn =
      document.getElementById("close-menu") || document.querySelector(".close-menu") || document.querySelector(".nav__close");

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

    const toggleMenu = (e) => {
      if (e) e.preventDefault();
      panel.classList.contains("open") ? closeMenuFn() : openMenu();
    };

    toggleBtn.addEventListener("click", toggleMenu);

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
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener("click", () => {
      const heroSection = hero || $(".hero");
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
      !!tEl.closest("a, button, input, textarea, select, .btn, [role='button'], .service-card, .social-card, .training-tab, .award-card");

    const isSoftInteractive = (tEl) =>
      !!tEl.closest(".media-card, .nav-link, .language-btn, .theme-toggle");

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
    if (!hero || !mediaCard) return;
    if (!hasFinePointer || prefersReducedMotion) return;

    let raf = null;
    let tx = 0, ty = 0;

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
     Training tabs
  ========================= */
  function initTrainingTabs() {
    if (!trainingRoot || !trainingTabs.length || !trainingPanels.length) return;

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

    const setLeftTitle = (key) => {
      const leftTitle = $(".training-image-title", trainingRoot);
      const label = tabLabelFromKey(key);
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

      // icono izquierdo grande
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

      setLeftTitle(key);
      setDotsActive(key);
      resetProgress();
      startAuto();
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

      const alertBox = document.querySelector(".contact-map-alert");
      const title = alertBox?.querySelector(".contact-map-alert-title");
      const DEFAULT_MSG = "No se encontraron sucursales activas";

      if (title) title.textContent = "Buscando sucursales…";

      setTimeout(() => {
        if (title) title.textContent = DEFAULT_MSG;
        btn.classList.remove("is-loading");
        btn.disabled = false;
      }, 1100);
    });
  }

  /* =========================
     Contact form => Netlify Forms (AJAX robusto)
     - Envía TODOS los campos del form (incluye honeypot y form-name)
     - Si bot-field trae contenido => no manda
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

    // Convierte FormData a x-www-form-urlencoded
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

      // honeypot: si tiene contenido => bot
      const botField = contactForm.querySelector("input[name='bot-field']");
      if (botField && String(botField.value || "").trim().length > 0) {
        // Silencioso (anti-spam)
        return;
      }

      const btn = $("#contactSubmitBtn") || contactForm.querySelector("button[type='submit']");
      const oldBtnHTML = btn ? btn.innerHTML : "";

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>${t(lang, "form.sending")}</span>`;
      }
      setStatus("", true);

      try {
        // Enviar TODO el form, incluyendo:
        // - form-name (hidden)
        // - bot-field (honeypot)
        // - fullName/email/message
        const formData = new FormData(contactForm);

        const res = await fetch("/", {
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
