document.addEventListener('DOMContentLoaded', () => {


    // Smooth scroll library removed — using native browser scrolling for speed.

    
    // --- 1. Mobile Navigation Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close mobile menu when a link is clicked
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 2. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- 3. Intersection Observer for Fade-in Animations ---
    const faders = document.querySelectorAll('.fade-in, .fade-in-up, .reveal-up, .reveal-icon, .premium-hero-up');
    
    const appearOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                // Stop observing once animated
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- 3b. Expertise section — sequential scroll reveal ---
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceReveal = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    serviceItems.forEach(item => serviceReveal.observe(item));

    // --- 3c. Portfolio carousel — panel scroll reveal ---
    const portfolioPanels = document.querySelectorAll('.portfolio-panel');
    const panelReveal = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    portfolioPanels.forEach(p => {
        if (window.innerWidth > 768) {
            panelReveal.observe(p);
        } else {
            // Force classes immediately on mobile to avoid flash of hidden content
            p.classList.add('is-visible');
        }
    });

    // --- 3d. Portfolio carousel — native CSS scroll ---
    // (JS scroll logic removed in favor of native overflow-x for stability)

    // Hero animations are now handled via CSS @keyframes with --delay variables.

    // --- 4. Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 5. Dynamic Year for Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Custom cursor removed — using default system cursor for speed and accessibility.

    // --- 6. Mobile Services Accordion Toggle ---
    const serviceHeaders = document.querySelectorAll('.service-header');
    serviceHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Only execute if we are on mobile/tablet (using same breakpoint as CSS 1024px)
            if (window.innerWidth <= 1024) {
                const item = header.closest('.service-item');
                
                // Optional: Close other open accordions for a cleaner list feel
                const currentlyOpen = document.querySelector('.service-item.is-open');
                if (currentlyOpen && currentlyOpen !== item) {
                    currentlyOpen.classList.remove('is-open');
                }
                
                item.classList.toggle('is-open');
            }
        });
    });

    // --- 7. Bilingual Language Toggle ---
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en][data-es]');
    
    // Check local storage for saved language or default to 'es'
    let currentLang = localStorage.getItem('portfolio_lang') || 'es';
    
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        
        // Update active button state
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update text content for all translatable elements
        translatableElements.forEach(el => {
            const newText = el.getAttribute(`data-${lang}`);
            if (newText) {
                // Using innerHTML safely to allow tags like <br> or <em> inside translations
                el.innerHTML = newText;
            }
        });
        
        // Update document lang attribute
        document.documentElement.lang = lang;
    }

    
    // Initialize language on load
    if (translatableElements.length > 0) {
        setLanguage(currentLang);
        
        // Add click listeners to toggle buttons
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang && lang !== currentLang) {
                    setLanguage(lang);
                }
            });
        });
    }

    // --- Hero 3D Artwork Mouse Parallax ---
    const heroEl = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual-col');

    if (heroEl && heroVisual && window.innerWidth > 768) {
        let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
        const maxShift = 10; // px — very subtle
        const maxRotate = 1.5; // degrees — barely perceptible

        heroEl.addEventListener('mousemove', (e) => {
            const rect = heroEl.getBoundingClientRect();
            // Normalize mouse position to -1…1 from center of hero
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            targetX = nx * maxShift;
            targetY = ny * maxShift;
        });

        heroEl.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });

        // Smooth interpolation loop (lerp) — 60fps, GPU-friendly
        function animateParallax() {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            const rotY = (currentX / maxShift) * maxRotate;
            const rotX = -(currentY / maxShift) * maxRotate;
            heroVisual.style.transform = `translate(${currentX}px, ${currentY}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            requestAnimationFrame(animateParallax);
        }

        // Respect reduced motion preference
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestAnimationFrame(animateParallax);
        }
    }

    // --- 8. Auto-scrolling Post Carousel ---
    const ecoTrack = document.querySelector('.eco-track');
    if (ecoTrack && ecoTrack.children.length > 0) {
        let ecoIndex = 0;
        let ecoInterval;

        function autoSlideEco() {
            const gap = parseFloat(getComputedStyle(ecoTrack).gap) || 0;
            const slideWidth = ecoTrack.children[0].offsetWidth + gap;
            ecoIndex = (ecoIndex + 1) % ecoTrack.children.length;
            ecoTrack.scrollTo({ left: ecoIndex * slideWidth, behavior: 'smooth' });
        }

        function startEcoAutoSlide() {
            // Clear any existing interval to prevent overlap
            clearInterval(ecoInterval);
            ecoInterval = setInterval(autoSlideEco, 4000);
        }

        function stopEcoAutoSlide() {
            clearInterval(ecoInterval);
        }

        startEcoAutoSlide();

        // Pause on interaction
        ecoTrack.addEventListener('mouseenter', stopEcoAutoSlide);
        ecoTrack.addEventListener('mouseleave', startEcoAutoSlide);
        ecoTrack.addEventListener('touchstart', stopEcoAutoSlide, {passive: true});
        ecoTrack.addEventListener('touchend', startEcoAutoSlide);
        
        // Sync index closely with manual scrolling
        ecoTrack.addEventListener('scroll', () => {
            const gap = parseFloat(getComputedStyle(ecoTrack).gap) || 0;
            const slideWidth = ecoTrack.children[0].offsetWidth + gap;
            if (slideWidth > 0) {
                ecoIndex = Math.round(ecoTrack.scrollLeft / slideWidth);
            }
        }, {passive: true});
    }
});

// Hero video fade-in
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
    const onReady = () => heroVideo.classList.add('loaded');
    if (heroVideo.readyState >= 3) {
        onReady();
    } else {
        heroVideo.addEventListener('canplay', onReady, { once: true });
    }
}
