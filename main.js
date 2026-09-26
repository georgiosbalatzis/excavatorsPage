/* BALATZIS — small progressive enhancements. Content works without JS. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const onView = (els, cb, options) => {
    const io = new IntersectionObserver(entries => entries.forEach(e => cb(e, io)), options);
    els.forEach(el => el && io.observe(el));
};

/* Header: solid once the page leaves the top */
onView([$('#top')], e => $('#header').classList.toggle('is-scrolled', !e.isIntersecting));

/* Mobile menu — native <dialog> gives focus trap, Escape and inert page */
const menu = $('#menu');
$('#menu-open').addEventListener('click', () => menu.showModal());
$('#menu-close').addEventListener('click', () => menu.close());
$$('a', menu).forEach(a => a.addEventListener('click', () => menu.close()));
matchMedia('(min-width: 1181px)').addEventListener('change', e => e.matches && menu.close());

/* Scroll reveals */
onView($$('[data-reveal]'), (e, io) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
}, { rootMargin: '0px 0px -12% 0px' });

/* Count-up for company figures (final values are already in the HTML) */
if (!reducedMotion) {
    $$('[data-count]').forEach(el => {
        const end = +el.dataset.count;
        const start = performance.now() + 900; // after the hero entrance
        el.style.minWidth = `${String(end).length}ch`;
        el.textContent = '0';
        const tick = now => {
            const t = Math.min(Math.max((now - start) / 1600, 0), 1);
            el.textContent = Math.round(end * (1 - (1 - t) ** 4));
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

/* Active navigation link */
const navLinks = $$('.nav a');
onView(navLinks.map(a => $(a.hash)), e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('is-active', a.hash === `#${e.target.id}`));
}, { rootMargin: '-45% 0px -50% 0px' });

/* Mobile quick bar: hidden over the hero and the contact section */
const quickbar = $('#quickbar');
const hidden = new Set();
onView([$('#home'), $('#contact')], e => {
    hidden[e.isIntersecting ? 'add' : 'delete'](e.target);
    quickbar.classList.toggle('is-visible', hidden.size === 0);
});

/* Drone video plays only while on screen */
const video = $('.base video');
if (video && !reducedMotion) {
    onView([video], e => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: .2 });
}

/* Facilities gallery — native scroll-snap, buttons step one photo */
const gallery = $('#gallery');
const slides = $$('li', gallery);
const count = $('#gallery-count');
let current = 0;
const pad = n => String(n).padStart(2, '0');
onView(slides, e => {
    if (!e.isIntersecting) return;
    current = slides.indexOf(e.target);
    count.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
}, { root: gallery, threshold: .6 });
const atEnd = () => gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
const step = (dir, loop = false) => {
    let i = Math.min(Math.max(current + dir, 0), slides.length - 1);
    if (loop && (atEnd() || current === slides.length - 1)) i = 0;
    gallery.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
};
$('#gallery-prev').addEventListener('click', () => step(-1));
$('#gallery-next').addEventListener('click', () => step(1));

/* Carousel autoplay — pauses on hover, focus, touch, off-screen and hidden tab;
   the play/pause button stops it for good. Off for reduced-motion users. */
const playBtn = $('#gallery-play');
if (!reducedMotion && slides.length > 1) {
    const holds = new Set(['offscreen']);
    let stopped = false;
    let timer;
    const sync = () => {
        clearInterval(timer);
        const running = !stopped && holds.size === 0;
        if (running) timer = setInterval(() => step(1, true), 4500);
        count.setAttribute('aria-live', running ? 'off' : 'polite');
    };
    const hold = (key, on) => { holds[on ? 'add' : 'delete'](key); sync(); };
    gallery.addEventListener('pointerenter', e => e.pointerType === 'mouse' && hold('hover', true));
    gallery.addEventListener('pointerleave', () => hold('hover', false));
    gallery.addEventListener('focus', () => hold('focus', true));
    gallery.addEventListener('blur', () => hold('focus', false));
    gallery.addEventListener('pointerdown', () => hold('touch', true));
    gallery.addEventListener('pointerup', () => setTimeout(() => hold('touch', false), 4000));
    gallery.addEventListener('pointercancel', () => setTimeout(() => hold('touch', false), 4000));
    document.addEventListener('visibilitychange', () => hold('hidden', document.hidden));
    onView([gallery], e => hold('offscreen', !e.isIntersecting), { threshold: .3 });
    playBtn.hidden = false;
    playBtn.addEventListener('click', () => {
        stopped = !stopped;
        playBtn.setAttribute('aria-label', stopped ? 'Έναρξη αυτόματης εναλλαγής' : 'Παύση αυτόματης εναλλαγής');
        $('use', playBtn).setAttribute('href', stopped ? '#i-play' : '#i-pause');
        sync();
    });
}

/* Map loads only on request */
$('#load-map').addEventListener('click', e => {
    const map = $('.map iframe');
    map.src = map.dataset.src;
    map.hidden = false;
    e.currentTarget.hidden = true;
});

/* Product links preselect the inquiry category */
const subject = $('#subject');
$$('[data-subject]').forEach(link => link.addEventListener('click', () => {
    subject.value = link.dataset.subject;
    subject.removeAttribute('aria-invalid');
    subject.classList.remove('is-flash');
    requestAnimationFrame(() => subject.classList.add('is-flash'));
}));

/* Contact form — composes an email in the visitor's mail app */
const form = $('#contact-form');
const feedback = $('#form-feedback');
const required = ['name', 'phone', 'subject'].map(id => $(`#${id}`));
required.forEach(field => {
    field.setAttribute('aria-describedby', 'form-feedback');
    field.addEventListener(field.tagName === 'SELECT' ? 'change' : 'input', () => {
        if (field.value.trim()) field.removeAttribute('aria-invalid');
    });
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const [name, phone, subj] = required.map(f => f.value.trim());
    const message = $('#message').value.trim();
    required.forEach(f => (f.value.trim() ? f.removeAttribute('aria-invalid') : f.setAttribute('aria-invalid', 'true')));

    const firstEmpty = required.find(f => !f.value.trim());
    if (firstEmpty) {
        show('error', 'Παρακαλώ συμπληρώστε Όνομα, Τηλέφωνο και επιλέξτε κατηγορία.');
        firstEmpty.focus();
        return;
    }

    // TODO: replace with a real form endpoint when one exists.
    const sub = encodeURIComponent(`Νέο μήνυμα από ${name} — ${subj}`);
    const body = encodeURIComponent(`Όνομα: ${name}\nΤηλέφωνο: ${phone}\nΚατηγορία: ${subj}${message ? `\n\nΜήνυμα:\n${message}` : ''}`);
    window.location.href = `mailto:info@atlas-equipment.gr?subject=${sub}&body=${body}`;
    show('success', 'Άνοιγμα email προγράμματος… Εάν δεν ανοίξει, στείλτε στο info@atlas-equipment.gr');
});

function show(type, msg) {
    feedback.className = `form-feedback field--full ${type}`;
    feedback.textContent = msg;
}
