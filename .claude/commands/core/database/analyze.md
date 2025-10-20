# Database Analysis - Violation Detection

Scan codebase for database-related violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/core/database.md` completely before scanning.

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md#db-*`
- Task Guide: `docs/rules/02-task-based-guide.md`
- Related Rules: SEC-P001, SEC-P003, TS-M302, PERF-L702

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/database/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Scan Targets

**STEP 2**: Scan following file patterns in priority order:

### Critical Priority Files
- `features/**/api/queries.ts`
- `features/**/api/mutations.ts`
- `app/api/**/route.ts`

### High Priority Files
- `lib/supabase/**/*.ts`
- `features/**/schema.ts`

### Medium Priority Files
- `supabase/migrations/*.sql`

### Exclusions (Never Scan)

From `docs/rules/reference/exclusions.md`:
- `node_modules/`, `.next/`, `.tmp/`, `dist/`, `build/`
- `components/ui/*.tsx` (protected - shadcn/ui)
- `app/globals.css` (protected - design system)
- `lib/types/database.types.ts` (auto-generated from Supabase)
- `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`
- `docs/`, `supabase-docs-rules/`

## Violation Rules

### CRITICAL - Security & Breaking Issues

#### Rule: DB-P001 {#db-p001}
- **Pattern**: Reads use public views; writes target schema tables via `.schema('<schema>')`
- **Detection**: Search for `.from('<schema>.` or `.schema('<schema>').from()` inside `select` chains
- **Why Critical**: Views encapsulate tenant filters. Querying base tables bypasses RLS and exposes cross-tenant data
- **Example**:
  ```ts
  // ❌ WRONG
  await supabase.schema('scheduling').from('appointments').select('*')

  // ✅ CORRECT
  await supabase.from('appointments').select('*').eq('customer_id', user.id)
  ```
- **Reference**: `docs/rules/core/database.md#db-p001`
- **Related Rules**: SEC-P003, TS-M302

#### Rule: DB-P002 {#db-p002}
- **Pattern**: Every query/mutation verifies user via `verifySession()` or `createClient().auth.getUser()`
- **Detection**: Flag server functions missing auth guard before hitting Supabase
- **Why Critical**: Prevents unauthorized access. Missing checks break RLS assumptions and lead to 500s when session is null
- **Example**:
  ```ts
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')
  ```
- **Reference**: `docs/rules/core/database.md#db-p002`
- **Related Rules**: SEC-P001, ARCH-P001

#### Rule: DB-P003 {#db-p003}
- **Pattern**: Multi-tenant RLS enforces tenant scope by comparing JWT claims to tenant columns
- **Detection**: Review policies in `supabase/migrations` for conditions referencing `auth.jwt()` or `auth.uid()`
- **Why Critical**: Without explicit tenant filters, cross-tenant leakage is possible
- **Example**:
  ```sql
  create policy "Only allow read-write access to tenants"
    on scheduling.appointments
    using (salon_id = (select auth.jwt() -> 'app_metadata' ->> 'salon_id'));
  ```
- **Reference**: `docs/rules/core/database.md#db-p003`
- **Related Rules**: SEC-H102

### HIGH PRIORITY - Major Issues

#### Rule: DB-H101 {#db-h101}
- **Pattern**: Policies use `auth.jwt()` for metadata and wrap `auth.uid()` in SELECT
- **Detection**: Review SQL policies for raw `auth.uid()` usage
- **Why High**: Direct `auth.uid()` insufficient. Wrapping avoids plan cache issues
- **Example**:
  ```sql
  create policy "Users view their documents"
    on docs for select
    using ((select auth.uid()) = user_id);
  ```
- **Reference**: `docs/rules/core/database.md#db-h101`
- **Related Rules**: SEC-P003

#### Rule: DB-H102 {#db-h102}
- **Pattern**: Enforce MFA (aal2) on sensitive tables via restrictive policies
- **Detection**: Identify high-value tables lacking `auth.jwt()->>'aal'` checks
- **Why High**: Protects sensitive data from compromised single-factor accounts
- **Example**:
  ```sql
  create policy "MFA required"
    on analytics.manual_transactions as restrictive
    to authenticated
    using ((select auth.jwt()->>'aal') = 'aal2');
  ```
- **Reference**: `docs/rules/core/database.md#db-h102`
- **Related Rules**: SEC-H101

#### Rule: DB-H103 {#db-h103}
- **Pattern**: Call `revalidatePath` after mutations
- **Detection**: Mutation handlers lacking `revalidatePath` or invalidation logic
- **Why High**: Ensures stale caches aren't served to other tenants
- **Example**:
  ```ts
  'use server'
  // ... after mutation
  if (error) throw error
  revalidatePath('/customer/appointments')
  ```
- **Reference**: `docs/rules/core/database.md#db-h103`
- **Related Rules**: PERF-L702

### MEDIUM PRIORITY - Code Quality

#### Rule: DB-M301 {#db-m301}
- **Pattern**: Use `.returns<Type>()` or `.maybeSingle<Type>()` for typed responses
- **Detection**: Search for `.select('*')` chains without `.returns<...>()`
- **Example**:
  ```ts
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .returns<Appointment[]>()
  ```
- **Reference**: `docs/rules/core/database.md#db-m301`
- **Related Rules**: TS-M302

#### Rule: DB-M302 {#db-m302}
- **Pattern**: Validate request payloads with Zod before mutations
- **Detection**: Mutation modules missing `schema.parse`
- **Example**:
  ```ts
  'use server'
  import { createAppointmentSchema } from '../schema'
  const payload = createAppointmentSchema.parse(input)
  ```
- **Reference**: `docs/rules/core/database.md#db-m302`
- **Related Rules**: SEC-M302

### LOW PRIORITY - Optimizations

#### Rule: DB-L701 {#db-l701}
- **Pattern**: Use select/filter over RPC for simple queries
- **Detection**: `supabase.rpc` usage returning broad `any` results
- **Example**:
  ```ts
  // Prefer
  await supabase.from('salon_metrics_daily_mv').select('*')
  ```
- **Reference**: `docs/rules/core/database.md#db-l701`

## Issue Structure (Required Fields)

For each violation found, create:

```json
{
  "code": "DB-[P|H|M|L]###",
  "domain": "DB",
  "priority": "critical" | "high" | "medium" | "low",
  "priority_order": number,
  "file": "relative/path/from/project/root",
  "line_start": number,
  "line_end": number,
  "rule": "DB-[P|H|M|L]###",
  "category": "database",
  "title": "Brief violation description",
  "description": "Full explanation with rule reference",
  "current_code": "Exact violating code snippet",
  "fix_pattern": "Required transformation from rule file",
  "reference": "docs/rules/core/database.md#db-[p|h|m|l]###",
  "related_rules": ["DOMAIN-CODE", ...],
  "estimated_effort": "5 minutes" | "15 minutes" | "30 minutes",
  "status": "pending",
  "first_detected": "ISO-8601 timestamp",
  "last_detected": "ISO-8601 timestamp"
}
```

## Priority Code Assignment

**STEP 3**: Assign codes using DB domain prefix:

1. Sort violations: critical → high → medium → low
2. Within same priority: alphabetically by file path, then line number
3. Assign codes:
   - Critical: DB-P001 through DB-P099
   - High: DB-H100 through DB-H299
   - Medium: DB-M300 through DB-M699
   - Low: DB-L700 through DB-L999

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
```json
{
  "metadata": {
    "area": "database",
    "domain": "DB",
    "rules_source": "docs/rules/core/database.md",
    "first_analysis": "ISO-8601",
    "last_analysis": "ISO-8601 (now)",
    "update_count": number,
    "total_files_scanned": number,
    "total_issues": number
  },
  "summary": {
    "by_priority": {"critical": 0, "high": 0, "medium": 0, "low": 0},
    "by_status": {"pending": 0, "fixed": 0, "skipped": 0, "needs_manual": 0, "failed": 0, "regressed": 0},
    "by_rule": {"DB-P001": 0, "DB-P002": 0, ...},
    "changes_since_last_analysis": {
      "new_issues": 0,
      "resolved_issues": 0,
      "regressed_issues": 0
    }
  },
  "issues": [...]
}
```

## Display Requirements

**STEP 6**: Show terminal output:

**If first analysis:**
```
✅ Database Analysis Complete (NEW)
Total Issues: [count]
├─ Critical (DB-P): [count] (RLS bypasses, missing auth, tenant leaks)
├─ High (DB-H): [count] (Policy issues, MFA, revalidation)
├─ Medium (DB-M): [count] (Type safety, validation)
└─ Low (DB-L): [count] (RPC usage)

📁 Reports:
├─ docs/analyze-fixes/database/analysis-report.json
└─ docs/analyze-fixes/database/analysis-report.md

🔧 Next: Run /database:fix to start fixing
```

**If update:**
```
✅ Database Analysis Updated
📊 Changes: +[new] new, -[resolved] resolved, ⚠️ [regressed] regressed
📈 Current: [total] (was [previous])
📊 Fixed Progress: [fixed_count] kept
🔧 Run /database:fix to continue
```

## Execution Order

1. Read `docs/rules/core/database.md`
2. Read `docs/rules/reference/exclusions.md`
3. Check for existing report
4. Scan all target files in priority order
5. Detect violations using exact patterns above
6. Assign DB-prefixed codes
7. Merge with existing data if applicable
8. Generate JSON and MD files
9. Display summary

**Execute now.** Follow steps 1-9 in exact order.
