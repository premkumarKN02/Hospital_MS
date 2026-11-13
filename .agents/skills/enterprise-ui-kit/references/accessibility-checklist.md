# Enterprise UI Kit — Accessibility (WCAG 2.1 AA) Checklist

All components and pages generated with this skill must satisfy this checklist to ensure production readiness and legal compliance (ADA, Section 508, European Accessibility Act).

---

## 1. Color Contrast Standards (WCAG 2.1 AA)

- [ ] **Normal Body Text (< 18pt / 24px)**: Minimum **4.5:1** contrast ratio against its background.
- [ ] **Large Text (>= 18pt / 24px or >= 14pt / 18.5px Bold)**: Minimum **3.0:1** contrast ratio.
- [ ] **UI Controls & Graphical Components**: Minimum **3.0:1** contrast ratio for input borders, button boundaries, active icons, and focus rings.
- [ ] **Color Independence**: Never convey status using color alone. Always pair colors with text, icons, or badges (e.g., an error input must have both a red border AND an inline text error with an `AlertCircle` icon).
- [ ] **Dark Mode Adaptation**: High-contrast pure white on pure black causes visual vibration (halation). Use `#0F172A` (Slate 900) or `#020617` (Slate 950) with tinted gray surfaces.

---

## 2. Keyboard Navigation & Focus Management

- [ ] **Visible Focus Rings**: Every interactive element (`<button>`, `<a>`, `<input>`, `<select>`) must have a distinct `:focus-visible` ring. Never write `outline: none` without `ring-2 ring-primary`.
- [ ] **Tab Order**: DOM order must match visual reading order. Never use `tabindex > 0`.
- [ ] **Modal Focus Trapping**:
  1. Save previously focused element before modal mounts.
  2. Shift focus to modal header or first interactive field upon opening.
  3. Cycle `Tab` and `Shift+Tab` strictly within the modal boundaries.
  4. Restore focus to original trigger element when modal unmounts.
- [ ] **Escape Key Listener**: Pressing `Escape` must dismiss any open modal, drawer, dropdown, or popover.
- [ ] **Roving Tabindex**: Used in toolbars, button groups, and tab lists:
  - Active item: `tabindex="0"`.
  - Inactive items: `tabindex="-1"`.
  - Arrow keys cycle focus between items.

---

## 3. Semantic HTML & ARIA Attributes

- [ ] **Native Elements First**: Use `<button>` for click actions; use `<a>` for page navigation; use `<input>` and `<select>` for form data. Avoid `<div onClick={...}>`.
- [ ] **Form Labeling**: Every input must have an associated `<label>` with matching `htmlFor` and `id`.
- [ ] **Required Field Indicators**: Mark required fields with `aria-required="true"` and a visual red asterisk `<span aria-hidden="true">*</span>`.
- [ ] **Error Announcement**: When a field fails validation, attach `aria-invalid="true"` and `aria-describedby="{id}-error"`. The error message element must have `role="alert"`.
- [ ] **Screen Reader Live Regions**:
  - `aria-live="polite"` for non-disruptive updates (e.g., `"142 results filtered"`).
  - `aria-live="assertive"` for urgent system alerts (e.g., `"Session will expire in 2 minutes"`).
- [ ] **Icon Accessibility**:
  - Decorative icons: `aria-hidden="true"`.
  - Meaningful standalone icon buttons: provide `aria-label="Action description"` (e.g., `aria-label="Close dialog"`).

---

## 4. Responsive & Ergonomic Layouts

- [ ] **Touch Target Size**: Minimum 44x44px for primary interactive elements on touch screens (mobile/tablet).
- [ ] **Reflow & Zoom**: The layout must cleanly zoom up to 200% without horizontal scrollbars breaking text content.
- [ ] **Motion & Flashing**: Respect `prefers-reduced-motion` media queries: disable high-intensity transitions for sensitive users.
- [ ] **Skip Links**: Include `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>` as the first focusable element on every page.
