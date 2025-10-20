# Database Fix - Reusable Session

Auto-fix database issues in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted issues, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/database/analysis-report.json`

## Rules Reference

**Primary**: `docs/rules/core/database.md`
**Index**: `docs/rules/01-rules-index.md`
**Task Guide**: `docs/rules/02-task-based-guide.md`

## Process

### 1. Load Report
```
Read: analysis-report.json
Filter: issues where status === "pending"
Sort: by priority_order (ascending - DB-P001 → DB-L999)
Take: First 10-20 issues
```

### 2. Fix Batch
For each issue in batch (DB-P001 → DB-L999):
1. Read target file
2. Apply fix based on fix_pattern from rule
3. Update file
4. Update issue status in JSON
5. Save report
6. Continue to next

### 3. Batch Complete

After fixing batch:
```
Show progress summary
Save updated report
Indicate if more issues remain
```

## Fix Patterns by Rule

### Rule: DB-P001 {#db-p001}

**Pattern**: Reads use public views; writes target schema tables
**Fix**: Replace `.schema('X').from('Y').select()` with `.from('Y').select()` for reads

```ts
// ❌ WRONG
await supabase.schema('scheduling').from('appointments').select('*')

// ✅ CORRECT
await supabase.from('appointments').select('*').eq('customer_id', user.id)
```

**Reference**: `docs/rules/core/database.md#db-p001`
**Related**: SEC-P003, TS-M302

### Rule: DB-P002 {#db-p002}

**Pattern**: Every query/mutation verifies user
**Fix**: Add auth check at start of function

```ts
// ❌ WRONG
export async function getAppointments() {
  const supabase = await createClient()
  const { data } = await supabase.from('appointments').select('*')
  return data
}

// ✅ CORRECT
export async function getAppointments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data } = await supabase.from('appointments').select('*')
  return data
}
```

**Reference**: `docs/rules/core/database.md#db-p002`
**Related**: SEC-P001, ARCH-P001

### Rule: DB-P003 {#db-p003}

**Pattern**: Multi-tenant RLS enforces tenant scope
**Fix**: Add tenant filter in RLS using auth.jwt() claims

```sql
-- Add to policy
using (salon_id = (select auth.jwt() -> 'app_metadata' ->> 'salon_id'))
```

**Reference**: `docs/rules/core/database.md#db-p003`
**Related**: SEC-H102

### Rule: DB-H101 {#db-h101}

**Pattern**: Wrap auth.uid() in SELECT
**Fix**: Replace direct auth.uid() with subquery

```sql
-- ❌ WRONG
using (auth.uid() = user_id)

-- ✅ CORRECT
using ((select auth.uid()) = user_id)
```

**Reference**: `docs/rules/core/database.md#db-h101`
**Related**: SEC-P003

### Rule: DB-H102 {#db-h102}

**Pattern**: Enforce MFA on sensitive tables
**Fix**: Add restrictive policy checking aal level

```sql
create policy "MFA required"
  on analytics.manual_transactions as restrictive
  to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2');
```

**Reference**: `docs/rules/core/database.md#db-h102`
**Related**: SEC-H101

### Rule: DB-H103 {#db-h103}

**Pattern**: Call revalidatePath after mutations
**Fix**: Add revalidatePath after successful write

```ts
// Add after mutation
if (error) throw error

revalidatePath('/customer/appointments')
return data
```

**Reference**: `docs/rules/core/database.md#db-h103`
**Related**: PERF-L702

### Rule: DB-M301 {#db-m301}

**Pattern**: Use .returns<Type>() for typed responses
**Fix**: Add type assertion to query chain

```ts
// Add .returns<Type>()
const { data } = await supabase
  .from('appointments')
  .select('*')
  .returns<Appointment[]>()
```

**Reference**: `docs/rules/core/database.md#db-m301`
**Related**: TS-M302

### Rule: DB-M302 {#db-m302}

**Pattern**: Validate payloads with Zod before mutations
**Fix**: Add schema.parse before database write

```ts
'use server'
import { createAppointmentSchema } from '../schema'

export async function createAppointment(input: unknown) {
  const payload = createAppointmentSchema.parse(input)
  // ... rest of mutation
}
```

**Reference**: `docs/rules/core/database.md#db-m302`
**Related**: SEC-M302

### Rule: DB-L701 {#db-l701}

**Pattern**: Prefer select/filter over RPC
**Fix**: Replace RPC call with view query

```ts
// ❌ WRONG
await supabase.rpc('get_salon_metrics')

// ✅ CORRECT
await supabase.from('salon_metrics_daily_mv').select('*')
```

**Reference**: `docs/rules/core/database.md#db-l701`

## Status Updates

After each fix:

**Fixed:**
```json
{
  "status": "fixed",
  "fixed_at": "ISO-8601",
  "fixed_code": "actual fixed code",
  "fix_notes": "Applied [rule pattern]: [description]"
}
```

**Needs Manual:**
```json
{
  "status": "needs_manual",
  "fix_notes": "Complex migration required - manual intervention needed",
  "error": "[what prevented auto-fix]"
}
```

**Failed:**
```json
{
  "status": "failed",
  "fix_notes": null,
  "error": "[error description]"
}
```

## Display Progress

### After Each Fix
```
✅ FIXED DB-P### [file]:[line]
│
├─ Issue: [title]
├─ Applied: [fix description]
├─ Rule: docs/rules/core/database.md#db-p###
└─ Time: [timestamp]

📊 Batch Progress: [current]/[batch_size]
⏭️  Next: DB-P###
```

### After Batch Complete
```
🎯 BATCH COMPLETE

📊 This Batch
├─ Fixed: [count]/[batch_size] issues
├─ Time: ~[minutes] minutes

📈 Overall Progress
├─ Total Issues: [total]
├─ Fixed: [fixed_count] ([fixed_percent]%)
├─ Remaining: [pending_count] ([pending_percent]%)
│
├─ By Status:
│   ├─ ✅ Fixed: [count]
│   ├─ ⏳ Pending: [count]
│   ├─ ⏭️  Skipped: [count]
│   ├─ ⚠️  Needs Manual: [count]
│   └─ ❌ Failed: [count]
│
└─ By Priority:
    ├─ Critical (DB-P): [fixed]/[total] ([percent]%)
    ├─ High (DB-H): [fixed]/[total] ([percent]%)
    ├─ Medium (DB-M): [fixed]/[total] ([percent]%)
    └─ Low (DB-L): [fixed]/[total] ([percent]%)

💾 Report Updated: docs/analyze-fixes/database/analysis-report.json

🔄 NEXT STEPS
Run /database:fix again to fix next batch (10-20 issues)
```

### When All Complete
```
🎉 ALL DATABASE ISSUES FIXED!

📊 Final Statistics
Total Issues: [count]
├─ ✅ Fixed: [count] ([percent]%)
├─ ⏭️  Skipped: [count] ([percent]%)
├─ ⚠️  Needs Manual: [count] ([percent]%)
└─ ❌ Failed: [count] ([percent]%)

⚠️  Manual Review Required:
[List issues needing manual fix with rule references]

💾 Reports Updated:
├─ docs/analyze-fixes/database/analysis-report.json
└─ docs/analyze-fixes/database/analysis-report.md

📚 Related Documentation:
├─ Rules: docs/rules/core/database.md
├─ Index: docs/rules/01-rules-index.md
└─ Tasks: docs/rules/02-task-based-guide.md

✅ No more pending issues. All automatic fixes complete!
```

## User Commands

- **"pause"** - Stop after current fix, save progress
- **"skip"** - Skip current issue, mark as skipped
- **"status"** - Show current batch and overall progress

## Batch Size

- **Default**: 10-20 issues per run
- **Min**: 10 issues
- **Max**: 30 issues
- **Adjust**: Can process fewer if issues are complex
- **Smart batching**: Critical issues may process in smaller batches

## Reusable Pattern

This command is designed to be run multiple times:

1. **First run**: Fixes first batch of pending issues
2. **Second run**: Fixes next batch of pending issues
3. **Continue**: Until all pending issues are fixed
4. **Idempotent**: Safe to run anytime, only processes pending issues

## Begin Fixing

1. Load `docs/analyze-fixes/database/analysis-report.json`
2. Filter `status === "pending"`
3. Sort by `priority_order` (ascending: DB-P001 → DB-L999)
4. Take first 10-20 issues
5. Fix each one using patterns from `docs/rules/core/database.md`
6. Update status after each
7. Save report after batch

**Start now.** Fix next batch of pending issues in priority order.
