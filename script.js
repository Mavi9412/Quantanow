// DOM elements — targeting Webflow's actual class-based selectors
const navbar = document.querySelector('.black-navbar');
const navToggle = document.querySelector('.menu-button');
const navMenu = document.querySelector('.w-nav-menu');
const newsletterForm = document.querySelector('#email-form-2');

// Mobile navigation — state-based toggle (mirrors React useState pattern)
let isOpen = false;

const setIsOpen = (val) => {
    isOpen = val;

    if (isOpen) {
        // {isOpen && <div style={{...}}>} — apply fullscreen overlay
        navMenu.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background-color: white',
            'z-index: 9998',
            'display: flex',
            'flex-direction: column',
            'align-items: center',
            'justify-content: center',
            'gap: 24px',
        ].join(';');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    } else {
        // {!isOpen} — remove overlay, restore default hidden state
        navMenu.removeAttribute('style');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
};

// Hamburger button onClick + onTouchEnd — handles both mouse and real touch devices
navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
});

navToggle?.addEventListener('touchend', (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
});

// Close when a nav link is clicked
document.querySelectorAll('.nav-link, .black-nav-links').forEach(link => {
    link.addEventListener('click', () => setIsOpen(false));
});

// Close when clicking outside the menu
document.addEventListener('click', (e) => {
    if (isOpen && navMenu && navToggle) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            setIsOpen(false);
        }
    }
});

// Navbar scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for backdrop effect
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const targetPosition = target.offsetTop - 80; // Account for navbar height
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Handle counter animations for stats
            if (entry.target.hasAttribute('data-count')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.service-card, .process-step, .stat-card, .feature-card, .testimonial-card, .industry-card'
    );
    
    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        // Add staggered delay for groups
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Observe stat counters
    document.querySelectorAll('[data-count]').forEach(counter => {
        observer.observe(counter);
    });
});

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 16);
}

// Newsletter form handling
newsletterForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    const button = this.querySelector('button');
    const originalText = button.textContent;
    
    // Simple email validation
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Subscribed!';
        this.querySelector('input[type="email"]').value = '';
        showNotification('Thank you for subscribing!', 'success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }, 1500);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00E887' : type === 'error' ? '#ef4444' : '#2563EB'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Parallax effect for hero orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta, .hero-stats');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
});

// Dynamic copyright year
document.addEventListener('DOMContentLoaded', () => {
    const copyrightElement = document.querySelector('.footer-copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.textContent = `© ${currentYear} QuantaNow. All rights reserved.`;
    }
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Process step hover effects
document.querySelectorAll('.process-step').forEach(step => {
    step.addEventListener('mouseenter', function() {
        const stepNumber = this.querySelector('.step-number');
        if (stepNumber) {
            stepNumber.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });
    
    step.addEventListener('mouseleave', function() {
        const stepNumber = this.querySelector('.step-number');
        if (stepNumber) {
            stepNumber.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Floating cards animation
document.querySelector('.floating-card')?.classList.add('animate-float');

// Add subtle mouse move parallax
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.tech-shapes .shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 2;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Progress bar animation on scroll
const progressBars = document.querySelectorAll('.progress-fill');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.style.width || '85%';
            entry.target.style.animation = 'progressFill 2s ease-out';
        }
    });
});

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// Lazy loading for performance
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            ripple.remove();
        });
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Your scroll handling code here
    const scrolled = window.pageYOffset;
    // Update any scroll-dependent animations
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Focus styles are handled via :focus-visible in styles.css — no JS needed.

// Console message for developers
console.log(`
    🚀 QuantaNow Website
    
    Built with modern web technologies:
    • Semantic HTML5
    • Modern CSS with Grid & Flexbox
    • Vanilla JavaScript
    • Progressive Enhancement
    • Performance Optimized
    
    For inquiries: hello@quantanow.com
`);

// Add preloader if needed
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 300);
        }, 1000);
    }
});

// Service Worker: disabled — no sw.js present in this project
// Uncomment and add sw.js before enabling PWA mode.