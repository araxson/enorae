# Shared Portal - UI/UX Comprehensive Audit (November 2025 Refresh)
**Date:** 2025-11-05  
**Scope:** Shared portal shell, shared feature primitives, cross-portal UI scaffolding  
**Auditor:** Codex (UI/UX Specialist)  
**Status:** Audit only  
**Files Audited:**
- `features/shared/ui/components/data-display/metrics-grid.tsx`
- `features/shared/profile/components/profile-edit-form.tsx`
- `features/shared/ui/components/buttons/action-button.tsx`
- `features/shared/sessions/components/session-list.tsx`
- `features/shared/ui/components/filters/date-range-filter.tsx`
- `features/shared/portal-shell/components/navigation/portal-quick-nav.tsx`
- `features/shared/ui/components/buttons/refresh-button.tsx`
- `features/shared/dashboard/components/data-refresh-controls.tsx`
- `features/shared/ui/components/loading/loading-wrapper.tsx`
- `features/shared/customer-common/components/photo-gallery.tsx`

---

## Executive Summary
### Overall Assessment
Shared portal surfaces continue to lean on shadcn/ui primitives, but several foundational patterns drift from the "pure component" mandate. The metrics layout grid is functionally broken, success alerts override base styling, and toast feedback bypasses the themed Sonner wrapper. These gaps erode consistency, especially when shared primitives feed multiple portals.

### Key Strengths
- Strong adoption of semantic primitives (`Item`, `Field`, `Empty`) keeps content accessible.
- Dialog, Sheet, and Tabs are composed per documentation with appropriate triggers.
- Loading states exist via shared skeletons and spinner wrappers, preventing blank screens.
- Notification center blends Tabs + Sheet for responsive filtering with clear hierarchy.

### Issues Found
- Critical layout bug in `MetricsGrid` leaves metrics locked to a single-column grid.
- Success messaging still customizes `Alert` backgrounds in profile flows.
- Toast feedback uses raw `sonner` imports instead of the shared wrapper, risking theme drift.
- Filters and quick navigation override component styling instead of using documented variants.

### Component Usage Statistics
- 40 / 54 shadcn/ui components in use (74.1% coverage) across shared portal code.
- 216 total shared-portal imports; top usage: `button` (16.2%), `item` (12.5%), `field` (7.9%), `spinner` (6.9%), `alert` (6.0%).
- Unused primitives: `carousel`, `chart`, `drawer`, `form`, `hover-card`, `input-otp`, `menubar`, `native-select`, `pagination`, `resizable`, `slider`, `sonner`, `toggle`, `toggle-group`.

## Detailed Findings
### CRITICAL
#### Issue #1 — MetricsGrid ignores responsive column mapping
- **Description:** `MetricsGrid` computes responsive column counts (`cols`) and accepts a `gap` prop, but renders a static `div` with `className="grid gap-6"`. Metric cards therefore stack in a single column, defeating the documented layout contract and creating inconsistent dashboards.
- **Location:** `features/shared/ui/components/data-display/metrics-grid.tsx:35`
- **Category/Type:** Layout / Composition
- **Current Snippet:**
  ```tsx
  export function MetricsGrid({ children, maxColumns = 4, gap = 'lg' }: MetricsGridProps) {
    const cols = maxColumns === 4
      ? ({ base: 1, sm: 2, lg: 3, xl: 4 } as const)
      : maxColumns === 3
      ? ({ base: 1, sm: 2, lg: 3 } as const)
      : ({ base: 1, lg: 2 } as const)

    return (
      <div className="grid gap-6">
        {children}
      </div>
    )
  }
  ```
- **Proposed Fix:** Map the computed breakpoints into Tailwind utility classes (e.g., `grid-cols-1 sm:grid-cols-2`) and derive the gap token from a `gapClassMap`. Consider switching to `ItemGroup` to guarantee a semantic wrapper around `Item` metrics while applying responsive utilities at the group level.
- **Recommended shadcn/ui Component:** `ItemGroup`
- **Estimated Effort:** 3–4 hours (rebuild grid helper, regression-test dashboards)

#### Issue #2 — Success alerts override base styling instead of variants
- **Description:** Profile success messaging decorates `Alert` with custom green border/background utilities, breaking the "pure component" rule and risking inconsistent theming when the alert palette updates.
- **Location:** `features/shared/profile/components/profile-edit-form.tsx:89`
- **Category/Type:** Style Overlap / Feedback
- **Current Snippet:**
  ```tsx
  {state?.success && (
    <Alert variant="default" className="border-green-200 bg-green-50">
      <CheckCircle className="size-4 text-green-600" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        {state.message}
      </AlertDescription>
    </Alert>
  )}
  ```
- **Proposed Fix:** Keep styling on wrappers, not the `Alert` root. Either extend shared variants (e.g., add `variant="success"`) or pair a neutral `Alert` with semantic accents (`Badge`, `Item` wrapper) to achieve contrast without overriding defaults.
- **Recommended shadcn/ui Component:** `Alert`
- **Estimated Effort:** 2–3 hours (update success messaging across shared forms)

### HIGH
#### Issue #1 — Toast feedback bypasses shared Sonner wrapper
- **Description:** `ActionButton` and `SessionList` import `{ toast }` directly from `sonner`, sidestepping the themed `@/components/ui/sonner` helper. The direct import ignores shared configuration (position, accent colors) and duplicates initialization risk.
- **Location:** `features/shared/ui/components/buttons/action-button.tsx:6`
- **Category/Type:** Feedback / Consistency
- **Current Snippet:**
  ```tsx
  import { Button } from '@/components/ui/button'
  import { Spinner } from '@/components/ui/spinner'
  import { toast } from 'sonner'
  ```
- **Proposed Fix:** Import `toast` from `@/components/ui/sonner`, ensure the portal-level `<Toaster />` remains mounted once, and expose helper functions if extra variants are needed.
- **Recommended shadcn/ui Component:** `Sonner`
- **Estimated Effort:** 1 hour (update imports + smoke test toasts)

#### Issue #2 — DateRangeFilter overrides Button & Popover styling
- **Description:** The shared date range filter flattens `Button` and `PopoverContent` with bespoke utility classes (`justify-start text-left font-normal w-full`, `w-auto p-0`). This diverges from documented button spacing and popover padding, leading to inconsistent focus states and cramped calendar layouts.
- **Location:** `features/shared/ui/components/filters/date-range-filter.tsx:49`
- **Category/Type:** Style Overlap / Interaction
- **Current Snippet:**
  ```tsx
  <PopoverTrigger asChild>
    <Button variant="outline" className="justify-start text-left font-normal w-full">
      <Calendar className="mr-2 size-4" />
      {displayText}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    ...
  </PopoverContent>
  ```
- **Proposed Fix:** Use the documented `Button` `size="lg"` or `width="full"` pattern instead of custom utilities, and rely on `PopoverContent` default padding while wrapping calendars in `FieldSet` for spacing. Bring trailing actions into a `ButtonGroup` to maintain button geometry.
- **Recommended shadcn/ui Component:** `ButtonGroup`
- **Estimated Effort:** 2–3 hours (refine filter styling + regression pass on filter consumers)

### MEDIUM
#### Issue #1 — Quick navigation lacks active affordance & modern link composition
- **Description:** `PortalQuickNav` still uses `legacyBehavior` Link wrapping and omits `NavigationMenuLink` `active` states, so current route highlighting disappears and Next.js warns about deprecated composition.
- **Location:** `features/shared/portal-shell/components/navigation/portal-quick-nav.tsx:36`
- **Category/Type:** Navigation / Accessibility
- **Current Snippet:**
  ```tsx
  <NavigationMenuItem key={item.href}>
    <Link href={item.href} legacyBehavior passHref>
      <NavigationMenuLink>
        {item.label}
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
  ```
- **Proposed Fix:** Use `NavigationMenuLink` with `asChild` and pass an `aria-current="page"` flag when the pathname matches. Include `NavigationMenuIndicator` or `NavigationMenuViewport` to surface the active state per shadcn docs.
- **Recommended shadcn/ui Component:** `NavigationMenu`
- **Estimated Effort:** 2 hours (update composition + responsive QA)

#### Issue #2 — Refresh actions duplicated across shared UI
- **Description:** `RefreshButton` and `DataRefreshControls` implement similar refresh spinners, transitions, and aria handling separately. Divergent logic (timeouts, tooltips) risks inconsistent feedback depending on which surface gets wired.
- **Location:** `features/shared/ui/components/buttons/refresh-button.tsx:1`
- **Category/Type:** Redundancy / Interaction
- **Current Snippet:**
  ```tsx
  export function RefreshButton({ onRefresh }: RefreshButtonProps) {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)
    ...
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? <Spinner /> : <RefreshCw className="size-4" />}
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </Button>
    )
  }
  ```
- **Proposed Fix:** Consolidate refresh affordances into one shared primitive (e.g., enhance `RefreshButton` with optional relative timestamp + tooltip) and reuse it within dashboards to avoid divergent spinner timing and copy.
- **Recommended shadcn/ui Component:** `Button`
- **Estimated Effort:** 3 hours (consolidate logic + update call sites)

#### Issue #3 — Loading overlay hard-codes light/dark surfaces
- **Description:** `LoadingWrapper` renders a custom translucent overlay (`bg-white/30` / `dark:bg-black/30`) that may clash with themed surfaces and ignores accent states (e.g., tinted cards). Using pure `Spinner` with `Dialog`/`Sheet` layering would keep overlays consistent.
- **Location:** `features/shared/ui/components/loading/loading-wrapper.tsx:24`
- **Category/Type:** Visual Consistency / Theming
- **Current Snippet:**
  ```tsx
  return (
    <div className="relative" role="status" aria-live="polite" aria-busy="true">
      <div className="opacity-50 pointer-events-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm dark:bg-black/30">
        <Spinner />
        <span className="sr-only">Loading content...</span>
      </div>
    </div>
  )
  ```
- **Proposed Fix:** Replace the custom overlay with shadcn's `Dialog` or `Sheet` primitives for blocking states, or use a `ScrollArea` + `Skeleton` pattern for inline loading. If an overlay is required, adopt CSS variables sourced from theme tokens rather than hard-coded tints.
- **Recommended shadcn/ui Component:** `Dialog`
- **Estimated Effort:** 4 hours (refactor overlay + accessibility validation)

### LOW
#### Issue #1 — Photo gallery lightbox buttons add ad-hoc styling
- **Description:** Lightbox navigation buttons introduce `bg-background/80` overrides on `Button`, deviating from ghost variant expectations and producing inconsistent hover ramps compared to other overlays.
- **Location:** `features/shared/customer-common/components/photo-gallery.tsx:115`
- **Category/Type:** Style Polish / Hover States
- **Current Snippet:**
  ```tsx
  <Button
    variant="ghost"
    size="icon"
    onClick={goToPrevious}
    disabled={selectedIndex === 0}
    className="bg-background/80 text-foreground hover:bg-background"
  >
    <ChevronLeft className="size-6" />
  </Button>
  ```
- **Proposed Fix:** Use documented `ghost` styling with `Backdrop` semantics—wrap buttons in a `ButtonGroup` and rely on overlay containers (`bg-background/90`) instead of overriding the button root. Consider `HoverCard` for previews if richer context is needed.
- **Recommended shadcn/ui Component:** `ButtonGroup`
- **Estimated Effort:** 1–2 hours (adjust styling + hover QA)

## Component Inventory
- **Coverage:** 40 / 54 primitives used (74.1%). `Button`, `Item`, `Field`, `Spinner`, `Alert` account for 49.5% of imports.
- **Underused Opportunities:** `carousel`, `chart`, `drawer`, `form`, `hover-card`, `pagination`, `slider`, `toggle`, `toggle-group`, `sonner` wrapper.
- **States:** Loading handled via `Spinner` (15 uses) and `Skeleton` (3 uses); no shared `Skeleton` variants for cards yet.
- **Navigation vs Discovery:** `Sidebar` (9) and `NavigationMenu` (1) leave breadcrumbs/menus under-leveraged; `Command` palette is the primary quick nav.

## Style Overlap & Cleanup
- Success alerts (`profile-edit-form.tsx`, `username-form.tsx`) add spacing/background directly on `Alert`; move layout spacing to surrounding containers.
- Filters (`date-range-filter.tsx`) and lightboxes (`photo-gallery.tsx`) override `Button` appearance instead of combining primitives (`ButtonGroup`, `Toolbar`).
- Loading overlay hard-codes translucent surfaces; prefer themed tokens or structural primitives for blocking states.
- Legacy Link composition in quick nav bypasses `NavigationMenu` active styling; update to documented `asChild` usage.

## Implementation Roadmap
- **Phase 1 — Critical Fixes (0.5 day):** Repair `MetricsGrid` responsive classes; normalize success alerts across profile flows.
- **Phase 2 — High Priority (0.5–1 day):** Swap raw `sonner` imports for the shared wrapper; restyle the date range filter using pure shadcn components and variants.
- **Phase 3 — Medium Priority (1 day):** Modernize quick nav composition, merge refresh affordances, and replace the custom loading overlay.
- **Phase 4 — Low Priority & Enhancements (0.5 day):** Tidy photo gallery button styling, introduce optional overlays for lightboxes, and evaluate opportunities to introduce underused primitives (e.g., `HoverCard` for image previews).

## Testing Checklist
- Manual responsive test for metrics dashboards once `MetricsGrid` is corrected (mobile, tablet, desktop).
- Verify toast theming by triggering success/error states in `ActionButton`, session revocation, and profile updates.
- Keyboard navigation through quick nav and date filter (ensure focus rings unaffected by styling cleanup).
- Regression tests for loading states: confirm overlay replacements respect aria live regions and do not trap focus.
- Visual diff (Chromatic/Storybook) for photo gallery controls after styling adjustments.

## Conclusion
Resolving the layout regression and purging custom-styled success messaging will restore the shared portal’s baseline consistency. Follow-on work should center on consolidating refresh/toast primitives and reusing shadcn variants to reduce visual drift. Introducing currently unused components (e.g., `Form`, `Drawer`, `HoverCard`) can further diversify interactions once the fundamentals are corrected.

## Appendix
**Component Usage Strategy (Shared Portal)**

| Use Case | Current Pattern | Recommended shadcn/ui Components | Notes |
| --- | --- | --- | --- |
| Metrics dashboards | Custom `div` grid | `ItemGroup`, `Item`, `Badge`, `Chart` | Use responsive `ItemGroup` with chart primitives for variety. |
| Success messaging | `Alert` with custom bg | `Alert`, `Badge`, `Separator` | Lean on variants and separators for emphasis instead of overrides. |
| Async actions | `ActionButton` + raw toast | `Button`, `Sonner`, `Progress` | Wrap async handlers in shared utilities and surface progress when long-running. |
| Date filtering | Custom-styled `Button` | `ButtonGroup`, `Calendar`, `Popover` | Let documented button widths handle alignment; group clear/apply actions. |
| Quick navigation | Legacy `NavigationMenuLink` | `NavigationMenu`, `Breadcrumb` | Combine active states with breadcrumbs for spatial awareness. |
| Lightbox media | Custom overlay | `Dialog`, `HoverCard`, `Carousel` | Use carousel/hover card primitives for richer previews. |

**Component Frequency Snapshot**

| Component | Imports |
| --- | --- |
| button | 35 |
| item | 27 |
| field | 17 |
| spinner | 15 |
| alert | 13 |
| button-group | 12 |
| badge | 11 |
| sidebar | 9 |
| empty | 8 |
| input | 7 |

