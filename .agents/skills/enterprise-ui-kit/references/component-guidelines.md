# Enterprise UI Kit — Component Guidelines & State Matrix

This guide specifies behavior, accessibility requirements, and interaction states for all 14 core components.

---

## 1. Interactive Element State Matrix

Every interactive element must explicitly support 7 states:
1. **Default (Rest)**: Balanced visual weight, clear affordance.
2. **Hover**: Visual shift (brightness -10%, background tint, cursor pointer).
3. **Focus-Visible**: Keyboard outline ring: `2px offset + 2px solid ring (primary/50)`. Never remove outline without replacing with ring.
4. **Active (Pressed)**: Subtle scale down (`scale-[0.99]`), darker background.
5. **Disabled**: `opacity-50 pointer-events-none cursor-not-allowed`.
6. **Loading**: Retain component bounding box, display inline spinner (`animate-spin`), disable pointer events.
7. **Error / Invalid**: Red border (`border-destructive`), inline helper text with icon (`AlertCircle`), `aria-invalid="true"`.

---

## 2. Core Components Specification

### 1. Button
- **Variants**: `primary` (brand CTA), `secondary` (surface pill), `outline` (bordered), `ghost` (toolbar icon button), `danger` (destructive action), `success` (positive confirmation).
- **Sizes**: `sm` (h-8, text-xs), `md` (h-9, text-sm), `lg` (h-11, text-base), `icon` (h-9 w-9).
- **Accessibility**: Include `aria-busy={isLoading}` and screen-reader accessible label if icon-only.

### 2. Input & Textarea
- **Structure**: Label (`<label htmlFor={id}>`), input box with optional left/right icon slots, and helper/error slot below.
- **Accessibility**: Connect error with `aria-describedby="{id}-error"`. Announce errors via `role="alert"`.
- **Validation timing**: Validate on `onBlur` for initial entry; validate on `onChange` only once marked invalid.

### 3. Select / Combobox
- **Structure**: Trigger button with current value and chevron; popover list with search filter.
- **Keyboard**: Open with `Enter` or `Space` or `ArrowDown`. Navigate items with `ArrowDown` / `ArrowUp`. Select with `Enter`. Close with `Escape`.

### 4. DatePicker
- **Enterprise Requirement**: Always show date format hint (e.g., `YYYY-MM-DD`).
- **Shortcuts**: Quick ranges for reports (`Today`, `Yesterday`, `Last 7 Days`, `Last 30 Days`, `This Quarter`, `This Year`).

### 5. Modal / Dialog
- **Focus Trapping**: Save focused element before opening; trap `Tab` cycles within modal; return focus on close.
- **Dismissal**: `Escape` key unconditionally closes modal; backdrop click closes non-destructive dialogs.
- **Sizes**: `sm` (384px), `md` (448px), `lg` (512px), `xl` (672px).

### 6. Drawer / Slide-Over
- **Use Case**: Detailed record inspection, complex filter configuration, quick create panels without navigating away.
- **Behavior**: Slides from the right edge with backdrop blur.

### 7. Table
- **Header**: Sticky (`sticky top-0 bg-card z-10`), sort indicator icons (`ArrowUpDown`), column selection checkbox.
- **Row**: Hover highlight (`hover:bg-muted/40`), zebra striping optional for dense data tables.
- **Cells**: Left-aligned for text, right-aligned for currency/numbers, centered for status badges.
- **Action Column**: Pinned to right, contains view, edit, delete actions.

### 8. Tabs
- **Structure**: Tab list with `role="tablist"`, individual tabs with `role="tab"` and `aria-selected="true|false"`.
- **Keyboard**: Left/Right arrows navigate between tabs.

### 9. Badge / Status Pill
- **Variants**: `default` (primary tint), `secondary` (neutral slate), `success` (emerald/green), `warning` (amber), `danger` (red), `info` (sky blue).
- **Accessibility**: Never rely solely on color; always include readable text.

### 10. Toast & Alert Notification
- **Alert (Inline)**: Static box with icon, title, description, and optional action. Used for form errors, maintenance notices.
- **Toast (Floating)**: Temporary pop-up at bottom-right or top-right (`z-index: 1700`). Auto-dismiss in 4 seconds; pause on hover.

### 11. Card
- **Structure**: `Card` -> `CardHeader` (`CardTitle` + `CardDescription`) -> `CardContent` -> `CardFooter`.

### 12. Stepper / Progress Bar
- **Use Case**: Multi-step onboarding, patient intake, multi-page order checkout.
- **States**: Completed (green checkmark), Current (blue numbered pill), Upcoming (gray circle).

### 13. FileUpload
- **Dropzone**: Dashed border (`border-dashed border-2`), drag-over active state (`border-primary bg-primary/5`).
- **File Preview**: File name, size, type icon, upload progress bar, remove button.

### 14. Confirm Dialog
- **Destructive confirmation**: Danger header, explicit consequence warning, two actions: `[Cancel]` and `[Yes, Delete / Confirm]`.
