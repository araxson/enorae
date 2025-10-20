# TypeScript Fix - Reusable Session

Auto-fix TypeScript issues in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted issues, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/typescript/analysis-report.json`

## Process

### 1. Load Report
```
Read: analysis-report.json
Filter: issues where status === "pending"
Sort: by priority_order (ascending)
Take: First 10-20 issues
```

### 2. Fix Batch
For each issue in batch (P001 → P999):
1. Read target file
2. Apply fix based on fix_pattern
3. Update file
4. Update issue status in JSON
5. Save report
6. Continue to next

### 3. Batch Complete

After fixing 10-20 issues:
```
Show progress summary
Save updated report
Indicate if more issues remain
```

## Rules Reference

Follow: `docs/rules/database-rules.md`

## Fix Patterns by Rule

### Rule: no-any-types

```typescript
// Before
const data: any = await supabase.from('salons').select('*')

// After
const { data } = await supabase
  .from('view_salons')
  .select('*')
  .returns<Database['public']['Views']['view_salons']['Row'][]>()
```

### Rule: missing-return-types

```typescript
// Before
async function getUsers() {
  return await supabase.from('view_users').select('*')
}

// After
async function getUsers(): Promise<Database['public']['Views']['view_users']['Row'][]> {
  const { data, error } = await supabase.from('view_users').select('*')
  if (error) throw error
  return data
}
```

### Rule: type-suppressions

```typescript
// Before
// @ts-ignore
const result = someFunction(data)

// After
const result: ExpectedType = someFunction(data as ProperType)
```

### Rule: implicit-any

```typescript
// Before
function processUser(user) {
  return user.name
}

// After
function processUser(user: Database['public']['Views']['view_users']['Row']) {
  return user.name
}
```

## Status Updates

After each fix:

**Fixed:**
```json
{
  "status": "fixed",
  "fixed_at": "ISO-8601",
  "fixed_code": "actual fixed code",
  "fix_notes": "Replaced 'any' with proper Database type"
}
```

**Needs Manual:**
```json
{
  "status": "needs_manual",
  "fix_notes": "Could not determine proper type",
  "error": "Multiple possible types detected"
}
```

**Failed:**
```json
{
  "status": "failed",
  "fix_notes": null,
  "error": "File not found: features/admin/api/queries.ts"
}
```

## Display Progress

### After Each Fix
```
✅ FIXED [P001] features/admin/api/queries.ts:42
│
├─ Issue: Using 'any' type in data access layer
├─ Applied: Database['public']['Views']['view_salons']['Row'][]
└─ Time: 2025-01-18 11:30:00

📊 Batch Progress: 1/15
⏭️  Next: [P002]
```

### After Batch Complete
```
🎯 BATCH COMPLETE

📊 This Batch
├─ Fixed: 15/15 issues
├─ Time: ~3 minutes

📈 Overall Progress
├─ Total Issues: 58
├─ Fixed: 15 (25.9%)
├─ Remaining: 43 (74.1%)
│
├─ By Status:
│   ├─ ✅ Fixed: 15
│   ├─ ⏳ Pending: 43
│   ├─ ⏭️  Skipped: 0
│   ├─ ⚠️  Needs Manual: 0
│   └─ ❌ Failed: 0
│
└─ By Priority:
    ├─ Critical: 12/12 (100%) ✅
    ├─ High: 3/23 (13%)
    ├─ Medium: 0/18 (0%)
    └─ Low: 0/5 (0%)

💾 Report Updated: analysis-report.json

🔄 NEXT STEPS
Run /typescript:fix again to fix next batch (10-20 issues)
```

### When All Complete
```
🎉 ALL TYPESCRIPT ISSUES FIXED!

📊 Final Statistics
Total Issues: 58
├─ ✅ Fixed: 52 (89.7%)
├─ ⏭️  Skipped: 2 (3.4%)
├─ ⚠️  Needs Manual: 3 (5.2%)
└─ ❌ Failed: 1 (1.7%)

⚠️  Manual Review Required:
P034 - features/complex/api/queries.ts:89
├─ Could not determine proper type
└─ Multiple possible types detected

💾 Reports Updated:
├─ docs/analyze-fixes/typescript/analysis-report.json
└─ docs/analyze-fixes/typescript/analysis-report.md

✅ No more pending issues. All automatic fixes complete!
```

## User Commands

- **"pause"** - Stop after current fix, save progress
- **"skip"** - Skip current issue, mark as skipped
- **"status"** - Show current batch and overall progress

## Batch Size

- **Default**: 10-20 issues per run
- **Adjust**: Can process fewer if issues are complex
- **Smart batching**: Critical issues may process in smaller batches

## Reusable Pattern

This command is designed to be run multiple times:

1. **First run**: Fixes first 10-20 pending issues
2. **Second run**: Fixes next 10-20 pending issues
3. **Continue**: Until all pending issues are fixed
4. **Idempotent**: Safe to run anytime, only processes pending issues

## Begin Fixing

1. Load `docs/analyze-fixes/typescript/analysis-report.json`
2. Filter `status === "pending"`
3. Sort by `priority_order` (ascending)
4. Take first 10-20 issues
5. Fix each one P001 → P999
6. Update status after each
7. Save report after batch

**Start now.** Fix next batch of 10-20 pending issues in priority order.
