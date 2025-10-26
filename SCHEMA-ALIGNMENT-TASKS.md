# Database Alignment Fix Task List

**Started:** 2025-10-25
**Agent:** database-alignment-fixer.md (Action-Oriented)
**Scanning Tool:** `npm run scan:schema:full`
**Goal:** Reduce 439 TypeScript errors to 0

---

## 📊 Baseline Metrics

**From Scanner Output:**
- Total TypeScript Errors: 439
- Critical Issues: ~28
- High Priority: ~67
- Medium Priority: ~156
- Low Priority: ~188

**Error Distribution:**
- TS2339 (Property doesn't exist): 140 errors
- TS2532 (Possibly undefined): 85 errors
- TS7053 (Implicit any): 60 errors
- TS2322 (Type mismatch): 40 errors
- TS2345 (Argument type mismatch): 35 errors
- Other: 79 errors

---

## 🚀 PRIORITY 1: High-Impact Files (10+ errors each)

These files will have the most impact on overall error count.

### Task 1: features/business/analytics/api/queries.ts
- [ ] Read file completely
- [ ] Identify all database access patterns
- [ ] Fix TS2339 errors (verify columns exist)
- [ ] Fix TS2532 errors (add optional chaining)
- [ ] Fix TS7053 errors (add type narrowing)
- [ ] Run: `npm run typecheck 2>&1 | grep "features/business/analytics/api/queries.ts" | wc -l`
- [ ] Verify error count decreased
- [ ] Commit changes with clear message
- [x] Status: Not started

### Task 2: features/business/appointments/api/queries.ts
- [ ] Read file completely
- [ ] Identify all database access patterns
- [ ] Apply systematic fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

### Task 3: features/customer/dashboard/api/queries.ts
- [ ] Read file completely
- [ ] Identify all database access patterns
- [ ] Apply systematic fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

### Task 4: features/admin/staff/api/internal/staff-dashboard/fetchers.ts
- [ ] Read file completely
- [ ] Identify all database access patterns
- [ ] Apply systematic fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

### Task 5: features/business/notifications/api/queries.ts
- [ ] Read file completely
- [ ] Identify all database access patterns
- [ ] Apply systematic fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

---

## 📈 PRIORITY 2: Medium-Impact Files (5-9 errors each)

Medium-impact files that will help with error reduction.

### Task 6: features/staff/commission/api/queries/stats.ts
- [ ] Read file completely
- [ ] Apply fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

### Task 7: features/staff/schedule/api/queries.ts
- [ ] Read file completely
- [ ] Apply fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

### Task 8: features/customer/appointments/api/queries.ts
- [ ] Read file completely
- [ ] Apply fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

### Task 9: features/admin/roles/api/queries.ts
- [ ] Read file completely
- [ ] Apply fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

### Task 10: features/business/settings-salon/api/queries.ts
- [ ] Read file completely
- [ ] Apply fixes
- [ ] typecheck verify
- [ ] Commit
- [ ] Status: Not started

---

## 📋 PRIORITY 3: Low-Impact Files (1-4 errors each)

Additional files with fewer errors.

### Task 11-50: Remaining files
- [ ] To be populated from scanner results
- [ ] Process in batches of 10
- [ ] Run full scan after each batch

---

## 📈 Session Tracking

### Session 1: [DATE]

**Start:** 439 errors
**Target:** Reduce by 50+ errors (Priority 1 files)

**Completed Tasks:**
- [ ] Task 1: features/business/analytics/api/queries.ts
  - Status: Not started
  - Errors fixed: --
  - Error types: --

- [ ] Task 2: features/business/appointments/api/queries.ts
  - Status: Not started
  - Errors fixed: --
  - Error types: --

**Session Summary:**
- Errors fixed: 0
- Current count: 439
- Time spent: 0 minutes
- Tasks completed: 0

**Next:** Start Task 1

---

### Session 2: [DATE]

**Start:** 439 errors
**Target:** Continue Priority 1 files

**Completed Tasks:**
- [ ] Task 3: features/customer/dashboard/api/queries.ts
- [ ] Task 4: features/admin/staff/api/internal/staff-dashboard/fetchers.ts

**Session Summary:**
- Errors fixed: 0
- Current count: 439
- Time spent: 0 minutes
- Tasks completed: 0

---

## 🎯 Quick Command Reference

### Before Starting Session
```bash
# Get current error count
npm run typecheck 2>&1 | grep "error TS" | wc -l

# Run full scan
npm run scan:schema:full

# View top files
jq '.mismatches_by_file | to_entries[] | {file: .key, count: (.value|length)} | sort_by(-.count) | .[0:15]' docs/schema-scan-report.json
```

### While Fixing a File
```bash
# Get errors for specific file
jq '.mismatches_by_file["features/business/analytics/api/queries.ts"]' docs/schema-scan-report.json

# Check errors in file after fix
npm run typecheck 2>&1 | grep "features/business/analytics/api/queries.ts"

# Count errors in file
npm run typecheck 2>&1 | grep "features/business/analytics/api/queries.ts" | wc -l
```

### After Completing Task
```bash
# Verify typecheck
npm run typecheck 2>&1 | grep "error TS" | wc -l

# Commit with standard message
git add .
git commit -m "fix(schema-alignment): Fix database mismatches in [feature]

- Fixed TS2339: Property access (X errors)
- Fixed TS2532: Optional chaining (X errors)
- Fixed TS7053: Type narrowing (X errors)
- Verified against lib/types/database.types.ts
- Error reduction: from Y to Z"
```

### After Each Batch (5-10 files)
```bash
# Full re-scan
npm run scan:schema:full

# Compare metrics
jq '.mismatch_summary' docs/schema-scan-report.json
```

---

## 📝 Fix Patterns Quick Reference

### Pattern 1: TS2339 - Property Doesn't Exist

```typescript
// ❌ BEFORE
const name = row.customer_name

// ✅ AFTER - Option 1: Use correct column
const customerId = row.customer_id

// ✅ AFTER - Option 2: Join query
const { data } = await supabase
  .from('appointments_view')
  .select('*, profiles!customer_id(name)')
const name = data?.profiles?.name
```

### Pattern 2: TS2532 - Possibly Undefined

```typescript
// ❌ BEFORE
const name = user.profile.name

// ✅ AFTER
const name = user?.profile?.name
const nameWithDefault = user?.profile?.name ?? 'Unknown'
```

### Pattern 3: TS7053 - Implicit Any

```typescript
// ❌ BEFORE
const value = row[columnName]

// ✅ AFTER
const value = row[columnName as keyof typeof row]
```

### Pattern 4: TS2322 - Type Mismatch

```typescript
// ❌ BEFORE
const date: string = dateValue  // dateValue is string | null

// ✅ AFTER - Option 1
const date: string | null = dateValue

// ✅ AFTER - Option 2
const date: string = dateValue ?? new Date().toISOString()
```

---

## 📊 Progress Log

```
2025-10-25 | Start: 439 errors | Target: 0 errors | Progress: 0%
```

**Update this log as you complete tasks.**

---

## ✅ Completion Checklist

**Mission Complete When All Of These Are True:**

- [ ] `npm run typecheck` returns ZERO errors
- [ ] All PRIORITY 1 tasks marked [x]
- [ ] All PRIORITY 2 tasks marked [x]
- [ ] All PRIORITY 3 tasks marked [x]
- [ ] All critical issues from scan marked [x]
- [ ] No edits to `lib/types/database.types.ts`
- [ ] No edits to Supabase database
- [ ] Clear git commit history showing all fixes
- [ ] Final re-scan shows 0 mismatches

---

## 🚀 How to Use This Task List

1. **Start a session:**
   ```bash
   npm run scan:schema:full
   ```

2. **Pick a task from PRIORITY 1:**
   - Read the file completely
   - Understand current database access
   - Apply fixes following patterns above
   - Run `npm run typecheck` to verify
   - Mark task [x] when complete
   - Commit with clear message

3. **After 5-10 tasks:**
   - Run full scan again
   - Update this task list
   - Note progress in Session Tracking

4. **Repeat until zero errors**

---

**Last Updated:** 2025-10-25
**Total Tasks:** ~50 files to fix
**Estimated Time:** 20-30 hours for complete alignment
**Next Step:** Start PRIORITY 1 Task 1
