# Database Patterns Fix - Reusable Session

Auto-fix database issues in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted issues, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/database/analysis-report.json`

## Process

### 1. Load Report
```
Read: analysis-report.json
Filter: issues where status === "pending"
Sort: by priority_order (ascending)
Take: First 10-20 issues (CRITICAL SECURITY FIRST!)
```

### 2. Fix Batch
Fix each issue, update status, save report after batch.

## Rules Reference

Follow: `docs/rules/database-rules.md` and `docs/rules/security-rules.md`

## Fix Patterns by Rule

### Rule: missing-auth-check

```typescript
// Before
export async function getData() {
  const supabase = await createClient()
  const { data } = await supabase.from('view_salons').select('*')
  return data
}

// After
export async function getData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.from('view_salons').select('*')
  if (error) throw error
  return data
}
```

### Rule: using-get-session

```typescript
// Before
const { data: { session } } = await supabase.auth.getSession()

// After
const { data: { user } } = await supabase.auth.getUser()
```

### Rule: query-schema-tables

```typescript
// Before
.from('organization.salons')

// After
.from('view_salons')
```

### Rule: missing-server-only

```typescript
// Add as FIRST line
import 'server-only'
```

### Rule: missing-use-server

```typescript
// Add as FIRST line
'use server'
```

## Display Progress

### After Batch Complete
```
🎯 BATCH COMPLETE

📊 This Batch: 15/15 fixed

📈 Overall Progress
├─ Total: 87
├─ Fixed: 15 (17.2%)
├─ Remaining: 72 (82.8%)
│
└─ By Priority:
    ├─ Critical: 12/28 (42.9%) - SECURITY IN PROGRESS!
    ├─ High: 3/37 (8.1%)
    ├─ Medium: 0/19 (0%)
    └─ Low: 0/3 (0%)

🔄 Run /database:fix again to continue (CRITICAL SECURITY NEXT!)
```

### When All Complete
```
🎉 ALL DATABASE ISSUES FIXED!

📊 Final: 82/87 (94.3%)
├─ Critical: 28/28 (100%) ✅ ALL SECURITY FIXED!
├─ ⚠️  Needs Manual: 4
└─ ⏭️  Skipped: 1

✅ No more pending issues!
```

## Reusable Pattern

Run multiple times until all issues are fixed.
**Priority**: Security issues (P001-P099) are fixed first!

## Begin Fixing

Load report, filter pending, fix first 10-20 issues (CRITICAL FIRST!), update status.

**Start now.** Fix next batch of 10-20 pending issues in priority order.
