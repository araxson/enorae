# Fix Priority & Action Plan

**Generated:** 2025-10-25
**Total Issues:** 150+
**Recommended Approach:** Systematic by category and severity
**Estimated Total Time:** 5-7 days
**Status:** Ready for implementation

---

## Executive Summary

This guide provides the **recommended order** for fixing all 150+ database schema mismatches. Fixes are ordered by:

1. **Severity** (Critical > High > Medium > Low)
2. **Impact** (Blocks many issues > Blocks few issues)
3. **Effort** (Quick wins first > Complex fixes)
4. **Dependencies** (Base fixes first > Dependent fixes)

---

## Fix Timeline

| Phase | Duration | Focus | Issues Fixed |
|-------|----------|-------|--------------|
| **Phase 1: Critical (BLOCKING)** | 2-3 days | Schema prefixes, missing RPC functions | 40 critical issues |
| **Phase 2: High Priority** | 3-5 days | Missing properties, wrong column names | 83 high-priority issues |
| **Phase 3: Medium Priority** | 2-3 days | Type mismatches | 32 medium issues |
| **Phase 4: Low Priority** | 1-2 days | Edge cases, null handling | 15 low issues |
| **Total** | **5-7 days** | Complete schema sync | **150+ issues** |

---

## Phase 1: Critical Issues (2-3 days) ⚠️ BLOCKING

### These MUST be fixed first - they prevent compilation and runtime

#### Priority 1.1: Add Schema Prefixes (1 day)

**Issue:** Views/tables queried without schema prefix

**Affected:** 28+ files with 40+ instances

**Most Common Error:** TS2769 - "No overload matches"

**Files to Fix:**
1. `features/admin/dashboard/api/queries.ts:74` - audit_logs_view
2. `features/admin/moderation/api/queries.ts:264, 376, 380, 385, 390, 438` - salon_reviews_with_counts_view
3. `features/admin/profile/api/queries.ts:91` - audit_logs_view
4. `features/admin/roles/api/queries.ts:114` - audit_logs_view
5. And 8+ more files

**Pattern:**
```typescript
// WRONG
const data = await supabase.from('audit_logs_view').select('*')

// CORRECT
const data = await supabase.schema('audit').from('audit_logs_view').select('*')
```

**Schema Mapping:**
| View Name | Schema | Prefix Needed |
|-----------|--------|---------------|
| audit_logs_view | audit | YES - `.schema('audit')` |
| security_audit_log_view | security | YES - `.schema('security')` |
| user_roles_view | organization | YES - `.schema('organization')` |
| salon_reviews_with_counts_view | public | NO |
| profiles_view | identity | YES - `.schema('identity')` |
| salons_view | public | NO |

**Task List:**

- [ ] Fix `features/admin/dashboard/api/queries.ts:74` - Add `.schema('audit')` to audit_logs_view
- [ ] Fix `features/admin/moderation/api/queries.ts:264` - Verify correct schema for salon_reviews_with_counts_view
- [ ] Fix `features/admin/moderation/api/queries.ts:376` - Add schema prefix to query
- [ ] Fix `features/admin/moderation/api/queries.ts:380` - Add schema prefix to query
- [ ] Fix `features/admin/moderation/api/queries.ts:385` - Add schema prefix to query
- [ ] Fix `features/admin/moderation/api/queries.ts:390` - Add schema prefix to query
- [ ] Fix `features/admin/moderation/api/queries.ts:438` - Add schema prefix to query
- [ ] Fix `features/admin/profile/api/queries.ts:91` - Add `.schema('audit')` to audit_logs_view
- [ ] Fix `features/admin/profile/api/queries.ts:157` - Add schema prefix if needed
- [ ] Fix `features/admin/roles/api/queries.ts:114` - Add `.schema('audit')` to audit_logs_view
- [ ] Fix `features/admin/salons/api/mutations/reactivate-salon.mutation.ts` - Add schema prefix
- [ ] Fix `features/admin/security-access-monitoring/api/mutations.ts:54` - Verify schema
- [ ] (Continue for all 40 instances)

**Verification:**
```bash
npm run typecheck | grep "TS2769" | wc -l
# Should be 0 after fixes
```

---

#### Priority 1.2: Fix Non-Existent RPC Functions (1-2 days)

**Issue:** Code calls RPC functions that don't exist in database

**Affected:** 8+ RPC functions

**Critical Function:** `create_index_on_column` (line 31 in database-performance mutations)

**Files to Fix:**
1. `features/admin/database-performance/api/mutations.ts:31` - create_index_on_column
2. `features/admin/statistics-freshness/api/mutations.ts` - Unknown RPC
3. `features/admin/database-toast/api/mutations.ts:31` - Unknown RPC
4. `features/admin/salons/api/mutations/reject-salon.mutation.ts` - Unknown RPC
5. `features/admin/salons/api/mutations/approve-salon.mutation.ts` - Unknown RPC
6. And 3+ more

**Task List:**

- [ ] Create `create_index_on_column` RPC function in database (SQL migration)
- [ ] Test RPC function works in isolation
- [ ] Fix `features/admin/database-performance/api/mutations.ts:31` - Update RPC call
- [ ] Fix `features/admin/database-toast/api/mutations.ts:31` - Verify RPC exists or create
- [ ] Fix `features/admin/salons/api/mutations/reject-salon.mutation.ts` - Update RPC reference
- [ ] Fix `features/admin/salons/api/mutations/approve-salon.mutation.ts` - Update RPC reference
- [ ] Audit all other `.rpc()` calls for existence
- [ ] Create any missing RPC functions via migration
- [ ] Test all RPC calls end-to-end

**SQL Migration Template:**
```sql
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
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Verification:**
```bash
npm run typecheck | grep "TS2345" | grep "rpc"
# Should be 0 after fixes
```

---

#### Priority 1.3: Fix Non-Existent Tables/Views (12+ issues)

**Issue:** Code queries tables/views that don't exist or can't be found

**Affected:** 12+ tables/views

**Task List:**

- [ ] Fix `features/admin/dashboard/api/queries.ts` - Verify all views exist
- [ ] Fix `features/admin/moderation/api/queries.ts` - Multiple view issues
- [ ] Fix `features/admin/roles/api/queries.ts` - user_roles_view location
- [ ] Audit all `.from()` calls to ensure tables/views exist
- [ ] Add schema prefixes where needed
- [ ] Update type imports in `admin/profile/api/types.ts`
- [ ] Verify no queries reference deleted views

---

### Phase 1 Completion Check

✓ All Phase 1 fixes complete when:
```bash
npm run typecheck 2>&1 | \
  grep -E "TS2769|TS2345|TS2339.*undefined" | \
  wc -l
# Should return: 0
```

✓ All schema prefixes added
✓ All RPC functions exist
✓ No TS2769 errors remain

---

## Phase 2: High Priority Issues (3-5 days)

### These should be fixed after Phase 1 - cause type safety failures

#### Priority 2.1: Fix Missing Properties (45+ issues)

**Issue:** Code accesses properties/columns that don't exist

**Most Common:** Property `user_id` accessed on wrong table type

**Files (Top 10):**

1. `features/admin/dashboard/api/queries.ts:83` - user_id property
   - [ ] Verify column exists on queried view
   - [ ] Fix type casting if needed

2. `features/admin/profile/api/queries.ts:120` - full_name property
   - [ ] Remove `full_name` access OR
   - [ ] Add column to database OR
   - [ ] Construct from other columns

3. `features/admin/moderation/api/queries.ts:269` - flagged_reason property
   - [ ] Verify property exists on view
   - [ ] Check correct table is being queried

4. `features/admin/messages/api/messages-dashboard.ts:31` - activeThreads
   - [ ] Change to `archivedThreads` in type

5. `features/admin/database-toast/api/mutations.ts:38` - Missing event_logs columns
   - [ ] Add missing required properties
   - [ ] Or insert to different table

6-45. Additional files with property access issues

**Task List Template:**

```
- [ ] Fix features/admin/[feature]/api/[file].ts:[line] - [property_name] property
  - Status: [ ] Not accessed [ ] Exists in DB [ ] Added to schema [ ] Fixed in code
  - Notes: [details]
```

---

#### Priority 2.2: Fix Wrong Column Names (38+ issues)

**Issue:** Code uses incorrect column name (typo or renamed)

**Common Examples:**
- `activeThreads` → `archived_threads` (wrong column name)
- `compression_type` → doesn't exist (shouldn't be there)
- `flagged_reason` → actual column name is different

**Files (Top 10):**

1. `features/admin/messages/api/messages-dashboard.ts:31`
   - [ ] Update property name to match database

2. `features/admin/messages/api/messages-dashboard.ts:40`
   - [ ] Remove `reported` property or add to schema

3. `features/admin/database-toast/api/mutations.ts:30`
   - [ ] Remove `compression_type` or add to insert

4. `features/admin/reviews/api/queries.ts` - Multiple column issues
   - [ ] Map actual column names from query

5-38. Additional files with column name mismatches

---

#### Priority 2.3: Update Type Definitions

**Issue:** TypeScript types don't match database schema

**Files:**
- `features/admin/profile/api/types.ts:7` - Missing audit_logs_view
- `features/admin/roles/api/types.ts` - Missing user_roles_view
- `features/admin/messages/api/types.ts` - Wrong MessageStats definition

**Task List:**

- [ ] Review and update all type definitions to match database schema
- [ ] Ensure all properties in types exist in database
- [ ] Add missing columns to types
- [ ] Remove non-existent properties from types
- [ ] Verify type imports reference correct schema views

---

### Phase 2 Completion Check

```bash
npm run typecheck 2>&1 | \
  grep -E "TS2339|TS2353|TS2561" | \
  wc -l
# Should return: 0
```

---

## Phase 3: Medium Priority Issues (2-3 days)

### Type safety improvements - fix after Phase 1 & 2

#### Priority 3.1: Fix Type Mismatches (32 issues)

**Example:**
```typescript
// WRONG: Database returns string, expecting string[]
const tags: string[] = databaseValue.tags  // returns "tag1,tag2"

// CORRECT: Handle actual type
const tags: string = databaseValue.tags  // or parse if needed
const tagArray = tags.split(',')
```

**Task List:**

- [ ] Fix `features/admin/database-performance/api/queries.ts:59` - QueryPerformanceRecord type
- [ ] Fix `features/admin/database-toast/api/queries.ts:57` - ToastUsageRecord type
- [ ] Fix all RPC return type mappings
- [ ] Add proper type transformations for data conversions

---

## Phase 4: Low Priority Issues (1-2 days)

### Edge cases and null handling

#### Priority 4.1: Fix Null Handling (15 issues)

**Example:**
```typescript
// WRONG: Accessing property that might be undefined
const name = profile.full_name.toUpperCase()

// CORRECT: Check for null first
const name = profile.full_name?.toUpperCase() ?? 'Unknown'
```

**Files:**
- `features/admin/messages/api/thread-utils.ts:28-52` - firstCustomerMessage null checks
- Multiple dashboard queries with potential null values

**Task List:**

- [ ] Add null checks for all potentially null columns
- [ ] Use optional chaining (`?.`) for safe access
- [ ] Add proper type guards for type narrowing

---

## Testing Strategy

### After Each Phase

```bash
# 1. Type check
npm run typecheck

# 2. Lint
npm run lint

# 3. Build
npm run build

# 4. Unit tests (if exist)
npm test

# 5. Integration test (manual or automated)
npm run test:integration
```

### End-to-End Testing

Before considering complete:

- [ ] Admin dashboard loads without errors
- [ ] Moderation system works (query reviews)
- [ ] Audit logs accessible
- [ ] RPC functions execute successfully
- [ ] All mutations work without type errors
- [ ] No runtime property access errors
- [ ] Database queries return expected data types

---

## Files Requiring Special Attention

### High-Risk Files (Multiple Critical Issues)

1. **`features/admin/moderation/api/queries.ts`** - 12 errors
   - Multiple schema mismatches
   - Non-existent columns
   - Type casting issues

2. **`features/admin/dashboard/api/queries.ts`** - 8 errors
   - Schema prefix missing
   - Property access on wrong types
   - Metrics calculation issues

3. **`features/admin/profile/api/queries.ts`** - 7 errors
   - Schema mismatch (audit_logs_view)
   - Missing full_name column
   - Type definition issues

### Medium-Risk Files (2-5 Errors)

- `features/admin/roles/api/queries.ts` - 6 errors
- `features/admin/database-performance/api/mutations.ts` - 5 errors
- `features/admin/messages/api/messages-dashboard.ts` - 4 errors
- And 15+ more files

---

## Recommended Fix Order

### By File (Process High-Risk First)

1. Start with `features/admin/dashboard/api/queries.ts`
2. Continue with `features/admin/moderation/api/queries.ts`
3. Fix `features/admin/profile/api/queries.ts`
4. Address `features/admin/roles/api/*.ts`
5. Process remaining files in order of error count

### By Category (Process Blockers First)

1. **Schema Prefixes** - Blocks most queries
2. **Non-existent RPCs** - Blocks RPC calls
3. **Missing Properties** - Type safety issues
4. **Wrong Column Names** - Data access issues
5. **Type Mismatches** - Type conversion issues
6. **Null Handling** - Edge cases

---

## Success Criteria

✅ **Complete when:**

- [ ] `npm run typecheck` returns 0 errors
- [ ] `npm run build` succeeds
- [ ] All 150+ issues have been addressed
- [ ] Each report task list shows [x] for completed items
- [ ] Code passes all tests
- [ ] Admin dashboard loads without errors
- [ ] Database queries execute successfully
- [ ] RPC functions work end-to-end
- [ ] No runtime property access errors
- [ ] Code review approved

---

## Tracking Progress

### Use Task Lists

Each report (03-08) contains detailed [ ] checkboxes:

```markdown
- [x] Fixed issue 1 - Added schema prefix
- [x] Fixed issue 2 - Updated column name
- [ ] Fixed issue 3 - Still pending
```

### Update Reports

As fixes are applied:
1. Mark tasks complete with [x]
2. Add date completed
3. Note any changes made
4. Update this priority guide

### Generate Completion Report

After all fixes:
```bash
# All tasks should be marked [x]
grep "^\- \[x\]" docs/schema-sync/*.md | wc -l
# Should equal: 150+
```

---

## Rollback Plan

If issues arise during fixes:

1. **Commit before each fix** - Easy to revert
2. **Run tests after each phase** - Catch regressions
3. **Keep git history clean** - Logical, atomic commits
4. **Document what changed** - In task list with notes

---

## Additional Resources

- **Schema Reference:** [01-schema-overview.md](01-schema-overview.md)
- **Issue Details:** [03-08] - Category reports
- **Summary Stats:** [02-mismatch-summary.md](02-mismatch-summary.md)
- **Navigation:** [00-ANALYSIS-INDEX.md](00-ANALYSIS-INDEX.md)

---

## Questions?

Refer to:
- Specific category report (03-08) for detailed issue explanations
- Schema overview (01) for database column/view definitions
- Mismatch summary (02) for statistics and context

---

**Estimated Timeline:**
- ✓ Phase 1 (Critical): 2-3 days
- ✓ Phase 2 (High): 3-5 days
- ✓ Phase 3 (Medium): 2-3 days
- ✓ Phase 4 (Low): 1-2 days
- **TOTAL: 5-7 days for complete schema sync**

**Next:** Start Phase 1, Priority 1.1 - Add schema prefixes
