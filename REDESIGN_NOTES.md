# BALATZIS redesign (v2)

Static site, no build step: `index.html`, `style.css`, `main.js`. The previous uncommitted pass is saved in `git stash` as "pre-redesign-v2 working tree backup".

## Direction
Industrial editorial: graphite / warm concrete, one signal orange taken from the ATLAS machines in the photography (a yellow accent clashed with every photo). Sofia Sans Condensed (display), IBM Plex Sans (body), JetBrains Mono (technical labels). All three cover Greek.

## Page order
Hero (split: headline panel + excavator row, company figures strip) → Products: 01 ATLAS/WEYCOR, 02 GUMA Tech, 03 JAB as editorial chapters with spec tables; 04–06 as tiles (swipe row on mobile) → Katerini drone film → Company story + six reasons → Facilities gallery (scroll-snap) → Partners → Contact (call-first panel + quote form) → Footer.

## Implementation notes
- Optimised WebP copies live in `images/web/` (photos at 2 widths, logos trimmed). Originals untouched.
- Native platform first: `<dialog>` mobile menu (focus trap, Escape), CSS smooth scroll + `scroll-padding`, scroll-snap gallery and mobile tiles, container-query hero headline, CSS scroll-driven parallax as progressive enhancement.
- JS (~5 KB): IntersectionObserver reveals, count-up figures, active nav, quick bar, video play/pause in view, gallery buttons, map on demand, form.
- `prefers-reduced-motion`: no animation, no autoplay video, content visible.

## Verified (Chrome, local)
375 / 390 / 430 / 768 / 1024 / 1440 / 1920: no horizontal overflow, no broken images, no console errors. CLS ≈ 0.003, LCP = hero image. Initial load 14 requests (≈155 KB mobile, ≈360 KB desktop). Menu, anchors, category prefill, form validation, gallery, map, quick bar, keyboard skip link, and reduced motion all checked with Playwright.

## Open items for the business owner
- Form still opens the visitor's mail app and sends to `info@atlas-equipment.gr` (differs from the displayed emails). Confirm, or add a form endpoint.
- Metadata says ATLAS / `atlas-equipment.gr` while the visible brand is BALATZIS; `og:image` is a relative path. Confirm the domain, then make it absolute.
- Figures (30+, 750+, 10, 100%) and all product claims are carried over unchanged from the original site.
