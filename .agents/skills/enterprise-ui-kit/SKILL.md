---
name: enterprise-ui-kit
description: >-
  Builds consistent, accessible, production-ready enterprise business UIs, pages,
  dashboards, forms, tables, modals, app shells, and CRUD modules. Use this skill
  any time the user asks to build or modify a UI, page, component, dashboard, form,
  table, layout, or module for a business application (hospital management, ERP, CRM,
  inventory, HRMS, billing, etc.), or mentions login, register, forgot password,
  reset password, dashboard, sidebar, topbar, settings, profile, data table, or
  "standard UI". Works with React + Tailwind CSS (default), Next.js, Angular, or plain HTML.
---

# Enterprise UI Kit

Enterprise UI Kit provides a production-grade, domain-neutral design system and component architecture for business web applications. It ensures every screen looks unified, accessible, and polished—even without a dedicated UI/UX designer.

---

## 1. Core Principles & Non-Negotiable Rules

1. **Tokens Over Hardcoding**: NEVER hardcode hex colors (e.g. `#2563EB`), pixel fonts, or arbitrary paddings. Always use CSS variables and Tailwind tokens (`bg-primary`, `text-foreground`, `border-border`, `p-4`).
2. **Accessible by Default (WCAG 2.1 AA)**:
   - Contrast ratio >= 4.5:1 for body text, >= 3.0:1 for UI elements and headers.
   - Distinct `:focus-visible` ring on every clickable item. Never remove outlines without `ring-2 ring-primary`.
   - Every input has `<label htmlFor={id}>`, `aria-invalid`, and `aria-describedby` error announcements.
   - Modals trap focus and close on `Escape`.
3. **Four Universal States for Every Data View**:
   - **Loading**: Skeleton placeholders mirroring actual content geometry (no generic full-screen spinners).
   - **Populated**: Sorted, filterable, accessible data presentation.
   - **Empty**: Contextual icon, informative explanation, and primary call-to-action button.
   - **Error**: Clear error message, retry action button, and incident correlation ID if applicable.
4. **Responsive Layouts**: Seamless reflow across Mobile (<640px), Tablet (640-1023px), and Desktop (>=1024px).
5. **Short, Professional Copy**: Clear, action-oriented button text (`"Save Changes"`, not `"Submit"`; `"Admit Patient"`, not `"Click here to proceed"`).

---

## 2. Interactive Workflow

When asked to generate or modify any UI, follow this streamlined workflow:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Parameter Discovery                                      │
│    Check if Project Name, Domain, Brand Color, and Stack   │
│    are specified. If missing, assume defaults or ask.      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Design System Injection                                  │
│    Ensure tokens.css & tailwind.config.js are configured.  │
│    Default Brand: #2563EB Blue. Rebrandable in 1 variable. │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Pattern Selection & Generation                           │
│    - Auth Suite (Login, Register, Forgot, OTP)              │
│    - App Shell (Sidebar + Topbar + Breadcrumbs)            │
│    - Dashboard (Greeting, KPIs, Charts, Recent Activity)    │
│    - CRUD Module (Toolbar, Filters, Table, Modals)         │
│    - Settings & Profile (Account, Security, Preferences)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Verification & Accessibility Audit                       │
│    Check contrast, focus states, responsive reflow, and     │
│    loading/empty/error states against the checklist.        │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: Discover Parameters
If not explicitly provided in the prompt, apply these standard defaults:
- **Project / Domain**: Detect from current workspace (e.g., Hospital Management, ERP, CRM).
- **Brand Primary Color**: `#2563EB` (Medical / Tech Blue).
- **Default Stack**: React (Vite) + Tailwind CSS + Lucide Icons + React Router.
- *If user specifies Next.js, Angular, or plain HTML*: keep all design tokens, spacing, and class hierarchies identical; adapt component syntax only.

### Step 2: Establish Design Tokens
Verify that the project has CSS tokens wired up. If not already configured, use:
- Design Tokens Reference: [`references/design-tokens.md`](./references/design-tokens.md)
- CSS Tokens Template: [`assets/tokens.css`](./assets/tokens.css)
- Tailwind Config Template: [`assets/tailwind.config.js`](./assets/tailwind.config.js)

### Step 3: Implement Page or Component Patterns
Consult the dedicated pattern specifications as needed:
- **Shared Component Guidelines**: [`references/component-guidelines.md`](./references/component-guidelines.md)
  - Pre-built primitives: [`assets/ui-primitives.tsx`](./assets/ui-primitives.tsx) (Button, Input, Select, Badge, Card, Modal, Table, Skeleton, EmptyState).
- **Page Layout Patterns**: [`references/page-patterns.md`](./references/page-patterns.md)
  - Auth templates: [`assets/auth-pages.tsx`](./assets/auth-pages.tsx)
  - App shell template: [`assets/app-shell.tsx`](./assets/app-shell.tsx)
  - Dashboard template: [`assets/dashboard.tsx`](./assets/dashboard.tsx)
  - Standard CRUD template: [`assets/crud-template.tsx`](./assets/crud-template.tsx)

### Step 4: Validate Against Accessibility Checklist
Audit the generated code against [`references/accessibility-checklist.md`](./references/accessibility-checklist.md):
- Visible focus rings (`focus-visible:ring-2 focus-visible:ring-ring`).
- Explicit `<label>` elements connected via `htmlFor`.
- Keyboard dismissable dialogs (`Escape`).
- Semantic badges paired with text.

---

## 3. Tech Stack Defaults & Adaptation

| Tool / Layer | Default Choice | Alternatives (Keep Tokens & Patterns Identical) |
| :--- | :--- | :--- |
| **Framework** | React 18+ (Vite) | Next.js App Router, Angular 17+, SvelteKit, Vanilla HTML/JS |
| **Styling** | Tailwind CSS v3/v4 | Plain CSS custom properties (`tokens.css`), SCSS |
| **Component Model** | shadcn/ui pattern (`cn()`, Radix) | Material UI (MUI), Headless UI, Plain Tailwind primitives |
| **Icons** | `lucide-react` | `@heroicons/react`, `react-icons` |
| **Forms & Validation**| `react-hook-form` + `zod` | Native form validation, Formik |
| **Routing** | `react-router-dom` | Next.js Router, Angular Router |

---

## 4. Domain Adaptation Quick Reference

Adapt standard generic entities into domain-specific terminology:

| Domain | Entity Name | Identifiers | Top Metric (KPI) | Primary Action |
| :--- | :--- | :--- | :--- | :--- |
| **Hospital / Clinic** | Patient, Doctor, Appointment | `MRN-94021`, `APT-104` | Bed Occupancy (87%) | `+ Admit Patient` |
| **ERP / Finance** | Invoice, Vendor, Purchase Order | `INV-2026-001`, `PO-441` | Total Receivables ($142k)| `+ Create Invoice` |
| **CRM / Sales** | Lead, Deal, Customer | `LEAD-482`, `ACC-019` | Pipeline Value ($480k) | `+ Add New Lead` |
| **Inventory / Supply**| Stock Item, Warehouse, SKU | `SKU-8842`, `BIN-A12` | Low Stock Items (14) | `+ Receive Shipment` |
| **HR / Payroll** | Employee, Leave Request, Paycheck| `EMP-0142`, `PAY-99` | Attendance Rate (96%) | `+ Onboard Employee` |

See [`references/page-patterns.md`](./references/page-patterns.md) for full mapping specifications.
