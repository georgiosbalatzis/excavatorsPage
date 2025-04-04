document.addEventListener('DOMContentLoaded', function() {
    // Logo handling - you would replace the placeholder with your actual logo
    const companyLogo = document.getElementById('company-logo');
    const footerLogo = document.querySelector('.footer-img');

    // Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Toggle mobile navigation
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a navigation link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // Add navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;

    // Function to show specific slide
    function showSlide(n) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Set current slide index
        currentSlide = (n + slides.length) % slides.length;

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Event listeners for slider controls
    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval); // Reset interval when manually changing
        showSlide(currentSlide - 1);
        startSlideShow(); // Restart automatic slideshow
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(currentSlide + 1);
        startSlideShow();
    });

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlideShow();
        });
    });

    // Start automatic slideshow
    function startSlideShow() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000); // Change slide every 6 seconds
    }

    // Initialize slideshow
    startSlideShow();

    // Product category tabs
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all product categories
            const categories = document.querySelectorAll('.product-category');
            categories.forEach(category => category.classList.remove('active'));

            // Show selected category
            const category = this.getAttribute('data-category');
            document.querySelector(`.product-category[data-category="${category}"]`).classList.add('active');
        });
    });

    // Testimonial slider
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialPrevBtn = document.querySelector('.testimonial-prev');
    const testimonialNextBtn = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;
    let testimonialInterval;

    // Function to show specific testimonial
    function showTestimonial(n) {
        // Remove active class from all testimonials
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));

        // Set current testimonial index
        currentTestimonial = (n + testimonialSlides.length) % testimonialSlides.length;

        // Add active class to current testimonial
        testimonialSlides[currentTestimonial].classList.add('active');
        testimonialDots[currentTestimonial].classList.add('active');
    }

    // Event listeners for testimonial controls
    testimonialPrevBtn.addEventListener('click', () => {
        clearInterval(testimonialInterval);
        showTestimonial(currentTestimonial - 1);
        startTestimonialShow();
    });

    testimonialNextBtn.addEventListener('click', () => {
        clearInterval(testimonialInterval);
        showTestimonial(currentTestimonial + 1);
        startTestimonialShow();
    });

    // Event listeners for testimonial dots
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(index);
            startTestimonialShow();
        });
    });

    // Start automatic testimonial rotation
    function startTestimonialShow() {
        testimonialInterval = setInterval(() => {
            showTestimonial(currentTestimonial + 1);
        }, 8000); // Change testimonial every 8 seconds
    }

    // Initialize testimonial slider
    startTestimonialShow();

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // If validation passes, you would typically send form data to a server
            // For demo purposes, we'll just show a success message
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });
    }

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's not an anchor link
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animations to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.product-card, .parts-card, .why-us-card');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial styles for animation
    document.querySelectorAll('.product-card, .parts-card, .why-us-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Image lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        // You could implement a JavaScript lazy loading library here
    }

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            if (!email) {
                alert('Please enter your email address.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // For demo purposes
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
})