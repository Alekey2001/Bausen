'use strict';

/**
 * ============================================
 * servicios.js
 * - 6 idiomas visibles (ES/EN/PT/DE/FR/IT) con banderas SVG (mismo formato que capital)
 * - Traducción REAL: ES y EN
 * - Los demás (PT/DE/FR/IT) heredan EN (para que "funcione" sin romper nada)
 * - Drawer móvil + Theme toggle + Header scrolled + ToTop + Reveal
 * ============================================
 */

/* =========================
   i18n / Language (COPIA EXACTA DE REFERENCIA)
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
    "ui.toggleTheme": "Cambiar tema claro/oscuro",
    "ui.scrollNext": "Bajar a la siguiente sección",

    // Servicios especializados page
    "b1Text": "Procesos definidos, responsables claros y tiempos de respuesta acordados (SLA) para mejorar el flujo operativo.",
    "b1Title": "Más eficiencia",
    "b2Text": "Bitácoras, entregables y reportes periódicos para auditar avances, incidencias y cumplimiento del alcance.",
    "b2Title": "Control y evidencia",
    "b3Text": "Indicadores medibles para tomar decisiones y ajustar la operación conforme a tus objetivos del negocio.",
    "b3Title": "KPIs y mejora continua",
    "benefitsSub": "Diseñamos un servicio para reducir fricción, aumentar productividad y mantener visibilidad con reportes claros.",
    "benefitsTitle": "Resultados que se sienten en operación",
    "callout": "<strong>Enfoque BAUSEN:</strong> alcance claro + evidencia + KPIs. Lo que se mide, se mejora.",
    "calloutCta": "Quiero un diagnóstico",
    "casesSub": "Espacio para testimonios / métricas antes-después (ideal para SEO y confianza).",
    "casesTitle": "Casos y resultados",
    "country": "MÉXICO",
    "ctaPrimary": "Solicitar diagnóstico",
    "ctaSecondary": "Ver alcance",
    "emailLabel": "Email:",
    "eyebrow": "Servicios especializados",
    "fCompany": "Empresa",
    "fEmail": "Correo",
    "fName": "Nombre completo",
    "fNeed": "¿Qué necesitas?",
    "fNeedPh": "Ej. Quiero mejorar tiempos, control operativo y reporteo con KPIs.",
    "fPhone": "Teléfono",
    "fPrivacy": "Acepto el aviso de privacidad.",
    "fSubmit": "Enviar",
    "faq1A": "Son servicios enfocados en actividades específicas para mejorar eficiencia y control. El servicio se documenta con alcance,\n                entregables y métricas, para asegurar resultados verificables.",
    "faq1Q": "¿Qué son los servicios especializados?",
    "faq2A": "Primero hacemos un diagnóstico breve, definimos alcance y KPIs, y armamos un plan de arranque. Luego ejecutamos onboarding y\n                arrancamos operación con reportes periódicos.",
    "faq2Q": "¿Cómo iniciamos?",
    "faq3A": "Depende del volumen y madurez del proceso. Normalmente se percibe orden y control desde el arranque; la mejora de KPIs se\n                consolida en ciclos de 30–90 días (según alcance).",
    "faq3Q": "¿En cuánto tiempo se ven resultados?",
    "faqSub": "Resolvemos dudas comunes antes de agendar.",
    "faqTitle": "Preguntas frecuentes",
    "fineprint": "Al enviar aceptas ser contactado por BAUSEN para dar seguimiento a tu solicitud.",
    "h1": "Aumenta la eficiencia y resultados de tu negocio.",
    "heroFigcap": "Servicios especializados con enfoque en control, métricas y cumplimiento.",
    "hours": "Lun–Vie: 9:00–18:00",
    "hoursLabel": "Horario:",
    "lead": "Operación más ágil, controlable y medible. Diseñamos un modelo de servicio con alcance claro,\n            indicadores (KPIs) y seguimiento continuo para impulsar productividad y cumplimiento.",
    "leadSub": "Cuéntanos tu necesidad y un especialista te contacta. Entre más contexto compartas, más precisa será la propuesta.",
    "leadTitle": "Agenda un diagnóstico",
    "locationLabel": "Ubicación:",
    "mini1": "Respuesta rápida",
    "mini2": "Alcance y KPIs desde el inicio",
    "mini3": "Propuesta clara y medible",
    "nav.cta": "Agendar diagnóstico",
    "p1Text": "Entendemos tu operación, riesgos, metas y restricciones. Definimos “qué sí / qué no”.",
    "p1Title": "1) Diagnóstico",
    "p2Text": "Alcance, SLA, responsables, KPIs, entregables y calendario de seguimiento.",
    "p2Title": "2) Diseño del servicio",
    "p3Text": "Arranque controlado, documentación, checklist y validación de flujo operativo.",
    "p3Title": "3) Onboarding",
    "p4Text": "Reportes, métricas, revisión periódica y ajustes para optimizar resultados.",
    "p4Title": "4) Operación + mejora",
    "phoneLabel": "Teléfono:",
    "q1": "“Reducimos tiempos de respuesta y obtuvimos visibilidad total del servicio con reportes claros.”",
    "q1c": "— Dirección de Operaciones (Cliente)",
    "q2": "“El arranque fue ordenado: alcance bien definido y seguimiento semanal con KPIs.”",
    "q2c": "— Gerencia Administrativa (Cliente)",
    "q3": "“La operación se estabilizó rápido y logramos mejorar productividad sin perder control.”",
    "q3c": "— Recursos Humanos (Cliente)",
    "s1Title": "Operación especializada por proceso",
    "s1i1": "Levantamiento y mapeo de procesos",
    "s1i2": "Definición de roles, responsabilidades y SLA",
    "s1i3": "Supervisión operativa y control de incidencias",
    "s1i4": "Entregables y evidencia documental",
    "s2Title": "Modelo de control y reporteo",
    "s2i1": "KPIs por área / operación",
    "s2i2": "Reportes ejecutivos (semanal / mensual)",
    "s2i3": "Tablero de seguimiento (metrics-first)",
    "s2i4": "Reuniones de revisión y mejora continua",
    "s3Title": "Gobernanza y cumplimiento (según alcance)",
    "s3i1": "Matriz RACI y políticas operativas",
    "s3i2": "Control de accesos y trazabilidad (si aplica)",
    "s3i3": "Auditoría interna de evidencias",
    "s3i4": "Soporte documental para revisiones",
    "s4Title": "Onboarding e implementación",
    "s4i1": "Plan de arranque con cronograma",
    "s4i2": "Checklist de requisitos y documentación",
    "s4i3": "Capacitación rápida a responsables",
    "s4i4": "Arranque controlado + estabilización",
    "scopeSub": "El alcance exacto depende de tu necesidad. Estos son módulos típicos que podemos integrar en tu operación.",
    "scopeTitle": "¿Qué incluye “Servicios especializados”?",
    "sec1": "Manufactura",
    "sec2": "Logística",
    "sec3": "Retail",
    "sec4": "Servicios",
    "sec5": "Construcción",
    "sec6": "Corporativo / PyME",
    "sectorsSub": "Adaptamos el modelo al tipo de operación y volumen de trabajo.",
    "sectorsTitle": "Sectores que atendemos",
    "stat1": "Años de experiencia",
    "stat2": "Clientes",
    "stat3": "Satisfacción",
    "stepsSub": "Un método simple para arrancar rápido y operar con orden.",
    "stepsTitle": "Implementación en 4 pasos",
    "ui.lang": "Idioma",
    "ui.menu": "Menú",
    "ui.skip": "Saltar al contenido",

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
    "ui.toggleTheme": "Toggle light/dark theme",
    "ui.scrollNext": "Scroll to next section",

    // Specialized services page
    "b1Text": "Defined processes, clear owners, and agreed response times (SLAs) to improve operational flow.",
    "b1Title": "More efficiency",
    "b2Text": "Logs, deliverables, and periodic reports to audit progress, incidents, and scope compliance.",
    "b2Title": "Control & evidence",
    "b3Text": "Measurable indicators to make decisions and adjust operations to your business goals.",
    "b3Title": "KPIs & continuous improvement",
    "benefitsSub": "We design a service to reduce friction, increase productivity, and maintain visibility with clear reports.",
    "benefitsTitle": "Operational results you can feel",
    "callout": "<strong>BAUSEN approach:</strong> clear scope + evidence + KPIs. What gets measured, gets improved.",
    "calloutCta": "I want a diagnosis",
    "casesSub": "Space for testimonials / before-after metrics (ideal for SEO and trust).",
    "casesTitle": "Cases & results",
    "country": "MEXICO",
    "ctaPrimary": "Request a diagnosis",
    "ctaSecondary": "View scope",
    "emailLabel": "Email:",
    "eyebrow": "Specialized services",
    "fCompany": "Company",
    "fEmail": "Email",
    "fName": "Full name",
    "fNeed": "What do you need?",
    "fNeedPh": "e.g., I want to improve timelines, operational control, and KPI reporting.",
    "fPhone": "Phone",
    "fPrivacy": "I accept the privacy notice.",
    "fSubmit": "Send",
    "faq1A": "They are services focused on specific activities to improve efficiency and control. The service is documented with scope, deliverables, and metrics to ensure verifiable results.",
    "faq1Q": "What are specialized services?",
    "faq2A": "We begin with a brief diagnosis, define scope and KPIs, and build a kickoff plan. Then we run onboarding and start operations with periodic reporting.",
    "faq2Q": "How do we start?",
    "faq3A": "It depends on volume and process maturity. Typically, order and control are noticeable from day one; KPI improvement consolidates over 30–90 day cycles (depending on scope).",
    "faq3Q": "How soon will we see results?",
    "faqSub": "We answer common questions before booking.",
    "faqTitle": "Frequently asked questions",
    "fineprint": "By submitting, you agree to be contacted by BAUSEN to follow up on your request.",
    "h1": "Boost your business efficiency and results.",
    "heroFigcap": "Specialized services focused on control, metrics, and compliance.",
    "hours": "Mon–Fri: 9:00–18:00",
    "hoursLabel": "Hours:",
    "lead": "More agile, controllable, and measurable operations. We design a service model with clear scope, KPIs, and continuous follow-up to boost productivity and compliance.",
    "leadSub": "Tell us what you need and a specialist will contact you. The more context you share, the more precise the proposal.",
    "leadTitle": "Book a diagnosis",
    "locationLabel": "Location:",
    "mini1": "Fast response",
    "mini2": "Scope and KPIs from day one",
    "mini3": "Clear, measurable proposal",
    "nav.cta": "Book a diagnosis",
    "p1Text": "We understand your operation, risks, goals, and constraints. We define what’s in / out.",
    "p1Title": "1) Diagnosis",
    "p2Text": "Scope, SLAs, owners, KPIs, deliverables, and follow-up cadence.",
    "p2Title": "2) Service design",
    "p3Text": "Controlled kickoff, documentation, checklists, and operational flow validation.",
    "p3Title": "3) Onboarding",
    "p4Text": "Reporting, metrics, periodic reviews, and adjustments to optimize results.",
    "p4Title": "4) Operations + improvement",
    "phoneLabel": "Phone:",
    "q1": "“We reduced response times and gained full visibility of the service with clear reports.”",
    "q1c": "— Operations Director (Client)",
    "q2": "“The kickoff was orderly: well-defined scope and weekly KPI tracking.”",
    "q2c": "— Administrative Management (Client)",
    "q3": "“Operations stabilized quickly and we improved productivity without losing control.”",
    "q3c": "— Human Resources (Client)",
    "s1Title": "Process-specific specialized operations",
    "s1i1": "Process discovery and mapping",
    "s1i2": "Definition of roles, responsibilities, and SLAs",
    "s1i3": "Operational supervision and incident control",
    "s1i4": "Deliverables and documentary evidence",
    "s2Title": "Control and reporting model",
    "s2i1": "KPIs by area / operation",
    "s2i2": "Executive reports (weekly / monthly)",
    "s2i3": "Tracking dashboard (metrics-first)",
    "s2i4": "Review meetings and continuous improvement",
    "s3Title": "Governance and compliance (as applicable)",
    "s3i1": "RACI matrix and operational policies",
    "s3i2": "Access control and traceability (if applicable)",
    "s3i3": "Internal audit of evidence",
    "s3i4": "Documentation support for reviews",
    "s4Title": "Onboarding and implementation",
    "s4i1": "Kickoff plan with timeline",
    "s4i2": "Requirements and documentation checklist",
    "s4i3": "Quick training for owners",
    "s4i4": "Controlled go-live + stabilization",
    "scopeSub": "The exact scope depends on your needs. These are typical modules we can integrate into your operation.",
    "scopeTitle": "What’s included in “Specialized Services”?",
    "sec1": "Manufacturing",
    "sec2": "Logistics",
    "sec3": "Retail",
    "sec4": "Services",
    "sec5": "Construction",
    "sec6": "Corporate / SMB",
    "sectorsSub": "We adapt the model to your operation type and workload volume.",
    "sectorsTitle": "Industries we serve",
    "stat1": "Years of experience",
    "stat2": "Clients",
    "stat3": "Satisfaction",
    "stepsSub": "A simple method to start fast and operate with order.",
    "stepsTitle": "Implementation in 4 steps",
    "ui.lang": "Language",
    "ui.menu": "Menu",
    "ui.skip": "Skip to content",

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
   Flags injector (fix: avoid ReferenceError)
========================= */
function injectFlags() {
  const current = normalizeLang(getLang());
  const flagEl = document.getElementById("language-flag");
  if (flagEl) flagEl.innerHTML = FLAG_SVG[current] || FLAG_SVG.EN;

  document.querySelectorAll("[data-flag]").forEach((el) => {
    const code = normalizeLang(el.getAttribute("data-flag") || "EN");
    el.innerHTML = FLAG_SVG[code] || FLAG_SVG.EN;
  });
}

/* =========================
   ONE language source of truth
========================= */
const LANG_KEY = "bausen_lang";

const normalizeLang = (lang) => {
  const v = String(lang || "").trim();
  const up = v.toUpperCase();

  // accept common variants
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
  // compat: if you previously stored preferred-language
  const saved = storage.get(LANG_KEY, null) || storage.get("preferred-language", null);
  return normalizeLang(saved || "EN");
};

const setLang = (lang) => {
  const L = normalizeLang(lang);
  storage.set(LANG_KEY, L);
  // compat keep
  storage.set("preferred-language", L);
  applyTranslations(L);
};

const t = (lang, key) => {
  const L = normalizeLang(lang);
  const dict = I18N[L] || I18N.EN;
  return dict[key] ?? (I18N.EN[key] ?? (I18N.ES[key] ?? key));
};

/* =========================
   Translator (ONLY data-i18n*)
========================= */
function applyTranslations(lang) {
  const L = normalizeLang(lang);

  // semantic html lang
  document.documentElement.setAttribute("lang", L === "EN" ? "en" : "es");
  document.documentElement.setAttribute("data-lang", L);

  // translate innerHTML
  $$("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const val = t(L, key);
    // Compat: si no existe traducción en el diccionario (val===key), no sobreescribir el contenido.
    if (val === key) return;
    el.innerHTML = val;
  });

  // translate textContent
  $$("[data-i18n-text]").forEach((el) => {
    const key = el.getAttribute("data-i18n-text");
    if (!key) return;
    const val = t(L, key);
    if (val === key) return;
    el.textContent = val;
  });

  // placeholders
  $$("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    const val = t(L, key);
    if (val === key) return;
    el.setAttribute("placeholder", val);
  });

  // ARIA / UI labels (stable)
  const menuToggle = $("#menu-toggle") || $("#navToggle");
  if (menuToggle) menuToggle.setAttribute("aria-label", t(L, "ui.openMenu"));
  const closeMenu = $("#close-menu") || $("#navClose");
  if (closeMenu) closeMenu.setAttribute("aria-label", t(L, "ui.closeMenu"));
  const themeToggle = $("#theme-toggle") || $("#themeToggle");
  if (themeToggle) themeToggle.setAttribute("aria-label", t(L, "ui.toggleTheme"));
  const langBtn = $("#language-btn");
  if (langBtn) langBtn.setAttribute("aria-label", t(L, "ui.langSelect"));
  const logoLink = $(".logo-link") || $(".brand");
  if (logoLink) logoLink.setAttribute("aria-label", t(L, "ui.goHome"));
  const scrollBtn = $(".scroll-indicator");
  if (scrollBtn) scrollBtn.setAttribute("aria-label", t(L, "ui.scrollNext"));

  // sync language code + flag
  const languageCode = $("#language-code");
  const mobileSelect = $("#mobile-language-select");
  const mobileSelect2 = $("#mobileLanguageSelect");
  if (languageCode) languageCode.textContent = L;
  if (mobileSelect) mobileSelect.value = L;
  if (mobileSelect2) mobileSelect2.value = L;

  const flagEl = $("#language-flag");
  if (flagEl) flagEl.innerHTML = FLAG_SVG[L] || FLAG_SVG.ES;

  $$("[data-flag]").forEach((el) => {
    const code = normalizeLang(el.getAttribute("data-flag") || "ES");
    el.innerHTML = FLAG_SVG[code] || FLAG_SVG.ES;
  });
}

/* =========================
   Language UI
========================= */
function initLanguage() {
  const languageBtn = $("#language-btn");
  const languageDropdown = $("#language-dropdown");
  const languageOptions = $$(".language-option");
  const mobileLanguageSelect = $("#mobile-language-select");

  // init apply
  applyTranslations(getLang());

  // desktop dropdown
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

// ✅ Hover para abrir/cerrar idiomas (solo desktop con mouse)
const isDesktopHoverLang = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let langHoverTimer = null;

const clearLangHoverTimer = () => {
  if (langHoverTimer) {
    window.clearTimeout(langHoverTimer);
    langHoverTimer = null;
  }
};

const scheduleLangClose = () => {
  if (!isDesktopHoverLang()) return;
  clearLangHoverTimer();

  langHoverTimer = window.setTimeout(() => {
    const overBtn = languageBtn.matches(":hover");
    const overDrop = languageDropdown.matches(":hover");
    if (!overBtn && !overDrop) close();
  }, 180);
};

// Abre al pasar el mouse por el botón
languageBtn.addEventListener("mouseenter", () => {
  if (!isDesktopHoverLang()) return;
  clearLangHoverTimer();
  open();
});

// Mantener abierto si el mouse entra al dropdown
languageDropdown.addEventListener("mouseenter", () => {
  if (!isDesktopHoverLang()) return;
  clearLangHoverTimer();
});

// Cierra cuando sales del botón o del dropdown (con pequeño delay)
languageBtn.addEventListener("mouseleave", scheduleLangClose);
languageDropdown.addEventListener("mouseleave", scheduleLangClose);
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

  // mobile select
  if (mobileLanguageSelect) {
    mobileLanguageSelect.addEventListener("change", (e) => setLang(e.target.value));
  }
  const mobileLanguageSelect2 = $("#mobileLanguageSelect");
  if (mobileLanguageSelect2) {
    mobileLanguageSelect2.addEventListener("change", (e) => setLang(e.target.value));
  }
}

/* =========================
   Loader
========================= */

const STORAGE_LANG = 'bausen_lang';
const STORAGE_THEME = 'bausen_theme';


function initMobileMenu() {
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

  const rootEl = document.documentElement;

  const setLocked = (locked) => {
    rootEl.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
    document.body.classList.toggle("menu-open", locked);
  };

  const openMenu = () => {
    panel.classList.add("open");
    overlay.classList.add("show");
    toggleBtn.setAttribute("aria-expanded", "true");
    setLocked(true);

    window.setTimeout(() => {
      const firstLink =
        panel.querySelector(".mobile-nav-link, .mobile-nav__link") ||
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
    window.setTimeout(() => toggleBtn.focus(), 0);
  };

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    panel.classList.contains("open") ? closeMenuFn() : openMenu();
  });

  // Desktop hover behavior (PC): open menu on mouse over, close when leaving toggle+panel
  const isDesktopHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches && window.innerWidth >= 980;

  let hoverCloseTimer = null;

  const clearHoverTimer = () => {
    if (hoverCloseTimer) {
      window.clearTimeout(hoverCloseTimer);
      hoverCloseTimer = null;
    }
  };

  const leavingToMenuZone = (e) => {
    const to = e.relatedTarget;
    if (!to) return false;
    return (panel && panel.contains(to)) || (overlay && overlay.contains(to));
  };

  const leavingToToggleZone = (e) => {
    const to = e.relatedTarget;
    if (!to) return false;
    return (toggleBtn && toggleBtn.contains(to)) || (overlay && overlay.contains(to));
  };

  const scheduleHoverClose = () => {
    if (!isDesktopHover()) return;
    clearHoverTimer();

    hoverCloseTimer = window.setTimeout(() => {
      const overToggle = toggleBtn.matches(":hover");
      const overPanel = panel.matches(":hover");
      const overOverlay = overlay.matches(":hover");

      if (!overToggle && !overPanel && !overOverlay && panel.classList.contains("open")) {
        closeMenuFn();
      }
    }, 260);
  };

  toggleBtn.addEventListener("mouseenter", () => {
    if (!isDesktopHover()) return;
    clearHoverTimer();
    if (!panel.classList.contains("open")) openMenu();
  });

  toggleBtn.addEventListener("mouseleave", (e) => {
    if (!isDesktopHover()) return;
    if (leavingToMenuZone(e)) return;
    scheduleHoverClose();
  });

  panel.addEventListener("mouseenter", () => {
    if (!isDesktopHover()) return;
    clearHoverTimer();
  });

  panel.addEventListener("mouseleave", (e) => {
    if (!isDesktopHover()) return;
    if (leavingToToggleZone(e)) return;
    scheduleHoverClose();
  });

  overlay.addEventListener("mouseenter", () => {
    if (!isDesktopHover()) return;
    scheduleHoverClose();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenuFn();
    });
  }

  overlay.addEventListener("click", closeMenuFn);

  // Close the drawer only when a real navigation link is clicked.
  // IMPORTANT: Do NOT close when tapping submenu toggles (<summary> / .mobile-nav-summary).
  panel.querySelectorAll("a[href]").forEach((a) => {
    a.addEventListener("click", () => closeMenuFn());
  });

  // Prevent submenu summaries from closing the drawer on mobile.
  panel.querySelectorAll("summary.mobile-nav-summary").forEach((s) => {
    s.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("a")) return;
      e.stopPropagation();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closeMenuFn();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && panel.classList.contains("open")) closeMenuFn();
  });
}


function setupTheme() {
  // ✅ Single-theme site: always light (no toggle)
  document.documentElement.setAttribute('data-theme', 'light');

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', '#DCE2EF');
}

function setupHeaderScroll() {
  const header = $('[data-header]');
  if (!header) return;

  const onScroll = () => {
    const sc = window.scrollY > 14;
    header.classList.toggle('is-scrolled', sc);
    header.classList.toggle('scrolled', sc); // compat con clases previas
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupToTop() {
  const btn = $('[data-to-top]');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    $$('.card, .step, .quote, .callout, .faq__item, .media-card').forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      o.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '50px' });

  $$('.card, .step, .quote, .callout, .faq__item, .media-card').forEach(el => obs.observe(el));
}

function setupFooterYear() {
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
}

/* =========================
   Form validation (NO rompe tu submit)
========================= */
function setupFormValidation() {
  const form = $('.form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const required = $$('[required]', form);
    let ok = true;

    required.forEach((field) => {
      const value = (field.type === 'checkbox') ? field.checked : String(field.value || '').trim();
      if (!value) {
        ok = false;
        field.style.borderColor = '#ef4444';
      } else {
        field.style.borderColor = '';
      }
    });

    if (!ok) e.preventDefault();
  });
}



/* =========================
   Submenus: open on hover (desktop)
========================= */
function initHamburgerSubmenuHover() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer) return;

  const panel = document.getElementById("mobile-menu");
  if (!panel) return;

  const groups = panel.querySelectorAll("details");
  if (!groups.length) return;

  groups.forEach((details) => {
    let t;
    details.addEventListener("mouseenter", () => {
      clearTimeout(t);
      details.open = true;
    });
    details.addEventListener("mouseleave", () => {
      t = setTimeout(() => (details.open = false), 120);
    });
    details.addEventListener("focusin", () => {
      clearTimeout(t);
      details.open = true;
    });
    details.addEventListener("focusout", () => {
      t = setTimeout(() => (details.open = false), 150);
    });
  });
}

/* =========================
   Active link (data-page)
========================= */
function initActiveLink() {
  const links = $$(".nav-link, .mobile-nav-link, .mobile-nav__link");
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

  const keyFromLink = (a) => {
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
    if (a.classList.contains("mobile-nav__link")) a.classList.toggle("is-active", isCurrent);
    if (isCurrent) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

/* =========================
   Custom Cursor (reference)
========================= */
function initCursor() {
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");
  if (!cursorDot || !cursorRing) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!hasFinePointer || prefersReducedMotion) return;

  document.body.classList.add("has-cursor");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let ringX = mouseX, ringY = mouseY;

  let raf = null;

  const setPos = (el, x, y) => {
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
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

  const onMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const isInteractive = (tEl) =>
    !!tEl.closest("a, button, input, textarea, select, .btn, [role='button'], .card, .media-card, .mobile-nav-link, .mobile-sub-link, .language-btn, .menu-toggle");

  const isSoftInteractive = (tEl) =>
    !!tEl.closest(".logo-link, .nav-link, .language-btn, .theme-toggle, .btn-primary");

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
   INIT
========================= */
function init() {
  injectFlags();
  // idioma (REF)
  initLanguage();

  initMobileMenu();
  initHamburgerSubmenuHover();
  initActiveLink();
  initCursor();
  setupTheme();
  setupHeaderScroll();
  setupToTop();
  setupReveal();
  setupFooterYear();
  setupFormValidation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
