/*
 * Balatzis Katerini - Modern Website JavaScript
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

    // Current theme and font size
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 16;

    // Init functions
    initTheme();
    initFontSize();
    initScrollAnimations();

    // Sticky Header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }

    // Font Size Controls
    if (fontSizeUp) {
        fontSizeUp.addEventListener('click', function() {
            changeFontSize(1); // Increase by 1px
        });
    }

    if (fontSizeDown) {
        fontSizeDown.addEventListener('click', function() {
            changeFontSize(-1); // Decrease by 1px
        });
    }

    // Product filtering
    if (filterBtns.length > 0 && productCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                // Filter products
                productCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Simulate form submission (replace with actual submission in production)
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Αποστολή...';
            submitBtn.disabled = true;

            // Simulate delay for demonstration purposes
            setTimeout(() => {
                // Show success message
                showNotification('Ευχαριστούμε για το μήνυμά σας! Θα επικοινωνήσουμε μαζί σας σύντομα.', 'success');

                // Reset form
                contactForm.reset();

                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Animated heading in hero section
    animateHeroHeading();

    // Helper Functions
    function initTheme() {
        if (currentTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    function toggleTheme() {
        if (currentTheme === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            currentTheme = 'dark';
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.removeAttribute('data-theme');
            currentTheme = 'light';
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }

        localStorage.setItem('theme', currentTheme);
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
    }

    function animateHeroHeading() {
        const lines = document.querySelectorAll('.animated-heading .line');

        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 300 * index);
        });
    }

    function initScrollAnimations() {
        // Sections fade in on scroll
        const sections = document.querySelectorAll('section:not(.hero)');

        // Initial check on page load
        checkVisibility(sections);

        // Check on scroll
        window.addEventListener('scroll', function() {
            checkVisibility(sections);
        });
    }

    function checkVisibility(elements) {
        const windowHeight = window.innerHeight;
        const offset = 100; // Offset from the bottom of the viewport

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;

            if (elementPosition < windowHeight - offset) {
                element.classList.add('in-view');
            }
        });
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to the DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Setup close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add CSS for notifications
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 350px;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            padding: 16px;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 9999;
            border-left: 4px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-content i {
            font-size: 20px;
            color: var(--accent);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 16px;
            cursor: pointer;
            margin-left: 16px;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        .notification.success {
            border-left-color: #4CAF50;
        }
        
        .notification.success .notification-content i {
            color: #4CAF50;
        }
        
        .notification.error {
            border-left-color: #F44336;
        }
        
        .notification.error .notification-content i {
            color: #F44336;
        }
        
        .no-scroll {
            overflow: hidden;
        }
        
        /* Animation styles for sections */
        section:not(.hero) {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        section:not(.hero).in-view {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Hero heading animation styles */
        .animated-heading .line {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
    `;

    // Add the styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);
});