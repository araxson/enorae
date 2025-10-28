# Business Portal Architecture Violations - Remaining Work

## Summary
Total violations: 60+ files
Completed: 2 files (sections.tsx, dynamic-pricing-dashboard.tsx)
Remaining: 58+ files

## Progress Update

### COMPLETED
1. ✅ pricing/components/pricing-rules-form/sections.tsx (379 → 4 lines)
   - Split into 4 separate section files
   - Created: rule-basics-section.tsx, adjustment-section.tsx, schedule-section.tsx, validity-section.tsx

2. ✅ pricing/components/dynamic-pricing-dashboard.tsx (359 → 119 lines)
   - Split into 4 components
   - Created: dynamic-pricing-summary-cards.tsx, pricing-rules-tab.tsx, price-scenarios-tab.tsx, revenue-insights-tab.tsx

## Critical Remaining Work

### Priority 1: API Files > 300 Lines (MUST FIX)

**Queries:**
1. insights/api/customer-analytics.ts (441 lines - 5 functions)
   - Split into: customer-lifetime-value.ts, retention-metrics.ts, customer-cohorts.ts, customer-segments.ts, top-customers.ts

2. insights/api/churn-prediction.ts (348 lines)
   - Analyze and split by function

3. insights/api/business-insights.ts (345 lines)
   - Analyze and split by function

**Mutations:**
1. services/api/mutations/create-service.mutation.ts (359 lines)
   - Extract validation, helpers, and split logic

2. settings-roles/api/mutations/settings-roles.ts (312 lines)
   - Split by operation (create, update, delete, assign, etc.)

3. notifications/api/actions.ts (327 lines)
   - Split by notification type or action

### Priority 2: Components > 280 Lines (Critical)

1. insights/components/customer-insights-dashboard.tsx (317)
   - Extract: summary cards, charts, insight sections

2. settings-audit-logs/components/audit-logs-table.tsx (284)
   - Extract: table columns, filters, row components

3. locations/components/address-form/sections/map-integration-section.tsx (284)
   - Extract: map display, controls, validation

4. insights/components/business-insights-dashboard.tsx (281)
   - Extract: dashboard sections, cards

5. appointments/components/appointment-services-manager.tsx (280)
   - Extract: service list, service item, actions

### Priority 3: Components 260-280 Lines (High)

1. coupons/components/bulk-coupon-generator.tsx (271)
2. service-performance-analytics/components/service-performance-dashboard.tsx (262)
3. coupons/components/coupon-analytics-overview.tsx (262)
4. metrics-operational/components/operational-dashboard.tsx (259)

### Priority 4: Index Files > 80 Lines (Critical)

1. pricing/index.tsx (107) - Needs simplification
2. customer-analytics/index.tsx (95) - Needs simplification
3. analytics/index.tsx (88) - Needs simplification

### Priority 5: Index Files 60-80 Lines (High)

1. metrics/index.tsx (79)
2. time-off/index.tsx (72)
3. service-performance-analytics/index.tsx (72)
4. staff/index.tsx (66)
5. appointments/index.tsx (63)

### Priority 6: Index Files 50-60 Lines (Medium)

1. services/index.tsx (57)
2. operating-hours/index.tsx (56)
3. media/index.tsx (54)
4. coupons/index.tsx (54)
5. settings-account/index.tsx (53)
6. settings/index.tsx (51)

### Priority 7: Components 240-260 Lines (Medium)

1. webhooks/components/webhook-monitoring-dashboard.tsx (255)
2. appointments/components/add-service/add-service-dialog-client.tsx (248)
3. dashboard/components/dashboard-filters.tsx (241)

### Priority 8: Components 220-240 Lines (Lower)

1. pricing/components/bulk-pricing-adjuster.tsx (225)
2. appointments/components/appointment-service-progress.tsx (225)
3. settings/components/settings-form.tsx (224)
4. appointments/components/edit-service-dialog.tsx (220)

### Priority 9: Components 200-220 Lines (Marginal - 13 files)

These are close to the limit but should still be addressed:
- business-common/components/revenue-card.tsx (219)
- reviews/components/reviews-list/review-card.tsx (217)
- staff-schedules/components/schedules-grid.tsx (215)
- notifications/components/notification-templates-manager.tsx (212)
- coupons/components/coupon-card.tsx (212)
- booking-rules/components/booking-rule-form.tsx (211)
- webhooks/components/webhook-list.tsx (210)
- operating-hours/components/weekly-schedule-form.tsx (210)
- service-categories/components/category-form.tsx (209)
- appointments/components/add-service-dialog.tsx (208)
- transactions/components/create-transaction-dialog.tsx (207)
- chains/components/chain-detail-view.tsx (203)
- business-common/components/metric-card.tsx (201)

## Recommended Approach

### Phase 1: API Violations (Critical - Blocks TypeScript)
Fix all API files > 300 lines first (6 files). These are server-side and most critical.

### Phase 2: Index Files (Critical - Affects Architecture)
Fix all index files > 50 lines (14 files). These affect import structure.

### Phase 3: Critical Components (> 280 lines)
Fix the 5 largest components that significantly exceed limits.

### Phase 4: High Priority Components (260-280 lines)
Fix the next 4 components that moderately exceed limits.

### Phase 5: Remaining Components
Work through remaining components in order of size.

## Splitting Strategies

### API Files:
- Split by function/operation
- Extract helpers/utils
- Create separate files per major operation
- Use index.ts to re-export

### Components:
- Extract sub-components (cards, sections, forms)
- Extract table components (columns, rows, filters)
- Extract dialog/modal content
- Extract form sections
- Create hooks for complex logic

### Index Files:
- Remove inline logic
- Simplify Suspense wrapping
- Move loading states to separate files
- Remove unnecessary comments

## After Fixing All Violations

1. Update all components/index.ts files to export new components
2. Run `pnpm typecheck` to verify
3. Test affected features
4. Create PR with systematic fixes

## Estimated Work
- API files: ~3-4 hours
- Index files: ~2-3 hours
- Critical components: ~4-5 hours
- Remaining components: ~6-8 hours
- Testing & verification: ~2 hours
**Total: ~17-22 hours**
