# Category C: Type Mismatches - Analysis Report

**Generated:** 2025-10-25
**Category:** Code expects different type than database provides
**Severity:** MEDIUM
**Total Issues:** 32+
**Impact:** Type casting errors, potential data handling bugs

---

## Summary

Code expects one data type but the database returns a different type. This causes type conversion errors and potential bugs.

**Common Examples:**
- Code expects `string[]` but database returns `string`
- Code expects `number` but database returns `string | null`
- Code expects `boolean` but database returns `boolean | null`

---

## Issue Categories

### Type 1: String vs String Array

**Example:**
```typescript
// WRONG: Database returns comma-separated string
const tags: string[] = row.tags  // row.tags = "tag1,tag2,tag3"
const tag = tags[0]              // ❌ Type error

// CORRECT: Handle actual type
const tagsString: string = row.tags
const tags = tagsString.split(',')
const tag = tags[0]
```

**Affected Fields:** Array columns stored as JSON or comma-separated strings

---

### Type 2: Null Handling

**Example:**
```typescript
// WRONG: Not checking for null
const count: number = result.staff_count

// CORRECT: Handle null possibility
const count: number = result.staff_count ?? 0
```

**Affected:** All nullable columns

---

### Type 3: Type Casting Errors

**File:** `features/admin/database-performance/api/queries.ts:59`

**Code:**
```typescript
// WRONG: Direct type cast with incompatible types
const records = (rpcResult as QueryPerformanceRecord[])

// CORRECT: Transform data first
const records = rpcResult.map(row => ({
  id: row.id,
  mean_time_ms: parseFloat(row.mean_time_ms),
  // ... other mappings
}))
```

---

### Type 4: JSON vs Structured Type

**Example:**
```typescript
// WRONG: Treating Json as typed object
const metadata: { key: string } = row.metadata

// CORRECT: Parse JSON first
const metadata = typeof row.metadata === 'string'
  ? JSON.parse(row.metadata)
  : row.metadata
```

---

## Common Issues (32+)

1. `QueryPerformanceRecord` type mismatch - File: database-performance/api/queries.ts:59
2. `ToastUsageRecord` type mismatch - File: database-toast/api/queries.ts:57
3. String array expectations - Multiple analytics files
4. Null handling in metrics - Dashboard queries
5. JSON field type conversions - Multiple mutation files

---

## Root Causes

1. **RPC Return Type Changed** (40%)
   - RPC function now returns different structure
   - Columns renamed or reformatted
   - Array vs single value change

2. **Database Type Enforcement** (30%)
   - Column type changed in schema
   - Nullable column expectations
   - String vs number type change

3. **Type Definition Mismatch** (20%)
   - TypeScript type doesn't match database
   - Missing | null in type definition
   - Wrong field type in interface

4. **Data Transformation Missing** (10%)
   - Data needs conversion before use
   - JSON parsing required
   - Splitting/joining string arrays

---

## Fix Examples

### Fix Type 1: Add Null Checks

```typescript
// BEFORE
const revenue = result.total_revenue

// AFTER
const revenue = result.total_revenue ?? 0
```

### Fix Type 2: Transform Data

```typescript
// BEFORE
const records = (data as QueryRecord[])

// AFTER
const records = data.map(row => ({
  ...row,
  created_at: new Date(row.created_at),
  metrics: typeof row.metrics === 'string'
    ? JSON.parse(row.metrics)
    : row.metrics
}))
```

### Fix Type 3: Update Type Definitions

```typescript
// BEFORE
type QueryPerformance = {
  id: string
  query_hash: string
  mean_time_ms: number
}

// AFTER
type QueryPerformance = {
  id: string
  query_hash: string
  mean_time_ms: number | null  // Can be null
  query_time_ms: string        // Actually returned as string
}
```

### Fix Type 4: Use Type Guards

```typescript
// Type guard function
function isValidMetrics(value: unknown): value is Record<string, number> {
  return typeof value === 'object' && value !== null
    && !Array.isArray(value)
}

// Usage
const metrics = isValidMetrics(row.metrics)
  ? row.metrics
  : {}
```

---

## Testing

For each type mismatch fix:

- [ ] Verify actual database type
- [ ] Update TypeScript type definition
- [ ] Add proper type guards if needed
- [ ] Handle null/undefined cases
- [ ] Test with sample data
- [ ] No type errors in TypeScript

---

**See [09-fix-priority.md](09-fix-priority.md) for recommended fix order.**
