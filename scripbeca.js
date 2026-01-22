/**
 * BAUSEN - Script principal del sitio web corporativo
 * @version 1.1.0
 * @description Maneja navegación, animaciones, Three.js, efectos 3D y formularios
 */

// ============================================
// 1. CONFIGURACIÓN Y VARIABLES GLOBALES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Estado global de la aplicación
    const AppState = {
        isMenuOpen: false,
        isThreeJSInitialized: false,
        isWebGLSupported: true,
        scrollPosition: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        lastToggleTime: 0
    };
    
    // Elementos del DOM
    const DOM = {
        // Header y navegación
        header: document.getElementById('mainHeader'),
        nav: document.getElementById('mainNav'),
        menuToggle: document.getElementById('menuToggle'),
        navLinks: document.querySelectorAll('.nav-link'),
        navList: document.querySelector('.nav-list'),
        navOverlay: document.getElementById('navOverlay'),
        
        // Three.js
        threeContainer: document.getElementById('threejs-container'),
        threeCanvas: document.getElementById('threejs-canvas'),
        webglFallback: document.querySelector('.webgl-fallback'),
        
        // Formularios
        contactForm: document.getElementById('contactForm'),
        formMessage: document.getElementById('formMessage'),
        submitText: document.getElementById('submitText'),
        submitSpinner: document.getElementById('submitSpinner'),
        
        // Footer
        currentYear: document.getElementById('currentYear')
    };
    
    // Instancias de Three.js
    let ThreeScene = {
        scene: null,
        camera: null,
        renderer: null,
        meshes: [],
        lights: [],
        clock: null,
        animationId: null
    };
    
    // ============================================
    // 2. DETECCIÓN DE WEBGL Y COMPATIBILIDAD
    // ============================================
    
    /**
     * Detecta si el navegador soporta WebGL
     * @returns {boolean} True si WebGL está disponible
     */
    function detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const contexts = ['webgl', 'experimental-webgl', 'webgl2'];
            
            for (let i = 0; i < contexts.length; i++) {
                try {
                    if (canvas.getContext(contexts[i])) {
                        return true;
                    }
                } catch (e) {
                    continue;
                }
            }
        } catch (e) {
            console.warn('WebGL no disponible:', e.message);
        }
        
        return false;
    }
    
    /**
     * Configura el fallback para dispositivos sin WebGL
     */
    function setupWebGLFallback() {
        if (!AppState.isWebGLSupported && DOM.webglFallback) {
            DOM.threeCanvas.style.display = 'none';
            DOM.webglFallback.style.zIndex = '1';
            
            // Activar animaciones CSS en el fallback
            const fallbackElements = document.querySelectorAll('.fallback-geometric');
            fallbackElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    }
    
    // ============================================
    // 3. THREE.JS - ESCENA 3D CORPORATIVA
    // ============================================
    
    /**
     * Inicializa la escena 3D con Three.js
     */
    function initThreeJS() {
        // Verificar si Three.js está disponible
        if (typeof THREE === 'undefined') {
            console.error('Three.js no está cargado');
            AppState.isWebGLSupported = false;
            setupWebGLFallback();
            return;
        }
        
        // Verificar soporte de WebGL
        AppState.isWebGLSupported = detectWebGL();
        if (!AppState.isWebGLSupported) {
            setupWebGLFallback();
            return;
        }
        
        // Dimensiones del canvas
        const width = DOM.threeContainer.clientWidth;
        const height = DOM.threeContainer.clientHeight;
        
        // 1. ESCENA
        ThreeScene.scene = new THREE.Scene();
        ThreeScene.scene.background = null;
        ThreeScene.scene.fog = new THREE.Fog(0x1a56db, 10, 25);
        
        // 2. CÁMARA
        ThreeScene.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        ThreeScene.camera.position.set(0, 0, 8);
        
        // 3. RENDERER
        ThreeScene.renderer = new THREE.WebGLRenderer({
            canvas: DOM.threeCanvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        ThreeScene.renderer.setSize(width, height);
        ThreeScene.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        ThreeScene.renderer.shadowMap.enabled = false;
        ThreeScene.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // 4. ILUMINACIÓN
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        ThreeScene.scene.add(ambientLight);
        ThreeScene.lights.push(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        ThreeScene.scene.add(directionalLight);
        ThreeScene.lights.push(directionalLight);
        
        const fillLight = new THREE.DirectionalLight(0x3b82f6, 0.3);
        fillLight.position.set(-5, -3, -5);
        ThreeScene.scene.add(fillLight);
        ThreeScene.lights.push(fillLight);
        
        // 5. GEOMETRÍAS CORPORATIVAS ABSTRACTAS
        const geometries = [
            new THREE.BoxGeometry(1.2, 1.2, 1.2, 2, 2, 2),
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.TorusGeometry(0.8, 0.3, 16, 32),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.DodecahedronGeometry(1, 0)
        ];
        
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x1a56db,
            metalness: 0.4,
            roughness: 0.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        
        const accentMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8b5cf6,
            metalness: 0.5,
            roughness: 0.3,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const meshCount = AppState.windowWidth < 768 ? 4 : 6;
        
        for (let i = 0; i < meshCount; i++) {
            const geometry = geometries[i % geometries.length];
            const meshMaterial = i % 3 === 0 ? accentMaterial : material;
            const mesh = new THREE.Mesh(geometry, meshMaterial);
            
            const angle = (i / meshCount) * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.y = (Math.random() - 0.5) * 2;
            mesh.position.z = Math.sin(angle) * radius;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            const scale = 0.6 + Math.random() * 0.4;
            mesh.scale.set(scale, scale, scale);
            
            mesh.userData = {
                speed: 0.2 + Math.random() * 0.3,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.005
                },
                floatAmplitude: 0.05 + Math.random() * 0.1,
                floatSpeed: 0.5 + Math.random() * 0.5,
                originalY: mesh.position.y,
                pulseSpeed: 0.5 + Math.random() * 1,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            ThreeScene.scene.add(mesh);
            ThreeScene.meshes.push(mesh);
        }
        
        // 6. RELOJ PARA ANIMACIONES
        ThreeScene.clock = new THREE.Clock();
        
        // 7. INICIAR ANIMACIÓN
        animateThreeJS();
        
        // 8. MANEJAR REDIMENSIONAMIENTO
        window.addEventListener('resize', handleThreeJSResize);
        
        AppState.isThreeJSInitialized = true;
        console.log('Three.js inicializado correctamente');
    }
    
    /**
     * Maneja el redimensionamiento de la ventana para Three.js
     */
    function handleThreeJSResize() {
        if (!AppState.isThreeJSInitialized || !AppState.isWebGLSupported) return;
        
        const width = DOM.threeContainer.clientWidth;
        const height = DOM.threeContainer.clientHeight;
        
        ThreeScene.camera.aspect = width / height;
        ThreeScene.camera.updateProjectionMatrix();
        ThreeScene.renderer.setSize(width, height);
        
        if (AppState.windowWidth < 768) {
            ThreeScene.renderer.setPixelRatio(1);
        } else {
            ThreeScene.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }
    
    /**
     * Bucle de animación de Three.js
     */
    function animateThreeJS() {
        if (!AppState.isThreeJSInitialized || !AppState.isWebGLSupported) return;
        
        ThreeScene.animationId = requestAnimationFrame(animateThreeJS);
        
        const delta = ThreeScene.clock.getDelta();
        const time = ThreeScene.clock.getElapsedTime();
        
        // Animar cada malla
        ThreeScene.meshes.forEach((mesh, index) => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
            
            mesh.position.y = mesh.userData.originalY + 
                Math.sin(time * mesh.userData.floatSpeed + index) * 
                mesh.userData.floatAmplitude;
            
            const pulse = Math.sin(time * mesh.userData.pulseSpeed + mesh.userData.pulsePhase) * 0.05;
            mesh.scale.setScalar(0.8 + pulse);
            
            const orbitSpeed = mesh.userData.speed * 0.001;
            mesh.position.x = Math.cos(time * orbitSpeed + index) * (3 + index * 0.3);
            mesh.position.z = Math.sin(time * orbitSpeed + index) * (3 + index * 0.3);
        });
        
        const scrollEffect = AppState.scrollPosition * 0.0001;
        ThreeScene.camera.position.x = Math.sin(time * 0.1) * 0.5 + scrollEffect * 2;
        ThreeScene.camera.position.y = Math.cos(time * 0.05) * 0.3;
        ThreeScene.camera.lookAt(ThreeScene.scene.position);
        
        ThreeScene.renderer.render(ThreeScene.scene, ThreeScene.camera);
    }
    
    /**
     * Limpia los recursos de Three.js
     */
    function cleanupThreeJS() {
        if (ThreeScene.animationId) {
            cancelAnimationFrame(ThreeScene.animationId);
        }
        
        if (ThreeScene.renderer) {
            ThreeScene.renderer.dispose();
        }
        
        ThreeScene.meshes.forEach(mesh => {
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(material => material.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
        });
        
        ThreeScene.lights.forEach(light => {
            if (light.dispose) light.dispose();
        });
        
        ThreeScene.scene = null;
        ThreeScene.camera = null;
        ThreeScene.renderer = null;
        ThreeScene.meshes = [];
        ThreeScene.lights = [];
        
        AppState.isThreeJSInitialized = false;
    }
    
    // ============================================
    // 4. ANIMACIONES 3D PARA TARJETAS
    // ============================================
    
    /**
     * Inicializa efectos 3D para tarjetas de servicios y diferenciadores
     */
    function init3DCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card-3d');
        const differentiatorCards = document.querySelectorAll('.differentiator-card-3d');
        
        // Verificar si el dispositivo soporta hover (no es táctil)
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            console.log('Dispositivo táctil detectado - Efectos 3D optimizados para touch');
            initTouchCardEffects(serviceCards, differentiatorCards);
        } else {
            console.log('Dispositivo no táctil - Activando efectos 3D completos');
            initDesktopCardEffects(serviceCards, differentiatorCards);
        }
        
        // Mejorar accesibilidad
        enhanceCardAccessibility();
    }
    
    /**
     * Efectos 3D para desktop (con seguimiento de cursor)
     */
    function initDesktopCardEffects(serviceCards, differentiatorCards) {
        const cards = [...serviceCards, ...differentiatorCards];
        
        cards.forEach(card => {
            const wrapper = card.closest('.card-3d-wrapper');
            if (!wrapper) return;
            
            let isActive = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            // Smooth animation loop
            function animate() {
                // Suavizar el movimiento (lerp)
                currentX += (targetX - currentX) * 0.15;
                currentY += (targetY - currentY) * 0.15;
                
                // Aplicar transformación
                const transform = `
                    rotateX(${currentY}deg) 
                    rotateY(${currentX}deg) 
                    translateZ(${isActive ? '20px' : '0'})
                `;
                
                card.style.transform = transform;
                
                // Continuar animación si es necesario
                if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
                    requestAnimationFrame(animate);
                }
            }
            
            // Iniciar loop de animación
            animate();
            
            // Event listeners
            wrapper.addEventListener('mouseenter', () => {
                isActive = true;
                card.style.transition = 'transform 0.3s ease-out';
            });
            
            wrapper.addEventListener('mouseleave', () => {
                isActive = false;
                targetX = 0;
                targetY = 0;
                card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            });
            
            wrapper.addEventListener('mousemove', (e) => {
                if (!isActive) return;
                
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Normalizar coordenadas (-1 a 1)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calcular rotación (máximo 5 grados)
                targetX = ((x - centerX) / centerX) * 5;
                targetY = ((centerY - y) / centerY) * -5;
                
                // Iniciar animación si no está corriendo
                if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
                    requestAnimationFrame(animate);
                }
            });
            
            // Asegurar que la tarjeta vuelva a su estado original
            wrapper.addEventListener('mouseleave', () => {
                targetX = 0;
                targetY = 0;
            });
        });
    }
    
    /**
     * Efectos optimizados para dispositivos táctiles
     */
    function initTouchCardEffects(serviceCards, differentiatorCards) {
        const cards = [...serviceCards, ...differentiatorCards];
        
        cards.forEach(card => {
            const wrapper = card.closest('.card-3d-wrapper');
            if (!wrapper) return;
            
            let touchStartY = 0;
            let isPressed = false;
            
            // Touch events
            wrapper.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchStartY = e.touches[0].clientY;
                isPressed = true;
                
                card.style.transition = 'transform 0.2s ease-out';
                card.style.transform = 'translateY(-8px) translateZ(10px) scale(0.98)';
                
                // Feedback táctil (si está disponible)
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: false });
            
            wrapper.addEventListener('touchend', () => {
                isPressed = false;
                card.style.transition = 'transform 0.3s ease-out';
                card.style.transform = 'translateY(0) translateZ(0) scale(1)';
            });
            
            wrapper.addEventListener('touchmove', (e) => {
                if (!isPressed) return;
                
                const touchY = e.touches[0].clientY;
                const deltaY = touchStartY - touchY;
                
                // Efecto sutil basado en el movimiento
                const intensity = Math.min(Math.abs(deltaY) / 100, 0.5);
                const direction = deltaY > 0 ? -1 : 1;
                
                card.style.transform = `translateY(${-8 + intensity * 5}px) 
                                       translateZ(${10 + intensity * 5}px) 
                                       rotateX(${direction * intensity * 3}deg) 
                                       scale(${0.98 - intensity * 0.05})`;
            });
            
            // Click como fallback
            wrapper.addEventListener('click', () => {
                // Efecto de pulso
                card.style.transition = 'transform 0.2s ease-out';
                card.style.transform = 'translateY(-4px) translateZ(5px) scale(0.99)';
                
                setTimeout(() => {
                    card.style.transition = 'transform 0.3s ease-out';
                    card.style.transform = 'translateY(0) translateZ(0) scale(1)';
                }, 200);
            });
        });
    }
    
    /**
     * Mejora la accesibilidad de las tarjetas 3D
     */
    function enhanceCardAccessibility() {
        const cards = document.querySelectorAll('.service-card-3d, .differentiator-card-3d');
        
        cards.forEach(card => {
            // Asegurar que las tarjetas sean focusables
            card.setAttribute('tabindex', '0');
            
            // Efectos de teclado
            card.addEventListener('focus', () => {
                card.style.outline = '2px solid var(--color-primary)';
                card.style.outlineOffset = '4px';
            });
            
            card.addEventListener('blur', () => {
                card.style.outline = 'none';
            });
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    
                    // Simular click en el enlace principal de la tarjeta
                    const link = card.querySelector('a');
                    if (link) {
                        link.click();
                    }
                    
                    // Efecto visual de activación
                    card.style.transition = 'transform 0.2s ease-out';
                    card.style.transform = 'translateY(-8px) translateZ(10px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'transform 0.3s ease-out';
                        card.style.transform = 'translateY(0) translateZ(0)';
                    }, 200);
                }
            });
        });
    }
    
    // ============================================
    // 5. NAVEGACIÓN Y HEADER
    // ============================================
    
    /**
     * Maneja el comportamiento del header al hacer scroll
     */
    function handleScroll() {
        AppState.scrollPosition = window.scrollY || document.documentElement.scrollTop;
        
        // Header sticky con efecto
        if (AppState.scrollPosition > 100) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        
        // Actualizar enlace activo en navegación
        updateActiveNavLink();
    }
    
    /**
     * Actualiza el enlace de navegación activo basado en scroll
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = AppState.scrollPosition + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                DOM.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    /**
     * Alternar menú móvil
     */
    function toggleMobileMenu() {
        // Debounce rapid triggers to avoid double-toggle from multiple event types
        const now = Date.now();
        if (now - AppState.lastToggleTime < 300) return;
        AppState.lastToggleTime = now;

        AppState.isMenuOpen = !AppState.isMenuOpen;
        DOM.nav.classList.toggle('active');
        DOM.menuToggle.classList.toggle('active');

        // Activar / desactivar overlay si existe
        if (DOM.navOverlay) {
            DOM.navOverlay.classList.toggle('active');
            DOM.navOverlay.setAttribute('aria-hidden', String(!AppState.isMenuOpen));
        }

        // Bloquear scroll del body cuando el menú está abierto
        document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';

        // Actualizar aria-expanded y aria-label para accesibilidad
        const isExpanded = DOM.nav.classList.contains('active');
        DOM.menuToggle.setAttribute('aria-expanded', isExpanded);
        DOM.menuToggle.setAttribute('aria-label', isExpanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    }
    
    /**
     * Cierra el menú móvil
     */
    function closeMobileMenu() {
        if (!AppState.isMenuOpen) return;
        
        AppState.isMenuOpen = false;
        DOM.nav.classList.remove('active');
        DOM.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        DOM.menuToggle.setAttribute('aria-expanded', 'false');
        DOM.menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');

        if (DOM.navOverlay) {
            DOM.navOverlay.classList.remove('active');
            DOM.navOverlay.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Inicializa el scroll suave para enlaces internos
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Cerrar menú móvil si está abierto
                    closeMobileMenu();
                    
                    // Scroll suave al elemento
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ============================================
    // 6. FORMULARIO DE CONTACTO
    // ============================================
    
    /**
     * Valida un campo de formulario
     * @param {HTMLElement} field - Campo a validar
     * @returns {Object} Resultado de validación
     */
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        const isRequired = field.required;
        
        // Validar campo requerido
        if (isRequired && !value) {
            return {
                isValid: false,
                message: 'Este campo es obligatorio'
            };
        }
        
        // Validaciones específicas por tipo
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    return {
                        isValid: false,
                        message: 'Por favor, introduce un email válido'
                    };
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
                if (value && !phoneRegex.test(value)) {
                    return {
                        isValid: false,
                        message: 'Por favor, introduce un teléfono válido'
                    };
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    return {
                        isValid: false,
                        message: 'Por favor, proporciona más detalles (mínimo 10 caracteres)'
                    };
                }
                break;
        }
        
        return { isValid: true, message: '' };
    }
    
    /**
     * Muestra un error en un campo del formulario
     * @param {HTMLElement} field - Campo con error
     * @param {string} message - Mensaje de error
     */
    function showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            field.classList.add('error');
        }
    }
    
    /**
     * Limpia los errores de un campo del formulario
     * @param {HTMLElement} field - Campo a limpiar
     */
    function clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            field.classList.remove('error');
        }
    }
    
    /**
     * Muestra un mensaje de formulario
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje (success/error)
     */
    function showFormMessage(message, type) {
        DOM.formMessage.textContent = message;
        DOM.formMessage.className = `form-message ${type}`;
        DOM.formMessage.classList.remove('hidden');
        
        // Scroll al mensaje
        DOM.formMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Ocultar después de 5 segundos
        if (type === 'success') {
            setTimeout(() => {
                DOM.formMessage.classList.add('hidden');
            }, 5000);
        }
    }
    
    /**
     * Maneja el envío del formulario de contacto
     * @param {Event} e - Evento de envío
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validar todos los campos
        const fields = DOM.contactForm.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            const validation = validateField(field);
            if (!validation.isValid) {
                showFieldError(field, validation.message);
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        if (!isValid) {
            showFormMessage('Por favor, corrige los errores en el formulario', 'error');
            return;
        }
        
        // Mostrar estado de carga
        DOM.submitText.textContent = 'Enviando...';
        DOM.submitSpinner.classList.remove('hidden');
        
        try {
            // Simular envío (en producción, reemplazar con fetch real)
            await simulateFormSubmit();
            
            // Éxito
            showFormMessage('¡Mensaje enviado con éxito! Te contactaremos en menos de 24 horas.', 'success');
            DOM.contactForm.reset();
            
        } catch (error) {
            // Error
            showFormMessage('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
            console.error('Error en envío de formulario:', error);
            
        } finally {
            // Restaurar estado normal
            DOM.submitText.textContent = 'Enviar solicitud';
            DOM.submitSpinner.classList.add('hidden');
        }
    }
    
    /**
     * Simula el envío del formulario
     * @returns {Promise} Promesa que simula una petición
     */
    function simulateFormSubmit() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito 90% de las veces
                Math.random() > 0.1 ? resolve() : reject(new Error('Error de servidor simulado'));
            }, 1500);
        });
    }
    
    /**
     * Inicializa la validación en tiempo real
     */
    function initFormValidation() {
        const fields = DOM.contactForm.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Validar al perder el foco
            field.addEventListener('blur', () => {
                const validation = validateField(field);
                if (!validation.isValid) {
                    showFieldError(field, validation.message);
                } else {
                    clearFieldError(field);
                }
            });
            
            // Limpiar error al empezar a escribir
            field.addEventListener('input', () => {
                clearFieldError(field);
            });
        });
    }
    
    // ============================================
    // 7. ANIMACIONES Y EFECTOS
    // ============================================
    
    /**
     * Inicializa animaciones al hacer scroll
     */
    function initScrollAnimations() {
        // Configurar observador de intersección
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añadir clase para animación
                    entry.target.classList.add('animate-in');
                    
                    // Opcional: dejar de observar después de animar
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar elementos que deben animarse
        const animateElements = document.querySelectorAll(
            '.service-card, .differentiator-card, .process-step'
        );
        
        animateElements.forEach((el, index) => {
            // Añadir retardo escalonado
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }
    
    /**
     * Actualiza el año actual en el footer
     */
    function updateCurrentYear() {
        if (DOM.currentYear) {
            DOM.currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // ============================================
    // 8. MANEJO DE REDIMENSIONAMIENTO
    // ============================================
    
    /**
     * Maneja el redimensionamiento de la ventana
     */
    function handleResize() {
        AppState.windowWidth = window.innerWidth;
        AppState.windowHeight = window.innerHeight;
        
        // Cerrar menú móvil en pantallas grandes
        if (AppState.windowWidth > 768 && AppState.isMenuOpen) {
            closeMobileMenu();
        }
        
        // Reconfigurar Three.js en cambio de tamaño
        if (AppState.isThreeJSInitialized) {
            handleThreeJSResize();
        }
    }
    
    // ============================================
    // 9. INICIALIZACIÓN PRINCIPAL
    // ============================================
    
    /**
     * Inicializa todos los módulos de la aplicación
     */
    function initApp() {
        console.log('Inicializando BAUSEN...');
        
        // 1. Detectar WebGL
        AppState.isWebGLSupported = detectWebGL();
        
        // 2. Inicializar Three.js (con retardo para priorizar contenido crítico)
        if (AppState.isWebGLSupported) {
            setTimeout(() => {
                initThreeJS();
            }, 500);
        } else {
            setupWebGLFallback();
        }
        
        // 3. Configurar eventos de scroll
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Llamar inicialmente
        
        // 4. Configurar navegación
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', toggleMobileMenu);
            
            // Teclas Enter / Space para accesibilidad
            DOM.menuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    toggleMobileMenu();
                }
            });
        }
        
        // Cerrar menú al hacer clic en un enlace
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Cerrar menú al hacer clic fuera (overlay) o en cualquier clic fuera de nav/menu
        if (DOM.navOverlay) {
            DOM.navOverlay.addEventListener('click', closeMobileMenu);
        }

        document.addEventListener('click', (e) => {
            if (AppState.isMenuOpen && 
                !DOM.nav.contains(e.target) && 
                !DOM.menuToggle.contains(e.target) &&
                (!DOM.navOverlay || !DOM.navOverlay.contains(e.target))) {
                closeMobileMenu();
            }
        });

        // NOTE: Removed click interception for `.service-request` anchors so native navigation works.
        // Previous modal/prefill logic was removed to ensure links behave as normal <a href="..."> elements.
        
        // 5. Inicializar scroll suave
        initSmoothScroll();

        // Asegurar estado limpio de overlay/menú al iniciar
        try {
            if (DOM.navOverlay) {
                DOM.navOverlay.classList.remove('active');
                DOM.navOverlay.setAttribute('aria-hidden', 'true');
                DOM.navOverlay.style.pointerEvents = 'none';
            }

            if (DOM.nav) DOM.nav.classList.remove('active');
            if (DOM.menuToggle) {
                DOM.menuToggle.classList.remove('active');
                DOM.menuToggle.setAttribute('aria-expanded', 'false');
                DOM.menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
            }
            document.body.style.overflow = '';
        } catch (err) {
            console.warn('Error limpiando estado inicial del menú:', err);
        }

        // Asegurar que los botones de servicios sean interactivamente clicables
        try {
            const serviceButtons = document.querySelectorAll('.service-cta a, .service-cta .btn');
            serviceButtons.forEach(btn => {
                btn.style.pointerEvents = 'auto';
                btn.style.position = 'relative';
                // set z-index above typical content but below overlays (use 1060)
                btn.style.zIndex = '1060';
            });
        } catch (err) {
            console.warn('Error asegurando interactividad botones servicios:', err);
        }
        
        // 6. Configurar formulario
        if (DOM.contactForm) {
            initFormValidation();
            DOM.contactForm.addEventListener('submit', handleFormSubmit);
        }
        
        // 7. Inicializar animaciones 3D para tarjetas
        setTimeout(() => {
            init3DCardEffects();
        }, 1000);
        
        // 8. Inicializar animaciones scroll
        initScrollAnimations();
        
        // 9. Actualizar año actual
        updateCurrentYear();
        
        // 10. Configurar redimensionamiento
        window.addEventListener('resize', handleResize);
        
        // 11. Manejar tecla Escape para cerrar menú
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && AppState.isMenuOpen) {
                closeMobileMenu();
            }
        });
        
        console.log('BAUSEN inicializado correctamente');
    }
    
    /**
     * Limpia todos los recursos antes de desmontar
     */
    function cleanupApp() {
        // Limpiar Three.js
        if (AppState.isThreeJSInitialized) {
            cleanupThreeJS();
        }
        
        // Remover event listeners
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        
        if (DOM.menuToggle) {
            DOM.menuToggle.removeEventListener('click', toggleMobileMenu);
        }
        
        if (DOM.contactForm) {
            DOM.contactForm.removeEventListener('submit', handleFormSubmit);
        }
        
        console.log('BAUSEN limpiado correctamente');
    }
    
    // ============================================
    // 10. POLYFILLS Y COMPATIBILIDAD
    // ============================================
    
    /**
     * Aplica polyfills para navegadores antiguos
     */
    function applyPolyfills() {
        // Polyfill para IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            const script = document.createElement('script');
            script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
            document.head.appendChild(script);
        }
        
        // Polyfill para smooth scroll
        if (!('scrollBehavior' in document.documentElement.style)) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/smoothscroll-polyfill/dist/smoothscroll.min.js';
            document.head.appendChild(script);
        }
    }
    
    // ============================================
    // 11. INICIALIZACIÓN Y EJECUCIÓN
    // ============================================
    
    // Aplicar polyfills si es necesario
    applyPolyfills();
    
    // Inicializar aplicación cuando el DOM esté listo
    initApp();
    
    // Limpiar al descargar la página
    window.addEventListener('beforeunload', () => {
        cleanupApp();
    });
});