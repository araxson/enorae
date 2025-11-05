# Customer Portal - UI/UX Comprehensive Audit (Refresh)
**Date:** 2025-11-05  
**Scope:** Customer portal App Router routes & feature components  
**Auditor:** Codex (UI/UX Specialist)  
**Status:** Needs refactor  
**Files Audited:**
- features/customer/booking/components/form/booking-calendar.tsx
- features/customer/discovery/components/salon-discovery-client.tsx
- features/customer/discovery/components/salon-grid.tsx
- features/customer/loyalty/components/loyalty-stats-cards.tsx
- features/customer/transactions/components/transactions-list.tsx
- features/customer/salon-search/components/salon-results-grid.tsx
- features/customer/salon-detail/components/service-list.tsx
- features/customer/salon-detail/components/salon-reviews.tsx
- features/customer/salon-detail/components/staff-grid.tsx
- features/customer/reviews/components/reviews-list.tsx
- features/customer/sessions/components/session-list.tsx
- features/customer/chains/components/chains-list.tsx
- features/customer/appointments/components/appointments-list.tsx
- features/shared/ui/components/empty-states/empty-state.tsx
- features/shared/ui/components/layout/section.tsx

---

## Executive Summary
### Overall Assessment
- Customer surfaces still lean on ad-hoc Tailwind overrides atop shadcn primitives, producing inconsistent density and breaking component guarantees in key booking and discovery flows.
- Structural wrappers (`Section`, `EmptyState`) re-implement layout primitives, fragmenting spacing rules across the portal.
- Navigation and data views are serviceable, but pagination, list orientation, and empty states need alignment with the documented shadcn compositions.

### Key Strengths
- Shared sidebar + header shell keeps navigation consistent across the portal.
- ItemGroup/Item vocabulary is pervasive, giving a solid foundation for semantic list layouts.
- Critical features already outsource state handling to server components, so remediation is mostly presentational.

### Issues Found
- Critical style-overlap problems in booking/discovery/salon detail have been resolved in-code; no outstanding critical blockers.
- 2 high-priority follow-ups remain (shared wrapper deletion, custom Section layout clean-up).
- 3 medium issues still open around Item composition and badge/spacing consistency.
- 2 low-level consistency items for layout primitives and empty state CTAs.

### Component Usage Statistics
- 321 shadcn/ui imports across customer features spanning 37 primitives.
- Top usage share: Item 71 (22.12%), Card 48 (14.95%), Button 42 (13.08%), Badge 26 (8.10%), Spinner 25 (7.79%).
- Underused components (<1% share): Breadcrumb, Drawer, Sheet, HoverCard, Tooltip, Slider, Accordion, AlertDialog, NavigationMenu, Popover.
- No customer route currently exercises Sidebar content panels, Breadcrumb trails, or DataTable patterns despite available implementations.

## Detailed Findings
### CRITICAL
#### Issue #1
- **Description:** Booking calendar wraps shadcn Card and Button primitives with direct Tailwind overrides (`p-0`, `w-full`, `shadow-none`), negating documented spacing and focus affordances for the time-slot selector and confirmation CTA.
- **Location:** features/customer/booking/components/form/booking-calendar.tsx:65
- **Category:** Style overlap — Card/Button overrides
- **Status:** Resolved — time-slot actions now rely on `ButtonGroup`/`Separator` with default variants (`features/customer/booking/components/form/booking-calendar.tsx:66`).
- **Implemented Snippet:**
```tsx
<Card>
  <CardContent className="grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem]">
    …
    <ButtonGroup orientation="vertical" className="w-full">
      <Button variant={timeValue === slot ? 'default' : 'outline'} size="sm">
        {slot}
      </Button>
    </ButtonGroup>
  </CardContent>
  <Separator />
  <CardFooter>…</CardFooter>
</Card>
```

#### Issue #2
- **Description:** Discovery filter sheet uses Button overrides (`className="w-full justify-center"`) for trigger and submit actions, conflicting with documented Button sizing and leading to inconsistent hit areas between mobile sheet and desktop filters.
- **Location:** features/customer/discovery/components/salon-discovery-client.tsx:79
- **Category:** Style overlap — Button misuse
- **Status:** Resolved — sheet trigger/footer now compose default Buttons within a vertical `ButtonGroup` (`features/customer/discovery/components/salon-discovery-client.tsx:75`).
- **Implemented Snippet:**
```tsx
<SheetTrigger asChild>
  <Button variant="outline" size="sm">
    <SlidersHorizontal className="size-4" aria-hidden="true" />
    Filters
  </Button>
</SheetTrigger>
…
<SheetFooter>
  <ButtonGroup orientation="vertical" className="w-full">
    <SheetClose asChild>
      <Button type="button">Apply filters</Button>
    </SheetClose>
  </ButtonGroup>
</SheetFooter>
```

#### Issue #3
- **Description:** Salon service accordion applies custom padding and flex utilities directly on `ItemGroup`/`Item` inside `AccordionTrigger`, overriding the built-in spacing tokens and breaking the trigger hit area.
- **Location:** features/customer/salon-detail/components/service-list.tsx:59
- **Category:** Style overlap — Accordion + Item misuse
- **Status:** Resolved — triggers now wrap `Item` in a neutral container and rely on `ItemActions` for category chips (`features/customer/salon-detail/components/service-list.tsx:57`).
- **Implemented Snippet:**
```tsx
<AccordionTrigger>
  <div className="w-full px-4 py-3">
    <Item variant="muted" size="sm">
      <ItemContent>
        <ItemTitle>{service.name}</ItemTitle>
      </ItemContent>
      {service.category_name ? (
        <ItemActions>
          <Badge variant="secondary">{service.category_name}</Badge>
        </ItemActions>
      ) : null}
    </Item>
  </div>
</AccordionTrigger>
```

### HIGH
#### Issue #1
- **Description:** Legacy `EmptyState` wrapper remains in the shared UI layer; while customer portal usage is now migrated to direct `Empty` slots, the wrapper should be removed to prevent regressions.
- **Location:** features/shared/ui/components/empty-states/empty-state.tsx:35
- **Category:** Redundant abstraction
- **Status:** Partially resolved — delete the wrapper file (and update shared references such as blocked-times) to enforce pure shadcn composition.
- **Suggested Fix:** Remove the wrapper export, replace remaining shared usages with `Empty`/`EmptyHeader`/`EmptyContent`, and add linting/tests to guard against reintroduction.

#### Issue #2
- **Description:** Custom `Section` wrapper re-implements layout spacing with bespoke width/padding tokens, creating parallel spacing rules that diverge from shadcn Container/Stack guidance.
- **Location:** features/shared/ui/components/layout/section.tsx:43
- **Category:** Layout duplication
- **Current Snippet:**
```tsx
export function Section({ width = 'lg', padding = 'default', ...props }) {
  return (
    <Component id={id} className={cn('w-full', className)}>
      <div className={cn('mx-auto w-full space-y-6', widthClasses[width], paddingClasses[padding])}>
        {children}
      </div>
    </Component>
  )
}
```
- **Proposed Fix:** Replace with shadcn-native layout stacks (e.g., `div className="container space-y-6"` + `Stack` utilities) or leverage the Sidebar inset padding already provided in `app/(customer)/layout.tsx`. Consolidate spacing in one place to avoid conflicting vertical rhythm.
- **Recommended shadcn/ui Component:** Container (Tailwind `container`) + Stack pattern
- **Estimated Effort:** 6h (refactoring dashboard, analytics, notifications wrappers)

#### Issue #3
- **Description:** Pagination in salon discovery overrides Link classes to simulate disabled states and omits `href`, producing non-focusable anchors and breaking keyboard navigation.
- **Location:** features/customer/discovery/components/salon-grid.tsx:135
- **Category:** Style overlap & accessibility gap
- **Status:** Resolved — pagination now renders proper `href`s and falls back to default variants (`features/customer/discovery/components/salon-grid.tsx:145`).
- **Implemented Snippet:**
```tsx
{currentPage > 1 && (
  <PaginationItem>
    <PaginationPrevious
      href={`?page=${currentPage - 1}`}
      onClick={(event) => {
        event.preventDefault()
        handlePageChange(currentPage - 1)
      }}
    />
  </PaginationItem>
)}
```

#### Issue #4
- **Description:** Session and chains surfaces previously depended on the deprecated `EmptyState` wrapper and flex overrides on `ItemGroup`.
- **Location:** features/customer/sessions/components/session-list.tsx:90, features/customer/chains/components/chains-list.tsx:26
- **Category:** Structural cleanup — wrapper + layout duplication
- **Status:** Resolved — both views now compose `Empty` slots inside Cards and rely on neutral wrappers for responsive layout.
- **Implemented Snippet:**
```tsx
<Card>
  <CardContent>
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Info className="size-5" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No active sessions</EmptyTitle>
        <EmptyDescription>You're not signed in on other devices.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <p className="text-sm text-muted-foreground">
          Keep this page open to monitor new sign-ins in real time.
        </p>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
```

### MEDIUM
#### Issue #1
- **Description:** Loyalty stat cards rotate Item containers with `className="flex-col gap-3"`, overriding the default horizontal layout instead of using size/variant primitives, leading to inconsistent spacing across Item-based lists.
- **Location:** features/customer/loyalty/components/loyalty-stats-cards.tsx:22
- **Category:** Style overlap — Item orientation
- **Current Snippet:**
```tsx
<Item variant="outline" className="flex-col gap-3">
  <ItemHeader>…</ItemHeader>
  <ItemContent>…</ItemContent>
</Item>
```
- **Proposed Fix:** Use stacked content inside Item (e.g., wrap text in `div className="flex flex-col gap-3"` within ItemContent) or introduce the `size="sm"` variant + ItemFooter to separate sections. Keep Item itself free of flex overrides.
- **Recommended shadcn/ui Component:** Item (size variants) + Stack wrappers inside ItemContent
- **Estimated Effort:** 3h

#### Issue #2
- **Description:** Transactions list falls back to a bare EmptyState when no data exists, meaning the page loses the Card context present in the populated state and shifts typography unexpectedly.
- **Location:** features/customer/transactions/components/transactions-list.tsx:17
- **Category:** Missing structural consistency
- **Status:** Resolved — empty branch now keeps the Card shell and composes `Empty` slots (`features/customer/transactions/components/transactions-list.tsx:24`).
- **Implemented Snippet:**
```tsx
if (transactions.length === 0) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty>…</Empty>
      </CardContent>
    </Card>
  )
}
```

#### Issue #3
- **Description:** Salon search cards add inline-flex adjustments to Badge components for icon/text pairing, duplicating spacing that Badge already exposes through variants and causing mismatched padding between badges across the portal.
- **Location:** features/customer/salon-search/components/salon-results-grid.tsx:49
- **Category:** Style overlap — Badge composition
- **Status:** Resolved — icon/text pairings now live inside `span` wrappers while Badge keeps default styling (`features/customer/salon-search/components/salon-results-grid.tsx:55`).
- **Implemented Snippet:**
```tsx
<Badge variant="outline">
  <span className="flex items-center gap-1">
    <Shield className="size-3.5" aria-hidden="true" />
    Verified
  </span>
</Badge>
```

#### Issue #4
- **Description:** Salon detail reviews and staff cards switch ItemGroups to flex rows via Tailwind (`sm:flex-row`, `items-center`) instead of relying on Item slots, resulting in inconsistent trigger spacing and duplicated responsive logic.
- **Location:** features/customer/salon-detail/components/salon-reviews.tsx:72, features/customer/salon-detail/components/staff-grid.tsx:61
- **Category:** Style overlap — Item layout overrides
- **Current Snippet:**
```tsx
<ItemGroup className="sm:flex-row sm:items-center sm:justify-between">
  …
</ItemGroup>
```
- **Proposed Fix:** Keep ItemGroup unstyled; wrap groups in `div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"` or use `ItemHeader`/`ItemFooter` combinations so Item primitives maintain their default spacing and focus rings.
- **Recommended shadcn/ui Component:** ItemGroup + ItemHeader/ItemFooter with external Stack wrappers
- **Estimated Effort:** 3h

#### Issue #5
- **Description:** Appointments and customer reviews still return the legacy `EmptyState` wrapper directly, so empty branches skip Cards and break visual rhythm compared to populated states.
- **Location:** features/customer/appointments/components/appointments-list.tsx:43, features/customer/reviews/components/reviews-list.tsx:36
- **Category:** Empty state composition
- **Current Snippet:**
```tsx
if (appointments.length === 0) {
  return (
    <EmptyState
      icon={CalendarX}
      title="No appointments yet"
      …
    />
  )
}
```
- **Proposed Fix:** Keep the surrounding Card grid even when empty and compose `Empty`, `EmptyHeader`, `EmptyContent` inline so typography, spacing, and CTAs remain consistent across states (also removes the deprecated wrapper).
- **Recommended shadcn/ui Component:** Card + Empty slots + Button
- **Estimated Effort:** 2h

### LOW
#### Issue #1
- **Description:** Analytics and transactions skeletons rebuild spacing with raw `<section className="py-10 mx-auto …">` blocks rather than reusing shared layout primitives, resulting in slightly different gutters compared to live pages.
- **Location:** features/customer/analytics/components/analytics-skeleton.tsx:5
- **Category:** Layout consistency
- **Proposed Fix:** Swap to the same container pattern used post-load (e.g., SidebarInset + `div className="container space-y-8"`), ensuring skeleton and hydrated UI align perfectly.
- **Estimated Effort:** 1h

#### Issue #2
- **Description:** Several EmptyState usages (e.g., salon search fallback) pass plain text for `action`, missing the opportunity to insert actionable Controls (Button, Link) that guide recovery.
- **Location:** features/customer/salon-search/components/salon-results-grid.tsx:112
- **Category:** Empty state UX
- **Proposed Fix:** Provide concrete next steps via Button or Link components (`Button variant="outline" asChild`) within `EmptyContent`.
- **Estimated Effort:** 1h

## Component Inventory
- 321 total shadcn/ui imports, 37 unique primitives, with Item/Card/Button comprising 50% of usage.
- Feedback components (`AlertDialog`, `Toast/Sonner`, `Popover`) appear ≤1 time across all customer features.
- Breadcrumb now exists on the dashboard, but other inner routes still lack NavigationMenu/Breadcrumb pairings for deeper wayfinding.
- **Opportunities:** introduce `Separator` between stacked cards (analytics, loyalty), adopt `Tabs` or `Accordion` for salon detail sections, bring in additional `HoverCard`/`Tooltip` pairings for secondary metrics.
- See Appendix for a recommended Component Usage Strategy covering core use cases.

## Style Overlap & Cleanup
- Strip Button, Badge, and Pagination class overrides in booking/discovery/search modules to restore default spacing and focus styles.
- Remove custom Section/EmptyState wrappers in favour of direct shadcn composition (`container`, `Empty`, `Stack`).
- Normalize Item orientation by keeping flex direction inside child divs rather than the Item root; pair with `ItemFooter` for meta rows, especially in salon detail reviews/staff cards and session summaries.
- Audit Card headers to ensure titles/descriptions sit directly in `CardHeader` slots instead of nested ItemGroup combinations.

## Implementation Roadmap
1. **Phase 1 – Critical Remediation (Week 1):**
   - Refactor booking calendar & discovery sheet buttons.
   - Replace Pagination overrides with accessible links.
2. **Phase 2 – Structural Cleanup (Weeks 2-3):**
   - Migrate off `Section` and `EmptyState` wrappers.
   - Recompose loyalty, salon detail, sessions, chains, and transactions views using pure Item/Empty layouts.
3. **Phase 3 – UX Enhancements (Week 4):**
   - Add consistent Card shells for empty states and align accordion triggers.
   - Expand Breadcrumb/NavigationMenu coverage and enrich badges/tooltips across dashboards.

## Testing Checklist
- Verify pagination keyboard focus order and disabled states.
- Confirm booking calendar time-slot selection works on mobile & desktop after Button refactor.
- Regression-test empty states for loyalty, referrals, transactions, sessions, chains, and salon detail (visual diff + keyboard traversal).
- Validate accordion triggers on salon detail services render correct hit areas after layout cleanup.
- Run smoke tests on shared layout spacing after Section removal.
- Execute Lighthouse accessibility checks on discovery and booking routes.

## Conclusion
The customer portal offers a cohesive navigation shell, but critical booking and discovery flows still override shadcn primitives, eroding consistency and accessibility. Cleaning up Button/Pagination usage, retiring custom wrappers, and enriching empty states will align the UI with the design system while preserving existing data flows.

## Appendix
### Component Usage Strategy
- **Bookings & scheduling:** `Card` + `Calendar` + `ButtonGroup` for slot selection, `ItemFooter` for confirmation copy.
- **List dashboards (loyalty, referrals, history):** `ItemGroup` with `ItemHeader/ItemFooter`, `Separator` between entries, `Badge` for status chips.
- **Data tables:** `Table` + `ScrollArea` for overflow, `Pagination` with real links.
- **Filters & search:** `Sheet` (mobile), `Command` palette for quick search, `InputGroup` for keyword + action pairing.
- **Empty/error states:** Direct `Empty` slots with `Button` or `Link` actions, optionally augmented by `Alert` for destructive messaging.
- **Status feedback:** `AlertDialog` for destructive confirmation, `Sonner` for async feedback, `Tooltip` on icon-only buttons.

### Usage Snapshot
- Top 5 components: Item (71), Card (48), Button (42), Badge (26), Spinner (25).
- Components with single sightings: Accordion, AlertDialog, AspectRatio, Calendar, Checkbox, Collapsible, Input, NavigationMenu, Popover, Slider.
- Recommended stretch goal: incorporate ≥5 additional primitives (Breadcrumb, HoverCard, Tooltip, Sheet, AlertDialog) across customer journeys in the next iteration.
