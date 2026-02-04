/* =========================
   BAUSEN — Impuestos (2026)
   JS: Drawer, Theme toggle, Reveal, Tilt, Lottie mount, Form
========================= */

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -------------------------
  // Elements (navbar reference)
  // -------------------------
  const header = $('[data-header]');
  const drawer = $('#navDrawer');
  const btnOpen = $('#navToggle');
  const btnClose = $('#navClose');
  const backdrop = $('.drawer-backdrop');
  const panel = $('.drawer-panel');
  const themeToggle = $('#themeToggle');

  // Footer year
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -------------------------
  // Header scrolled
  // -------------------------
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 14);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // -------------------------
  // Drawer (mobile)
  // -------------------------
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

  drawer?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && a.classList.contains('drawer-link')) closeDrawer();
  });

  const mq = window.matchMedia('(min-width: 981px)');
  const mqHandler = (ev) => { if (ev.matches && drawer && !drawer.hidden) closeDrawer(); };
  mq.addEventListener ? mq.addEventListener('change', mqHandler) : mq.addListener(mqHandler);

  // -------------------------
  // Theme toggle (dark/light)
  // -------------------------
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const updateThemeIcons = (theme) => {
    const isLight = theme === 'light';
    $$('.i-sun').forEach(el => el.style.display = isLight ? 'block' : 'none');
    $$('.i-moon').forEach(el => el.style.display = isLight ? 'none' : 'block');
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
    if (!localStorage.getItem('bausen_theme')) setTheme(e.matches ? 'dark' : 'light');
  });

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // -------------------------
  // Reveal on scroll
  // -------------------------
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '50px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // -------------------------
  // Tilt (lightweight)
  // -------------------------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tilts = $$('[data-tilt]');

  if (!prefersReduced && tilts.length) {
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const onMove = (el, ev) => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width;
      const y = (ev.clientY - r.top) / r.height;

      const rx = clamp((0.5 - y) * 10, -8, 8);
      const ry = clamp((x - 0.5) * 10, -8, 8);

      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
    };

    const reset = (el) => {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    tilts.forEach(el => {
      el.addEventListener('mousemove', (e) => onMove(el, e));
      el.addEventListener('mouseleave', () => reset(el));
      el.addEventListener('mouseenter', () => reset(el));
    });
  }

  // -------------------------
  // Lottie mounting
  // -------------------------
  const LOTTIES = {
    "hero-tax": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
    "audit":    "https://assets2.lottiefiles.com/packages/lf20_6wutsrox.json",
    "strategy": "https://assets9.lottiefiles.com/packages/lf20_1z3w3tqj.json",
    "shield":   "https://assets1.lottiefiles.com/packages/lf20_qm8eqzse.json",
    "chart":    "https://assets2.lottiefiles.com/packages/lf20_touohxv0.json"
  };

  const mountLottie = (slot, url) => {
    if (!slot || !url) return;
    if (slot.querySelector('lottie-player')) return;

    const player = document.createElement('lottie-player');
    player.setAttribute('src', url);
    player.setAttribute('background', 'transparent');
    player.setAttribute('speed', '1');
    player.setAttribute('loop', '');
    player.setAttribute('autoplay', '');
    player.style.width = '100%';
    player.style.height = '100%';
    player.style.maxWidth = '320px';

    slot.appendChild(player);
  };

  $$('.lottie-slot[data-lottie]').forEach(slot => {
    const key = slot.getAttribute('data-lottie');
    mountLottie(slot, LOTTIES[key]);
  });

  // -------------------------
  // Form feedback (UI only)
  // -------------------------
  const form = $('[data-form]');
  const status = $('[data-form-status]');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'Mensaje listo. Integra tu backend o servicio de envío para finalizar.';
      status.style.color = 'rgba(16,185,129,.9)';
      window.setTimeout(() => { status.textContent = ''; }, 4500);
      form.reset();
    });
  }
})();
