# UI Components Fix - Reusable Session

Auto-fix UI issues in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted issues, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/ui/analysis-report.json`

## Process

### 1. Load Report
```
Read: analysis-report.json
Filter: issues where status === "pending"
Sort: by priority_order (ascending)
Take: First 10-20 issues
```

### 2. Fix Batch
Fix each issue, update status, save report after batch.

## Rules Reference

Follow: `docs/rules/ui-rules.md`

## Fix Patterns by Rule

### Rule: missing-dialog-description

```tsx
// Before
<DialogHeader>
  <DialogTitle>Confirm</DialogTitle>
</DialogHeader>

// After
<DialogHeader>
  <DialogTitle>Confirm</DialogTitle>
  <DialogDescription>
    Review details before confirming
  </DialogDescription>
</DialogHeader>
```

### Rule: native-html-text

```tsx
// Before
<h1>Dashboard</h1>
<p>Welcome back</p>

// After
import { H1, P } from '@/components/ui/typography'
<H1>Dashboard</H1>
<P>Welcome back</P>
```

### Rule: arbitrary-colors

```tsx
// Before
<div className="bg-blue-500 text-white">

// After
<div className="bg-primary text-primary-foreground">
```

## Display Progress

### After Batch Complete
```
🎯 BATCH COMPLETE

📊 This Batch: 15/15 fixed

📈 Overall Progress
├─ Total: 145
├─ Fixed: 15 (10.3%)
├─ Remaining: 130 (89.7%)

🔄 Run /ui:fix again to fix next batch
```

### When All Complete
```
🎉 ALL UI ISSUES FIXED!

📊 Final: 138/145 (95.2%)
├─ ⚠️  Needs Manual: 4
└─ ⏭️  Skipped: 3

✅ No more pending issues!
```

## Reusable Pattern

Run multiple times until all issues are fixed:
1. First run: 10-20 issues
2. Second run: next 10-20
3. Continue until complete

## Begin Fixing

Load report, filter pending, fix first 10-20 issues, update status.

**Start now.** Fix next batch of 10-20 pending issues in priority order.
