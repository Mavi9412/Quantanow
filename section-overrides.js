// ============================================
//  Mobile Navigation Hamburger Toggle
//  Fallback in case Webflow JS doesn't bind
// ============================================
(function () {
    var menuBtn = document.querySelector('.w-nav-button, .menu-button');
    var navMenu = document.querySelector('.w-nav-menu');
    var navbar  = document.querySelector('.black-navbar');

    if (!menuBtn || !navMenu || !navbar) return;

    function openMenu() {
        navMenu.classList.add('w--open', 'active');
        menuBtn.classList.add('w--open');
        menuBtn.setAttribute('aria-expanded', 'true');
        navbar.style.zIndex = '1000';
    }

    function closeMenu() {
        navMenu.classList.remove('w--open', 'active');
        menuBtn.classList.remove('w--open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = navMenu.classList.contains('w--open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
            closeMenu();
        }
    });

    // Close when a nav link is tapped
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
})();

// ============================================
//  Section Overrides — Scroll-to-Top Button
// ============================================

(function () {
    // Inject button
    var btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '&#8679;';
    document.body.appendChild(btn);

    // Show / hide on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    // Smooth scroll on click
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // Process Page Redesign - Timeline Scroll Spy
    // ============================================
    const timelineSteps = document.querySelectorAll('.timeline-step');
    if (timelineSteps.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    // entry.target.classList.remove('active'); // Keep it active once scrolled
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -25% 0px', // Trigger when step is 25% up from bottom
            threshold: 0.1
        });

        timelineSteps.forEach(step => observer.observe(step));
    }
})();
