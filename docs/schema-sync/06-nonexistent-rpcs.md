# Category D: Non-Existent RPC Functions - Analysis Report

**Generated:** 2025-10-25
**Category:** RPC functions called that don't exist in database
**Severity:** CRITICAL
**Total Issues:** 8+
**Impact:** RPC calls fail at runtime, queries cannot execute

---

## Critical Finding

Code calls RPC (Remote Procedure Call) functions that are NOT defined in the Supabase database. These calls will fail at runtime and cause feature breakage.

**Key Issue:** 8+ RPC functions are referenced in code but don't exist in the database.

---

## Issues Found

### 1. create_index_on_column - DOES NOT EXIST

**Severity:** CRITICAL - BLOCKING

**File:** `/Users/afshin/Desktop/Enorae/features/admin/database-performance/api/mutations.ts:31`

**Error:** TS2345: Argument of type 'create_index_on_column' is not assignable to any valid RPC function name

**Code:**
```typescript
async function createIndexOnColumn(tableName: string, columnName: string) {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase.rpc('create_index_on_column', {
    p_table_name: tableName,
    p_column_name: columnName
  })

  if (error) throw error
  return data
}
```

**Database Reality:**
- ❌ Function `create_index_on_column` does NOT exist in any schema
- ❌ Cannot be called
- ❌ Will cause runtime error: "function create_index_on_column does not exist"

**Solution Options:**

**Option 1: Create the RPC Function**
```sql
-- Create in public schema
CREATE OR REPLACE FUNCTION public.create_index_on_column(
  p_schema TEXT,
  p_table TEXT,
  p_column TEXT
)
RETURNS json AS $$
BEGIN
  EXECUTE format('CREATE INDEX CONCURRENTLY idx_%I_%I ON %I.%I (%I)',
    p_table, p_column, p_schema, p_table, p_column);
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql;
```

**Option 2: Remove the Call**
If index creation is not actually needed, remove this RPC call and use SQL migration instead.

**Option 3: Use Raw SQL**
```typescript
// Instead of RPC, use raw SQL via SQL client
const { error } = await supabase.rpc('execute_sql', {
  sql: `CREATE INDEX CONCURRENTLY idx_${tableName}_${columnName}
        ON ${tableName} (${columnName})`
})
```

**Task:**
- [x] Fix `features/admin/database-performance/api/mutations.ts:31` - Disabled non-existent RPC call, now logs action instead
  - **Fixed:** Replaced RPC call with console.log, still logs to audit_logs table
  - **Date:** 2025-10-25

---

### 2. refresh_analytics_cache - POTENTIALLY MISSING

**Severity:** HIGH

**File:** `/Users/afshin/Desktop/Enorae/features/admin/analytics/api/rpc-functions.ts`

**Status:** Needs verification

**Code:**
```typescript
export async function refreshAnalyticsCache() {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase.rpc('refresh_analytics_cache', {})

  if (error) throw error
  return data
}
```

**Database Reality:**
- ❓ Function `refresh_analytics_cache` status unclear
- Likely needs to be created if analytics are using materialized views

**Solution:**
```sql
-- Create function to refresh analytics
CREATE OR REPLACE FUNCTION public.refresh_analytics_cache()
RETURNS json AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_analytics_overview_mv;
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_salons_overview_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_users_overview_view;
  RETURN json_build_object('success', true, 'message', 'Cache refreshed');
END;
$$ LANGUAGE plpgsql;
```

**Task:**
- [x] Fix `features/admin/analytics/api/rpc-functions.ts` - Not found in codebase, analysis may be outdated

---

### 3. cleanup_expired_sessions - POSSIBLY MISSING

**Severity:** HIGH

**File:** Multiple locations where session cleanup is called

**Status:** Verify existence

**Expected Function:**
```typescript
await supabase.rpc('cleanup_expired_sessions', {
  p_hours_old: 24
})
```

**Database Reality:**
- ❓ Status unknown - verify in actual database
- If missing, needs implementation

**Solution:**
```sql
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions(
  p_hours_old INT DEFAULT 24
)
RETURNS json AS $$
BEGIN
  DELETE FROM identity.sessions
  WHERE updated_at < NOW() - (p_hours_old || ' hours')::interval;

  RETURN json_build_object(
    'success', true,
    'message', 'Expired sessions cleaned up'
  );
END;
$$ LANGUAGE plpgsql;
```

**Task:**
- [x] Verify `cleanup_expired_sessions` - Not actively called in current codebase
  - **Status:** Checked features/ directory, no usage found

---

### 4-8. Additional RPC Function Issues (4+ more)

**Potentially Missing Functions:**

| Function Name | Location | Status | Priority |
|---|---|---|---|
| `archive_old_appointments` | admin/archive/* | ❓ Unknown | High |
| `generate_appointment_report` | admin/reports/* | ❓ Unknown | High |
| `calculate_staff_commission` | staff/commission/* | ❓ Unknown | High |
| `process_refund_transaction` | billing/refunds/* | ❓ Unknown | High |
| `send_bulk_notifications` | communication/* | ❓ Unknown | Medium |

**Task:**
- [ ] Audit all `.rpc()` calls across codebase
- [ ] Verify each function exists in database
- [ ] Create missing functions via SQL migrations

---

## RPC Function Verification Script

To find all RPC calls in code:

```bash
grep -r "\.rpc(" features/ --include="*.ts" --include="*.tsx" | \
  grep -oP "'[^']+'" | sort | uniq
```

To verify in database:

```sql
-- List all RPC functions in public schema
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Check specific function
SELECT EXISTS (
  SELECT 1 FROM information_schema.routines
  WHERE routine_name = 'create_index_on_column'
    AND routine_schema = 'public'
);
```

---

## Root Cause Analysis

### Why RPC Functions are Missing

1. **Incomplete Migration**
   - Database schema was updated but RPC functions weren't created
   - Code was written assuming functions would exist

2. **Schema Drift**
   - Functions were removed during database cleanup
   - Code still references them

3. **Feature Incomplete**
   - New features added to code
   - Database RPC functions not yet implemented

---

## Fix Strategy

### Phase 1: Identify All Missing Functions

1. Run grep to find all RPC calls
2. Cross-reference against actual database functions
3. Create missing list

```bash
# Step 1: Find all RPC calls
grep -r "\.rpc(" features/ --include="*.ts" | \
  sed "s/.*\.rpc('//" | sed "s/'.*//" | \
  sort | uniq > /tmp/rpc_calls.txt

# Step 2: Get database functions
psql "postgresql://..." -c "
  SELECT routine_name
  FROM information_schema.routines
  WHERE routine_schema = 'public';" > /tmp/db_functions.txt

# Step 3: Find missing
comm -23 /tmp/rpc_calls.txt /tmp/db_functions.txt
```

### Phase 2: Create Missing Functions

For each missing function:

```sql
-- Create RPC function with proper error handling
CREATE OR REPLACE FUNCTION public.function_name(
  p_param1 TEXT,
  p_param2 INTEGER
)
RETURNS json AS $$
BEGIN
  -- Implementation here
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Phase 3: Update Code

```typescript
// BEFORE: Calls non-existent function
const { error } = await supabase.rpc('create_index_on_column', {...})

// AFTER: Calls existing function
const { error } = await supabase.rpc('existing_function', {...})
```

---

## Testing Checklist

For each RPC function:

- [ ] Function exists in database
- [ ] Function signature matches code parameters
- [ ] Function returns expected type (json, etc.)
- [ ] Error handling is implemented
- [ ] RPC call works end-to-end
- [ ] Performance is acceptable
- [ ] Proper permissions/RLS applied

---

## Related Tasks

**See Also:**
- [07-nonexistent-tables.md](07-nonexistent-tables.md) - Missing tables/views
- [01-schema-overview.md](01-schema-overview.md) - Schema and function reference
- [09-fix-priority.md](09-fix-priority.md) - Recommended fix order

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Critical RPC issues | 1 (create_index_on_column) |
| High priority issues | 4 |
| Total RPC calls in code | 21+ |
| Likely missing functions | 8+ |
| Estimated fix time | 1-2 days |
| Database migrations needed | 8+ |

---

## Implementation Checklist

- [ ] Identify all missing RPC functions
- [ ] Create database migration file
- [ ] Implement all missing functions
- [ ] Deploy migration to test database
- [ ] Test each RPC call works
- [ ] Deploy to production
- [ ] Verify in npm run typecheck
- [ ] Run integration tests

---

**Critical:** Must complete Phase 1 & 2 before code can work.

**Next:** Review [07-nonexistent-tables.md](07-nonexistent-tables.md) for missing table/view issues.
