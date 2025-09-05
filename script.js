/*
 * Balatzis Katerini - Optimized Mobile-First JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // DOM Elements
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.querySelector('.back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const contactForm = document.getElementById('contactForm');

    // Hero Slider Elements
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroNavDots = document.querySelectorAll('.hero-nav-dot');

    // Statistics Elements
    const statNumbers = document.querySelectorAll('.stat-number');

    // Current states
    let currentSlide = 0;
    let sliderInterval;
    let statsAnimated = false;

    // Initialize functions
    initHeroSlider();
    initScrollBehavior();

    // ===== Header Scroll Behavior =====
    function initScrollBehavior() {
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    }

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header sticky behavior
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTopBtn?.classList.add('visible');
        } else {
            backToTopBtn?.classList.remove('visible');
        }

        // Animate statistics when in view (once)
        if (!statsAnimated && statNumbers.length) {
            const statsSection = document.querySelector('.stats-section');
            if (statsSection && isElementInView(statsSection)) {
                animateStatistics();
                statsAnimated = true;
            }
        }
    }

    // ===== Hero Slider Functions =====
    function initHeroSlider() {
        if (!heroSlides.length) return;

        startSlider();

        // Navigation dots
        heroNavDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetSliderInterval();
            });
        });

        // Pause on hover (desktop only)
        if (window.innerWidth > 768) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.addEventListener('mouseenter', () => clearInterval(sliderInterval));
                heroSection.addEventListener('mouseleave', startSlider);
            }
        }

        // Touch support for mobile
        let startX = 0;
        let startY = 0;
        const heroSection = document.querySelector('.hero');

        if (heroSection && 'ontouchstart' in window) {
            heroSection.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            heroSection.addEventListener('touchend', (e) => {
                if (!startX || !startY) return;

                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;

                // Only swipe horizontally if vertical movement is minimal
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        goToNextSlide();
                    } else {
                        goToPrevSlide();
                    }
                    resetSliderInterval();
                }

                startX = 0;
                startY = 0;
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevSlide();
                resetSliderInterval();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
                resetSliderInterval();
            }
        });
    }

    function startSlider() {
        sliderInterval = setInterval(goToNextSlide, 5000);
    }

    function resetSliderInterval() {
        clearInterval(sliderInterval);
        startSlider();
    }

    function goToSlide(slideIndex) {
        if (!heroSlides[currentSlide] || !heroNavDots[currentSlide]) return;

        heroSlides[currentSlide].classList.remove('active');
        heroNavDots[currentSlide].classList.remove('active');

        currentSlide = slideIndex;

        heroSlides[currentSlide].classList.add('active');
        heroNavDots[currentSlide].classList.add('active');
    }

    function goToNextSlide() {
        const nextSlide = (currentSlide + 1) % heroSlides.length;
        goToSlide(nextSlide);
    }

    function goToPrevSlide() {
        const prevSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        goToSlide(prevSlide);
    }

    // ===== Statistics Animation =====
    function animateStatistics() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target')) || 0;
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };

            updateCount();
        });
    }

    // ===== Mobile Menu =====
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header?.offsetHeight || 60;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                updateActiveNavLink(targetId);
            }
        });
    });

    function updateActiveNavLink(targetId) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // ===== Back to Top Button =====
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== Product Filtering =====
    if (filterBtns.length > 0 && productCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                filterProducts(filterValue);
            });
        });
    }

    function filterProducts(filterValue) {
        let visibleCount = 0;

        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || category === filterValue;

            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50 * visibleCount);

                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
    }

    // ===== Contact Form =====
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                subject: document.getElementById('subject')?.value || '',
                message: document.getElementById('message')?.value || ''
            };

            if (!validateContactForm(formData)) {
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Αποστολή...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                showNotification('Ευχαριστούμε για το μήνυμά σας! Θα επικοινωνήσουμε μαζί σας σύντομα.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ===== Form Validation =====
    function validateContactForm(data) {
        const errors = [];

        if (!data.name.trim()) {
            errors.push('Το ονοματεπώνυμο είναι υποχρεωτικό.');
        }

        if (!validateEmail(data.email)) {
            errors.push('Παρακαλώ εισάγετε ένα έγκυρο email.');
        }

        if (!data.subject) {
            errors.push('Παρακαλώ επιλέξτε ένα θέμα.');
        }

        if (!data.message.trim() || data.message.length < 10) {
            errors.push('Το μήνυμα πρέπει να έχει τουλάχιστον 10 χαρακτήρες.');
        }

        if (errors.length > 0) {
            showNotification(errors.join(' '), 'error');
            return false;
        }

        return true;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== Notification System =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => {
            notif.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Κλείσιμο">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                closeNotification(notification);
            }
        }, 4000);
    }

    function closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    // ===== Utility Functions =====
    function isElementInView(element, offset = 100) {
        const rect = element.getBoundingClientRect();
        return rect.top < (window.innerHeight - offset);
    }

    // ===== Page Visibility API =====
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(sliderInterval);
        } else if (heroSlides.length) {
            startSlider();
        }
    });

    // ===== Resize Handler =====
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navLinks?.classList.contains('active')) {
                mobileMenuToggle?.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }, 250);
    });

    // ===== Add notification styles =====
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            left: 20px;
            max-width: 400px;
            margin-left: auto;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            padding: var(--spacing-md);
            transform: translateY(-100px);
            opacity: 0;
            transition: all var(--transition-normal);
            z-index: 9999;
            border-left: 4px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing-sm);
        }
        
        @media (min-width: 768px) {
            .notification {
                left: auto;
                right: 20px;
                max-width: 350px;
                transform: translateX(100%);
            }
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        @media (min-width: 768px) {
            .notification.show {
                transform: translateX(0);
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            flex: 1;
        }
        
        .notification-content i {
            font-size: var(--text-lg);
            color: var(--accent);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: var(--text-md);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--radius-sm);
            transition: all var(--transition-fast);
        }
        
        .notification-close:hover {
            color: var(--text-primary);
            background-color: var(--bg-secondary);
        }
        
        .notification.success {
            border-left-color: #22C55E;
        }
        
        .notification.success .notification-content i {
            color: #22C55E;
        }
        
        .notification.error {
            border-left-color: #EF4444;
        }
        
        .notification.error .notification-content i {
            color: #EF4444;
        }
    `;

    // Add styles to document
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);

    console.log('Balatzis Katerini website initialized successfully!');
});