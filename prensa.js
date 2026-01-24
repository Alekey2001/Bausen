/* =========================
   Prensa - JS
   - Tema claro/oscuro (persistente)
   - Menú móvil
   - Selector de idioma (UI)
   - Reveal on scroll
   - Tilt 3D suave
   - Buscador + filtro por año (demo lista, listo para backend)
========================= */

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* =========================
   Theme
========================= */
function initTheme() {
  const root = document.documentElement;
  const btn = $("#themeToggle");
  if (!btn) return;

  const stored = localStorage.getItem("bausen_theme");
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  const syncIcon = () => {
    const isDark = root.getAttribute("data-theme") !== "light";
    btn.setAttribute("aria-pressed", String(isDark));
    const icon = $(".theme-toggle__icon i", btn);
    if (icon) icon.className = isDark ? "fa-solid fa-moon" : "fa-solid fa-sun";
  };

  syncIcon();

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("bausen_theme", next);
    syncIcon();
  });
}

/* =========================
   Language dropdown (UI only)
========================= */
function initLang() {
  const wrapper = $(".lang");
  const btn = $("#langBtn");
  const list = $("#langList");
  if (!wrapper || !btn || !list) return;

  const close = () => {
    wrapper.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !wrapper.classList.contains("is-open");
    wrapper.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });

  list.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-lang]");
    if (!li) return;

    // UI only: actual i18n lo integras después
    $$("#langList li").forEach((x) => x.setAttribute("aria-selected", "false"));
    li.setAttribute("aria-selected", "true");
    const tag = $(".lang__tag", btn);
    if (tag) tag.textContent = (li.dataset.lang || "es").toUpperCase();

    close();
  });

  document.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* =========================
   Mobile menu
========================= */
function initMobileMenu() {
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const overlay = $("#mobileMenuOverlay");
  const menuClose = $("#menuClose");
  if (!menuToggle || !mobileMenu || !overlay) return;

  const lockScroll = (locked) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
  };

  const open = () => {
    mobileMenu.classList.add("open");
    overlay.classList.add("show");
    mobileMenu.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);

    setTimeout(() => {
      const first = $(".mobile-nav-link", mobileMenu);
      if (first) first.focus();
    }, 60);
  };

  const close = () => {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    mobileMenu.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    lockScroll(false);
    menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  overlay.addEventListener("click", close);
  if (menuClose) menuClose.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* =========================
   Reveal on scroll
========================= */
function initReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("in-view");
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

/* =========================
   Tilt 3D (suave)
========================= */
function initTilt() {
  const cards = $$("[data-tilt]");
  if (!cards.length) return;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  cards.forEach((card) => {
    let raf = null;

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);

      const rx = clamp(-dy * 5, -6, 6);
      const ry = clamp(dx * 6, -7, 7);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = "";
    };

    // En touch no tilt
    const isTouch = matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });
}

/* =========================
   Press: data + render (demo)
========================= */
const PRESS_ITEMS = [
  {
    id: "p-001",
    featured: true,
    title: "Prueba de comunicado",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quiaque ducimus sequi non perferendis...",
    year: 2026,
    dateLabel: "Enero 2026",
    tags: ["Comunicado", "Destacado"]
  },
  {
    id: "p-002",
    featured: false,
    title: "Actualización corporativa: nuevos estándares internos",
    excerpt:
      "Publicamos un resumen de avances institucionales y lineamientos operativos que fortalecen nuestro servicio.",
    year: 2025,
    dateLabel: "Octubre 2025",
    tags: ["Institucional"]
  },
  {
    id: "p-003",
    featured: false,
    title: "Posicionamiento ante cambios regulatorios",
    excerpt:
      "Compartimos nuestra postura y recomendaciones para clientes ante actualizaciones relevantes del sector.",
    year: 2024,
    dateLabel: "Marzo 2024",
    tags: ["Regulatorio"]
  }
];

function initPress() {
  const grid = $("#pressGrid");
  const empty = $("#emptyState");
  const meta = $("#resultsMeta");
  const searchInput = $("#searchInput");
  const yearSelect = $("#yearSelect");
  if (!grid || !empty || !meta || !searchInput || !yearSelect) return;

  // Populate years
  const years = Array.from(new Set(PRESS_ITEMS.map((x) => x.year))).sort((a, b) => b - a);
  years.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  });

  const normalize = (s) => (s || "").toLowerCase().trim();

  const render = (items) => {
    grid.innerHTML = "";

    if (!items.length) {
      empty.hidden = false;
      meta.textContent = "Mostrando 0 comunicados";
      return;
    }

    empty.hidden = true;
    meta.textContent = `Mostrando ${items.length} comunicado${items.length === 1 ? "" : "s"}`;

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "press-card reveal";
      card.setAttribute("data-tilt", "");
      card.innerHTML = `
        <div class="press-card__top">
          <span class="badge ${item.featured ? "badge--featured" : ""}">
            <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
            ${item.featured ? "Destacado" : "Comunicado"}
          </span>
          <span class="press-card__date">${item.dateLabel}</span>
        </div>

        <div class="press-card__body">
          <h3 class="press-card__title">${item.title}</h3>
          <p class="press-card__excerpt">${item.excerpt}</p>
        </div>

        <div class="press-card__footer">
          ${(item.tags || []).slice(0, 3).map((t) => `<span class="tag">${t}</span>`).join("")}
          <a class="btn btn--ghost btn--pill" href="#" style="margin-left:auto">
            Ver comunicado <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      `;

      grid.appendChild(card);
    });

    // Re-observe reveals + tilt para lo nuevo
    initReveal();
    initTilt();
  };

  const applyFilters = () => {
    const q = normalize(searchInput.value);
    const y = yearSelect.value;

    let items = [...PRESS_ITEMS];

    // Orden: destacados primero, luego por año/fecha (aquí año)
    items.sort((a, b) => {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return (b.year || 0) - (a.year || 0);
    });

    if (y !== "all") items = items.filter((it) => String(it.year) === y);

    if (q) {
      items = items.filter((it) => {
        const hay = normalize(it.title) + " " + normalize(it.excerpt) + " " + normalize((it.tags || []).join(" "));
        return hay.includes(q);
      });
    }

    render(items);
  };

  searchInput.addEventListener("input", applyFilters);
  yearSelect.addEventListener("change", applyFilters);

  applyFilters();
}

/* =========================
   Init
========================= */
initTheme();
initLang();
initMobileMenu();
initReveal();
initTilt();
initPress();
