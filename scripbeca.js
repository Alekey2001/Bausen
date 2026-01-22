const body = document.body;
const navToggle = document.querySelector('.nav__toggle');
const navPanel = document.querySelector('.nav__panel');
const header = document.querySelector('.site-header');
const dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const form = document.getElementById('contactForm');
const summaryPanel = document.getElementById('summaryPanel');
const year = document.getElementById('year');
const sliderTrack = document.querySelector('.slider__track');
const sliderSlides = document.querySelectorAll('.slider__slide');
const dotsContainer = document.querySelector('.slider__dots');
const prevButton = document.querySelector('[data-slider-prev]');
const nextButton = document.querySelector('[data-slider-next]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setTheme = (theme) => {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark');
};

const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  setTheme(storedTheme);
}

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

const toggleNav = (forceState) => {
  const isOpen = forceState ?? !navPanel.classList.contains('is-open');
  navPanel.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
};

navToggle.addEventListener('click', () => toggleNav());

navPanel.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLAnchorElement && target.classList.contains('nav__link')) {
    toggleNav(false);
  }
});

const closeDropdowns = () => {
  dropdownToggles.forEach((toggle) => {
    toggle.setAttribute('aria-expanded', 'false');
    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
    menu.classList.remove('is-open');
  });
};

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener('click', (event) => {
    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    closeDropdowns();
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
    event.stopPropagation();
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav__item--dropdown')) {
    closeDropdowns();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDropdowns();
    toggleNav(false);
  }
});

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
});

const revealElements = document.querySelectorAll('[data-reveal]');
if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const buildSliderDots = () => {
  sliderSlides.forEach((_, index) => {
    const button = document.createElement('button');
    button.className = 'dot';
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-label', `Ir al evento ${index + 1}`);
    button.addEventListener('click', () => moveToSlide(index));
    dotsContainer.appendChild(button);
  });
};

let currentSlide = 0;
const moveToSlide = (index) => {
  currentSlide = (index + sliderSlides.length) % sliderSlides.length;
  const offset = sliderSlides[currentSlide].offsetLeft;
  sliderTrack.scrollTo({ left: offset, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  updateDots();
};

const updateDots = () => {
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === currentSlide);
    dot.setAttribute('aria-selected', index === currentSlide ? 'true' : 'false');
  });
};

buildSliderDots();
updateDots();

prevButton.addEventListener('click', () => moveToSlide(currentSlide - 1));
nextButton.addEventListener('click', () => moveToSlide(currentSlide + 1));

const validateField = (field) => {
  const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
  let message = '';

  if (field.validity.valueMissing) {
    message = 'Este campo es obligatorio.';
  } else if (field.type === 'email' && field.validity.typeMismatch) {
    message = 'Ingresa un correo válido.';
  }

  if (field.name === 'privacidad' && !field.checked) {
    message = 'Debes aceptar el aviso de privacidad.';
  }

  errorEl.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  return !message;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = Array.from(form.elements).filter((field) => field.tagName !== 'BUTTON');
  const isValid = fields.every((field) => validateField(field));

  if (!isValid) {
    return;
  }

  const payload = {
    nombre: form.nombre.value.trim(),
    empresa: form.empresa.value.trim(),
    email: form.email.value.trim(),
    telefono: form.telefono.value.trim(),
    linea: form.linea.value,
    mensaje: form.mensaje.value.trim(),
    privacidad: form.privacidad.checked,
    fecha: new Date().toISOString(),
  };

  localStorage.setItem('briefSolicitud', JSON.stringify(payload));

  summaryPanel.innerHTML = `
    <p><strong>Estado:</strong> Enviado ✅</p>
    <p><strong>Nombre:</strong> ${payload.nombre}</p>
    <p><strong>Empresa:</strong> ${payload.empresa}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Teléfono:</strong> ${payload.telefono}</p>
    <p><strong>Línea:</strong> ${payload.linea}</p>
    <p><strong>Mensaje:</strong> ${payload.mensaje}</p>
    <p><strong>Próximo paso:</strong> Te compartimos un diagnóstico inicial.</p>
  `;

  form.reset();
});

form.addEventListener('input', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
    validateField(event.target);
  }
});

if (year) {
  year.textContent = new Date().getFullYear();
}

// Placeholder para integración Google Sheets:
// fetch('TU_WEBAPP_URL', { method: 'POST', body: JSON.stringify(payload) })
