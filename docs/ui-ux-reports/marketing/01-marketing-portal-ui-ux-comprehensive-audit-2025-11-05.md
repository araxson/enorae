# Marketing Portal - UI/UX Comprehensive Audit
**Date:** 2025-11-05  
**Scope:** Marketing portal surfaces (`features/marketing/*`, marketing layout components)  
**Auditor:** Codex UI/UX Agent  
**Files Audited:**
- `features/marketing/components/common/marketing-panel.tsx`
- `features/marketing/components/common/marketing-hero.tsx`
- `features/marketing/components/common/testimonial-card.tsx`
- `features/marketing/components/common/trust-badge.tsx`
- `features/marketing/explore/sections/listing/listing.tsx`
- `features/marketing/explore/sections/listing/search-header.tsx`
- `features/marketing/services-directory/sections/category-navigation/popular-services-widget.tsx`
- `features/marketing/services-directory/sections/services-grid/service-card.tsx`
- `features/marketing/salon-directory/sections/salon-filters/salon-filters.tsx`
- `features/marketing/components/layout/header/user-dropdown.tsx`

---

## Executive Summary

### Overall Assessment
The marketing portal leans heavily on a single shadcn primitive (`Item`) and custom wrapper components that override slot styling. This breaks the “pure component” directive, introduces maintainability risk, and blocks broader component diversity. Critical fixes should re-center on unmodified shadcn slots, then layer composition using documented wrappers.

### Key Strengths
- Server actions and form flows already leverage shadcn feedback primitives (`Alert`, `Sonner`) with accessibility hooks.
- Empty states exist for key directories, giving a baseline pattern to refine.
- Layout utilities (`MarketingSection`, `ButtonGroup`, `NavigationMenu`) provide consistent spacing scaffolds despite the styling gaps.

### Issues Found
- 2 critical violations (slot styling + missing import) requiring immediate remediation.
- 3 high-priority gaps impacting component selection and structural clarity.
- 3 medium issues around visual consistency and missing states.
- 2 low-level cleanups to align with “pure” component usage.

### Component Usage Statistics
- 163 shadcn imports across 25 unique components (46% of the available 54).
- Top use: `Item` (60 instances, 37% of all imports), `Button` (26), `ButtonGroup` (15).
- Structural components such as `Accordion` (3) and `Tabs` (2) appear sparsely; `Card` only twice.
- 28 components unused: alert-dialog, aspect-ratio, calendar, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, drawer, form, input-otp, label, menubar, popover, progress, radio-group, resizable, scroll-area, sidebar, skeleton, slider, switch, table, toggle, toggle-group, tooltip.

## Detailed Findings

### CRITICAL

#### Issue #1
- **Description:** `MarketingPanel` overrides `ItemTitle`, `ItemDescription`, and `ItemActions` slot classes, directly violating the shadcn rule against styling slots and creating inconsistent spacing across consumers.
- **Location:** `features/marketing/components/common/marketing-panel.tsx:46`
- **Category:** Style Overlap / shadcn slot misuse
- **Current Snippet:**
```tsx
{title ? <ItemTitle className={textAlignment}>{title}</ItemTitle> : null}
{description ? (
  <ItemDescription className={textAlignment}>{description}</ItemDescription>
) : null}
{actions ? (
  <ItemActions className={cn('flex flex-wrap gap-3', actionAlignment)}>
    {actions}
  </ItemActions>
) : null}
```
- **Proposed Fix:** Remove slot-level class overrides and move alignment concerns into surrounding wrappers (e.g., wrap `ItemTitle` in a flex container that receives `text-center`). Supply spacing via `ItemContent` or `ItemGroup`, keeping slots untouched.
- **Recommended shadcn/ui Component:** `Item` family (`Item`, `ItemContent`, `ItemGroup`)
- **Estimated Effort:** 0.5 day (impacts every consumer of `MarketingPanel`)

#### Issue #2
- **Description:** `PopularServicesWidget` renders `<ItemMedia>` but never imports it, leading to a runtime `ReferenceError` when the widget shows.
- **Location:** `features/marketing/services-directory/sections/category-navigation/popular-services-widget.tsx:39`
- **Category:** Component integrity / missing import
- **Current Snippet:**
```tsx
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
...
<ItemMedia variant="icon">
  <Badge variant="secondary">#{index + 1}</Badge>
</ItemMedia>
```
- **Proposed Fix:** Import `ItemMedia` from `@/components/ui/item` (and audit other exports) or shift the badge into `ItemContent` if media is unnecessary.
- **Recommended shadcn/ui Component:** `ItemMedia`
- **Estimated Effort:** <1 hour

### HIGH

#### Issue #1
- **Description:** Explore filters use `Tabs` purely as a button group, adding manual sizing classes on `TabsList` and `TabsTrigger` instead of leveraging a selection primitive meant for single-choice filters.
- **Location:** `features/marketing/explore/sections/listing/listing.tsx:157`
- **Category:** Component selection / limited diversity
- **Current Snippet:**
```tsx
<TabsList
  aria-label={listingCopy.filtersLabel}
  className="grid w-full gap-2 sm:inline-flex sm:w-auto"
>
  {listingFilters.map((filter) => (
    <TabsTrigger key={filter.value} value={filter.value} className="px-4 py-1.5">
      {filter.label}
    </TabsTrigger>
  ))}
</TabsList>
```
- **Proposed Fix:** Replace with `ToggleGroup` (`type="single"`) or `ButtonGroup` + `Toggle` to express filter chips without custom padding classes, keeping `Tabs` for true panel switching.
- **Recommended shadcn/ui Component:** `ToggleGroup`
- **Estimated Effort:** 0.5 day (includes state wiring & styling removal)

#### Issue #2
- **Description:** Salon filters rely on `SelectTrigger className="w-52"` and `ItemDescription className="text-sm text-muted-foreground"`, layering layout concerns on slots across multiple inputs.
- **Location:** `features/marketing/salon-directory/sections/salon-filters/salon-filters.tsx:76`
- **Category:** Style overlap / form composition
- **Current Snippet:**
```tsx
<SelectTrigger className="w-52">
  <MapPin className="mr-2 size-4" aria-hidden="true" />
  <SelectValue placeholder="Select city" />
</SelectTrigger>
...
<ItemDescription className="text-sm text-muted-foreground">
  Press <Kbd>Enter</Kbd> inside the search field to apply filters instantly.
</ItemDescription>
```
- **Proposed Fix:** Move width constraints to surrounding `FieldContent` wrappers, lean on `InputGroup` prefixes, and use `FieldHint` (via `Field` compound slots) instead of styling `ItemDescription`.
- **Recommended shadcn/ui Component:** `Field` + `InputGroup`
- **Estimated Effort:** 1 day (affects multiple filter sections)

#### Issue #3
- **Description:** `TestimonialCard` nests multiple `Item` components to mimic cards, producing redundant borders and uneven spacing rather than reusing `Card` with a structured header/content/footer.
- **Location:** `features/marketing/components/common/testimonial-card.tsx:18`
- **Category:** Component redundancy / hierarchy
- **Current Snippet:**
```tsx
<Item variant="outline">
  <div className="flex h-full flex-col gap-4">
    <Item variant="muted">
      ...
    </Item>
    <Item variant="muted" aria-label={`Rating ${rating} out of 5`}>
      ...
    </Item>
    <Item variant="outline">
      <ItemContent>
        <ItemDescription>&ldquo;{content}&rdquo;</ItemDescription>
      </ItemContent>
    </Item>
  </div>
</Item>
```
- **Proposed Fix:** Swap to a single `Card` with `CardHeader`, `CardContent`, `CardFooter`, and use `Badge` or `Separator` to isolate rating metrics; reserve `Item` for inline rows.
- **Recommended shadcn/ui Component:** `Card`
- **Estimated Effort:** 0.5 day (shared component rewrite + consumer updates)

### MEDIUM

#### Issue #1
- **Description:** Empty states across explore and directories inject custom borders/backgrounds via `className="border border-border/50 bg-card/40"`, drifting from the default `Empty` styling and creating inconsistent visuals.
- **Location:** `features/marketing/explore/sections/listing/empty-state.tsx:21`
- **Category:** Style overlap / visual consistency
- **Current Snippet:**
```tsx
<Empty className="border border-border/50 bg-card/40 py-12">
  ...
</Empty>
```
- **Proposed Fix:** Use documented `variant` props or wrap `Empty` in a parent `Item`/`Card` when an outlined treatment is required, keeping the component itself unstyled.
- **Recommended shadcn/ui Component:** `Empty`
- **Estimated Effort:** 0.25 day

#### Issue #2
- **Description:** `ServiceCard` adjusts `CardDescription` and `CardFooter` spacing using `className`, rather than composing with `Item` rows or `Separator`.
- **Location:** `features/marketing/services-directory/sections/services-grid/service-card.tsx:37`
- **Category:** Style overlap / card composition
- **Current Snippet:**
```tsx
<CardHeader>
  <div className="flex flex-wrap items-center gap-4">
    ...
  </div>
  <CardTitle>{service['name']}</CardTitle>
  {service['description'] ? (
    <CardDescription className="line-clamp-3">{service['description']}</CardDescription>
  ) : null}
</CardHeader>
...
<CardFooter className="justify-end">
  <Button asChild>
    <Link href={`/services/${service['category_slug']}`}>View salons</Link>
  </Button>
</CardFooter>
```
- **Proposed Fix:** Move layout classes into wrapper `div`s inside `CardHeader`/`CardFooter`, or use `ItemGroup` in the body to handle spacing without styling the slots.
- **Recommended shadcn/ui Component:** `Card`
- **Estimated Effort:** 0.5 day

#### Issue #3
- **Description:** Listing grid renders data immediately with no interim skeleton or spinner, so async fetches flash empty space before results.
- **Location:** `features/marketing/explore/sections/listing/listing.tsx:191`
- **Category:** Missing loading states
- **Current Snippet:**
```tsx
{totalResults === 0 ? (
  <EmptyState onReset={handleReset} />
) : (
  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {paginatedSalons.map((salon, index) => (
      <SalonCard ... />
    ))}
  </div>
)}
```
- **Proposed Fix:** Introduce `Skeleton` placeholders or a `Spinner` while filters debounce, leveraging `Spinner` within `Button` or overlay.
- **Recommended shadcn/ui Component:** `Skeleton`
- **Estimated Effort:** 0.5 day

### LOW

#### Issue #1
- **Description:** Search CTA button adds `className="gap-2"` to the slot instead of using the documented icon-button spacing pattern.
- **Location:** `features/marketing/explore/sections/listing/search-header.tsx:69`
- **Category:** Minor style overlap
- **Current Snippet:**
```tsx
<Button type="button" className="gap-2" onClick={onSearch}>
  <Search className="size-4" aria-hidden="true" />
  {listingCopy.searchButton}
</Button>
```
- **Proposed Fix:** Use `Button` `size="lg"` or wrap icon + label with `InputGroupButton`, or place icon in `startIcon` slot (when available) to retain default spacing.
- **Recommended shadcn/ui Component:** `Button`
- **Estimated Effort:** <1 hour

#### Issue #2
- **Description:** `TrustBadge` exposes a `className` passthrough that invites inconsistent styling downstream.
- **Location:** `features/marketing/components/common/trust-badge.tsx:32`
- **Category:** API surface / style drift
- **Current Snippet:**
```tsx
export function TrustBadge({ type, text, variant = 'outline', className }: TrustBadgeProps) {
  ...
  return (
    <Badge variant={variant} className={className} aria-label={displayText}>
      <Icon className="mr-1 size-3" aria-hidden="true" />
      {displayText}
    </Badge>
  )
}
```
- **Proposed Fix:** Remove the `className` prop or constrain it to documented modifiers (e.g., expose `size` enum) so consuming sections rely on `variant` only.
- **Recommended shadcn/ui Component:** `Badge`
- **Estimated Effort:** <1 hour

## Component Inventory
- **Usage breadth:** 25 of 54 components (46%) appear in marketing, dominated by `Item`, `Button`, and `ButtonGroup`.
- **Underrepresented patterns:** `Tabs`, `Accordion`, `Avatar`, and `Select` are used superficially; `Card`, `Dialog`, `Drawer`, and `Command` are absent from key flows (pricing, navigation, global search).
- **Unused opportunities:** Command palette for global search, `Carousel` for testimonials, `Skeleton`/`Spinner` for loading, `ContextMenu` or `DropdownMenu` for card actions, `Popover` for quick filters, and `Table` for pricing comparison.
- **Action:** Establish targets per surface (e.g., hero uses `Item + HoverCard`, testimonials adopt `Carousel`, filters adopt `Combobox`).

## Style Overlap & Cleanup
- Remove slot-level class overrides (`ItemTitle`, `ItemDescription`, `CardDescription`) and shift styling into wrapper elements or variants.
- Unify empty-state visuals by relying on `Empty` defaults and placing decorative outlines on parent `Item` components.
- De-duplicate nested `Item` stacks; adopt `Card`, `Separator`, or `Badge` to provide hierarchy.
- Audit shared components (`MarketingPanel`, `MarketingHero`, `TrustBadge`) to ensure they expose semantic props/variants instead of free-form classes.

## Implementation Roadmap
- **Phase 1 (Critical / 1 day):** Fix slot overrides in `MarketingPanel` + `MarketingHero`, restore missing `ItemMedia` import, run smoke tests on shared components.
- **Phase 2 (High / 2 days):** Replace filter tabs with `ToggleGroup`, refactor `SalonFilters`, rebuild `TestimonialCard` with `Card`, add documented variants where needed.
- **Phase 3 (Medium / 2 days):** Normalize empty states, update `ServiceCard` layout, introduce skeleton/spinner patterns for data fetches.
- **Phase 4 (Enhancements / backlog):** Expand component diversity (e.g., `Carousel` for testimonials, `Command` search), evaluate drawer/dialog patterns for mobile navigation.

## Testing Checklist
- Keyboard navigation through new toggles, selects, and dialogs.
- Screen reader verification for refactored panels and badges (no lost ARIA labels).
- Responsive breakpoints for filter trays, testimonial carousel, and pricing cards.
- Visual regression or Percy run covering hero, explore, services, and footer.
- Manual smoke test of server actions (newsletter, contact form) after component swaps.

## Conclusion
The marketing portal presents cohesive content but breaks core shadcn usage rules. Addressing slot overrides and diversifying primitives will restore consistency, unlock richer patterns, and reduce duplication. Prioritize shared component refactors first, then layer in new components to elevate the experience.

## Appendix

### Component Usage Strategy
- **Hero & headline sections:** `ItemGroup` + `Item` for content, `HoverCard`/`Badge` for highlights, avoid slot overrides by styling container `div`s.
- **Filters & controls:** `ToggleGroup` or `Combobox` (`Command` + `Popover`) for interactive filters, `InputGroup` for search with clear buttons.
- **Testimonials & social proof:** `Carousel` with `Card` slides, `Avatar` for author, `Separator` between quote and metrics.
- **Pricing & plan comparisons:** `Table` or `Card` grid with `Badge` for Highlights, `ButtonGroup` for CTAs, `Accordion` for FAQs per plan.

### Raw Component Usage Counts
`Item` 60 · `Button` 26 · `ButtonGroup` 15 · `Empty` 11 · `Badge` 9 · `Separator` 7 · `Breadcrumb` 5 · `Accordion` 3 · `InputGroup` 3 · `Avatar` 3 · `Tabs` 2 · `Alert` 2 · `Field` 2 · `Spinner` 2 · `Kbd` 2 · `Card` 2 · `Input` 1 · `Textarea` 1 · `Select` 1 · `DropdownMenu` 1 · `Sheet` 1 · `NavigationMenu` 1 · `HoverCard` 1 · `Pagination` 1 · `Sonner` 1.

### Underutilized Components
alert-dialog, aspect-ratio, calendar, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, drawer, form, input-otp, label, menubar, popover, progress, radio-group, resizable, scroll-area, sidebar, skeleton, slider, switch, table, toggle, toggle-group, tooltip.
