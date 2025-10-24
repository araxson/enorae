# Fixes Checklist

## ✅ Task: Rebuild AppointmentResource with shadcn Card
- [x] Read the official shadcn/ui Card documentation
- [x] Replace the custom `<div>` wrapper with `Card`, `CardHeader`, and `CardContent`
- [x] Express the accent through a Badge variant or outer layout element instead of root classes
- [x] Ensure all typography uses `CardTitle`/`CardDescription`
- [x] Verify the resource grid still aligns within `MetricsCards`
- [x] Mark complete

## ✅ Task: Remove Progress selector overrides
- [x] Audit `metrics-cards.tsx` for `[&>div]` progress selectors
- [x] Update `AppointmentMetricCard` to rely on plain `<Progress value={...} />`
- [x] Surface contextual accent using helper text or Badge instead of indicator color hacks
- [x] Confirm no regressions in pending-state visuals
- [x] Mark complete

## ✅ Task: Normalize metric card accent styling
- [x] Review accent usage on `AppointmentMetricCard` and `RevenueMetricCard`
- [x] Move border/hover styling into a layout wrapper or variant-friendly helper
- [x] Keep `Card` root free of non-layout classes
- [x] Validate hover/focus states after adjustments
- [x] Mark complete

## ✅ Task: Replace revenue description paragraph
- [x] Swap the styled `<p>` for `CardDescription`
- [x] Remove conflicting text size utilities from the component
- [x] Verify typography matches the Card pattern reference
- [x] Mark complete

## ✅ Task: Standardize chain overview tiles
- [x] Remove inline accent classes from nested Cards in `dashboard-chain-overview.tsx`
- [x] Apply any necessary accent outside the Card primitive
- [x] Check tooltip trigger layout after the change
- [x] Mark complete

## ✅ Task: Clean badge spacing overrides
- [x] Remove `className` overrides from toolbar and filter badges
- [x] Introduce inner flex wrappers where spacing is still needed
- [x] Confirm badges render correctly at different breakpoints
- [x] Mark complete

## ✅ Task: Drop badge typography override in RecentBookings
- [x] Delete the `text-xs` class from status badges
- [x] Verify badge text still aligns with avatar and labels
- [x] Mark complete

## ✅ Task: Regression check for QuickActions
- [x] Re-run visual inspection after upstream fixes
- [x] Ensure no new wrapper or slot overrides were introduced
- [x] Mark complete

## ✅ Task: Normalize notification badges
- [x] Update history table channel badges to use inner spans
- [x] Refactor template manager badges to avoid root class overrides
- [x] Mirror the pattern in `TemplateCard`
- [x] Verify tooltip and dropdown interactions still behave
- [x] Mark complete

## ✅ Task: Align staff service badges
- [x] Wrap assigned-service badges in span wrappers instead of Badge className
- [x] Rework bulk assign label layout to keep Badge pristine
- [x] Ensure service lists render correctly on narrow viewports
- [x] Mark complete

## ✅ Task: Clean analytics and reviews badges
- [x] Update dashboard reviews counters to use inner spans
- [x] Normalize insights badges (business + customer panels)
- [x] Remove destructive badge typography overrides in customer lists
- [x] Mark complete

## ✅ Task: Address validation & operational chips
- [x] Route address validation badge styling through inner spans
- [x] Update staff performance badges to reuse the pattern
- [x] Fix webhook monitor and audit log status chips
- [x] Mark complete

## ✅ Task: Shared stat badge helper
- [x] Introduce inner span layout with `cn`
- [x] Ensure both stat helpers preserve optional className passthrough
- [x] Mark complete
