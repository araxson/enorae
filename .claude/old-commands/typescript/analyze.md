# TypeScript Analysis - Violation Detection

Scan codebase for TypeScript violations against rules. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/database-rules.md` completely before scanning.

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/typescript/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Violation Detection Protocol

**STEP 2**: Scan following file patterns in order:

### Scan Targets (In Priority Order)

1. `features/**/api/queries.ts` - CRITICAL
2. `features/**/api/mutations.ts` - CRITICAL
3. `features/**/components/**/*.tsx` - HIGH
4. `app/**/page.tsx` - HIGH
5. `lib/**/*.ts` - MEDIUM
6. `hooks/**/*.ts` - MEDIUM

### Exclusions (Never Scan)
- `node_modules/`, `.next/`, `.tmp/`
- `components/ui/*.tsx`
- `*.config.*`, `tailwind.config.ts`

## Violation Rules

For each file scanned, detect these violations:

### CRITICAL (P001-P099)

**Rule: no-any-types-in-dal**
- Pattern: `any` type in api/queries.ts or api/mutations.ts
- Detection: Search for `: any`, `as any`, `<any>`, `any[]`
- Severity: CRITICAL
- Reference: docs/rules/database-rules.md#types

**Rule: missing-auth-types**
- Pattern: getUser() result not typed
- Detection: `const user =` without type annotation in auth context
- Severity: CRITICAL
- Reference: docs/rules/security-rules.md#auth

### HIGH (P100-P299)

**Rule: any-types-in-components**
- Pattern: `any` type in component files
- Detection: Same as above but in .tsx files
- Severity: HIGH

**Rule: missing-return-types**
- Pattern: Async functions without return type
- Detection: `async function` or `export async function` without `: Promise<`
- Severity: HIGH
- Reference: docs/rules/database-rules.md#return-types

**Rule: type-suppressions**
- Pattern: @ts-ignore or @ts-expect-error
- Detection: Exact string match in comments
- Severity: HIGH

### MEDIUM (P300-P699)

**Rule: implicit-any-parameters**
- Pattern: Function parameters without types
- Detection: Function with parameters lacking type annotations
- Severity: MEDIUM

**Rule: missing-type-inference**
- Pattern: Explicit types where inference would work
- Detection: Simple assignments with redundant type annotations
- Severity: MEDIUM

### LOW (P700-P999)

**Rule: type-improvements**
- Pattern: Could use more specific types
- Detection: Generic types where specific Database types available
- Severity: LOW

## Issue Structure (Required Fields)

For each violation found, create:

```
code: "P###" (auto-assigned based on priority)
priority: "critical" | "high" | "medium" | "low"
priority_order: number (1-999)
file: absolute path from project root
line_start: number
line_end: number
rule: rule identifier from above
category: "type-safety"
title: Brief violation description
description: Full explanation referencing rule
current_code: Exact code snippet (trimmed)
fix_pattern: Required transformation
reference: docs/rules file and section
estimated_effort: "5 minutes" | "15 minutes" | "30 minutes"
status: "pending"
first_detected: ISO-8601 timestamp
last_detected: ISO-8601 timestamp
```

## Priority Code Assignment

**STEP 3**: Assign codes based on:

1. Sort all violations by priority: critical → high → medium → low
2. Within same priority, sort by file path then line number
3. Assign codes sequentially:
   - Critical: P001-P099
   - High: P100-P299
   - Medium: P300-P699
   - Low: P700-P999

**If updating existing report:**
- Preserve existing codes for unchanged violations
- Assign new codes to new violations (continue sequence)
- Mark `regressed` if violation was fixed but returned

## Merge Logic (For Updates)

**STEP 4**: If existing report loaded:

1. **Keep unchanged**: All issues with status != "pending"
2. **Check regressions**: For each "fixed" issue, search code
   - If violation still exists: Change status to "regressed", add regressed_at timestamp
   - If clean: Keep status "fixed"
3. **Detect resolved**: For each "pending" issue, search code
   - If violation gone: Change status to "resolved", add resolved_at timestamp
   - If exists: Keep status "pending", update last_detected
4. **Add new**: Violations not in existing report get status "pending"

## Output Files (Required)

**STEP 5**: Generate exactly 2 files:

1. `docs/analyze-fixes/typescript/analysis-report.json` - Machine-readable
2. `docs/analyze-fixes/typescript/analysis-report.md` - Human-readable summary

## Metadata Requirements

Include in JSON:
```
metadata.area: "typescript"
metadata.first_analysis: ISO-8601 (preserve from existing or set now)
metadata.last_analysis: ISO-8601 (always now)
metadata.update_count: number (increment from existing or 1)
metadata.total_files_scanned: number
metadata.total_issues: number

summary.by_priority: {critical, high, medium, low} counts
summary.by_status: {pending, fixed, skipped, needs_manual, failed, regressed} counts
summary.by_rule: count per rule identifier
summary.changes_since_last_analysis: {new_issues, resolved_issues, regressed_issues}

issues: array of all violations sorted by priority_order
```

## Display Requirements

**STEP 6**: Show terminal output:

**If first analysis:**
```
✅ TypeScript Analysis Complete (NEW)
Total Issues: [count]
├─ Critical: [count] (P###-P###)
├─ High: [count] (P###-P###)
├─ Medium: [count] (P###-P###)
└─ Low: [count] (P###-P###)
```

**If update:**
```
✅ TypeScript Analysis Updated
📊 Changes: +[new] new, -[resolved] resolved, [regressed] regressed
📈 Current: [total] (was [previous])
📊 Fixed Progress: [fixed_count] kept
🔧 Run /typescript:fix to continue
```

## Execution Order

1. Read docs/rules/database-rules.md
2. Check for existing report
3. Scan all target files in priority order
4. Detect violations using patterns above
5. Assign priority codes
6. Merge with existing data if applicable
7. Generate JSON and MD files
8. Display summary

**Execute now.** Follow steps 1-8 in exact order.
