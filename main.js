/**
 * ATLAS — Full Redesign JavaScript
 * main.js
 *
 * Features:
 *  - Hero carousel with 6 slides (auto-advance + manual controls)
 *  - Animated stat counters (triggers on scroll into view)
 *  - Scroll reveal for sections/cards
 *  - Mobile hamburger menu
 *  - Active nav link tracking
 *  - Contact form with inline feedback + mailto fallback
 *  - Smooth scroll for all anchor links
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel();
    initHamburger();
    initSmoothScroll();
    initPageObserver();
    initContactForm();
    initScrollProgress();
    initAboutCarousel();
});

/* ============================================================
   0. HERO CAROUSEL — 6 slides, auto-advancing, with controls
   ============================================================ */
function initHeroCarousel() {
    const textSlides = document.querySelectorAll('.hero-text-slide');
    const dots       = document.querySelectorAll('.hero-dot');
    const prevBtn    = document.getElementById('hero-prev');
    const nextBtn    = document.getElementById('hero-next');

    if (!textSlides.length) return;

    const TOTAL    = textSlides.length;
    const INTERVAL = 6000;   // ms between auto-advances
    let current    = 0;
    let timer      = null;
    let isTransitioning = false;

    function goTo(index, direction) {
        if (isTransitioning || index === current) return;
        isTransitioning = true;

        const prev = current;
        current = ((index % TOTAL) + TOTAL) % TOTAL;

        // Determine slide direction for text animation
        const dir = direction || (current > prev ? 'next' : 'prev');

        // --- Text slides: slide + fade ---
        textSlides.forEach((s, i) => {
            s.classList.remove('active', 'exit-left', 'exit-right', 'enter-left', 'enter-right');

            if (i === prev) {
                s.classList.add(dir === 'next' ? 'exit-left' : 'exit-right');
            } else if (i === current) {
                // Briefly set enter position, then animate to active
                s.classList.add(dir === 'next' ? 'enter-right' : 'enter-left');
                // Force reflow so the enter class applies before switching to active
                void s.offsetWidth;
                s.classList.remove('enter-right', 'enter-left');
                s.classList.add('active');
            }
        });

        // --- Dots ---
        dots.forEach((d, i) => {
            const isActive = i === current;
            d.classList.toggle('active', isActive);
            d.setAttribute('aria-selected', isActive);
        });

        // Allow next transition after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 800);

        resetTimer();
    }

    function next() { goTo(current + 1, 'next'); }
    function prev() { goTo(current - 1, 'prev'); }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(next, INTERVAL);
    }

    // Arrow buttons
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    // Dot buttons
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.goto, 10);
            const dir = idx > current ? 'next' : 'prev';
            goTo(idx, dir);
        });
    });

    // Keyboard navigation when hero is in view
    document.addEventListener('keydown', e => {
        const hero = document.getElementById('home');
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        // Only respond when hero is mostly visible
        if (rect.bottom < 100) return;

        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft')  prev();
    });

    // Pause auto-advance on hover (desktop)
    const heroEl = document.getElementById('home');
    if (heroEl) {
        heroEl.addEventListener('mouseenter', () => clearInterval(timer));
        heroEl.addEventListener('mouseleave', resetTimer);
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX   = 0;

    if (heroEl) {
        heroEl.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroEl.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) next();
                else prev();
            }
        }, { passive: true });
    }

    // Start auto-advance
    resetTimer();
}

/* ============================================================
   1. HAMBURGER MENU
   ============================================================ */
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('mobile-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click or outside click
    const close = () => {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
    };

    nav.querySelectorAll('a, button').forEach(el => el.addEventListener('click', close));

    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !nav.contains(e.target)) close();
    });
}

/* ============================================================
   2. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                scrollToElement(target);
            }
        });
    });
}

function scrollToElement(target, block = 'start') {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block });
}

/* ============================================================
   3. PAGE OBSERVER — reveal, counters, nav, mobile bar
   ============================================================ */
function initPageObserver() {
    const targets = document.querySelectorAll('[data-observe]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const mobileBar = document.getElementById('mob-contact-bar');
    let countersFired = false;

    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        targets.forEach(target => {
            const types = getObserveTypes(target);
            if (types.includes('reveal')) target.classList.add('visible');
            if (types.includes('counter') && !countersFired) {
                countersFired = true;
                target.querySelectorAll('[data-count]').forEach(animateCount);
            }
        });
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const types = getObserveTypes(entry.target);

            if (types.includes('reveal') && entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (types.length === 1) observer.unobserve(entry.target);
            }

            if (types.includes('counter') && entry.isIntersecting && entry.intersectionRatio >= 0.35 && !countersFired) {
                countersFired = true;
                entry.target.querySelectorAll('[data-count]').forEach(animateCount);
                if (types.length === 1) observer.unobserve(entry.target);
            }

            if (types.includes('active-nav')) {
                updateActiveNav(entry, navLinks);
            }

            if (types.includes('mobile-bar') && mobileBar) {
                mobileBar.classList.toggle('visible', !entry.isIntersecting);
            }
        });
    }, {
        threshold: [0, 0.1, 0.35, 0.6, 1],
        rootMargin: '0px 0px -40px 0px',
    });

    targets.forEach(target => observer.observe(target));
}

function getObserveTypes(target) {
    return (target.dataset.observe || '').split(/\s+/).filter(Boolean);
}

function updateActiveNav(entry, links) {
    if (!entry.isIntersecting || !links.length || !entry.target.id) return;

    const id = entry.target.id;
    links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
}

function animateCount(el) {
    const target  = parseInt(el.dataset.count, 10);
    const dur     = 1800;
    const start   = performance.now();

    const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        const eased    = easeOutExpo(progress);
        const value    = Math.round(eased * target);
        el.textContent = value.toLocaleString('el-GR');

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target.toLocaleString('el-GR');
        }
    }

    requestAnimationFrame(step);
}

/* ============================================================
   4. CONTACT FORM — mailto fallback
   ============================================================ */
function initContactForm() {
    const form     = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = form?.querySelector('.form-submit');
    if (!form || !feedback || !submitBtn) return;

    const submitLabel = submitBtn.textContent;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value.trim() || '';

        if (!name || !phone || !subject) {
            show('error', 'Παρακαλώ συμπληρώστε Όνομα, Τηλέφωνο και επιλέξτε κατηγορία.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Αποστολή…';

        // TODO: replace with real Formspree endpoint — https://formspree.io/f/<ID>
        const sub = encodeURIComponent(`Νέο μήνυμα από ${name} — ${subject}`);
        const body = encodeURIComponent(
            `Όνομα: ${name}\nΤηλέφωνο: ${phone}\nΚατηγορία: ${subject}${message ? '\n\nΜήνυμα:\n' + message : ''}`
        );
        window.location.href = `mailto:info@atlas-equipment.gr?subject=${sub}&body=${body}`;
        show('success', 'Άνοιγμα email προγράμματος… Εάν δεν ανοίξει, στείλτε στο info@atlas-equipment.gr');
        form.reset();

        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
    });

    function show(type, msg) {
        feedback.className = `form-feedback ${type}`;
        feedback.textContent = msg;
        scrollToElement(feedback, 'nearest');
        if (type === 'success') {
            setTimeout(() => { feedback.className = 'form-feedback'; feedback.textContent = ''; }, 8000);
        }
    }

    // Pre-fill category select when a product card link is clicked
    document.querySelectorAll('.product-link[data-subject]').forEach(link => {
        link.addEventListener('click', () => {
            const subjectEl = document.getElementById('subject');
            if (subjectEl) {
                const val = link.dataset.subject;
                if (subjectEl.tagName === 'SELECT') {
                    const opt = [...subjectEl.options].find(o => o.value === val);
                    if (opt) subjectEl.value = val;
                } else {
                    subjectEl.value = val;
                }
                subjectEl.classList.add('form-field--focused');
                setTimeout(() => {
                    subjectEl.classList.remove('form-field--focused');
                }, 1800);
            }
        });
    });
}

/* ============================================================
   5. SCROLL PROGRESS BAR — rAF throttled
   ============================================================ */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    const update = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${Math.min(pct, 100)}%`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}

/* ============================================================
   6. ABOUT CAROUSEL
   ============================================================ */
let aboutCarouselInterval = null;

function initAboutCarousel() {
    const imgs = document.querySelectorAll('.about-img-panel .carousel-img');
    if (imgs.length <= 1) return;

    let current = [...imgs].findIndex(img => img.classList.contains('active'));
    if (current < 0) current = 0;

    clearInterval(aboutCarouselInterval);
    aboutCarouselInterval = setInterval(() => {
        imgs[current].style.opacity = '0';
        imgs[current].classList.remove('active');
        current = (current + 1) % imgs.length;
        imgs[current].style.opacity = '1';
        imgs[current].classList.add('active');
    }, 4000);

    window.addEventListener('pagehide', () => clearInterval(aboutCarouselInterval), { once: true });
}

/* ============================================================
   7. EXPOSED SCROLL HELPERS (called from HTML buttons)
   ============================================================ */
function scrollToProducts() {
    const target = document.getElementById('products');
    if (target) scrollToElement(target);
}

function scrollToContact() {
    const target = document.getElementById('contact');
    if (target) scrollToElement(target);
}
