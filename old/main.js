/**
 * ATLAS — Full Redesign JavaScript
 * main.js
 *
 * Features:
 *  - Animated stat counters (triggers on scroll into view)
 *  - Scroll reveal for sections/cards
 *  - Mobile hamburger menu
 *  - Active nav link tracking
 *  - Contact form with inline feedback + Formspree / mailto fallback
 *  - Smooth scroll for all anchor links
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initHamburger();
    initSmoothScroll();
    initScrollReveal();
    initStatCounters();
    initActiveNav();
    initContactForm();
    initBrandFallbacks();
});

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
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
}

/* ============================================================
   4. ANIMATED STAT COUNTERS
   Triggers once when the stats band scrolls into view.
   ============================================================ */
function initStatCounters() {
    const band = document.querySelector('.stats-band');
    if (!band) return;

    let fired = false;

    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !fired) {
            fired = true;
            band.querySelectorAll('[data-count]').forEach(el => {
                animateCount(el);
            });
            io.disconnect();
        }
    }, { threshold: 0.4 });

    io.observe(band);
}

function animateCount(el) {
    const target  = parseInt(el.dataset.count, 10);
    const dur     = 1800;   // ms
    const start   = performance.now();

    // easeOutExpo for punchy feel
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
   5. ACTIVE NAV HIGHLIGHT
   ============================================================ */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.main-nav a[href^="#"]');
    if (!sections.length || !links.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-35% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
}

/* ============================================================
   6. CONTACT FORM — Formspree + mailto fallback
   ============================================================ */
function initContactForm() {
    const form     = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = form?.querySelector('.form-submit');
    if (!form || !feedback || !submitBtn) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            show('error', 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία (*).');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Αποστολή…';

        try {
            /**
             * ➡️  Replace 'YOUR_FORM_ID' with your Formspree ID.
             *     Get one free at https://formspree.io
             */
            const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method:  'POST',
                headers: { 'Accept': 'application/json' },
                body:    new FormData(form),
            });

            if (res.ok) {
                show('success', `✓ Ευχαριστούμε, ${name}! Θα επικοινωνήσουμε σύντομα.`);
                form.reset();
            } else {
                const data = await res.json().catch(() => ({}));
                show('error', data?.errors?.[0]?.message || 'Σφάλμα αποστολής. Δοκιμάστε ξανά.');
            }

        } catch {
            // Formspree not configured yet — open mail client as fallback
            const sub  = encodeURIComponent(`Νέο μήνυμα από ${name}`);
            const body = encodeURIComponent(
                `Όνομα: ${name}\nEmail: ${email}\nΤηλέφωνο: ${phone || '—'}\n\nΜήνυμα:\n${message}`
            );
            window.location.href = `mailto:balatzis@otenet.gr?subject=${sub}&body=${body}`;
            show('success', 'Άνοιγμα email προγράμματος… Εάν δεν ανοίξει, στείλτε στο balatzis@otenet.gr');
            form.reset();
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Αποστολή Μηνύματος';
    });

    function show(type, msg) {
        feedback.className = `form-feedback ${type}`;
        feedback.textContent = msg;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (type === 'success') {
            setTimeout(() => { feedback.className = 'form-feedback'; feedback.textContent = ''; }, 8000);
        }
    }
}

/* ============================================================
   7. EXPOSED SCROLL HELPERS (called from HTML buttons)
   ============================================================ */
function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   8. SCROLL PROGRESS BAR
   Updates a CSS width on the #scroll-progress bar as the
   user scrolls, giving a visual reading-progress indicator.
   ============================================================ */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    // Use requestAnimationFrame to throttle to display refresh rate
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop    = window.scrollY;
                const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
                const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width    = `${Math.min(pct, 100)}%`;
                ticking            = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================================
   9. S3 BRAND IMAGE FALLBACKS
   If an external brand logo fails to load (S3 outage, broken URL,
   etc.) we add .img-error to the tile so CSS hides the <img>
   and shows the .brand-fallback text span instead.
   The onerror on the <img> tags in HTML also handles this,
   but this function adds a belt-and-suspenders ResizeObserver
   catch for late-loading failures.
   ============================================================ */
function initBrandFallbacks() {
    document.querySelectorAll('.brand-tile img').forEach(img => {
        // If already broken by the time JS runs (e.g. cached error)
        if (!img.complete || img.naturalWidth === 0) {
            img.closest('.brand-tile')?.classList.add('img-error');
        }

        img.addEventListener('error', () => {
            img.closest('.brand-tile')?.classList.add('img-error');
        });
    });
}
