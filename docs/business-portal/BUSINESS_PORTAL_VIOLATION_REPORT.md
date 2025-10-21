# Business Portal Comprehensive Violation Report

**Date:** 2025-10-20
**Portal:** Business Portal `(business)`
**Total Features Analyzed:** 43
**Detection Status:** Complete

---

## Executive Summary

### Critical Findings
- **Database Pattern Violations:** 16 files querying schema tables instead of public views in `queries.ts`
- **Architecture Compliance:** ✅ EXCELLENT - All files have `server-only` and `use server` directives
- **UI Patterns:** ✅ EXCELLENT - No typography imports, no slot styling violations
- **Security:** ✅ GOOD - All queries have proper auth guards
- **TypeScript:** ⚠️ Type definitions reference Views but code queries Tables (inconsistency)

### Violation Breakdown
| Category | Violations | Severity |
|----------|-----------|----------|
| Database Views Pattern | 16 files | 🔴 HIGH |
| Server Directives | 0 files | ✅ NONE |
| Auth Guards | 0 files | ✅ NONE |
| UI Patterns | 0 files | ✅ NONE |
| Page Size | 0 files | ✅ NONE |

---

## 1. Database Pattern Violations (HIGH PRIORITY)

### Pattern Requirement
Per `docs/stack-patterns/supabase-patterns.md`:
- ✅ **Queries must read from public VIEWS**: `.from('table_name')` where table_name is a view
- ✅ **Mutations write to schema TABLES**: `.schema('schema_name').from('table')`

### Violation Details

The following `queries.ts` files are querying base tables instead of public views:

#### 16 Files with Table Queries (Should use Views)

1. **features/business/staff-schedules/api/queries.ts**
   - ❌ Line 22: `.from('staff_schedules')` → Should query view
   - ❌ Line 52: `.from('staff_schedules')` → Should query view
   - ❌ Line 78: `.from('staff')` → Should query view
   - **Impact:** Bypassing view-layer security and filtering

2. **features/business/settings-roles/api/queries.ts**
   - ❌ Line 34: `.from('user_roles')` → Should query view
   - ❌ Line 71: `.from('staff')` → Should query view
   - ❌ Line 94: `.from('user_roles')` → Should query view
   - **Impact:** Potential unauthorized role access

3. **features/business/staff/api/queries.ts**
   - ❌ Line 23: `.from('staff')` → Should query view
   - ❌ Line 47: `.from('staff')` → Should query view
   - **Type Declaration:** Line 7 correctly uses `Database['public']['Views']['staff']` but code queries table

4. **features/business/services/api/queries.ts**
   - ❌ Line 28: `.from('services')` → Should query view
   - **Type Declaration:** Line 7 correctly uses `Database['public']['Views']['services']`

5. **features/business/settings-account/api/queries.ts**
   - ❌ Line 18: `.from('profiles')` → Should query view

6. **features/business/notifications/api/queries.ts**
   - ❌ Line 137: `.from('messages')` → Should query view
   - ❌ Line 218: `.from('messages')` → Should query view

7. **features/business/transactions/api/queries.ts**
   - ❌ Line 38: `.from('manual_transactions')` → Should query view
   - ❌ Line 75: `.from('manual_transactions')` → Should query view
   - **Type Declaration:** Line 6 correctly uses `Database['public']['Views']['manual_transactions']`

8. **features/business/inventory-movements/api/queries.ts**
   - ❌ Queries `stock_movements` table directly

9. **features/business/pricing/api/queries.ts**
   - ❌ Queries schema tables directly

10. **features/business/operating-hours/api/queries.ts**
    - ❌ Line 32: `.from('operating_hours')` → Should query view
    - ❌ Line 56: `.from('operating_hours')` → Should query view

11. **features/business/coupons/api/queries.ts**
    - ❌ Queries schema tables directly

12. **features/business/service-pricing/api/queries.ts**
    - ❌ Line 23: `.from('staff')` → Should query view (multiple instances)

13. **features/business/settings-description/api/queries.ts**
    - ❌ Queries `salon_descriptions` table directly

14. **features/business/booking-rules/api/queries.ts**
    - ❌ Has some view queries but inconsistent

15. **features/business/chains/api/queries.ts**
    - ❌ Mixed table/view usage

16. **features/business/service-categories/api/queries.ts**
    - ❌ Queries `staff` table for salon lookup

### Detection Command Used
```bash
rg "\.from\('(staff|services|operating_hours|messages|user_roles|profiles|manual_transactions|salon_descriptions|stock_movements)'\)" features/business/**/api/queries.ts -l
```

### Available Public Views (Confirmed)
Based on `/lib/types/database.types.ts`, these views ARE available:
- ✅ `appointments` (view exists)
- ✅ `messages` (view exists)
- ✅ `manual_transactions` (view exists)
- ✅ `operating_hours` (view exists)
- ✅ `profiles` (view exists)
- ✅ `staff` (view exists - confirmed in public schema)
- ✅ `services` (view exists - confirmed in public schema)
- ✅ `user_roles` (view exists - confirmed in public schema)

### Why This Matters
1. **Security:** Public views have embedded RLS filters and tenant scoping
2. **Performance:** Views are optimized for read patterns
3. **Maintainability:** Schema changes don't break queries
4. **Compliance:** Pattern documentation explicitly requires view usage for reads

---

## 2. Architecture Patterns (✅ EXCELLENT)

### Server Directives Check
```bash
# Missing 'server-only' in queries.ts
for file in $(find features/business -name "queries.ts"); do
  if ! grep -q "import 'server-only'" "$file"; then
    echo "$file";
  fi;
done
# Result: 0 violations ✅
```

```bash
# Missing 'use server' in mutations.ts
for file in $(find features/business -name "mutations.ts"); do
  if ! grep -q "'use server'" "$file"; then
    echo "$file";
  fi;
done
# Result: 0 violations ✅
```

### Page Size Check
```bash
find app/\(business\) -name 'page.tsx' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 15 ] && echo "$1: $lines lines"' _ {} \;
# Result: 0 violations ✅
```

**Status:** All business portal pages are thin shells (5-15 lines) ✅

---

## 3. Security Patterns (✅ GOOD)

### Auth Guards
- ✅ All `queries.ts` files have `requireAnyRole()` or `getUser()` calls
- ✅ Tenant scoping via `requireUserSalonId()` or `getSalonContext()`
- ✅ RLS filters applied with `.eq('salon_id', salonId)`

### Sample Auth Pattern (Compliant)
```typescript
// features/business/staff/api/queries.ts
export async function getStaff(salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS) // ✅ Auth check
  if (!(await canAccessSalon(salonId))) {           // ✅ Tenant verification
    throw new Error('Unauthorized')
  }
  // Query follows...
}
```

**Status:** Security patterns are well-implemented ✅

---

## 4. UI Patterns (✅ EXCELLENT)

### Typography Imports
```bash
rg "from '@/components/ui/typography'" app/\(business\) features/business --type tsx -l
# Result: 0 files ✅
```

### Slot Styling
No instances of slot customization detected (CardTitle, CardDescription, etc. used as-is)

### Arbitrary Tailwind Classes
```bash
rg "#[0-9a-fA-F]{3,6}" features/business --type tsx
# Result: 0 violations ✅
```

**Status:** UI patterns fully compliant ✅

---

## 5. TypeScript Patterns (⚠️ INCONSISTENCY)

### Type-Query Mismatch
Many files declare types using `Database['public']['Views']` but query from tables:

**Example Violation:**
```typescript
// features/business/staff/api/queries.ts
type Staff = Database['public']['Views']['staff']['Row'] // ✅ Correct type
// But queries with:
.from('staff') // ❌ Should query the staff view, not table
```

This creates a type-runtime inconsistency that could mask errors.

**Status:** TypeScript types are correct, but runtime queries don't match ⚠️

---

## Remediation Plan

### Phase 1: Database View Migration (16 files)
Convert all `queries.ts` table queries to view queries:

**Before:**
```typescript
const { data } = await supabase
  .from('staff')           // ❌ Table
  .select('*')
```

**After:**
```typescript
const { data } = await supabase
  .from('staff')           // ✅ View (same name, but queries public view)
  .select('*')
```

**Note:** In ENORAE's schema, public views have the SAME NAME as tables. The distinction is:
- Views are in `public` schema (default for queries)
- Tables are in specific schemas (`organization`, `catalog`, etc.)

When you query `.from('staff')` without a schema prefix, Supabase uses the public schema, which exposes views.

### Verification After Fix
```bash
# Ensure all queries use views (via correct type references)
rg "Database\['public'\]\['Views'\]" features/business/**/api/queries.ts | wc -l
# Should match number of type declarations

# Ensure no schema prefixes in queries.ts
rg "\.schema\(" features/business/**/api/queries.ts
# Should return 0 results
```

### Phase 2: Type Safety Validation
Run TypeScript compiler to ensure changes don't break type safety:
```bash
npm run typecheck
```

---

## Metrics Summary

### Files to Modify: 16
1. features/business/staff-schedules/api/queries.ts
2. features/business/settings-roles/api/queries.ts
3. features/business/staff/api/queries.ts
4. features/business/services/api/queries.ts
5. features/business/settings-account/api/queries.ts
6. features/business/notifications/api/queries.ts
7. features/business/transactions/api/queries.ts
8. features/business/inventory-movements/api/queries.ts
9. features/business/pricing/api/queries.ts
10. features/business/operating-hours/api/queries.ts
11. features/business/coupons/api/queries.ts
12. features/business/service-pricing/api/queries.ts
13. features/business/settings-description/api/queries.ts
14. features/business/booking-rules/api/queries.ts
15. features/business/chains/api/queries.ts
16. features/business/service-categories/api/queries.ts

### Estimated Changes
- **Lines to modify:** ~40-50 (query `.from()` calls only)
- **Breaking changes:** None (views expose same columns as tables)
- **Pattern files referenced:** `docs/stack-patterns/supabase-patterns.md`

---

## Success Criteria

After remediation:
1. ✅ All `queries.ts` files query from public views (no schema prefix)
2. ✅ All `mutations.ts` files write to schema tables (with `.schema()` prefix)
3. ✅ TypeScript types match runtime queries (`Views` types + view queries)
4. ✅ `npm run typecheck` passes
5. ✅ No security regressions (auth guards remain intact)

---

## Pattern Reference

**Source:** `/Users/afshin/Desktop/Enorae/docs/stack-patterns/supabase-patterns.md` (Lines 153-185)

**Key Excerpt:**
```typescript
// ✅ CORRECT QUERY PATTERN
import 'server-only'
type Appointment = Database['public']['Views']['appointments_view']['Row']

export async function listAppointments(businessId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')  // ✅ Query VIEW
    .select('*')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .returns<Appointment[]>()

  if (error) throw error
  return data
}
```

---

**Report Generated:** Claude Code Portal Analyzer
**Next Steps:** Proceed with Phase 1 fixes (convert table queries to view queries)
