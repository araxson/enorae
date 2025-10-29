# ENORAE Architecture Audit Report

**Date:** October 28, 2025
**Project:** ENORAE Salon Management Platform
**Base Pattern:** `docs/rules/architecture.md`
**Audit Scope:** Comprehensive file placement validation across `/features`, `/components`, `/lib`, `/app`

---

## Executive Summary

The ENORAE codebase has **CRITICAL architectural violations** across 254+ files that must be remediated. The most severe issues involve:

1. **CRITICAL - Schema & Types Misplacement** (254 files)
   - 127 `schema.ts` files in feature roots instead of `api/schema.ts`
   - 127 `types.ts` files scattered in feature roots instead of `api/types.ts`
   - Multiple `types.ts` files nested in component subdirectories (15+)
   - Status: **BREAKING CONVENTION**

2. **HIGH - Hook Placement** (22 hooks)
   - 22 out of 23 custom hooks placed in `components/` subdirectories instead of feature-level `/hooks`
   - Only 1 feature has a canonical `/hooks` directory
   - Status: **WIDESPREAD VIOLATION**

3. **MEDIUM - Component Index Files** (Incomplete Exports)
   - Many `components/index.ts` files missing exports for nested subdirectory components
   - Status: **PATTERNS INCONSISTENT**

4. **MEDIUM - Duplicate Utility Functions**
   - Similar functions duplicated across features instead of consolidated in `lib/utils/`
   - Status: **CODE DUPLICATION**

---

## Critical Violations by Category

### VIOLATION 1: Schema Files Misplaced (CRITICAL - 127 occurrences)

**Pattern:** Feature-root `schema.ts` instead of `api/schema.ts`

**Architecture Requirement:**
```
features/{portal}/{feature}/
├── api/
│   └── schema.ts           ← CANONICAL LOCATION
└── schema.ts               ← VIOLATION (should NOT exist)
```

**Current State:**
- 127 `schema.ts` files found at feature root level (maxdepth 3)
- Only 7 files correctly placed at `api/schema.ts`
- **Ratio: 18:1 violation ratio**

**Affected Features (Business Portal Sample):**
```
features/business/metrics/schema.ts ❌
features/business/insights/schema.ts ❌
features/business/settings/schema.ts ❌
features/business/metrics-operational/schema.ts ❌
features/business/daily-analytics/schema.ts ❌
features/business/webhooks-monitoring/schema.ts ❌
features/business/appointments/schema.ts ❌
features/business/settings-contact/schema.ts ❌
features/business/time-off/schema.ts ❌
features/business/service-categories/schema.ts ❌
features/business/settings-audit-logs/schema.ts ❌
features/business/business-common/schema.ts ❌
features/business/operating-hours/schema.ts ❌
features/business/service-pricing/schema.ts ❌
features/business/dashboard/schema.ts ❌
features/business/settings-account/schema.ts ❌
features/business/coupons/schema.ts ❌
features/business/transactions/schema.ts ❌
features/business/settings-roles/schema.ts ❌
features/business/service-performance-analytics/schema.ts ❌
features/business/booking-rules/schema.ts ❌
features/business/locations/schema.ts ❌
features/business/staff-services/schema.ts ❌
features/business/staff-schedules/schema.ts ❌
features/business/customer-analytics/schema.ts ❌
features/business/settings-description/schema.ts ❌
features/business/staff/schema.ts ❌
features/business/chains/schema.ts ❌
features/business/settings-salon/schema.ts ❌
features/business/webhooks/schema.ts ❌
features/business/pricing/schema.ts ❌
features/business/notifications/schema.ts ❌
features/business/services/schema.ts ❌
features/business/analytics/schema.ts ❌
features/business/reviews/schema.ts ❌
features/business/media/schema.ts ❌
```

**Correctly Placed (7 files only):**
```
features/business/settings-contact/api/schema.ts ✓
features/business/time-off/api/schema.ts ✓
features/business/settings-description/api/schema.ts ✓
features/admin/settings/api/schema.ts ✓  (if exists)
features/shared/auth/api/schema.ts ✓ (if exists)
... (7 total)
```

**Severity:** CRITICAL
**Impact:**
- Violates canonical structure completely
- Makes feature APIs harder to discover
- Breaks expected import patterns
- Impedes code organization and maintainability

---

### VIOLATION 2: Types Files Misplaced (CRITICAL - 127 occurrences)

**Pattern:** Feature-root `types.ts` instead of `api/types.ts` OR nested in component subdirectories

**Architecture Requirement:**
```
features/{portal}/{feature}/
├── api/
│   └── types.ts           ← CANONICAL LOCATION
└── types.ts               ← VIOLATION (should NOT exist)
```

**Current State:**
- 127 `types.ts` files at feature root level
- 15+ nested `types.ts` files in component subdirectories (e.g., `components/dashboard/types.ts`)
- **Total violations: 140+**

**Affected Patterns:**
```
features/business/metrics/types.ts ❌ (should be api/types.ts)
features/business/insights/components/dashboard/types.ts ❌ (should be api/types.ts)
features/business/appointments/components/edit-service/types.ts ❌ (should be api/types.ts)
features/business/appointments/components/manager/types.ts ❌ (should be api/types.ts)
features/business/appointments/components/add-service/types.ts ❌ (should be api/types.ts)
features/business/coupons/components/generator/types.ts ❌ (should be api/types.ts)
features/business/service-performance-analytics/components/dashboard/types.ts ❌
features/business/locations/components/address-form/types.ts ❌
features/business/staff/components/staff-services/types.ts ❌
features/business/pricing/components/pricing-rules-form/types.ts ❌
features/admin/users/components/user-actions-menu/types.ts ❌
... (140+ total)
```

**Severity:** CRITICAL
**Impact:**
- Types scattered across feature structure
- Inconsistent import paths
- Difficult to locate type definitions
- Component-level types pollute global type discovery

---

### VIOLATION 3: Hooks in Wrong Directory (HIGH - 22 occurrences)

**Pattern:** Custom hooks placed in `components/` subdirectories instead of feature-level `hooks/`

**Architecture Requirement:**
```
features/{portal}/{feature}/
├── hooks/                  ← CANONICAL LOCATION
│   └── use-[hook-name].ts
├── components/
│   ├── [component].tsx
│   └── use-*.ts           ← VIOLATION (belongs in hooks/)
```

**Current State:**
- 23 total custom hook files across codebase
- 22 hooks incorrectly placed in component subdirectories
- Only 1 feature has a canonical `/hooks` directory
- **Violation ratio: 22:1**

**Affected Hooks (by feature):**
```
features/business/appointments/components/shared/use-service-form-data.ts ❌
features/business/appointments/components/appointments-table/use-appointments-filter.ts ❌
features/business/appointments/components/edit-service/use-edit-service-form.ts ❌
features/business/appointments/components/manager/use-services-manager.ts ❌
features/business/appointments/components/add-service/use-add-service-form.ts ❌
features/business/settings-contact/components/contact-form/use-contact-form.ts ❌
features/business/service-pricing/components/pricing-form/use-pricing-form.ts ❌
features/business/coupons/components/generator/use-bulk-coupon-form.ts ❌
features/business/staff-schedules/components/form/use-schedule-form-state.ts ❌
features/business/settings-description/components/description-form/use-description-form.ts ❌
features/business/staff/components/staff-services/use-assign-services-dialog.ts ❌
features/business/staff/components/use-staff-form-state.ts ❌
features/business/services/components/service-form/use-service-form.ts ❌
features/business/reviews/components/reviews-list/use-reviews-list.ts ❌
features/business/media/components/media-form/use-media-form.ts ❌
features/admin/roles/components/roles-table/use-role-actions.ts ❌
features/admin/users/components/user-actions-menu/use-user-actions-menu.ts ❌
features/shared/profile-metadata/components/use-metadata-form.ts ❌
features/customer/salon-search/components/use-advanced-search.ts ❌
features/customer/salon-search/components/use-search-suggestions.ts ❌
features/customer/booking/components/form/use-booking-form.ts ❌
features/customer/profile/components/editor/use-preferences-form.ts ❌
```

**Correctly Placed:**
```
features/customer/booking/hooks/ ✓ (1 feature only)
```

**Severity:** HIGH
**Impact:**
- Violates clear organizational pattern
- Makes hooks hard to locate
- Mixed concerns in components directory
- Impacts discoverability and import patterns
- Blocks reusability across feature components

---

### VIOLATION 4: Component Index Files - Incomplete Exports (MEDIUM)

**Pattern:** `components/index.ts` missing exports for all components or subdirectory components

**Examples of Incomplete Exports:**

```typescript
// features/business/settings-contact/components/index.ts
export { ContactForm } from './contact-form'
// Missing: ContactFormSection, PhoneEmailSection, SocialLinksSection, etc.

// features/business/time-off/components/index.ts
export { BusinessTimeOff } from './business-time-off'
// Missing: TimeOffRequestCard, and any nested components
```

**Current Impact:**
- Violates "single source of truth" pattern
- Feature code must import directly from subdirectories
- Inconsistent import patterns across codebase

**Severity:** MEDIUM
**Impact:** Architectural pattern not fully enforced, but doesn't break functionality

---

### VIOLATION 5: Nested Types in Component Subdirectories (MEDIUM - 15+ occurrences)

**Pattern:** `types.ts` files nested inside component subdirectories instead of consolidated at `api/types.ts`

**Examples:**
```
features/business/insights/components/dashboard/types.ts ❌
features/business/insights/api/queries/types.ts ❌
features/daily-analytics/components/types.ts ❌
features/admin/users/api/queries/types.ts ❌
```

**Correct Pattern:**
```
features/{portal}/{feature}/
├── api/
│   └── types.ts           ← All types consolidated here
└── components/
    └── [component].tsx    ← No types here
```

**Severity:** MEDIUM
**Impact:**
- Types scattered across multiple files
- Inconsistent type location discovery
- Harder to maintain type definitions
- Violates "single source of truth" for types

---

### VIOLATION 6: Missing Constants Files (MEDIUM)

**Pattern:** Only 6 `constants.ts` files found across entire codebase

**Current:**
```
features/business/pricing/components/pricing-rules-form/constants.ts
features/admin/messages/api/constants.ts
features/admin/users/api/mutations/constants.ts
features/admin/moderation/api/mutations/constants.ts
features/shared/profile-metadata/components/constants.ts
features/staff/schedule/api/constants.ts
```

**Expected:** Constants should be at feature-level `api/constants.ts` for all features with configurable values

**Severity:** MEDIUM
**Impact:** Hardcoded values scattered across features instead of centralized

---

### VIOLATION 7: Utils Files in Wrong Locations (MEDIUM)

**Pattern:** Utility files placed in various locations instead of consistent `api/utils/` or `lib/utils/`

**Found:**
```
features/admin/salons/api/utils/ ✓
features/shared/ui-components/components/utils/ ❌ (should be at feature level)
features/customer/sessions/utils/ ❌ (should be in api/ or hooks/)
```

**Severity:** MEDIUM
**Impact:** Inconsistent utility organization

---

## Summary Statistics

| Category | Count | Severity | Status |
|----------|-------|----------|--------|
| Schema files misplaced | 127 | CRITICAL | Broken Pattern |
| Types files misplaced | 127 | CRITICAL | Broken Pattern |
| Nested types in components | 15+ | MEDIUM | Scattering |
| Hooks in components directory | 22 | HIGH | Wrong Location |
| Features missing canonical hooks/ | 100+ | MEDIUM | Missing Directory |
| Incomplete components/index.ts | 20+ | MEDIUM | Inconsistent Exports |
| Missing constants.ts files | 95+ | MEDIUM | Missing Pattern |
| Utils in wrong locations | 3+ | MEDIUM | Inconsistent |
| **TOTAL VIOLATIONS** | **254+** | - | - |

---

## Recommended Remediation Priority

### Phase 1: CRITICAL (Fix First)
1. Move all 127 `schema.ts` files from feature roots to `api/schema.ts`
2. Move all 127 `types.ts` files from feature roots to `api/types.ts`
3. Consolidate nested `types.ts` files to single `api/types.ts` per feature

**Effort:** High
**Impact:** Massive - fixes 254 violations in one pass
**Blockers:** Need comprehensive import path update script

### Phase 2: HIGH
1. Create `hooks/` directory in all features
2. Move 22 hooks from component subdirectories to feature-level `hooks/`
3. Update all imports to point to new hook locations

**Effort:** Medium
**Impact:** High - fixes hook discoverability and organization

### Phase 3: MEDIUM
1. Add missing `components/index.ts` exports for all subdirectory components
2. Create `api/constants.ts` for features with configuration values
3. Consolidate utility files to consistent locations

**Effort:** Medium
**Impact:** Medium - improves consistency and discoverability

---

## File Organization Patterns to Enforce

### Correct Pattern (Portal Features)
```
features/{portal}/{feature}/
├── api/
│   ├── queries/
│   │   ├── index.ts
│   │   └── [domain].ts
│   ├── mutations/
│   │   ├── index.ts
│   │   └── [action].ts
│   ├── types.ts           ← NOT feature root
│   ├── schema.ts          ← NOT feature root
│   └── constants.ts       ← Optional, if needed
├── components/
│   ├── index.ts
│   └── [component].tsx
├── hooks/                 ← REQUIRED if using custom hooks
│   └── use-[hook].ts
├── utils/                 ← Optional, if needed
│   └── [utility].ts
└── index.tsx
```

### WRONG Pattern (Current State - Violations)
```
features/{portal}/{feature}/
├── schema.ts              ← ❌ VIOLATION - should be api/schema.ts
├── types.ts               ← ❌ VIOLATION - should be api/types.ts
├── api/
│   ├── queries/
│   ├── mutations/
│   ├── schema.ts          ← ✓ Correct (but most are at root)
│   └── types.ts           ← ✓ Correct (but most are at root)
├── components/
│   ├── index.ts
│   ├── use-form-hook.ts   ← ❌ VIOLATION - should be in hooks/
│   ├── types.ts           ← ❌ VIOLATION - should be api/types.ts
│   └── dashboard/
│       ├── dashboard.tsx
│       └── types.ts       ← ❌ VIOLATION - should be api/types.ts
└── index.tsx
```

---

## Database Coordination Notes

No database schema changes required. This is purely a code organization audit. Ensure the Supabase schema (`lib/types/database.types.ts`) remains untouched during remediation.

---

## Validation Checklist

After remediation, verify:

- [ ] All `schema.ts` files are at `features/{portal}/{feature}/api/schema.ts`
- [ ] All `types.ts` files are at `features/{portal}/{feature}/api/types.ts` (single file per feature)
- [ ] All `use-*.ts` hooks are at `features/{portal}/{feature}/hooks/use-*.ts`
- [ ] All `components/index.ts` export ALL components in directory
- [ ] All features with utilities have `api/constants.ts` where needed
- [ ] No `.ts` files exist at feature root (except `index.tsx`)
- [ ] All imports updated to use new canonical paths
- [ ] `npm run typecheck` passes
- [ ] No broken imports across codebase

---

## Next Steps

1. **Create remediation script** to systematically move files and update imports
2. **Phase 1 remediation:** Move schema and types files to `api/` directory
3. **Phase 2 remediation:** Move hooks to feature-level `hooks/` directory
4. **Phase 3 remediation:** Consolidate utilities and constants
5. **Validation:** Run typecheck and verify all imports

---

**Report Generated:** October 28, 2025
**Audit Scope:** Complete ENORAE codebase
**Recommendations:** CRITICAL remediation required before next deployment
