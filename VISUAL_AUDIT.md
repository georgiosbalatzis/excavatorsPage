# Visual Audit

## Executive Summary

The site has a coherent industrial identity: dark backgrounds, orange accents, strong headings, restrained borders, and consistent content gutters. The desktop product grid and company section generally feel deliberate.

The main weaknesses are responsive overflow, unstable carousel geometry, inquiry navigation, faint text, and overly sparse tablet/mobile layouts. These can be corrected within the existing design.

**18 implementation tasks identified. No P0 issues. This audit does not implement application changes.**

### Inspection coverage

- Inspected the root website at `http://127.0.0.1:8765/` on September 14, 2026.
- Inspected rendered sections at 1440, 1024, 768, and 390px; investigated form overflow at 320px. Screenshots sample sections across these widths rather than exhaustively capturing every section at every width.
- Captured 29 screenshots covering hero, partners, products, services, company, contact, footer, and interaction states.
- Tested carousel navigation, product inquiry links, empty-form validation, keyboard navigation, Escape, and resizing an open menu.
- Checked dark/light browser preferences. The site uses a fixed palette, with no separate theme implementation.
- Did not submit a valid inquiry, launch contact applications, or test email delivery.
- The site uses static HTML, CSS, and JavaScript without a framework/build pipeline. `dev/` contains a separate copy and is excluded from this backlog. No article, search, archive, or custom error template exists in the root implementation.

Evidence is preserved in [visual-audit-evidence](visual-audit-evidence/). Screenshots of transitions are identified as such; intermediate fading alone is not treated as broken content.

## Design System Observations

| Area | Existing rules |
|---|---|
| Colors | Orange `#E89157`; darker orange `#C8712F`; charcoal backgrounds; white and warm off-white content surfaces |
| Typography | Oswald display stack; Source Sans 3 body stack; mixed Greek/Latin headings have visibly different character proportions |
| Hierarchy | Large section titles, small uppercase letter-spaced labels, subdued supporting text |
| Spacing | 1200px maximum containers with 24px gutters; 24px product gaps; mostly 72–100px section padding |
| Radius | 4px controls, 8px cards, 16px larger surfaces |
| Borders/shadows | Subtle gray card borders, stronger hover shadows, orange interaction accents |
| Grid | Products switch from three to two to one column; several unrelated components collapse at 768px |
| Navigation | 68px sticky header; mobile drawer; fixed mobile contact bar after leaving the hero |
| Motion | Six-second hero rotation, background video, four-second company-image rotation, section reveals |

The established system should be retained. The backlog adjusts its implementation rather than replacing it.

## Top Issues

1. **UI-001:** Quote button extends beyond the 1024px viewport.
2. **UI-002:** Contact form widens the page at 320px.
3. **UI-003:** Hero rotation moves controls and surrounding content.
4. **UI-004:** Five product links fail to select a category; another selects the wrong subject.
5. **UI-005:** Mobile inquiry links land approximately 1,500px above the form.
6. **UI-006:** White text on orange and green controls has weak contrast.
7. **UI-007:** Footer, statistics, and other secondary dark-surface text is excessively faint.
8. **UI-008:** Product images crop away equipment details.
9. **UI-013:** An open mobile drawer survives desktop resizing and keeps scrolling locked.
10. **UI-009:** Ten partner logos occupy approximately 1,540px on mobile.

## Backlog

All source paths below are relative to the repository root. These are future implementation instructions, not changes made by the audit.

### P0

None observed.

### P1

#### UI-001 — Switch to mobile navigation before the desktop header overflows

- **Priority:** P1
- **Type:** Bug
- **Observed:** At 1024px, the quote button’s right edge and text disappear beyond the viewport.
- **Location:** `/`, sticky header, 1024px.
- **Evidence:** [Laptop header](visual-audit-evidence/atlas-08-laptop-hero.png). Header actions end at approximately x=1051.
- **Root cause:** Desktop navigation remains enabled until 768px despite the combined width of logo, navigation, actions, and gaps.
- **Files likely involved:** `style.css`.
- **Change:** Move only the header visibility rules for `.main-nav`, `.header-actions`, and `.hamburger` from the 768px media query to `max-width: 1100px`. Keep mobile contact-bar activation at 768px.
- **Do not change:** Header height, logo size, navigation destinations, or 1440px layout.
- **Acceptance criteria:** At 1024px, logo and hamburger fit within the 24px gutters. At 1101px and 1440px, desktop navigation and quote button are fully visible.
- **Test viewports:** 390, 768, 1024, 1100, 1101, 1440px.
- **Dependencies:** None.
- **Effort:** XS.

#### UI-002 — Allow the contact grid and form controls to shrink at 320px

- **Priority:** P1
- **Type:** Bug
- **Observed:** The contact column exceeds the viewport, causing mobile page scaling and a header that appears narrower than the content.
- **Location:** `/#contact`, 320px.
- **Evidence:** [Narrow form](visual-audit-evidence/atlas-28-narrow-form.png). Contact children measured 329px wide and extended to x=353.
- **Root cause:** Intrinsic form-control sizing propagates through grid tracks using the default automatic minimum width.
- **Files likely involved:** `style.css`.
- **Change:** Use `minmax(0, 1fr)` for flexible contact/form grid tracks. Apply `min-width: 0` to their grid children and `.form-group`. Set form inputs, select, and textarea to `width: 100%; min-width: 0; max-width: 100%`.
- **Do not change:** Options, form fields, 24px gutters, or desktop contact-column proportions.
- **Acceptance criteria:** At 320px, document width equals viewport width; both contact panels fit within the gutters. Long selected options stay within the select. Header and contact bar span the same viewport.
- **Test viewports:** 320, 390, 768, 1440px.
- **Dependencies:** None.
- **Effort:** S.

#### UI-003 — Keep hero text slides in one stable layout area

- **Priority:** P1
- **Type:** Bug
- **Observed:** Changing slides moves the CTA row and carousel controls. Outgoing text also fades from a different origin.
- **Location:** `/`, hero carousel.
- **Evidence:** [Transition](visual-audit-evidence/atlas-01-desktop-hero.png). At 1440px, hero height changed from 634px to 682px on slide five; CTA position moved approximately 48px.
- **Root cause:** Only `.active` remains in document flow. Other slides become absolutely positioned at the content container’s outer origin.
- **Files likely involved:** `index.html`, `style.css`.
- **Change:** Wrap the six text slides in `.hero-text-stack`, using CSS grid. Place all slides in the same grid cell and keep them participating in layout. Remove their absolute positioning and active-only positioning override. Preserve opacity, transform transitions, and inactive pointer-event suppression.
- **Do not change:** Slide copy, video, timing, CTA order, or heading sizes.
- **Acceptance criteria:** Across all six slides, CTA position and hero height vary by no more than 1px at a fixed width. Incoming and outgoing text share the same padded origin. No slide clips at 320px.
- **Test viewports:** 320, 390, 768, 1024, 1440px.
- **Dependencies:** None.
- **Effort:** S.

#### UI-004 — Match every product inquiry to an existing category

- **Priority:** P1
- **Type:** Bug
- **Observed:** Cards 1, 2, 4, 5, and 6 leave the category blank. The attachments card selects service and displays an appointment CTA.
- **Location:** `/#products` → contact form, all widths.
- **Evidence:** Browser click checks reproduced all six results. [Inquiry destination](visual-audit-evidence/atlas-23-mobile-inquiry-destination.png).
- **Root cause:** `data-subject` values do not match select option values; two cards contain copied subjects.
- **Files likely involved:** `index.html`.
- **Change:** Map card subjects to existing values: ATLAS → `Δομικά Μηχανήματα`; GUMA → `Tech Ερπύστριες`; attachments and exhibition → `Ανταλλακτικά & Εξαρτήματα`; JAB → `Υδραυλικά Σφυριά`; trucks → `Φορτηγά`. Normalize the trucks option’s trailing whitespace. Change the attachments CTA to `Ζητήστε Πληροφορίες`.
- **Do not change:** Form fields, selection JavaScript, product descriptions, or contact submission.
- **Acceptance criteria:** Clicking each card selects its corresponding visible category. Selecting one card after another replaces the previous category correctly.
- **Test viewports:** 390, 1440px.
- **Dependencies:** None.
- **Effort:** XS.

#### UI-005 — Send quote and product inquiries directly to the form

- **Priority:** P1
- **Type:** Bug
- **Observed:** A product inquiry lands at contact information; the form starts approximately 1,513px below the viewport top on mobile.
- **Location:** Product links and quote buttons, especially widths below 1100px.
- **Evidence:** [Mobile inquiry landing](visual-audit-evidence/atlas-23-mobile-inquiry-destination.png).
- **Root cause:** Inquiry actions target `#contact`, whose stacked information panel and map precede the form.
- **Files likely involved:** `index.html`, `main.js`, `style.css`.
- **Change:** Add `id="contact-inquiry"` to `.contact-form-panel` and `scroll-margin-top: 84px`. Point product links at this ID. Add a separate `scrollToInquiry()` helper for `.btn-quote` and `.mob-cta`.
- **Do not change:** Generic contact navigation, phone/email/map content, DOM order, or existing `scrollToContact()` behavior.
- **Acceptance criteria:** Every product or quote action reveals the form heading and first field below the sticky header. Generic “Επικοινωνία” navigation still reaches contact information.
- **Test viewports:** 390, 768, 1024, 1440px.
- **Dependencies:** None; verify category selection with UI-004.
- **Effort:** S.

#### UI-006 — Correct text contrast on bright controls and light-surface accents

- **Priority:** P1
- **Type:** Accessibility
- **Observed:** White labels on orange and WhatsApp-green buttons look washed out. Small orange links and contact labels are also faint on white.
- **Location:** Header, hero, products, contact, footer, mobile contact bar.
- **Evidence:** [Contact controls](visual-audit-evidence/atlas-06-desktop-contact.png), [Mobile form](visual-audit-evidence/atlas-26-mobile-form-error.png). White/orange contrast is approximately 2.44:1; white/green is 1.98:1.
- **Root cause:** Decorative accent colors are reused as small-text foregrounds and bright button backgrounds with white text.
- **Files likely involved:** `style.css`.
- **Change:** Use `--black` text on orange-filled controls and WhatsApp-green controls, including their hover states and `.mob-cta` override. Add `--orange-ink: #A04E1E` for product links, contact labels, and section labels/emphasis on white/off-white surfaces. Preserve the existing orange on dark surfaces.
- **Do not change:** Background accent colors, Viber controls, typography, sizes, or layout.
- **Acceptance criteria:** Normal-size labels and links achieve at least 4.5:1 contrast in default and hover states. Dark-section orange accents retain their appearance.
- **Test viewports:** 390, 1440px.
- **Dependencies:** None.
- **Effort:** S.

### P2

#### UI-007 — Normalize secondary text contrast on dark surfaces

- **Priority:** P2
- **Type:** Accessibility
- **Observed:** Footer hours, legal links, statistics captions, and the mobile menu phone line are difficult to read.
- **Location:** Header/menu, statistics, footer.
- **Evidence:** [Footer](visual-audit-evidence/atlas-07-desktop-footer.png), [Tablet statistics](visual-audit-evidence/atlas-13-tablet-hero.png), [Mobile menu](visual-audit-evidence/atlas-20-mobile-menu.png).
- **Root cause:** Separate white-opacity declarations range as low as 0.15–0.28.
- **Files likely involved:** `style.css`.
- **Change:** Add a dark-surface secondary-text token of `#999999`. Apply it to `.logo-sub`, `.mobile-nav-phone`, `.stat-label`, `.stat-caption`, `.footer-logo-sub`, `.footer-brand-text`, footer list links, `.footer-bottom`, its links, `.footer-cta-text`, and footer hours. Remove the closed-hours low-opacity override.
- **Do not change:** Headings, backgrounds, font sizes, or existing readable contact links.
- **Acceptance criteria:** All listed text reaches 4.5:1 against its actual background. Closed hours remain distinguishable by wording rather than near-invisibility.
- **Test viewports:** 390, 768, 1440px.
- **Dependencies:** None.
- **Effort:** S.

#### UI-008 — Show complete equipment within product image frames

- **Priority:** P2
- **Type:** Polish
- **Observed:** Tracks, hydraulic breakers, and excavators lose important portions of their silhouettes. Cropping becomes particularly severe at 768px.
- **Location:** `/#products`.
- **Evidence:** [Desktop cards](visual-audit-evidence/atlas-03-desktop-products.png), [Tablet crop](visual-audit-evidence/atlas-15-tablet-products.png).
- **Root cause:** Every image uses `object-fit: cover` inside a fixed-height padded frame.
- **Files likely involved:** `style.css`.
- **Change:** Change `.product-img-wrap img` to `object-fit: contain; object-position: center`. Remove the image-scale hover rule so complete silhouettes remain visible during hover.
- **Do not change:** Image assets, frame height/padding, badges, card lift, or card-body spacing.
- **Acceptance criteria:** Each source image fits within its frame without additional cropping or distortion, including on hover. Card image regions retain consistent heights.
- **Test viewports:** 390, 768, 1024, 1440px.
- **Dependencies:** None.
- **Effort:** XS.

#### UI-009 — Keep partner logos in two columns on mobile

- **Priority:** P2
- **Type:** Polish
- **Observed:** Ten logos occupy approximately 1,540px, with broad empty space around several small marks.
- **Location:** `/#brands`, 390px.
- **Evidence:** [Mobile partners](visual-audit-evidence/atlas-21-mobile-brands.png).
- **Root cause:** The 480px rule forces one column and limits the grid to 260px.
- **Files likely involved:** `style.css`.
- **Change:** At widths up to 480px, use `repeat(2, minmax(0, 1fr))`, a 12px gap, and the available container width. Set tiles to 96px high with 16px vertical and 12px horizontal padding.
- **Do not change:** Logo order, assets, external destinations, or layouts above 480px.
- **Acceptance criteria:** All ten logos occupy five rows, remain contained, and create no overflow at 320px. The section is under 900px tall at 390px.
- **Test viewports:** 320, 390, 480, 768px.
- **Dependencies:** None.
- **Effort:** XS.

#### UI-010 — Retain two product columns at tablet widths

- **Priority:** P2
- **Type:** Polish
- **Observed:** At 768px, each card spans almost the full screen despite short text, producing an unnecessarily long product section.
- **Location:** `/#products`, 768px.
- **Evidence:** [Tablet product layout](visual-audit-evidence/atlas-15-tablet-products.png).
- **Root cause:** The one-column product breakpoint is grouped with mobile navigation at 768px.
- **Files likely involved:** `style.css`.
- **Change:** Move only `.products-grid { grid-template-columns: 1fr; }` to a `max-width: 600px` media query. Retain the existing two-column layout from 601–1100px.
- **Do not change:** Card gaps, padding, content, or desktop three-column layout.
- **Acceptance criteria:** Two balanced columns appear at 768px; cards remain one column at 390px and 600px. Long names and feature lists wrap without clipping.
- **Test viewports:** 390, 600, 601, 768, 1024px.
- **Dependencies:** None; verify image treatment with UI-008.
- **Effort:** XS.

#### UI-011 — Retain two service columns at tablet widths

- **Priority:** P2
- **Type:** Polish
- **Observed:** Tablet service panels contain long empty horizontal areas and stack into six tall rows.
- **Location:** `/#why-us`, 768px.
- **Evidence:** [Tablet services](visual-audit-evidence/atlas-16-tablet-services.png).
- **Root cause:** `.features-grid` collapses to one column at 768px.
- **Files likely involved:** `style.css`.
- **Change:** Move the one-column `.features-grid` override to `max-width: 600px`. Preserve the existing two-column rule through 900px.
- **Do not change:** Icons, panel padding, separators, wording, or desktop layout.
- **Acceptance criteria:** At 768px, six panels form three two-column rows. At 390px, they remain a readable single column. Internal borders remain consistent.
- **Test viewports:** 390, 600, 601, 768, 900, 1024px.
- **Dependencies:** None.
- **Effort:** XS.

#### UI-012 — Highlight navigation using the section below the sticky header

- **Priority:** P2
- **Type:** Bug
- **Observed:** “Επικοινωνία” becomes active while the company section occupies most of the viewport.
- **Location:** Desktop sticky navigation.
- **Evidence:** [Company section with contact highlighted](visual-audit-evidence/atlas-05-desktop-about.png). Contact began around y=669 during the reproduced state.
- **Root cause:** Each intersecting observer entry replaces the active link; callback order determines the result.
- **Files likely involved:** `main.js`.
- **Change:** Separate active-navigation calculation from reveal handling. On scroll/resize, using one animation-frame callback, choose the `[data-observe~="active-nav"]` section crossing a horizontal line 84px below the viewport top. Activate its matching navigation link, or clear all links when that section has no navigation item or no section crosses the line.
- **Do not change:** Reveal/counter observers, navigation order, or anchor destinations.
- **Acceptance criteria:** The next section entering the viewport bottom cannot change the active item. Hero and company sections show no incorrect selection. Scrolling upward behaves consistently.
- **Test viewports:** 1024, 1440px; use 1440px for visible desktop navigation after UI-001.
- **Dependencies:** None.
- **Effort:** S.

#### UI-013 — Complete mobile-menu dismissal and focus handling

- **Priority:** P2
- **Type:** Bug
- **Observed:** Escape does not close the drawer. Tab can enter page controls behind it. Resizing to desktop leaves the drawer open and scrolling locked.
- **Location:** Mobile drawer and mobile-to-desktop resizing.
- **Evidence:** [Drawer after resize](visual-audit-evidence/atlas-29-menu-resize.png). Focus reached `.btn-primary` while the drawer remained open.
- **Root cause:** `initHamburger()` handles clicks only, with no Escape, focus containment, or breakpoint cleanup.
- **Files likely involved:** `main.js`.
- **Change:** Centralize open/close state. While open, cycle Tab between the hamburger and drawer controls. Escape closes and returns focus to the hamburger. Close and release scroll locking when crossing above the navigation breakpoint; restore focus to the logo if the hamburger becomes hidden. Update the hamburger’s accessible label for its open state.
- **Do not change:** Drawer styling, link destinations, or contact-bar behavior.
- **Acceptance criteria:** Escape works; focus cannot enter the covered page; resizing above 1100px removes the drawer and restores scrolling; reopening remains functional.
- **Test viewports:** 390, 768, then 1101 and 1440px.
- **Dependencies:** UI-001.
- **Effort:** S.

#### UI-014 — Identify and focus invalid form fields

- **Priority:** P2
- **Type:** Accessibility
- **Observed:** Empty submission reveals a message below the fields, but the fields retain normal styling and no invalid field receives focus.
- **Location:** Contact form.
- **Evidence:** [Empty-form feedback](visual-audit-evidence/atlas-26-mobile-form-error.png).
- **Root cause:** Validation only renders a summary and scrolls to it.
- **Files likely involved:** `main.js`, `style.css`.
- **Change:** For the existing required-field check, set `aria-invalid="true"` on empty name, phone, and category controls. Associate the existing feedback using `aria-describedby`. Add a red border for invalid controls. Focus the first invalid control and scroll it below the header. Clear each field’s invalid state when corrected.
- **Do not change:** Submission transport, validation requirements, optional message field, or success handling.
- **Acceptance criteria:** Empty submission focuses name; subsequent submissions focus the next missing field. Error text remains visible in the form, and corrected controls return to normal styling.
- **Test viewports:** 320, 390, 768, 1440px.
- **Dependencies:** None.
- **Effort:** S.

#### UI-015 — Remove footer links that point to the page top

- **Priority:** P2
- **Type:** Bug
- **Observed:** Privacy and terms are presented as document links, but their destinations are `#`.
- **Location:** Footer company list and bottom links.
- **Evidence:** [Footer links](visual-audit-evidence/atlas-27-mobile-footer.png); rendered link destinations confirmed in the browser.
- **Root cause:** Placeholder anchors remain in `index.html`; corresponding documents are absent from the root site.
- **Files likely involved:** `index.html`.
- **Change:** Remove the two privacy placeholder anchors and the terms placeholder anchor, including empty wrappers/list items. Restore them only in a later content task with actual destinations.
- **Do not change:** Logo home links, real footer navigation, copyright wording, or create policy content.
- **Acceptance criteria:** Footer links no longer promise unavailable documents or unexpectedly navigate to the top. No empty list rows or orphan separators remain.
- **Test viewports:** 390, 768, 1440px.
- **Dependencies:** None.
- **Effort:** XS.

#### UI-016 — Provide a persistent pause control for hero motion

- **Priority:** P2
- **Type:** Accessibility
- **Observed:** Hero copy rotates and the drone video continues playing. Mobile users have no persistent pause control; keyboard focus does not pause rotation.
- **Location:** Hero carousel.
- **Evidence:** [Mobile hero controls](visual-audit-evidence/atlas-19-mobile-hero.png); only previous/next and slide indicators are present.
- **Root cause:** Rotation pauses only on mouse hover; video playback has no user-facing control.
- **Files likely involved:** `index.html`, `main.js`, `style.css`.
- **Change:** Add one 44px pause/resume button beside the hero arrows, matching their style. Explicit pause must stop both hero rotation and video and persist through hover and manual slide changes. Pause rotation during keyboard focus within the hero. Under reduced-motion preference, start without rotation/video playback, retaining the poster and manual navigation.
- **Do not change:** Video source, normal six-second interval, copy, or swipe navigation.
- **Acceptance criteria:** Pause remains effective after using arrows and moving the pointer away. Resume restores motion. Keyboard operation works, and reduced-motion initialization stays still.
- **Test viewports:** 390, 768, 1440px.
- **Dependencies:** UI-003.
- **Effort:** M.

#### UI-017 — Add a pause control to the company photo carousel

- **Priority:** P2
- **Type:** Accessibility
- **Observed:** Company images crossfade every four seconds with no control for holding a photo.
- **Location:** `/#about`.
- **Evidence:** [Company slideshow](visual-audit-evidence/atlas-05-desktop-about.png); repeated rendered changes observed.
- **Root cause:** `initAboutCarousel()` starts an unconditional interval.
- **Files likely involved:** `index.html`, `main.js`, `style.css`.
- **Change:** Add a 44px pause/resume button at the image panel’s top-right, 16px from its edges, using the existing dark circular control treatment. Toggle the existing interval without resetting the displayed photo. Do not start rotation when reduced motion is requested.
- **Do not change:** Image order, four-second interval when running, crop treatment, experience badge, or company copy.
- **Acceptance criteria:** Pausing holds the current image for at least ten seconds; resuming advances normally. The control remains clear of the badge at all widths.
- **Test viewports:** 390, 768, 1024, 1440px.
- **Dependencies:** None.
- **Effort:** S.

### P3

#### UI-018 — Correct conspicuous Greek copy errors in hero and product labels

- **Priority:** P3
- **Type:** Consistency
- **Observed:** Prominent labels mix corrected Greek with missing accents, a detached accent, and a copied slide eyebrow.
- **Location:** Hero slides and product cards.
- **Evidence:** [Hero spelling](visual-audit-evidence/atlas-08-laptop-hero.png), [Product headings and exhibition badge](visual-audit-evidence/atlas-03-desktop-products.png).
- **Root cause:** Literal text inconsistencies in the root HTML.
- **Files likely involved:** `index.html`.
- **Change:** Replace `μηχάνηματα` with `μηχανήματα`; `Iδανικά` with `Ιδανικά`; `παντώς` with `παντός`; `Παρελκομενα δομικων μηχανηματων` with `Παρελκόμενα δομικών μηχανημάτων`; `΄Εκθεση` with `Έκθεση`. Change slide six’s copied transport eyebrow to `Παρελκόμενα & Εξοπλισμός`.
- **Do not change:** Commercial claims, product offerings, contact details, font selection, or unrelated copy.
- **Acceptance criteria:** Exact replacements appear in the rendered site without clipping or new awkward wrapping.
- **Test viewports:** 390, 768, 1440px.
- **Dependencies:** None.
- **Effort:** XS.

## Systemic Findings

- **Breakpoint coupling:** Header, products, services, form rows, and footer share a 768px collapse despite different space requirements.
- **Intrinsic sizing:** Contact-grid tracks permit form controls to impose widths larger than narrow viewports.
- **Carousel positioning:** Active-only document flow causes both layout movement and inconsistent transition origins.
- **Color reuse:** Decorative orange and low-opacity white are repeatedly used where readable text colors are needed.
- **Inquiry contracts:** Product subjects and select values are independent literal strings that have drifted apart.
- **Navigation state:** Intersection arrival order substitutes for a clear rule about which section is current.

## Quick Wins

- **UI-001:** Header breakpoint.
- **UI-004:** Product category mappings.
- **UI-008:** Complete product images.
- **UI-009:** Compact mobile partner grid.
- **UI-010 / UI-011:** Tablet grid breakpoints.
- **UI-018:** Visible copy corrections.

## Suggested Implementation Order

**UI-001 → UI-002 → UI-003 → UI-004 → UI-005 → UI-013 → UI-006 → UI-007 → UI-008 → UI-009 → UI-010 → UI-011 → UI-012 → UI-014 → UI-015 → UI-016 → UI-017 → UI-018**

Implement one task at a time. Use its acceptance criteria and specified viewport checks before moving on. Retain the existing static HTML/CSS/JavaScript architecture; no framework migration, backend change, or redesign is required.
