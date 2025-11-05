# Staff Portal Shell - UI/UX Comprehensive Audit

**Date:** 2025-11-29  
**Scope:** Staff portal navigation shell, dashboard summaries, scheduling calendar, services catalog  
**Auditor:** Codex (UI/UX)  
**Files Audited:**
- `features/staff/staff-common/components/staff-page-shell.tsx`
- `features/staff/staff-common/components/staff-page-navigation.tsx`
- `features/staff/staff-common/components/staff-summary-grid.tsx`
- `features/staff/staff-common/components/staff-page-breadcrumbs.tsx`
- `features/staff/dashboard/components/upcoming-appointments.tsx`
- `features/staff/blocked-times/components/calendar-day-card.tsx`
- `features/staff/services/components/service-card.tsx`
- `features/staff/services/components/services-filters.tsx`
- `features/staff/appointments/components/appointments-list.tsx`
- `features/staff/profile/components/profile-photo-upload.tsx`

---

## Executive Summary
### Overall Assessment
Staff-facing shells lean on shadcn primitives but several core navigation patterns bypass documented compositions, leading to broken semantics (tabs, breadcrumbs) and inconsistent visual language for highlights and disabled states.

### Key Strengths
- Shell chrome unifies breadcrumbs, summaries, quick actions, and search in `StaffPageShell`.
- Rich component mix already includes `Item`, `ButtonGroup`, `Empty`, `Popover`, `Command`, supporting complex workflows.
- Loading routes provide `Spinner` fallbacks, preventing blank screens during data fetches.
- Forms adhere to `Field` primitives with accessible error summaries and alert feedback.

### Issues Found
- 1 critical (Tabs without panels).
- 3 high (card-based summary styling, breadcrumb structure, nested cards in items).
- 3 medium (calendar highlight, service card state, unlabeled selects).
- 2 low (empty-state framing, redundant upload trigger).

### Component Usage Statistics
- 39 of 54 shadcn/ui components in active use (72% coverage); 17 unused: aspect-ratio, carousel, collapsible, context-menu, form, input-otp, menubar, native-select, navigation-menu, pagination, resizable, slider, sonner, toast, toggle, toggle-group, typography.
- Top usage counts: `card` 56, `button` 44, `item` 42, `empty` 36, `badge` 32.
- Interaction primitives such as `tabs` (7 files) and `sheet` (1 file) remain underrepresented versus repeated card grids.

## Detailed Findings
### CRITICAL
#### Issue #1 – Tabs rendered without associated panels
- **Location:** features/staff/staff-common/components/staff-page-navigation.tsx:82  
- **Category:** Component misuse / accessibility
- **Current snippet:**
  ```tsx
  <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
    <ScrollArea className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            ...
          </TabsTrigger>
        ))}
      </TabsList>
    </ScrollArea>
  </Tabs>
  ```
- **Why it matters:** shadcn `Tabs` expect paired `TabsContent` elements so the component can manage `role="tabpanel"`, focus, and aria relationships. Rendering triggers alone forces consuming pages (`StaffDashboard`, `Appointments`, `Services`, etc.) to toggle content manually, breaking keyboard navigation and skipping announced active panel content.
- **Proposed fix:** Move tab-specific sections into `TabsContent` within `StaffPageShell` (or expose a `renderTabContent` map) so all consumers inherit compliant tab structure.
- **Recommended shadcn/ui component:** `Tabs` with `TabsContent` as documented in `docs/shadcn-components-docs/tabs.md`.
- **Estimated effort:** 6-8 hours (refactor shell, update dependent pages, regression test tab navigation).

### HIGH
#### Issue #1 – Summary cards rely on custom border styling
- **Location:** features/staff/staff-common/components/staff-summary-grid.tsx:27  
- **Category:** Style overlap / component selection
- **Current snippet:**
  ```tsx
  <Card
    key={summary.id}
    className={cn('border-l-4', toneClasses[tone])}
  >
  ```
- **Why it matters:** Hard-coding `border-l-4` and tone classes on `Card` overrides design tokens and duplicates status semantics already offered by `Item` variants. It introduces inconsistent density relative to `ItemGroup` metrics used elsewhere, and breaks the “pure component” rule from `docs/rules/08-ui.md`.
- **Proposed fix:** Replace each `Card` with `Item` + `ItemHeader`/`ItemActions`, using `variant="muted"|"outline"` and `Badge` for tone so visual hierarchy stays consistent without custom borders.
- **Recommended shadcn/ui component:** `Item`, `ItemHeader`, `ItemActions`.
- **Estimated effort:** 3-4 hours (refactor grid component, adjust summary data shapes if needed).

#### Issue #2 – Breadcrumb separators rendered inside list items
- **Location:** features/staff/staff-common/components/staff-page-breadcrumbs.tsx:24  
- **Category:** Component structure / semantics
- **Current snippet:**
  ```tsx
  <BreadcrumbItem>
    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  ```
- **Why it matters:** `BreadcrumbSeparator` returns an `<li>` and must sit between `BreadcrumbItem` siblings. Nesting it inside another `<li>` yields invalid markup and breaks screen-reader navigation cues.
- **Proposed fix:** Render `BreadcrumbSeparator` as its own sibling element between items (using a fragment map or `Array.reduce`) to match the documented pattern.
- **Recommended shadcn/ui component:** `BreadcrumbSeparator` placed per docs/shadcn-components-docs/breadcrumb.md.
- **Estimated effort:** 2 hours (adjust map logic, add regression snapshot of breadcrumb output).

#### Issue #3 – Nested cards used as date badges inside items
- **Location:** features/staff/dashboard/components/upcoming-appointments.tsx:62  
- **Category:** Style overlap / component selection
- **Current snippet:**
  ```tsx
  <Item variant="outline">
    <ItemMedia>
      <Card>
        <CardContent>
          <div className="flex w-16 ...">
  ```
- **Why it matters:** Embedding a full `Card` inside `ItemMedia` adds redundant borders and padding, bloating row height and diverging from shadcn item media patterns. A semantic media element (Avatar, Badge, ItemMedia with icon) conveys the same information with less clutter.
- **Proposed fix:** Swap the inner `Card` for `ItemMedia variant="icon"` plus `Avatar` or `Badge` to present month/day without extra container styling.
- **Recommended shadcn/ui component:** `Avatar` or `Badge` within `ItemMedia`.
- **Estimated effort:** 3 hours (update template + adjust spacing tokens).

### MEDIUM
#### Issue #1 – Calendar day cards tint cards via class overrides
- **Location:** features/staff/blocked-times/components/calendar-day-card.tsx:30  
- **Category:** Style overlap
- **Current snippet:**
  ```tsx
  <Card key={day.toISOString()} className={isToday ? 'border-primary' : ''}>
  ```
- **Why it matters:** Applying `border-primary` directly to `Card` breaks visual consistency with other highlight treatments. The calendar tile also relies on extra padding layers to counter the default card spacing.
- **Proposed fix:** Replace the wrapper with `Item` (supports `variant="highlight"` via tokens) or surround existing content with `Item`/`ItemGroup`, using `Badge` for today instead of overriding card borders.
- **Recommended shadcn/ui component:** `Item`, `Badge`.
- **Estimated effort:** 2-3 hours (refactor tile component, update parent grid spacing).

#### Issue #2 – Service cards fade availability with opacity class
- **Location:** features/staff/services/components/service-card.tsx:98  
- **Category:** Style overlap / state representation
- **Current snippet:**
  ```tsx
  <Card className={service.is_available === false ? 'opacity-60' : ''}>
  ```
- **Why it matters:** Opacity on the full card weakens contrast for text and buttons, conflicting with accessibility guidance and the design system. shadcn `Item` or `Badge` variants offer clearer state messaging without muting content.
- **Proposed fix:** Use `Item` with `variant="muted"` for unavailable services and surface status in `ItemActions` via `Badge`. Keep buttons fully opaque and rely on `disabled` states if actions are blocked.
- **Recommended shadcn/ui component:** `Item`, `Badge`.
- **Estimated effort:** 3 hours (refactor card markup, ensure disabled actions communicate state).

#### Issue #3 – Select filters lack accessible labelling
- **Location:** features/staff/services/components/services-filters.tsx:56  
- **Category:** Forms / accessibility
- **Current snippet:**
  ```tsx
  <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
    <SelectTrigger className="w-44">
      <SelectValue placeholder="All categories" />
  ```
- **Why it matters:** `SelectTrigger` has no associated label or `aria-label`, so screen readers announce only “button, All categories”, missing context. This contradicts `docs/rules/07-forms.md` and the Select docs that recommend wrapping in `Field` or providing `aria-labelledby`.
- **Proposed fix:** Wrap each select in `Field` + `FieldLabel` or add `aria-label`/`aria-labelledby` to the trigger and ensure helper text is surfaced via `FieldDescription`.
- **Recommended shadcn/ui component:** `Field`, `FieldLabel`, `FieldDescription`.
- **Estimated effort:** 2 hours (apply pattern to both filters, update tests if present).

### LOW
#### Issue #1 – Empty states double-wrap with Card + Empty
- **Location:** features/staff/appointments/components/appointments-list.tsx:32  
- **Category:** Visual consistency
- **Current snippet:**
  ```tsx
  <Card>
    <CardHeader>...</CardHeader>
    <CardContent>
      <Empty>...</Empty>
    </CardContent>
  </Card>
  ```
- **Why it matters:** Nesting `Empty` inside `Card` creates stacked borders and extra padding versus placing `Empty` directly within the layout. Leads to inconsistent whitespace compared with other empty states in the portal.
- **Proposed fix:** Render `Empty` as the top-level fallback (optionally inside `ItemGroup`) and reserve `Card` for data-present states.
- **Recommended shadcn/ui component:** `Empty`.
- **Estimated effort:** 1 hour.

#### Issue #2 – File upload button triggers input via DOM query
- **Location:** features/staff/profile/components/profile-photo-upload.tsx:80  
- **Category:** Minor UX polish
- **Current snippet:**
  ```tsx
  <label htmlFor="photo-upload">
    <Button ... onClick={() => document.getElementById('photo-upload')?.click()}>
  ```
- **Why it matters:** The label already wires click-to-open behaviour; calling `document.getElementById` adds redundant logic and can break if IDs diverge. Using `Button` with `asChild` keeps semantics cleaner.
- **Proposed fix:** Wrap the button content in `<Label asChild>` or move the button outside the label while passing `asChild` so the native association handles clicks automatically.
- **Recommended shadcn/ui component:** `Label` with `asChild`.
- **Estimated effort:** 0.5 hour.

## Component Inventory
- Active coverage: 39/54 shadcn components (72%); critical gaps include `form`, `drawer/sheet` variants for responsive overflow, and interaction primitives like `context-menu`, `toggle-group`.
- Over-indexed: `Card`, `Item`, `Empty`, `Badge`, `Button` dominate dashboards; consider swapping repetitive cards for `ItemGroup`, `Accordion`, or `Tabs` content panes to diversify layouts.
- Underused opportunities: introduce `Sheet` for mobile quick actions, `ToggleGroup` for status filters, `ContextMenu` for row-level actions, `Toast/Sonner` for mutation feedback, and `Pagination` for longer tables.
- Component Usage Strategy:
  - Metrics & KPIs → `ItemGroup` + `ItemHeader`/`ItemActions` (replaces current `Card` summaries).
  - Agenda & timelines → `ItemGroup` with `ItemMedia variant="icon"` + `Badge` for date/time markers.
  - Calendar availability → `Calendar` + `Item` rows for events; flag today via `Badge` instead of border overrides.
  - Filters & search → `FieldSet` + `Field` wrapping `Select`, `InputGroup`, `ToggleGroup` to ensure labelled controls.
  - Quick actions (mobile) → `Sheet` or `Drawer` triggered from toolbar `ButtonGroup` for accessible overflow menus.

## Style Overlap & Cleanup
- Remove custom border/opacity classes from shadcn components (`Card`, `CardHeader`) and rely on documented variants (`Item`, `Badge`, `Alert`).
- Consolidate empty states by using `Empty` as the sole container—avoid wrapping inside `Card` unless paired with data views.
- Replace nested cards or div-based highlight tiles with `ItemMedia`, `Avatar`, or `Badge` compositions to simplify DOM depth and spacing.
- Ensure every filter/control is wrapped with `Field` primitives to unify spacing and labels.

## Implementation Roadmap
- **Phase 1 (Critical):** Refactor `StaffPageShell` to render `TabsContent` and fix breadcrumb separator structure (approx. 1 sprint day).
- **Phase 2 (High):** Replace card-based summary/appointment tiles with `Item` variants; introduce shared summary component (1.5–2 days).
- **Phase 3 (Medium):** Update calendar/service components to remove style overrides and add labelled filter controls (1–1.5 days).
- **Phase 4 (Low/Enhancement):** Simplify empty states, clean upload button wiring, and stage additional component introductions (0.5 day).

## Testing Checklist
- Verify keyboard navigation across tabs (arrow keys, Home/End) and breadcrumb focus order.
- Run visual regression or manual diff for dashboard summaries and appointment lists after replacing cards.
- Test screen-reader output for services filters to confirm labels announce correctly.
- Confirm mobile layouts for toolbar quick actions and tab strips after refactor.
- Re-check destructive flows (blocked times, services) for consistent feedback after styling changes.

## Conclusion
The staff shell already embraces shadcn primitives but diverges in high-traffic navigation (tabs and breadcrumbs) and resorts to ad-hoc card styling for emphasis. Aligning these areas with documented compositions will restore accessibility, lighten layouts, and open space to introduce underused components like `Sheet`, `ToggleGroup`, and `ContextMenu` for richer workflows.

## Appendix
- **Top Components by Frequency:** card (56), button (44), item (42), empty (36), badge (32).
- **Unused Components to Explore:** aspect-ratio, carousel, collapsible, context-menu, form, input-otp, menubar, native-select, navigation-menu, pagination, resizable, slider, sonner, toast, toggle, toggle-group, typography.
- **Component Usage Strategy (Quick Reference):**
  - Dash summaries → `ItemGroup` + `ItemTitle`/`ItemActions`
  - Daily schedule → `Item` + `ItemMedia variant="icon"` + `Badge`
  - Availability calendar → `Calendar` + `Item` rows, `Badge` for today
  - Filter panels → `FieldSet` + `Field` + `Select`/`InputGroup`
  - Overflow actions → `Sheet` or `Drawer` paired with `ButtonGroup`
