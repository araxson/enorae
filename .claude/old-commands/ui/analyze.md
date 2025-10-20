# UI Components Analysis - Violation Detection

Scan codebase for shadcn/ui violations against rules. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/ui-rules.md` completely before scanning.

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/ui/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Violation Detection Protocol

**STEP 2**: Scan following file patterns in order:

### Scan Targets (In Priority Order)

1. `app/**/*.tsx` - All page and layout files
2. `features/**/components/**/*.tsx` - Feature components
3. `components/layout/**/*.tsx` - Layout components
4. `components/shared/**/*.tsx` - Shared components

### Exclusions (Never Scan)
- `components/ui/*.tsx` - Protected shadcn source files
- `node_modules/`, `.next/`, `.tmp/`

## Violation Rules

For each file scanned, detect these violations:

### CRITICAL (P001-P099) - Accessibility

**Rule: missing-dialog-description**
- Pattern: `<Dialog>` without `<DialogDescription>`
- Detection: Find `<DialogHeader>` with `<DialogTitle>` but no `<DialogDescription>`
- Severity: CRITICAL
- Reference: docs/rules/ui-rules.md#dialog-description

**Rule: missing-alert-description**
- Pattern: `<Alert>` without description
- Detection: Find `<AlertTitle>` but no `<AlertDescription>` in same Alert
- Severity: CRITICAL
- Reference: docs/rules/ui-rules.md#alert-description

**Rule: missing-sheet-description**
- Pattern: `<Sheet>` without `<SheetDescription>`
- Detection: Find `<SheetHeader>` with `<SheetTitle>` but no `<SheetDescription>`
- Severity: CRITICAL
- Reference: docs/rules/ui-rules.md#sheet-description

### HIGH (P100-P299) - Component Violations

**Rule: native-html-heading**
- Pattern: Native HTML heading tags
- Detection: Search for `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>` (not in strings)
- Severity: HIGH
- Reference: docs/rules/ui-rules.md#typography

**Rule: native-html-text**
- Pattern: Native `<p>` tags
- Detection: Search for `<p>` or `<p className=`
- Severity: HIGH
- Reference: docs/rules/ui-rules.md#typography

**Rule: arbitrary-color-bg**
- Pattern: Tailwind color classes not from globals.css
- Detection: `bg-blue-`, `bg-red-`, `bg-green-`, `bg-yellow-`, `bg-purple-`, `bg-pink-`, `bg-gray-` (followed by numbers)
- Severity: HIGH
- Reference: docs/rules/ui-rules.md#colors

**Rule: arbitrary-color-text**
- Pattern: Tailwind text color classes not from globals.css
- Detection: `text-blue-`, `text-red-`, `text-green-`, `text-yellow-`, `text-purple-`, `text-pink-`, `text-gray-` (followed by numbers)
- Severity: HIGH
- Reference: docs/rules/ui-rules.md#colors

**Rule: arbitrary-color-border**
- Pattern: Tailwind border color classes not from globals.css
- Detection: `border-blue-`, `border-red-`, `border-green-` etc. (followed by numbers)
- Severity: HIGH
- Reference: docs/rules/ui-rules.md#colors

### MEDIUM (P300-P699) - Composition Issues

**Rule: incomplete-card-composition**
- Pattern: `<Card>` without proper sub-components
- Detection: `<Card>` with direct children instead of CardHeader/CardContent/CardFooter
- Severity: MEDIUM
- Reference: docs/rules/ui-rules.md#card-composition

**Rule: missing-card-title**
- Pattern: `<CardHeader>` without `<CardTitle>`
- Detection: CardHeader that doesn't contain CardTitle
- Severity: MEDIUM
- Reference: docs/rules/ui-rules.md#card-composition

**Rule: button-variant-missing**
- Pattern: `<Button>` without variant prop
- Detection: Button component without explicit variant
- Severity: MEDIUM
- Reference: docs/rules/ui-rules.md#button-variants

**Rule: table-without-caption**
- Pattern: `<Table>` without `<TableCaption>`
- Detection: Table component without TableCaption for accessibility
- Severity: MEDIUM
- Reference: docs/rules/ui-rules.md#table-accessibility

### LOW (P700-P999) - Improvements

**Rule: inline-styles-usage**
- Pattern: Inline style attributes
- Detection: `style={{` in components
- Severity: LOW
- Reference: docs/rules/ui-rules.md#styling

**Rule: missing-aria-label**
- Pattern: Interactive elements without labels
- Detection: Button/Link with icon only, no aria-label
- Severity: LOW

## Issue Structure (Required Fields)

For each violation found, create:

```
code: "P###"
priority: "critical" | "high" | "medium" | "low"
priority_order: number
file: absolute path from project root
line_start: number
line_end: number
rule: rule identifier from above
category: "accessibility" | "component-usage" | "styling"
title: Brief violation description
description: Full explanation with rule reference
current_code: Exact violating code snippet
fix_pattern: Required transformation
reference: docs/rules/ui-rules.md section
estimated_effort: "5 minutes" | "10 minutes" | "15 minutes"
status: "pending"
first_detected: ISO-8601 timestamp
last_detected: ISO-8601 timestamp
```

## Priority Code Assignment

**STEP 3**: Assign codes based on:

1. Sort violations: critical → high → medium → low
2. Within priority: sort by file path, then line number
3. Assign codes:
   - Critical: P001-P099
   - High: P100-P299
   - Medium: P300-P699
   - Low: P700-P999

**If updating existing report:**
- Preserve codes for unchanged violations
- Assign new codes continuing sequence
- Mark `regressed` if fixed violation returned

## Merge Logic (For Updates)

**STEP 4**: If existing report loaded:

1. **Preserve**: All issues with status: fixed, skipped, needs_manual
2. **Check regressions**: For each "fixed" issue
   - Re-scan original location
   - If violation exists: status = "regressed", add regressed_at
   - If clean: keep status = "fixed"
3. **Detect resolved**: For each "pending" issue
   - Re-scan location
   - If violation gone: status = "resolved", add resolved_at
   - If exists: keep "pending", update last_detected
4. **Add new**: New violations get status = "pending"

## Output Files (Required)

**STEP 5**: Generate exactly 2 files:

1. `docs/analyze-fixes/ui/analysis-report.json` - Machine-readable
2. `docs/analyze-fixes/ui/analysis-report.md` - Human-readable

## Metadata Requirements

Include in JSON:
```
metadata.area: "ui"
metadata.first_analysis: ISO-8601
metadata.last_analysis: ISO-8601 (now)
metadata.update_count: number
metadata.total_files_scanned: number
metadata.total_issues: number

summary.by_priority: {critical, high, medium, low}
summary.by_status: {pending, fixed, skipped, needs_manual, failed, regressed}
summary.by_rule: count per rule
summary.changes_since_last_analysis: {new_issues, resolved_issues, regressed_issues}

issues: array sorted by priority_order
```

## Display Requirements

**STEP 6**: Show terminal output:

**If first analysis:**
```
✅ UI Analysis Complete (NEW)
Total Issues: [count]
├─ Critical: [count] (accessibility)
├─ High: [count] (components/colors)
├─ Medium: [count] (composition)
└─ Low: [count]
```

**If update:**
```
✅ UI Analysis Updated
📊 Changes: +[new] new, -[resolved] resolved, [regressed] regressed
📈 Current: [total] (was [previous])
📊 Fixed Progress: [fixed_count] kept
🔧 Run /ui:fix to continue
```

## Execution Order

1. Read docs/rules/ui-rules.md
2. Check for existing report
3. Scan all .tsx files (excluding ui/*.tsx)
4. Detect violations using exact patterns above
5. Assign priority codes
6. Merge with existing data
7. Generate JSON and MD files
8. Display summary

**Execute now.** Follow steps 1-8 in exact order.
