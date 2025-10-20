# Architecture Analysis - Violation Detection

Scan codebase for architecture violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/core/architecture.md` completely before scanning.

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md#arch-*`
- Task Guide: `docs/rules/02-task-based-guide.md`

## Scan Targets

### Critical Priority Files
- `app/**/page.tsx` (must be 5-15 lines)
- `features/**/api/queries.ts` (needs 'server-only')
- `features/**/api/mutations.ts` (needs 'use server')

### High Priority Files
- `features/**/index.tsx`
- `app/api/**/route.ts`
- `features/**/components/**/*.tsx`

### Medium Priority Files
- `lib/**/*.ts` (shared utilities)
- `features/**/types.ts`

## Violation Rules

### CRITICAL

#### Rule: ARCH-P001 {#arch-p001}
- **Pattern**: queries.ts needs `import 'server-only'`, mutations.ts needs `'use server'`
- **Detection**: Check first line of queries.ts and mutations.ts files
- **Why Critical**: Enforces server execution, prevents credential leaks
- **Example**:
  ```ts
  import 'server-only'  // First line in queries.ts

  'use server'  // First line in mutations.ts
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-p001`
- **Related Rules**: DB-P002, SEC-P001

#### Rule: ARCH-P002 {#arch-p002}
- **Pattern**: Pages must be 5-15 lines, render feature components only
- **Detection**: Count lines in page.tsx files (exclude imports, exports, whitespace)
- **Why Critical**: Keeps routing thin, centralizes logic in features
- **Example**:
  ```tsx
  // ✅ CORRECT (under 15 lines)
  import { BusinessDashboard } from '@/features/business/dashboard'
  export default async function Page() {
    return <BusinessDashboard />
  }
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-p002`

### HIGH PRIORITY

#### Rule: ARCH-H101 {#arch-h101}
- **Pattern**: Feature directories follow template (components/, api/, types.ts, etc.)
- **Detection**: Check for missing expected folders in features/
- **Example Structure**:
  ```
  features/business/pricing/
  ├── api/
  │   ├── queries.ts
  │   └── mutations.ts
  ├── components/
  ├── schema.ts
  ├── types.ts
  └── index.tsx
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-h101`

#### Rule: ARCH-H102 {#arch-h102}
- **Pattern**: Route handlers stay under 120 lines
- **Detection**: Check LOC in app/api/**/route.ts files
- **Reference**: `docs/rules/core/architecture.md#arch-h102`

### MEDIUM PRIORITY

#### Rule: ARCH-M301 {#arch-m301}
- **Pattern**: Shared utilities in lib/ organized by domain
- **Detection**: Check for helper files inside features reused elsewhere
- **Reference**: `docs/rules/core/architecture.md#arch-m301`

#### Rule: ARCH-M302 {#arch-m302}
- **Pattern**: Multi-portal components (≥3 portals) move to features/shared/
- **Detection**: Identify duplicate components across features/{portal}
- **Reference**: `docs/rules/core/architecture.md#arch-m302`

### LOW PRIORITY

#### Rule: ARCH-L701 {#arch-l701}
- **Pattern**: Generate exports from index.tsx only
- **Detection**: Check for index.ts barrels inside component folders
- **Reference**: `docs/rules/core/architecture.md#arch-l701`

## Output Files

1. `docs/analyze-fixes/architecture/analysis-report.json`
2. `docs/analyze-fixes/architecture/analysis-report.md`

Use ARCH domain prefix for all issue codes.

## Execute now following steps 1-9.
