# Comprehensive Error Analysis - All Error Types

Scan codebase for ALL types of errors including build failures, type errors, lint issues, runtime errors, import problems, dependency issues, and breaking changes. Update existing report or create new.

## Rules Source

**REQUIRED**: Read the following rules completely before scanning:
- `docs/rules/framework/typescript.md` (TS-P001, TS-P002, TS-H101, TS-M302)
- `docs/rules/framework/nextjs.md` (NEXT-P001, NEXT-H101)
- `docs/rules/framework/react.md` (REACT-P001, REACT-H101)
- `docs/rules/core/database.md` (DB-P002)
- `docs/rules/core/architecture.md` (ARCH-P001)

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md`
- Task Guide: `docs/rules/02-task-based-guide.md`

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/errors/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Error Categories Detected

### Critical Errors (Breaks Build/Runtime)
1. **Build Errors** - TypeScript compilation failures
2. **Type Errors** - Strict mode violations, 'any' usage
3. **Import Errors** - Missing imports, circular dependencies
4. **Dependency Errors** - Missing packages, version conflicts
5. **Runtime Errors** - Null references, undefined access
6. **Migration Errors** - Database schema issues

### High Priority Errors (Degraded Experience)
7. **Lint Errors** - ESLint rule violations
8. **Warning Promotion** - Warnings that should be errors
9. **Dead Code** - Unreachable code, unused exports
10. **Breaking Changes** - API changes, deprecated usage

### Medium Priority Errors (Code Quality)
11. **Console Statements** - Leftover console.log/debug
12. **TODO/FIXME** - Unresolved technical debt markers
13. **Deprecated APIs** - Using deprecated Next.js/React features
14. **Missing Types** - Implicit any, missing generics

### Low Priority Errors (Best Practices)
15. **Formatting Issues** - Inconsistent spacing, quotes
16. **Missing Documentation** - Public APIs without JSDoc
17. **Complexity Issues** - Functions too long, too complex

## Scan Targets

**STEP 2**: Execute the following checks in priority order:

### Critical Priority - Build Execution

1. **Run TypeScript Compiler**
   ```bash
   npm run typecheck
   # or: tsc --noEmit
   ```
   - Capture all compilation errors
   - Parse error messages for file:line locations
   - Categorize by error code (TS####)

2. **Run Next.js Build**
   ```bash
   npm run build
   # Capture build output and errors
   ```
   - Detect build failures
   - Identify module not found errors
   - Catch Next.js specific issues
   - Check for bundle size warnings

3. **Check Dependencies**
   ```bash
   npm ls
   # Check for missing peer dependencies
   # Identify version conflicts
   ```

### High Priority - Static Analysis

4. **Run ESLint**
   ```bash
   npm run lint
   # or: eslint . --ext .ts,.tsx,.js,.jsx
   ```
   - Capture all lint errors (not warnings)
   - Parse error locations
   - Categorize by rule name

5. **Detect Circular Dependencies**
   ```bash
   # Use madge or similar tool
   madge --circular --extensions ts,tsx .
   ```

6. **Find Dead Code**
   ```bash
   # Use ts-prune or similar
   ts-prune
   ```

### Medium Priority - Code Scanning

7. **Find Console Statements**
   - Grep for `console.log`, `console.error`, `console.warn`
   - Exclude test files and development utilities
   - Flag as code smell in production code

8. **Find TODO/FIXME**
   - Grep for `TODO:`, `FIXME:`, `HACK:`
   - Parse associated comments
   - Track technical debt

9. **Find Deprecated Usage**
   - Check for deprecated Next.js imports (e.g., `next/head` in App Router)
   - Check for deprecated React patterns (e.g., `componentWillMount`)
   - Check for deprecated Supabase methods

### Exclusions (Never Scan)

From `docs/rules/reference/exclusions.md`:
- `node_modules/`, `.next/`, `.tmp/`, `dist/`, `build/`
- `components/ui/*.tsx` (protected - shadcn/ui)
- `app/globals.css` (protected - design system)
- `lib/types/database.types.ts` (auto-generated)
- `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`
- `docs/`, `supabase-docs-rules/`

## Violation Rules

### CRITICAL - Build Breaking Errors

#### Rule: ERR-P001 {#err-p001}
- **Pattern**: TypeScript compilation must succeed
- **Detection**: Run `npm run typecheck`, capture exit code and errors
- **Why Critical**: Build fails, deployment blocked
- **Example**:
  ```ts
  // ❌ ERROR - TypeScript compilation error
  // src/features/booking/components/BookingForm.tsx:45:12
  // TS2322: Type 'string' is not assignable to type 'number'
  const duration: number = "30" // Type error

  // ✅ CORRECT
  const duration: number = 30
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-p001`
- **Related Rules**: TS-P001, TS-P002

#### Rule: ERR-P002 {#err-p002}
- **Pattern**: Next.js build must succeed
- **Detection**: Run `npm run build`, capture build errors
- **Why Critical**: Cannot deploy to production
- **Example**:
  ```
  ❌ ERROR
  Module not found: Can't resolve '@/components/ui/button'

  ✅ FIX
  Check import path, ensure file exists
  ```
- **Reference**: `docs/rules/framework/nextjs.md#next-p001`
- **Related Rules**: NEXT-P001

#### Rule: ERR-P003 {#err-p003}
- **Pattern**: No missing dependencies
- **Detection**: Run `npm ls`, check for peer dependency warnings
- **Why Critical**: Runtime crashes, missing modules
- **Example**:
  ```bash
  # ❌ ERROR
  npm WARN @supabase/supabase-js@2.x requires peer of @supabase/auth-helpers@^1.0.0

  # ✅ FIX
  npm install @supabase/auth-helpers@^1.0.0
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-p001`

#### Rule: ERR-P004 {#err-p004}
- **Pattern**: No circular dependencies
- **Detection**: Use madge or analyze import graph
- **Why Critical**: Bundle bloat, initialization errors, infinite loops
- **Example**:
  ```
  ❌ CIRCULAR DEPENDENCY DETECTED
  features/auth/utils.ts → features/auth/hooks.ts → features/auth/utils.ts

  ✅ FIX
  Extract shared code to separate module
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-m301`
- **Related Rules**: ARCH-M301

### HIGH PRIORITY - Runtime Errors

#### Rule: ERR-H101 {#err-h101}
- **Pattern**: No potential null/undefined access
- **Detection**: TypeScript strict null checks enabled
- **Why High**: Runtime crashes
- **Example**:
  ```ts
  // ❌ ERROR - Potential undefined access
  const userName = user.name.toUpperCase() // user could be null

  // ✅ CORRECT
  const userName = user?.name?.toUpperCase() ?? 'Guest'
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-p001`
- **Related Rules**: TS-P001

#### Rule: ERR-H102 {#err-h102}
- **Pattern**: ESLint errors must be resolved (not warnings)
- **Detection**: Run eslint, filter errors only
- **Why High**: Code quality issues, potential bugs
- **Example**:
  ```tsx
  // ❌ ERROR - React Hook dependency missing
  useEffect(() => {
    fetchData(userId)
  }, []) // Missing userId in deps

  // ✅ CORRECT
  useEffect(() => {
    fetchData(userId)
  }, [userId])
  ```
- **Reference**: `docs/rules/framework/react.md#react-h102`
- **Related Rules**: REACT-H102

#### Rule: ERR-H103 {#err-h103}
- **Pattern**: No unused exports (dead code)
- **Detection**: Use ts-prune or analyze import graph
- **Why High**: Bundle bloat, maintenance burden
- **Example**:
  ```ts
  // ❌ ERROR - Exported but never imported
  export function unusedHelper() { ... } // Dead code

  // ✅ CORRECT
  // Remove unused export or make it used
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-m301`

#### Rule: ERR-H104 {#err-h104}
- **Pattern**: No import errors (missing modules)
- **Detection**: TypeScript error TS2307
- **Why High**: Runtime module not found errors
- **Example**:
  ```ts
  // ❌ ERROR
  import { Button } from '@/components/ui/button' // File doesn't exist

  // ✅ CORRECT
  import { Button } from '@/components/ui/button' // File exists
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-p001`

### MEDIUM PRIORITY - Code Quality

#### Rule: ERR-M301 {#err-m301}
- **Pattern**: No console statements in production code
- **Detection**: Grep for console.log/error/warn
- **Why Medium**: Performance, information leakage
- **Example**:
  ```ts
  // ❌ ERROR - Console statement in production
  console.log('User data:', userData) // Remove

  // ✅ CORRECT - Use proper logging or remove
  // Remove completely or use logger.debug() in dev only
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-m301`

#### Rule: ERR-M302 {#err-m302}
- **Pattern**: Resolve TODO/FIXME comments
- **Detection**: Grep for TODO:, FIXME:, HACK:
- **Why Medium**: Technical debt tracking
- **Example**:
  ```ts
  // ❌ ERROR - Unresolved TODO
  // TODO: Add proper error handling
  function fetchData() { ... }

  // ✅ CORRECT - Either implement or create issue
  // Created issue #123 to add error handling
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-m301`

#### Rule: ERR-M303 {#err-m303}
- **Pattern**: No deprecated API usage
- **Detection**: Search for deprecated Next.js/React/Supabase patterns
- **Why Medium**: Future breaking changes
- **Example**:
  ```tsx
  // ❌ ERROR - Deprecated Next.js import
  import Head from 'next/head' // Deprecated in App Router

  // ✅ CORRECT - Use metadata
  export const metadata = { title: 'Page' }
  ```
- **Reference**: `docs/rules/framework/nextjs.md#next-h101`
- **Related Rules**: NEXT-H101

#### Rule: ERR-M304 {#err-m304}
- **Pattern**: No implicit any types
- **Detection**: TypeScript error TS7006
- **Why Medium**: Type safety gap
- **Example**:
  ```ts
  // ❌ ERROR - Implicit any
  function process(data) { ... } // Parameter has implicit any

  // ✅ CORRECT
  function process(data: unknown) {
    const validated = schema.parse(data)
    // ...
  }
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-p001`
- **Related Rules**: TS-P001

### LOW PRIORITY - Best Practices

#### Rule: ERR-L701 {#err-l701}
- **Pattern**: Complex functions should be refactored
- **Detection**: Cyclomatic complexity > 10
- **Reference**: `docs/rules/core/architecture.md#arch-l701`

#### Rule: ERR-L702 {#err-l702}
- **Pattern**: Public APIs should have JSDoc
- **Detection**: Exported functions without documentation
- **Reference**: `docs/rules/framework/typescript.md#ts-l701`

## Analysis Process

### STEP 3: Execute Build Checks

1. **TypeScript Compilation**
   ```bash
   npm run typecheck 2>&1 | tee /tmp/typecheck.log
   ```
   - Parse output for errors
   - Extract file:line:column locations
   - Extract error codes and messages
   - Categorize by severity

2. **Next.js Build**
   ```bash
   npm run build 2>&1 | tee /tmp/build.log
   ```
   - Detect build failures
   - Extract error locations
   - Identify module resolution errors
   - Check for bundle size issues

3. **Dependency Check**
   ```bash
   npm ls --depth=0 2>&1 | tee /tmp/deps.log
   ```
   - Find missing peer dependencies
   - Identify version conflicts
   - Check for security vulnerabilities

### STEP 4: Execute Static Analysis

4. **ESLint**
   ```bash
   npm run lint -- --format json > /tmp/eslint.json
   ```
   - Parse JSON output
   - Filter errors (severity === 2)
   - Extract file locations and rule names
   - Group by rule for patterns

5. **Circular Dependency Detection**
   ```bash
   npx madge --circular --extensions ts,tsx src/ features/ app/ components/
   ```
   - Identify circular import chains
   - Flag as critical errors
   - Suggest refactoring

6. **Dead Code Detection**
   ```bash
   npx ts-prune --error
   ```
   - Find unused exports
   - Exclude intentional public APIs
   - Flag for removal

### STEP 5: Execute Code Scanning

7. **Console Statements**
   ```bash
   grep -r "console\." --include="*.ts" --include="*.tsx" \
     --exclude-dir=node_modules --exclude-dir=.next
   ```
   - Exclude test files
   - Exclude development utilities
   - Flag production code violations

8. **Technical Debt Markers**
   ```bash
   grep -r "TODO:\|FIXME:\|HACK:" --include="*.ts" --include="*.tsx" \
     --exclude-dir=node_modules
   ```
   - Extract comment context
   - Track by file
   - Prioritize by age/impact

9. **Deprecated Usage**
   ```bash
   # Search for known deprecated patterns
   grep -r "next/head" app/
   grep -r "componentWillMount" src/
   ```

### STEP 6: Cross-Reference with Existing Analyzers

10. **Check for overlaps**
    - Read existing analysis reports
    - Avoid duplicate issues
    - Cross-reference error codes

## Issue Structure (Required Fields)

For each error found, create:

```json
{
  "code": "ERR-[P|H|M|L]###",
  "domain": "ERR",
  "priority": "critical" | "high" | "medium" | "low",
  "priority_order": number,
  "category": "errors",
  "error_type": "build" | "type" | "lint" | "runtime" | "import" | "dependency" | "console" | "todo" | "deprecated" | "dead-code",
  "file": "relative/path/from/project/root",
  "line_start": number,
  "line_end": number,
  "column": number,
  "rule": "ERR-[P|H|M|L]###",
  "title": "Brief error description",
  "description": "Full error message with context",
  "error_code": "TS2322" | "ESLint-rule-name" | null,
  "error_message": "Original error message from tool",
  "stack_trace": "Stack trace if available" | null,
  "current_code": "Exact violating code snippet",
  "fix_pattern": "Required fix from rule file",
  "auto_fixable": boolean,
  "reference": "docs/rules/[category]/[domain].md#err-[p|h|m|l]###",
  "related_rules": ["DOMAIN-CODE", ...],
  "estimated_effort": "5 minutes" | "15 minutes" | "30 minutes" | "1 hour",
  "status": "pending",
  "first_detected": "ISO-8601 timestamp",
  "last_detected": "ISO-8601 timestamp"
}
```

## Priority Code Assignment

**STEP 7**: Assign codes using ERR domain prefix:

1. Sort violations: critical → high → medium → low
2. Within same priority: alphabetically by error_type, then file path
3. Assign codes:
   - Critical: ERR-P001 through ERR-P099 (build breaking)
   - High: ERR-H100 through ERR-H299 (runtime errors)
   - Medium: ERR-M300 through ERR-M699 (code quality)
   - Low: ERR-L700 through ERR-L999 (best practices)

## Output Files (Required)

**STEP 8**: Generate exactly 2 files:

1. `docs/analyze-fixes/errors/analysis-report.json` - Machine-readable
2. `docs/analyze-fixes/errors/analysis-report.md` - Human-readable

## Metadata Requirements

Include in JSON:
```json
{
  "metadata": {
    "area": "errors",
    "domain": "ERR",
    "rules_source": [
      "docs/rules/framework/typescript.md",
      "docs/rules/framework/nextjs.md",
      "docs/rules/framework/react.md"
    ],
    "first_analysis": "ISO-8601",
    "last_analysis": "ISO-8601 (now)",
    "update_count": number,
    "total_files_scanned": number,
    "total_issues": number,
    "build_status": "passing" | "failing",
    "typecheck_status": "passing" | "failing",
    "lint_status": "passing" | "failing"
  },
  "summary": {
    "by_priority": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "by_status": {
      "pending": 0,
      "fixed": 0,
      "skipped": 0,
      "needs_manual": 0,
      "failed": 0,
      "regressed": 0
    },
    "by_error_type": {
      "build": 0,
      "type": 0,
      "lint": 0,
      "runtime": 0,
      "import": 0,
      "dependency": 0,
      "console": 0,
      "todo": 0,
      "deprecated": 0,
      "dead_code": 0
    },
    "by_rule": {
      "ERR-P001": 0,
      "ERR-P002": 0,
      ...
    },
    "changes_since_last_analysis": {
      "new_issues": 0,
      "resolved_issues": 0,
      "regressed_issues": 0
    }
  },
  "build_results": {
    "typecheck": {
      "status": "passing" | "failing",
      "error_count": 0,
      "errors": []
    },
    "build": {
      "status": "passing" | "failing",
      "error_count": 0,
      "errors": []
    },
    "lint": {
      "status": "passing" | "failing",
      "error_count": 0,
      "warning_count": 0,
      "errors": []
    }
  },
  "issues": [...]
}
```

## Display Requirements

**STEP 9**: Show terminal output:

**If first analysis:**
```
✅ Comprehensive Error Analysis Complete (NEW)

🚦 Build Status
├─ TypeScript: ❌ FAILING (12 errors)
├─ Next.js Build: ✅ PASSING
└─ ESLint: ⚠️  WARNINGS (45 warnings, 3 errors)

📊 Total Issues: [count]
├─ Critical (ERR-P): [count] (Build breaking, deployment blocked)
├─ High (ERR-H): [count] (Runtime errors, lint failures)
├─ Medium (ERR-M): [count] (Code quality, technical debt)
└─ Low (ERR-L): [count] (Best practices, documentation)

📂 Error Types
├─ Build Errors: [count]
├─ Type Errors: [count]
├─ Lint Errors: [count]
├─ Runtime Errors: [count]
├─ Import Errors: [count]
├─ Dependency Errors: [count]
├─ Console Statements: [count]
├─ TODO/FIXME: [count]
├─ Deprecated Usage: [count]
└─ Dead Code: [count]

🔴 BLOCKING ISSUES (Must fix before deploy):
[List critical errors with file:line]

📁 Reports:
├─ docs/analyze-fixes/errors/analysis-report.json
└─ docs/analyze-fixes/errors/analysis-report.md

🔧 Next: Run /errors/fix to start fixing
```

**If update:**
```
✅ Error Analysis Updated
📊 Changes: +[new] new, -[resolved] resolved, ⚠️ [regressed] regressed
📈 Current: [total] (was [previous])
🚦 Build: [passing/failing] | TypeCheck: [passing/failing] | Lint: [passing/failing]
🔧 Run /errors/fix to continue
```

## Execution Order

1. Read all required rule files from docs/rules/
2. Read docs/rules/reference/exclusions.md
3. Check for existing report
4. Run TypeScript typecheck (capture errors)
5. Run Next.js build (capture errors)
6. Check npm dependencies (capture issues)
7. Run ESLint (capture errors)
8. Detect circular dependencies
9. Find dead code
10. Scan for console statements
11. Scan for TODO/FIXME
12. Scan for deprecated usage
13. Parse all errors and categorize
14. Assign ERR-prefixed codes
15. Merge with existing data if applicable
16. Generate JSON and MD files
17. Display comprehensive summary with build status

**Execute now.** Follow steps 1-17 in exact order. Run all build checks and provide complete error inventory.
