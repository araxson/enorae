# Architecture Patterns Fix - Reusable Session

Auto-fix architecture issues in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted issues, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/architecture/analysis-report.json`

## Process

### 1. Load Report
```
Read: analysis-report.json
Filter: issues where status === "pending"
Sort: by priority_order (ascending)
Take: First 10-20 issues
```

## Rules Reference

Follow: `docs/rules/architecture-rules.md`

## Fix Patterns

### Thin pages
```typescript
// Before: 100 lines with logic
// After: Extract to feature component
export default async function Page() {
  return <FeatureComponent />
}
```

### Delete duplicates
- Remove -v2, -new, -old, -fixed files

### Rename to kebab-case
```
myComponent.tsx → my-component.tsx
```

## Display Progress

### After Batch Complete
```
🎯 BATCH COMPLETE

📊 This Batch: 10/10 fixed

📈 Overall Progress
├─ Total: 34
├─ Fixed: 10 (29.4%)
├─ Remaining: 24 (70.6%)

🔄 Run /architecture:fix again to fix next batch
```

## Reusable Pattern

Run multiple times until all issues are fixed.

## Begin Fixing

Load report, filter pending, fix first 10-20 issues, update status.

**Start now.** Fix next batch of 10-20 pending issues in priority order.
