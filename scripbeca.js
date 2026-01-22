const body = document.body;
const navToggle = document.querySelector('.nav__toggle');
const navPanel = document.querySelector('.nav__panel');
const navClose = document.querySelector('.nav__close');
const navOverlay = document.querySelector('[data-nav-overlay]');
const header = document.querySelector('.site-header');
const dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const form = document.getElementById('contactForm');
const summaryPanel = document.getElementById('summaryPanel');
const sliderTrack = document.querySelector('.slider__track');
const sliderSlides = document.querySelectorAll('.slider__slide');
const dotsContainer = document.querySelector('.slider__dots');
const prevButton = document.querySelector('[data-slider-prev]');
const nextButton = document.querySelector('[data-slider-next]');
const langSwitcher = document.querySelector('.lang-switcher');
const langButton = document.querySelector('.lang-switcher__button');
const langLabel = document.querySelector('.lang-switcher__label');
const langMenu = document.getElementById('langMenu');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const i18n = {
  es: {
    'nav.open': 'Abrir menú',
    'nav.close': 'Cerrar menú',
    'nav.menu': 'Menú',
    'nav.services': 'Servicios',
    'nav.humanCapital': 'Human Capital',
    'nav.talent': 'Atracción de talento',
    'nav.payroll': 'Payrolling-Maquila de Nómina',
    'nav.do': 'Desarrollo Organizacional',
    'nav.training': 'Capacitación Empresarial',
    'nav.consulting': 'consultoría Organizacional',
    'nav.management': 'Management Services',
    'nav.accounting': 'Contabilidad y Fiscal',
    'nav.events': 'Eventos',
    'nav.contactCta': 'Solicitar información',
    'nav.theme': 'Tema',
    'nav.lang': 'Seleccionar idioma',
    'nav.themeToggle': 'Cambiar tema',
    'hero.title': 'Potenciamos tu talento y gestionamos tu crecimiento',
    'hero.lead': 'Servicios Integrales\nEnfoque personalizado que aborda todas las áreas clave de operación y desarrollo',
    'hero.ctaPrimary': 'Conócenos',
    'hero.ctaSecondary': 'Ver servicios',
    'hero.statProjects': 'Proyectos integrales',
    'hero.statSatisfaction': 'Satisfacción directiva',
    'hero.statCities': 'Ciudades con operación',
    'hero.chip': 'Diagnóstico inicial en 7 días',
    'hero.floatOne': 'Insights ejecutivos',
    'hero.floatTwo': 'Roadmap 360°',
    'services.eyebrow': 'Servicios integrales',
    'services.title': 'Líneas de servicio con impacto medible',
    'services.lead': 'Diseñamos soluciones end-to-end para escalar equipos y operaciones con evidencia, tecnología y acompañamiento continuo.',
    'services.cardOneTitle': 'Human Capital Analytics',
    'services.cardOneText': 'Mapeamos competencias críticas y predictores de desempeño para decisiones rápidas y confiables.',
    'services.cardOneItemOne': 'People analytics',
    'services.cardOneItemTwo': 'Assessment centers',
    'services.cardOneItemThree': 'Plan de sucesión',
    'services.cardOneCta': 'Te explicamos el proceso',
    'services.cardTwoTitle': 'Desarrollo Organizacional',
    'services.cardTwoText': 'Transformamos cultura y liderazgo con programas escalables, blended y centrados en resultados.',
    'services.cardTwoItemOne': 'Gestión del cambio',
    'services.cardTwoItemTwo': 'Academias internas',
    'services.cardTwoItemThree': 'Clima y engagement',
    'services.cardTwoCta': 'Diagnóstico inicial',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': 'Optimización operativa y gobernanza para asegurar crecimiento rentable y sostenible.',
    'services.cardThreeItemOne': 'PMO estratégica',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': 'Modelos de servicio',
    'services.cardThreeCta': 'Ver frameworks',
    'services.cardFourTitle': 'Learning Experiences',
    'services.cardFourText': 'Formación ejecutiva con formatos híbridos, métricas de avance y acompañamiento continuo.',
    'services.cardFourItemOne': 'Leadership labs',
    'services.cardFourItemTwo': 'Bootcamps internos',
    'services.cardFourItemThree': 'Coaching aplicado',
    'services.cardFourCta': 'Explorar rutas',
    'sme.title': 'Servicios para PYMES',
    'sme.text': 'Paquetes modulares para empresas en crecimiento que requieren estructura, procesos y talento alineado sin complejidad.',
    'sme.pillOne': 'Diagnóstico express',
    'sme.pillTwo': 'HR agile',
    'sme.pillThree': 'Gestión de desempeño',
    'sme.pillFour': 'Academia líder',
    'sme.ctaTitle': 'Listos para despegar con una consultoría escalable.',
    'sme.ctaButton': 'Ver paquetes',
    'events.eyebrow': 'Eventos',
    'events.title': 'Agenda ejecutiva y experiencias inmersivas',
    'events.lead': 'Conferencias y workshops que conectan estrategia, talento y tecnología con resultados concretos.',
    'events.prev': 'Anterior',
    'events.next': 'Siguiente',
    'events.dots': 'Navegación de eventos',
    'events.dotLabel': 'Ir al evento {index}',
    'offices.eyebrow': 'Oficinas',
    'offices.title': 'Presencia regional con atención local',
    'offices.lead': 'Equipo consultor en las principales ciudades para acompañar de forma ágil cada etapa del proyecto.',
    'contact.eyebrow': '¿Interesado en nuestros servicios?',
    'contact.title': 'Solicita un brief ejecutivo',
    'contact.lead': 'Completa el formulario y recibe un plan preliminar en menos de 48 horas.',
    'form.name': 'Nombre',
    'form.company': 'Empresa',
    'form.email': 'Email',
    'form.phone': 'Teléfono',
    'form.serviceLine': 'Línea de servicio',
    'form.selectOption': 'Selecciona una opción',
    'form.optionHuman': 'Human Capital',
    'form.optionDo': 'Desarrollo Organizacional',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Learning Experiences',
    'form.message': 'Mensaje / requerimientos',
    'form.privacy': 'Acepto aviso de privacidad',
    'form.submit': 'Solicitar información',
    'form.note': 'Te contactamos en menos de 24 horas hábiles.',
    'summary.title': 'Resumen de tu solicitud',
    'summary.text': 'Completa el formulario para visualizar el brief generado automáticamente.',
    'footer.about': 'Consultoría corporativa integral para organizaciones que buscan velocidad, foco y talento alineado.',
    'footer.contact': 'Contacto',
    'footer.hours': 'Atención: Lun - Vie 9:00 a 18:00',
    'footer.social': 'Redes',
    'footer.copy': '© <span id="year"></span> Bechapra. Todos los derechos reservados.',
    'error.required': 'Este campo es obligatorio.',
    'error.email': 'Ingresa un correo válido.',
    'error.privacy': 'Debes aceptar el aviso de privacidad.',
    'summary.status': 'Estado:',
    'summary.sent': 'Enviado ✅',
    'summary.name': 'Nombre:',
    'summary.company': 'Empresa:',
    'summary.email': 'Email:',
    'summary.phone': 'Teléfono:',
    'summary.line': 'Línea:',
    'summary.message': 'Mensaje:',
    'summary.next': 'Próximo paso:',
    'summary.nextText': 'Te compartimos un diagnóstico inicial.',
  },
  en: {
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'nav.menu': 'Menu',
    'nav.services': 'Services',
    'nav.humanCapital': 'Human Capital',
    'nav.talent': 'Talent acquisition',
    'nav.payroll': 'Payroll processing',
    'nav.do': 'Organizational Development',
    'nav.training': 'Business training',
    'nav.consulting': 'Organizational consulting',
    'nav.management': 'Management Services',
    'nav.accounting': 'Accounting and Tax',
    'nav.events': 'Events',
    'nav.contactCta': 'Request information',
    'nav.theme': 'Theme',
    'nav.lang': 'Select language',
    'nav.themeToggle': 'Toggle theme',
    'hero.title': 'We amplify your talent and manage your growth',
    'hero.lead': 'Integral services\nPersonalized approach that covers every key operational and development area',
    'hero.ctaPrimary': 'Meet us',
    'hero.ctaSecondary': 'View services',
    'hero.statProjects': 'Integral projects',
    'hero.statSatisfaction': 'Leadership satisfaction',
    'hero.statCities': 'Operating cities',
    'hero.chip': 'Initial diagnosis in 7 days',
    'hero.floatOne': 'Executive insights',
    'hero.floatTwo': '360° roadmap',
    'services.eyebrow': 'Integral services',
    'services.title': 'Service lines with measurable impact',
    'services.lead': 'We design end-to-end solutions to scale teams and operations with evidence, technology, and continuous support.',
    'services.cardOneTitle': 'Human Capital Analytics',
    'services.cardOneText': 'We map critical competencies and performance predictors for fast, reliable decisions.',
    'services.cardOneItemOne': 'People analytics',
    'services.cardOneItemTwo': 'Assessment centers',
    'services.cardOneItemThree': 'Succession planning',
    'services.cardOneCta': 'We explain the process',
    'services.cardTwoTitle': 'Organizational Development',
    'services.cardTwoText': 'We transform culture and leadership with scalable, blended, results-driven programs.',
    'services.cardTwoItemOne': 'Change management',
    'services.cardTwoItemTwo': 'Internal academies',
    'services.cardTwoItemThree': 'Climate and engagement',
    'services.cardTwoCta': 'Initial diagnosis',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': 'Operational optimization and governance to ensure profitable, sustainable growth.',
    'services.cardThreeItemOne': 'Strategic PMO',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': 'Service models',
    'services.cardThreeCta': 'View frameworks',
    'services.cardFourTitle': 'Learning Experiences',
    'services.cardFourText': 'Executive training with hybrid formats, progress metrics, and continuous support.',
    'services.cardFourItemOne': 'Leadership labs',
    'services.cardFourItemTwo': 'Internal bootcamps',
    'services.cardFourItemThree': 'Applied coaching',
    'services.cardFourCta': 'Explore paths',
    'sme.title': 'Services for SMEs',
    'sme.text': 'Modular packages for growing companies that need structure, processes, and aligned talent without complexity.',
    'sme.pillOne': 'Express diagnosis',
    'sme.pillTwo': 'HR agile',
    'sme.pillThree': 'Performance management',
    'sme.pillFour': 'Leadership academy',
    'sme.ctaTitle': 'Ready to take off with scalable consulting.',
    'sme.ctaButton': 'View packages',
    'events.eyebrow': 'Events',
    'events.title': 'Executive agenda and immersive experiences',
    'events.lead': 'Conferences and workshops that connect strategy, talent, and technology with concrete results.',
    'events.prev': 'Previous',
    'events.next': 'Next',
    'events.dots': 'Event navigation',
    'events.dotLabel': 'Go to event {index}',
    'offices.eyebrow': 'Offices',
    'offices.title': 'Regional presence with local support',
    'offices.lead': 'Consulting teams in major cities to support every project stage with agility.',
    'contact.eyebrow': 'Interested in our services?',
    'contact.title': 'Request an executive brief',
    'contact.lead': 'Complete the form and receive a preliminary plan in under 48 hours.',
    'form.name': 'Name',
    'form.company': 'Company',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.serviceLine': 'Service line',
    'form.selectOption': 'Select an option',
    'form.optionHuman': 'Human Capital',
    'form.optionDo': 'Organizational Development',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Learning Experiences',
    'form.message': 'Message / requirements',
    'form.privacy': 'I accept the privacy notice',
    'form.submit': 'Request information',
    'form.note': 'We will contact you within 24 business hours.',
    'summary.title': 'Summary of your request',
    'summary.text': 'Complete the form to view the brief generated automatically.',
    'footer.about': 'Comprehensive corporate consulting for organizations seeking speed, focus, and aligned talent.',
    'footer.contact': 'Contact',
    'footer.hours': 'Service: Mon - Fri 9:00 to 18:00',
    'footer.social': 'Social',
    'footer.copy': '© <span id="year"></span> Bechapra. All rights reserved.',
    'error.required': 'This field is required.',
    'error.email': 'Enter a valid email.',
    'error.privacy': 'You must accept the privacy notice.',
    'summary.status': 'Status:',
    'summary.sent': 'Sent ✅',
    'summary.name': 'Name:',
    'summary.company': 'Company:',
    'summary.email': 'Email:',
    'summary.phone': 'Phone:',
    'summary.line': 'Line:',
    'summary.message': 'Message:',
    'summary.next': 'Next step:',
    'summary.nextText': 'We will share an initial diagnosis.',
  },
  fr: {
    'nav.open': 'Ouvrir le menu',
    'nav.close': 'Fermer le menu',
    'nav.menu': 'Menu',
    'nav.services': 'Services',
    'nav.humanCapital': 'Capital humain',
    'nav.talent': 'Attraction de talents',
    'nav.payroll': 'Gestion de la paie',
    'nav.do': 'Développement organisationnel',
    'nav.training': 'Formation professionnelle',
    'nav.consulting': 'Conseil organisationnel',
    'nav.management': 'Management Services',
    'nav.accounting': 'Comptabilité et fiscalité',
    'nav.events': 'Événements',
    'nav.contactCta': 'Demander des informations',
    'nav.theme': 'Thème',
    'nav.lang': 'Choisir la langue',
    'nav.themeToggle': 'Changer de thème',
    'hero.title': 'Nous renforçons vos talents et gérons votre croissance',
    'hero.lead': 'Services intégrés\nApproche personnalisée couvrant toutes les zones clés d’exploitation et de développement',
    'hero.ctaPrimary': 'Nous connaître',
    'hero.ctaSecondary': 'Voir les services',
    'hero.statProjects': 'Projets intégrés',
    'hero.statSatisfaction': 'Satisfaction de direction',
    'hero.statCities': 'Villes d’opération',
    'hero.chip': 'Diagnostic initial en 7 jours',
    'hero.floatOne': 'Insights exécutifs',
    'hero.floatTwo': 'Roadmap 360°',
    'services.eyebrow': 'Services intégrés',
    'services.title': 'Lignes de service à impact mesurable',
    'services.lead': 'Nous concevons des solutions de bout en bout pour scaler les équipes et les opérations avec des preuves, de la technologie et un accompagnement continu.',
    'services.cardOneTitle': 'Analytique du capital humain',
    'services.cardOneText': 'Nous cartographions les compétences critiques et les prédicteurs de performance pour des décisions rapides et fiables.',
    'services.cardOneItemOne': 'People analytics',
    'services.cardOneItemTwo': 'Assessment centers',
    'services.cardOneItemThree': 'Plan de succession',
    'services.cardOneCta': 'Nous expliquons le processus',
    'services.cardTwoTitle': 'Développement organisationnel',
    'services.cardTwoText': 'Nous transformons la culture et le leadership avec des programmes évolutifs, blended et orientés résultats.',
    'services.cardTwoItemOne': 'Gestion du changement',
    'services.cardTwoItemTwo': 'Académies internes',
    'services.cardTwoItemThree': 'Climat et engagement',
    'services.cardTwoCta': 'Diagnostic initial',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': 'Optimisation opérationnelle et gouvernance pour assurer une croissance rentable et durable.',
    'services.cardThreeItemOne': 'PMO stratégique',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': 'Modèles de service',
    'services.cardThreeCta': 'Voir les frameworks',
    'services.cardFourTitle': 'Expériences d’apprentissage',
    'services.cardFourText': 'Formation exécutive avec formats hybrides, métriques de progression et accompagnement continu.',
    'services.cardFourItemOne': 'Leadership labs',
    'services.cardFourItemTwo': 'Bootcamps internes',
    'services.cardFourItemThree': 'Coaching appliqué',
    'services.cardFourCta': 'Explorer les parcours',
    'sme.title': 'Services pour PME',
    'sme.text': 'Forfaits modulaires pour les entreprises en croissance qui ont besoin de structure, de processus et de talents alignés sans complexité.',
    'sme.pillOne': 'Diagnostic express',
    'sme.pillTwo': 'HR agile',
    'sme.pillThree': 'Gestion de la performance',
    'sme.pillFour': 'Académie leader',
    'sme.ctaTitle': 'Prêts à décoller avec un conseil évolutif.',
    'sme.ctaButton': 'Voir les forfaits',
    'events.eyebrow': 'Événements',
    'events.title': 'Agenda exécutif et expériences immersives',
    'events.lead': 'Conférences et workshops qui connectent stratégie, talents et technologie avec des résultats concrets.',
    'events.prev': 'Précédent',
    'events.next': 'Suivant',
    'events.dots': 'Navigation des événements',
    'events.dotLabel': 'Aller à l’événement {index}',
    'offices.eyebrow': 'Bureaux',
    'offices.title': 'Présence régionale avec attention locale',
    'offices.lead': 'Équipe de conseil dans les principales villes pour accompagner chaque étape du projet avec agilité.',
    'contact.eyebrow': 'Intéressé par nos services ?',
    'contact.title': 'Demandez un brief exécutif',
    'contact.lead': 'Remplissez le formulaire et recevez un plan préliminaire en moins de 48 heures.',
    'form.name': 'Nom',
    'form.company': 'Entreprise',
    'form.email': 'Email',
    'form.phone': 'Téléphone',
    'form.serviceLine': 'Ligne de service',
    'form.selectOption': 'Sélectionnez une option',
    'form.optionHuman': 'Capital humain',
    'form.optionDo': 'Développement organisationnel',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Expériences d’apprentissage',
    'form.message': 'Message / besoins',
    'form.privacy': 'J’accepte l’avis de confidentialité',
    'form.submit': 'Demander des informations',
    'form.note': 'Nous vous contactons dans les 24 heures ouvrées.',
    'summary.title': 'Résumé de votre demande',
    'summary.text': 'Remplissez le formulaire pour voir le brief généré automatiquement.',
    'footer.about': 'Conseil corporate intégral pour les organisations qui recherchent vitesse, focus et talents alignés.',
    'footer.contact': 'Contact',
    'footer.hours': 'Service : Lun - Ven 9:00 à 18:00',
    'footer.social': 'Réseaux',
    'footer.copy': '© <span id="year"></span> Bechapra. Tous droits réservés.',
    'error.required': 'Ce champ est obligatoire.',
    'error.email': 'Saisissez un email valide.',
    'error.privacy': 'Vous devez accepter l’avis de confidentialité.',
    'summary.status': 'Statut :',
    'summary.sent': 'Envoyé ✅',
    'summary.name': 'Nom :',
    'summary.company': 'Entreprise :',
    'summary.email': 'Email :',
    'summary.phone': 'Téléphone :',
    'summary.line': 'Ligne :',
    'summary.message': 'Message :',
    'summary.next': 'Prochaine étape :',
    'summary.nextText': 'Nous partageons un diagnostic initial.',
  },
  de: {
    'nav.open': 'Menü öffnen',
    'nav.close': 'Menü schließen',
    'nav.menu': 'Menü',
    'nav.services': 'Services',
    'nav.humanCapital': 'Human Capital',
    'nav.talent': 'Talentgewinnung',
    'nav.payroll': 'Payroll-Services',
    'nav.do': 'Organisationsentwicklung',
    'nav.training': 'Unternehmensschulungen',
    'nav.consulting': 'Organisationsberatung',
    'nav.management': 'Management Services',
    'nav.accounting': 'Buchhaltung und Steuern',
    'nav.events': 'Events',
    'nav.contactCta': 'Informationen anfordern',
    'nav.theme': 'Thema',
    'nav.lang': 'Sprache auswählen',
    'nav.themeToggle': 'Theme wechseln',
    'hero.title': 'Wir fördern Ihr Talent und steuern Ihr Wachstum',
    'hero.lead': 'Integrale Services\nPersonalisierter Ansatz, der alle wichtigen Betriebs- und Entwicklungsbereiche abdeckt',
    'hero.ctaPrimary': 'Lernen Sie uns kennen',
    'hero.ctaSecondary': 'Services ansehen',
    'hero.statProjects': 'Integrale Projekte',
    'hero.statSatisfaction': 'Management-Zufriedenheit',
    'hero.statCities': 'Betriebsstandorte',
    'hero.chip': 'Erstdiagnose in 7 Tagen',
    'hero.floatOne': 'Executive Insights',
    'hero.floatTwo': '360°-Roadmap',
    'services.eyebrow': 'Integrale Services',
    'services.title': 'Service-Linien mit messbarem Impact',
    'services.lead': 'Wir gestalten End-to-End-Lösungen, um Teams und Prozesse mit Evidenz, Technologie und kontinuierlicher Begleitung zu skalieren.',
    'services.cardOneTitle': 'Human Capital Analytics',
    'services.cardOneText': 'Wir kartieren kritische Kompetenzen und Leistungsprädiktoren für schnelle, verlässliche Entscheidungen.',
    'services.cardOneItemOne': 'People Analytics',
    'services.cardOneItemTwo': 'Assessment Center',
    'services.cardOneItemThree': 'Nachfolgeplanung',
    'services.cardOneCta': 'Wir erklären den Prozess',
    'services.cardTwoTitle': 'Organisationsentwicklung',
    'services.cardTwoText': 'Wir transformieren Kultur und Führung mit skalierbaren, blended, ergebnisorientierten Programmen.',
    'services.cardTwoItemOne': 'Change Management',
    'services.cardTwoItemTwo': 'Interne Akademien',
    'services.cardTwoItemThree': 'Klima und Engagement',
    'services.cardTwoCta': 'Erstdiagnose',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': 'Operative Optimierung und Governance für profitables, nachhaltiges Wachstum.',
    'services.cardThreeItemOne': 'Strategische PMO',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': 'Service-Modelle',
    'services.cardThreeCta': 'Frameworks ansehen',
    'services.cardFourTitle': 'Learning Experiences',
    'services.cardFourText': 'Executive-Training mit Hybridformaten, Fortschrittsmetriken und kontinuierlicher Begleitung.',
    'services.cardFourItemOne': 'Leadership Labs',
    'services.cardFourItemTwo': 'Interne Bootcamps',
    'services.cardFourItemThree': 'Angewandtes Coaching',
    'services.cardFourCta': 'Routen entdecken',
    'sme.title': 'Services für KMU',
    'sme.text': 'Modulare Pakete für wachsende Unternehmen, die Struktur, Prozesse und abgestimmtes Talent ohne Komplexität benötigen.',
    'sme.pillOne': 'Express-Diagnose',
    'sme.pillTwo': 'HR Agile',
    'sme.pillThree': 'Performance Management',
    'sme.pillFour': 'Leadership Academy',
    'sme.ctaTitle': 'Bereit für skalierbare Beratung.',
    'sme.ctaButton': 'Pakete ansehen',
    'events.eyebrow': 'Events',
    'events.title': 'Executive-Agenda und immersive Experiences',
    'events.lead': 'Konferenzen und Workshops, die Strategie, Talent und Technologie mit konkreten Ergebnissen verbinden.',
    'events.prev': 'Zurück',
    'events.next': 'Weiter',
    'events.dots': 'Event-Navigation',
    'events.dotLabel': 'Zum Event {index}',
    'offices.eyebrow': 'Standorte',
    'offices.title': 'Regionale Präsenz mit lokaler Betreuung',
    'offices.lead': 'Beratungsteams in den wichtigsten Städten begleiten jede Projektphase agil.',
    'contact.eyebrow': 'Interessiert an unseren Services?',
    'contact.title': 'Executive Brief anfordern',
    'contact.lead': 'Füllen Sie das Formular aus und erhalten Sie in weniger als 48 Stunden einen ersten Plan.',
    'form.name': 'Name',
    'form.company': 'Unternehmen',
    'form.email': 'E-Mail',
    'form.phone': 'Telefon',
    'form.serviceLine': 'Service-Line',
    'form.selectOption': 'Option auswählen',
    'form.optionHuman': 'Human Capital',
    'form.optionDo': 'Organisationsentwicklung',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Learning Experiences',
    'form.message': 'Nachricht / Anforderungen',
    'form.privacy': 'Ich akzeptiere die Datenschutzhinweise',
    'form.submit': 'Informationen anfordern',
    'form.note': 'Wir melden uns innerhalb von 24 Geschäfts­stunden.',
    'summary.title': 'Zusammenfassung Ihrer Anfrage',
    'summary.text': 'Füllen Sie das Formular aus, um das automatisch erstellte Briefing zu sehen.',
    'footer.about': 'Ganzheitliche Corporate-Beratung für Organisationen, die Geschwindigkeit, Fokus und ausgerichtetes Talent suchen.',
    'footer.contact': 'Kontakt',
    'footer.hours': 'Service: Mo - Fr 9:00 bis 18:00',
    'footer.social': 'Netzwerke',
    'footer.copy': '© <span id="year"></span> Bechapra. Alle Rechte vorbehalten.',
    'error.required': 'Dieses Feld ist erforderlich.',
    'error.email': 'Geben Sie eine gültige E-Mail ein.',
    'error.privacy': 'Sie müssen die Datenschutzhinweise akzeptieren.',
    'summary.status': 'Status:',
    'summary.sent': 'Gesendet ✅',
    'summary.name': 'Name:',
    'summary.company': 'Unternehmen:',
    'summary.email': 'E-Mail:',
    'summary.phone': 'Telefon:',
    'summary.line': 'Linie:',
    'summary.message': 'Nachricht:',
    'summary.next': 'Nächster Schritt:',
    'summary.nextText': 'Wir teilen eine erste Diagnose.',
  },
  it: {
    'nav.open': 'Apri menu',
    'nav.close': 'Chiudi menu',
    'nav.menu': 'Menù',
    'nav.services': 'Servizi',
    'nav.humanCapital': 'Human Capital',
    'nav.talent': 'Attrazione di talenti',
    'nav.payroll': 'Payroll',
    'nav.do': 'Sviluppo organizzativo',
    'nav.training': 'Formazione aziendale',
    'nav.consulting': 'Consulenza organizzativa',
    'nav.management': 'Management Services',
    'nav.accounting': 'Contabilità e fiscale',
    'nav.events': 'Eventi',
    'nav.contactCta': 'Richiedi informazioni',
    'nav.theme': 'Tema',
    'nav.lang': 'Seleziona lingua',
    'nav.themeToggle': 'Cambia tema',
    'hero.title': 'Potenziano il tuo talento e gestiamo la tua crescita',
    'hero.lead': 'Servizi integrati\nApproccio personalizzato che copre tutte le aree chiave operative e di sviluppo',
    'hero.ctaPrimary': 'Conosciamoci',
    'hero.ctaSecondary': 'Vedi servizi',
    'hero.statProjects': 'Progetti integrati',
    'hero.statSatisfaction': 'Soddisfazione della leadership',
    'hero.statCities': 'Città operative',
    'hero.chip': 'Diagnosi iniziale in 7 giorni',
    'hero.floatOne': 'Insight esecutivi',
    'hero.floatTwo': 'Roadmap 360°',
    'services.eyebrow': 'Servizi integrati',
    'services.title': 'Linee di servizio con impatto misurabile',
    'services.lead': 'Progettiamo soluzioni end-to-end per scalare team e operazioni con evidenza, tecnologia e accompagnamento continuo.',
    'services.cardOneTitle': 'Human Capital Analytics',
    'services.cardOneText': 'Mappiamo competenze critiche e predittori di performance per decisioni rapide e affidabili.',
    'services.cardOneItemOne': 'People analytics',
    'services.cardOneItemTwo': 'Assessment center',
    'services.cardOneItemThree': 'Piano di successione',
    'services.cardOneCta': 'Ti spieghiamo il processo',
    'services.cardTwoTitle': 'Sviluppo organizzativo',
    'services.cardTwoText': 'Trasformiamo cultura e leadership con programmi scalabili, blended e orientati ai risultati.',
    'services.cardTwoItemOne': 'Gestione del cambiamento',
    'services.cardTwoItemTwo': 'Accademie interne',
    'services.cardTwoItemThree': 'Clima e engagement',
    'services.cardTwoCta': 'Diagnosi iniziale',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': 'Ottimizzazione operativa e governance per garantire crescita redditizia e sostenibile.',
    'services.cardThreeItemOne': 'PMO strategica',
    'services.cardThreeItemTwo': 'OKR & KPI',
    'services.cardThreeItemThree': 'Modelli di servizio',
    'services.cardThreeCta': 'Vedi framework',
    'services.cardFourTitle': 'Learning Experiences',
    'services.cardFourText': 'Formazione executive con formati ibridi, metriche di avanzamento e accompagnamento continuo.',
    'services.cardFourItemOne': 'Leadership labs',
    'services.cardFourItemTwo': 'Bootcamp interni',
    'services.cardFourItemThree': 'Coaching applicato',
    'services.cardFourCta': 'Esplora percorsi',
    'sme.title': 'Servizi per PMI',
    'sme.text': 'Pacchetti modulari per aziende in crescita che richiedono struttura, processi e talenti allineati senza complessità.',
    'sme.pillOne': 'Diagnosi express',
    'sme.pillTwo': 'HR agile',
    'sme.pillThree': 'Gestione performance',
    'sme.pillFour': 'Accademia leader',
    'sme.ctaTitle': 'Pronti a decollare con una consulenza scalabile.',
    'sme.ctaButton': 'Vedi pacchetti',
    'events.eyebrow': 'Eventi',
    'events.title': 'Agenda executive ed esperienze immersive',
    'events.lead': 'Conferenze e workshop che collegano strategia, talenti e tecnologia con risultati concreti.',
    'events.prev': 'Precedente',
    'events.next': 'Successivo',
    'events.dots': 'Navigazione eventi',
    'events.dotLabel': 'Vai all’evento {index}',
    'offices.eyebrow': 'Sedi',
    'offices.title': 'Presenza regionale con supporto locale',
    'offices.lead': 'Team consulenti nelle principali città per accompagnare agilmente ogni fase del progetto.',
    'contact.eyebrow': 'Interessato ai nostri servizi?',
    'contact.title': 'Richiedi un brief esecutivo',
    'contact.lead': 'Compila il modulo e ricevi un piano preliminare in meno di 48 ore.',
    'form.name': 'Nome',
    'form.company': 'Azienda',
    'form.email': 'Email',
    'form.phone': 'Telefono',
    'form.serviceLine': 'Linea di servizio',
    'form.selectOption': 'Seleziona un’opzione',
    'form.optionHuman': 'Human Capital',
    'form.optionDo': 'Sviluppo organizzativo',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Learning Experiences',
    'form.message': 'Messaggio / requisiti',
    'form.privacy': 'Accetto l’informativa sulla privacy',
    'form.submit': 'Richiedi informazioni',
    'form.note': 'Ti contattiamo entro 24 ore lavorative.',
    'summary.title': 'Riepilogo della tua richiesta',
    'summary.text': 'Compila il modulo per visualizzare il brief generato automaticamente.',
    'footer.about': 'Consulenza corporate integrale per organizzazioni che cercano velocità, focus e talenti allineati.',
    'footer.contact': 'Contatto',
    'footer.hours': 'Orario: Lun - Ven 9:00 a 18:00',
    'footer.social': 'Social',
    'footer.copy': '© <span id="year"></span> Bechapra. Tutti i diritti riservati.',
    'error.required': 'Questo campo è obbligatorio.',
    'error.email': 'Inserisci un’email valida.',
    'error.privacy': 'Devi accettare l’informativa sulla privacy.',
    'summary.status': 'Stato:',
    'summary.sent': 'Inviato ✅',
    'summary.name': 'Nome:',
    'summary.company': 'Azienda:',
    'summary.email': 'Email:',
    'summary.phone': 'Telefono:',
    'summary.line': 'Linea:',
    'summary.message': 'Messaggio:',
    'summary.next': 'Prossimo passo:',
    'summary.nextText': 'Condivideremo una diagnosi iniziale.',
  },
  pt: {
    'nav.open': 'Abrir menu',
    'nav.close': 'Fechar menu',
    'nav.menu': 'Menu',
    'nav.services': 'Serviços',
    'nav.humanCapital': 'Human Capital',
    'nav.talent': 'Atração de talentos',
    'nav.payroll': 'Folha de pagamento',
    'nav.do': 'Desenvolvimento Organizacional',
    'nav.training': 'Capacitação empresarial',
    'nav.consulting': 'Consultoria organizacional',
    'nav.management': 'Management Services',
    'nav.accounting': 'Contabilidade e fiscal',
    'nav.events': 'Eventos',
    'nav.contactCta': 'Solicitar informações',
    'nav.theme': 'Tema',
    'nav.lang': 'Selecionar idioma',
    'nav.themeToggle': 'Alternar tema',
    'hero.title': 'Potencializamos seu talento e gerenciamos seu crescimento',
    'hero.lead': 'Serviços integrais\nAbordagem personalizada que cobre todas as áreas-chave de operação e desenvolvimento',
    'hero.ctaPrimary': 'Conheça-nos',
    'hero.ctaSecondary': 'Ver serviços',
    'hero.statProjects': 'Projetos integrais',
    'hero.statSatisfaction': 'Satisfação executiva',
    'hero.statCities': 'Cidades com operação',
    'hero.chip': 'Diagnóstico inicial em 7 dias',
    'hero.floatOne': 'Insights executivos',
    'hero.floatTwo': 'Roadmap 360°',
    'services.eyebrow': 'Serviços integrais',
    'services.title': 'Linhas de serviço com impacto mensurável',
    'services.lead': 'Desenhamos soluções end-to-end para escalar equipes e operações com evidências, tecnologia e acompanhamento contínuo.',
    'services.cardOneTitle': 'Human Capital Analytics',
    'services.cardOneText': 'Mapeamos competências críticas e preditores de desempenho para decisões rápidas e confiáveis.',
    'services.cardOneItemOne': 'People analytics',
    'services.cardOneItemTwo': 'Assessment centers',
    'services.cardOneItemThree': 'Plano de sucessão',
    'services.cardOneCta': 'Explicamos o processo',
    'services.cardTwoTitle': 'Desenvolvimento Organizacional',
    'services.cardTwoText': 'Transformamos cultura e liderança com programas escaláveis, blended e orientados a resultados.',
    'services.cardTwoItemOne': 'Gestão da mudança',
    'services.cardTwoItemTwo': 'Academias internas',
    'services.cardTwoItemThree': 'Clima e engajamento',
    'services.cardTwoCta': 'Diagnóstico inicial',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': 'Otimização operacional e governança para garantir crescimento rentável e sustentável.',
    'services.cardThreeItemOne': 'PMO estratégica',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': 'Modelos de serviço',
    'services.cardThreeCta': 'Ver frameworks',
    'services.cardFourTitle': 'Learning Experiences',
    'services.cardFourText': 'Formação executiva com formatos híbridos, métricas de avanço e acompanhamento contínuo.',
    'services.cardFourItemOne': 'Leadership labs',
    'services.cardFourItemTwo': 'Bootcamps internos',
    'services.cardFourItemThree': 'Coaching aplicado',
    'services.cardFourCta': 'Explorar rotas',
    'sme.title': 'Serviços para PMEs',
    'sme.text': 'Pacotes modulares para empresas em crescimento que precisam de estrutura, processos e talentos alinhados sem complexidade.',
    'sme.pillOne': 'Diagnóstico express',
    'sme.pillTwo': 'HR agile',
    'sme.pillThree': 'Gestão de desempenho',
    'sme.pillFour': 'Academia líder',
    'sme.ctaTitle': 'Prontos para decolar com consultoria escalável.',
    'sme.ctaButton': 'Ver pacotes',
    'events.eyebrow': 'Eventos',
    'events.title': 'Agenda executiva e experiências imersivas',
    'events.lead': 'Conferências e workshops que conectam estratégia, talentos e tecnologia com resultados concretos.',
    'events.prev': 'Anterior',
    'events.next': 'Próximo',
    'events.dots': 'Navegação de eventos',
    'events.dotLabel': 'Ir para o evento {index}',
    'offices.eyebrow': 'Escritórios',
    'offices.title': 'Presença regional com atendimento local',
    'offices.lead': 'Equipe consultora nas principais cidades para acompanhar cada etapa do projeto com agilidade.',
    'contact.eyebrow': 'Interessado em nossos serviços?',
    'contact.title': 'Solicite um brief executivo',
    'contact.lead': 'Preencha o formulário e receba um plano preliminar em menos de 48 horas.',
    'form.name': 'Nome',
    'form.company': 'Empresa',
    'form.email': 'Email',
    'form.phone': 'Telefone',
    'form.serviceLine': 'Linha de serviço',
    'form.selectOption': 'Selecione uma opção',
    'form.optionHuman': 'Human Capital',
    'form.optionDo': 'Desenvolvimento Organizacional',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Learning Experiences',
    'form.message': 'Mensagem / necessidades',
    'form.privacy': 'Aceito o aviso de privacidade',
    'form.submit': 'Solicitar informações',
    'form.note': 'Entramos em contato em até 24 horas úteis.',
    'summary.title': 'Resumo da sua solicitação',
    'summary.text': 'Preencha o formulário para visualizar o brief gerado automaticamente.',
    'footer.about': 'Consultoria corporativa integral para organizações que buscam velocidade, foco e talentos alinhados.',
    'footer.contact': 'Contato',
    'footer.hours': 'Atendimento: Seg - Sex 9:00 às 18:00',
    'footer.social': 'Redes',
    'footer.copy': '© <span id="year"></span> Bechapra. Todos os direitos reservados.',
    'error.required': 'Este campo é obrigatório.',
    'error.email': 'Insira um email válido.',
    'error.privacy': 'Você deve aceitar o aviso de privacidade.',
    'summary.status': 'Status:',
    'summary.sent': 'Enviado ✅',
    'summary.name': 'Nome:',
    'summary.company': 'Empresa:',
    'summary.email': 'Email:',
    'summary.phone': 'Telefone:',
    'summary.line': 'Linha:',
    'summary.message': 'Mensagem:',
    'summary.next': 'Próximo passo:',
    'summary.nextText': 'Vamos compartilhar um diagnóstico inicial.',
  },
  zh: {
    'nav.open': '打开菜单',
    'nav.close': '关闭菜单',
    'nav.menu': '菜单',
    'nav.services': '服务',
    'nav.humanCapital': '人力资本',
    'nav.talent': '人才吸引',
    'nav.payroll': '薪资外包',
    'nav.do': '组织发展',
    'nav.training': '企业培训',
    'nav.consulting': '组织咨询',
    'nav.management': '管理服务',
    'nav.accounting': '会计与税务',
    'nav.events': '活动',
    'nav.contactCta': '索取信息',
    'nav.theme': '主题',
    'nav.lang': '选择语言',
    'nav.themeToggle': '切换主题',
    'hero.title': '提升人才并管理增长',
    'hero.lead': '一体化服务\n个性化方式覆盖运营与发展的关键领域',
    'hero.ctaPrimary': '了解我们',
    'hero.ctaSecondary': '查看服务',
    'hero.statProjects': '综合项目',
    'hero.statSatisfaction': '管理层满意度',
    'hero.statCities': '覆盖城市',
    'hero.chip': '7天初步诊断',
    'hero.floatOne': '高管洞察',
    'hero.floatTwo': '360°路线图',
    'services.eyebrow': '一体化服务',
    'services.title': '可衡量影响的服务线',
    'services.lead': '我们打造端到端解决方案，以证据、技术与持续陪伴扩展团队与运营。',
    'services.cardOneTitle': '人力资本分析',
    'services.cardOneText': '我们映射关键能力与绩效预测指标，确保快速可靠的决策。',
    'services.cardOneItemOne': '人员分析',
    'services.cardOneItemTwo': '评估中心',
    'services.cardOneItemThree': '继任计划',
    'services.cardOneCta': '了解流程',
    'services.cardTwoTitle': '组织发展',
    'services.cardTwoText': '通过可扩展、混合式且结果导向的项目转型文化与领导力。',
    'services.cardTwoItemOne': '变革管理',
    'services.cardTwoItemTwo': '内部学院',
    'services.cardTwoItemThree': '氛围与参与度',
    'services.cardTwoCta': '初步诊断',
    'services.cardThreeTitle': '管理服务',
    'services.cardThreeText': '优化运营与治理，确保盈利且可持续的增长。',
    'services.cardThreeItemOne': '战略PMO',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': '服务模型',
    'services.cardThreeCta': '查看框架',
    'services.cardFourTitle': '学习体验',
    'services.cardFourText': '混合式高管培训，配合进度指标与持续陪伴。',
    'services.cardFourItemOne': '领导力实验室',
    'services.cardFourItemTwo': '内部训练营',
    'services.cardFourItemThree': '应用型教练',
    'services.cardFourCta': '探索路径',
    'sme.title': '中小企业服务',
    'sme.text': '为成长型企业提供模块化方案，兼顾结构、流程与人才对齐。',
    'sme.pillOne': '快速诊断',
    'sme.pillTwo': '敏捷HR',
    'sme.pillThree': '绩效管理',
    'sme.pillFour': '领导力学院',
    'sme.ctaTitle': '准备好用可扩展咨询起飞。',
    'sme.ctaButton': '查看方案',
    'events.eyebrow': '活动',
    'events.title': '高管日程与沉浸式体验',
    'events.lead': '连接战略、人才与技术的会议和工作坊，产出具体成果。',
    'events.prev': '上一项',
    'events.next': '下一项',
    'events.dots': '活动导航',
    'events.dotLabel': '前往活动 {index}',
    'offices.eyebrow': '办公室',
    'offices.title': '区域覆盖与本地支持',
    'offices.lead': '在主要城市的咨询团队，灵活支持项目的每个阶段。',
    'contact.eyebrow': '对我们的服务感兴趣？',
    'contact.title': '申请高管简报',
    'contact.lead': '填写表单，48小时内收到初步方案。',
    'form.name': '姓名',
    'form.company': '公司',
    'form.email': '邮箱',
    'form.phone': '电话',
    'form.serviceLine': '服务线',
    'form.selectOption': '请选择',
    'form.optionHuman': '人力资本',
    'form.optionDo': '组织发展',
    'form.optionManagement': '管理服务',
    'form.optionLearning': '学习体验',
    'form.message': '留言 / 需求',
    'form.privacy': '我接受隐私声明',
    'form.submit': '索取信息',
    'form.note': '我们将在24个工作小时内联系您。',
    'summary.title': '请求摘要',
    'summary.text': '填写表单以查看自动生成的简报。',
    'footer.about': '面向寻求速度、聚焦与人才对齐的组织的一体化企业咨询。',
    'footer.contact': '联系',
    'footer.hours': '服务时间：周一至周五 9:00-18:00',
    'footer.social': '社交',
    'footer.copy': '© <span id="year"></span> Bechapra。保留所有权利。',
    'error.required': '此字段为必填项。',
    'error.email': '请输入有效邮箱。',
    'error.privacy': '您必须接受隐私声明。',
    'summary.status': '状态：',
    'summary.sent': '已发送 ✅',
    'summary.name': '姓名：',
    'summary.company': '公司：',
    'summary.email': '邮箱：',
    'summary.phone': '电话：',
    'summary.line': '服务线：',
    'summary.message': '留言：',
    'summary.next': '下一步：',
    'summary.nextText': '我们将分享初步诊断。',
  },
  ja: {
    'nav.open': 'メニューを開く',
    'nav.close': 'メニューを閉じる',
    'nav.menu': 'メニュー',
    'nav.services': 'サービス',
    'nav.humanCapital': 'Human Capital',
    'nav.talent': '人材獲得',
    'nav.payroll': '給与アウトソース',
    'nav.do': '組織開発',
    'nav.training': '企業研修',
    'nav.consulting': '組織コンサルティング',
    'nav.management': 'Management Services',
    'nav.accounting': '会計・税務',
    'nav.events': 'イベント',
    'nav.contactCta': '情報を依頼',
    'nav.theme': 'テーマ',
    'nav.lang': '言語を選択',
    'nav.themeToggle': 'テーマを切り替え',
    'hero.title': '才能を伸ばし成長を支援',
    'hero.lead': '統合サービス\n運営と成長の主要領域を網羅するパーソナライズされたアプローチ',
    'hero.ctaPrimary': '私たちを知る',
    'hero.ctaSecondary': 'サービスを見る',
    'hero.statProjects': '統合プロジェクト',
    'hero.statSatisfaction': '経営満足度',
    'hero.statCities': '対応都市',
    'hero.chip': '7日で初期診断',
    'hero.floatOne': 'エグゼクティブインサイト',
    'hero.floatTwo': '360°ロードマップ',
    'services.eyebrow': '統合サービス',
    'services.title': '測定可能なインパクトのサービスライン',
    'services.lead': 'エビデンス、テクノロジー、継続支援でチームと運用を拡張するエンドツーエンドのソリューションを設計します。',
    'services.cardOneTitle': 'Human Capital Analytics',
    'services.cardOneText': '迅速で信頼性の高い意思決定のために重要コンピテンシーとパフォーマンス予測因子を可視化します。',
    'services.cardOneItemOne': 'People analytics',
    'services.cardOneItemTwo': 'Assessment centers',
    'services.cardOneItemThree': '後継者計画',
    'services.cardOneCta': 'プロセスを説明',
    'services.cardTwoTitle': '組織開発',
    'services.cardTwoText': 'スケーラブルでブレンド型、成果志向のプログラムで文化とリーダーシップを変革します。',
    'services.cardTwoItemOne': 'チェンジマネジメント',
    'services.cardTwoItemTwo': '社内アカデミー',
    'services.cardTwoItemThree': '風土とエンゲージメント',
    'services.cardTwoCta': '初期診断',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': '収益性と持続的成長を確保するための運用最適化とガバナンス。',
    'services.cardThreeItemOne': '戦略PMO',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': 'サービスモデル',
    'services.cardThreeCta': 'フレームワークを見る',
    'services.cardFourTitle': 'Learning Experiences',
    'services.cardFourText': 'ハイブリッド形式のエグゼクティブ研修、進捗指標、継続サポート。',
    'services.cardFourItemOne': 'Leadership labs',
    'services.cardFourItemTwo': '社内ブートキャンプ',
    'services.cardFourItemThree': '実践コーチング',
    'services.cardFourCta': 'ルートを探索',
    'sme.title': '中小企業向けサービス',
    'sme.text': '構造、プロセス、整合した人材を求める成長企業向けのモジュール型パッケージ。',
    'sme.pillOne': '迅速診断',
    'sme.pillTwo': 'HRアジャイル',
    'sme.pillThree': 'パフォーマンス管理',
    'sme.pillFour': 'リーダーシップアカデミー',
    'sme.ctaTitle': 'スケーラブルなコンサルで離陸の準備。',
    'sme.ctaButton': 'パッケージを見る',
    'events.eyebrow': 'イベント',
    'events.title': 'エグゼクティブアジェンダと没入型体験',
    'events.lead': '戦略・人材・テクノロジーを具体的成果につなぐカンファレンスとワークショップ。',
    'events.prev': '前へ',
    'events.next': '次へ',
    'events.dots': 'イベントナビゲーション',
    'events.dotLabel': 'イベント {index} へ',
    'offices.eyebrow': '拠点',
    'offices.title': '地域密着の拠点展開',
    'offices.lead': '主要都市のコンサルタントがプロジェクトの各段階を機動的に支援します。',
    'contact.eyebrow': 'サービスに関心がありますか？',
    'contact.title': 'エグゼクティブブリーフを依頼',
    'contact.lead': 'フォームに入力すると48時間以内に初期プランをお届けします。',
    'form.name': '氏名',
    'form.company': '会社',
    'form.email': 'メール',
    'form.phone': '電話',
    'form.serviceLine': 'サービスライン',
    'form.selectOption': '選択してください',
    'form.optionHuman': 'Human Capital',
    'form.optionDo': '組織開発',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Learning Experiences',
    'form.message': 'メッセージ / 要件',
    'form.privacy': 'プライバシー通知に同意します',
    'form.submit': '情報を依頼',
    'form.note': '24営業時間以内にご連絡します。',
    'summary.title': 'ご依頼の概要',
    'summary.text': 'フォームを完了すると自動生成されたブリーフを表示します。',
    'footer.about': '速度、フォーカス、整合した人材を求める組織向けの統合コーポレートコンサルティング。',
    'footer.contact': '連絡先',
    'footer.hours': '対応：月〜金 9:00〜18:00',
    'footer.social': 'SNS',
    'footer.copy': '© <span id="year"></span> Bechapra. All rights reserved.',
    'error.required': '必須項目です。',
    'error.email': '有効なメールを入力してください。',
    'error.privacy': 'プライバシー通知に同意してください。',
    'summary.status': 'ステータス：',
    'summary.sent': '送信済み ✅',
    'summary.name': '氏名：',
    'summary.company': '会社：',
    'summary.email': 'メール：',
    'summary.phone': '電話：',
    'summary.line': 'ライン：',
    'summary.message': 'メッセージ：',
    'summary.next': '次のステップ：',
    'summary.nextText': '初期診断を共有します。',
  },
  ko: {
    'nav.open': '메뉴 열기',
    'nav.close': '메뉴 닫기',
    'nav.menu': '메뉴',
    'nav.services': '서비스',
    'nav.humanCapital': 'Human Capital',
    'nav.talent': '인재 확보',
    'nav.payroll': '급여 아웃소싱',
    'nav.do': '조직 개발',
    'nav.training': '기업 교육',
    'nav.consulting': '조직 컨설팅',
    'nav.management': 'Management Services',
    'nav.accounting': '회계 및 세무',
    'nav.events': '이벤트',
    'nav.contactCta': '정보 요청',
    'nav.theme': '테마',
    'nav.lang': '언어 선택',
    'nav.themeToggle': '테마 전환',
    'hero.title': '인재를 강화하고 성장을 관리합니다',
    'hero.lead': '통합 서비스\n운영과 성장의 핵심 영역을 모두 아우르는 맞춤형 접근',
    'hero.ctaPrimary': '알아보기',
    'hero.ctaSecondary': '서비스 보기',
    'hero.statProjects': '통합 프로젝트',
    'hero.statSatisfaction': '경영진 만족도',
    'hero.statCities': '운영 도시',
    'hero.chip': '7일 내 초기 진단',
    'hero.floatOne': '임원 인사이트',
    'hero.floatTwo': '360° 로드맵',
    'services.eyebrow': '통합 서비스',
    'services.title': '측정 가능한 영향의 서비스 라인',
    'services.lead': '증거, 기술, 지속적 지원으로 팀과 운영을 확장하는 엔드투엔드 솔루션을 설계합니다.',
    'services.cardOneTitle': 'Human Capital Analytics',
    'services.cardOneText': '빠르고 신뢰할 수 있는 의사결정을 위해 핵심 역량과 성과 예측 지표를 매핑합니다.',
    'services.cardOneItemOne': 'People analytics',
    'services.cardOneItemTwo': 'Assessment centers',
    'services.cardOneItemThree': '승계 계획',
    'services.cardOneCta': '프로세스 안내',
    'services.cardTwoTitle': '조직 개발',
    'services.cardTwoText': '확장 가능하고 혼합형이며 결과 중심의 프로그램으로 문화와 리더십을 혁신합니다.',
    'services.cardTwoItemOne': '변화 관리',
    'services.cardTwoItemTwo': '내부 아카데미',
    'services.cardTwoItemThree': '문화와 참여',
    'services.cardTwoCta': '초기 진단',
    'services.cardThreeTitle': 'Management Services',
    'services.cardThreeText': '수익성 있고 지속 가능한 성장을 보장하는 운영 최적화 및 거버넌스.',
    'services.cardThreeItemOne': '전략 PMO',
    'services.cardThreeItemTwo': 'OKRs & KPIs',
    'services.cardThreeItemThree': '서비스 모델',
    'services.cardThreeCta': '프레임워크 보기',
    'services.cardFourTitle': 'Learning Experiences',
    'services.cardFourText': '혼합형 포맷, 진척 지표, 지속 지원을 갖춘 임원 교육.',
    'services.cardFourItemOne': 'Leadership labs',
    'services.cardFourItemTwo': '내부 부트캠프',
    'services.cardFourItemThree': '실전 코칭',
    'services.cardFourCta': '경로 탐색',
    'sme.title': '중소기업 서비스',
    'sme.text': '구조, 프로세스, 인재 정렬이 필요한 성장 기업을 위한 모듈형 패키지.',
    'sme.pillOne': '빠른 진단',
    'sme.pillTwo': 'HR agile',
    'sme.pillThree': '성과 관리',
    'sme.pillFour': '리더 아카데미',
    'sme.ctaTitle': '확장 가능한 컨설팅으로 도약할 준비.',
    'sme.ctaButton': '패키지 보기',
    'events.eyebrow': '이벤트',
    'events.title': '임원 일정과 몰입형 경험',
    'events.lead': '전략, 인재, 기술을 구체적 성과로 연결하는 콘퍼런스와 워크숍.',
    'events.prev': '이전',
    'events.next': '다음',
    'events.dots': '이벤트 탐색',
    'events.dotLabel': '{index}번 이벤트로 이동',
    'offices.eyebrow': '오피스',
    'offices.title': '지역 거점과 로컬 지원',
    'offices.lead': '주요 도시의 컨설팅 팀이 프로젝트의 각 단계를 민첩하게 지원합니다.',
    'contact.eyebrow': '서비스에 관심이 있으신가요?',
    'contact.title': '임원 브리프 요청',
    'contact.lead': '양식을 작성하면 48시간 이내에 예비 계획을 제공합니다.',
    'form.name': '이름',
    'form.company': '회사',
    'form.email': '이메일',
    'form.phone': '전화',
    'form.serviceLine': '서비스 라인',
    'form.selectOption': '옵션 선택',
    'form.optionHuman': 'Human Capital',
    'form.optionDo': '조직 개발',
    'form.optionManagement': 'Management Services',
    'form.optionLearning': 'Learning Experiences',
    'form.message': '메시지 / 요구사항',
    'form.privacy': '개인정보 처리방침에 동의합니다',
    'form.submit': '정보 요청',
    'form.note': '24영업시간 내에 연락드립니다.',
    'summary.title': '요청 요약',
    'summary.text': '양식을 작성하면 자동 생성된 브리프를 확인할 수 있습니다.',
    'footer.about': '속도, 집중, 인재 정렬을 추구하는 조직을 위한 통합 기업 컨설팅.',
    'footer.contact': '연락처',
    'footer.hours': '운영 시간: 월-금 9:00-18:00',
    'footer.social': '소셜',
    'footer.copy': '© <span id="year"></span> Bechapra. All rights reserved.',
    'error.required': '필수 항목입니다.',
    'error.email': '유효한 이메일을 입력하세요.',
    'error.privacy': '개인정보 처리방침에 동의해야 합니다.',
    'summary.status': '상태:',
    'summary.sent': '전송됨 ✅',
    'summary.name': '이름:',
    'summary.company': '회사:',
    'summary.email': '이메일:',
    'summary.phone': '전화:',
    'summary.line': '라인:',
    'summary.message': '메시지:',
    'summary.next': '다음 단계:',
    'summary.nextText': '초기 진단을 공유하겠습니다.',
  },
  ar: {
    'nav.open': 'فتح القائمة',
    'nav.close': 'إغلاق القائمة',
    'nav.menu': 'القائمة',
    'nav.services': 'الخدمات',
    'nav.humanCapital': 'رأس المال البشري',
    'nav.talent': 'استقطاب المواهب',
    'nav.payroll': 'خدمات الرواتب',
    'nav.do': 'التطوير التنظيمي',
    'nav.training': 'تدريب الشركات',
    'nav.consulting': 'استشارات تنظيمية',
    'nav.management': 'خدمات الإدارة',
    'nav.accounting': 'المحاسبة والضرائب',
    'nav.events': 'الفعاليات',
    'nav.contactCta': 'طلب معلومات',
    'nav.theme': 'السمة',
    'nav.lang': 'اختر اللغة',
    'nav.themeToggle': 'تغيير السمة',
    'hero.title': 'نعزز مواهبك وندير نموك',
    'hero.lead': 'خدمات متكاملة\nنهج مخصص يغطي جميع مجالات التشغيل والتطوير الأساسية',
    'hero.ctaPrimary': 'تعرّف علينا',
    'hero.ctaSecondary': 'عرض الخدمات',
    'hero.statProjects': 'مشاريع متكاملة',
    'hero.statSatisfaction': 'رضا القيادات',
    'hero.statCities': 'مدن التشغيل',
    'hero.chip': 'تشخيص أولي خلال 7 أيام',
    'hero.floatOne': 'رؤى تنفيذية',
    'hero.floatTwo': 'خارطة طريق 360°',
    'services.eyebrow': 'خدمات متكاملة',
    'services.title': 'خطوط خدمة بأثر قابل للقياس',
    'services.lead': 'نصمم حلولاً متكاملة لتوسيع الفرق والعمليات بالدلائل والتقنية والمتابعة المستمرة.',
    'services.cardOneTitle': 'تحليلات رأس المال البشري',
    'services.cardOneText': 'نحدد الكفاءات الحرجة ومؤشرات الأداء لاتخاذ قرارات سريعة وموثوقة.',
    'services.cardOneItemOne': 'تحليلات الأفراد',
    'services.cardOneItemTwo': 'مراكز التقييم',
    'services.cardOneItemThree': 'خطة التعاقب',
    'services.cardOneCta': 'نشرح لك العملية',
    'services.cardTwoTitle': 'التطوير التنظيمي',
    'services.cardTwoText': 'نحوّل الثقافة والقيادة ببرامج قابلة للتوسع وممزوجة وموجهة للنتائج.',
    'services.cardTwoItemOne': 'إدارة التغيير',
    'services.cardTwoItemTwo': 'أكاديميات داخلية',
    'services.cardTwoItemThree': 'المناخ والاندماج',
    'services.cardTwoCta': 'تشخيص أولي',
    'services.cardThreeTitle': 'خدمات الإدارة',
    'services.cardThreeText': 'تحسين العمليات والحوكمة لضمان نمو مربح ومستدام.',
    'services.cardThreeItemOne': 'PMO استراتيجية',
    'services.cardThreeItemTwo': 'OKRs و KPIs',
    'services.cardThreeItemThree': 'نماذج الخدمة',
    'services.cardThreeCta': 'عرض الأطر',
    'services.cardFourTitle': 'تجارب التعلم',
    'services.cardFourText': 'تدريب تنفيذي بصيغ هجينة ومقاييس تقدم ومتابعة مستمرة.',
    'services.cardFourItemOne': 'مختبرات القيادة',
    'services.cardFourItemTwo': 'معسكرات داخلية',
    'services.cardFourItemThree': 'تدريب تطبيقي',
    'services.cardFourCta': 'استكشف المسارات',
    'sme.title': 'خدمات للشركات الصغيرة والمتوسطة',
    'sme.text': 'حزم معيارية للشركات النامية التي تحتاج هيكلة وعمليات ومواهب متوافقة دون تعقيد.',
    'sme.pillOne': 'تشخيص سريع',
    'sme.pillTwo': 'HR agile',
    'sme.pillThree': 'إدارة الأداء',
    'sme.pillFour': 'أكاديمية القيادة',
    'sme.ctaTitle': 'جاهزون للانطلاق باستشارات قابلة للتوسع.',
    'sme.ctaButton': 'عرض الحزم',
    'events.eyebrow': 'الفعاليات',
    'events.title': 'أجندة تنفيذية وتجارب غامرة',
    'events.lead': 'مؤتمرات وورش عمل تربط الاستراتيجية بالمواهب والتقنية بنتائج ملموسة.',
    'events.prev': 'السابق',
    'events.next': 'التالي',
    'events.dots': 'تنقل الفعاليات',
    'events.dotLabel': 'انتقل إلى الفعالية {index}',
    'offices.eyebrow': 'المكاتب',
    'offices.title': 'حضور إقليمي مع دعم محلي',
    'offices.lead': 'فرق استشارية في المدن الرئيسية لمرافقة كل مرحلة من المشروع بمرونة.',
    'contact.eyebrow': 'مهتم بخدماتنا؟',
    'contact.title': 'اطلب ملخصاً تنفيذياً',
    'contact.lead': 'أكمل النموذج لتتلقى خطة أولية خلال أقل من 48 ساعة.',
    'form.name': 'الاسم',
    'form.company': 'الشركة',
    'form.email': 'البريد الإلكتروني',
    'form.phone': 'الهاتف',
    'form.serviceLine': 'خط الخدمة',
    'form.selectOption': 'اختر خياراً',
    'form.optionHuman': 'رأس المال البشري',
    'form.optionDo': 'التطوير التنظيمي',
    'form.optionManagement': 'خدمات الإدارة',
    'form.optionLearning': 'تجارب التعلم',
    'form.message': 'الرسالة / المتطلبات',
    'form.privacy': 'أوافق على إشعار الخصوصية',
    'form.submit': 'طلب معلومات',
    'form.note': 'سنتواصل معك خلال 24 ساعة عمل.',
    'summary.title': 'ملخص طلبك',
    'summary.text': 'أكمل النموذج لعرض الملخص المُنشأ تلقائياً.',
    'footer.about': 'استشارات مؤسسية متكاملة للمنظمات التي تبحث عن السرعة والتركيز وتوافق المواهب.',
    'footer.contact': 'التواصل',
    'footer.hours': 'ساعات العمل: الاثنين - الجمعة 9:00 إلى 18:00',
    'footer.social': 'الشبكات',
    'footer.copy': '© <span id="year"></span> Bechapra. جميع الحقوق محفوظة.',
    'error.required': 'هذا الحقل مطلوب.',
    'error.email': 'أدخل بريداً إلكترونياً صحيحاً.',
    'error.privacy': 'يجب قبول إشعار الخصوصية.',
    'summary.status': 'الحالة:',
    'summary.sent': 'تم الإرسال ✅',
    'summary.name': 'الاسم:',
    'summary.company': 'الشركة:',
    'summary.email': 'البريد الإلكتروني:',
    'summary.phone': 'الهاتف:',
    'summary.line': 'الخط:',
    'summary.message': 'الرسالة:',
    'summary.next': 'الخطوة التالية:',
    'summary.nextText': 'سنشارك تشخيصاً أولياً.',
  },
};

const languageNames = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
};

const defaultLang = 'es';

const formatString = (value, vars) => {
  if (!vars) {
    return value;
  }

  return value.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));
};

const getTranslation = (lang, key, vars) => {
  const value = i18n[lang]?.[key] ?? i18n[defaultLang]?.[key];
  if (!value) {
    return null;
  }
  return formatString(value, vars);
};

const applyTranslations = (lang) => {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const value = getTranslation(lang, key);
    if (!value) {
      return;
    }
    const attr = element.dataset.i18nAttr;
    if (attr) {
      element.setAttribute(attr, value);
    } else {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const key = element.dataset.i18nHtml;
    const value = getTranslation(lang, key);
    if (!value) {
      return;
    }
    element.innerHTML = value;
  });

  updateYear();
  updateDotLabels(lang);
};

const setLanguage = (language) => {
  const lang = i18n[language] ? language : defaultLang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (langLabel) {
    langLabel.textContent = languageNames[lang] ?? languageNames[defaultLang];
  }
  applyTranslations(lang);
};

const storedLanguage = localStorage.getItem('language');
setLanguage(storedLanguage || defaultLang);

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
  if (!navPanel) {
    return;
  }
  const isOpen = forceState ?? !navPanel.classList.contains('is-open');
  navPanel.classList.toggle('is-open', isOpen);
  if (navToggle) {
    navToggle.setAttribute('aria-expanded', isOpen);
  }
  if (navOverlay) {
    navOverlay.classList.toggle('is-open', isOpen);
  }
  body.classList.toggle('nav-open', isOpen);
  if (!isOpen) {
    closeDropdowns();
  }
};

if (navToggle) {
  navToggle.addEventListener('click', () => toggleNav());
}
if (navClose) {
  navClose.addEventListener('click', () => toggleNav(false));
}
if (navOverlay) {
  navOverlay.addEventListener('click', () => toggleNav(false));
}

if (navPanel) {
  navPanel.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.closest('a');
    if (link && navPanel.contains(link)) {
      toggleNav(false);
    }
  });
}

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

const toggleLangMenu = (forceState) => {
  if (!langMenu) {
    return;
  }
  const isOpen = forceState ?? !langMenu.classList.contains('is-open');
  langMenu.classList.toggle('is-open', isOpen);
  if (langButton) {
    langButton.setAttribute('aria-expanded', isOpen);
  }
};

if (langButton) {
  langButton.addEventListener('click', () => toggleLangMenu());
}

if (langMenu) {
  langMenu.querySelectorAll('button[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
      toggleLangMenu(false);
    });
  });
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav__item--dropdown')) {
    closeDropdowns();
  }

  if (langSwitcher && !langSwitcher.contains(event.target)) {
    toggleLangMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDropdowns();
    toggleLangMenu(false);
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

const updateDotLabels = (lang) => {
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    const label = getTranslation(lang, 'events.dotLabel', { index: index + 1 });
    if (label) {
      dot.setAttribute('aria-label', label);
    }
  });
};

const buildSliderDots = () => {
  sliderSlides.forEach((_, index) => {
    const button = document.createElement('button');
    button.className = 'dot';
    button.type = 'button';
    button.setAttribute('role', 'tab');
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
updateDotLabels(storedLanguage || defaultLang);

prevButton.addEventListener('click', () => moveToSlide(currentSlide - 1));
nextButton.addEventListener('click', () => moveToSlide(currentSlide + 1));

const validateField = (field) => {
  const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
  let message = '';
  const lang = localStorage.getItem('language') || defaultLang;

  if (field.validity.valueMissing) {
    message = getTranslation(lang, 'error.required');
  } else if (field.type === 'email' && field.validity.typeMismatch) {
    message = getTranslation(lang, 'error.email');
  }

  if (field.name === 'privacidad' && !field.checked) {
    message = getTranslation(lang, 'error.privacy');
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

  const lang = localStorage.getItem('language') || defaultLang;
  summaryPanel.innerHTML = `
    <p><strong>${getTranslation(lang, 'summary.status')}</strong> ${getTranslation(lang, 'summary.sent')}</p>
    <p><strong>${getTranslation(lang, 'summary.name')}</strong> ${payload.nombre}</p>
    <p><strong>${getTranslation(lang, 'summary.company')}</strong> ${payload.empresa}</p>
    <p><strong>${getTranslation(lang, 'summary.email')}</strong> ${payload.email}</p>
    <p><strong>${getTranslation(lang, 'summary.phone')}</strong> ${payload.telefono}</p>
    <p><strong>${getTranslation(lang, 'summary.line')}</strong> ${payload.linea}</p>
    <p><strong>${getTranslation(lang, 'summary.message')}</strong> ${payload.mensaje}</p>
    <p><strong>${getTranslation(lang, 'summary.next')}</strong> ${getTranslation(lang, 'summary.nextText')}</p>
  `;

  form.reset();
});

form.addEventListener('input', (event) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    validateField(event.target);
  }
});

const updateYear = () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

updateYear();
