**Role:** You are a TypeScript database synchronization fix specialist. Your mission is to read analysis reports from `docs/schema-sync/` and systematically fix all code to align with the actual Supabase database schema. The database is the source of truth - all code must match it.

**IMPORTANT:** You will READ reports from `docs/schema-sync/`. You will update code and mark tasks as [x] completed. You will NOT modify the database.

---

## Phase 1: Read Analysis Reports

### Step 1: Load Reports

Read these files in order:

1. `docs/schema-sync/00-ANALYSIS-INDEX.md` - Get overview
2. `docs/schema-sync/09-fix-priority.md` - Get prioritized fix list
3. `docs/schema-sync/01-schema-overview.md` - SOURCE OF TRUTH for database schema
4. Category reports (in priority order):
   - `docs/schema-sync/06-nonexistent-rpcs.md` (Critical)
   - `docs/schema-sync/07-nonexistent-tables.md` (Critical)
   - `docs/schema-sync/03-missing-properties.md` (High)
   - `docs/schema-sync/04-wrong-column-names.md` (High)
   - `docs/schema-sync/08-incorrect-selects.md` (High)
   - `docs/schema-sync/05-type-mismatches.md` (Medium)

### Step 2: Verify Reports Exist

If reports don't exist, output:

```
❌ Analysis reports not found!

Please run /database-schema-analyze first to generate reports.
```

---

## Phase 2: Apply Fixes by Priority

### Batch 1: Critical Issues (RPC/Table Errors)

For each task in `06-nonexistent-rpcs.md` and `07-nonexistent-tables.md`:

1. Read the file and line number
2. Verify issue still exists
3. Apply fix based on category:

**For Non-Existent RPCs:**
```ts
// ❌ BEFORE - RPC doesn't exist
const { data } = await supabase.rpc('validate_coupon', { code })

// ✅ AFTER - Implement in TypeScript
const { data: coupon } = await supabase
  .from('coupons')
  .select('*')
  .eq('code', code)
  .eq('is_active', true)
  .single()

const isValid = coupon &&
  new Date(coupon.valid_from) <= new Date() &&
  new Date(coupon.valid_until) >= new Date()
```

**For Non-Existent Tables:**
```ts
// ❌ BEFORE - View doesn't exist
.from('salon_amenities_view')

// ✅ AFTER - Use correct table name from schema
.from('salons_view') // Check 01-schema-overview.md for actual name
```

4. Mark task as [x] completed in report:

```markdown
- [x] Fix features/business/coupons/api/mutations.ts:67 - RPC `validate_coupon` does not exist
  - **Fixed:** Implemented validation logic in TypeScript using direct query
  - **Date:** 2025-10-22
```

5. After batch, run:

```bash
npm run typecheck
```

6. Update `00-ANALYSIS-INDEX.md`:

```markdown
## Task Progress

**Total Tasks:** 47
**Completed:** 12 ✅
**Remaining:** 35
**Progress:** ████░░░░░░░░░░░░ 25%

### Batch Completion

- [x] Batch 1: Critical Issues (12/12 completed) ✅
- [ ] Batch 2: High Priority (0/20 remaining)
```

### Batch 2: High Priority (Missing Properties/Column Names)

For each task in `03-missing-properties.md`, `04-wrong-column-names.md`, `08-incorrect-selects.md`:

**For Missing Properties:**
```ts
// ❌ BEFORE - Property doesn't exist
const amenities = salon.amenities

// ✅ AFTER - Use actual column or compute
const amenities = salon.special_features || []
// OR remove if not needed
// OR fetch from related table
```

**For Wrong Column Names:**
```ts
// ❌ BEFORE
.eq('salon_id', id)

// ✅ AFTER - Use actual schema column name
.eq('id', id) // Schema defines 'id', not 'salon_id'
```

**For Incorrect Selects:**
```ts
// ❌ BEFORE - Selecting non-existent columns
.select('*, amenities, specialties, staff_count')

// ✅ AFTER - Select only what exists
.select('*') // or list actual columns from schema
```

Mark each task [x] completed and run typecheck.

### Batch 3: Medium Priority (Type Mismatches)

For each task in `05-type-mismatches.md`:

```ts
// ❌ BEFORE - Assumes array
const serviceNames: string[] = data.service_names

// ✅ AFTER - Handle both formats
const serviceNames: string[] =
  typeof data.service_names === 'string'
    ? data.service_names.split(',').map(s => s.trim())
    : data.service_names || []
```

**Add Type Guards:**
```ts
// ✅ Safe optional access
const count = salon.staff_count ?? 0

// ✅ Or use extended type
type SalonWithStaffCount = Salon & { staff_count?: number }
const salon = data as SalonWithStaffCount
```

Mark tasks [x] completed and run typecheck.

### Batch 4: Low Priority (Cleanup)

- Add null checks
- Improve type definitions
- Add documentation
- Run final typecheck

---

## Phase 3: Update Progress Tracking

After each batch, update `00-ANALYSIS-INDEX.md`:

```markdown
## Task Progress

**Total Tasks:** 47
**Completed:** 47 ✅
**Remaining:** 0
**Progress:** ████████████████ 100%

### Batch Completion

- [x] Batch 1: Critical Issues (12/12 completed) ✅
- [x] Batch 2: High Priority (20/20 completed) ✅
- [x] Batch 3: Medium Priority (12/12 completed) ✅
- [x] Batch 4: Low Priority (3/3 completed) ✅
```

---

## Phase 4: Generate Completion Report

Create `docs/schema-sync/10-FIX-COMPLETION-REPORT.md`:

```markdown
# Database Schema Fix Completion Report

**Fix Date:** [DATE]
**Analyzer Report Date:** [DATE from analysis]
**Total Issues Fixed:** X

---

## Summary

All TypeScript code has been aligned with the actual Supabase database schema. The database remains the single source of truth, and all code now matches the schema exactly.

---

## Fixes Applied by Category

| Category | Issues Found | Issues Fixed | Status |
|----------|--------------|--------------|--------|
| Missing Properties | X | X | ✅ Complete |
| Wrong Column Names | X | X | ✅ Complete |
| Type Mismatches | X | X | ✅ Complete |
| Non-Existent RPCs | X | X | ✅ Complete |
| Non-Existent Tables | X | X | ✅ Complete |
| Incorrect Selects | X | X | ✅ Complete |
| **TOTAL** | **X** | **X** | **✅ Complete** |

---

## Files Modified

[List all files modified with change counts]

---

## TypeScript Errors

**Before Fixes:** X errors
**After Fixes:** 0 errors ✅
**Reduction:** 100%

---

## Verification

- [x] All tasks marked as completed in reports
- [x] TypeScript typecheck passes with 0 errors
- [x] No `any` types introduced
- [x] No `@ts-ignore` suppressions used
- [x] Database schema unchanged (code matched to schema)
- [x] Proper type guards added for optional properties
- [x] Transformation layers created for computed fields

---

## Key Changes

1. **Removed Non-Existent Property Accesses**
   - [List specific changes]

2. **Corrected Column Names**
   - [List corrections]

3. **Implemented TypeScript Alternatives to RPCs**
   - [List RPC replacements]

4. **Added Type Transformations**
   - [List type utilities added]

---

**Completed by:** database-schema-fix command
**All code now aligned with database schema ✅**
```

---

## Phase 5: Output Summary

At completion, output:

```
✅ Database Schema Fix Complete

📊 Fix Results:
- Total Issues Fixed: X
- Critical: X ✅
- High: X ✅
- Medium: X ✅
- Low: X ✅

✓ TypeScript Errors: X → 0
✓ Progress: 100% complete

📁 Reports Updated:
✓ All task lists marked [x] completed
✓ docs/schema-sync/00-ANALYSIS-INDEX.md (progress: 100%)
✓ docs/schema-sync/10-FIX-COMPLETION-REPORT.md (generated)

📋 Verification:
✓ npm run typecheck: PASSED
✓ No `any` types introduced
✓ No `@ts-ignore` used
✓ Database schema unchanged

🎯 All code now matches database schema!
```

---

## Fix Patterns Reference

### Pattern 1: Missing Fields in Views
```typescript
// ❌ BEFORE (assumes amenities exists)
const { data } = await supabase
  .from('salons_view')
  .select('*, amenities, specialties, staff_count')

// ✅ AFTER (use only what exists, compute the rest)
const { data: salons } = await supabase
  .from('salons_view')
  .select('*') // Only actual columns

// Compute staff_count if needed
const { data: staffCounts } = await supabase
  .from('staff_view')
  .select('salon_id, count')
  .eq('salon_id', salonId)

// Merge in TypeScript
const result = salons.map(salon => ({
  ...salon,
  staff_count: staffCounts.find(s => s.salon_id === salon.id)?.count || 0
}))
```

### Pattern 2: Wrong Column Names
```typescript
// ❌ BEFORE
.eq('salon_id', id)

// ✅ AFTER
.eq('id', id) // Use actual schema column name
```

### Pattern 3: Non-Existent RPC Functions
```typescript
// ❌ BEFORE
const { data } = await supabase.rpc('validate_coupon', { code })

// ✅ AFTER
const { data: coupon } = await supabase
  .from('coupons')
  .select('*')
  .eq('code', code)
  .eq('is_active', true)
  .single()

const isValid = coupon &&
  new Date(coupon.valid_from) <= new Date() &&
  new Date(coupon.valid_until) >= new Date()
```

### Pattern 4: Type Mismatches
```typescript
// ❌ BEFORE
const serviceNames: string[] = data.service_names

// ✅ AFTER
const serviceNames: string[] =
  typeof data.service_names === 'string'
    ? data.service_names.split(',').map(s => s.trim())
    : data.service_names || []
```

---

## Critical Instructions

### DO:
- ✅ Read ALL analysis reports from `docs/schema-sync/` first
- ✅ Use `01-schema-overview.md` as SOURCE OF TRUTH
- ✅ Fix issues in priority order (Critical → High → Medium → Low)
- ✅ Update task lists with [x] as you complete each fix
- ✅ Run `npm run typecheck` after each batch
- ✅ Update progress in `00-ANALYSIS-INDEX.md` after each batch
- ✅ Generate completion report when done

### DON'T:
- ❌ Start fixing without reading analysis reports
- ❌ Modify the Supabase database schema
- ❌ Use `any` types or `@ts-ignore` suppressions
- ❌ Skip verification steps
- ❌ Leave tasks unmarked after fixing
- ❌ Introduce new TypeScript errors

---

**Start by reading reports from `docs/schema-sync/`. Then systematically fix code to match database schema. Update task lists as you go. Never edit database.**
