/*
 * Balatzis Katerini - Eltrak-Style Modern Website JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // DOM Elements
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.querySelector('.back-to-top');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const fontSizeUp = document.querySelector('.font-size-up');
    const fontSizeDown = document.querySelector('.font-size-down');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Hero Slider Elements
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroNavDots = document.querySelectorAll('.hero-nav-dot');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');

    // Statistics Elements
    const statNumbers = document.querySelectorAll('.stat-number');

    // Search Elements
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    // Current states
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    let currentSlide = 0;
    let sliderInterval;
    let statsAnimated = false;

    // Initialize all functions
    initTheme();
    initFontSize();
    initHeroSlider();
    initScrollAnimations();
    initMegaMenus();
    initSearch();

    // ===== Header Scroll Behavior =====
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

        // Header sticky behavior
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Animate statistics when in view
        if (!statsAnimated) {
            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                const rect = statsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    animateStatistics();
                    statsAnimated = true;
                }
            }
        }
    });

    // ===== Hero Slider Functions =====
    function initHeroSlider() {
        if (!heroSlides.length) return;

        // Auto-play slider
        startSlider();

        // Navigation dots
        heroNavDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetSliderInterval();
            });
        });

        // Arrow navigation
        if (heroPrev) {
            heroPrev.addEventListener('click', () => {
                goToPrevSlide();
                resetSliderInterval();
            });
        }

        if (heroNext) {
            heroNext.addEventListener('click', () => {
                goToNextSlide();
                resetSliderInterval();
            });
        }

        // Pause on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                clearInterval(sliderInterval);
            });

            heroSection.addEventListener('mouseleave', () => {
                startSlider();
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
        sliderInterval = setInterval(goToNextSlide, 6000);
    }

    function resetSliderInterval() {
        clearInterval(sliderInterval);
        startSlider();
    }

    function goToSlide(slideIndex) {
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
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
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
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');

            // Close mega menus when mobile menu opens
            closeMegaMenus();
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close for mega-menu parent links
            if (!this.parentElement.classList.contains('nav-item')) {
                mobileMenuToggle?.classList.remove('active');
                navLinks?.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // ===== Mega Menu Functionality =====
    function initMegaMenus() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const megaMenu = item.querySelector('.mega-menu');
            if (!megaMenu) return;

            let hoverTimeout;

            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                closeMegaMenus();
                megaMenu.style.display = 'block';
                setTimeout(() => {
                    megaMenu.classList.add('active');
                }, 10);
            });

            item.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    megaMenu.classList.remove('active');
                    setTimeout(() => {
                        if (!megaMenu.classList.contains('active')) {
                            megaMenu.style.display = 'none';
                        }
                    }, 300);
                }, 100);
            });
        });

        // Close mega menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item')) {
                closeMegaMenus();
            }
        });
    }

    function closeMegaMenus() {
        document.querySelectorAll('.mega-menu').forEach(menu => {
            menu.classList.remove('active');
            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        });
    }

    // ===== Search Functionality =====
    function initSearch() {
        if (!searchBtn || !searchInput) return;

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        // Search suggestions (basic implementation)
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                // Here you would implement search suggestions
                console.log('Searching for:', query);
            }
        });
    }

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Implement search functionality
            console.log('Performing search for:', query);
            // You could redirect to a search results page or filter current content
        }
    }

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight + 20; // Extra padding
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
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

    // ===== Theme Toggle =====
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }

    function initTheme() {
        if (currentTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        } else {
            document.body.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    }

    function toggleTheme() {
        if (currentTheme === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            currentTheme = 'dark';
            if (themeIcon) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        } else {
            document.body.removeAttribute('data-theme');
            currentTheme = 'light';
            if (themeIcon) {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }

        localStorage.setItem('theme', currentTheme);
    }

    // ===== Font Size Controls =====
    if (fontSizeUp) {
        fontSizeUp.addEventListener('click', function() {
            changeFontSize(1);
        });
    }

    if (fontSizeDown) {
        fontSizeDown.addEventListener('click', function() {
            changeFontSize(-1);
        });
    }

    function initFontSize() {
        document.documentElement.style.fontSize = currentFontSize + 'px';
    }

    function changeFontSize(delta) {
        // Limit font size range (12px to 20px)
        if (currentFontSize + delta < 12 || currentFontSize + delta > 20) return;

        currentFontSize += delta;
        document.documentElement.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('fontSize', currentFontSize);

        showNotification(`Μέγεθος γραμματοσειράς: ${currentFontSize}px`, 'info');
    }

    // ===== Product Filtering (Enhanced) =====
    if (filterBtns.length > 0 && productCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
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
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 + visibleCount * 50); // Staggered animation

                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Update results count (you could add a counter element)
        console.log(`Showing ${visibleCount} products`);
    }

    // ===== Load More Products =====
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more products
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Φορτώνει...';

            setTimeout(() => {
                // Add more products or show message
                this.innerHTML = '<span>Όλα τα προϊόντα φορτώθηκαν</span> <i class="fas fa-check"></i>';
                this.disabled = true;
                this.classList.add('disabled');
            }, 1500);
        });
    }

    // ===== Form Submissions =====

    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validate form
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
            }, 2000);
        });
    }

    // Newsletter Form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('.newsletter-input').value;

            if (!validateEmail(email)) {
                showNotification('Παρακαλώ εισάγετε ένα έγκυρο email.', 'error');
                return;
            }

            const btn = this.querySelector('.newsletter-btn');
            const originalContent = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                showNotification('Επιτυχής εγγραφή στο newsletter!', 'success');
                this.reset();
                btn.innerHTML = originalContent;
                btn.disabled = false;
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

    // ===== Scroll Animations =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

        // Initial check on page load
        checkVisibility(animatedElements);

        // Check on scroll with throttling
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkVisibility(animatedElements);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    function checkVisibility(elements) {
        const windowHeight = window.innerHeight;
        const offset = 100;

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;

            if (elementPosition < windowHeight - offset) {
                element.classList.add('in-view');
            }
        });
    }

    // ===== Intersection Observer for Better Performance =====
    if (window.IntersectionObserver) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
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
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                closeNotification(notification);
            }
        }, 5000);
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
            case 'warning': return 'fa-exclamation-circle';
            default: return 'fa-info-circle';
        }
    }

    // ===== Lazy Loading Images =====
    if (window.IntersectionObserver) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== Keyboard Accessibility =====
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals, mega menus, etc.
        if (e.key === 'Escape') {
            closeMegaMenus();

            // Close mobile menu if open
            if (navLinks?.classList.contains('active')) {
                mobileMenuToggle?.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }

        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // ===== Performance Monitoring =====
    if (window.performance && window.performance.mark) {
        window.performance.mark('balatzis-js-loaded');
    }

    // ===== Error Handling =====
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // You could send this to an error tracking service
    });

    // ===== Analytics Integration Point =====
    function trackEvent(category, action, label) {
        // Integrate with Google Analytics, Meta Pixel, etc.
        console.log('Event:', category, action, label);

        // Example Google Analytics 4 event
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Track important interactions
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Products', 'Filter', btn.getAttribute('data-filter'));
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('Contact', 'Form Submit', 'Contact Form');
        });
    }

    // ===== Page Visibility API =====
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause animations
            clearInterval(sliderInterval);
        } else {
            // Page is visible, resume animations
            if (heroSlides.length) {
                startSlider();
            }
        }
    });

    // ===== Initialize Complete =====
    console.log('Balatzis Katerini website initialized successfully!');

    // Show a subtle initialization complete indicator
    setTimeout(() => {
        document.body.classList.add('js-loaded');
    }, 100);

    // ===== Print Styles Handler =====
    window.addEventListener('beforeprint', function() {
        // Hide unnecessary elements when printing
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });

    // ===== Page Visibility API =====
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause animations
            clearInterval(sliderInterval);
        } else {
            // Page is visible, resume animations
            if (heroSlides.length) {
                startSlider();
            }
        }
    });

    // ===== Initialize Complete =====
    console.log('Balatzis Katerini website initialized successfully!');

    // Show a subtle initialization complete indicator
    setTimeout(() => {
        document.body.classList.add('js-loaded');
    }, 100);

    // Add notification styles to document
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            padding: var(--spacing-lg);
            transform: translateX(100%);
            opacity: 0;
            transition: all var(--transition-normal);
            z-index: 9999;
            border-left: 4px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing-md);
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            flex: 1;
        }
        
        .notification-content i {
            font-size: var(--text-xl);
            color: var(--accent);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: var(--text-lg);
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
        
        .notification.warning {
            border-left-color: #F59E0B;
        }
        
        .notification.warning .notification-content i {
            color: #F59E0B;
        }
        
        /* Keyboard navigation styles */
        .keyboard-navigation *:focus {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        
        /* Print styles */
        .printing .hero-arrows,
        .printing .hero-nav,
        .printing .accessibility-panel,
        .printing .back-to-top,
        .printing .notification {
            display: none !important;
        }
        
        /* No scroll class */
        .no-scroll {
            overflow: hidden;
        }
        
        /* JS loaded indicator */
        .js-loaded {
            --page-loaded: true;
        }
        
        /* Lazy loading images */
        img.lazy {
            opacity: 0;
            transition: opacity var(--transition-normal);
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;

    // Add the styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);

    // ===== Additional Utility Functions =====

    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function for scroll events
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

    // Get element position relative to document
    function getElementOffset(element) {
        let top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return { top, left };
    }

    // Smooth scroll to element (alternative implementation)
    function smoothScrollTo(element, duration = 1000) {
        const targetPosition = getElementOffset(element).top - header.offsetHeight - 20;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
});