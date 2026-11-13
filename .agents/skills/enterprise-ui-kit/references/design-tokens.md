# Enterprise UI Kit — Design Tokens Specification

This reference outlines the three-tier token hierarchy used across all enterprise applications: Primitive, Semantic, and Component tokens.

---

## 1. Brand Color & Rebranding via 1 Variable

The primary color defaults to **`#2563EB`** (Blue 600). The token architecture separates the Hue and Saturation into single CSS variables:

```css
:root {
  --primary-h: 221;
  --primary-s: 83%;
  --primary-l: 53%; /* #2563EB */
}
```

### Instant Rebranding Guide
To rebrand for a different client or project, change only `--primary-h` (Hue) and `--primary-s` (Saturation):

| Industry / Client | Primary Color | HSL Values |
| :--- | :--- | :--- |
| **Healthcare / Clinic (Default)** | Blue (`#2563EB`) | `--primary-h: 221; --primary-s: 83%; --primary-l: 53%;` |
| **Fintech / Banking / ERP** | Emerald (`#059669`) | `--primary-h: 160; --primary-s: 84%; --primary-l: 39%;` |
| **Hospitality / CRM / Sales** | Indigo (`#4F46E5`) | `--primary-h: 243; --primary-s: 75%; --primary-l: 59%;` |
| **Logistics / Warehouse** | Amber / Orange (`#D97706`) | `--primary-h: 38; --primary-s: 92%; --primary-l: 50%;` |
| **Corporate Legal** | Slate / Navy (`#1E293B`) | `--primary-h: 222; --primary-s: 47%; --primary-l: 18%;` |

---

## 2. Primary Shade Scale & WCAG AA Contrast Matrix

| Shade | Hex | Luminance | Contrast on White (`#FFF`) | Contrast on Dark (`#0F172A`) | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **50** | `#EFF6FF` | 0.94 | 1.1:1 | 18.2:1 (AAA) | Table row hover, subtle badges, alert backdrops |
| **100** | `#DBEAFE` | 0.82 | 1.3:1 | 15.9:1 (AAA) | Active tab pills, highlighted table cells |
| **200** | `#BFDBFE` | 0.69 | 1.6:1 | 13.4:1 (AAA) | Focused card border, badge border |
| **300** | `#93C5FD` | 0.54 | 2.1:1 | 10.4:1 (AAA) | Disabled icons, decorative chart lines |
| **400** | `#60A5FA` | 0.38 | 3.0:1 | 7.3:1 (AAA) | Dark mode button hover, chart secondary |
| **500** | `#3B82F6` | 0.24 | 4.0:1 | 4.7:1 (AA) | Dark mode primary CTA, focused ring |
| **600** | `#2563EB` | **0.15** | **5.4:1 (AA)** | 3.0:1 | **Brand Primary CTA, Active link text** |
| **700** | `#1D4ED8` | 0.10 | 7.4:1 (AAA) | 2.0:1 | Primary button hover (Light mode) |
| **800** | `#1E40AF` | 0.07 | 10.2:1 (AAA) | 1.3:1 | Primary button pressed/active |
| **900** | `#1E3A8A` | 0.04 | 13.5:1 (AAA) | 1.1:1 | Brand hero headers, dark sidebar backgrounds |

---

## 3. Typography Hierarchy (Inter Scale)

Font family default: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

| Role | Size | Line Height | Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Display)** | `2.25rem` (36px) | `2.75rem` (44px) | 700 (Bold) | `-0.025em` | Top-level dashboard summary, hero banner |
| **H2 (Page Title)** | `1.875rem` (30px) | `2.25rem` (36px) | 700 (Bold) | `-0.020em` | Main page titles, view headers |
| **H3 (Section Title)** | `1.500rem` (24px) | `2.00rem` (32px) | 600 (SemiBold) | `-0.015em` | Modal titles, card section titles |
| **H4 (Card Header)** | `1.250rem` (20px) | `1.75rem` (28px) | 600 (SemiBold) | `-0.010em` | KPI card headers, drawer titles |
| **H5 (Subhead)** | `1.125rem` (18px) | `1.625rem` (26px) | 600 (SemiBold) | `-0.005em` | Fieldset legends, table grouping |
| **H6 (Small Subhead)** | `1.000rem` (16px) | `1.500rem` (24px) | 600 (SemiBold) | `0.000em` | Form labels, nested sections |
| **Body Large** | `1.125rem` (18px) | `1.750rem` (28px) | 400 (Regular) | `-0.005em` | Lead paragraphs, wizard instructions |
| **Body Base** | `1.000rem` (16px) | `1.500rem` (24px) | 400 (Regular) | `0.000em` | Standard text copy, descriptions |
| **Body Small** | `0.875rem` (14px) | `1.250rem` (20px) | 400 (Regular) | `0.000em` | **Default table cells, inputs, badges** |
| **Caption / XS** | `0.750rem` (12px) | `1.000rem` (16px) | 400 (Regular) | `+0.010em` | Helper text, timestamps, breadcrumbs |
| **Label** | `0.875rem` (14px) | `1.250rem` (20px) | 500 (Medium) | `0.000em` | Form input labels |
| **Overline** | `0.6875rem` (11px) | `0.875rem` (14px) | 700 (Bold) | `+0.050em` | Table headers (`uppercase tracking-wider`) |

---

## 4. Spacing Scale (4px Base Grid)

| Token | Pixels | Rem | Enterprise Usage |
| :--- | :--- | :--- | :--- |
| `0.5` | 2px | 0.125rem | Border widths, indicator dots |
| `1` | 4px | 0.25rem | Icon gap, chip padding |
| `1.5` | 6px | 0.375rem | Compact dropdown item padding |
| `2` | 8px | 0.5rem | Standard input vertical padding, icon-to-label gap |
| `3` | 12px | 0.75rem | Standard input horizontal padding, card header gap |
| `4` | 16px | 1.0rem | Default table cell padding, component margin |
| `5` | 20px | 1.25rem | Dense card inner padding, modal content gap |
| `6` | 24px | 1.5rem | Standard card padding, modal body padding |
| `8` | 32px | 2.0rem | Page header vertical padding, section divider space |
| `12` | 48px | 3.0rem | Dashboard section spacing, large empty state padding |

---

## 5. Elevation, Radii, and Z-Index

### Border Radii
- `rounded-sm`: 2px (checkboxes, badges)
- `rounded-md`: 6px (inputs, buttons, dropdowns)
- `rounded-lg`: 8px (cards, dialogs, modals)
- `rounded-xl`: 12px (feature banners, popovers)
- `rounded-full`: 9999px (avatars, pills)

### Box Shadows
- `shadow-xs`: `0 1px 2px 0 rgb(0 0 0 / 0.05)` (subtle cards, buttons)
- `shadow-sm`: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` (dropdown menus)
- `shadow-md`: `0 4px 6px -1px rgb(0 0 0 / 0.1)` (popovers, active cards)
- `shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1)` (modals, drawers)

### Z-Index Hierarchy
- `1000`: Dropdowns
- `1100`: Sticky elements
- `1200`: App topbar / header
- `1300`: Sidebar navigation
- `1400`: Dialog backdrops
- `1500`: Modals
- `1600`: Popovers
- `1700`: Toasts & snackbars
- `1800`: Tooltips
