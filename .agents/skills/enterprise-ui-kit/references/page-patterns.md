# Enterprise UI Kit — Page Patterns & Domain Adaptation Guide

This guide details page layouts, structural wireframes, and enterprise business workflows.

---

## 1. Authentication Suite Patterns

### A. Login & Register Pages
- **Layout**: Centered card (`max-w-md`) on neutral background (`bg-background`), or 50/50 split-screen on desktop with brand showcase on left and form on right.
- **Components**: Brand icon, app title, subtitle, email input, password input with show/hide toggle, "Remember me" checkbox, forgot password link, primary submit CTA, SSO button divider (`"Or continue with Google / Azure AD"`).
- **Security elements**: Caps-Lock detection banner, rate-limiting lockout timer after 5 failed attempts, compliance badges (HIPAA, SOC-2).

### B. Forgot & Reset Password Flow
- Step 1: Input registered work email -> trigger secure token dispatch.
- Step 2: Confirmation state ("Check your inbox").
- Step 3: Reset password form with real-time password strength meter (8+ chars, uppercase, lowercase, number, symbol).

### C. Verify OTP / Two-Factor Authentication (2FA)
- 6-digit segmented input with auto-focus advance, paste support, and 60-second resend countdown timer.

### D. Session Expired Modal
- Triggered automatically when JWT token expires (HTTP 401).
- Modal displays without destroying unsaved form work in background: "Your session has expired due to inactivity. Enter your password to continue without losing your data."

---

## 2. App Shell Architecture

- **Topbar (h-16 / 64px, z-40)**:
  - Left: Hamburger toggle (mobile), Brand logo, Organization / Clinic branch switcher dropdown, Breadcrumbs.
  - Right: Quick Search input (`Cmd + K`), Theme toggle (Light / Dark), Notifications icon with badge counter, User profile menu.
- **Sidebar (w-64 / 256px, z-30)**:
  - Collapsible to icon-only mode (w-16 / 64px) via bottom chevron toggle.
  - Categorized nav sections (e.g., Core, Clinical, Financial, Settings).
  - Active item: high-contrast background (`bg-primary text-primary-foreground`) with rounded corners.
  - Unread badge counters on items with pending tasks.
- **Main Canvas (`overflow-y-auto, p-4 md:p-8`)**:
  - Max-width container (`max-w-7xl mx-auto`), structured header with title + action buttons, responsive grid.

---

## 3. Dashboard Pattern

1. **Time-Based Greeting**:
   - `00:00 - 11:59`: "Good morning, {name}"
   - `12:00 - 16:59`: "Good afternoon, {name}"
   - `17:00 - 23:59`: "Good evening, {name}"
2. **KPI Metrics Grid (4 columns on desktop, 2 on tablet, 1 on mobile)**:
   - Metric title (uppercase tracking-wider text-xs).
   - Primary metric figure (large bold text-2xl or text-3xl).
   - Trend pill (`success` green with up-arrow or `danger` red with down-arrow).
   - Comparison context (`"vs previous 30 days"`).
3. **Analytics Charts Section**:
   - Primary chart (2 columns width) with date range selector and download action.
4. **Recent Activity Feed (1 column width)**:
   - Chronological events with user avatar/initial, action summary, and relative timestamp.
5. **Quick Action Bar**:
   - Direct shortcuts to high-frequency tasks: `+ Admit Patient`, `+ Create Invoice`, `+ New Order`.

---

## 4. Standard CRUD Module Template

Every enterprise entity follows this four-part pattern:

1. **List Page**:
   - Toolbar: Search input (debounced 300ms) + faceted filter dropdowns + active filter chips row + `Add {Entity}` CTA.
   - Bulk Action Bar: Floats when 1+ rows checked -> batch export, batch assign, batch delete.
   - Data Table: Sticky sortable headers, monospace numeric IDs, status badges, right-pinned action buttons.
   - Pagination: Items per page selector (10, 25, 50, 100), range indicator ("Showing 1 to 25 of 140"), page buttons.
2. **Create / Edit Form**:
   - Modal dialog for concise entities (1-5 fields).
   - Side drawer or dedicated page for complex entities (>6 fields).
   - Single-column flow with sections; required fields marked with `*`.
   - Sticky footer with `Cancel` and `Save Changes` (loading state while saving).
3. **Detail View**:
   - Header with entity name, ID, status badge, and primary actions (`Edit`, `Print`, `Share`).
   - Tabbed panels: Overview, Activity / Audit Log, Related Records, Documents / Attachments.
4. **Delete Confirmation Dialog**:
   - Prominent red warning banner explaining cascading impacts before permanent removal.

---

## 5. Profile & Settings Pattern

- **Left-hand navigation tabs**:
  - `General Profile`: Avatar photo upload, Full Name, Title, Email, Phone, Timezone.
  - `Security`: Change password, Enable Two-Factor Auth (Authenticator App / SMS), Active browser sessions.
  - `Preferences`: Theme mode (Light, Dark, System Auto), Language / Locale, Compact table density toggle.
  - `Notifications`: Email digests, SMS critical alerts, in-app bell notification toggles.

---

## 6. System & Status Pages

- **404 Not Found**: Clear message, search box, and direct button back to Dashboard.
- **403 Forbidden**: "Access Denied — your role ({role}) does not have permission to view this resource. Contact your system administrator to request access."
- **500 Server Error**: "Internal Server Error — Incident reference ID #INC-94812. Our engineering team has been notified."
- **Maintenance Banner**: Amber floating bar at top of screen: "Scheduled system maintenance on Saturday 02:00 AM UTC. Expect 15 minutes of intermittent downtime."
- **Empty States**: Centered illustration/icon, clear header, short explanation, and primary CTA button.
- **Loading Skeletons**: Match exact layout geometry to avoid Cumulative Layout Shift (CLS).
- **Offline Banner**: Sticky red banner when `navigator.onLine === false`: "You are currently offline. Changes will sync once your internet connection is restored."

---

## 7. Domain Adaptation Guide

The Enterprise UI Kit is domain-neutral. Map standard entities into your domain using this translation table:

| Universal Pattern | Hospital Management (HMS) | Enterprise Resource Planning (ERP) | Customer Relationship (CRM) | Inventory & Supply Chain |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Entity** | Patients / Admissions | Invoices / Cost Centers | Leads / Deals | Stock Items / SKUs |
| **Detail View** | Patient Medical Chart | General Ledger Entry | Deal Pipeline Overview | Warehouse Bin Card |
| **Status Values** | Admitted, Discharged, ICU | Draft, Approved, Paid | New, Contacted, Won, Lost | In Stock, Low Stock, Reordered |
| **Identifier Prefix** | `MRN-` (Medical Record No) | `INV-` / `PO-` | `LEAD-` / `OPP-` | `SKU-` / `LOT-` |
| **KPI 1** | Bed Occupancy Rate (%) | Total Revenue ($) | Monthly Recurring Revenue | Total Stock Value |
| **KPI 2** | OPD Consultations Today | Outstanding Receivables | Pipeline Conversion Rate | Low Stock Alerts |
| **KPI 3** | Average Length of Stay | Operating Margin (%) | Active Opportunities | Inventory Turnover Ratio |
| **KPI 4** | Critical Lab Results Pending | Pending PO Approvals | Win/Loss Ratio | Backordered Items |
| **Quick Action 1** | `+ Admit Patient` | `+ Create PO / Invoice` | `+ Add New Lead` | `+ Receive Shipment` |
| **Quick Action 2** | `+ Book Appointment` | `+ Log Expense` | `+ Log Call / Meeting` | `+ Transfer Stock` |
| **Primary Brand Color** | Medical Blue (`#2563EB`) | Emerald Green (`#059669`) | Dynamic Indigo (`#4F46E5`) | Amber / Steel (`#D97706`) |
