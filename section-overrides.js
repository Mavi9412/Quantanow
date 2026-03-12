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
