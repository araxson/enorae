# Architecture Patterns Analysis - Violation Detection

Scan codebase for architecture and file structure violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/architecture-rules.md` completely before scanning.

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/architecture/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Violation Detection Protocol

**STEP 2**: Scan following file patterns in order:

### Scan Targets

1. `app/**/*.tsx` - All pages (CRITICAL: must be thin)
2. `features/**/*.tsx` - All feature files
3. `components/**/*.tsx` - All component files
4. All directories for naming violations

### Exclusions (Never Scan)
- `node_modules/`, `.next/`, `.tmp/`
- `components/ui/*.tsx` (shadcn protected)

## Violation Rules

For each file/directory scanned, detect these violations:

### CRITICAL (P001-P099) - Massive Files

**Rule: page-massive-logic**
- Pattern: Page file exceeds 50 lines with business logic
- Detection:
  - File path matches `app/**/*.tsx`
  - File has `export default` function
  - Line count > 50
  - Contains business logic (database calls, complex state, computations)
- Severity: CRITICAL
- Reference: docs/rules/architecture-rules.md#page-patterns

**Rule: security-import-violation**
- Pattern: Page importing from restricted paths
- Detection:
  - Page file importing from `lib/supabase/server` directly
  - Page file importing mutations
- Severity: CRITICAL
- Reference: docs/rules/security-rules.md#server-imports

### HIGH (P100-P299) - Structure Violations

**Rule: page-exceeds-max-lines**
- Pattern: Page file exceeds 15 lines
- Detection:
  - File path matches `app/**/*.tsx`
  - Line count > 15 (excluding imports and empty lines)
- Severity: HIGH
- Reference: docs/rules/architecture-rules.md#page-patterns

**Rule: duplicate-file-suffix**
- Pattern: Files with version suffixes
- Detection: File name contains `-v2`, `-new`, `-old`, `-fixed`, `-backup`, `-copy`, `-temp`
- Severity: HIGH
- Reference: docs/rules/architecture-rules.md#file-naming

**Rule: duplicate-file-copy**
- Pattern: Files with "copy" in name
- Detection: File name contains `copy`, `Copy`, ` copy`, `(copy)`, `- copy`
- Severity: HIGH
- Reference: docs/rules/architecture-rules.md#file-naming

### MEDIUM (P300-P699) - Naming and Organization

**Rule: camelCase-file-name**
- Pattern: camelCase instead of kebab-case
- Detection:
  - File name contains uppercase letters (not .tsx, .ts extensions)
  - Example: `myComponent.tsx` should be `my-component.tsx`
- Severity: MEDIUM
- Reference: docs/rules/architecture-rules.md#file-naming

**Rule: missing-index-export**
- Pattern: Feature folder without index.tsx
- Detection:
  - Directory under `features/*/` has components but no `index.tsx`
- Severity: MEDIUM
- Reference: docs/rules/architecture-rules.md#exports

**Rule: improper-feature-structure**
- Pattern: Feature not following folder pattern
- Detection:
  - Feature folder missing `/api`, `/components`, or `/types` subdirectories
  - api folder missing queries.ts or mutations.ts
- Severity: MEDIUM
- Reference: docs/rules/architecture-rules.md#feature-structure

**Rule: misplaced-component**
- Pattern: Component in wrong directory
- Detection:
  - Shared component in feature-specific folder
  - Feature component in shared folder
- Severity: MEDIUM

### LOW (P700-P999) - Optimizations

**Rule: deeply-nested-folder**
- Pattern: Folder nesting exceeds 5 levels
- Detection: Directory path has > 5 segments under features/
- Severity: LOW

**Rule: single-file-folder**
- Pattern: Folder containing only one file
- Detection: Directory with exactly 1 file
- Severity: LOW

## Issue Structure (Required Fields)

For each violation found, create:

```
code: "P###"
priority: "critical" | "high" | "medium" | "low"
priority_order: number
file: absolute path from project root (or directory path)
line_start: number (if applicable)
line_end: number (if applicable)
rule: rule identifier from above
category: "structure" | "naming" | "organization"
title: Brief violation description
description: Full explanation
current_code: Violating element (file name, directory, or code snippet)
fix_pattern: Required action
reference: docs/rules/architecture-rules.md section
estimated_effort: "5 minutes" | "15 minutes" | "30 minutes"
status: "pending"
first_detected: ISO-8601 timestamp
last_detected: ISO-8601 timestamp
```

## Priority Code Assignment

**STEP 3**: Assign codes based on:

1. Sort violations: critical → high → medium → low
2. Within same priority: massive pages first, then duplicates, then naming
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
   - Re-check original file/directory
   - If violation exists: status = "regressed", add regressed_at
   - If clean: keep status = "fixed"
3. **Detect resolved**: For each "pending" issue
   - Re-check location
   - If violation gone: status = "resolved", add resolved_at
   - If exists: keep "pending", update last_detected
4. **Add new**: New violations get status = "pending"

## Output Files (Required)

**STEP 5**: Generate exactly 2 files:

1. `docs/analyze-fixes/architecture/analysis-report.json` - Machine-readable
2. `docs/analyze-fixes/architecture/analysis-report.md` - Human-readable

## Metadata Requirements

Include in JSON:
```
metadata.area: "architecture"
metadata.first_analysis: ISO-8601
metadata.last_analysis: ISO-8601 (now)
metadata.update_count: number
metadata.total_files_scanned: number
metadata.total_issues: number

summary.by_priority: {critical, high, medium, low}
summary.by_status: {pending, fixed, skipped, needs_manual, failed, regressed}
summary.by_rule: count per rule
summary.by_category: {structure, naming, organization}
summary.changes_since_last_analysis: {new_issues, resolved_issues, regressed_issues}

issues: array sorted by priority_order
```

## Display Requirements

**STEP 6**: Show terminal output:

**If first analysis:**
```
✅ Architecture Analysis Complete (NEW)
Total Issues: [count]
├─ Critical: [count] (massive pages)
├─ High: [count] (structure/duplicates)
├─ Medium: [count] (naming)
└─ Low: [count]
```

**If update:**
```
✅ Architecture Analysis Updated
📊 Changes: +[new] new, -[resolved] resolved, [regressed] regressed
📈 Current: [total] (was [previous])
📊 Fixed Progress: [fixed_count] kept
🔧 Run /architecture:fix to continue
```

## Execution Order

1. Read docs/rules/architecture-rules.md
2. Check for existing report
3. Scan all pages first (line count violations)
4. Scan all files for duplicates and naming
5. Check feature structure
6. Assign priority codes
7. Merge with existing data
8. Generate JSON and MD files
9. Display summary

**Execute now.** Follow steps 1-9 in exact order.
