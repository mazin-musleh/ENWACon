(() => {
    'use strict';

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

// Agenda Accordion Toggle
document.addEventListener('DOMContentLoaded', function () {
    const agendaDays = document.querySelectorAll('.agenda-day');

    agendaDays.forEach(agendaDay => {
        const header = agendaDay.querySelector('h3');

        header.addEventListener('click', () => {
            agendaDay.classList.toggle('expanded');
        });
    });
});

// Performance optimization: Throttle function
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Header Scroll Effect
const header = document.getElementById('header');
// Cache glassy sections to avoid repeated DOM queries
const glassySections = document.querySelectorAll('.glassy-section');

function updateHeaderStyle() {
    const scrollY = window.scrollY;
    const headerHeight = header.offsetHeight;

    // Check if entire header is within any glassy section
    let isInGlassySection = false;

    glassySections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();
        // Header is fully within section when section top is above header and section bottom is below header
        const isFullyInSection = sectionRect.top <= 0 && sectionRect.bottom >= headerHeight;

        if (isFullyInSection) {
            isInGlassySection = true;
        }
    });

    if (isInGlassySection) {
        header.classList.add('glassy');
        header.classList.remove('scrolled');
    } else if (scrollY > 100) {
        header.classList.add('scrolled');
        header.classList.remove('glassy');
    } else {
        header.classList.remove('scrolled', 'glassy');
    }
}

// Apply throttling to scroll events (~60fps)
if (header) {
    window.addEventListener('scroll', throttle(updateHeaderStyle, 4), { passive: true });
    window.addEventListener('resize', throttle(updateHeaderStyle, 100), { passive: true });
    updateHeaderStyle(); // Initial call
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight + 80;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
    }
});

// Form Validation (if registration form is added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Testimonials Carousel
const track = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');

if (track && prevBtn && nextBtn && indicators.length > 0) {
    let currentSlide = 0;
    const totalSlides = 4;

function updateCarousel() {
    const translateX = currentSlide * 100;
    track.style.transform = `translateX(${translateX}%)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });

    // Update button states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
    }
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

// Initialize carousel
updateCarousel();

// Touch/Swipe functionality
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
let startTransform = 0;
const maxVerticalDistance = 100; // Maximum vertical movement to still count as horizontal swipe
const slideWidth = track.offsetWidth; // Get slide width

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = false;

    // Immediately disable transitions for instant responsiveness
    track.style.transition = 'none';

    // Store current transform value (positive to match updateCarousel)
    startTransform = currentSlide * 100;
}

function handleTouchMove(e) {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const deltaX = touchCurrentX - touchStartX;
    const deltaY = Math.abs(touchCurrentY - touchStartY);

    // Check if it's a horizontal swipe (not vertical scroll) - reduced threshold for quicker response
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 3) {
        isDragging = true;
        e.preventDefault();

        // Calculate the drag percentage
        const dragPercentage = (deltaX / slideWidth) * 100;
        const newTransform = startTransform + dragPercentage;

        // Allow free dragging with some resistance at boundaries
        let finalTransform = newTransform;

        // Add resistance at boundaries but still allow dragging
        const minTransform = 0; // First slide
        const maxTransform = (totalSlides - 1) * 100; // Last slide

        if (newTransform < minTransform) {
            // Dragging beyond first slide - add resistance
            const overDrag = minTransform - newTransform;
            finalTransform = minTransform - (overDrag * 0.3);
        } else if (newTransform > maxTransform) {
            // Dragging beyond last slide - add resistance
            const overDrag = newTransform - maxTransform;
            finalTransform = maxTransform + (overDrag * 0.3);
        }

        // Apply the transform in real-time
        track.style.transform = `translateX(${finalTransform}%)`;
    }
}

function handleTouchEnd(e) {
    if (!isDragging) {
        // Re-enable transitions
        track.style.transition = 'transform var(--transition-normal)';
        return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const dragPercentage = Math.abs(deltaX) / slideWidth;

    // Re-enable transitions for smooth snapping
    track.style.transition = 'transform var(--transition-normal)';

    // Determine if we should snap to next/previous slide
    if (dragPercentage > 0.10) {
        // Moved more than 10% of slide width
        if (deltaX > 0 && currentSlide < totalSlides - 1) {
            // Swiped right, go to next slide
            nextSlide();
        } else if (deltaX < 0 && currentSlide > 0) {
            // Swiped left, go to previous slide
            prevSlide();
        } else {
            // At boundary, snap back to current slide
            updateCarousel();
        }
    } else {
        // Moved less than 50%, snap back to current slide
        updateCarousel();
    }

    isDragging = false;
}

    // Add touch event listeners to the carousel
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// Canvas Dots Animation
const canvas = document.getElementById('dotsCanvas');

if (canvas) {
    const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = Math.floor(cssW * DPR);
    canvas.height = Math.floor(cssH * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', throttle(resizeCanvas, 100), { passive: true });
resizeCanvas();

// Generate random dots based on screen size
function getDotCount() {
    const width = window.innerWidth;
    if (width < 480) return 15;  // Mobile phones
    if (width < 768) return 25;  // Tablets
    return 40;  // Desktop
}

// Reusable function to create a dot with consistent properties
function createDot(W, H) {
    return {
        x: Math.random() * W,
        y: Math.random() * H,
        radius: 2 + Math.random() * 4,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        curveRadius: 20 + Math.random() * 40,
        opacity: 0.1 + Math.random() * 0.3,
        color: Math.random() > 0.7 ? 'rgba(244, 199, 79,' : 'rgba(255, 255, 255,'
    };
}

let dotCount = getDotCount();
const W = canvas.width / (window.devicePixelRatio || 1);
const H = canvas.height / (window.devicePixelRatio || 1);
const dots = Array.from({ length: dotCount }, () => createDot(W, H));

let isHeroVisible = true;
let animationFrameId;

// Check if Intersection Observer is supported
if ('IntersectionObserver' in window) {
    // Observer to check if hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isHeroVisible = entry.isIntersecting;
            if (!isHeroVisible && animationFrameId) {
                // Clear canvas when hero is not visible
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    }, {
        threshold: 0.1
    });

    // Start observing all hero sections
    const heroSections = document.querySelectorAll('.hero');
    heroSections.forEach(section => {
        heroObserver.observe(section);
    });
} else {
    // Fallback for older browsers: animation always runs
    console.log('Intersection Observer not supported, dots animation will always run');
    isHeroVisible = true;
}

function drawDots() {
    // Only animate if hero section is visible
    if (isHeroVisible) {
        const W = canvas.width / (window.devicePixelRatio || 1);
        const H = canvas.height / (window.devicePixelRatio || 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            // Update angle for curved motion
            dot.angle += dot.rotationSpeed;

            // Combine linear and curved motion
            dot.x += dot.speedX + Math.cos(dot.angle) * 0.15;
            dot.y += dot.speedY + Math.sin(dot.angle) * 0.15;

            // Wrap around edges instead of bouncing
            if (dot.x < 0) dot.x = W;
            if (dot.x > W) dot.x = 0;
            if (dot.y < 0) dot.y = H;
            if (dot.y > H) dot.y = 0;

            // Draw dot
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = dot.color + dot.opacity + ')';
            ctx.fill();
        });
    }

    animationFrameId = requestAnimationFrame(drawDots);
}

drawDots();

// Update dots array when canvas resizes
window.addEventListener('resize', () => {
    const W = canvas.width / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);

    // Adjust dot count for new screen size
    const newDotCount = getDotCount();
    if (newDotCount !== dotCount) {
        dotCount = newDotCount;
        // Add or remove dots
        if (dots.length < dotCount) {
            // Add more dots
            while (dots.length < dotCount) {
                dots.push(createDot(W, H));
            }
        } else if (dots.length > dotCount) {
            // Remove excess dots
            dots.splice(dotCount);
        }
    }

    // Keep existing dots within bounds
    dots.forEach(dot => {
        if (dot.x > W) dot.x = W;
        if (dot.y > H) dot.y = H;
    });
});
}

// Scroll to Top functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    function toggleScrollToTopBtn() {
        if (window.pageYOffset > 1000) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners
    window.addEventListener('scroll', toggleScrollToTopBtn);
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // Initial check
    toggleScrollToTopBtn();
}

// Lazy loading for background images (exclude parallax elements)
const lazyBackgrounds = document.querySelectorAll('.lazy-bg:not(.parallax-bg)');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            observer.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '500px 0px',
    threshold: 0.1
});

lazyBackgrounds.forEach(bg => {
    imageObserver.observe(bg);
});

// Parallax effect for background images
function initParallax() {
    // Prevent multiple initializations
    if (window.parallaxInitialized) {
        return;
    }
    window.parallaxInitialized = true;

    const parallaxElements = document.querySelectorAll('.parallax-bg');

    if (parallaxElements.length === 0) return;

    // Simple IntersectionObserver for parallax loading
    const parallaxObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const bgImage = element.getAttribute('data-bg');

                if (bgImage) {
                    observer.unobserve(element);

                    // Set background directly - CSS will handle image loading
                    element.style.background = `var(--bg-gradient), url('${bgImage}') center/cover no-repeat`;
                    element.classList.add('loaded');
                }
            }
        });
    }, {
        rootMargin: '500px 0px',
        threshold: 0.1
    });

    // Observe parallax elements
    parallaxElements.forEach(element => {
        parallaxObserver.observe(element);
    });

    let ticking = false;

    function updateParallax() {
        parallaxElements.forEach(element => {
            // Only animate if loaded
            if (!element.classList.contains('loaded')) return;

            const rect = element.parentElement.getBoundingClientRect();
            const speed = 0.5; // Increased speed for more visible effect

            // Only animate when section is in viewport
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(rect.top * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Initial update
    updateParallax();
}

    // Initialize parallax when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParallax);
    } else {
        initParallax();
    }
})();