# 🔍 PROJECT INCONSISTENCIES - ACTION ITEMS

> **Auto-generated on**: 2025-10-11 08:36:42
> **Purpose**: Actionable tasks to fix project standard violations
> **Based on**: `docs/features-folder-pattern.md` and `CLAUDE.md`

---

## 📊 SUMMARY

- **Total Tasks**: 166
- **By Priority**:
  - 🔴 **CRITICAL**: 0 (Fix immediately - security/functionality)
  - 🟠 **HIGH**: 14 (Fix soon - code quality)
  - 🟡 **MEDIUM**: 119 (Fix when possible - consistency)
  - 🟢 **LOW**: 33 (Nice to have - minor improvements)

- **By Category**:
  - Naming Violations: 3
  - Feature Structure Issues: 97
  - Anti-Patterns: 0
  - File Size Violations: 66

---

## 🔴 CRITICAL PRIORITY TASKS

### Security & Type Safety Issues

✅ No critical issues!


---

## 🟠 HIGH PRIORITY TASKS

### Naming & Structure Issues

- [ ] 🟠 HIGH | `features/admin/chains/api/mutations.ts`
      → File has 322 lines (limit 200, excess +122)
- [ ] 🟠 HIGH | `features/admin/finance/api/finance-queries/client.ts`
      → Client file should be named '[Feature]-client.tsx'
- [ ] 🟠 HIGH | `features/business/appointments/api/appointment-services.mutations.ts`
      → File has 343 lines (limit 200, excess +143)
- [ ] 🟠 HIGH | `features/business/appointments/api/batch-mutations.ts`
      → File has 315 lines (limit 200, excess +115)
- [ ] 🟠 HIGH | `features/business/chains/api/mutations.ts`
      → File has 322 lines (limit 200, excess +122)
- [ ] 🟠 HIGH | `features/business/notifications/components/notification-templates-manager.tsx`
      → Contains forbidden suffix '-temp'
- [ ] 🟠 HIGH | `features/business/notifications/components/notification-templates-manager.tsx`
      → File has 306 lines (limit 200, excess +106)
- [ ] 🟠 HIGH | `features/business/pricing/components/dynamic-pricing-dashboard.tsx`
      → File has 310 lines (limit 200, excess +110)
- [ ] 🟠 HIGH | `features/business/pricing/components/pricing-rules-form/sections.tsx`
      → File has 329 lines (limit 200, excess +129)
- [ ] 🟠 HIGH | `features/staff/analytics/api/queries.ts`
      → File has 322 lines (limit 200, excess +122)
- [ ] 🟠 HIGH | `features/staff/clients/api/mutations.ts`
      → File has 330 lines (limit 200, excess +130)
- [ ] 🟠 HIGH | `features/staff/clients/api/queries.ts`
      → File has 315 lines (limit 200, excess +115)
- [ ] 🟠 HIGH | `features/staff/time-off/api/mutations.ts`
      → File has 314 lines (limit 200, excess +114)
- [ ] 🟠 HIGH | `lib/supabase/client.ts`
      → Client file should be named '[Feature]-client.tsx'


---

## 🟡 MEDIUM PRIORITY TASKS

### Consistency & Convention Issues

- [ ] 🟡 MEDIUM | `features/admin/analytics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/appointments`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/chains`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/dashboard`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/dashboard/api/queries.ts`
      → File has 257 lines (limit 200, excess +57)
- [ ] 🟡 MEDIUM | `features/admin/finance`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/inventory`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/messages`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/moderation`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/moderation/api/queries.ts`
      → File has 257 lines (limit 200, excess +57)
- [ ] 🟡 MEDIUM | `features/admin/profile`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/reviews`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/roles`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/salons`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/security`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/security-monitoring`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/settings`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/staff`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/admin/users`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/analytics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/appointments/components/add-service-dialog.tsx`
      → File has 291 lines (limit 200, excess +91)
- [ ] 🟡 MEDIUM | `features/business/appointments/components/appointment-services-manager.tsx`
      → File has 254 lines (limit 200, excess +54)
- [ ] 🟡 MEDIUM | `features/business/appointments/components/edit-service-dialog.tsx`
      → File has 296 lines (limit 200, excess +96)
- [ ] 🟡 MEDIUM | `features/business/chains`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/coupons/components/bulk-coupon-generator.tsx`
      → File has 263 lines (limit 200, excess +63)
- [ ] 🟡 MEDIUM | `features/business/customer-analytics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/daily-analytics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/dashboard`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/insights`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/insights/components/customer-insights-dashboard.tsx`
      → File has 284 lines (limit 200, excess +84)
- [ ] 🟡 MEDIUM | `features/business/inventory`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/inventory/usage/components/usage-analytics-dashboard.tsx`
      → File has 255 lines (limit 200, excess +55)
- [ ] 🟡 MEDIUM | `features/business/media`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/metrics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/notifications`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/notifications/api/queries.ts`
      → File has 277 lines (limit 200, excess +77)
- [ ] 🟡 MEDIUM | `features/business/operating-hours`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/reviews`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/reviews/api/mutations.ts`
      → File has 258 lines (limit 200, excess +58)
- [ ] 🟡 MEDIUM | `features/business/service-performance-analytics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/service-performance-analytics/components/service-performance-dashboard.tsx`
      → File has 300 lines (limit 200, excess +100)
- [ ] 🟡 MEDIUM | `features/business/service-pricing`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/services`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/settings`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/settings/roles/api/mutations.ts`
      → File has 292 lines (limit 200, excess +92)
- [ ] 🟡 MEDIUM | `features/business/staff`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/time-off`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/business/webhooks`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/analytics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/appointments`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/appointments/components/appointment-detail.tsx`
      → File has 254 lines (limit 200, excess +54)
- [ ] 🟡 MEDIUM | `features/customer/booking`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/booking/components/booking-form.tsx`
      → File has 283 lines (limit 200, excess +83)
- [ ] 🟡 MEDIUM | `features/customer/chains`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/dashboard`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/discovery`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/discovery/api/queries.ts`
      → File has 268 lines (limit 200, excess +68)
- [ ] 🟡 MEDIUM | `features/customer/favorites`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/loyalty`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/notifications`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/profile`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/referrals`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/reviews`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/salon-detail`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/salon-search`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/salon-search/api/queries.ts`
      → File has 253 lines (limit 200, excess +53)
- [ ] 🟡 MEDIUM | `features/customer/salon-search/components/advanced-search-client.tsx`
      → File has 295 lines (limit 200, excess +95)
- [ ] 🟡 MEDIUM | `features/customer/staff-profiles`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/customer/transactions`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/about`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/contact`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/faq`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/home`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/how-it-works`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/pricing`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/privacy`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/salon-directory`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/salon-directory/api/queries.ts`
      → File has 266 lines (limit 200, excess +66)
- [ ] 🟡 MEDIUM | `features/marketing/services-directory`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/marketing/services-directory/api/queries.ts`
      → File has 294 lines (limit 200, excess +94)
- [ ] 🟡 MEDIUM | `features/marketing/terms`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/admin-common`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/appointments`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/blocked-times`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/booking-rules`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/business-common`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/business-common/utils/adapters.ts`
      → File has 226 lines (limit 150, excess +76)
- [ ] 🟡 MEDIUM | `features/shared/customer-common`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/messaging`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/messaging/api/mutations.ts`
      → File has 295 lines (limit 200, excess +95)
- [ ] 🟡 MEDIUM | `features/shared/notifications`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/preferences`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/profile`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/profile-metadata`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/salons`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/service-categories`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/service-product-usage`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/sessions`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/staff-common`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/shared/transactions`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/analytics`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/analytics/components/staff-analytics-dashboard.tsx`
      → File has 256 lines (limit 200, excess +56)
- [ ] 🟡 MEDIUM | `features/staff/appointments`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/blocked-times`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/clients`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/commission`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/dashboard`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/help`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/location`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/messages`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/operating-hours`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/product-usage`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/profile`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/schedule`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/services`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/sessions`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/settings`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/support`
      → Feature 'api/' folder missing queries.ts or mutations.ts
- [ ] 🟡 MEDIUM | `features/staff/time-off`
      → Feature 'api/' folder missing queries.ts or mutations.ts


---

## 🟢 LOW PRIORITY TASKS

### Minor Improvements

- [ ] 🟢 LOW | `features/admin/chains/components/chain-actions.tsx`
      → File has 207 lines (limit 200, excess +7)
- [ ] 🟢 LOW | `features/admin/dashboard/components/platform-metrics.tsx`
      → File has 229 lines (limit 200, excess +29)
- [ ] 🟢 LOW | `features/admin/moderation/components/reviews-table.tsx`
      → File has 222 lines (limit 200, excess +22)
- [ ] 🟢 LOW | `features/admin/moderation/utils/sentiment-scoring.ts`
      → File has 159 lines (limit 150, excess +9)
- [ ] 🟢 LOW | `features/admin/roles/components/assign-role-form.tsx`
      → File has 213 lines (limit 200, excess +13)
- [ ] 🟢 LOW | `features/admin/salons/api/queries.ts`
      → File has 224 lines (limit 200, excess +24)
- [ ] 🟢 LOW | `features/admin/salons/components/salons-table.tsx`
      → File has 231 lines (limit 200, excess +31)
- [ ] 🟢 LOW | `features/admin/staff/components/staff-table.tsx`
      → File has 240 lines (limit 200, excess +40)
- [ ] 🟢 LOW | `features/admin/staff/utils/metrics.ts`
      → File has 189 lines (limit 150, excess +39)
- [ ] 🟢 LOW | `features/admin/users/components/users-table.tsx`
      → File has 236 lines (limit 200, excess +36)
- [ ] 🟢 LOW | `features/business/appointments/components/appointment-service-progress.tsx`
      → File has 208 lines (limit 200, excess +8)
- [ ] 🟢 LOW | `features/business/chains/api/queries.ts`
      → File has 219 lines (limit 200, excess +19)
- [ ] 🟢 LOW | `features/business/inventory/usage/api/mutations.ts`
      → File has 244 lines (limit 200, excess +44)
- [ ] 🟢 LOW | `features/business/settings/audit-logs/api/queries.ts`
      → File has 246 lines (limit 200, excess +46)
- [ ] 🟢 LOW | `features/business/settings/audit-logs/components/audit-logs-table.tsx`
      → File has 227 lines (limit 200, excess +27)
- [ ] 🟢 LOW | `features/business/webhooks/components/webhook-monitoring-dashboard.tsx`
      → File has 224 lines (limit 200, excess +24)
- [ ] 🟢 LOW | `features/customer/favorites/api/mutations.ts`
      → File has 206 lines (limit 200, excess +6)
- [ ] 🟢 LOW | `features/customer/profile/components/profile-preferences-editor.tsx`
      → File has 244 lines (limit 200, excess +44)
- [ ] 🟢 LOW | `features/customer/referrals/components/referral-dashboard.tsx`
      → File has 228 lines (limit 200, excess +28)
- [ ] 🟢 LOW | `features/customer/reviews/components/edit-review-dialog.tsx`
      → File has 209 lines (limit 200, excess +9)
- [ ] 🟢 LOW | `features/shared/preferences/api/mutations.ts`
      → File has 211 lines (limit 200, excess +11)
- [ ] 🟢 LOW | `features/shared/preferences/components/advanced-preferences-form.tsx`
      → File has 215 lines (limit 200, excess +15)
- [ ] 🟢 LOW | `features/shared/profile/api/mutations.ts`
      → File has 213 lines (limit 200, excess +13)
- [ ] 🟢 LOW | `features/staff/appointments/api/mutations.ts`
      → File has 224 lines (limit 200, excess +24)
- [ ] 🟢 LOW | `features/staff/dashboard/api/queries.ts`
      → File has 201 lines (limit 200, excess +1)
- [ ] 🟢 LOW | `features/staff/profile/api/mutations.ts`
      → File has 212 lines (limit 200, excess +12)
- [ ] 🟢 LOW | `features/staff/profile/components/profile-client.tsx`
      → File has 211 lines (limit 200, excess +11)
- [ ] 🟢 LOW | `features/staff/schedule/api/queries.ts`
      → File has 223 lines (limit 200, excess +23)
- [ ] 🟢 LOW | `features/staff/schedule/components/schedule-management-client.tsx`
      → File has 218 lines (limit 200, excess +18)
- [ ] 🟢 LOW | `features/staff/time-off/components/request-card.tsx`
      → File has 225 lines (limit 200, excess +25)
- [ ] 🟢 LOW | `features/staff/time-off/components/time-off-requests-client.tsx`
      → File has 221 lines (limit 200, excess +21)
- [ ] 🟢 LOW | `lib/constants/app.constants.ts`
      → File has 169 lines (limit 150, excess +19)
- [ ] 🟢 LOW | `lib/performance/react-optimizations.tsx`
      → File has 157 lines (limit 150, excess +7)


---

## 📋 QUICK FIX GUIDE

### 🔴 Critical Issues - Fix First

#### Missing 'server-only' directive
```typescript
// Add as first line in *.queries.ts files
import 'server-only'
```

#### Missing 'use server' directive
```typescript
// Add as first line in *.mutations.ts files
'use server'
```

#### Replace 'any' types
```typescript
// ❌ Bad
const data: any = await getData()

// ✅ Good
import type { Database } from '@/lib/types/database.types'
type Salon = Database['public']['Views']['salons']['Row']
const data: Salon[] = await getData()
```

### 🟠 High Priority Issues

#### Rename files with forbidden suffixes
```bash
# Remove -v2, -new, -old, -fixed, -temp, -enhanced
mv file-temp.tsx file.tsx
mv component-v2.tsx component.tsx
```

#### Add missing index.tsx
```typescript
// features/[portal]/[feature]/index.tsx
import { FeatureComponent } from './components/feature-component'

export async function Feature() {
  return <FeatureComponent />
}
```

#### Add missing api folder
```bash
mkdir -p features/[portal]/[feature]/api
touch features/[portal]/[feature]/api/[feature].queries.ts
touch features/[portal]/[feature]/api/[feature].mutations.ts
```

### 🟡 Medium Priority Issues

#### Fix thick pages (>15 lines)
```typescript
// ❌ Bad - logic in page
export default async function Page() {
  const data = await fetchData()
  const processed = processData(data)
  // ... 50+ lines
}

// ✅ Good - delegate to component
export default async function Page() {
  return <FeatureComponent />
}
```

#### Add missing components folder
```bash
mkdir -p features/[portal]/[feature]/components
```

#### Split oversized files
```bash
# Break large files into smaller modules
# DAL files: Split by domain
# Components: Extract sub-components
# Utils: Separate into focused helpers
```

---

## 📋 GUIDELINES REFERENCE

### Feature Folder Pattern

```
features/
  [portal]/              # customer, business, staff, admin, marketing, shared
    [feature]/
      index.tsx          # REQUIRED: Main entry point (5-15 lines)
      api/
        [feature].queries.ts    # REQUIRED: SELECT operations
        [feature].mutations.ts  # REQUIRED: INSERT/UPDATE/DELETE operations
      components/        # REQUIRED: UI components
        [Feature]-client.tsx
        [Component].tsx
      hooks/            # OPTIONAL: Custom hooks
        use-[hook].ts
      utils/            # OPTIONAL: Helper functions
        [helper].ts
```

### Naming Conventions

- **Folders**: `kebab-case/` (e.g., `salon-discovery/`)
- **Files**: `kebab-case.tsx` (e.g., `salon-card.tsx`)
- **DAL**: `[feature].queries.ts`, `[feature].mutations.ts`
- **Hooks**: `use-[name].ts` (e.g., `use-salon.ts`)
- **Client Components**: `[Feature]-client.tsx`

### Forbidden Patterns

- ❌ Suffixes: `-v2`, `-new`, `-old`, `-fixed`, `-temp`, `-enhanced`
- ❌ Prefixes: `new-`, `temp-`, `old-`, `enhanced-`
- ❌ Snake_case folders: `salon_discovery/`
- ❌ PascalCase folders: `SalonDiscovery/`
- ❌ Generic client names: `client.tsx` (use `[Feature]-client.tsx`)

### File Size Limits

- **Pages**: 5-15 lines (render feature components only)
- **Components/Hooks**: ≤200 lines
- **DAL (queries/mutations)**: ≤200 lines
- **Helpers/Utils**: ≤150 lines

### Required Directives

- **queries.ts**: Must start with `import 'server-only'`
- **mutations.ts**: Must start with `'use server'`
- **DAL functions**: Must check auth before queries

---

## 🔧 HOW TO FIX

### 1. Fix Naming Violations

```bash
# Rename files with forbidden suffixes
mv file-v2.tsx file.tsx

# Convert snake_case to kebab-case
mv user_profile/ user-profile/

# Rename generic client files
mv client.tsx salon-discovery-client.tsx
```

### 2. Fix Feature Structure

```bash
# Add missing index.tsx
touch features/[portal]/[feature]/index.tsx

# Add missing api folder
mkdir -p features/[portal]/[feature]/api
touch features/[portal]/[feature]/api/[feature].queries.ts

# Add missing components folder
mkdir -p features/[portal]/[feature]/components
```

### 3. Fix Anti-Patterns

```typescript
// Add server-only directive to queries.ts
import 'server-only'  // First line
import { createClient } from '@/lib/supabase/server'

// Add use server directive to mutations.ts
'use server'  // First line
import { revalidatePath } from 'next/cache'

// Fix thick pages (move logic to components)
export default async function Page() {
  return <FeatureComponent />  // 5-15 lines max
}

// Replace 'any' types with proper types
import type { Database } from '@/lib/types/database.types'
type Salon = Database['public']['Views']['salons']['Row']
```

### 4. Fix File Size Violations

- Break large components into smaller sub-components
- Extract hooks from components into separate files
- Split large DAL files by domain (e.g., `salon-queries.ts`, `staff-queries.ts`)
- Move utility functions to separate helper files

---

## 📚 DOCUMENTATION

- **Feature Pattern**: `docs/features-folder-pattern.md`
- **AI Guidelines**: `CLAUDE.md`
- **Project Tree**: `docs/project-tree.md`

---

*Generated by*: `scripts/generate-project-tree.py`
*Run command*: `python3 scripts/generate-project-tree.py`
*Last updated*: 2025-10-11 08:36:42
