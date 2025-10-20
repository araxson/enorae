# Security Analysis - Violation Detection

Scan codebase for security-related violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/core/security.md` completely before scanning.

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md#sec-*`
- Task Guide: `docs/rules/02-task-based-guide.md`
- Related Rules: DB-P002, DB-P003, DB-H101, DB-H102

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/security/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Scan Targets

**STEP 2**: Scan following file patterns in priority order:

### Critical Priority Files
- `features/**/api/queries.ts`
- `features/**/api/mutations.ts`
- `app/api/**/route.ts`
- `middleware.ts`
- `lib/auth/**/*.ts`

### High Priority Files
- `supabase/migrations/*.sql` (RLS policies)
- `app/**/layout.tsx`
- `features/**/components/**/*.tsx` (role checks)

### Medium Priority Files
- `lib/**/*.ts` (security utilities)

### Exclusions (Never Scan)

From `docs/rules/reference/exclusions.md`:
- `node_modules/`, `.next/`, `.tmp/`, `dist/`, `build/`
- `components/ui/*.tsx` (protected)
- `app/globals.css` (protected)
- `lib/types/database.types.ts` (auto-generated)
- `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`
- `docs/`, `supabase-docs-rules/`

## Violation Rules

### CRITICAL - Security & Breaking Issues

#### Rule: SEC-P001 {#sec-p001}
- **Pattern**: Always call `verifySession()` or `createClient().auth.getUser()` before data access
- **Detection**: Flag server functions without auth guard before Supabase
- **Why Critical**: Prevents unauthorized reads/writes and enforces session refresh
- **Example**:
  ```ts
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')
  ```
- **Reference**: `docs/rules/core/security.md#sec-p001`
- **Related Rules**: DB-P002, ARCH-P001

#### Rule: SEC-P002 {#sec-p002}
- **Pattern**: Use role helpers (`requireRole`, `requireAnyRole`) before Supabase
- **Detection**: Inspect API routes for direct Supabase queries without `requireAnyRole`
- **Why Critical**: Business/staff/admin flows need composite role checks
- **Example**:
  ```ts
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonIds = await getUserSalonIds()
  ```
- **Reference**: `docs/rules/core/security.md#sec-p002`

#### Rule: SEC-P003 {#sec-p003}
- **Pattern**: RLS policies wrap `auth.uid()` in SELECT
- **Detection**: Review migrations for `auth.uid()` usage without `select`
- **Why Critical**: Prevents plan cache bypass
- **Example**:
  ```sql
  create policy "Customer owns favorite"
    on engagement.customer_favorites
    using ((select auth.uid()) = customer_id);
  ```
- **Reference**: `docs/rules/core/security.md#sec-p003`
- **Related Rules**: DB-H101, DB-P003

### HIGH PRIORITY - Major Issues

#### Rule: SEC-H101 {#sec-h101}
- **Pattern**: Enforce MFA (aal2) on sensitive tables
- **Detection**: Identify high-value tables lacking `auth.jwt()->>'aal'` checks
- **Example**:
  ```sql
  create policy "MFA required"
    on analytics.manual_transactions as restrictive
    to authenticated
    using ((select auth.jwt()->>'aal') = 'aal2');
  ```
- **Reference**: `docs/rules/core/security.md#sec-h101`
- **Related Rules**: DB-H102

#### Rule: SEC-H102 {#sec-h102}
- **Pattern**: Filter multi-tenant by SSO provider/team arrays
- **Detection**: Policies touching org-wide tables lacking provider filter
- **Example**:
  ```sql
  using (salon_id = any (
    select jsonb_array_elements_text(auth.jwt()->'app_metadata'->'salon_ids')
  ));
  ```
- **Reference**: `docs/rules/core/security.md#sec-h102`
- **Related Rules**: DB-P003

#### Rule: SEC-H103 {#sec-h103}
- **Pattern**: Middleware uses `updateSession()` helper
- **Detection**: Search for manual cookie manipulation outside `updateSession`
- **Example**:
  ```ts
  import { updateSession } from '@/lib/supabase/middleware'
  export async function middleware(req: NextRequest) {
    return updateSession(req)
  }
  ```
- **Reference**: `docs/rules/core/security.md#sec-h103`

### MEDIUM PRIORITY - Code Quality

#### Rule: SEC-M301 {#sec-m301}
- **Pattern**: Handle Supabase errors explicitly, map to 401/403
- **Detection**: Find error responses returning 500 for auth errors
- **Example**:
  ```ts
  if (appointmentError?.code === 'PGRST116') {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
  }
  ```
- **Reference**: `docs/rules/core/security.md#sec-m301`

#### Rule: SEC-M302 {#sec-m302}
- **Pattern**: Validate mutations with Zod before writes
- **Detection**: Mutation files lacking `schema.parse`
- **Example**:
  ```ts
  const input = createAppointmentSchema.parse(raw)
  ```
- **Reference**: `docs/rules/core/security.md#sec-m302`
- **Related Rules**: DB-M302

### LOW PRIORITY - Optimizations

#### Rule: SEC-L701 {#sec-l701}
- **Pattern**: Prefer view-based audits over direct table scans
- **Example**:
  ```ts
  await supabase.from('mv_refresh_log').select('*')
  ```
- **Reference**: `docs/rules/core/security.md#sec-l701`

## Issue Structure, Priority Assignment, Merge Logic

Same as database analyze (use SEC domain prefix instead of DB).

## Output Files

1. `docs/analyze-fixes/security/analysis-report.json`
2. `docs/analyze-fixes/security/analysis-report.md`

## Execute now following steps 1-9.
