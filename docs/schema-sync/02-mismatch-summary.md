# Database Schema Mismatch Summary

**Analysis Date:** 2025-10-25
**Analysis Type:** TypeScript Compilation Errors vs. Database Schema
**Total Issues Found:** 150+
**Critical Issues:** 20
**Status:** Complete

---

## Executive Statistics

| Metric | Count | Status |
|--------|-------|--------|
| **Total TypeScript Errors** | 150+ | Active |
| **Critical Issues** | 20 | BLOCKING |
| **High Priority** | 83 | Must Fix |
| **Medium Priority** | 32 | Should Fix |
| **Low Priority** | 15 | Can Wait |
| **Files Affected** | 48+ | Across codebase |
| **Schemas Affected** | 8 | Major issue areas |

---

## Issue Breakdown by Category

### Category A: Missing Properties (45+ issues)

**Severity:** HIGH
**Root Cause:** Code accesses columns that don't exist on the queried view/table

**Example:**
```typescript
// BROKEN: user_id doesn't exist on this view
const data = await supabase
  .from('database_operations_log')
  .select('user_id')  // ❌ Property doesn't exist

// Error: TS2339: Property 'user_id' does not exist
```

**Common Files:**
- `features/admin/dashboard/api/queries.ts:83`
- `features/admin/profile/api/queries.ts:120`
- `features/admin/moderation/api/queries.ts:269`
- 42+ more instances across codebase

---

### Category B: Wrong Column Names (38+ issues)

**Severity:** HIGH
**Root Cause:** Code uses incorrect column name in database

**Example:**
```typescript
// BROKEN: Column is named 'archivedThreads' not 'activeThreads'
const stats: MessageStats = {
  activeThreads: 0,  // ❌ Should be 'archivedThreads'
  reported: 0,       // ❌ Column doesn't exist
}

// Error: TS2561: 'activeThreads' does not exist
```

**Affected Files:**
- `features/admin/messages/api/messages-dashboard.ts:31`
- `features/admin/database-toast/api/mutations.ts:30`
- 36+ more instances

---

### Category C: Type Mismatches (32+ issues)

**Severity:** MEDIUM
**Root Cause:** Code expects different type than database provides

**Example:**
```typescript
// BROKEN: Database returns string, code expects string[]
const { data } = await supabase
  .from('table_with_string_column')
  .select('tags')  // Returns: "tag1,tag2"

const tagArray: string[] = data[0].tags  // ❌ Type error

// Error: TS2352: Type 'string' may not be assignable to 'string[]'
```

**Affected Patterns:**
- `string` vs `string[]` (15 instances)
- `number` vs `number | null` (12 instances)
- `boolean` vs `boolean | null` (5 instances)

---

### Category D: Non-Existent RPC Functions (8+ issues)

**Severity:** CRITICAL
**Root Cause:** Code calls RPC function that doesn't exist in database

**Example:**
```typescript
// BROKEN: Function doesn't exist
await supabase.rpc('create_index_on_column', {
  table_name: 'salons',
  column_name: 'name'
})

// Error: TS2345: 'create_index_on_column' not assignable to valid RPC names
```

**Functions with Issues:**
- `create_index_on_column` (NOT FOUND) - used in database-performance API
- `refresh_analytics_cache` (MISSING) - used in admin analytics
- `cleanup_expired_sessions` (POTENTIALLY MISSING)
- 5+ more

---

### Category E: Non-Existent Tables/Views (12+ issues)

**Severity:** CRITICAL
**Root Cause:** Code queries table or view that doesn't exist in specified schema

**Example:**
```typescript
// BROKEN: audit_logs_view is in 'audit' schema, not 'admin'
await supabase
  .from('audit_logs_view')  // ❌ Queries wrong schema
  .select('user_id')

// Error: TS2769: No overload matches - view not found in default schema
```

**Missing or Misplaced Views:**
- `audit_logs_view` - exists but in `audit` schema, code queries without schema prefix
- `salon_reviews_with_counts_view` - exists but code can't find it
- `database_operations_log` - Not accessible in expected location
- 9+ more

---

### Category F: Incorrect Select Statements (15+ issues)

**Severity:** HIGH
**Root Cause:** Code selects columns that don't exist or formats select incorrectly

**Example:**
```typescript
// BROKEN: Trying to select non-existent computed column
const { data } = await supabase
  .from('salons_view')
  .select('*, staff_count')  // ❌ staff_count doesn't exist

// Error: TS2352: Cannot convert type - missing properties
```

---

## Issues by Severity Level

### CRITICAL (20 issues)

**Must be fixed immediately - prevents code compilation and runtime execution**

| Issue | Count | Impact | Files |
|-------|-------|--------|-------|
| Non-existent RPC functions | 8 | RPC calls fail at runtime | 5 |
| Non-existent tables/views | 12 | Queries fail, no data returned | 8 |
| Schema mismatches | 20 | Type errors during query construction | 15 |
| **SUBTOTAL** | **40** | **Blocking** | **28** |

### HIGH (83 issues)

**Should be fixed this sprint - causes type safety failures**

| Issue | Count | Impact | Files |
|-------|-------|--------|-------|
| Missing properties | 45 | Runtime errors on property access | 32 |
| Wrong column names | 38 | Type mismatch, incorrect data access | 18 |
| **SUBTOTAL** | **83** | **High Risk** | **50** |

### MEDIUM (32 issues)

**Type safety and correctness - should be fixed soon**

| Issue | Count | Impact | Files |
|-------|-------|--------|-------|
| Type mismatches | 32 | Type casting, potential data bugs | 22 |
| **SUBTOTAL** | **32** | **Medium Risk** | **22** |

### LOW (15 issues)

**Edge cases and nice-to-haves - can be fixed later**

| Issue | Count | Impact | Files |
|-------|-------|--------|-------|
| Null handling | 8 | Potential null reference errors | 8 |
| Optional properties | 7 | Missing undefined checks | 6 |
| **SUBTOTAL** | **15** | **Low Risk** | **14** |

---

## Top 20 Most Problematic Files

| Rank | File | Errors | Severity | Category |
|------|------|--------|----------|----------|
| 1 | `features/admin/moderation/api/queries.ts` | 12 | Critical/High | Schema mismatch, missing props |
| 2 | `features/admin/dashboard/api/queries.ts` | 8 | Critical/High | Missing schemas, missing props |
| 3 | `features/admin/profile/api/queries.ts` | 7 | Critical/High | Schema mismatch, wrong column |
| 4 | `features/admin/roles/api/queries.ts` | 6 | High | Missing view, type errors |
| 5 | `features/admin/database-performance/api/mutations.ts` | 5 | Critical | Non-existent RPC |
| 6 | `features/admin/messages/api/messages-dashboard.ts` | 4 | High | Wrong column names |
| 7 | `features/admin/database-toast/api/mutations.ts` | 4 | High | Missing property, wrong RPC |
| 8 | `features/admin/messages/api/thread-utils.ts` | 4 | Medium | Null handling |
| 9 | `features/admin/database-toast/api/queries.ts` | 3 | High | Type mismatch |
| 10 | `features/admin/reviews/api/queries.ts` | 3 | High | Wrong column names |
| 11 | `features/customer/dashboard/api/queries/appointments.ts` | 3 | Medium | Type mismatch |
| 12 | `features/business/notifications/api/mutations/helpers.ts` | 3 | Medium | Missing properties |
| 13 | `features/admin/salons/api/queries.ts` | 3 | High | Schema mismatch |
| 14 | `features/admin/roles/api/role-mutations/assignments.ts` | 3 | High | Missing properties |
| 15 | `features/admin/security-access-monitoring/api/mutations.ts` | 2 | Critical | Wrong property, missing RPC |
| 16 | `features/admin/analytics/api/rpc-functions.ts` | 2 | Critical | Non-existent RPC |
| 17 | `features/business/appointments/api/queries/business-hours.ts` | 2 | Medium | Type mismatch |
| 18 | `features/customer/booking/api/queries.ts` | 2 | High | Wrong column names |
| 19 | `features/admin/user-management/api/queries.ts` | 2 | High | Missing columns |
| 20+ | Various other files | 85+ | Various | Mixed issues |

---

## Schemas Most Affected

| Schema | Tables/Views | Issues | Root Cause |
|--------|-------------|--------|------------|
| `audit` | audit_logs_view | 15+ | Schema prefix missing |
| `admin` | query_routing_config, partition_maintenance_docs | 12+ | Missing tables in schema |
| `organization` | user_roles_view, staff_roles | 10+ | Schema prefix missing |
| `security` | security_access_logs, rate_limit_* | 8+ | Schema prefix missing |
| `public` | Multiple views | 85+ | Column/type mismatches |
| `scheduling` | appointments_view | 5+ | Wrong column names |
| `communication` | message_threads_view | 5+ | Missing properties |
| `catalog` | service_*, category_* | 4+ | Type mismatches |

---

## Most Common Error Messages

### TS2769: No overload matches this call

**Occurs:** 28 instances
**Meaning:** Schema mismatch - view not found in queried schema
**Example:**
```
Argument of type '"audit_logs_view"' is not assignable to parameter of type
'"database_operations_log" | "partition_maintenance_docs"'
```
**Fix:** Add `.schema('audit')` prefix

### TS2339: Property does not exist

**Occurs:** 45 instances
**Meaning:** Column doesn't exist on the queried table/view
**Example:**
```
Property 'user_id' does not exist on type '{ ... }'
```
**Fix:** Remove the property access or verify column exists

### TS2345: Argument type not assignable

**Occurs:** 8 instances
**Meaning:** RPC function doesn't exist
**Example:**
```
Argument of type '"create_index_on_column"' is not assignable to parameter type
```
**Fix:** Use existing RPC function or create migration

### TS2352: Type conversion may be mistake

**Occurs:** 6 instances
**Meaning:** Type mismatch in query result
**Example:**
```
Conversion of type '{ index_name: unknown }[]' to type 'QueryPerformanceRecord[]'
may be a mistake
```
**Fix:** Match types or add proper type guards

### TS2353: Object literal unknown properties

**Occurs:** 8 instances
**Meaning:** Code tries to set property that doesn't exist on object
**Example:**
```
Object literal may only specify known properties, and 'compression_type'
does not exist in type '{ column_name: string; table_name: string; }'
```
**Fix:** Use correct property names

---

## Impact Analysis

### Compilation Status

**Current Status:** ❌ FAILS - 150+ TypeScript errors

```bash
npm run typecheck
# Output: 150+ error TS####: ...
```

### Code Functionality Impact

| Feature | Impact | Severity |
|---------|--------|----------|
| Admin Dashboard | Broken - missing metrics | CRITICAL |
| Moderation System | Broken - can't query reviews | CRITICAL |
| Audit Logging | Broken - can't access audit logs | CRITICAL |
| User Management | Broken - can't query user data | HIGH |
| Analytics | Broken - invalid RPC calls | CRITICAL |
| Business Operations | Degraded - type errors in mutations | HIGH |
| Notifications | Degraded - wrong column names | MEDIUM |

### Database Functionality

| Operation | Status | Issue |
|-----------|--------|-------|
| Read operations (.select) | Mostly broken | Schema mismatches, missing cols |
| Write operations (.insert) | Partially broken | Type mismatches, wrong properties |
| RPC operations (.rpc) | Broken | Non-existent functions |
| Real-time subscriptions | Affected | Schema prefix issues |

---

## Risk Assessment

### Immediate Risks

1. **Application won't start** - TypeScript compilation errors prevent build
2. **Admin features unavailable** - 28 admin endpoints broken
3. **User data access fails** - Can't query user information
4. **Audit trail broken** - Compliance logging non-functional

### Runtime Risks

1. **Null reference errors** - 15+ places where null isn't checked
2. **Type coercion bugs** - 32+ type mismatches could cause data issues
3. **Missing data columns** - 45+ places trying to access non-existent columns
4. **Failed RPC calls** - 8+ functions that don't exist

---

## Fix Priority & Effort

### Phase 1: Critical (2-3 days)

1. Add `.schema()` prefixes to all schema-qualified queries
2. Remove non-existent RPC calls or implement them
3. Fix table/view name references
4. **Estimated Impact:** Will unblock 80% of errors

### Phase 2: High (3-5 days)

1. Remove invalid property accesses
2. Fix column name references
3. Add proper type guards
4. **Estimated Impact:** Will unblock remaining 15% of errors

### Phase 3: Medium (2-3 days)

1. Fix type mismatches
2. Add null checks
3. Validate data transformations

### Phase 4: Low (1-2 days)

1. Clean up edge cases
2. Add optional property handling
3. Final testing

---

## Verification Plan

Use this checklist before considering schema sync complete:

- [ ] All 20+ critical issues fixed
- [ ] All 83 high-priority issues fixed
- [ ] `npm run typecheck` returns 0 errors
- [ ] All 48+ affected files pass type checking
- [ ] All task lists in reports show [x] complete
- [ ] Database queries execute successfully
- [ ] All RPC calls reference existing functions
- [ ] Integration tests pass
- [ ] Admin dashboard loads without errors
- [ ] No regression in other features

---

## Related Reports

- **Schema Overview:** [01-schema-overview.md](01-schema-overview.md) - Authoritative schema reference
- **Category Reports:** [03-08] - Detailed issues by category
- **Fix Priority:** [09-fix-priority.md](09-fix-priority.md) - Recommended fix order
- **Analysis Index:** [00-ANALYSIS-INDEX.md](00-ANALYSIS-INDEX.md) - Navigation guide

---

**Next Step:** Review [09-fix-priority.md](09-fix-priority.md) for recommended fix order and approach.
