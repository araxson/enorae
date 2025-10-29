# ENORAE Architecture Violations - Detailed File List

## Overview

This document contains the complete list of architectural violations found in the ENORAE codebase, organized by violation type.

---

## VIOLATION TYPE 1: Schema Files in Wrong Location (127 files)

### Problem
All `schema.ts` files are at feature root level instead of `features/{portal}/{feature}/api/schema.ts`

### Files to Move

#### Business Portal (36 violations)

```
features/business/metrics/schema.ts → features/business/metrics/api/schema.ts
features/business/insights/schema.ts → features/business/insights/api/schema.ts
features/business/settings/schema.ts → features/business/settings/api/schema.ts
features/business/metrics-operational/schema.ts → features/business/metrics-operational/api/schema.ts
features/business/daily-analytics/schema.ts → features/business/daily-analytics/api/schema.ts
features/business/webhooks-monitoring/schema.ts → features/business/webhooks-monitoring/api/schema.ts
features/business/appointments/schema.ts → features/business/appointments/api/schema.ts
features/business/settings-contact/schema.ts → features/business/settings-contact/api/schema.ts
features/business/time-off/schema.ts → features/business/time-off/api/schema.ts
features/business/service-categories/schema.ts → features/business/service-categories/api/schema.ts
features/business/settings-audit-logs/schema.ts → features/business/settings-audit-logs/api/schema.ts
features/business/business-common/schema.ts → features/business/business-common/api/schema.ts
features/business/operating-hours/schema.ts → features/business/operating-hours/api/schema.ts
features/business/service-pricing/schema.ts → features/business/service-pricing/api/schema.ts
features/business/dashboard/schema.ts → features/business/dashboard/api/schema.ts
features/business/settings-account/schema.ts → features/business/settings-account/api/schema.ts
features/business/coupons/schema.ts → features/business/coupons/api/schema.ts
features/business/transactions/schema.ts → features/business/transactions/api/schema.ts
features/business/settings-roles/schema.ts → features/business/settings-roles/api/schema.ts
features/business/service-performance-analytics/schema.ts → features/business/service-performance-analytics/api/schema.ts
features/business/booking-rules/schema.ts → features/business/booking-rules/api/schema.ts
features/business/locations/schema.ts → features/business/locations/api/schema.ts
features/business/staff-services/schema.ts → features/business/staff-services/api/schema.ts
features/business/staff-schedules/schema.ts → features/business/staff-schedules/api/schema.ts
features/business/customer-analytics/schema.ts → features/business/customer-analytics/api/schema.ts
features/business/settings-description/schema.ts → features/business/settings-description/api/schema.ts
features/business/staff/schema.ts → features/business/staff/api/schema.ts
features/business/chains/schema.ts → features/business/chains/api/schema.ts
features/business/settings-salon/schema.ts → features/business/settings-salon/api/schema.ts
features/business/webhooks/schema.ts → features/business/webhooks/api/schema.ts
features/business/pricing/schema.ts → features/business/pricing/api/schema.ts
features/business/notifications/schema.ts → features/business/notifications/api/schema.ts
features/business/services/schema.ts → features/business/services/api/schema.ts
features/business/analytics/schema.ts → features/business/analytics/api/schema.ts
features/business/reviews/schema.ts → features/business/reviews/api/schema.ts
features/business/media/schema.ts → features/business/media/api/schema.ts
```

#### Admin Portal (28 violations)

```
features/admin/settings/schema.ts → features/admin/settings/api/schema.ts
features/admin/messages/schema.ts → features/admin/messages/api/schema.ts
features/admin/security-incidents/schema.ts → features/admin/security-incidents/api/schema.ts
features/admin/security-access-monitoring/schema.ts → features/admin/security-access-monitoring/api/schema.ts
features/admin/statistics-freshness/schema.ts → features/admin/statistics-freshness/api/schema.ts
features/admin/appointments/schema.ts → features/admin/appointments/api/schema.ts
features/admin/database-performance/schema.ts → features/admin/database-performance/api/schema.ts
features/admin/security/schema.ts → features/admin/security/api/schema.ts
features/admin/security-monitoring/schema.ts → features/admin/security-monitoring/api/schema.ts
features/admin/rate-limit-tracking/schema.ts → features/admin/rate-limit-tracking/api/schema.ts
features/admin/roles/schema.ts → features/admin/roles/api/schema.ts
features/admin/session-security/schema.ts → features/admin/session-security/api/schema.ts
features/admin/database-health/schema.ts → features/admin/database-health/api/schema.ts
features/admin/dashboard/schema.ts → features/admin/dashboard/api/schema.ts
features/admin/profile/schema.ts → features/admin/profile/api/schema.ts
features/admin/salons/schema.ts → features/admin/salons/api/schema.ts
features/admin/database-toast/schema.ts → features/admin/database-toast/api/schema.ts
features/admin/users/schema.ts → features/admin/users/api/schema.ts
features/admin/finance/schema.ts → features/admin/finance/api/schema.ts
features/admin/staff/schema.ts → features/admin/staff/api/schema.ts
features/admin/rate-limit-rules/schema.ts → features/admin/rate-limit-rules/api/schema.ts
features/admin/chains/schema.ts → features/admin/chains/api/schema.ts
features/admin/admin-common/schema.ts → features/admin/admin-common/api/schema.ts
features/admin/analytics/schema.ts → features/admin/analytics/api/schema.ts
features/admin/reviews/schema.ts → features/admin/reviews/api/schema.ts
features/admin/moderation/schema.ts → features/admin/moderation/api/schema.ts
```

#### Staff Portal (6 violations)

```
features/staff/analytics/schema.ts → features/staff/analytics/api/schema.ts
features/staff/clients/schema.ts → features/staff/clients/api/schema.ts
features/staff/commission/schema.ts → features/staff/commission/api/schema.ts
features/staff/dashboard/schema.ts → features/staff/dashboard/api/schema.ts
features/staff/schedule/schema.ts → features/staff/schedule/api/schema.ts
features/staff/profile/schema.ts → features/staff/profile/api/schema.ts
```

#### Customer Portal (8 violations)

```
features/customer/appointments/schema.ts → features/customer/appointments/api/schema.ts
features/customer/booking/schema.ts → features/customer/booking/api/schema.ts
features/customer/favorites/schema.ts → features/customer/favorites/api/schema.ts
features/customer/payments/schema.ts → features/customer/payments/api/schema.ts
features/customer/profile/schema.ts → features/customer/profile/api/schema.ts
features/customer/reviews/schema.ts → features/customer/reviews/api/schema.ts
features/customer/salon-search/schema.ts → features/customer/salon-search/api/schema.ts
features/customer/staff-profiles/schema.ts → features/customer/staff-profiles/api/schema.ts
```

#### Shared Features (14 violations)

```
features/shared/preferences/schema.ts → features/shared/preferences/api/schema.ts
features/shared/appointments/schema.ts → features/shared/appointments/api/schema.ts
features/shared/auth/schema.ts → features/shared/auth/api/schema.ts
features/shared/ui-components/schema.ts → features/shared/ui-components/api/schema.ts
features/shared/profile-metadata/schema.ts → features/shared/profile-metadata/api/schema.ts
features/shared/customer-common/schema.ts → features/shared/customer-common/api/schema.ts
features/shared/dashboard/schema.ts → features/shared/dashboard/api/schema.ts
features/shared/sessions/schema.ts → features/shared/sessions/api/schema.ts
features/shared/profile/schema.ts → features/shared/profile/api/schema.ts
features/shared/portal-shell/schema.ts → features/shared/portal-shell/api/schema.ts
features/shared/salons/schema.ts → features/shared/salons/api/schema.ts
features/shared/staff/schema.ts → features/shared/staff/api/schema.ts
features/shared/messaging/schema.ts → features/shared/messaging/api/schema.ts
features/shared/notifications/schema.ts → features/shared/notifications/api/schema.ts
features/shared/blocked-times/schema.ts → features/shared/blocked-times/api/schema.ts
```

#### Marketing Features (15 violations)

```
features/marketing/home/schema.ts → features/marketing/home/api/schema.ts
features/marketing/contact/schema.ts → features/marketing/contact/api/schema.ts
features/marketing/privacy/schema.ts → features/marketing/privacy/api/schema.ts
features/marketing/salon-directory/schema.ts → features/marketing/salon-directory/api/schema.ts
features/marketing/faq/schema.ts → features/marketing/faq/api/schema.ts
features/marketing/terms/schema.ts → features/marketing/terms/api/schema.ts
features/marketing/layout-components/schema.ts → features/marketing/layout-components/api/schema.ts
features/marketing/about/schema.ts → features/marketing/about/api/schema.ts
features/marketing/how-it-works/schema.ts → features/marketing/how-it-works/api/schema.ts
features/marketing/explore/schema.ts → features/marketing/explore/api/schema.ts
features/marketing/services-directory/schema.ts → features/marketing/services-directory/api/schema.ts
features/marketing/newsletter/schema.ts → features/marketing/newsletter/api/schema.ts
features/marketing/pricing/schema.ts → features/marketing/pricing/api/schema.ts
features/marketing/common-components/schema.ts → features/marketing/common-components/api/schema.ts
```

---

## VIOLATION TYPE 2: Types Files in Wrong Location (127 files)

### Problem
All `types.ts` files are at feature root level instead of `features/{portal}/{feature}/api/types.ts`

### Files to Move

#### Business Portal (36 violations)

```
features/business/metrics/types.ts → features/business/metrics/api/types.ts
features/business/insights/types.ts → features/business/insights/api/types.ts
features/business/settings/types.ts → features/business/settings/api/types.ts
features/business/metrics-operational/types.ts → features/business/metrics-operational/api/types.ts
features/business/daily-analytics/types.ts → features/business/daily-analytics/api/types.ts
features/business/webhooks-monitoring/types.ts → features/business/webhooks-monitoring/api/types.ts
features/business/appointments/types.ts → features/business/appointments/api/types.ts
features/business/settings-contact/types.ts → features/business/settings-contact/api/types.ts
features/business/time-off/types.ts → features/business/time-off/api/types.ts
features/business/service-categories/types.ts → features/business/service-categories/api/types.ts
features/business/settings-audit-logs/types.ts → features/business/settings-audit-logs/api/types.ts
features/business/business-common/types.ts → features/business/business-common/api/types.ts
features/business/operating-hours/types.ts → features/business/operating-hours/api/types.ts
features/business/service-pricing/types.ts → features/business/service-pricing/api/types.ts
features/business/dashboard/types.ts → features/business/dashboard/api/types.ts
features/business/settings-account/types.ts → features/business/settings-account/api/types.ts
features/business/coupons/types.ts → features/business/coupons/api/types.ts
features/business/transactions/types.ts → features/business/transactions/api/types.ts
features/business/settings-roles/types.ts → features/business/settings-roles/api/types.ts
features/business/service-performance-analytics/types.ts → features/business/service-performance-analytics/api/types.ts
features/business/booking-rules/types.ts → features/business/booking-rules/api/types.ts
features/business/locations/types.ts → features/business/locations/api/types.ts
features/business/staff-services/types.ts → features/business/staff-services/api/types.ts
features/business/staff-schedules/types.ts → features/business/staff-schedules/api/types.ts
features/business/customer-analytics/types.ts → features/business/customer-analytics/api/types.ts
features/business/settings-description/types.ts → features/business/settings-description/api/types.ts
features/business/staff/types.ts → features/business/staff/api/types.ts
features/business/chains/types.ts → features/business/chains/api/types.ts
features/business/settings-salon/types.ts → features/business/settings-salon/api/types.ts
features/business/webhooks/types.ts → features/business/webhooks/api/types.ts
features/business/pricing/types.ts → features/business/pricing/api/types.ts
features/business/notifications/types.ts → features/business/notifications/api/types.ts
features/business/services/types.ts → features/business/services/api/types.ts
features/business/analytics/types.ts → features/business/analytics/api/types.ts
features/business/reviews/types.ts → features/business/reviews/api/types.ts
features/business/media/types.ts → features/business/media/api/types.ts
```

#### Admin Portal (28 violations)

```
features/admin/settings/types.ts → features/admin/settings/api/types.ts
features/admin/messages/types.ts → features/admin/messages/api/types.ts
features/admin/security-incidents/types.ts → features/admin/security-incidents/api/types.ts
features/admin/security-access-monitoring/types.ts → features/admin/security-access-monitoring/api/types.ts
features/admin/statistics-freshness/types.ts → features/admin/statistics-freshness/api/types.ts
features/admin/appointments/types.ts → features/admin/appointments/api/types.ts
features/admin/database-performance/types.ts → features/admin/database-performance/api/types.ts
features/admin/security/types.ts → features/admin/security/api/types.ts
features/admin/security-monitoring/types.ts → features/admin/security-monitoring/api/types.ts
features/admin/rate-limit-tracking/types.ts → features/admin/rate-limit-tracking/api/types.ts
features/admin/roles/types.ts → features/admin/roles/api/types.ts
features/admin/session-security/types.ts → features/admin/session-security/api/types.ts
features/admin/database-health/types.ts → features/admin/database-health/api/types.ts
features/admin/dashboard/types.ts → features/admin/dashboard/api/types.ts
features/admin/profile/types.ts → features/admin/profile/api/types.ts
features/admin/salons/types.ts → features/admin/salons/api/types.ts
features/admin/database-toast/types.ts → features/admin/database-toast/api/types.ts
features/admin/users/types.ts → features/admin/users/api/types.ts
features/admin/finance/types.ts → features/admin/finance/api/types.ts
features/admin/staff/types.ts → features/admin/staff/api/types.ts
features/admin/rate-limit-rules/types.ts → features/admin/rate-limit-rules/api/types.ts
features/admin/chains/types.ts → features/admin/chains/api/types.ts
features/admin/admin-common/types.ts → features/admin/admin-common/api/types.ts
features/admin/analytics/types.ts → features/admin/analytics/api/types.ts
features/admin/reviews/types.ts → features/admin/reviews/api/types.ts
features/admin/moderation/types.ts → features/admin/moderation/api/types.ts
```

#### Staff Portal (6 violations)

```
features/staff/analytics/types.ts → features/staff/analytics/api/types.ts
features/staff/clients/types.ts → features/staff/clients/api/types.ts
features/staff/commission/types.ts → features/staff/commission/api/types.ts
features/staff/dashboard/types.ts → features/staff/dashboard/api/types.ts
features/staff/schedule/types.ts → features/staff/schedule/api/types.ts
features/staff/profile/types.ts → features/staff/profile/api/types.ts
```

#### Customer Portal (8 violations)

```
features/customer/appointments/types.ts → features/customer/appointments/api/types.ts
features/customer/booking/types.ts → features/customer/booking/api/types.ts
features/customer/favorites/types.ts → features/customer/favorites/api/types.ts
features/customer/payments/types.ts → features/customer/payments/api/types.ts
features/customer/profile/types.ts → features/customer/profile/api/types.ts
features/customer/reviews/types.ts → features/customer/reviews/api/types.ts
features/customer/salon-search/types.ts → features/customer/salon-search/api/types.ts
features/customer/staff-profiles/types.ts → features/customer/staff-profiles/api/types.ts
```

#### Shared Features (14 violations)

```
features/shared/preferences/types.ts → features/shared/preferences/api/types.ts
features/shared/appointments/types.ts → features/shared/appointments/api/types.ts
features/shared/auth/types.ts → features/shared/auth/api/types.ts
features/shared/ui-components/types.ts → features/shared/ui-components/api/types.ts
features/shared/profile-metadata/types.ts → features/shared/profile-metadata/api/types.ts
features/shared/customer-common/types.ts → features/shared/customer-common/api/types.ts
features/shared/dashboard/types.ts → features/shared/dashboard/api/types.ts
features/shared/sessions/types.ts → features/shared/sessions/api/types.ts
features/shared/profile/types.ts → features/shared/profile/api/types.ts
features/shared/portal-shell/types.ts → features/shared/portal-shell/api/types.ts
features/shared/salons/types.ts → features/shared/salons/api/types.ts
features/shared/staff/types.ts → features/shared/staff/api/types.ts
features/shared/messaging/types.ts → features/shared/messaging/api/types.ts
features/shared/notifications/types.ts → features/shared/notifications/api/types.ts
features/shared/blocked-times/types.ts → features/shared/blocked-times/api/types.ts
```

#### Marketing Features (15 violations)

```
features/marketing/home/types.ts → features/marketing/home/api/types.ts
features/marketing/contact/types.ts → features/marketing/contact/api/types.ts
features/marketing/privacy/types.ts → features/marketing/privacy/api/types.ts
features/marketing/salon-directory/types.ts → features/marketing/salon-directory/api/types.ts
features/marketing/faq/types.ts → features/marketing/faq/api/types.ts
features/marketing/terms/types.ts → features/marketing/terms/api/types.ts
features/marketing/layout-components/types.ts → features/marketing/layout-components/api/types.ts
features/marketing/about/types.ts → features/marketing/about/api/types.ts
features/marketing/how-it-works/types.ts → features/marketing/how-it-works/api/types.ts
features/marketing/explore/types.ts → features/marketing/explore/api/types.ts
features/marketing/services-directory/types.ts → features/marketing/services-directory/api/types.ts
features/marketing/newsletter/types.ts → features/marketing/newsletter/api/types.ts
features/marketing/pricing/types.ts → features/marketing/pricing/api/types.ts
features/marketing/common-components/types.ts → features/marketing/common-components/api/types.ts
```

---

## VIOLATION TYPE 3: Nested Types.ts Files (15+ files)

### Problem
Types files nested in component subdirectories instead of consolidated at `api/types.ts`

### Files to Consolidate

```
features/business/insights/components/dashboard/types.ts → features/business/insights/api/types.ts
features/business/insights/api/queries/types.ts → features/business/insights/api/types.ts
features/business/appointments/components/edit-service/types.ts → features/business/appointments/api/types.ts
features/business/appointments/components/manager/types.ts → features/business/appointments/api/types.ts
features/business/appointments/components/add-service/types.ts → features/business/appointments/api/types.ts
features/business/coupons/components/generator/types.ts → features/business/coupons/api/types.ts
features/business/service-performance-analytics/components/dashboard/types.ts → features/business/service-performance-analytics/api/types.ts
features/business/locations/components/address-form/types.ts → features/business/locations/api/types.ts
features/business/staff/components/staff-services/types.ts → features/business/staff/api/types.ts
features/business/pricing/components/pricing-rules-form/types.ts → features/business/pricing/api/types.ts
features/daily-analytics/components/types.ts → features/daily-analytics/api/types.ts
features/admin/roles/api/mutations/types.ts → features/admin/roles/api/types.ts
features/admin/dashboard/api/mutations/types.ts → features/admin/dashboard/api/types.ts
features/admin/profile/api/queries/types.ts → features/admin/profile/api/types.ts
features/admin/users/components/user-actions-menu/types.ts → features/admin/users/api/types.ts
features/admin/users/api/queries/types.ts → features/admin/users/api/types.ts
features/admin/finance/api/queries/types.ts → features/admin/finance/api/types.ts
features/admin/staff/api/queries/types.ts → features/admin/staff/api/types.ts
features/admin/chains/api/queries/types.ts → features/admin/chains/api/types.ts
features/staff/clients/api/mutations/types.ts → features/staff/clients/api/types.ts
features/staff/commission/api/queries/types.ts → features/staff/commission/api/types.ts
features/staff/analytics/components/dashboard/types.ts → features/staff/analytics/api/types.ts
features/customer/salon-search/api/queries/types.ts → features/customer/salon-search/api/types.ts
features/customer/appointments/components/detail/types.ts → features/customer/appointments/api/types.ts
features/customer/profile/components/editor/types.ts → features/customer/profile/api/types.ts
features/dashboard/api/types.ts → features/dashboard/api/types.ts (if this exists)
```

---

## VIOLATION TYPE 4: Hooks in Wrong Directory (22 files)

### Problem
Custom hooks placed in `components/` subdirectories instead of feature-level `hooks/`

### Files to Move

```
features/business/appointments/components/shared/use-service-form-data.ts
  → features/business/appointments/hooks/use-service-form-data.ts

features/business/appointments/components/appointments-table/use-appointments-filter.ts
  → features/business/appointments/hooks/use-appointments-filter.ts

features/business/appointments/components/edit-service/use-edit-service-form.ts
  → features/business/appointments/hooks/use-edit-service-form.ts

features/business/appointments/components/manager/use-services-manager.ts
  → features/business/appointments/hooks/use-services-manager.ts

features/business/appointments/components/add-service/use-add-service-form.ts
  → features/business/appointments/hooks/use-add-service-form.ts

features/business/settings-contact/components/contact-form/use-contact-form.ts
  → features/business/settings-contact/hooks/use-contact-form.ts

features/business/service-pricing/components/pricing-form/use-pricing-form.ts
  → features/business/service-pricing/hooks/use-pricing-form.ts

features/business/coupons/components/generator/use-bulk-coupon-form.ts
  → features/business/coupons/hooks/use-bulk-coupon-form.ts

features/business/staff-schedules/components/form/use-schedule-form-state.ts
  → features/business/staff-schedules/hooks/use-schedule-form-state.ts

features/business/settings-description/components/description-form/use-description-form.ts
  → features/business/settings-description/hooks/use-description-form.ts

features/business/staff/components/staff-services/use-assign-services-dialog.ts
  → features/business/staff/hooks/use-assign-services-dialog.ts

features/business/staff/components/use-staff-form-state.ts
  → features/business/staff/hooks/use-staff-form-state.ts

features/business/services/components/service-form/use-service-form.ts
  → features/business/services/hooks/use-service-form.ts

features/business/reviews/components/reviews-list/use-reviews-list.ts
  → features/business/reviews/hooks/use-reviews-list.ts

features/business/media/components/media-form/use-media-form.ts
  → features/business/media/hooks/use-media-form.ts

features/admin/roles/components/roles-table/use-role-actions.ts
  → features/admin/roles/hooks/use-role-actions.ts

features/admin/users/components/user-actions-menu/use-user-actions-menu.ts
  → features/admin/users/hooks/use-user-actions-menu.ts

features/shared/profile-metadata/components/use-metadata-form.ts
  → features/shared/profile-metadata/hooks/use-metadata-form.ts

features/customer/salon-search/components/use-advanced-search.ts
  → features/customer/salon-search/hooks/use-advanced-search.ts

features/customer/salon-search/components/use-search-suggestions.ts
  → features/customer/salon-search/hooks/use-search-suggestions.ts

features/customer/booking/components/form/use-booking-form.ts
  → features/customer/booking/hooks/use-booking-form.ts

features/customer/profile/components/editor/use-preferences-form.ts
  → features/customer/profile/hooks/use-preferences-form.ts
```

---

## Summary of Moves Required

| Violation Type | Count | Action |
|---|---|---|
| Schema files to move | 127 | Move from feature root to api/schema.ts |
| Types files to move | 127 | Move from feature root to api/types.ts |
| Nested types to consolidate | 15+ | Merge into single api/types.ts |
| Hooks to move | 22 | Move from components/* to hooks/ |
| **Total files to remediate** | **254+** | - |

---

## Import Path Updates Required

When moving files, update all imports that reference them. Search for patterns like:

```typescript
// OLD IMPORTS (to be updated)
import { SomeType } from '@/features/[portal]/[feature]/schema'
import { SomeSchema } from '@/features/[portal]/[feature]/types'
import { useMyHook } from '@/features/[portal]/[feature]/components/subdir/use-my-hook'

// NEW IMPORTS (after remediation)
import { SomeType } from '@/features/[portal]/[feature]/api/schema'
import { SomeSchema } from '@/features/[portal]/[feature]/api/types'
import { useMyHook } from '@/features/[portal]/[feature]/hooks/use-my-hook'
```

---

## Next Steps

1. Create automated migration script to move files
2. Update all import paths using find/replace
3. Run `npm run typecheck` to verify all imports are valid
4. Commit with clear message indicating architecture remediation
