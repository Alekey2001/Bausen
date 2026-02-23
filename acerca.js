/* acerca.js
   Funciones:
   - Toggle tema (dark/light) con persistencia
   - Menú móvil (overlay + ESC + focus)
   - Selector de idioma (dropdown accesible)
   - FAQ: acordeón + buscador
   - Reveal on scroll
   - Tilt 3D (data-tilt) sin librerías
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const byId = (...ids) => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  };

  const html = document.documentElement;
  const body = document.body;


  // Two-tone helper: pinta la 1ra palabra en azul marino y el resto en negro (sin romper i18n)
  const applyTwoToneWords = (el) => {
    if (!el) return;
    const txt = (el.textContent || "").trim().replace(/\s+/g, " ");
    const parts = txt.split(" ");
    if (parts.length < 2) return;

    const first = parts.shift();
    const rest = parts.join(" ");

    el.innerHTML = "";
    const s1 = document.createElement("span");
    s1.className = "tt1";
    s1.textContent = first;

    const s2 = document.createElement("span");
    s2.className = "tt2";
    s2.textContent = rest;

    el.append(s1, document.createTextNode(" "), s2);
  };


  // Forzar modo claro
  html.setAttribute("data-theme","light");
  /* =========================
     Theme
  ========================= */
  // Modo claro fijo: tema deshabilitado.
/* =========================
   Mobile menu (FIX definitivo)
   - IDs reales del HTML: #mobile-menu, #mobile-menu-overlay, #close-menu
   - Overlay: usa clase .show (CSS)
   - ESC cierra
   - Click en links cierra
   - Scroll lock sin romper scroll del drawer
========================= */
const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("close-menu");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

const lockScroll = (locked) => {
  // Mantiene el body fijo, pero NO afecta el scroll interno del drawer
  document.documentElement.style.overflow = locked ? "hidden" : "";
  body.style.overflow = locked ? "hidden" : "";
};

const openMenu = () => {
  if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;

  mobileMenuOverlay.hidden = false;
  mobileMenuOverlay.classList.add("show");

  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");

  body.classList.add("menu-open"); // tu CSS ya contempla esto :contentReference[oaicite:4]{index=4}
  lockScroll(true);

  // focus primer link clickeable
  setTimeout(() => {
    const first =
      mobileMenu.querySelector("a.mobile-nav-link, a.mobile-sub-link, button, [tabindex]:not([tabindex='-1'])");
    first?.focus();
  }, 50);
};

const closeMenu = () => {
  if (!mobileMenu || !mobileMenuOverlay || !menuToggle) return;

  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");

  body.classList.remove("menu-open");
  lockScroll(false);

  mobileMenuOverlay.classList.remove("show");

  // Espera transición antes de ocultar overlay
  setTimeout(() => {
    mobileMenuOverlay.hidden = true;
  }, 220);

  menuToggle.focus();
};

menuToggle?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);
mobileMenuOverlay?.addEventListener("click", closeMenu);
/* =========================
   Hover interactions (DESKTOP)
   - NO cambia IDs ni estructura
   - Idioma: hover abre/cierra
   - Drawer: hover en #menuToggle abre
   - Submenús (<details>) dentro del drawer: hover abre/cierra
========================= */
(() => {
  // Solo en dispositivos con mouse/hover real
  const canHover =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!canHover) return;

  /* ---------- 1) IDIOMA: hover open/close ---------- */
  const langBtn = document.getElementById("language-btn");
  const langDropdown = document.getElementById("language-dropdown");
  const langWrap = langBtn?.closest(".language-selector");

  if (langBtn && langDropdown && langWrap) {
    let langCloseTimer = null;

    const openLang = () => {
      clearTimeout(langCloseTimer);
      langDropdown.classList.add("show");
      langBtn.setAttribute("aria-expanded", "true");
    };

    const closeLang = (delay = 90) => {
      clearTimeout(langCloseTimer);
      langCloseTimer = setTimeout(() => {
        langDropdown.classList.remove("show");
        langBtn.setAttribute("aria-expanded", "false");
      }, delay);
    };

    // Entra: abre
    langWrap.addEventListener("pointerenter", openLang);

    // Sale: cierra
    langWrap.addEventListener("pointerleave", () => closeLang(120));

    // Si el usuario hace click afuera, asegúrate de cerrar (no rompe tu click actual)
    document.addEventListener("pointerdown", (e) => {
      if (!langWrap.contains(e.target)) closeLang(0);
    });
  }

  /* ---------- 2) HAMBURGUESA: hover abre menú ---------- */
  const burger = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  // Reutiliza tus funciones existentes si están en scope (openMenu / closeMenu)
  // Si por algún motivo no existen, no hacemos nada.
  const hasOpenClose =
    typeof openMenu === "function" && typeof closeMenu === "function";

  if (burger && hasOpenClose) {
    let openTimer = null;

    burger.addEventListener("pointerenter", () => {
      // Evita aperturas accidentales al pasar rápido
      clearTimeout(openTimer);
      openTimer = setTimeout(() => {
        if (!mobileMenu?.classList.contains("open")) openMenu();
      }, 120);
    });

    burger.addEventListener("pointerleave", () => {
      clearTimeout(openTimer);
    });

    // Si el usuario ya tiene el menú abierto y se va con el mouse fuera del drawer + overlay, cerramos suave
    // (Esto NO afecta móvil; solo desktop hover)
    const closeIfAway = () => {
      if (!mobileMenu?.classList.contains("open")) return;
      // Si el mouse no está sobre el menú ni el toggle, cerrar
      closeMenu();
    };

    mobileMenu?.addEventListener("pointerleave", () => {
      // espera breve para permitir entrar al overlay sin cerrar al milisegundo
      setTimeout(() => {
        // Si el menú sigue abierto y el puntero ya no está en el menú, cerrar
        if (mobileMenu.classList.contains("open")) closeIfAway();
      }, 220);
    });

   // FIX BUG: NO cerrar al pasar del overlay al menú (eso era lo que lo cerraba)
mobileMenuOverlay?.addEventListener("pointerleave", (e) => {
  if (!mobileMenu?.classList.contains("open")) return;

  const to = e.relatedTarget;

  // Si el mouse entra al menú o vuelve al botón, NO cierres
  if (to && (mobileMenu.contains(to) || burger.contains(to))) return;

  closeMenu();
});

  }

  /* ---------- 3) SUBMENÚS dentro del drawer: hover abre/cierra <details> ---------- */
  if (mobileMenu) {
    const detailsList = mobileMenu.querySelectorAll("details.menu-details");

    detailsList.forEach((d) => {
      let t = null;

      d.addEventListener("pointerenter", () => {
        clearTimeout(t);
        d.open = true;
      });

      d.addEventListener("pointerleave", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          d.open = false;
        }, 140);
      });
    });
  }
})();
// Cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu?.classList.contains("open")) closeMenu();
});

// Cerrar al hacer click en cualquier link del menú (para que “sí deje” navegar)
mobileMenu?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  // Si es anchor dentro de la misma página (ej. #contacto), cerramos y dejamos que navegue
  closeMenu();
});
  /* =========================
     Language (i18n) — EXACT copy from reference (index.html / stylebeca.css / scripbeca.js)
     NOTE: Do not edit keys/structure; connect via data-i18n* in HTML.
  ========================= */
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
     i18n dictionaries (ES/EN full)
  ========================= */
  const I18N = {
    ES: {
      // Header/Nav
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

      // Hero
      "hero.pill": "Soluciones empresariales integrales",
      "hero.title": "Impulsamos<br /><span class='hero-accent'>tu talento</span>",
      "hero.subtitle":
        "Capital Humano, Desarrollo Organizacional y Management<br />Servicios para cada etapa de tu crecimiento.",
      "hero.ctaServices": "Ver Servicios",
      "hero.ctaContact": "Contactar",
      "kpi.years": "Años de experiencia",
      "kpi.clients": "Clientes",
      "kpi.sat": "Satisfacción",
      "toast.title": "Certificados",

      // Services
      "services.kicker": "Lo que hacemos",
      "services.title": "Nuestros Servicios",
      "services.subtitle": "Soluciones integrales diseñadas para optimizar cada aspecto de tu organización",
      "services.card1.title": "Capital humano",
      "services.card1.text": "Aumenta la eficiencia y resultados de tu negocio.",
      "services.card2.title": "Servicios especializados",
      "services.card2.text": "Aumenta la eficiencia y resultados de tu negocio.",
      "services.card3.title": "Servicios de Impuestos",
      "services.card3.text": "Optimiza tu carga fiscal con expertos certificados.",
      "services.more": "Conocer más",

      // Press
      "press.kicker": "Sala de prensa",
      "press.title": "Comunicados de <span class='accent'>Prensa</span>",
      "press.subtitle": "Mantente informado sobre las últimas noticias y anuncios de BAUSEN",
      "press.cta": "Ver todos los comunicados",

      // Training
      "training.kicker": "Formación de talento",
      "training.title": "BAUSEN Training Center",
      "training.subtitle": "Formamos y conectamos el talento del futuro con las mejores<br />oportunidades",
      "training.tab.events": "Eventos",
      "training.tab.webinars": "Webinars Institucionales",
      "training.tab.interns": "Sistema de Becarios",
      "training.leftTitle.events": "Eventos",
      "training.leftTitle.webinars": "Webinars Institucionales",
      "training.leftTitle.interns": "Sistema de Becarios",
      "training.panel.events.title": "Eventos",
      "training.panel.events.text": "Participación activa en eventos con escuelas y universidades",
      "training.panel.webinars.title": "Webinars Institucionales",
      "training.panel.webinars.text": "Capacitaciones y webinars especializados con instituciones educativas",
      "training.panel.interns.title": "Sistema de Becarios",
      "training.panel.interns.text": "Programa integral de formación y desarrollo de talento joven",
      "training.more": "Más información",

      // News
      "news.kicker": "Blog y noticias",
      "news.title": "Últimas <span class='accent'>Noticias</span>",
      "news.subtitle": "Descubre artículos, casos de éxito y tendencias del sector",
      "news.cta": "Ver todas las noticias",

      // Connect
      "connect.kicker": "Conecta con nosotros",
      "connect.title": "Juntos trazamos<br /><span class='connect-accent'>tu camino al éxito</span>",
      "connect.text":
        "¿Listo para llevar tu negocio al siguiente nivel? Agenda una<br />reunión con nuestros especialistas y descubre cómo podemos<br />ayudarte.",
      "connect.cta": "¡Agenda ahora!",
      "connect.follow": "¡Síguenos en redes!",

      // Awards
      "awards.kicker": "Excelencia reconocida",
      "awards.title": "Nuestros <span class='accent'>Reconocimientos</span>",
      "awards.subtitle": "Certificaciones y alianzas que respaldan nuestro compromiso con la excelencia",
      "awards.card1.k": "Reconocimiento 01",
      "awards.card1.t": "Consejo de Recursos Humanos",
      "awards.card2.k": "Reconocimiento 02",
      "awards.card2.t": "Distintivo de Empresas Humanitarias",
      "awards.card3.k": "Reconocimiento 03",
      "awards.card3.t": "Certificación de Trabajo Digno",
      "awards.card4.k": "Reconocimiento 04",
      "awards.card4.t": "Registro de Especialistas Profesionales",
      "awards.card5.k": "Reconocimiento 05",
      "awards.card5.t": "Concilio de Recursos Humanos",
      "awards.card6.k": "Reconocimiento 06",
      "awards.card6.t": "Certificación ISO",
      "awards.card7.k": "Reconocimiento 07",
      "awards.card7.t": "Cumplimiento NOM",
      "awards.card8.k": "Reconocimiento 08",
      "awards.card8.t": "Registro REPSE",

      // Contact
      "contact.kicker": "¿Listo para conectar?",
      "contact.title": "Hablemos sobre <span class='contact-accent'>tu proyecto</span>",
      "contact.subtitle":
        "Cuéntanos tus ideas, necesidades o dudas y nuestro equipo te contactará a la<br />brevedad. ¡Estamos aquí para ayudarte a transformar tu operación!",
      "contact.formTitle": "Envíanos un mensaje",
      "contact.formSubtitle": "Completa el formulario y te contactaremos pronto.",
      "contact.infoTitle": "Información de Contacto",
      "contact.phone": "Teléfono",
      "contact.email": "Email",
      "contact.location": "Ubicación",
      "contact.locationValue": "Querétaro, México",
      "contact.hours": "Horario",
      "contact.hoursValue": "Lun - Vie: 9:00 - 18:00",
      "contact.follow": "Síguenos en redes",

      // Map
      "map.kicker": "NUESTRAS UBICACIONES",
      "map.noBranches": "No se encontraron sucursales activas",
      "map.retry": "Reintentar",
      "map.searching": "Buscando…",

      // Footer
      "footer.brandText":
        "Tu aliado estratégico en soluciones empresariales integrales.<br />Transformamos organizaciones desde adentro.",
      "footer.hoursLabel": "Horario de atención",
      "footer.hoursValue": "Lunes - Viernes: 9:00 - 18:00",
      "footer.follow": "Síguenos en redes",
      "footer.company": "EMPRESA",
      "footer.services": "SERVICIOS",
      "footer.about": "Acerca de",
      "footer.servicesLink": "Servicios",
      "footer.news": "Noticias",
      "footer.press": "Prensa",
      "footer.contact": "Contacto",
      "footer.svc.capital": "Capital Humano",
      "footer.svc.legal": "Servicios Legales",
      "footer.svc.accounting": "Servicios Contables",
      "footer.svc.orgdev": "Desarrollo Organizacional",
      "footer.contactTitle": "CONTACTO",
      "footer.note": "Próximamente. No se encontraron sucursales activas.",
      "footer.phoneLabel": "Teléfono",
      "footer.emailLabel": "Email",
      "footer.maps": "Ver en Google Maps",
      "footer.rights": "Todos los derechos reservados",
      "footer.privacy": "Política de privacidad",
      "footer.terms": "Términos de servicio",
      "footer.cookies": "Política de cookies",

      // Form
      "form.fullNamePh": "Tu nombre completo",
      "form.emailPh": "tu@email.com",
      "form.messagePh": "¿En qué podemos ayudarte?",
      "form.send": "Enviar mensaje",
      "form.err.required": "Por favor completa tu nombre, email y mensaje.",
      "form.err.email": "Por favor ingresa un email válido.",
      "form.ok": "Mensaje enviado. Nos pondremos en contacto a la brevedad.",
      "form.sending": "Enviando…",
      "form.fail": "Ocurrió un error. Por favor intenta de nuevo.",

      // UI
      "ui.openMenu": "Abrir menú",
      "ui.closeMenu": "Cerrar menú",
      "ui.langSelect": "Seleccionar idioma",
      "ui.goHome": "Ir a inicio",
      "ui./*toggleTheme_removed*/": "Cambiar tema claro/oscuro",
      "ui.scrollNext": "Bajar a la siguiente sección",

      // CTA mini
      
      // About page (acerca.html)
      "meta.title.about": "Bausen — Acerca de",
      "about.hero.pill": "Acerca de",
      "about.hero.title": "Acerca de<br /><span class='hero__accent'>BAUSEN</span>",
      "about.hero.subtitle":
        "Somos tu aliado estratégico en soluciones empresariales integrales.\nCon más de 15 años de experiencia, hemos acompañado a cientos de organizaciones\nen su transformación y crecimiento.",
      "about.hero.cta1": "Conócenos",
      "about.hero.cta2": "Nuestra Esencia",
      "about.stat.years": "Años de experiencia",
      "about.stat.companies": "Empresas atendidas",
      "about.stat.satisfaction": "Satisfacción",
      "about.stat.services": "Servicios clave",
      "about.panel.chip.trust": "Confianza",
      "about.panel.chip.design": "Diseño",
      "about.panel.chip.results": "Resultados",
      "about.panel.holo.subtitle": "Consultoría & Soluciones",
      "about.panel.card1.title": "Enfoque medible",
      "about.panel.card1.text": "KPIs y seguimiento real.",
      "about.panel.card2.title": "Implementación ágil",
      "about.panel.card2.text": "Rápida y ordenada.",
      "about.panel.hint": "Iluminación + efecto “glass” premium",

      "about.essence.pill": "Nuestra Esencia",
      "about.essence.title": "Nuestra Esencia",
      "about.essence.sub": "Los pilares fundamentales que guían cada decisión y acción en BAUSEN.",
      "about.essence.mission": "Misión",
      "about.essence.missionText":
        "Impulsar el crecimiento de organizaciones mediante soluciones empresariales integrales,\nenfocadas en resultados sostenibles y medibles.",
      "about.essence.vision": "Visión",
      "about.essence.visionText":
        "Ser referentes en consultoría y soluciones, conectando estrategia, talento y ejecución\ncon un estándar premium de calidad y confianza.",
      "about.essence.values": "Valores",
      "about.essence.valuesText":
        "Integridad, excelencia, cercanía y mejora continua. Construimos relaciones a largo plazo\ncon transparencia y compromiso.",
      "about.anchor.stories": "Ver historias de clientes",

      "about.stories.title": "Historias de Clientes",
      "about.stories.sub": "Resultados reales con impacto directo en operación, ventas y equipo.",
      "about.testimonial.ariaStars": "5 estrellas",
      "about.testimonial.pill1": "+32% eficiencia",
      "about.testimonial.q1":
        "“BAUSEN nos ayudó a estructurar procesos y KPIs. La implementación fue rápida y el acompañamiento impecable.”",
      "about.testimonial.role1": "COO — Retail Partner",
      "about.testimonial.pill2": "Riesgo ↓",
      "about.testimonial.q2":
        "“El enfoque es profesional, claro y medible. Logramos orden financiero y mejores decisiones con datos.”",
      "about.testimonial.role2": "Director — Grupo Servicios",
      "about.testimonial.pill3": "Equipo +",
      "about.testimonial.q3":
        "“Mejoramos comunicación y productividad con una ruta clara. Se nota el estándar premium en cada entrega.”",
      "about.testimonial.role3": "HR Lead — Innovación",

      "about.why.title": "¿Por qué <span class='accent'>BAUSEN</span>?",
      "about.why.sub": "Descubre las razones por las que cientos de empresas confían en nosotros.",
      "about.why.card1.t": "Equipo experto",
      "about.why.card1.p": "Profesionales con experiencia real en consultoría, operación y transformación digital.",
      "about.why.card2.t": "Resultados comprobados",
      "about.why.card2.p": "Metodología medible, entregables claros y mejoras que se reflejan en KPIs.",
      "about.why.card3.t": "Innovación continua",
      "about.why.card3.p": "Mejora constante con herramientas actuales, automatizaciones y diseño premium.",
      "about.why.card4.t": "Confiabilidad",
      "about.why.card4.p": "Compromiso con la confidencialidad, ética profesional y transparencia total.",
      "about.why.card5.t": "Soluciones integrales",
      "about.why.card5.p": "Capacitación, contabilidad, legal, capital humano y organización en un solo lugar.",
      "about.why.card6.t": "Enfoque humano",
      "about.why.card6.p": "Entendemos tu contexto, cuidamos el cambio y trabajamos contigo paso a paso.",

      "about.team.pill": "Liderazgo",
      "about.team.title": "Nuestro Equipo <span class='accent'>Directivo</span>",
      "about.team.sub": "Liderazgo con experiencia y compromiso con la excelencia.",
      "about.team.cardTitle": "Dirección General",
      "about.team.cardRole": " Dra. Alejandra Gómez Ruiz",

      "about.process.pill": "Metodología",
      "about.process.title": "Nuestro Proceso",
      "about.process.sub": "Un enfoque estructurado que garantiza resultados excepcionales.",
      "about.process.step1.t": "Diagnóstico",
      "about.process.step1.p": "Entendemos tu contexto, objetivos y prioridades.",
      "about.process.step2.t": "Diseño",
      "about.process.step2.p": "Definimos ruta, entregables y métricas de éxito.",
      "about.process.step3.t": "Implementación",
      "about.process.step3.p": "Ejecutamos con control, comunicación y foco.",
      "about.process.step4.t": "Seguimiento",
      "about.process.step4.p": "Acompañamiento y mejora continua con KPIs.",

      "about.history.pill": "Historia y Logros",
      "about.history.title": "Historia y Logros",
      "about.history.sub": "Hitos clave que definen la evolución de BAUSEN.",
      "about.history.2009": "Fundación de BAUSEN y primeras implementaciones en consultoría operativa.",
      "about.history.2012": "Expansión de servicios integrales: finanzas, legal y capital humano.",
      "about.history.2016": "Estandarización premium: metodología por KPIs y entregables medibles.",

      "about.faq.title": "Preguntas <span class='accent'>Frecuentes</span>",
      "about.faq.sub": "Respuestas claras para tomar una decisión con confianza.",
      "about.faq.searchPh": "Ej. ¿Qué tipo de empresas atienden?",
      "about.faq.searchAria": "Buscar en preguntas frecuentes",
      "about.faq.empty": "No se encontraron coincidencias. Prueba con otra búsqueda.",
      "about.faq.q1": "¿Qué tipo de empresas atienden?",
      "about.faq.a1":
        "Atendemos desde pymes hasta organizaciones con operación compleja. Ajustamos alcance y metodología según tu etapa y objetivos.",
      "about.faq.q2": "¿Cuánto tiempo toma ver resultados?",
      "about.faq.a2":
        "Depende del proyecto. En la mayoría de casos, verás avances en 2–4 semanas y resultados medibles en 6–10 semanas.",
      "about.faq.q3": "¿Cómo se define el alcance del servicio?",
      "about.faq.a3":
        "Iniciamos con diagnóstico y acordamos entregables, cronograma y KPIs. Todo queda documentado desde el inicio.",
      "about.faq.q4": "¿Manejan confidencialidad?",
      "about.faq.a4": "Sí. Trabajamos con acuerdos de confidencialidad y buenas prácticas para manejo seguro de información.",
      "about.faq.q5": "¿Puedo solicitar una consultoría personalizada?",
      "about.faq.a5":
        "Claro. Podemos agendar una llamada para entender tu caso y proponerte una ruta con costos y tiempos estimados.",
      "about.faq.q6": "¿Ofrecen acompañamiento posterior?",
      "about.faq.a6": "Sí. Tenemos seguimiento por métricas y sesiones de control para mantener resultados y escalar mejoras.",

      "about.cta.aria": "Contacto rápido",
      "about.cta.qPh": "¿Puedo solicitar una consultoría personalizada?",
      "about.cta.qAria": "Pregunta o mensaje",
      "about.cta.ePh": "Tu correo para responderte",
      "about.cta.eAria": "Correo",
      "about.cta.btn": "Contáctanos",
"cta.err.question": "Escribe tu pregunta (mínimo 5 caracteres).",
      "cta.err.email": "Ingresa un correo válido para poder responderte.",
      "cta.ok": "Listo. Recibimos tu mensaje y te responderemos pronto.",
    },

    EN: {
      // Header/Nav
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

      // Hero
      "hero.pill": "Integrated business solutions",
      "hero.title": "We empower<br /><span class='hero-accent'>your talent</span>",
      "hero.subtitle":
        "Human Capital, Organizational Development and Management<br />Services for every growth stage.",
      "hero.ctaServices": "View Services",
      "hero.ctaContact": "Contact",
      "kpi.years": "Years of experience",
      "kpi.clients": "Clients",
      "kpi.sat": "Satisfaction",
      "toast.title": "Certified",

      // Services
      "services.kicker": "What we do",
      "services.title": "Our Services",
      "services.subtitle": "Integrated solutions designed to optimize every aspect of your organization",
      "services.card1.title": "Human Capital",
      "services.card1.text": "Boost efficiency and results for your business.",
      "services.card2.title": "Specialized Services",
      "services.card2.text": "Boost efficiency and results for your business.",
      "services.card3.title": "Tax Services",
      "services.card3.text": "Optimize your tax burden with certified experts.",
      "services.more": "Learn more",

      // Press
      "press.kicker": "Press room",
      "press.title": "Press <span class='accent'>Releases</span>",
      "press.subtitle": "Stay informed about the latest BAUSEN news and announcements",
      "press.cta": "View all releases",

      // Training
      "training.kicker": "Talent development",
      "training.title": "BAUSEN Training Center",
      "training.subtitle": "We train and connect future talent with the best<br />opportunities",
      "training.tab.events": "Events",
      "training.tab.webinars": "Institutional Webinars",
      "training.tab.interns": "Internship Program",
      "training.leftTitle.events": "Events",
      "training.leftTitle.webinars": "Institutional Webinars",
      "training.leftTitle.interns": "Internship Program",
      "training.panel.events.title": "Events",
      "training.panel.events.text": "Active participation in events with schools and universities",
      "training.panel.webinars.title": "Institutional Webinars",
      "training.panel.webinars.text": "Specialized training and webinars with educational institutions",
      "training.panel.interns.title": "Internship Program",
      "training.panel.interns.text": "Comprehensive program for training and developing young talent",
      "training.more": "Learn more",

      // News
      "news.kicker": "Blog & news",
      "news.title": "Latest <span class='accent'>News</span>",
      "news.subtitle": "Discover articles, success stories and industry trends",
      "news.cta": "View all news",

      // Connect
      "connect.kicker": "Connect with us",
      "connect.title": "Together we shape<br /><span class='connect-accent'>your path to success</span>",
      "connect.text":
        "Ready to take your business to the next level? Schedule a<br />meeting with our specialists and discover how we can<br />help you.",
      "connect.cta": "Schedule now!",
      "connect.follow": "Follow us on social!",

      // Awards
      "awards.kicker": "Recognized excellence",
      "awards.title": "Our <span class='accent'>Recognitions</span>",
      "awards.subtitle": "Certifications and partnerships that back our commitment to excellence",
      "awards.card1.k": "Recognition 01",
      "awards.card1.t": "Human Resources Council",
      "awards.card2.k": "Recognition 02",
      "awards.card2.t": "Humanitarian Companies Distinction",
      "awards.card3.k": "Recognition 03",
      "awards.card3.t": "Decent Work Certification",
      "awards.card4.k": "Recognition 04",
      "awards.card4.t": "Professional Specialists Registry",
      "awards.card5.k": "Recognition 05",
      "awards.card5.t": "Human Resources Council",
      "awards.card6.k": "Recognition 06",
      "awards.card6.t": "ISO Certification",
      "awards.card7.k": "Recognition 07",
      "awards.card7.t": "NOM Compliance",
      "awards.card8.k": "Recognition 08",
      "awards.card8.t": "REPSE Registry",

      // Contact
      "contact.kicker": "Ready to connect?",
      "contact.title": "Let’s talk about <span class='contact-accent'>your project</span>",
      "contact.subtitle":
        "Tell us your ideas, needs or questions and our team will contact you<br />shortly. We’re here to help you transform your operations!",
      "contact.formTitle": "Send us a message",
      "contact.formSubtitle": "Fill out the form and we’ll contact you soon.",
      "contact.infoTitle": "Contact Information",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.location": "Location",
      "contact.locationValue": "Querétaro, Mexico",
      "contact.hours": "Hours",
      "contact.hoursValue": "Mon - Fri: 9:00 - 18:00",
      "contact.follow": "Follow us on social",

      // Map
      "map.kicker": "OUR LOCATIONS",
      "map.noBranches": "No active branches found",
      "map.retry": "Retry",
      "map.searching": "Searching…",

      // Footer
      "footer.brandText":
        "Your strategic ally in integrated business solutions.<br />We transform organizations from the inside out.",
      "footer.hoursLabel": "Business hours",
      "footer.hoursValue": "Mon - Fri: 9:00 - 18:00",
      "footer.follow": "Follow us on social",
      "footer.company": "COMPANY",
      "footer.services": "SERVICES",
      "footer.about": "About",
      "footer.servicesLink": "Services",
      "footer.news": "News",
      "footer.press": "Press",
      "footer.contact": "Contact",
      "footer.svc.capital": "Human Capital",
      "footer.svc.legal": "Legal Services",
      "footer.svc.accounting": "Accounting Services",
      "footer.svc.orgdev": "Organizational Development",
      "footer.contactTitle": "CONTACT",
      "footer.note": "Coming soon. No active branches found.",
      "footer.phoneLabel": "Phone",
      "footer.emailLabel": "Email",
      "footer.maps": "View on Google Maps",
      "footer.rights": "All rights reserved",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.cookies": "Cookie Policy",

      // Form
      "form.fullNamePh": "Full name",
      "form.emailPh": "you@email.com",
      "form.messagePh": "How can we help you?",
      "form.send": "Send message",
      "form.err.required": "Please complete your name, email and message.",
      "form.err.email": "Please enter a valid email.",
      "form.ok": "Message sent. We’ll contact you shortly.",
      "form.sending": "Sending…",
      "form.fail": "Something went wrong. Please try again.",

      // UI
      "ui.openMenu": "Open menu",
      "ui.closeMenu": "Close menu",
      "ui.langSelect": "Select language",
      "ui.goHome": "Go to home",
      "ui./*toggleTheme_removed*/": "Toggle light/dark theme",
      "ui.scrollNext": "Scroll to next section",

      // CTA mini
      
      // About page (acerca.html)
      "meta.title.about": "Bausen — About",
      "about.hero.pill": "About",
      "about.hero.title": "About<br /><span class='hero__accent'>BAUSEN</span>",
      "about.hero.subtitle":
        "We are your strategic ally in integrated business solutions.\nWith more than 15 years of experience, we have supported hundreds of organizations\nin their transformation and growth.",
      "about.hero.cta1": "Get to know us",
      "about.hero.cta2": "Our Essence",
      "about.stat.years": "Years of experience",
      "about.stat.companies": "Companies served",
      "about.stat.satisfaction": "Satisfaction",
      "about.stat.services": "Key services",
      "about.panel.chip.trust": "Trust",
      "about.panel.chip.design": "Design",
      "about.panel.chip.results": "Results",
      "about.panel.holo.subtitle": "Consulting & Solutions",
      "about.panel.card1.title": "Measurable focus",
      "about.panel.card1.text": "KPIs and real tracking.",
      "about.panel.card2.title": "Agile implementation",
      "about.panel.card2.text": "Fast and structured.",
      "about.panel.hint": "Lighting + premium “glass” effect",

      "about.essence.pill": "Our Essence",
      "about.essence.title": "Our Essence",
      "about.essence.sub": "The core pillars that guide every decision and action at BAUSEN.",
      "about.essence.mission": "Mission",
      "about.essence.missionText":
        "To drive the growth of organizations through integrated business solutions,\nfocused on sustainable and measurable results.",
      "about.essence.vision": "Vision",
      "about.essence.visionText":
        "To be a benchmark in consulting and solutions, connecting strategy, talent and execution\nwith a premium standard of quality and trust.",
      "about.essence.values": "Values",
      "about.essence.valuesText":
        "Integrity, excellence, closeness and continuous improvement. We build long-term relationships\nwith transparency and commitment.",
      "about.anchor.stories": "View client stories",

      "about.stories.title": "Client Stories",
      "about.stories.sub": "Real results with direct impact on operations, sales and teams.",
      "about.testimonial.ariaStars": "5 stars",
      "about.testimonial.pill1": "+32% efficiency",
      "about.testimonial.q1":
        "“BAUSEN helped us structure processes and KPIs. Implementation was fast and the support was flawless.”",
      "about.testimonial.role1": "COO — Retail Partner",
      "about.testimonial.pill2": "Risk ↓",
      "about.testimonial.q2":
        "“The approach is professional, clear and measurable. We achieved financial order and better data-driven decisions.”",
      "about.testimonial.role2": "Director — Services Group",
      "about.testimonial.pill3": "Team +",
      "about.testimonial.q3":
        "“We improved communication and productivity with a clear roadmap. The premium standard shows in every deliverable.”",
      "about.testimonial.role3": "HR Lead — Innovation",

      "about.why.title": "Why <span class='accent'>BAUSEN</span>?",
      "about.why.sub": "Discover why hundreds of companies trust us.",
      "about.why.card1.t": "Expert team",
      "about.why.card1.p": "Professionals with real experience in consulting, operations and digital transformation.",
      "about.why.card2.t": "Proven results",
      "about.why.card2.p": "Measurable methodology, clear deliverables and improvements reflected in KPIs.",
      "about.why.card3.t": "Continuous innovation",
      "about.why.card3.p": "Constant improvement with modern tools, automation and premium design.",
      "about.why.card4.t": "Reliability",
      "about.why.card4.p": "Commitment to confidentiality, professional ethics and full transparency.",
      "about.why.card5.t": "End-to-end solutions",
      "about.why.card5.p": "Training, accounting, legal, human capital and organization in one place.",
      "about.why.card6.t": "Human approach",
      "about.why.card6.p": "We understand your context, manage change and work with you step by step.",

      "about.team.pill": "Leadership",
      "about.team.title": "Our <span class='accent'>Executive</span> Team",
      "about.team.sub": "Leadership with experience and a commitment to excellence.",
      "about.team.cardTitle": "General Management",
      "about.team.cardRole": "Chief Executive Officer",

      "about.process.pill": "Methodology",
      "about.process.title": "Our Process",
      "about.process.sub": "A structured approach that ensures exceptional results.",
      "about.process.step1.t": "Assessment",
      "about.process.step1.p": "We understand your context, objectives and priorities.",
      "about.process.step2.t": "Design",
      "about.process.step2.p": "We define the roadmap, deliverables and success metrics.",
      "about.process.step3.t": "Implementation",
      "about.process.step3.p": "We execute with control, communication and focus.",
      "about.process.step4.t": "Follow-up",
      "about.process.step4.p": "Ongoing support and continuous improvement with KPIs.",

      "about.history.pill": "History & Milestones",
      "about.history.title": "History & Milestones",
      "about.history.sub": "Key milestones that define BAUSEN’s evolution.",
      "about.history.2009": "BAUSEN is founded and delivers its first operational consulting implementations.",
      "about.history.2012": "Expansion of integrated services: finance, legal and human capital.",
      "about.history.2016": "Premium standardization: KPI-driven methodology and measurable deliverables.",

      "about.faq.title": "Frequently <span class='accent'>Asked Questions</span>",
      "about.faq.sub": "Clear answers to make a confident decision.",
      "about.faq.searchPh": "e.g., What kind of companies do you serve?",
      "about.faq.searchAria": "Search frequently asked questions",
      "about.faq.empty": "No matches found. Try another search.",
      "about.faq.q1": "What kind of companies do you serve?",
      "about.faq.a1":
        "We serve from SMEs to organizations with complex operations. We tailor scope and methodology to your stage and goals.",
      "about.faq.q2": "How long does it take to see results?",
      "about.faq.a2":
        "It depends on the project. In most cases, you’ll see progress in 2–4 weeks and measurable results in 6–10 weeks.",
      "about.faq.q3": "How is the service scope defined?",
      "about.faq.a3":
        "We start with an assessment and agree on deliverables, timeline and KPIs. Everything is documented from day one.",
      "about.faq.q4": "Do you handle confidentiality?",
      "about.faq.a4": "Yes. We work with NDAs and best practices for secure information handling.",
      "about.faq.q5": "Can I request a personalized consulting engagement?",
      "about.faq.a5":
        "Of course. We can schedule a call to understand your case and propose a roadmap with estimated costs and timelines.",
      "about.faq.q6": "Do you offer post-project support?",
      "about.faq.a6": "Yes. We provide KPI-based follow-up and control sessions to sustain results and scale improvements.",

      "about.cta.aria": "Quick contact",
      "about.cta.qPh": "Can I request a personalized consulting engagement?",
      "about.cta.qAria": "Question or message",
      "about.cta.ePh": "Your email so we can reply",
      "about.cta.eAria": "Email",
      "about.cta.btn": "Contact us",
"cta.err.question": "Write your question (min. 5 characters).",
      "cta.err.email": "Enter a valid email so we can reply.",
      "cta.ok": "Done. We received your message and will reply soon.",
    },
  };

  /* =========================
     Flags (keep all)
  ========================= */
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

  /* =========================
     ONE language source of truth
  ========================= */
  const LANG_KEY = "bausen_lang";

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
    return "EN"; // ✅ default site language
  };

  const getLang = () => {
    const saved = storage.get(LANG_KEY, null) || storage.get("preferred-language", null);
    return normalizeLang(saved || "EN");
  };

  const setLang = (lang) => {
    const L = normalizeLang(lang);
    storage.set(LANG_KEY, L);
    storage.set("preferred-language", L);
    applyTranslations(L);
  };

  const t = (lang, key) => {
    const L = normalizeLang(lang);
    const dict = I18N[L] || I18N.ES;
    return dict[key] ?? (I18N.ES[key] ?? key);
  };

  /* =========================
     Translator (ONLY data-i18n*)
  ========================= */
  function applyTranslations(lang) {
    const L = normalizeLang(lang);

    document.documentElement.setAttribute("lang", L === "EN" ? "en" : "es");

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.innerHTML = t(L, key);
    });

    $$("[data-i18n-text]").forEach((el) => {
      const key = el.getAttribute("data-i18n-text");
      if (!key) return;
      el.textContent = t(L, key);
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", t(L, key));
    });

    const menuToggle = byId("menu-toggle", "menuToggle");
    if (menuToggle) menuToggle.setAttribute("aria-label", t(L, "ui.openMenu"));
    const closeMenu = byId("close-menu", "menuClose");
    if (closeMenu) closeMenu.setAttribute("aria-label", t(L, "ui.closeMenu"));

    const themeToggle = byId("theme-toggle", "themeToggle");
    if (themeToggle) themeToggle.setAttribute("aria-label", t(L, "ui./*toggleTheme_removed*/"));
    const themeToggleMobile = byId("themeToggleMobile");
    if (themeToggleMobile) themeToggleMobile.setAttribute("aria-label", t(L, "ui./*toggleTheme_removed*/"));

    const langBtn = byId("language-btn", "languageBtn");
    if (langBtn) langBtn.setAttribute("aria-label", t(L, "ui.langSelect"));
    const logoLink = $(".logo-link");
    if (logoLink) logoLink.setAttribute("aria-label", t(L, "ui.goHome"));
    const scrollBtn = $(".scroll-indicator");
    if (scrollBtn) scrollBtn.setAttribute("aria-label", t(L, "ui.scrollNext"));

    const languageCode = byId("language-code", "languageCode");
    const mobileSelect = byId("mobile-language-select", "mobileLanguageSelect");
    if (languageCode) languageCode.textContent = L;
    if (mobileSelect) mobileSelect.value = L;

    const flagEl = byId("language-flag", "languageFlag");
    if (flagEl) flagEl.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;

    $$("[data-flag]").forEach((el) => {
      const code = normalizeLang(el.getAttribute("data-flag") || "ES");
      el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
    });

    try { translateAcercaPage(L); } catch (err) {}
  

    // Two-tone: 1ra palabra azul marino, resto negro (títulos)
    $$(".two-tone").forEach(applyTwoToneWords);
}

  /* =========================
     Language UI
  ========================= */
  
    // Page-specific bindings for acerca.html (keeps HTML unchanged)
    function translateAcercaPage(L) {
      // Title
      const nextTitle = t(L, "meta.title.about");
      if (nextTitle && nextTitle !== "meta.title.about") document.title = nextTitle;

      const htmlFromText = (s) => String(s || "").replace(/\n/g, "<br />");

      const setText = (sel, key) => {
        const el = $(sel);
        if (!el) return;
        el.textContent = t(L, key);
      };

      const setHTML = (sel, key, multiline = false) => {
        const el = $(sel);
        if (!el) return;
        const val = t(L, key);
        el.innerHTML = multiline ? htmlFromText(val) : val;
      };

      const setPlaceholder = (sel, key) => {
        const el = $(sel);
        if (!el) return;
        el.setAttribute("placeholder", t(L, key));
      };

      const setAria = (sel, key) => {
        const el = $(sel);
        if (!el) return;
        el.setAttribute("aria-label", t(L, key));
      };

      const setLeadingIconText = (sel, key) => {
        const el = $(sel);
        if (!el) return;
        const icon = el.querySelector("i, svg");
        if (icon) {
          el.innerHTML = `${icon.outerHTML} ${t(L, key)}`;
        } else {
          el.textContent = t(L, key);
        }
      };

      const setTrailingIconText = (sel, key) => {
        const el = $(sel);
        if (!el) return;
        const icon = el.querySelector("i, svg");
        if (icon) {
          el.innerHTML = `${t(L, key)} ${icon.outerHTML}`;
        } else {
          el.textContent = t(L, key);
        }
      };

      // HERO
      setLeadingIconText(".hero .pill", "about.hero.pill");
      setHTML(".hero__title", "about.hero.title");
      setHTML(".hero__subtitle", "about.hero.subtitle", true);
      setTrailingIconText(".hero__cta .btn--primary", "about.hero.cta1");
      setText(".hero__cta .btn--ghost", "about.hero.cta2");

      // Stats (labels only)
      setText(".stats .stat:nth-child(1) .stat__t", "about.stat.years");
      setText(".stats .stat:nth-child(2) .stat__t", "about.stat.companies");
      setText(".stats .stat:nth-child(3) .stat__t", "about.stat.satisfaction");
      setText(".stats .stat:nth-child(4) .stat__t", "about.stat.services");

      // Panel chips (keep icons)
      setLeadingIconText(".hero__panel-top .chip-mini:nth-child(1)", "about.panel.chip.trust");
      setLeadingIconText(".hero__panel-top .chip-mini:nth-child(2)", "about.panel.chip.design");
      setLeadingIconText(".hero__panel-top .chip-mini:nth-child(3)", "about.panel.chip.results");

      // Hologram label
      setText(".holo__txt span", "about.panel.holo.subtitle");

      // Mini cards (two)
      setText(".mini-card:nth-of-type(1) strong", "about.panel.card1.title");
      setText(".mini-card:nth-of-type(1) p", "about.panel.card1.text");
      setText(".mini-card:nth-of-type(2) strong", "about.panel.card2.title");
      setText(".mini-card:nth-of-type(2) p", "about.panel.card2.text");

      setText(".hero__panel-hint", "about.panel.hint");

      // ESENCIA
      setLeadingIconText("#esencia .pill", "about.essence.pill");
      setText("#esencia .section__title", "about.essence.title");
      setText("#esencia .section__sub", "about.essence.sub");

      setText("#esencia .e-card:nth-of-type(1) h3", "about.essence.mission");
      setHTML("#esencia .e-card:nth-of-type(1) p", "about.essence.missionText", true);
      setText("#esencia .e-card:nth-of-type(2) h3", "about.essence.vision");
      setHTML("#esencia .e-card:nth-of-type(2) p", "about.essence.visionText", true);
      setText("#esencia .e-card:nth-of-type(3) h3", "about.essence.values");
      setHTML("#esencia .e-card:nth-of-type(3) p", "about.essence.valuesText", true);

      setLeadingIconText("#esencia .anchor a", "about.anchor.stories");

      // HISTORIAS
      setText("#historias .section__title", "about.stories.title");
      setText("#historias .section__sub", "about.stories.sub");
      const stars = $("#historias .stars");
      if (stars) stars.setAttribute("aria-label", t(L, "about.testimonial.ariaStars"));

      // Testimonial cards (3) - keep names, translate pills/quotes/roles
      const tCards = $$("#historias .tcard");
      if (tCards.length >= 1) {
        setText("#historias .tcard:nth-of-type(1) .result-pill", "about.testimonial.pill1");
        setText("#historias .tcard:nth-of-type(1) .tcard__q", "about.testimonial.q1");
        setText("#historias .tcard:nth-of-type(1) .tcard__who span", "about.testimonial.role1");
      }
      if (tCards.length >= 2) {
        setText("#historias .tcard:nth-of-type(2) .result-pill", "about.testimonial.pill2");
        setText("#historias .tcard:nth-of-type(2) .tcard__q", "about.testimonial.q2");
        setText("#historias .tcard:nth-of-type(2) .tcard__who span", "about.testimonial.role2");
      }
      if (tCards.length >= 3) {
        setText("#historias .tcard:nth-of-type(3) .result-pill", "about.testimonial.pill3");
        setText("#historias .tcard:nth-of-type(3) .tcard__q", "about.testimonial.q3");
        setText("#historias .tcard:nth-of-type(3) .tcard__who span", "about.testimonial.role3");
      }

      // POR QUE
      setHTML("#porque .section__title", "about.why.title");
      setText("#porque .section__sub", "about.why.sub");

      const whyCards = $$("#porque .why-card");
      if (whyCards.length >= 6) {
        setText("#porque .why-card:nth-of-type(1) h3", "about.why.card1.t");
        setText("#porque .why-card:nth-of-type(1) p", "about.why.card1.p");
        setText("#porque .why-card:nth-of-type(2) h3", "about.why.card2.t");
        setText("#porque .why-card:nth-of-type(2) p", "about.why.card2.p");
        setText("#porque .why-card:nth-of-type(3) h3", "about.why.card3.t");
        setText("#porque .why-card:nth-of-type(3) p", "about.why.card3.p");
        setText("#porque .why-card:nth-of-type(4) h3", "about.why.card4.t");
        setText("#porque .why-card:nth-of-type(4) p", "about.why.card4.p");
        setText("#porque .why-card:nth-of-type(5) h3", "about.why.card5.t");
        setText("#porque .why-card:nth-of-type(5) p", "about.why.card5.p");
        setText("#porque .why-card:nth-of-type(6) h3", "about.why.card6.t");
        setText("#porque .why-card:nth-of-type(6) p", "about.why.card6.p");
      }

      // EQUIPO
      setLeadingIconText("#equipo .pill", "about.team.pill");
      setHTML("#equipo .section__title", "about.team.title");
      setText("#equipo .section__sub", "about.team.sub");
      setText("#equipo .leader h3", "about.team.cardTitle");
      applyTwoToneWords($("#equipo .leader h3"));
      setText("#equipo .leader p", "about.team.cardRole");

      // PROCESO
      setLeadingIconText("#proceso .pill", "about.process.pill");
      setText("#proceso .section__title", "about.process.title");
      setText("#proceso .section__sub", "about.process.sub");

      setText("#proceso .pstep:nth-of-type(1) .pstep__t", "about.process.step1.t");
      setText("#proceso .pstep:nth-of-type(1) p", "about.process.step1.p");
      setText("#proceso .pstep:nth-of-type(2) .pstep__t", "about.process.step2.t");
      setText("#proceso .pstep:nth-of-type(2) p", "about.process.step2.p");
      setText("#proceso .pstep:nth-of-type(3) .pstep__t", "about.process.step3.t");
      setText("#proceso .pstep:nth-of-type(3) p", "about.process.step3.p");
      setText("#proceso .pstep:nth-of-type(4) .pstep__t", "about.process.step4.t");
      setText("#proceso .pstep:nth-of-type(4) p", "about.process.step4.p");

      // HISTORIA
      setLeadingIconText("#historia .pill", "about.history.pill");
      setText("#historia .section__title", "about.history.title");
      setText("#historia .section__sub", "about.history.sub");

      const yearCards = $$("#historia .year-card");
      yearCards.forEach((card) => {
        const year = card.querySelector(".year-card__year")?.textContent?.trim();
        const p = card.querySelector("p");
        if (!p || !year) return;
        const key = `about.history.${year}`;
        const val = t(L, key);
        if (val && val !== key) p.textContent = val;
      });

      // FAQ
      setHTML("#faq .section__title", "about.faq.title");
      setText("#faq .section__sub", "about.faq.sub");
      setPlaceholder("#faqSearch", "about.faq.searchPh");
      setAria("#faqSearch", "about.faq.searchAria");
      setText("#faqEmpty", "about.faq.empty");

      const faqItems = $$("#faqList .faq__item");
      if (faqItems.length >= 6) {
        for (let i = 1; i <= 6; i++) {
          setText(`#faqList .faq__item:nth-of-type(${i}) .faq__q`, `about.faq.q${i}`);
          setText(`#faqList .faq__item:nth-of-type(${i}) .faq__a`, `about.faq.a${i}`);
        }
      }

      // CTA mini
      setAria("#ctaContact", "about.cta.aria");
      setPlaceholder("#ctaQuestion", "about.cta.qPh");
      setAria("#ctaQuestion", "about.cta.qAria");
      setPlaceholder("#ctaEmail", "about.cta.ePh");
      setAria("#ctaEmail", "about.cta.eAria");
      setLeadingIconText("#ctaSend", "about.cta.btn");

      // FOOTER
      // Brand description (allows <br>)
      const footerDesc = $(".footer__desc");
      if (footerDesc) footerDesc.innerHTML = t(L, "footer.brandText");

      setText(".footer__hours strong", "footer.hoursLabel");
      setText(".footer__hours span", "footer.hoursValue");
      setText(".footer__social span", "footer.follow");

      const footCols = $$(".site-footer .footer__col");
      const colCompany = footCols[0] || null;
      const colServices = footCols[1] || null;
      const colContact = footCols[2] || null;

      if (colCompany) {
        const h = $("h4", colCompany);
        if (h) h.textContent = t(L, "footer.company");
        const links = $$("a", colCompany);
        if (links.length >= 5) {
          links[0].textContent = t(L, "footer.about");
          links[1].textContent = t(L, "footer.servicesLink");
          links[2].textContent = t(L, "footer.news");
          links[3].textContent = t(L, "footer.press");
          links[4].textContent = t(L, "footer.contact");
        }
      }

      if (colServices) {
        const h = $("h4", colServices);
        if (h) h.textContent = t(L, "footer.services");
        const links = $$("a", colServices);
        if (links.length >= 4) {
          links[0].textContent = t(L, "footer.svc.capital");
          links[1].textContent = t(L, "footer.svc.legal");
          links[2].textContent = t(L, "footer.svc.accounting");
          links[3].textContent = t(L, "footer.svc.orgdev");
        }
      }

      if (colContact) {
        const h = $("h4", colContact);
        if (h) h.textContent = t(L, "footer.contact");
        const noteP = $("p.muted", colContact);
        if (noteP) {
          const full = t(L, "footer.note");
          const idx = full.indexOf(".");
          if (idx > -1) {
            const first = full.slice(0, idx + 1);
            const rest = full.slice(idx + 1).trim();
            noteP.innerHTML = `<strong>${first}</strong> ${rest}`;
          } else {
            noteP.textContent = full;
          }
        }

        const contactLabels = $$(".footer__contact .citem strong", colContact);
        if (contactLabels.length >= 2) {
          contactLabels[0].textContent = t(L, "footer.phoneLabel");
          contactLabels[1].textContent = t(L, "footer.emailLabel");
        }

        setTrailingIconText(".footer__contact a.map", "footer.maps");
      }

// Bottom
      const bottomSpan = $(".footer__bottom > span");
      if (bottomSpan) bottomSpan.textContent = `© 2026 Bausen. ${t(L, "footer.rights")}`;

      const bottomLinks = $$(".footer__links a");
      if (bottomLinks.length >= 3) {
        bottomLinks[0].textContent = t(L, "footer.privacy");
        bottomLinks[1].textContent = t(L, "footer.terms");
        bottomLinks[2].textContent = t(L, "footer.cookies");
      }
    }

function initLanguage() {
    const languageBtn = byId("language-btn", "languageBtn");
    const languageDropdown = byId("language-dropdown", "languageDropdown");
    const languageOptions = $$(".language-option");
    const mobileLanguageSelect = byId("mobile-language-select", "mobileLanguageSelect");

    applyTranslations(getLang());

    if (languageBtn && languageDropdown) {
      const open = () => {
        languageBtn.setAttribute("aria-expanded", "true");
        languageDropdown.classList.add("show");
      };
      const close = () => {
        languageBtn.setAttribute("aria-expanded", "false");
        languageDropdown.classList.remove("show");
      };

      languageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = languageBtn.getAttribute("aria-expanded") === "true";
        expanded ? close() : open();
      });

      languageOptions.forEach((opt) => {
        opt.addEventListener("click", () => {
          const lang = opt.getAttribute("data-lang") || "EN";
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

  // Helper para tu ESC global (no afecta el motor i18n; solo evita crash si ESC se dispara)
  const closeLang = () => {
    const languageBtn = byId("language-btn", "languageBtn");
    const languageDropdown = byId("language-dropdown", "languageDropdown");
    if (!languageBtn || !languageDropdown) return;
    languageBtn.setAttribute("aria-expanded", "false");
    languageDropdown.classList.remove("show");
  };

  /* =========================
     FAQ (accordion + search)
  ========================= */
  const faqSearch = $("#faqSearch");
  const faqList = $("#faqList");
  const faqEmpty = $("#faqEmpty");

  const faqItems = faqList ? $$(".faq__item", faqList) : [];

  const setFaqExpanded = (btn, expanded) => {
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  faqItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      // close others (premium behavior)
      faqItems.forEach((b) => b !== btn && setFaqExpanded(b, false));
      setFaqExpanded(btn, !isOpen);
    });
  });
/* =========================
   FAQ hover open/close (DESKTOP)
   - No toca IDs, ni CSS
   - No rompe click: click sigue funcionando igual
========================= */
(() => {
  const canHover =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!canHover) return;

  faqItems.forEach((btn) => {
    let t = null;

    btn.addEventListener("pointerenter", () => {
      clearTimeout(t);
      // abre el que estás “hovering” y cierra los demás (misma lógica premium)
      faqItems.forEach((b) => b !== btn && setFaqExpanded(b, false));
      setFaqExpanded(btn, true);
    });

    btn.addEventListener("pointerleave", () => {
      clearTimeout(t);
      // cierra suave al salir del botón completo
      t = setTimeout(() => setFaqExpanded(btn, false), 120);
    });
  });
})();
  const normalize = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const filterFaq = () => {
    if (!faqSearch || !faqList) return;
    const q = normalize(faqSearch.value.trim());
    let visibleCount = 0;

    faqItems.forEach((btn) => {
      const qText = normalize($(".faq__q", btn)?.textContent || "");
      const aText = normalize($(".faq__a", btn)?.textContent || "");
      const match = !q || qText.includes(q) || aText.includes(q);

      btn.hidden = !match;
      if (match) visibleCount += 1;

      // collapse hidden items to avoid layout weirdness
      if (!match) setFaqExpanded(btn, false);
    });

    if (faqEmpty) faqEmpty.hidden = visibleCount !== 0;
  };

  faqSearch?.addEventListener("input", filterFaq);

  /* =========================
     Reveal on scroll
  ========================= */
  const initReveal = () => {
    const items = $$(".reveal");
    if (!items.length) return;

    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduce) {
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
      { threshold: 0.12 }
    );

    items.forEach((el) => io.observe(el));
  };

  /* =========================
     Tilt 3D (data-tilt)
  ========================= */
  const initTilt = () => {
    const cards = $$("[data-tilt]");
    if (!cards.length) return;

    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const onMove = (el, ev) => {
      const rect = el.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width; // 0..1
      const py = (ev.clientY - rect.top) / rect.height; // 0..1
      const ry = (px - 0.5) * 10; // deg
      const rx = (0.5 - py) * 10; // deg
      el.style.setProperty("--tilt-rx", `${clamp(rx, -10, 10)}deg`);
      el.style.setProperty("--tilt-ry", `${clamp(ry, -10, 10)}deg`);
      el.style.setProperty("--tilt-z", `0px`);
      el.classList.add("is-tilting");
    };

    const onLeave = (el) => {
      el.style.setProperty("--tilt-rx", `0deg`);
      el.style.setProperty("--tilt-ry", `0deg`);
      el.style.setProperty("--tilt-z", `0px`);
      el.classList.remove("is-tilting");
    };

    cards.forEach((el) => {
      el.addEventListener("mousemove", (ev) => onMove(el, ev));
      el.addEventListener("mouseleave", () => onLeave(el));
      el.addEventListener("blur", () => onLeave(el));
    });
  };

  /* =========================
     CTA mini (fake send -> feedback)
  ========================= */
  const ctaBtn = $("#ctaSend");
  const ctaQuestion = $("#ctaQuestion");
  const ctaEmail = $("#ctaEmail");
  const ctaMsg = $("#ctaMsg");

  const showCtaMsg = (text, ok = true) => {
    if (!ctaMsg) return;
    ctaMsg.textContent = text;
    ctaMsg.style.color = ok ? "" : "var(--danger)";
    // auto clear
    clearTimeout(showCtaMsg._t);
    showCtaMsg._t = setTimeout(() => {
      if (ctaMsg) ctaMsg.textContent = "";
    }, 3800);
  };

  ctaBtn?.addEventListener("click", () => {
    const q = (ctaQuestion?.value || "").trim();
    const e = (ctaEmail?.value || "").trim();

    if (!q || q.length < 5) {
      showCtaMsg(t(getLang(), "cta.err.question"), false);
      ctaQuestion?.focus();
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    if (!emailOk) {
      showCtaMsg(t(getLang(), "cta.err.email"), false);
      ctaEmail?.focus();
      return;
    }

    // Aquí podrías integrar tu backend / EmailJS / API.
    showCtaMsg(t(getLang(), "cta.ok"), true);

    if (ctaQuestion) ctaQuestion.value = "";
    if (ctaEmail) ctaEmail.value = "";
  });

  /* =========================
     Global key handling
  ========================= */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLang();
      if (mobileMenu && mobileMenu.classList.contains("open")) closeMenu();
    }
  });

  /* =========================
     Init
  ========================= */
  
  initLanguage();
  initReveal();
  initTilt();

  // initial FAQ filter (keeps empty state consistent)
  filterFaq();

  /* =========================
     Active link highlight (mobile menu)
     - Adds .active + aria-current="page" based on current URL
     - Supports your existing data-page attributes
  ========================= */
  function initActiveLink() {
    const links = $$(".nav-link, .mobile-nav-link, .mobile-sub-link, .mobile-nav__link");

    const file = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const pageNoExt = file.split("?")[0].split("#")[0].replace(".html", "").replace(".htm", "");

    const alias = {
      indexbeca: "index",
      index: "index",
      inicio: "index",
      contacto: "contacto",
      acercade: "acercade",
      acerca: "acercade",
      servicios: "servicios",
      noticias: "noticias",
      prensa: "prensa",
      centro: "centro",
      capital: "servicios",
      impuestos: "servicios",
    };

    const currentKey = alias[pageNoExt] || pageNoExt;

    const keyFromLink = (a) => {
      // Prefer explicit data-page (used in your menu)
      const dp = (a.getAttribute("data-page") || "").trim().toLowerCase();
      if (dp) return dp;

      const href = (a.getAttribute("href") || "").trim().toLowerCase();
      const last = href.split("/").pop().split("?")[0].split("#")[0];
      const noExt = last.replace(".html", "").replace(".htm", "");
      return alias[noExt] || noExt;
    };

    links.forEach((a) => {
      const key = keyFromLink(a);
      const isCurrent = key === currentKey;

      a.classList.toggle("active", isCurrent);

      if (isCurrent) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  // run active link init
  initActiveLink();

})();
