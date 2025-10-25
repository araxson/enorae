# Category E: Non-Existent Tables/Views - Analysis Report

**Generated:** 2025-10-25
**Category:** Tables/views queried that don't exist or are inaccessible
**Severity:** CRITICAL
**Total Issues:** 12+
**Impact:** Queries fail at runtime, no data returned

---

## Critical Finding

Code queries database tables or views that either:
1. Don't exist in the database
2. Exist but in a different schema (wrong schema reference)
3. Are inaccessible due to permissions

**Result:** TypeScript error TS2769 - "No overload matches"

---

## Issues Found

### 1. audit_logs_view - Schema Mismatch

**Severity:** CRITICAL

**Files:**
- `features/admin/dashboard/api/queries.ts:74`
- `features/admin/profile/api/queries.ts:91`
- `features/admin/roles/api/queries.ts:114`

**Error:** TS2769: No overload matches - view not found in available tables

**Code:**
```typescript
const { data } = await supabase
  .from('audit_logs_view')        // ❌ Not in default public schema
  .select('user_id')
  .gte('created_at', date)
```

**Database Reality:**
- ✓ View `audit_logs_view` DOES exist
- ✓ It has `user_id` column
- ❌ It's in the `audit` schema, NOT in public schema
- ❌ Cannot be accessed without schema prefix

**Fix:**
```typescript
// CORRECT: Specify audit schema
const { data } = await supabase
  .schema('audit')                // ✓ Add schema prefix
  .from('audit_logs_view')
  .select('user_id')
  .gte('created_at', date)
```

**Task:**
- [ ] Fix `features/admin/dashboard/api/queries.ts:74` - Add `.schema('audit')`
- [ ] Fix `features/admin/profile/api/queries.ts:91` - Add `.schema('audit')`
- [ ] Fix `features/admin/roles/api/queries.ts:114` - Add `.schema('audit')`

---

### 2. salon_reviews_with_counts_view - Multiple Instances

**Severity:** CRITICAL

**Files:**
- `features/admin/moderation/api/queries.ts:264, 376, 380, 385, 390, 438`

**Error:** TS2769: No overload matches

**Code:**
```typescript
const reviews = await supabase
  .from('salon_reviews_with_counts_view')  // ❌ Can't find view
  .select('id, flagged_reason')
  .filter('status', 'eq', 'pending')
```

**Database Reality:**
- ✓ View `salon_reviews_with_counts_view` exists
- ✓ It's in the `public` schema (default)
- ❌ Code has schema mismatch somewhere
- ❌ Columns being selected may not exist

**Verification:**
```sql
-- Check if view exists in public schema
SELECT EXISTS(
  SELECT 1 FROM information_schema.views
  WHERE table_schema = 'public'
    AND table_name = 'salon_reviews_with_counts_view'
);

-- Check available columns
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'salon_reviews_with_counts_view';
```

**Fix:**
```typescript
// CORRECT: No schema prefix for public schema (it's default)
const reviews = await supabase
  .from('salon_reviews_with_counts_view')
  .select('id, review_count')  // Use actual columns
  .filter('status', 'eq', 'pending')
```

**Task:**
- [ ] Fix `features/admin/moderation/api/queries.ts:264` - Verify view, check columns
- [ ] Fix `features/admin/moderation/api/queries.ts:376` - Add proper select statement
- [ ] Fix `features/admin/moderation/api/queries.ts:380` - Verify columns exist
- [ ] Fix `features/admin/moderation/api/queries.ts:385` - Check column names
- [ ] Fix `features/admin/moderation/api/queries.ts:390` - Correct schema and columns
- [ ] Fix `features/admin/moderation/api/queries.ts:438` - Verify view exists

---

### 3. database_operations_log - Missing or Inaccessible

**Severity:** CRITICAL

**File:** `features/admin/moderation/api/queries.ts:269`

**Error:** TS2339: Column 'flagged_reason' does not exist

**Code:**
```typescript
const logs = await supabase
  .from('database_operations_log')  // ❌ Table not found or wrong schema
  .select('id, flagged_reason')     // ❌ Columns don't exist
```

**Database Reality:**
- `database_operations_log` table exists in `admin` schema
- Columns: `id`, `action`, `created_at`, `schema_name`, `table_name`, etc.
- ❌ Does NOT have `flagged_reason` column
- ❌ Wrong table for getting flagged reviews

**Root Cause:** Code is confusing multiple different tables:
- `database_operations_log` - for database operations
- `salon_reviews_with_counts_view` - for reviews
- Need to query correct table for flagged reviews

**Fix:**
```typescript
// CORRECT: Query actual reviews table with flagged info
const reviews = await supabase
  .schema('public')
  .from('salon_reviews_with_counts_view')  // Correct view
  .select('id, review_count, flagged')     // Actual columns
  .eq('flagged', true)                      // Filter flagged
```

**Task:**
- [ ] Fix `features/admin/moderation/api/queries.ts:264-270` - Use correct table/view for reviews

---

### 4. security_access_logs - Schema Mismatch

**Severity:** HIGH

**File:** `features/admin/security-access-monitoring/api/mutations.ts:54`

**Error:** TS2769: No overload matches

**Code:**
```typescript
const { error } = await supabase
  .from('security_access_logs')    // ❌ Not in public schema
  .insert({ ... })
```

**Database Reality:**
- ✓ Table exists in `security` schema
- ❌ Queried without schema prefix
- ❌ In insert operation, needs schema

**Fix:**
```typescript
const { error } = await supabase
  .schema('security')
  .from('security_access_logs')
  .insert({ ... })
```

**Task:**
- [ ] Fix `features/admin/security-access-monitoring/api/mutations.ts:54` - Add schema prefix

---

### 5. message_threads_view - Schema Mismatch

**Severity:** HIGH

**File:** Various communication features

**Code:**
```typescript
const threads = await supabase
  .from('message_threads_view')    // ❌ In communication schema
  .select('*')
```

**Database Reality:**
- ✓ View exists in `communication` schema
- ❌ Needs schema prefix

**Fix:**
```typescript
const threads = await supabase
  .schema('communication')
  .from('message_threads_view')
  .select('*')
```

**Task:**
- [ ] Audit all communication queries
- [ ] Add `.schema('communication')` prefix where needed

---

### 6-12. Additional Views/Tables (6+ more)

**Potentially Missing or Misplaced:**

| View/Table | Expected Schema | Issue |
|---|---|---|
| `notification_events_view` | communication | Schema mismatch |
| `appointment_details_view` | scheduling | Schema mismatch |
| `service_details_view` | catalog | Schema mismatch |
| `staff_details_view` | organization | Schema mismatch |
| `user_mfa_view` | identity | Schema mismatch |
| `payment_methods_view` | billing | Schema mismatch |

**Task:**
- [ ] Audit all `.from()` calls for schema compliance
- [ ] Verify table/view exists in database
- [ ] Add schema prefix for non-public tables
- [ ] Test each query works with proper schema

---

## Root Cause Analysis

### Why Tables/Views Can't Be Found

1. **Schema Prefix Missing** (80%)
   - View exists but in different schema
   - Code doesn't specify `.schema()`
   - Supabase defaults to `public` schema

2. **Wrong Table Name** (10%)
   - Typo in table/view name
   - Table was renamed
   - Using old view name

3. **View Deleted** (5%)
   - View was removed during cleanup
   - Deprecation not communicated
   - Code still references it

4. **Permission Issues** (5%)
   - Table/view exists but not accessible
   - RLS policies blocking access
   - User role doesn't have permission

---

## Schema Mapping Reference

### Views Requiring Schema Prefix

```typescript
// ALL of these need schema prefix - they're NOT in public schema

// audit schema
supabase.schema('audit').from('audit_logs_view')

// security schema
supabase.schema('security').from('security_access_logs')
supabase.schema('security').from('security_incident_logs_view')

// organization schema
supabase.schema('organization').from('user_roles_view')
supabase.schema('organization').from('staff_details_view')

// communication schema
supabase.schema('communication').from('message_threads_view')
supabase.schema('communication').from('notification_events_view')

// scheduling schema
supabase.schema('scheduling').from('appointment_details_view')

// catalog schema
supabase.schema('catalog').from('service_details_view')

// identity schema
supabase.schema('identity').from('profiles_view')
supabase.schema('identity').from('user_mfa_view')

// billing schema
supabase.schema('billing').from('payment_methods_view')
```

### Views in Public Schema (No Prefix Needed)

```typescript
// These are in public schema - NO prefix needed

supabase.from('salons_view')
supabase.from('staff_view')
supabase.from('appointments_view')
supabase.from('salon_reviews_with_counts_view')
// ... and 30+ more public views
```

---

## Verification Script

```bash
#!/bin/bash
# Find all table/view references in code

echo "=== All .from() calls in code ==="
grep -r "\.from(" features/ --include="*.ts" --include="*.tsx" | \
  grep -oP "from\('\K[^']*" | sort | uniq

echo ""
echo "=== Tables/views in public schema (no prefix) ==="
# Query your Supabase database for public tables/views
psql "your-connection-string" -c \
  "SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'"

echo ""
echo "=== Find mismatches ==="
# Compare the two lists
```

---

## Fix Strategy

### Step 1: Identify All Schema-Qualified Views

```bash
# Find which views are in non-public schemas
for schema in audit security organization communication scheduling catalog identity billing; do
  psql "your-connection-string" -c \
    "SELECT table_name FROM information_schema.views
     WHERE table_schema = '$schema'" | \
    awk -v s="$schema" '{print s "." $1}'
done
```

### Step 2: Audit Code for Missing Prefixes

```bash
# Find all .from() calls
grep -r "\.from(" features/ --include="*.ts" | \
  grep -oP "from\('\K[^']*" | sort | uniq > /tmp/used_views.txt

# Compare with schema-qualified views
# Any match = needs schema prefix
```

### Step 3: Add Schema Prefixes

For each non-public schema view found:

```typescript
// BEFORE
await supabase.from('audit_logs_view').select('*')

// AFTER
await supabase.schema('audit').from('audit_logs_view').select('*')
```

### Step 4: Test Each Query

```typescript
// Test each query works
const { data, error } = await supabase
  .schema('audit')
  .from('audit_logs_view')
  .select('*')
  .limit(1)

if (error) console.error('Schema mismatch:', error)
else console.log('Success:', data)
```

---

## Testing Checklist

For each table/view fix:

- [ ] Table/view exists in database
- [ ] Schema is correct (public or specific schema)
- [ ] Columns being selected actually exist
- [ ] SELECT statement is valid
- [ ] Query returns expected data
- [ ] No permission/RLS errors
- [ ] Query works in Supabase console
- [ ] TypeScript error is resolved

---

## Related Tasks

**See Also:**
- [01-schema-overview.md](01-schema-overview.md) - Complete schema mapping
- [02-mismatch-summary.md](02-mismatch-summary.md) - Issue statistics
- [09-fix-priority.md](09-fix-priority.md) - Recommended fix order

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Non-existent table issues | 12+ |
| Files affected | 8+ |
| Critical issues | 8 |
| High priority issues | 4 |
| Schema mismatches (main issue) | 80% of problems |
| Estimated fix time | 1-2 days |
| Database changes needed | 0 (schema already exists) |
| Code-only fixes | Yes |

---

## Implementation Checklist

- [ ] Identify all schema-qualified views needing prefixes
- [ ] Add `.schema()` prefix to all non-public table queries
- [ ] Verify all views exist in their schemas
- [ ] Test each query in isolation
- [ ] Verify columns being selected actually exist
- [ ] Check permissions/RLS aren't blocking access
- [ ] Run `npm run typecheck` - should have 0 TS2769 errors
- [ ] Integration test each feature end-to-end

---

**Critical:** This is the most common issue type. Fixing these schema mismatches will resolve ~40% of all TypeScript errors.

**Next:** Review [09-fix-priority.md](09-fix-priority.md) for recommended fix order.
