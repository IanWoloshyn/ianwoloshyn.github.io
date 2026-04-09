/**
 * Ian Woloshyn Portfolio - Main JavaScript
 * Handles navigation, scroll animations, code toggles, and interactions
 */

(function() {
    'use strict';

    // ============================================
    // 1. Navigation Functionality
    // ============================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinkElements.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Active section detection on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);

    // ============================================
    // 2. Scroll-Triggered Section Animations
    // ============================================

    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections except hero
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    // ============================================
    // 3. Code Toggle Functionality
    // ============================================

    const codeToggles = document.querySelectorAll('.code-toggle');
    
    codeToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const codeSection = document.getElementById(targetId);
            
            if (codeSection) {
                this.classList.toggle('active');
                codeSection.classList.toggle('active');
                
                // Update button text
                const isActive = codeSection.classList.contains('active');
                const buttonText = this.childNodes[0];
                if (buttonText && buttonText.nodeType === Node.TEXT_NODE) {
                    buttonText.textContent = isActive ? 'Hide Code ' : 'View VHDL Code ';
                }
            }
        });
    });

    // ============================================
    // 4. Code Tab Switching
    // ============================================

    const codeTabs = document.querySelectorAll('.code-tab');
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const parentSection = this.closest('.code-section');
            
            if (parentSection) {
                // Remove active from all tabs in this section
                parentSection.querySelectorAll('.code-tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // Remove active from all content in this section
                parentSection.querySelectorAll('.code-content').forEach(c => {
                    c.classList.remove('active');
                });
                
                // Activate clicked tab
                this.classList.add('active');
                
                // Activate corresponding content
                const content = document.getElementById(tabId);
                if (content) {
                    content.classList.add('active');
                }
            }
        });
    });

    // ============================================
    // 5. Back to Top Button
    // ============================================

    const backToTopButton = document.getElementById('backToTop');
    
    function updateBackToTopButton() {
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : 800;
        
        if (window.scrollY > heroHeight) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', updateBackToTopButton);
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // 6. Smooth Scroll for Anchor Links
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 64;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 7. Project Card Hover Effects
    // ============================================

    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle parallax effect to tech badges
            const badges = this.querySelectorAll('.tech-badge');
            badges.forEach((badge, index) => {
                badge.style.transitionDelay = `${index * 20}ms`;
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const badges = this.querySelectorAll('.tech-badge');
            badges.forEach(badge => {
                badge.style.transitionDelay = '0ms';
            });
        });
    });

    // ============================================
    // 8. Initialize on DOM Load
    // ============================================

    function init() {
        // Initial checks
        updateActiveNavLink();
        updateBackToTopButton();
        
        // Add visible class to hero section immediately
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.classList.add('visible');
        }
        
        // Initialize first code tab in each section
        document.querySelectorAll('.code-section').forEach(section => {
            const firstTab = section.querySelector('.code-tab');
            const firstContent = section.querySelector('.code-content');
            if (firstTab) firstTab.classList.add('active');
            if (firstContent) firstContent.classList.add('active');
        });
        
        console.log('Portfolio initialized successfully');
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // Code Annotation Tooltips
    // ============================================
    const caTooltip = document.createElement('div');
    caTooltip.style.cssText = 'position:fixed;background:#1a1a2e;border:1px solid #333;color:#e5e7eb;padding:8px 12px;border-radius:6px;font-size:12px;line-height:1.5;max-width:280px;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.15s;font-family:system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.4);';
    document.body.appendChild(caTooltip);

    function positionCaTooltip(e) {
        const tw = caTooltip.offsetWidth;
        const th = caTooltip.offsetHeight;
        let left = e.clientX + 14;
        let top = e.clientY - th - 10;
        if (left + tw > window.innerWidth - 10) left = e.clientX - tw - 14;
        if (top < 10) top = e.clientY + 20;
        caTooltip.style.left = left + 'px';
        caTooltip.style.top = top + 'px';
    }

    document.querySelectorAll('.ca[data-tooltip]').forEach(function(el) {
        el.addEventListener('mouseenter', function(e) {
            caTooltip.textContent = this.dataset.tooltip;
            caTooltip.style.opacity = '1';
            positionCaTooltip(e);
        });
        el.addEventListener('mousemove', positionCaTooltip);
        el.addEventListener('mouseleave', function() {
            caTooltip.style.opacity = '0';
        });
    });

})();
