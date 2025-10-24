# Fixes Checklist

## ✅ Task: Admin Dashboard Badge Conformance
- [ ] Review shadcn/ui badge documentation for default spacing and typography
- [ ] Remove badge-level className overrides at `features/admin/dashboard/admin-dashboard.tsx:142`
- [ ] Remove badge-level className overrides at `features/admin/dashboard/admin-dashboard.tsx:164`
- [ ] Shift spacing to icon `className` or surrounding flex containers
- [ ] Verify desktop and mobile header layouts after changes
- [ ] Mark complete

## ✅ Task: User Role Stats Badge Cleanup
- [ ] Audit badge usages at `features/admin/dashboard/components/user-role-stats.tsx:73`, `:79`, `:96`
- [ ] Strip custom className props from each badge instance
- [ ] Add inline icon spacing via `mr-*` utilities where needed
- [ ] Confirm scroll area layout still fits within card content
- [ ] Mark complete

## ✅ Task: Revenue Tab Slot Usage
- [ ] Update badge at `features/admin/dashboard/components/admin-overview-revenue-tab.tsx:47` to use default styling
- [ ] Move text separation into nested spans if additional emphasis is needed
- [ ] Retest tooltip trigger spacing inside the flex row
- [ ] Mark complete

## ✅ Task: Reviews Tab Slot Usage
- [ ] Remove badge overrides at `features/admin/dashboard/components/admin-overview-reviews-tab.tsx:47`
- [ ] Apply icon margin for `Star` to maintain visual spacing
- [ ] Validate the nested card layout for each review row
- [ ] Mark complete

## ✅ Task: Users Table Badge Styling
- [ ] Replace the desktop wrapper (`features/admin/users/components/users-table.tsx:60`) with a card or scroll container per patterns
- [ ] Strip `className="text-xs"` from role badges at `features/admin/users/components/users-table.tsx:114` and `:199`
- [ ] Ensure role badges retain icon spacing after cleanup
- [ ] Regression test action menu interactions on desktop and mobile layouts
- [ ] Mark complete

## ✅ Task: Health Overview Metric Badges
- [ ] Remove `className="w-fit"` from metric badges at `features/admin/database-health/components/health-overview.tsx:80`
- [ ] Align metrics using container flex utilities if necessary
- [ ] Verify card grid maintains consistent widths
- [ ] Mark complete

## ✅ Task: Chain Compliance Table Badges
- [ ] Replace border wrapper at `features/admin/chains/components/chain-compliance.tsx:31` with an approved shadcn container
- [ ] Remove `className="text-xs"` from issue badges at `features/admin/chains/components/chain-compliance.tsx:81`
- [ ] Confirm badges remain legible with icon spacing adjustments
- [ ] Mark complete

## ✅ Task: Salon Chains Subscription Badge
- [ ] Replace border wrapper at `features/admin/chains/components/salon-chains-client.tsx:36`
- [ ] Remove `className="capitalize"` from subscription badge at `features/admin/chains/components/salon-chains-client.tsx:64`
- [ ] Format subscription tier strings before rendering or with nested span utilities
- [ ] Validate table scroll/overflow behaviour after adjustments
- [ ] Mark complete
