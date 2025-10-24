# Component Details

## AppointmentMetricCard
**File**: `features/business/dashboard/components/metric-card.tsx:26`
**Status**: ✅
**Deviations**: 0

### Notes
- Accent stripe now rendered via a dedicated indicator span while the `Card` slot remains unstylized.
- `Progress` uses the default shadcn styles with margin-only spacing and the description moves into `CardDescription`.

---

## RevenueMetricCard
**File**: `features/business/dashboard/components/metric-card.tsx:58`
**Status**: ✅
**Deviations**: 0

### Notes
- Description content now lives in `CardDescription` and the accent stripe mirrors the Appointment card implementation.

---

## MetricsCards
**File**: `features/business/dashboard/components/metrics-cards.tsx:81`
**Status**: ✅
**Deviations**: 0

### Notes
- Resource tiles are composed with shadcn `Card`, `CardHeader`, and `CardContent` and reuse the shared accent stripe helper.
- Pending-state progress relies on default indicator colors; no selector overrides remain.

---

## DashboardChainOverview
**File**: `features/business/dashboard/components/dashboard-chain-overview.tsx:81`
**Status**: ✅
**Deviations**: 0

### Notes
- Tile accents render through the shared stripe helper while nested `Card` components stay free of custom border classes.

---

## DashboardToolbar
**File**: `features/business/dashboard/components/dashboard-toolbar.tsx:66`
**Status**: ✅
**Deviations**: 0

### Notes
- Badge spacing is handled inside a child span, keeping the Badge root untouched.

---

## DashboardFilters
**File**: `features/business/dashboard/components/dashboard-filters.tsx:64`
**Status**: ✅
**Deviations**: 0

### Notes
- The Smart Filters badge now wraps icon + label in an internal flex span, leaving the primitive styling intact.

---

## RecentBookings
**File**: `features/business/dashboard/components/recent-bookings.tsx:95`
**Status**: ✅
**Deviations**: 0

### Notes
- Status badge uses the default typography with no additional font overrides.

---

## QuickActions
**File**: `features/business/business-common/components/quick-actions.tsx:48`
**Status**: ✅
**Deviations**: 0

### Notes
- Component remains aligned with shadcn patterns and required no changes during this pass.

---

## NotificationHistoryTable
**File**: `features/business/notifications/components/notification-history-table.tsx:72`
**Status**: ✅
**Deviations**: 0

### Notes
- Channel badges now wrap their capitalization helper in an inner span so the Badge primitive stays untouched.

---

## NotificationTemplatesManager
**File**: `features/business/notifications/components/notification-templates-manager.tsx:164`
**Status**: ✅
**Deviations**: 0

### Notes
- Channel and event badges use internal spans for capitalization, eliminating root-level class overrides.

---

## TemplateCard
**File**: `features/business/notifications/components/template-card.tsx:28`
**Status**: ✅
**Deviations**: 0

### Notes
- Mirrors the manager updates so badges render with canonical styling.

---

## AssignedServicesList
**File**: `features/business/staff/components/staff-services/assigned-services-list.tsx:26`
**Status**: ✅
**Deviations**: 0

### Notes
- Each badge wraps the service label and remove button in a flex span, keeping the Badge root free of layout classes.

---

## BulkAssignSection
**File**: `features/business/staff/components/staff-services/bulk-assign-section.tsx:58`
**Status**: ✅
**Deviations**: 0

### Notes
- Assigned services now render inside a nested flex span with the Badge primitive untouched.

---

## ReviewsCard
**File**: `features/business/dashboard/components/reviews-card.tsx:101`
**Status**: ✅
**Deviations**: 0

### Notes
- Status counters use inner spans for spacing, so outline/destructive badges follow the default typography.

---

## StaffServicesList
**File**: `features/business/staff/components/staff-services/staff-services-list.tsx:121`
**Status**: ✅
**Deviations**: 0

### Notes
- Service badges expose a shared layout span that controls spacing and text size without altering the Badge root.

---

## AddressValidation
**File**: `features/business/locations/components/address-validation.tsx:94`
**Status**: ✅
**Deviations**: 0

### Notes
- The status helper renders icons and copy through a flex span inside the Badge, removing the prior `gap` overrides.

---

## StaffPerformanceSummary
**File**: `features/business/staff/components/staff-performance-summary.tsx:75`
**Status**: ✅
**Deviations**: 0

### Notes
- Performance badges now encapsulate their typography inside spans to preserve primitive styling.

---

## BusinessInsightsDashboard
**File**: `features/business/insights/components/business-insights-dashboard.tsx:112`
**Status**: ✅
**Deviations**: 0

### Notes
- Insights counter badge wraps icon+copy in an inner span; all other badges already matched the documented pattern.

---

## InsightsCustomerList
**File**: `features/business/insights/components/dashboard/customer-list.tsx:96`
**Status**: ✅
**Deviations**: 0

### Notes
- Cancellation warnings now use an inner span for typography so the destructive badge remains canonical.

---

## CustomerInsightsDashboard
**File**: `features/business/insights/components/customer-insights-dashboard.tsx:172`
**Status**: ✅
**Deviations**: 0

### Notes
- Segment and cancellation badges rely on inner spans for layout, removing all root-level class overrides.

---

## WebhookMonitoringDashboard
**File**: `features/business/webhooks/components/webhook-monitoring-dashboard.tsx:149`
**Status**: ✅
**Deviations**: 0

### Notes
- Failure and status badges now present their text via nested spans, maintaining the Badge contract.

---

## AuditLogsTable
**File**: `features/business/settings-audit-logs/components/audit-logs-table.tsx:112`
**Status**: ✅
**Deviations**: 0

### Notes
- Success/failure chips wrap their icon and label inside flex spans, clearing the previous `gap-1` overrides.

---

## StatBadge Components
**File**: `features/business/business-common/components/stat-badge.tsx:24`
**Status**: ✅
**Deviations**: 0

### Notes
- Both `StatBadge` and `ComparisonBadge` route all layout styling through inner spans while the Badge primitive carries variants only.

---
