# ENORAE Feature Structure Violations - Comprehensive Repair Plan

**Scan Date:** 2025-10-20  
**Total Violations:** 50  
**Total Features Affected:** 51

---

## Executive Summary

| Priority | Count | Status |
|----------|-------|--------|
| Tier 1 - Critical | 2 | MUST FIX FIRST |
| Tier 2 - High Complexity | 2 | URGENT |
| Tier 3 - Medium | 1 | HIGH |
| Tier 4 - Minor | 47 | MEDIUM |

**Total Estimated Repair Time:** 8-12 hours

---

## Violation Types Summary

- **Api Internal Exists**: 27 features
- **Api Queries Folder**: 20 features
- **Api Mutations Folder**: 9 features
- **Missing Types**: 2 features
- **Missing Schema**: 2 features
- **Missing Index**: 1 features

---

## TIER 1: CRITICAL FEATURES (Broken - Missing Required Files)

These features are broken and **MUST** be fixed first. Total count: 2


### features/shared/dashboard

**Status:** CRITICAL  
**Estimated Time:** 15 minutes  
**Violations:** missing_index, missing_types, missing_schema

**Action Items:**
- [ ] Create dashboard/index.tsx
- [ ] Create dashboard/types.ts
- [ ] Create dashboard/schema.ts

### features/shared/sessions

**Status:** CRITICAL  
**Estimated Time:** 15 minutes  
**Violations:** missing_types, missing_schema

**Action Items:**
- [ ] Create sessions/types.ts
- [ ] Create sessions/schema.ts


---

## TIER 2: HIGH COMPLEXITY (>10 files to consolidate)

These features have large file consolidations ahead. Total count: 2


### features/admin/users

**Status:** HIGH PRIORITY  
**Estimated Time:** 30-45 minutes  
**Files to Consolidate:** 15  
**Violations:** api_queries_folder, api_mutations_folder

**Details:**
- Consolidate 4 files from api/queries/
- Consolidate 11 files from api/mutations/

**Sample Files to Consolidate:**
```
api/queries/single-user.ts
api/queries/all-users.ts
api/queries/stats.ts
api/queries/types.ts
api/mutations/status.ts
...
```


### features/admin/analytics

**Status:** HIGH PRIORITY  
**Estimated Time:** 30-45 minutes  
**Files to Consolidate:** 16  
**Violations:** api_internal_exists

**Details:**
- Consolidate 16 files from api/internal

**Sample Files to Consolidate:**
```
api/internal/queries/inventory.ts
api/internal/queries/salons.ts
api/internal/queries/revenue.ts
api/internal/queries/messages.ts
api/internal/queries/platform.ts
...
```


---

## TIER 3: MEDIUM COMPLEXITY (2-3 violations)

Medium-scale consolidations. Total count: 1



---

## TIER 4: MINOR VIOLATIONS (1-2 small violations)

Single or small-scale violations. Total count: 47


### Api Internal Exists (26 features)

- features/admin/chains
- features/admin/dashboard
- features/admin/database-health
- features/admin/moderation
- features/admin/salons
- features/admin/staff
- features/business/appointments
- features/business/chains
- features/business/inventory
- features/business/inventory-usage
- features/business/notifications
- features/business/reviews
- features/business/settings-roles
- features/business/staff
- features/business/staff-schedules
- features/business/staff-services
- features/customer/discovery
- features/customer/salon-search
- features/marketing/salon-directory
- features/marketing/services-directory
- features/shared/auth
- features/shared/messaging
- features/staff/analytics
- features/staff/clients
- features/staff/schedule
- features/staff/time-off

### Api Mutations Folder (3 features)

- features/business/inventory-purchase-orders
- features/business/settings
- features/shared/blocked-times

### Api Queries Folder (17 features)

- features/admin/appointments
- features/admin/inventory
- features/admin/security-monitoring
- features/business/analytics
- features/business/business-common
- features/business/coupons
- features/business/dashboard
- features/business/insights
- features/business/inventory-products
- features/business/locations
- features/business/pricing
- features/business/services
- features/business/webhooks
- features/customer/booking
- features/customer/dashboard
- features/shared/profile
- features/staff/commission

### Missing Types (1 features)

- features/shared/sessions


---

## Consolidation Strategy

### Phase 1: Fix Broken Features (2 features, ~30 minutes)
1. Create missing files in `features/shared/dashboard`
2. Create missing files in `features/shared/sessions`

### Phase 2: High Complexity Consolidation (2 features, ~1.5-2 hours)
1. Consolidate `/admin/users` - merge 15 files
2. Consolidate `/admin/analytics` - merge 16 files

### Phase 3: Medium & Minor Consolidations (46 features, ~5-8 hours)
- Process remaining violations in batches by violation type
- Use automated consolidation patterns

---

## Consolidation Patterns

### Pattern 1: api/internal → api/queries.ts + api/mutations.ts
**Affected Features:** 27 features

**Process:**
1. Analyze files in `api/internal/`
2. Split into data-fetching (→ `api/queries.ts`) and data-mutating (→ `api/mutations.ts`)
3. Remove `api/internal/` directory
4. Update imports throughout components

### Pattern 2: api/queries/ → api/queries.ts
**Affected Features:** 20 features

**Process:**
1. Merge all files in `api/queries/` into single `api/queries.ts`
2. Export all functions from root file
3. Remove `api/queries/` directory
4. Update imports

### Pattern 3: api/mutations/ → api/mutations.ts
**Affected Features:** 9 features

**Process:**
1. Merge all files in `api/mutations/` into single `api/mutations.ts`
2. Export all functions from root file
3. Remove `api/mutations/` directory
4. Update imports

---

## Detection Commands

**Find all api/internal instances:**
```bash
find features -type d -name "internal" | grep "/api/internal"
```

**Find all api/queries/ folders:**
```bash
find features -type d -name "queries" | grep "/api/queries$"
```

**Find all api/mutations/ folders:**
```bash
find features -type d -name "mutations" | grep "/api/mutations$"
```

**Find missing index.tsx:**
```bash
for dir in features/*/*; do [ ! -f "$dir/index.tsx" ] && echo "$dir"; done
```

**Find missing types.ts:**
```bash
for dir in features/*/*; do [ ! -f "$dir/types.ts" ] && echo "$dir"; done
```

**Find missing schema.ts:**
```bash
for dir in features/*/*; do [ ! -f "$dir/schema.ts" ] && echo "$dir"; done
```

---

## Notes

- Total affected features: 51
- Most violations are structural (api/internal, api/queries/, api/mutations/)
- Only 2 features are completely broken (missing critical files)
- Consolidation can be automated in most cases
- All changes should preserve functionality

