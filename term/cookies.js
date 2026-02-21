// BAUSEN - Cookie Policy interactions (sin frameworks)
document.addEventListener('DOMContentLoaded', function () {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Smooth scroll + active en TOC
  const toc = document.getElementById('toc');
  const links = toc ? Array.from(toc.querySelectorAll('a[href^="#"]')) : [];

  function setActiveById(id) {
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  }

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveById(el.id);
    });
  });

  // Active automático por scroll
  const sections = Array.from(document.querySelectorAll('.content-section[id]'));
  function onScrollActive() {
    const offset = 120;
    let current = null;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= offset) current = s;
    }
    if (current) setActiveById(current.id);
  }
  window.addEventListener('scroll', onScrollActive, { passive: true });
  onScrollActive();

  // To top
  const toTop = document.getElementById('toTop');
  function onScrollTopBtn() {
    if (!toTop) return;
    if (window.scrollY > 380) toTop.classList.add('visible');
    else toTop.classList.remove('visible');
  }
  window.addEventListener('scroll', onScrollTopBtn, { passive: true });
  onScrollTopBtn();

  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Preferencias (LocalStorage)
  const k = 'bausen_cookie_consent_v1';
  const analytics = document.getElementById('consentAnalytics');
  const functional = document.getElementById('consentFunctional');
  const marketing = document.getElementById('consentMarketing');
  const status = document.getElementById('prefsStatus');

  function readPrefs() {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) return { analytics: false, functional: false, marketing: false };
      const obj = JSON.parse(raw);
      return {
        analytics: !!obj.analytics,
        functional: !!obj.functional,
        marketing: !!obj.marketing
      };
    } catch {
      return { analytics: false, functional: false, marketing: false };
    }
  }

  function writePrefs(p) {
    localStorage.setItem(k, JSON.stringify(p));
  }

  function applyPrefs(p) {
    if (analytics) analytics.checked = p.analytics;
    if (functional) functional.checked = p.functional;
    if (marketing) marketing.checked = p.marketing;
  }

  applyPrefs(readPrefs());

  const save = document.getElementById('savePrefs');
  const reset = document.getElementById('resetPrefs');

  function flash(msg) {
    if (!status) return;
    status.textContent = msg;
    status.style.opacity = '1';
    clearTimeout(flash._t);
    flash._t = setTimeout(() => { status.style.opacity = '0.85'; }, 2000);
  }

  if (save) {
    save.addEventListener('click', () => {
      const p = {
        analytics: !!(analytics && analytics.checked),
        functional: !!(functional && functional.checked),
        marketing: !!(marketing && marketing.checked)
      };
      writePrefs(p);
      flash('Preferencias guardadas.');
    });
  }

  if (reset) {
    reset.addEventListener('click', () => {
      const p = { analytics: false, functional: false, marketing: false };
      writePrefs(p);
      applyPrefs(p);
      flash('Preferencias restablecidas.');
    });
  }

  // Descargar PDF (placeholder)
  const download = document.getElementById('downloadPdf');
  if (download) {
    download.addEventListener('click', () => {
      flash('PDF próximamente. Puedes imprimir esta página desde tu navegador.');
    });
  }

  // Modo claro fijo
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.style.display = 'none';
});
