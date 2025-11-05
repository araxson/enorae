# Customer Portal - UI/UX Comprehensive Audit
**Date:** 2025-11-05  
**Scope:** Customer portal App Router routes & feature components  
**Auditor:** Codex (UI/UX Specialist)  
**Status:** Needs refactor  
**Files Audited:**
- features/customer/reviews/components/reviews-list.tsx
- features/customer/appointments/components/appointments-list.tsx
- features/customer/profile/components/profile-preferences-editor.tsx
- features/customer/discovery/components/search-filters.tsx
- features/customer/analytics/components/metrics-dashboard.tsx
- features/customer/salon-detail/components/service-list.tsx
- features/customer/staff-profiles/components/staff-profile-detail.tsx
- features/customer/transactions/components/transactions-list.tsx

---

## Executive Summary
### Overall Assessment
- Customer portal leans heavily on a handful of primitives (Item, Card, Button) with extensive class overrides that break shadcn defaults, resulting in uneven spacing and inconsistent layouts.
- Loading, navigation, and state differentiation rely almost entirely on Spinner/Empty patterns; higher-fidelity skeletons, breadcrumbs, and contextual messaging are missing.
- Composition mixes multiple structural primitives (Card+Item) within single slots, producing cluttered markup and conflicting spacing rules.

### Key Strengths
- Consistent use of Empty, ItemGroup, and Badge creates a recognisable visual vocabulary.
- Dialog, ButtonGroup, and InputGroup patterns are already integrated, easing the shift toward more semantic layouts.
- Server-side orchestration keeps data fetching out of client components, so UI cleanup can focus purely on presentation.

### Issues Found
- 2 critical violations (shadcn slot overrides on Item / Button variants).
- 3 high-priority composition and navigation gaps.
- 4 medium gaps around state feedback and duplication.
- 2 low-priority polish opportunities.

### Component Usage Statistics
- 332 total shadcn/ui imports across customer features; 34 distinct primitives.
- Top usage share: Item 72 (21.7%), Card 44 (13.3%), Button 34 (10.2%), Spinner 29 (8.7%), Empty 28 (8.4%), Badge 27 (8.1%).
- Underused/high-impact primitives: Breadcrumb, Drawer, Sheet, Menubar, HoverCard, Combobox, Tabs (2 uses), Pagination (1 use), AlertDialog (1 use).
- No Skeleton, Toast/Sonner, Sidebar, Drawer, Breadcrumb, or DataTable implementations in customer flows.

## Detailed Findings
### CRITICAL
#### Issue #1
- **Description:** Item and ItemGroup primitives are repeatedly styled with custom padding/spacing classes, overriding the baked-in variants and producing inconsistent density across cards and lists.
- **Location:** features/customer/reviews/components/reviews-list.tsx:68
- **Category:** Style Overlap (shadcn violation)
- **Current Snippet:**
```tsx
<Item key={review['id']} variant="outline" className="flex flex-col gap-4 p-6">
```
- **Proposed Fix:** Remove direct padding/flex overrides; switch to Item size variants (`size="sm"|default`), wrap in neutral containers for grid spacing, and use ItemGroup modifiers for density.
- **Recommended shadcn/ui Component:** Item (variant + size props)
- **Estimated Effort:** 6h (touches ~70 Item usages)

#### Issue #2
- **Description:** Buttons, InputGroupButton, and ButtonGroup members rely on `className` overrides (`w-full`, `flex-1`, `gap-*`) to control layout, conflicting with shadcn Button sizing tokens and producing inconsistent hit targets.
- **Location:** features/customer/profile/components/profile-preferences-editor.tsx:124
- **Category:** Style Overlap (component misuse)
- **Current Snippet:**
```tsx
<Button onClick={handleSave} disabled={isSaving} className="mt-6 w-full">
```
- **Proposed Fix:** Move sizing to parent ItemFooter/ButtonGroup, use Button `size` variants, and rely on layout wrappers (Stack/ItemGroup) for stretch behaviour.
- **Recommended shadcn/ui Component:** ButtonGroup + ItemFooter
- **Estimated Effort:** 4h (buttons in 12+ files)

### HIGH
#### Issue #1
- **Description:** CardHeader blocks embed ItemGroup + Item combos, placing CardTitle/CardDescription inside ItemContent. This double-stack of structural slots breaks documented Card composition and exaggerates spacing.
- **Location:** features/customer/profile/components/profile-preferences-editor.tsx:70
- **Category:** Composition misuse
- **Current Snippet:**
```tsx
<CardHeader>
  <ItemGroup>
    <Item>
      <ItemMedia ... />
      <ItemContent>
        <CardTitle>Account Preferences</CardTitle>
        <CardDescription>...</CardDescription>
      </ItemContent>
    </Item>
  </ItemGroup>
</CardHeader>
```
- **Proposed Fix:** Flatten CardHeader to use CardTitle/CardDescription directly and relocate Item primitives into CardContent for secondary metadata.
- **Recommended shadcn/ui Component:** CardHeader slots
- **Estimated Effort:** 3h

#### Issue #2
- **Description:** Key routes (dashboard, appointments, discovery) lack Breadcrumb or NavigationMenu patterns, forcing users to rely on browser navigation and capping wayfinding clarity.
- **Location:** app/(customer)/customer/page.tsx:1
- **Category:** Missing navigation structure
- **Current Snippet:** `return <Suspense fallback={<PageLoading />}><CustomerDashboard /></Suspense>`
- **Proposed Fix:** Introduce portal-level Breadcrumb component in shared layout, optionally paired with Tabs or NavigationMenu for secondary sections.
- **Recommended shadcn/ui Component:** Breadcrumb + NavigationMenu
- **Estimated Effort:** 5h

#### Issue #3
- **Description:** Accordion Trigger rows (e.g., service list) add custom padding and responsive flex tweaks on ItemGroup/Item, diverging from accordion slot guidelines and creating uneven trigger heights.
- **Location:** features/customer/salon-detail/components/service-list.tsx:71
- **Category:** Style Overlap (accordion slot misuse)
- **Current Snippet:**
```tsx
<ItemGroup className="w-full px-4 py-3">
  <Item variant="muted" size="sm" className="w-full flex-col sm:flex-row ...">
```
- **Proposed Fix:** Use AccordionTrigger's documented layout, moving spacing to surrounding divs and relying on Item variants without extra Tailwind overrides.
- **Recommended shadcn/ui Component:** AccordionTrigger + Item size variants
- **Estimated Effort:** 3h

### MEDIUM
#### Issue #1
- **Description:** Loading states default to centered Spinner components; no Skeleton or shimmer placeholders are provided for dense lists (appointments, transactions, staff profiles), causing jarring layout shifts.
- **Location:** features/customer/dashboard/components/upcoming-bookings.tsx:56
- **Category:** Missing loading states
- **Current Snippet:** `return <Card>...<ScrollArea className="h-96">...</ScrollArea>`
- **Proposed Fix:** Add Skeleton components that mirror list density while data resolves, optionally paired with Spinner in Button actions only.
- **Recommended shadcn/ui Component:** Skeleton + ItemPlaceholder pattern
- **Estimated Effort:** 4h

#### Issue #2
- **Description:** Empty component instances omit EmptyContent CTAs in analytics and loyalty sections, leaving users without actionable recovery paths.
- **Location:** features/customer/analytics/components/metrics-dashboard.tsx:47
- **Category:** Missing UX affordance
- **Current Snippet:** `return (<Empty>...<EmptyHeader>...</EmptyHeader>)`
- **Proposed Fix:** Supply EmptyContent with ButtonGroup (e.g., “Book now”, “Discover services”) to convert empty states into guidance.
- **Recommended shadcn/ui Component:** EmptyContent + ButtonGroup
- **Estimated Effort:** 2h

#### Issue #3
- **Description:** Repeated empty-state copy (“Book an appointment”, “Browse salons”) appears verbatim across appointments, favorites, transactions. Duplication complicates localisation and tuning.
- **Location:** features/customer/appointments/components/appointments-list.tsx:32
- **Category:** Content duplication
- **Current Snippet:** `<EmptyTitle>No appointments yet</EmptyTitle> ... Browse salons`
- **Proposed Fix:** Centralise copy via shared Empty presets or Item templates within features/shared, enabling consistent tone and easier updates.
- **Recommended shadcn/ui Component:** Empty (shared presets)
- **Estimated Effort:** 3h

#### Issue #4
- **Description:** Tables (transactions) rely on Card + Table + manual spacing but lack Pagination/DataTable patterns for long histories, risking unbounded scrolling.
- **Location:** features/customer/transactions/components/transactions-list.tsx:40
- **Category:** Missing data presentation pattern
- **Current Snippet:** `<Table>...{transactions.map(...</Table>`
- **Proposed Fix:** Adopt DataTable with Pagination & ScrollArea or apply Pagination primitive plus Item summary to manage longer lists.
- **Recommended shadcn/ui Component:** DataTable (Table + Pagination)
- **Estimated Effort:** 5h

### LOW
#### Issue #1
- **Description:** Multiple ItemActions blocks add `className="flex-none"`/`gap-*` tweaks that could be replaced with ButtonGroup `orientation` props, slightly inflating DOM noise.
- **Location:** features/customer/dashboard/components/dashboard-header.tsx:24
- **Category:** Minor cleanup
- **Current Snippet:** `<ItemActions className="flex-none items-center gap-3 ...">`
- **Proposed Fix:** Remove manual flex overrides, wrap secondary controls in ButtonGroup or ItemFooter.
- **Recommended shadcn/ui Component:** ButtonGroup
- **Estimated Effort:** 1h

#### Issue #2
- **Description:** Several CardContent blocks wrap Empty components with extra `div className="p-6"` despite CardContent already applying `p-6`, leading to redundant markup.
- **Location:** features/customer/loyalty/components/loyalty-dashboard.tsx:26
- **Category:** Redundancy
- **Current Snippet:** `<CardContent><div className="p-6"><Empty>...</Empty></div></CardContent>`
- **Proposed Fix:** Drop wrapper div or convert to Item variants to maintain spacing without duplication.
- **Recommended shadcn/ui Component:** CardContent
- **Estimated Effort:** 1h

## Component Inventory
- **Over-indexed:** Item (21.7%), Card (13.3%), Button (10.2%), Spinner/Empty (combined 17%). These dominate layouts and rely on manual overrides.
- **Underused opportunities:** Breadcrumb for portal navigation, Tabs for analytics/loyalty subviews, Pagination/DataTable for transaction history, HoverCard for quick salon previews, Drawer/Sheet for filters on mobile, Toast/Sonner for save confirmations.
- **Adoption Targets:** Aim for at least 5 new high-impact primitives (Breadcrumb, Drawer, Sheet, Toast/Sonner, Skeleton) in the next refactor.
- **Component Usage Strategy:** map core needs to primitives—navigation (Breadcrumb + NavigationMenu), analytics summaries (Chart + Progress), profile forms (Field + Form), booking flows (Stepper via Tabs + Drawer for mobile filters), history tables (DataTable + Pagination + ScrollArea).

## Style Overlap & Cleanup
- Normalize Item usage by removing `className` padding overrides; rely on `size="sm|default"` and `variant` tokens for density.
- Rework Buttons to avoid width/gap modifiers—use layout wrappers (ItemFooter, ButtonGroup, Stack divs) for alignment.
- Untangle CardHeader compositions by keeping CardTitle/CardDescription direct children and moving ItemGroup structures into CardContent.
- Standardize Empty components through shared presets to eliminate duplicate copy and uneven CTAs.

## Implementation Roadmap
- **Phase 1 (Week 1) – Critical Cleanup:** Strip Item/Button overrides, refactor CardHeader structures, introduce shared Empty presets. (~5–6h)
- **Phase 2 (Week 2) – Navigation & Loading:** Add Breadcrumb + NavigationMenu, integrate Skeleton for dashboard/favorites/transactions, add Toast feedback for profile saves. (~6h)
- **Phase 3 (Week 3) – Data Presentation:** Upgrade transactions to DataTable + Pagination, add Drawer/Sheet for discovery filters, diversify component usage (HoverCard, Tabs). (~8h)
- **Phase 4 (Week 4) – Polish:** Remove residual flex utility noise, ensure CTAs present in all empty states, audit spacing through design tokens. (~4h)

## Testing Checklist
- ✅ Manual: Keyboard traversal for Breadcrumb, Drawer, Tabs; focus ring retention after removing custom classes.
- ✅ Manual: Responsive breakpoints (sm/md/lg) to confirm Item spacing after variant-only refactor.
- ✅ Manual: High-contrast/dark mode pass to ensure removal of ad-hoc text color overrides.
- ✅ Automated: Visual diff/regression for dashboard, appointments, discovery pages post-layout refactor.
- ✅ Automated: Playwright smoke for Spinner→Skeleton transitions and Drawer interactions.
- ✅ Observability: Verify Toast/Sonner hooks fire on server action success/failure.

## Conclusion
- Customer portal UI needs an aggressive cleanup to align with shadcn defaults; primary blockers are Tailwind overrides on Item/Button slots and missing navigational scaffolding.
- Addressing the critical/high issues will unlock a cleaner, more consistent baseline and create room to introduce richer components (Drawer, Skeleton, Toast).
- After remediation, focus on expanding component diversity and consolidating empty-state messaging to keep future additions on-brand.

## Appendix
- **Component Usage Table (Top 10):** Item 72, Card 44, Button 34, Spinner 29, Empty 28, Badge 27, Field 17, Alert 13, Separator 8, ButtonGroup 8 (out of 332 total shadcn imports).
- **Recommended Component Mapping:**
  - Onboarding & dashboard breadcrumbs → Breadcrumb + NavigationMenu.
  - Booking flows → Tabs (multi-step) + Drawer (mobile filters) + Progress.
  - Analytics highlights → Chart + Progress + HoverCard for comparisons.
  - History tables → DataTable + Pagination + ScrollArea.
  - Profile saves/errors → Toast/Sonner for confirmations and Alerts for inline errors.
