/* scripbeca.js — BAUSEN (compatible con tu HTML/CSS actual)
   Incluye:
   - Loader (con failsafe)
   - Tema (persistente)
   - Idioma (dropdown + select móvil, persistente)
   - Menú móvil (overlay + ESC + bloqueo scroll)
   - Active link por data-page (corrige indexbeca/index)
   - Año en footer
   - Reveal on scroll (data-animate + data-delay)
   - Scroll indicator (baja a la siguiente sección real)
   - Cursor custom (desktop) + estados hover/interactive
   - Parallax hero (media-card + orbs)
   - Tabs Training Center (3 panels + dots)
   - Carrusel Reconocimientos (scroll + drag + indicadores clic + auto update)
   - Botón “Reintentar” del mapa (UI)
   - Formulario contacto (validación simple + status)
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
     Elements
  ========================= */
  // Loader / Theme
  const pageLoader = $("#page-loader");
  const themeToggle = $("#theme-toggle");

  // Language
  const languageBtn = $("#language-btn");
  const languageDropdown = $("#language-dropdown");
  const languageOptions = $$(".language-option");
  const languageCode = $("#language-code");
  const mobileLanguageSelect = $("#mobile-language-select");

  // Mobile menu
  // --- Cerrar menú al navegar y mantener la sección actual (sin saltos raros) ---
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    // cierra drawer
    document.body.classList.remove('menu-open');
    document.querySelector('.mobile-menu-overlay')?.classList.remove('show');
    document.querySelector('.mobile-menu')?.classList.remove('open');

    // actualiza aria
    const btn = document.getElementById('menu-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
});

// Evita que el botón hamburguesa haga “jump” si por error es un <a> o si hay default
const menuBtn = document.getElementById('menu-toggle');
if (menuBtn) {
  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
  });
}


  // Nav + footer year
  const mainNavLinks = $$(".nav-link, .mobile-nav-link");
  const currentYear = $("#current-year");

  // Cursor
  const cursorDot = $("#cursor-dot");
  const cursorRing = $("#cursor-ring");

  // Hero
  const hero = $("#hero");
  const mediaCard = $("#media-card");
  const orb1 = $(".hero-orb-1");
  const orb2 = $(".hero-orb-2");
  const orb3 = $(".hero-orb-3");

  // Scroll indicator
  const scrollIndicator = $(".scroll-indicator");

  // Training
  const trainingRoot = $("#training");
  const trainingTabs = trainingRoot ? $$(".training-tab", trainingRoot) : [];
  const trainingPanels = trainingRoot ? $$(".training-panel", trainingRoot) : [];

  // Awards
  const awardsRoot = $("#awards");
  const awardsTrack = awardsRoot ? $(".awards-track", awardsRoot) : null;
  const awardCards = awardsTrack ? $$(".award-card", awardsTrack) : [];
  const awardIndicators = awardsRoot ? $$(".award-indicator", awardsRoot) : [];

  // Contact
  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");
  const mapRetryBtn = $(".contact-map-retry");

  /* =========================
     Loader
  ========================= */
  function initLoader() {
    if (!pageLoader) return;

    // Bloquea scroll mientras carga
    body.style.overflow = "hidden";

    const hide = () => {
      // Evita múltiples ejecuciones
      if (pageLoader.classList.contains("hidden")) return;

      // Transición suave: tu CSS maneja opacity/visibility
      pageLoader.classList.add("hidden");
      body.style.overflow = "";
    };

    // Si ya cargó, ocultar; si no, al load
    if (document.readyState === "complete") {
      setTimeout(hide, prefersReducedMotion ? 120 : 350);
    } else {
      window.addEventListener(
        "load",
        () => setTimeout(hide, prefersReducedMotion ? 120 : 350),
        { once: true }
      );
    }

    // Failsafe
    setTimeout(hide, 3500);
  }

  /* =========================
     Theme (persist)
  ========================= */
  function initTheme() {
    const KEY = "theme"; // mantengo tu key existente

    const apply = (mode) => {
      const isDark = mode === "dark";
      body.classList.toggle("theme-dark", isDark);
      storage.set(KEY, isDark ? "dark" : "light");
    };

    // Load saved or OS preference
    const saved = storage.get(KEY);
    if (saved === "dark" || saved === "light") {
      apply(saved);
    } else {
      const osDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
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
     Language (persist)
  ========================= */
  function initLanguage() {
    const KEY = "preferred-language"; // mantengo tu key existente

    const setLang = (lang) => {
      const safe = String(lang || "ES").toUpperCase();
      storage.set(KEY, safe);
      if (languageCode) languageCode.textContent = safe;
      if (mobileLanguageSelect) mobileLanguageSelect.value = safe;
    };

    // init
    setLang(storage.get(KEY, "ES"));

    // Desktop dropdown
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

      // Close outside + ESC
      document.addEventListener("click", (e) => {
        if (!languageDropdown.classList.contains("show")) return;
        if (languageBtn.contains(e.target) || languageDropdown.contains(e.target)) return;
        close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }

    // Mobile select
    if (mobileLanguageSelect) {
      mobileLanguageSelect.addEventListener("change", (e) => setLang(e.target.value));
    }
  }

 /* =========================
   Mobile menu (FIX definitivo sin romper JS)
========================= */
function initMobileMenu() {
  // Fallbacks: soporta IDs y clases alternas
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
    // Scroll lock sólido
    rootEl.style.overflow = locked ? "hidden" : "";
    bodyEl.style.overflow = locked ? "hidden" : "";
    bodyEl.classList.toggle("menu-open", locked);
  };

  const openMenu = () => {
    panel.classList.add("open");
    overlay.classList.add("show");
    toggleBtn.setAttribute("aria-expanded", "true");
    setLocked(true);

    // focus primer link (accesibilidad)
    window.setTimeout(() => {
      const firstLink =
        panel.querySelector(".mobile-nav-link") ||
        panel.querySelector("a[href]") ||
        panel.querySelector("button");
      if (firstLink) firstLink.focus();
    }, 80);
  };

  const closeMenuFn = () => {
    panel.classList.remove("open");
    overlay.classList.remove("show");
    toggleBtn.setAttribute("aria-expanded", "false");
    setLocked(false);

    // regresa focus al botón
    window.setTimeout(() => toggleBtn.focus(), 0);
  };

  const toggleMenu = (e) => {
    if (e) e.preventDefault();
    const isOpen = panel.classList.contains("open");
    isOpen ? closeMenuFn() : openMenu();
  };

  // Limpia listeners duplicados si recargas scripts (defensivo)
  toggleBtn.removeEventListener("click", toggleMenu);
  toggleBtn.addEventListener("click", toggleMenu);

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenuFn();
    });
  }

  overlay.addEventListener("click", closeMenuFn);

  // Cierra al click en links del panel (solo si son links)
  panel.querySelectorAll("a, .mobile-nav-link").forEach((el) => {
    el.addEventListener("click", () => closeMenuFn());
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closeMenuFn();
  });

  // Si pasa a desktop, cierra y limpia
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && panel.classList.contains("open")) {
      closeMenuFn();
    }
  });
}


  /* =========================
     Active link (data-page)
     Corrige: indexbeca.html tiene data-page="index"
  ========================= */
  function initActiveLink() {
    const file = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const pageNoExt = file.replace(".html", "").replace(".htm", "");

    // Normalizaciones típicas de tu proyecto
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
     Reveal animations (data-animate + data-delay)
     Tu CSS ya hace transición; aquí solo agregamos is-visible.
  ========================= */
  function initReveal() {
    const els = $$("[data-animate]");
    if (!els.length) return;

    // Aplica delay via inline (para que funcione incluso si cambias CSS)
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
     Scroll indicator -> siguiente sección real
  ========================= */
  function initScrollIndicator() {
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener("click", () => {
      // busca la siguiente sección después del hero
      const heroSection = hero || $(".hero");
      const next =
        (heroSection && heroSection.nextElementSibling) ||
        $("#services") ||
        $(".services") ||
        $("main section:nth-of-type(2)");

      if (next) {
        next.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      } else {
        window.scrollTo({
          top: window.innerHeight * 0.9,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    });
  }

  /* =========================
     Custom Cursor (IMPORTANTE)
     Tu CSS base usa translate(-50%,-50%), así que lo conservamos al setear transform.
  ========================= */
  function initCursor() {
    if (!cursorDot || !cursorRing) return;
    if (!hasFinePointer || prefersReducedMotion) return;

    body.classList.add("has-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX,
      dotY = mouseY;
    let ringX = mouseX,
      ringY = mouseY;

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
      // dot más pegado, ring más suave
      dotX += (mouseX - dotX) * 0.6;
      dotY += (mouseY - dotY) * 0.6;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      setPos(cursorDot, dotX, dotY);
      setPos(cursorRing, ringX, ringY);

      raf = null;
    };

    const isInteractive = (t) =>
      !!t.closest(
        "a, button, input, textarea, select, .btn, [role='button'], .service-card, .social-card, .training-tab, .award-card"
      );

    const isSoftInteractive = (t) =>
      !!t.closest(".media-card, .nav-link, .language-btn, .theme-toggle");

    const onOver = (e) => {
      const t = e.target;
      cursorRing.classList.toggle("hover", isInteractive(t));
      cursorRing.classList.toggle("interactive", isSoftInteractive(t));
    };

    const onOut = () => {
      cursorRing.classList.remove("hover", "interactive");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
  }

  /* =========================
     Hero parallax (media + orbs)
  ========================= */
  function initHeroParallax() {
    if (!hero || !mediaCard) return;
    if (!hasFinePointer || prefersReducedMotion) return;

    let raf = null;
    let tx = 0;
    let ty = 0;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      tx = Math.max(-0.6, Math.min(0.6, x));
      ty = Math.max(-0.6, Math.min(0.6, y));

      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;

        // Media card (ligero)
        mediaCard.style.transform = `translate3d(${tx * 12}px, ${ty * 9}px, 0)`;

        // Orbs (más profundo)
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
// taning esta aprte es de la seccion 3  de  la apgina principal 
  /* =========================
     Training tabs (3 panels)
  ========================= */
 function initTrainingTabs() {
  if (!trainingRoot || !trainingTabs.length || !trainingPanels.length) return;

  const AUTO_MS = 5200; // tiempo de cambio automático
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
    const tab = trainingTabs.find((t) => (t.dataset.tab || "").toLowerCase() === key);
    return tab ? (tab.querySelector("span")?.textContent || "").trim() : "";
  };

  const setLeftTitle = (key) => {
    const leftTitle = $(".training-image-title", trainingRoot);
    const label = tabLabelFromKey(key);
    if (leftTitle && label) leftTitle.textContent = label;
  };

  const setDotsActive = (key) => {
    if (!dots.length) return;
    dots.forEach((b) => {
      b.classList.toggle("is-active", (b.dataset.go || "").toLowerCase() === key);
    });
  };

  const resetProgress = () => {
    if (!progressBar || prefersReducedMotion) return;

    progressBar.style.animation = "none";
    progressBar.style.width = "0%";
    progressBar.offsetHeight; // reflow
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
      showPanel(next, true);
    }, AUTO_MS);
  };

  const syncLeftIcon = (key) => {
    const leftIconWrap = trainingRoot
      ? trainingRoot.querySelector(".training-card-left .training-image-icon")
      : null;

    const activeTab = trainingTabs.find(
      (t) => (t.dataset.tab || "").toLowerCase() === key
    );

    if (leftIconWrap && activeTab && activeTab.dataset.icon) {
      let leftI = leftIconWrap.querySelector("i");

      if (!leftI) {
        leftI = document.createElement("i");
        leftI.setAttribute("aria-hidden", "true");
        leftIconWrap.innerHTML = "";
        leftIconWrap.appendChild(leftI);
      }

      leftI.className = activeTab.dataset.icon;

      leftIconWrap.classList.add("is-swap");
      setTimeout(() => leftIconWrap.classList.remove("is-swap"), 180);
    }
  };

  const showPanel = (key, fromAuto = false) => {
    currentKey = key;

    // Tabs active
    trainingTabs.forEach((tab) => {
      const is = (tab.dataset.tab || "").toLowerCase() === key;
      tab.classList.toggle("is-active", is);
      tab.setAttribute("aria-selected", is ? "true" : "false");
    });
    // === FIX DEFINITIVO: re-render del icono grande izquierdo ===
const leftIconWrap = trainingRoot
  ? trainingRoot.querySelector(".training-card-left .training-image-icon")
  : null;

const activeTab = trainingTabs.find(
  (t) => (t.dataset.tab || "").toLowerCase() === key
);

if (leftIconWrap && activeTab && activeTab.dataset.icon) {
  // 1) Reemplaza el contenido (esto funciona aunque FA convierta a SVG)
  leftIconWrap.innerHTML = `<i class="${activeTab.dataset.icon}" aria-hidden="true"></i>`;

  // 2) Si FontAwesome JS está activo, fuerza el refresh del nodo
  if (window.FontAwesome && window.FontAwesome.dom && typeof window.FontAwesome.dom.i2svg === "function") {
    window.FontAwesome.dom.i2svg({ node: leftIconWrap });
  }

  // 3) micro-swap opcional
  leftIconWrap.classList.add("is-swap");
  setTimeout(() => leftIconWrap.classList.remove("is-swap"), 180);
}
console.log("Icon key:", key, "icon:", activeTab?.dataset?.icon);


    // ✅ Icono izquierdo sincronizado
    syncLeftIcon(key);

    // Panels fade
    const currentActive = trainingPanels.find((p) => p.classList.contains("is-active"));

    trainingPanels.forEach((panel) => {
      const pKey = keyFromId(panel.id);
      const shouldBeActive = pKey === key;

      if (shouldBeActive) {
        panel.removeAttribute("hidden");
        panel.classList.remove("is-active");
        panel.offsetHeight; // reflow
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

    // Title + dots + progress
    setLeftTitle(key);
    setDotsActive(key);
    resetProgress();

    // Auto
    startAuto();
  };

  // Click tabs
  trainingTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = (tab.dataset.tab || "").toLowerCase();
      if (!key) return;
      showPanel(key, false);
    });
  });

  // Click dots
  if (dots.length) {
    dots.forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key = (b.dataset.go || "").toLowerCase();
        if (!key) return;
        showPanel(key, false);
      });
    });
  }

  // Init
  const initialTab = trainingTabs.find((t) => t.classList.contains("is-active")) || trainingTabs[0];
  const initialKey = (initialTab?.dataset.tab || "becarios").toLowerCase();
  showPanel(initialKey, false);
}


  /* =========================
     Awards carousel (scroll + indicadores)
  ========================= */
  function initAwardsCarousel() {
    if (!awardsTrack || !awardCards.length) return;

    const canScroll = () => awardsTrack.scrollWidth > awardsTrack.clientWidth + 5;

    const setIndicator = (idx) => {
      if (!awardIndicators.length) return;
      awardIndicators.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };

    // Mapea cardIndex (0..cards-1) a dotIndex (0..dots-1)
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

    // Click dots -> scroll a card aproximada
    if (awardIndicators.length) {
      awardIndicators.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          if (!awardCards.length) return;

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

    // Drag scroll (mouse)
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

    // Touch drag
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

    // Scroll -> update indicators (throttle)
    let st = null;
    awardsTrack.addEventListener("scroll", () => {
      if (st) clearTimeout(st);
      st = setTimeout(updateIndicators, 90);
    });

    // init
    updateIndicators();
  }

  /* =========================
     Map retry (solo UI)
  ========================= */
  function initMapRetry() {
    if (!mapRetryBtn) return;

    mapRetryBtn.addEventListener("click", () => {
      const old = mapRetryBtn.textContent;
      mapRetryBtn.disabled = true;
      mapRetryBtn.textContent = "Reintentando…";

      setTimeout(() => {
        mapRetryBtn.disabled = false;
        mapRetryBtn.textContent = old;
      }, 900);
    });
  }

  /* =========================
     Contact form validation (UI)
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

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = ($("#fullName")?.value || "").trim();
      const email = ($("#email")?.value || "").trim();
      const message = ($("#message")?.value || "").trim();

      if (!fullName || !email || !message) {
        setStatus("Por favor completa tu nombre, email y mensaje.", false);
        return;
      }
      if (!isEmail(email)) {
        setStatus("Por favor ingresa un email válido.", false);
        return;
      }

      // Aquí conectas tu backend si quieres.
      setStatus("Mensaje enviado. Nos pondremos en contacto a la brevedad.", true);
      contactForm.reset();

      setTimeout(() => setStatus("", true), 4500);
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
// =========================
// CONTACTO: Reintentar mapa + validación simple
// =========================
(() => {
  // Reintentar mapa
  const retryBtn = document.querySelector('.contact-map-retry');
  const alertBox = document.querySelector('.contact-map-alert');
  const mapIframe = document.querySelector('.contact-map-frame iframe');

  if (retryBtn && mapIframe) {
    retryBtn.addEventListener('click', () => {
      // Oculta el aviso (si lo quieres permanente, elimina esta línea)
      if (alertBox) alertBox.style.display = 'none';

      // Recarga el iframe evitando caché
      const src = mapIframe.getAttribute('src') || '';
      const clean = src.split('&_t=')[0];
      mapIframe.setAttribute('src', `${clean}&_t=${Date.now()}`);
    });
  }

  // Validación mínima del formulario (si luego lo conectas a backend, mantén esto)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      const nameVal = fullName?.value.trim() || '';
      const emailVal = email?.value.trim() || '';
      const msgVal = message?.value.trim() || '';

      if (status) status.textContent = '';

      // Reglas mínimas (ajusta si deseas)
      if (nameVal.length < 3) {
        if (status) status.textContent = 'Por favor, ingresa tu nombre completo.';
        fullName?.focus();
        return;
      }
      if (!isEmail(emailVal)) {
        if (status) status.textContent = 'Por favor, ingresa un correo válido.';
        email?.focus();
        return;
      }
      if (msgVal.length < 10) {
        if (status) status.textContent = 'Cuéntanos un poco más (mínimo 10 caracteres).';
        message?.focus();
        return;
      }

      // Placeholder: aquí luego conectas a tu backend / EmailJS / etc.
      if (status) status.textContent = 'Listo. Tu mensaje está listo para enviarse (pendiente de integración).';
      form.reset();
    });
  }
})();
// === CONTACT MAP: Retry button with loading + always "no branches" ===
(() => {
  const btn = document.getElementById("mapRetryBtn");
  const alertBox = document.querySelector(".contact-map-alert");
  const title = alertBox?.querySelector(".contact-map-alert-title");

  if (!btn || !alertBox || !title) return;

  const DEFAULT_MSG = "No se encontraron sucursales activas";

  btn.addEventListener("click", () => {
    if (btn.classList.contains("is-loading")) return;

    // set loading
    btn.classList.add("is-loading");
    btn.disabled = true;

    // opcional: feedback en el mensaje
    title.textContent = "Buscando sucursales…";

    // simula carga tipo "cargando página"
    window.setTimeout(() => {
      // no hay sucursales -> volvemos al estado original
      title.textContent = DEFAULT_MSG;

      btn.classList.remove("is-loading");
      btn.disabled = false;
    }, 1100);
  });
})();
