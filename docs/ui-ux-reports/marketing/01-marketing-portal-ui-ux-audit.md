# Marketing Portal - UI/UX Comprehensive Audit
**Date:** 2025-11-05  
**Scope:** Public marketing portal (home, explore, services, salons, pricing, legal, contact)  
**Auditor:** Codex (UI/UX Specialist)  
**Files Audited:**  
- `app/(marketing)/**/*`  
- `features/marketing/components/common/*`  
- `features/marketing/home/**/*`  
- `features/marketing/services-directory/**/*`  
- `features/marketing/salon-directory/**/*`  
- `features/marketing/components/layout/**/*`

---

## Executive Summary
### Overall Assessment
The marketing portal delivers broad coverage of states (home, listing, detail, loading/error) but relies heavily on a single shadcn primitive (`Item`) with custom overrides. Current layouts fight the built-in variants, diluting component semantics and visual consistency.

### Key Strengths
- All routes share a single layout with skip-link support and suspense fallbacks.
- Marketing content is modularised into reusable sections (`MarketingSection`, `MarketingHero`, `StatBadge`, etc.).
- Loading, empty, and error states exist for key flows (`explore`, `services`, `salons`).

### Issues Found
- Critical style overlap on `Item` primitives and duplicated `ItemGroup` markup.
- Alerts are repurposed as generic layout blocks, weakening hierarchy.
- Heading semantics and toast notifications bypass shadcn wrappers, creating inconsistency.
- Wayfinding and component diversity gaps leave detail pages feeling flat.

### Component Usage Statistics
- 23 / 54 shadcn/ui components in use (42.6% coverage).  
- Top imports by count: `Item` (65), `Button` (27), `ButtonGroup` (15), `Alert` (13), `Empty` (11).  
- `Item` receives manual `className` overrides 43 times across marketing features.  
- 31 components remain unused (e.g., `Breadcrumb`, `Sidebar`, `AlertDialog`, `Table`, `Switch`, `Tooltip`), signalling opportunities for richer patterns.

## Detailed Findings

### CRITICAL
#### Issue #1: `Item` components overloaded with custom layout classes
- **Description:** Marketing sections re-style `Item` roots with custom flex, gap, border, and ring utilities to mimic cards. This conflicts with the variants defined in `components/ui/item.tsx`, causing inconsistent gutters, duplicated spacing logic, and brittle overrides that violate the “pure shadcn/ui” rule.  
- **Location:** `features/marketing/home/sections/features/features.tsx:26`, `features/marketing/pricing/sections/plans/plans.tsx:35`
- **Category:** Style Overlap / Component Misuse
- **Current Snippet:**
  ```tsx
  <Item
    key={plan.name}
    variant="outline"
    className={cn(
      'relative flex flex-col gap-6',
      plan.highlighted && 'border-primary ring-2 ring-primary/20',
    )}
  >
  ```
- **Proposed Fix:** Remove layout classes from `Item`, moving stacking to wrapper containers or a dedicated `MarketingPanel` built with `ItemGroup`. Use `Item` variants (`default`, `outline`, `muted`) as-is, and introduce `ItemSeparator` / `ItemContent` blocks to express sections without overriding base CSS. Highlighted plans can wrap the `Item` with `ItemGroup` + `Badge`, or use `Empty`/`Card` where vertical stacking is required.
- **Recommended shadcn/ui Component:** `ItemGroup`
- **Estimated Effort:** Medium (1.5 days) – refactor shared sections, adjust layout utilities, QA across breakpoints.

#### Issue #2: Manual `ItemGroup` markup duplicated in footer, mobile nav, and salon grids
- **Description:** Multiple views reproduce the `ItemGroup` DOM (`div` with `data-slot="item-group"` and manual `group/item-group` classes) instead of using the exported primitive. This diverges from shadcn updates, risks missed accessibility attributes, and undercuts maintainability.  
- **Location:** `features/marketing/components/layout/footer/footer-links.tsx:35`, `features/marketing/components/layout/header/mobile-nav.tsx:47`
- **Category:** Redundancy / Component Misuse
- **Current Snippet:**
  ```tsx
  <div
    className="group/item-group flex flex-col gap-2"
    data-slot="item-group"
    role="list"
  >
  ```
- **Proposed Fix:** Replace custom wrappers with `<ItemGroup>` and `<ItemSeparator>` so spacing, roles, and responsive behaviors remain governed by the component source. Consolidate repeated footer/nav link lists into a shared helper that composes `ItemGroup` directly.
- **Recommended shadcn/ui Component:** `ItemGroup`
- **Estimated Effort:** Medium (1 day) – swap markup, adjust spacing, retest footer/nav rendering.

### HIGH
#### Issue #1: `Alert` leveraged as a generic layout container
- **Description:** Hero, metrics, and CTA sections lean on `Alert` for neutral blurbs, diluting status semantics and introducing unnecessary adornments. These notices are informational, not inline messaging, so the visual language feels repetitive and noisy.  
- **Location:** `features/marketing/components/common/marketing-hero.tsx:39`, `features/marketing/home/sections/metrics/metrics.tsx:20`, `features/marketing/home/sections/cta/cta.tsx:26`
- **Category:** Component Misuse / Visual Hierarchy
- **Current Snippet:**
  ```tsx
  <Alert>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
  ```
- **Proposed Fix:** Replace with `ItemDescription` and optional `Empty` media blocks for emphasis. Reserve `Alert` for success/error states (e.g., newsletter results). Introduce `Separator` or `Tabs` to reinforce hierarchy without status styling.
- **Recommended shadcn/ui Component:** `ItemDescription`
- **Estimated Effort:** Medium (1 day) – adjust affected sections, verify typography and spacing.

#### Issue #2: Heading semantics nested inside `ItemTitle`
- **Description:** `ItemTitle` wraps standalone `<h1>`/`<h2>` tags (e.g., salon hero and services directory headers), creating redundant semantics and clashing font scales. `ItemTitle` is a styled `div`, so nested headings break consistent typography tokens.  
- **Location:** `features/marketing/salon-directory/sections/salon-profile/presentation/hero.tsx:26`, `features/marketing/services-directory/sections/directory-header/directory-header.tsx:15`
- **Category:** Semantic Structure / Typography
- **Current Snippet:**
  ```tsx
  <ItemTitle>
    <h1 className="text-2xl font-semibold tracking-tight">
      {salon['name'] || 'Unnamed Salon'}
    </h1>
  </ItemTitle>
  ```
- **Proposed Fix:** Move headings outside `ItemTitle` or extend `ItemTitle` with an `asChild` API to host the semantic element directly. Align typography using the built-in `ItemTitle` styles (or a dedicated `Heading` wrapper) rather than custom Tailwind overrides.
- **Recommended shadcn/ui Component:** `ItemTitle`
- **Estimated Effort:** Medium (0.75 day) – refactor headings, adjust tests for accessibility snapshots.

### MEDIUM
#### Issue #1: Toasts bypass shadcn Sonner host
- **Description:** Newsletter submissions import `toast` from `sonner` directly, skipping the themed wrapper in `@/components/ui/sonner`. This breaks alignment with the shared notification host and can double-initialize the provider.  
- **Location:** `features/marketing/components/common/newsletter-form.tsx:10`
- **Category:** Consistency / Feedback
- **Current Snippet:**
  ```tsx
  import { toast } from 'sonner'
  ```
- **Proposed Fix:** Import `{ toast }` from `@/components/ui/sonner` and ensure `<Toaster />` is mounted once at the marketing layout level. Consolidate toast variants (success/error) through the wrapper helpers.
- **Recommended shadcn/ui Component:** `Sonner`
- **Estimated Effort:** Low (0.5 day) – update imports, smoke-test success/error flows.

#### Issue #2: Detail pages lack wayfinding and structured navigation
- **Description:** Long-form views (salon profile, services directory category detail) present deep content without breadcrumbs, sidebar anchors, or contextual filters. With 31 unused components, opportunities like `Breadcrumb`, `Sidebar`, and `Tabs` are missed.  
- **Location:** `features/marketing/salon-directory/salon-profile/salon-profile.tsx:16`, `features/marketing/services-directory/services-directory-page.tsx:28`
- **Category:** Information Architecture / Component Coverage
- **Current Snippet:**
  ```tsx
  <MarketingSection ...>
    <Item variant="muted">
      <ItemContent>
        <ItemDescription>Discover salons near you...</ItemDescription>
      </ItemContent>
    </Item>
    <DirectoryHeader />
    <SalonFilters ... />
  ```
- **Proposed Fix:** Introduce a `Breadcrumb` before headers, mount `Sidebar` or `Tabs` for filter presets, and employ `Separator` + `Pagination` combos to structure long lists. Reuse `AppSidebar` pattern with marketing-specific navigation.
- **Recommended shadcn/ui Component:** `Breadcrumb`
- **Estimated Effort:** Medium (1 day) – design updates, responsive QA, copy adjustments.

#### Issue #3: Salon grid reproduces `ItemGroup` styling and stacks neutral alerts
- **Description:** The salon grid uses a hand-rolled `div` with `data-slot="item-group"` and double `Alert` blocks for plain text headers, reinforcing the same patterns flagged elsewhere.  
- **Location:** `features/marketing/salon-directory/sections/salon-grid/salon-grid.tsx:19`
- **Category:** Redundancy / Visual Hierarchy
- **Current Snippet:**
  ```tsx
  <div
    className="group/item-group flex flex-col gap-4"
    data-slot="item-group"
    role="list"
  >
    <Alert>
      <AlertTitle>Search results</AlertTitle>
      <AlertDescription>{salons.length} salon{...}</AlertDescription>
    </Alert>
  ```
- **Proposed Fix:** Swap the wrapper for `<ItemGroup>` and convert the status text into `Item` + `ItemDescription`. Reserve `Alert` for actionable feedback (e.g., zero results). Surface count via `Badge` or `Pagination` summary for clearer hierarchy.
- **Recommended shadcn/ui Component:** `ItemGroup`
- **Estimated Effort:** Medium (0.75 day) – refactor markup, adjust translations, verify empty state.

### LOW
#### Issue #1: Buttons manually tweak spacing instead of using group utilities
- **Description:** Several buttons add `className="gap-2"` or `className="w-full"`, duplicating defaults and causing inconsistent sizing (`Button` already defines `gap-2` in `buttonVariants`).  
- **Location:** `features/marketing/explore/sections/listing/search-header.tsx:67`, `features/marketing/services-directory/sections/services-grid/service-card.tsx:90`
- **Category:** Minor Style Debt
- **Current Snippet:**
  ```tsx
  <Button type="button" className="gap-2" onClick={onSearch}>
    <Search className="size-4" />
    {listingCopy.searchButton}
  </Button>
  ```
- **Proposed Fix:** Drop redundant spacing classes and lean on `ButtonGroup` or container utilities (`w-full` on parent) when width control is required. This retains consistent padding across breakpoints.
- **Recommended shadcn/ui Component:** `ButtonGroup`
- **Estimated Effort:** Low (0.25 day) – remove overrides, run visual sweep.

## Component Inventory
- **Coverage:** 23 of 54 components used (42.6%). Heavy dependence on `Item` (65 imports) and `Button` (27) drives monotony.  
- **Underused Opportunities:** `Breadcrumb`, `Sidebar`, `AlertDialog`, `Table`, `Toggle`, `Progress`, `Tooltip`, `Switch`, `Calendar`, `Carousel`. Integrating these can differentiate marketing flows (e.g., `Sidebar` for filters, `Carousel` for gallery).  
- **Usage Strategy:**  
  - **Wayfinding:** Add `Breadcrumb` to salon/service detail, `NavigationMenu` variants for footer columns.  
  - **Action surfaces:** Replace manual modals with `AlertDialog` for destructive confirmations, use `Sheet`/`Drawer` for filter panels.  
  - **State feedback:** Employ `Progress` for async pricing comparisons, `Skeleton` lists for salon cards (already partially in `explore`, extend elsewhere).  
  - **Data presentation:** Leverage `Table` or `Tabs` for plan comparisons instead of nested `Item`.

## Style Overlap & Cleanup
- Strip custom flex/gap classes from `Item` roots; introduce a shared `MarketingPanel` composed with `ItemGroup` and documented spacing presets.  
- Replace manual `data-slot="item-group"` wrappers with first-party `ItemGroup` exports.  
- Rework hero/metrics/CTA copy to use `ItemHeader` + `ItemDescription`, reserving `Alert` for actual alerts.  
- Standardise toast usage through `@/components/ui/sonner` and ensure a single `<Toaster />` host in `app/(marketing)/layout.tsx`.  
- Audit button overrides, consolidating width control at wrapper level and embracing `ButtonGroup` for paired actions.

## Implementation Roadmap
1. **Phase 1 – Critical Overrides (Week 1):** Refactor `Item` usage (issues #1 & #2), establish shared panel component, and update footer/mobile navigation to real `ItemGroup`.  
2. **Phase 2 – Visual Hierarchy (Week 2):** Replace misused `Alert`s, correct heading semantics, and roll in Sonner wrapper updates.  
3. **Phase 3 – Navigation & Diversity (Week 3):** Introduce breadcrumbs/sidebars, expand component diversity (Tables, Progress, Carousel), and iterate on salon/service detail layouts.  
4. **Phase 4 – Polish & QA (Week 4):** Remove remaining button overrides, run regression tests, and document new patterns in `docs/shadcn-components-docs/`.

## Testing Checklist
- Keyboard navigation across hero, filters, modals, and mobile sheet (`Tab`, `Shift+Tab`, arrow keys in `Tabs`/`Accordion`).  
- Screen reader pass (VoiceOver/NVDA) to confirm heading levels and landmark labeling post-refactor.  
- Responsive snapshots at 320px, 768px, 1024px, 1280px after removing custom flex overrides.  
- Toast/notification flows (newsletter form) using the central Sonner host.  
- Form validation cycles (contact form) ensuring `FieldError` remains visible and focus manages correctly.  
- Visual diff or Percy run after panel refactors to catch spacing regressions.

## Conclusion
Cleaning up shadcn primitives will restore consistency, reduce duplicated markup, and unlock a richer component palette for marketing storytelling. Prioritising the outlined phases keeps risk low while delivering immediate hierarchy improvements. Next steps: align the team on the Phase 1 refactor plan, scaffold the shared `MarketingPanel`, and schedule design QA once critical style overlap is removed.

## Appendix
**Top shadcn/ui imports (marketing portal)**

| Component | Import Count | Files |
|-----------|--------------|-------|
| Item | 65 | 65 |
| Button | 27 | 27 |
| ButtonGroup | 15 | 15 |
| Alert | 13 | 13 |
| Empty | 11 | 11 |
| Badge | 9 | 9 |

**Manual overrides tracked**
- `Item` with `className` overrides: 43 occurrences (marketing features).  
- Manual `data-slot="item-group"` wrappers: 7 occurrences (footer, mobile nav, salon grid).

