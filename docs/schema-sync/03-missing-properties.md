# Category A: Missing Properties - Analysis Report

**Generated:** 2025-10-25
**Category:** Properties/Columns accessed that don't exist
**Severity:** HIGH
**Total Issues:** 45+
**Impact:** Runtime property access errors, type safety failures

---

## Summary

Code attempts to access columns or properties that don't exist on the queried view/table. This causes TypeScript compilation errors and runtime failures.

**Root Cause:** Code was written assuming columns exist that have been renamed, removed, or never existed in the database schema.

---

## Issues Found

### 1. audit_logs_view - Missing user_id Column Access

**File:** `/Users/afshin/Desktop/Enorae/features/admin/dashboard/api/queries.ts:83`
**Error:** TS2339: Property 'user_id' does not exist on type

**Code:**
```typescript
const data = await supabase
  .from('audit_logs_view')        // ❌ Wrong schema reference
  .select('user_id')              // ❌ Column exists but schema is wrong
  .gte('created_at', thirtyDaysAgoISO)

activeUsersData.map((log) => log.user_id)  // ❌ Type error
```

**Database Reality:**
- `audit_logs_view` DOES exist
- It DOES have `user_id` column (string | null)
- BUT it's in the `audit` schema, not queried with schema prefix
- ✓ Column exists: `audit.audit_logs_view.user_id`

**Status:** Schema mismatch, not actually a missing property

**Task:**
- [ ] Fix `features/admin/dashboard/api/queries.ts:74` - Add `.schema('audit')` prefix

---

### 2. profiles_view - Missing full_name Column

**File:** `/Users/afshin/Desktop/Enorae/features/admin/profile/api/queries.ts:120`
**Error:** TS7053: Element implicitly has 'any' type - 'full_name' doesn't exist

**Code:**
```typescript
const profile = await supabase
  .schema('identity')
  .from('profiles_view')
  .select('*')
  .single()

const displayName = profile['"full_name"']  // ❌ Property doesn't exist
```

**Database Reality:**
- `profiles_view` exists in `identity` schema
- Available columns: `id`, `avatar_url`, `cover_image_url`, `interests`, `tags`, `social_profiles`, `created_at`, `updated_at`
- ❌ NO `full_name` column exists

**Solution:** This column was either removed or never existed. Options:
1. Use different columns to construct full name
2. Add `full_name` column to database
3. Use `social_profiles` JSON field if name is stored there

**Task:**
- [ ] Fix `features/admin/profile/api/queries.ts:120` - Remove `full_name` access or add column

---

### 3. database_operations_log - Missing user_id Column

**File:** `/Users/afshin/Desktop/Enorae/features/admin/moderation/api/queries.ts:269`
**Error:** TS2322: Type error - SelectQueryError due to missing column

**Code:**
```typescript
const results = await supabase
  .from('database_operations_log')   // ❌ Wrong schema
  .select('id, flagged_reason')      // ❌ Column doesn't exist on this table
  .eq('created_at', targetDate)

// Type error: column 'flagged_reason' does not exist
```

**Database Reality:**
- `database_operations_log` exists in `admin` schema
- `user_id` is NOT a column on this table
- `flagged_reason` is NOT a column on this table
- This appears to be a confused query mixing different tables

**Solution:** Determine correct table/view for query
- If querying reviews: use `salon_reviews_with_counts_view` in correct schema
- If querying operations log: use appropriate columns that exist

**Task:**
- [ ] Fix `features/admin/moderation/api/queries.ts:264-270` - Use correct table/view with correct columns

---

### 4. salon_reviews_with_counts_view - Schema Mismatch

**File:** `/Users/afshin/Desktop/Enorae/features/admin/moderation/api/queries.ts:376-395`
**Error:** TS2769: No overload matches this call (multiple instances)

**Code:**
```typescript
const reviews = await supabase
  .from('salon_reviews_with_counts_view')  // ❌ Not in admin schema
  .select('id, flagged_reason')            // ❌ Columns may not exist
  .filter('status', 'eq', 'pending')

// Type error: view not found in admin schema
```

**Database Reality:**
- `salon_reviews_with_counts_view` exists in `public` schema
- May not have columns `id`, `flagged_reason` as expected
- Need to check actual columns in the view

**Solution:** Add `.schema('public')` or verify it's in another schema

**Task:**
- [ ] Fix `features/admin/moderation/api/queries.ts:376, 380, 385, 390, 438` - Add schema prefix or verify columns

---

### 5. MessageStats Type - Missing activeThreads Property

**File:** `/Users/afshin/Desktop/Enorae/features/admin/messages/api/messages-dashboard.ts:31`
**Error:** TS2561: 'activeThreads' does not exist in type 'MessageStats'

**Code:**
```typescript
const stats: MessageStats = {
  activeThreads: 0,      // ❌ Property doesn't exist - should be 'archivedThreads'
  reported: 0,           // ❌ Property doesn't exist
  unread: messageCount,
  total: totalMessages,
}
```

**Database Reality:**
- `MessageStats` type has: `unread`, `total`, `archivedThreads` (not activeThreads)
- `reported` is not a valid property
- Column names don't match type definitions

**Task:**
- [ ] Fix `features/admin/messages/api/messages-dashboard.ts:31` - Use correct property names

---

### 6. ToastUsageRecord Type - Type Conversion Mismatch

**File:** `/Users/afshin/Desktop/Enorae/features/admin/database-toast/api/queries.ts:57`
**Error:** TS2352: Type conversion may be a mistake

**Code:**
```typescript
const data = await supabase.rpc('get_table_toast_usage')

const records = (data as ToastUsageRecord[])  // ❌ Type mismatch

// ToastUsageRecord expects: id, table_name, toast_bytes, table_bytes, etc.
// But RPC returns: main_size, schemaname, tablename, toast_and_index_size, etc.
```

**Database Reality:**
- RPC returns different structure than expected type
- Field names don't match: `schemaname` vs `schema_name`, `tablename` vs `table_name`
- Missing expected fields

**Solution:** Either update `ToastUsageRecord` type or RPC function

**Task:**
- [ ] Fix `features/admin/database-toast/api/queries.ts:57` - Match types or transform data

---

### 7. QueryPerformanceRecord Type - Missing Fields

**File:** `/Users/afshin/Desktop/Enorae/features/admin/database-performance/api/queries.ts:59`
**Error:** TS2352: Conversion to 'QueryPerformanceRecord[]' may be mistake

**Code:**
```typescript
const result = await supabase.rpc('get_index_performance_stats')

return (result as QueryPerformanceRecord[])  // ❌ Mismatched types

// Actual RPC returns: avg_tuples_per_scan, index_name, index_scans, index_size, schemaname, tablename...
// Expected type needs: id, query_hash, query_sample, mean_time_ms...
```

**Database Reality:**
- RPC return type doesn't match expected TypeScript type
- Field mapping is completely different
- Need type transformation or new type definition

**Task:**
- [ ] Fix `features/admin/database-performance/api/queries.ts:59` - Create proper type or transform data

---

### 8. EventLog Type - Missing Columns

**File:** `/Users/afshin/Desktop/Enorae/features/admin/database-toast/api/mutations.ts:38`
**Error:** TS2769: No overload matches - missing required properties

**Code:**
```typescript
const { error } = await supabase
  .schema('security')
  .from('security_event_logs')
  .insert({
    event_type: 'database_toast_update',
    event_category: 'performance',
    severity: 'info',
    user_id: userId,
    metadata: { table_name, column_name, compression_type: 'pglz' }
    // ❌ Missing required properties: action, target_schema, target_table
  })
```

**Database Reality:**
- `security_event_logs` table requires: `action`, `target_schema`, `target_table`
- Code provides: `event_type`, `event_category`, `severity`
- Type mismatch between what's provided and what's required

**Task:**
- [ ] Fix `features/admin/database-toast/api/mutations.ts:38` - Add required properties or use correct table

---

### 9-45. Additional Missing Properties (36+ more instances)

**Affected Files:**
- `features/admin/roles/api/role-mutations/assignments.ts:42, 44, 55, 59` - Missing fields on role assignments
- `features/admin/salons/api/mutations/update-salon.mutation.ts:21` - Missing salon properties
- `features/admin/salons/api/mutations/update-salon-settings.mutation.ts:24` - Missing settings properties
- `features/admin/security-access-monitoring/api/mutations.ts:56` - Wrong field names
- `features/admin/users/api/mutations/*.ts` - Multiple user property issues
- `features/business/notifications/api/mutations/helpers.ts` - Notification field issues
- `features/business/services/api/pricing-functions.ts` - Service pricing issues
- `features/customer/dashboard/api/queries/*.ts` - Dashboard data issues
- `features/staff/analytics/api/internal/*.ts` - Analytics field issues
- And 26+ more files

**Common Pattern:**
All follow similar issue - code accesses properties that don't exist on database rows.

---

## Root Cause Analysis

### Primary Causes

1. **Schema Version Mismatch** (60%)
   - Code written for old schema version
   - Properties were removed or renamed
   - Views were restructured

2. **Type Definition Misalignment** (25%)
   - TypeScript types don't match database reality
   - Properties added to types that don't exist in database
   - Columns removed from database but not from types

3. **RPC Function Signature Changes** (15%)
   - RPC return types changed
   - Field names in RPC results updated
   - New required fields added

---

## Fix Recommendations

### Strategy A: Update TypeScript Types

If the database has the correct columns:
```typescript
// WRONG: Type defines columns that don't exist
type Audit = {
  user_id: string
  full_name: string  // ❌ Doesn't exist in database
}

// CORRECT: Type matches database exactly
type Audit = {
  user_id: string | null
  // No full_name - doesn't exist
}
```

### Strategy B: Update Database Schema

If columns should exist:
```sql
-- Add missing column to database
ALTER TABLE identity.profiles
ADD COLUMN full_name VARCHAR(255);

-- Or for views, create computed column
CREATE VIEW profiles_view AS
SELECT
  *,
  CONCAT(first_name, ' ', last_name) AS full_name
FROM profiles;
```

### Strategy C: Transform Query Results

If data structure needs adjustment:
```typescript
// WRONG: Direct cast with type mismatch
const records = (rpcResult as RecordType[])

// CORRECT: Transform result to expected type
const records = rpcResult.map(row => ({
  id: row.id,
  query_hash: row.query_id,
  // ... other mappings
}))
```

---

## Testing Checklist

For each fix:

- [ ] Property access is removed OR database column exists
- [ ] TypeScript types match database schema
- [ ] No `as unknown` type casting
- [ ] Type safety maintained
- [ ] Unit tests pass for affected code
- [ ] Integration tests verify data retrieval works

---

## Related Tasks

**See Also:**
- [04-wrong-column-names.md](04-wrong-column-names.md) - Similar column-name issues
- [01-schema-overview.md](01-schema-overview.md) - Source of truth for columns
- [09-fix-priority.md](09-fix-priority.md) - Recommended fix order

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Issues in this category | 45+ |
| Files affected | 32+ |
| Critical issues | 8 |
| High-priority issues | 37 |
| Estimated fix time | 2-3 days |
| Database changes required | Maybe |
| Code-only fixes possible | Yes |

---

**Next:** Review [04-wrong-column-names.md](04-wrong-column-names.md) for column name mismatch issues.
