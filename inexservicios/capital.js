/* =========================
   Capital Humano - JS (v8 Enhanced)
   - Header scrolled optimizado
   - Drawer móvil mejorado
   - Tema persistente
   - Reveal con stagger mejorado
   - Efecto tilt 3D en cards
   - Optimizaciones de rendimiento para escalado
========================= */

(() => {
  'use strict';
  
  // Helpers
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));
  
  // Remove no-js class
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
  
  // ======================
  // VIEWPORT PROPERTIES
  // ======================
  let resizeTimer;
  
  function updateViewportProperties() {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    
    // Adjust elements based on viewport
    adjustElementSizes();
  }
  
  function adjustElementSizes() {
    // Adjust card grid columns
    const cardGrids = $$('.card-grid');
    cardGrids.forEach(grid => {
      if (!grid) return;
      
      if (window.innerWidth < 640) {
        grid.style.gridTemplateColumns = '1fr';
      } else if (window.innerWidth < 1024) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      } else {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      }
    });
    
    // Adjust hero image height on mobile
    const heroImages = $$('.media-img');
    heroImages.forEach(img => {
      if (window.innerWidth < 768) {
        img.style.maxHeight = '50vh';
      } else {
        img.style.maxHeight = '';
      }
    });
    
    // Reduce animation complexity on mobile
    if (window.innerWidth < 768) {
      document.documentElement.style.setProperty('--ease', 'cubic-bezier(0.4, 0, 0.2, 1)');
      
      // Disable heavy 3D effects on mobile
      const tiltCards = $$('.tilt-card');
      tiltCards.forEach(card => {
        card.style.transform = 'none';
        card.style.transition = 'transform 0.3s ease';
      });
    } else {
      document.documentElement.style.setProperty('--ease', 'cubic-bezier(.23,.89,.32,1)');
    }
  }
  
  // Initialize viewport properties
  updateViewportProperties();
  
  // Throttled resize handler
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateViewportProperties();
    }, 150);
  });
  
  // Orientation change handler
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      updateViewportProperties();
    }, 100);
  });
  
  // ======================
  // HEADER SCROLL EFFECT
  // ======================
  const header = $('.site-header');
  
  function updateHeader() {
    if (!header) return;
    
    const scrolled = window.scrollY > 20;
    header.classList.toggle('is-scrolled', scrolled);
    
    // Subtle parallax effect on hero
    const hero = $('.hero');
    if (hero && window.scrollY < window.innerHeight) {
      const scrolledPercent = window.scrollY / window.innerHeight;
      hero.style.setProperty('--parallax', `${scrolledPercent * 20}px`);
    }
  }
  
  // Initial check
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  
  // ======================
  // MOBILE DRAWER
  // ======================
  const drawer = $('#navDrawer');
  const btnOpen = $('#navToggle');
  const btnClose = $('#navClose');
  const backdrop = $('.drawer-backdrop');
  const panel = $('.drawer-panel');
  
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }
  
  function lockScroll() {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (header) header.style.paddingRight = `${scrollbarWidth}px`;
  }
  
  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (header) header.style.paddingRight = '';
  }
  
  function openDrawer() {
    if (!drawer || !btnOpen) return;
    
    drawer.hidden = false;
    btnOpen.setAttribute('aria-expanded', 'true');
    btnOpen.setAttribute('aria-label', 'Cerrar menú');
    
    // Force reflow for animation
    drawer.offsetHeight;
    
    lockScroll();
    
    // Focus trap
    setTimeout(() => {
      btnClose?.focus();
    }, 100);
  }
  
  function closeDrawer() {
    if (!drawer || !btnOpen) return;
    
    drawer.hidden = true;
    btnOpen.setAttribute('aria-expanded', 'false');
    btnOpen.setAttribute('aria-label', 'Abrir menú');
    
    unlockScroll();
    
    // Return focus
    btnOpen.focus();
  }
  
  // Event listeners
  if (btnOpen) btnOpen.addEventListener('click', openDrawer);
  if (btnClose) btnClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  
  // Close on link click
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.classList.contains('drawer-link')) {
        closeDrawer();
      }
    });
  }
  
  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) {
      closeDrawer();
    }
  });
  
  // Close on resize to desktop
  const mediaQuery = window.matchMedia('(min-width: 981px)');
  
  function handleMediaChange(e) {
    if (e.matches && drawer && !drawer.hidden) {
      closeDrawer();
    }
  }
  
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMediaChange);
  } else {
    mediaQuery.addListener(handleMediaChange);
  }
  
  // Prevent panel clicks from closing drawer
  if (panel) panel.addEventListener('click', (e) => e.stopPropagation());
  
  // ======================
  // THEME TOGGLE
  // ======================
  const themeToggle = $('#themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function updateThemeIcons(theme) {
    const isLight = theme === 'light';
    $$('.i-sun').forEach(el => {
      if (el) el.style.display = isLight ? 'block' : 'none';
    });
    $$('.i-moon').forEach(el => {
      if (el) el.style.display = isLight ? 'none' : 'block';
    });
  }
  
  function setTheme(theme) {
    if (!theme || !['light', 'dark'].includes(theme)) return;
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bausen_theme', theme);
    updateThemeIcons(theme);
    
    // Update meta theme-color
    const themeColor = theme === 'dark' ? '#0b1222' : '#F8FBFF';
    const metaThemeColor = $('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  }
  
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
  
  // Initialize theme
  const savedTheme = localStorage.getItem('bausen_theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    setTheme(savedTheme);
  } else {
    setTheme(prefersDark.matches ? 'dark' : 'light');
  }
  
  // Watch for system theme changes
  if (prefersDark.addEventListener) {
    prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('bausen_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  } else {
    prefersDark.addListener((e) => {
      if (!localStorage.getItem('bausen_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  
  // ======================
  // REVEAL ANIMATIONS
  // ======================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  function initRevealAnimations() {
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      // Select elements to animate
      const revealElements = [
        ...$$('.section > .container'),
        ...$$('.glass-card'),
        ...$$('.benefit'),
        ...$$('.contact-card'),
        ...$$('.footer-grid'),
        ...$$('.section-title'),
        ...$$('.big-title'),
        ...$$('.hero-left'),
        ...$$('.hero-right'),
        ...$$('.media-card'),
        ...$$('.card-grid'),
        ...$$('.two-col')
      ].filter(el => el && el.isConnected);
      
      // Remove duplicates
      const uniqueElements = [...new Set(revealElements)];
      
      // Add reveal class with staggered delays
      uniqueElements.forEach((el, index) => {
        el.classList.add('reveal');
        
        // Calculate delay based on position and element type
        let delay = 0;
        const rect = el.getBoundingClientRect();
        const scrollPosition = window.scrollY + rect.top;
        const viewportHeight = window.innerHeight;
        
        // Elements further down get more delay
        delay = Math.min((scrollPosition / viewportHeight) * 100, 300);
        
        // Additional delay based on index for staggering
        delay += (index % 6) * 40;
        
        el.style.setProperty('--d', `${delay}ms`);
      });
      
      // Create intersection observer with mobile-optimized options
      const observerOptions = {
        threshold: window.innerWidth < 768 ? 0.1 : 0.15,
        rootMargin: window.innerWidth < 768 ? '0px 0px -5% 0px' : '0px 0px -10% 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      // Observe all reveal elements
      uniqueElements.forEach(el => observer.observe(el));
    } else {
      // Fallback: show all elements immediately
      $$('.reveal').forEach(el => {
        if (el) {
          el.classList.remove('reveal');
          el.classList.add('is-in');
        }
      });
    }
  }
  
  // ======================
  // TILT 3D EFFECT FOR CARDS
  // ======================
  function initTiltEffect() {
    if (prefersReducedMotion || window.innerWidth < 768) return;
    
    const tiltCards = $$('.glass-card, .media-card, .benefit');
    
    tiltCards.forEach(card => {
      // Add tilt class for CSS targeting
      card.classList.add('tilt-card');
      
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 2;
        const rotateX = ((centerY - y) / centerY) * 2;
        
        // Limit rotation to subtle values
        const limitedRotateY = Math.max(Math.min(rotateY, 2), -2);
        const limitedRotateX = Math.max(Math.min(rotateX, 2), -2);
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${limitedRotateX}deg)
          rotateY(${limitedRotateY}deg)
          translateZ(10px)
        `;
      };
      
      const handleMouseLeave = () => {
        card.style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          translateZ(0)
        `;
        
        // Smooth return
        card.style.transition = 'transform 0.5s var(--ease)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      };
      
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  }
  
  // ======================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ======================
  function initSmoothScroll() {
    const anchorLinks = $$('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's just "#" or external
        if (href === '#' || href.startsWith('#!') || href.startsWith('http')) return;
        
        const target = $(href);
        if (!target) return;
        
        e.preventDefault();
        
        // Calculate offset for fixed header
        const headerHeight = header?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without scrolling
        if (history.pushState) {
          history.pushState(null, null, href);
        } else {
          location.hash = href;
        }
      });
    });
  }
  
  // ======================
  // FORM ENHANCEMENTS
  // ======================
  function initFormEnhancements() {
    const form = $('.contact-card');
    if (!form) return;
    
    const inputs = $$('input, textarea', form);
    
    inputs.forEach(input => {
      // Add floating label effect
      const parent = input.closest('.field');
      if (!parent) return;
      
      const handleFocus = () => {
        parent.classList.add('is-focused');
      };
      
      const handleBlur = () => {
        if (!input.value) {
          parent.classList.remove('is-focused');
        }
      };
      
      // Check initial state
      if (input.value) {
        parent.classList.add('is-focused');
      }
      
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.parentElement.classList.add('is-invalid');
        } else {
          input.parentElement.classList.remove('is-invalid');
        }
      });
      
      if (isValid) {
        // Add loading state
        const submitBtn = $('button[type="submit"]', form);
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
          alert('Mensaje enviado con éxito. Nos pondremos en contacto pronto.');
          form.reset();
          
          // Reset form states
          $$('.field', form).forEach(field => {
            field.classList.remove('is-focused', 'is-invalid');
          });
          
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }
  
  // ======================
  // LAZY LOADING ENHANCEMENT
  // ======================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = $$('img[loading="lazy"]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load optimized image based on device
            const isMobile = window.innerWidth < 768;
            if (isMobile && img.dataset.srcMobile) {
              img.src = img.dataset.srcMobile;
            } else if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            img.classList.add('is-loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      
      lazyImages.forEach(img => {
        // Store original src in data-src if not already
        if (!img.dataset.src && img.src) {
          img.dataset.src = img.src;
          // Set placeholder
          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        }
        imageObserver.observe(img);
      });
    }
  }
  
  // ======================
  // INITIALIZE EVERYTHING
  // ======================
  function init() {
    // Initialize in order of priority
    initRevealAnimations();
    initSmoothScroll();
    initTiltEffect();
    initFormEnhancements();
    initLazyLoading();
    
    // Log initialization
    console.log('✅ Bausen Capital Humano - UI Enhancements loaded');
    console.log('📱 Viewport: ' + window.innerWidth + 'x' + window.innerHeight);
    console.log('🎨 Theme: ' + (document.documentElement.getAttribute('data-theme') || 'dark'));
    console.log('⚡ Performance: ' + (prefersReducedMotion ? 'Reduced motion' : 'Full animations'));
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose some functions for debugging if needed
  window.bausenUI = {
    updateViewportProperties,
    adjustElementSizes,
    setTheme,
    toggleTheme,
    openDrawer,
    closeDrawer
  };
})();