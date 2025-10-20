# Database Patterns Analysis - Violation Detection

Scan codebase for database security and pattern violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read both rules files completely before scanning:
1. `docs/rules/database-rules.md`
2. `docs/rules/security-rules.md`

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/database/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Violation Detection Protocol

**STEP 2**: Scan following file patterns in order:

### Scan Targets (Priority: SECURITY FIRST)

1. `features/**/api/queries.ts` - CRITICAL SECURITY
2. `features/**/api/mutations.ts` - CRITICAL SECURITY
3. `app/api/**/route.ts` - CRITICAL SECURITY
4. `lib/supabase/**/*.ts` - HIGH
5. `features/**/api/**/*.ts` - MEDIUM

### Exclusions (Never Scan)
- `node_modules/`, `.next/`, `.tmp/`
- `*.config.*`
- `lib/supabase/types.ts` (generated file)

## Violation Rules

For each file scanned, detect these violations:

### CRITICAL (P001-P099) - SECURITY VIOLATIONS

**Rule: missing-auth-check**
- Pattern: Function accessing database without auth
- Detection:
  - File contains `supabase.from(` or `.select(` or `.insert(` or `.update(` or `.delete(`
  - File does NOT contain `await supabase.auth.getUser()` before database call
  - No `if (!user)` check present
- Severity: CRITICAL
- Reference: docs/rules/security-rules.md#auth-required

**Rule: using-get-session**
- Pattern: Using getSession() instead of getUser()
- Detection: `supabase.auth.getSession()` or `await getSession()`
- Severity: CRITICAL
- Reference: docs/rules/security-rules.md#get-user-only

**Rule: query-schema-tables**
- Pattern: Querying schema tables directly (not public views)
- Detection: `.from('organization.`, `.from('catalog.`, `.from('scheduling.`, `.from('inventory.`, `.from('identity.`, `.from('communication.`, `.from('analytics.`, `.from('engagement.`
- Severity: CRITICAL
- Reference: docs/rules/database-rules.md#query-views-only

**Rule: rls-uid-not-wrapped**
- Pattern: auth.uid() not wrapped in subquery in RLS
- Detection: In SQL: `auth.uid()` without `(select auth.uid())`
- Severity: CRITICAL
- Reference: docs/rules/security-rules.md#rls-patterns

### HIGH (P100-P299) - Pattern Violations

**Rule: missing-server-only**
- Pattern: queries.ts without 'server-only' directive
- Detection: File name ends with `queries.ts` but first line is NOT `import 'server-only'`
- Severity: HIGH
- Reference: docs/rules/architecture-rules.md#server-only

**Rule: missing-use-server**
- Pattern: mutations.ts without 'use server' directive
- Detection: File name ends with `mutations.ts` but first line is NOT `'use server'`
- Severity: HIGH
- Reference: docs/rules/architecture-rules.md#use-server

**Rule: any-types-in-queries**
- Pattern: Using 'any' type in database operations
- Detection: `: any` in files containing database queries
- Severity: HIGH
- Reference: docs/rules/database-rules.md#types

**Rule: missing-error-handling**
- Pattern: Database call without error check
- Detection: `await supabase.from(` without subsequent `if (error)` check
- Severity: HIGH
- Reference: docs/rules/database-rules.md#error-handling

### MEDIUM (P300-P699) - Type and Structure Issues

**Rule: missing-database-types**
- Pattern: Not using Database['public']['Views'] types
- Detection: `.from('view_` without `.returns<Database['public']['Views']...>`
- Severity: MEDIUM
- Reference: docs/rules/database-rules.md#types

**Rule: improper-error-throw**
- Pattern: Throwing raw error instead of formatted
- Detection: `throw error` instead of proper error handling
- Severity: MEDIUM
- Reference: docs/rules/database-rules.md#error-handling

**Rule: missing-transaction-wrapper**
- Pattern: Multiple mutations without transaction
- Detection: Multiple `.insert(` or `.update(` calls in same function without transaction
- Severity: MEDIUM

### LOW (P700-P999) - Optimizations

**Rule: missing-query-select**
- Pattern: `.select('*')` instead of specific columns
- Detection: `.select('*')` in queries
- Severity: LOW
- Reference: docs/rules/database-rules.md#performance

**Rule: n-plus-one-query**
- Pattern: Query inside loop
- Detection: `for (` or `.map(` with `supabase.from(` inside
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
category: "security" | "patterns" | "types" | "performance"
title: Brief violation description
description: Full explanation with security impact if applicable
current_code: Exact violating code snippet
fix_pattern: Required transformation
reference: docs/rules file and section
estimated_effort: "5 minutes" | "15 minutes" | "30 minutes"
status: "pending"
first_detected: ISO-8601 timestamp
last_detected: ISO-8601 timestamp
```

## Priority Code Assignment

**STEP 3**: Assign codes based on:

1. Sort violations: CRITICAL (security) → high → medium → low
2. Within CRITICAL: auth violations first, then schema access, then RLS
3. Within same priority: sort by file path, then line number
4. Assign codes:
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
   - Re-scan original location with original rule
   - If violation exists: status = "regressed", add regressed_at
   - If clean: keep status = "fixed"
3. **Detect resolved**: For each "pending" issue
   - Re-scan location
   - If violation gone: status = "resolved", add resolved_at
   - If exists: keep "pending", update last_detected
4. **Add new**: New violations get status = "pending"

## Output Files (Required)

**STEP 5**: Generate exactly 2 files:

1. `docs/analyze-fixes/database/analysis-report.json` - Machine-readable
2. `docs/analyze-fixes/database/analysis-report.md` - Human-readable

## Metadata Requirements

Include in JSON:
```
metadata.area: "database"
metadata.first_analysis: ISO-8601
metadata.last_analysis: ISO-8601 (now)
metadata.update_count: number
metadata.total_files_scanned: number
metadata.total_issues: number

summary.by_priority: {critical, high, medium, low}
summary.by_status: {pending, fixed, skipped, needs_manual, failed, regressed}
summary.by_rule: count per rule
summary.by_category: {security, patterns, types, performance}
summary.changes_since_last_analysis: {new_issues, resolved_issues, regressed_issues}

issues: array sorted by priority_order
```

## Display Requirements

**STEP 6**: Show terminal output:

**If first analysis:**
```
✅ Database Analysis Complete (NEW)
Total Issues: [count]
├─ Critical: [count] (SECURITY!)
├─ High: [count] (patterns)
├─ Medium: [count] (types)
└─ Low: [count] (optimization)

⚠️  CRITICAL SECURITY ISSUES: [count]
```

**If update:**
```
✅ Database Analysis Updated
📊 Changes: +[new] new ([X] critical security!), -[resolved] resolved, [regressed] regressed
📈 Current: [total] (was [previous])
⚠️  CRITICAL SECURITY ISSUES: [count] (was [previous_count])
📊 Fixed Progress: [fixed_count] kept
🔧 Run /database:fix immediately for security fixes!
```

## Execution Order

1. Read docs/rules/database-rules.md AND docs/rules/security-rules.md
2. Check for existing report
3. Scan all target files (queries.ts, mutations.ts, route.ts first)
4. Detect violations using exact patterns above (SECURITY FIRST)
5. Assign priority codes (auth violations get lowest P-codes)
6. Merge with existing data
7. Generate JSON and MD files
8. Display summary with security warnings

**Execute now.** Follow steps 1-8 in exact order. SECURITY VIOLATIONS MUST BE DETECTED FIRST.
