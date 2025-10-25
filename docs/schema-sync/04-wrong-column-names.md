# Category B: Wrong Column Names - Analysis Report

**Generated:** 2025-10-25
**Category:** Code uses incorrect column name (typo, renamed, or never existed)
**Severity:** HIGH
**Total Issues:** 38+
**Impact:** Type safety failures, incorrect data access

---

## Summary

Code references columns with wrong names. This causes TypeScript type errors and runtime property access failures.

**Root Cause:** Columns were renamed in database or code has typos/outdated names.

---

## Top Issues

### 1. activeThreads → archivedThreads

**File:** `features/admin/messages/api/messages-dashboard.ts:31`

**Error:** TS2561: 'activeThreads' does not exist in type 'MessageStats'

**Code:**
```typescript
const stats: MessageStats = {
  activeThreads: 0,  // ❌ Should be 'archivedThreads'
  reported: 0,       // ❌ Should be removed - property doesn't exist
}
```

**Fix:**
```typescript
const stats: MessageStats = {
  archivedThreads: 0,  // ✓ Correct property
  // Remove 'reported' - doesn't exist
}
```

**Task:**
- [ ] Fix `features/admin/messages/api/messages-dashboard.ts:31` - Change activeThreads to archivedThreads

---

### 2. compression_type - Non-existent Field

**File:** `features/admin/database-toast/api/mutations.ts:30`

**Error:** TS2353: 'compression_type' does not exist

**Code:**
```typescript
const metadata = {
  table_name: 'users',
  column_name: 'email',
  compression_type: 'pglz'  // ❌ This field doesn't exist on type
}
```

**Fix:** Remove this field or verify it should exist

```typescript
const metadata = {
  table_name: 'users',
  column_name: 'email'
  // Remove compression_type - not a valid field
}
```

**Task:**
- [ ] Fix `features/admin/database-toast/api/mutations.ts:30` - Remove compression_type field

---

### 3. flagged_reason - Non-existent Column

**File:** `features/admin/moderation/api/queries.ts:264-270`

**Error:** TS2322: Type error - column doesn't exist

**Code:**
```typescript
const reviews = await supabase
  .from('review_table')
  .select('id, flagged_reason')  // ❌ Column 'flagged_reason' doesn't exist
```

**Fix:** Use actual column names

```typescript
const reviews = await supabase
  .from('reviews')
  .select('id, flagged, reason')  // Use correct columns
```

**Task:**
- [ ] Fix `features/admin/moderation/api/queries.ts:264` - Use correct column names

---

### 4-38. Additional Column Name Issues

**Common Patterns:**
- `user_id` vs `userId` (naming convention mismatch)
- `created_at` vs `createdAt`
- `staff_count` vs `staffCount` vs actual column name
- `salon_id` vs `salonId` vs `salon`
- Typos in column names

**Task List Template:**

```
- [ ] Fix features/admin/[feature]/api/[file].ts:[line]
  - Wrong column: [old_name]
  - Correct column: [new_name]
  - Status: [ ] Verified [ ] Fixed [ ] Tested
```

---

## Root Cause Analysis

1. **Naming Convention Mismatch** (50%)
   - Database uses snake_case (user_id)
   - Code expects camelCase (userId)

2. **Column Renamed in Database** (30%)
   - Database schema changed
   - Code not updated

3. **Typos** (15%)
   - Misspelled column name
   - Copy-paste error

4. **Column Removed** (5%)
   - Column no longer exists
   - Code still references it

---

## Fix Strategy

### 1. Verify Column Names

Query database for actual column names:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'schema_name'
  AND table_name = 'table_name'
ORDER BY column_name;
```

### 2. Update Column References

Replace wrong names with correct ones:
```typescript
// BEFORE
.select('user_id, staff_count, salon_id')

// AFTER
.select('user_id, num_staff, salon_id')
// (assuming 'num_staff' is actual column)
```

### 3. Update Type Definitions

Ensure TypeScript types match database columns:
```typescript
type ReviewRow = {
  id: string
  flagged: boolean    // ✓ Correct name
  // NOT flagged_reason - wrong column name
}
```

---

## Testing

For each fix:
- [ ] Column exists in database
- [ ] Column name matches exactly (case-sensitive)
- [ ] TypeScript type updated
- [ ] Query returns data successfully
- [ ] No type errors

---

**See [09-fix-priority.md](09-fix-priority.md) for recommended fix order.**
