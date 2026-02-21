// JavaScript para funcionalidad adicional
document.addEventListener('DOMContentLoaded', function() {
    
// BAUSEN: modo claro fijo (deshabilita el toggle si existe)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.style.display = 'none';
// Botón de volver arriba
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Navegación suave en la página
    document.querySelectorAll('.sidebar-menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Manejo del formulario de contacto
    const privacyContactForm = document.getElementById('privacyContactForm');
    
    if (privacyContactForm) {
        privacyContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí normalmente enviarías los datos a un servidor
            // Por ahora, solo mostraremos una alerta
            alert('Gracias por su consulta. Nos pondremos en contacto con usted en un plazo de 48 horas.');
            
            // Resetear el formulario
            privacyContactForm.reset();
        });
    }

    // Actualizar automáticamente el año en el pie de página
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.privacy-footer p:first-child');
    
    if (yearElement) {
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }

    // Efecto de scroll para las secciones
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones
    document.querySelectorAll('.privacy-section').forEach(section => {
        observer.observe(section);
    });
});