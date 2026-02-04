/**
 * BAUSEN - Servicios Especializados
 * Frontend interactivo vanilla JS (2026)
 * Senior Front-End / UI Engineer
 */

'use strict';

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const SCROLL_THRESHOLD = 100;
const TO_TOP_THRESHOLD = 500;
const OBSERVER_THRESHOLD = 0.1;
const OBSERVER_ROOT_MARGIN = '50px';

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
  isMenuOpen: false,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isScrolled: false,
  toTopVisible: false
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  header: document.querySelector('[data-header]'),
  navToggle: document.querySelector('[data-nav-toggle]'),
  navMenu: document.querySelector('[data-nav-menu]'),
  toTop: document.querySelector('[data-to-top]'),
  yearSpan: document.getElementById('year')
};

// ============================================
// UTILITIES
// ============================================

const utils = {
  /**
   * Debounce para optimizar eventos de scroll/resize
   */
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /**
   * Throttle para eventos que necesitan ser limitados
   */
  throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Verifica si un elemento está en viewport
   */
  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= offset
    );
  },

  /**
   * Scroll suave a un elemento
   */
  smoothScrollTo(target) {
    if (state.prefersReducedMotion) {
      target.scrollIntoView();
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  },

  /**
   * Toggle body scroll
   */
  toggleBodyScroll(enable) {
    document.body.style.overflow = enable ? '' : 'hidden';
  },

  /**
   * Set aria attributes para accesibilidad
   */
  setAriaExpanded(element, expanded) {
    element.setAttribute('aria-expanded', expanded);
  }
};

// ============================================
// HEADER SCROLL EFFECT
// ============================================

const headerScrollHandler = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const shouldBeScrolled = scrollY > SCROLL_THRESHOLD;

  if (shouldBeScrolled !== state.isScrolled) {
    state.isScrolled = shouldBeScrolled;
    elements.header.classList.toggle('scrolled', shouldBeScrolled);
  }
};

// ============================================
// TO TOP BUTTON
// ============================================

const toTopHandler = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const shouldBeVisible = scrollY > TO_TOP_THRESHOLD;

  if (shouldBeVisible !== state.toTopVisible) {
    state.toTopVisible = shouldBeVisible;
    elements.toTop.classList.toggle('visible', shouldBeVisible);
  }
};

const scrollToTop = () => {
  if (state.prefersReducedMotion) {
    window.scrollTo(0, 0);
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// ============================================
// MOBILE MENU
// ============================================

const toggleMobileMenu = () => {
  state.isMenuOpen = !state.isMenuOpen;
  
  // Toggle aria attributes
  utils.setAriaExpanded(elements.navToggle, state.isMenuOpen);
  elements.navMenu.setAttribute('data-visible', state.isMenuOpen);
  
  // Toggle body scroll
  utils.toggleBodyScroll(!state.isMenuOpen);
  
  // Focus management
  if (state.isMenuOpen) {
    const firstLink = elements.navMenu.querySelector('a');
    firstLink?.focus();
  }
};

const closeMobileMenu = () => {
  if (!state.isMenuOpen) return;
  
  state.isMenuOpen = false;
  utils.setAriaExpanded(elements.navToggle, false);
  elements.navMenu.setAttribute('data-visible', false);
  utils.toggleBodyScroll(true);
};

const handleMenuLinkClick = (event) => {
  if (event.target.matches('.nav__link')) {
    closeMobileMenu();
    
    // Smooth scroll para enlaces internos
    const href = event.target.getAttribute('href');
    if (href.startsWith('#')) {
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) utils.smoothScrollTo(target);
    }
  }
};

// ============================================
// INTERSECTION OBSERVER PARA REVEAL ANIMATIONS
// ============================================

const createIntersectionObserver = () => {
  const observerOptions = {
    root: null,
    rootMargin: OBSERVER_ROOT_MARGIN,
    threshold: OBSERVER_THRESHOLD
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Unobserve después de que se haya revelado (opcional para performance)
        if (!entry.target.dataset.keepObserving) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  return observer;
};

const setupRevealAnimations = () => {
  const observer = createIntersectionObserver();
  
  // Elementos que queremos animar al hacer scroll
  const revealElements = document.querySelectorAll(
    '.card, .step, .quote, .callout, .faq__item, .media-card'
  );
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
};

// ============================================
// FORM HANDLING
// ============================================

const setupFormValidation = () => {
  const form = document.querySelector('.form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Validación básica
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (isValid) {
      // Aquí iría la lógica de envío real (AJAX, etc.)
      form.reset();
      
      // Feedback visual (podría mejorarse con un toast/notification)
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '¡Enviado!';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }
  });
};

// ============================================
// FOOTER YEAR
// ============================================

const updateFooterYear = () => {
  if (elements.yearSpan) {
    elements.yearSpan.textContent = new Date().getFullYear();
  }
};

// ============================================
// EVENT LISTENERS
// ============================================

const setupEventListeners = () => {
  // Scroll events
  const debouncedScrollHandler = utils.debounce(() => {
    headerScrollHandler();
    toTopHandler();
  }, 10);
  
  window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
  
  // Mobile menu
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  // Cerrar menú al hacer click en un link
  if (elements.navMenu) {
    elements.navMenu.addEventListener('click', handleMenuLinkClick);
  }
  
  // Cerrar menú con Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.isMenuOpen) {
      closeMobileMenu();
      elements.navToggle?.focus();
    }
  });
  
  // To top button
  if (elements.toTop) {
    elements.toTop.addEventListener('click', scrollToTop);
  }
  
  // Click fuera del menú para cerrarlo
  document.addEventListener('click', (event) => {
    if (state.isMenuOpen && 
        !elements.navMenu.contains(event.target) && 
        !elements.navToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });
  
  // Form handling
  setupFormValidation();
  
  // Resize handler (opcional, para ajustes responsive)
  window.addEventListener('resize', utils.debounce(() => {
    if (window.innerWidth > 768 && state.isMenuOpen) {
      closeMobileMenu();
    }
  }, 250));
};

// ============================================
// INITIALIZATION
// ============================================

const init = () => {
  console.log('🚀 BAUSEN Frontend inicializado');
  
  // Estado inicial
  headerScrollHandler();
  toTopHandler();
  updateFooterYear();
  
  // Configurar event listeners
  setupEventListeners();
  
  // Setup scroll animations
  setupRevealAnimations();
  
  // Focus management para accesibilidad
  document.addEventListener('focusin', (event) => {
    if (state.isMenuOpen && !elements.navMenu.contains(event.target)) {
      event.stopPropagation();
      const firstFocusable = elements.navMenu.querySelector('a, button, input');
      firstFocusable?.focus();
    }
  });
};

// ============================================
// LOAD EVENT
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================
// EXPORT PARA TESTING (opcional)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    utils,
    state,
    elements
  };
}
/* =========================================================
   Navbar base: drawer + theme toggle + header scrolled
   (pegar al final de servicios.js)
========================================================= */
(() => {
  'use strict';

  const $ = (q, el = document) => el.querySelector(q);

  const header = $('.site-header');
  const drawer = $('#navDrawer');
  const btnOpen = $('#navToggle');
  const btnClose = $('#navClose');
  const backdrop = $('.drawer-backdrop');
  const panel = $('.drawer-panel');

  // ---------- header scrolled ----------
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 14);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- drawer ----------
  const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

  const lockScroll = () => {
    const w = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${w}px`;
  };

  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  const openDrawer = () => {
    if (!drawer || !btnOpen) return;
    drawer.hidden = false;
    btnOpen.setAttribute('aria-expanded', 'true');
    lockScroll();
    // focus
    setTimeout(() => btnClose?.focus(), 50);
  };

  const closeDrawer = () => {
    if (!drawer || !btnOpen) return;
    drawer.hidden = true;
    btnOpen.setAttribute('aria-expanded', 'false');
    unlockScroll();
    btnOpen.focus();
  };

  btnOpen?.addEventListener('click', () => {
    const isOpen = drawer && !drawer.hidden;
    isOpen ? closeDrawer() : openDrawer();
  });

  btnClose?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  panel?.addEventListener('click', (e) => e.stopPropagation());

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) closeDrawer();
  });

  // Cierra al hacer click en un link del drawer
  drawer?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && a.classList.contains('drawer-link')) closeDrawer();
  });

  // Cierra si pasas a desktop
  const mq = window.matchMedia('(min-width: 981px)');
  const mqHandler = (ev) => { if (ev.matches && drawer && !drawer.hidden) closeDrawer(); };
  mq.addEventListener ? mq.addEventListener('change', mqHandler) : mq.addListener(mqHandler);

  // ---------- theme toggle ----------
  const themeToggle = $('#themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const updateThemeIcons = (theme) => {
    const isLight = theme === 'light';
    document.querySelectorAll('.i-sun').forEach(el => el.style.display = isLight ? 'block' : 'none');
    document.querySelectorAll('.i-moon').forEach(el => el.style.display = isLight ? 'none' : 'block');
  };

  const setTheme = (theme) => {
    if (!theme || !['light','dark'].includes(theme)) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bausen_theme', theme);
    updateThemeIcons(theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0f17' : '#F8FBFF');
  };

  const initTheme = () => {
    const saved = localStorage.getItem('bausen_theme');
    if (saved === 'light' || saved === 'dark') return setTheme(saved);
    setTheme(prefersDark.matches ? 'dark' : 'light');
  };

  initTheme();

  prefersDark.addEventListener?.('change', (e) => {
    // solo respeta sistema si el usuario no fijó manualmente
    if (!localStorage.getItem('bausen_theme')) setTheme(e.matches ? 'dark' : 'light');
  });

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
})();
