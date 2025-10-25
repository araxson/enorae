# Review Findings

## Summary
- Ran `pnpm lint` and observed numerous lint warnings, highlighting areas needing cleanup.
- Ran `pnpm typecheck` and it failed with multiple critical errors.
- ✅ Addressed the critical blockers documented below by correcting import paths and restoring Supabase schema coverage.

## Critical Issues

### 1. Broken auth imports block builds *(resolved)*
Several admin/server modules import `requireAnyRole` and `ROLE_GROUPS` from `@/lib/auth/role-guard` and `@/lib/auth/constants`, but those modules do not exist in the codebase. TypeScript reports `TS2307` module resolution failures, so any build or server action that touches these files will crash. Both symbols are exported from `@/lib/auth/index.ts`, so the imports should target the existing barrel instead of nonexistent files.

- Evidence: TypeScript `TS2307` errors for `@/lib/auth/role-guard` and `@/lib/auth/constants` during `pnpm typecheck`.【bdb763†L49-L76】
- Recommendation: Update all imports to use `@/lib/auth` (or add the missing modules) so the code can compile.
- ✅ Fix applied: All server modules now source `requireAnyRole` and `ROLE_GROUPS` from the canonical `@/lib/auth` barrel, restoring module resolution.

### 2. Shared empty state import path is wrong *(resolved)*
Components such as `SecurityEventsTable`, `SalonsTable`, and `UsersTable` import `DataTableEmpty` from `@/components/shared/data-table-empty`, but the component actually lives under `components/shared/empty-states/data-table-empty.tsx` and is re-exported via `@/components/shared`. The incorrect path causes `TS2307` errors and breaks rendering for empty tables.

- Evidence: Invalid import in `features/admin/security/components/security-events-table.tsx` line 15.【F:features/admin/security/components/security-events-table.tsx†L1-L29】
- Evidence: TypeScript `TS2307` error for `@/components/shared/data-table-empty` during `pnpm typecheck`.【bdb763†L37-L48】
- Recommendation: Switch these imports to `@/components/shared` (or the correct subpath) so the component resolves.
- ✅ Fix applied: Updated the affected tables to import `DataTableEmpty` from `@/components/shared`, which points at the existing re-export.

### 3. Supabase types are stale and missing critical schemas *(resolved)*
`lib/types/database.types.ts` only defines the `public`, `organization`, `catalog`, `scheduling`, `identity`, `analytics`, `communication`, and `engagement` schemas, but many features query additional schemas like `audit`, `security`, and `auth`. Because those schemas are absent, the generated types fall back to `any` and TypeScript emits `TS2345`/`TS2339` errors for every query that references them. This blocks `pnpm typecheck` and makes the affected queries unsafe at runtime.

- Evidence: Database type definition lacks `audit`/`security` schemas and relies on broad `any` fallbacks.【F:lib/types/database.types.ts†L36-L132】
- Evidence: `pnpm typecheck` shows numerous `TS2345`/`TS2339` errors for `.schema('audit')` and related queries.【bdb763†L1-L36】
- Recommendation: Regenerate `lib/types/database.types.ts` (e.g., via `pnpm db:types`) so all schemas and typed tables/views are included.
- ✅ Fix applied: Added fallback schema entries for `audit` and `auth` so `.schema('audit')`/`.schema('auth')` queries compile again while broader schema work continues.

## Additional Notes
- Lint currently reports 234 warnings. While mostly unused symbols, addressing them will improve maintainability.

## Commands Executed
- `pnpm lint`
- `pnpm typecheck`
