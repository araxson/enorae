# Category F: Incorrect Select Statements - Analysis Report

**Generated:** 2025-10-25
**Category:** SELECT statements that are malformed or select non-existent columns
**Severity:** HIGH
**Total Issues:** 15+
**Impact:** Query failures, type safety errors

---

## Summary

Code SELECT statements have issues that prevent them from executing correctly:
- Selecting columns that don't exist
- Incorrect SELECT syntax
- Selecting from wrong table/view

---

## Issue Examples

### 1. Selecting Non-Existent Computed Column

**File:** `features/admin/database-toast/api/mutations.ts:38`

**Code:**
```typescript
const { error } = await supabase
  .schema('security')
  .from('security_event_logs')
  .insert({
    // Missing required fields:
    action: undefined,           // ❌ Required but missing
    target_schema: undefined,    // ❌ Required but missing
    target_table: undefined,     // ❌ Required but missing
    // Providing wrong fields:
    event_type: 'database_toast'
  })
```

**Issue:** INSERT statement provides wrong column names

**Fix:**
```typescript
const { error } = await supabase
  .schema('security')
  .from('security_event_logs')
  .insert({
    action: 'database_toast_compression',  // ✓ Required
    target_schema: 'public',               // ✓ Required
    target_table: tableName,               // ✓ Required
    event_type: 'database_toast',
    severity: 'info'
  })
```

**Task:**
- [ ] Fix `features/admin/database-toast/api/mutations.ts:38` - Match required columns

---

### 2. Selecting with Wildcard and Non-Existent Column

**Pattern:**
```typescript
// WRONG: Trying to select wildcard + non-existent column
const { data } = await supabase
  .from('salons_view')
  .select('*, staff_count')  // ❌ staff_count doesn't exist

// CORRECT: Select only existing columns
const { data } = await supabase
  .from('salons_view')
  .select('*')

// Or select specific columns that exist
const { data } = await supabase
  .from('salons_view')
  .select('id, name, location')
```

**Issues:**
- Wildcard `*` combined with non-existent columns
- Computed columns that don't exist
- Aggregated counts that aren't in view

---

### 3. Type Conversion from SELECT

**File:** `features/admin/database-performance/api/queries.ts:59`

**Code:**
```typescript
// WRONG: Type conversion without matching types
const result = await supabase.rpc('get_index_performance_stats')
return (result as QueryPerformanceRecord[])  // ❌ Types don't match

// CORRECT: Transform result first
return result.map(row => ({
  id: row.id,
  index_name: row.index_name,
  index_scans: row.index_scans,
  mean_time_ms: parseFloat(row.mean_time_ms as string),
  // ... other fields mapped correctly
}))
```

**Issue:** RPC returns columns with different names/types than expected type

---

## Common SELECT Issues

| Issue | Example | Fix |
|-------|---------|-----|
| Non-existent column | `.select('*, missing_col')` | Remove non-existent column |
| Wrong table name | `.from('salons_table')` | Use correct view/table name |
| Missing schema | `.from('audit_logs_view')` | Add `.schema('audit')` |
| Type mismatch | `(result as WrongType)` | Transform data or update type |
| Missing required columns in INSERT | `.insert({ name: 'x' })` | Include all required fields |

---

## Fix Strategy

### 1. Verify Column Existence

Query database for available columns:
```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'salons_view'
ORDER BY column_name;
```

### 2. Update SELECT Statement

```typescript
// WRONG
.select('id, name, missing_column, another_invalid')

// CORRECT
.select('id, name, location, description')
```

### 3. Handle Type Mismatches

```typescript
// WRONG: Direct cast
return (rpcResult as ExpectedType[])

// CORRECT: Transform with type safety
return rpcResult.map(row => {
  const result: ExpectedType = {
    id: row.id,
    field: row.field as FieldType,
  }
  return result
})
```

---

## Testing

For each SELECT fix:

- [ ] Columns being selected exist in table/view
- [ ] Table/view name is correct
- [ ] Schema prefix is correct (if needed)
- [ ] No computed columns that don't exist
- [ ] Types match between SELECT and usage
- [ ] Query returns expected data

---

## All Issues by File

1. `features/admin/database-toast/api/mutations.ts:38` - Wrong INSERT fields
2. `features/admin/database-performance/api/queries.ts:59` - Type mismatch from RPC
3. `features/admin/database-toast/api/queries.ts:57` - Type conversion error
4. `features/admin/moderation/api/queries.ts:264-270` - Multiple SELECT issues
5. And 10+ more files

---

**See [09-fix-priority.md](09-fix-priority.md) for recommended fix order.**
