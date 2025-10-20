# Comprehensive Error Fix - Reusable Session

Auto-fix all types of errors in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted errors, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/errors/analysis-report.json`

## Rules Reference

**Primary Rules**:
- `docs/rules/framework/typescript.md`
- `docs/rules/framework/nextjs.md`
- `docs/rules/framework/react.md`
- `docs/rules/core/architecture.md`

**Index**: `docs/rules/01-rules-index.md`

## Process

### 1. Load Report
```
Read: analysis-report.json
Filter: issues where status === "pending"
Sort: by priority_order (ascending - ERR-P001 → ERR-L999)
Take: First 10-20 issues
```

### 2. Fix Batch
For each error in batch (ERR-P001 → ERR-L999):
1. Identify error_type
2. Read target files
3. Apply fix based on error_type
4. Verify fix (re-run check if possible)
5. Update issue status in JSON
6. Save report
7. Continue to next

### 3. Batch Complete

After fixing batch:
```
Show progress summary
Save updated report
Re-run build checks to verify
Indicate if more issues remain
```

## Fix Patterns by Error Type

### error_type: "build"

**Pattern**: TypeScript compilation errors
**Fix Strategy**: Based on specific TS error code

#### TS2322 - Type mismatch
```ts
// ❌ ERROR
const duration: number = "30"

// ✅ FIX
const duration: number = 30
// or
const duration: number = parseInt("30", 10)
```

#### TS2307 - Module not found
```ts
// ❌ ERROR
import { Button } from '@/components/ui/button' // File missing

// ✅ FIX
// 1. Check if file exists
// 2. If not, check for typo in path
// 3. If deleted, remove import
```

#### TS2304 - Cannot find name
```ts
// ❌ ERROR
const result = someUndefinedVariable

// ✅ FIX
import { someUndefinedVariable } from './module'
// or define it if it should be local
```

**Auto-fix**: Partial (simple type fixes)
**Manual**: Complex type issues, missing modules

### error_type: "type"

**Pattern**: Strict TypeScript violations

#### Implicit any
```ts
// ❌ ERROR
function process(data) { ... }

// ✅ FIX
function process(data: unknown) {
  const validated = schema.parse(data)
  // ...
}
```

#### Missing null checks
```ts
// ❌ ERROR
const name = user.name.toUpperCase()

// ✅ FIX
const name = user?.name?.toUpperCase() ?? 'Guest'
```

**Auto-fix**: Add optional chaining, add unknown types
**Manual**: Complex type inference

### error_type: "lint"

**Pattern**: ESLint rule violations

#### ESLint auto-fixable
```bash
# Run ESLint with --fix flag
npx eslint --fix <file>
```

#### react-hooks/exhaustive-deps
```tsx
// ❌ ERROR
useEffect(() => {
  fetchData(userId)
}, []) // Missing userId

// ✅ FIX
useEffect(() => {
  fetchData(userId)
}, [userId])
```

#### @typescript-eslint/no-explicit-any
```ts
// ❌ ERROR
const data: any = await fetch()

// ✅ FIX
const data: unknown = await fetch()
const validated = schema.parse(data)
```

**Auto-fix**: Run `eslint --fix` for auto-fixable rules
**Manual**: Dependency arrays, complex rule violations

### error_type: "runtime"

**Pattern**: Potential runtime errors

#### Null/undefined access
```ts
// ❌ ERROR
const length = items.length // items could be null

// ✅ FIX
const length = items?.length ?? 0
```

#### Array access
```ts
// ❌ ERROR
const first = array[0].name // array could be empty

// ✅ FIX
const first = array[0]?.name ?? 'Unknown'
```

**Auto-fix**: Add optional chaining, nullish coalescing
**Manual**: Complex runtime logic

### error_type: "import"

**Pattern**: Import/module resolution errors

#### Missing import
```ts
// ❌ ERROR - Using Button without import

// ✅ FIX
import { Button } from '@/components/ui/button'
```

#### Circular dependency
```ts
// ❌ ERROR
// a.ts imports b.ts
// b.ts imports a.ts

// ✅ FIX
// Extract shared code to c.ts
// a.ts and b.ts both import c.ts
```

**Auto-fix**: Add missing imports (if file exists)
**Manual**: Circular dependencies (requires refactoring)

### error_type: "dependency"

**Pattern**: Missing or conflicting packages

#### Missing dependency
```bash
# ❌ ERROR
# Package 'zod' is imported but not in package.json

# ✅ FIX
npm install zod
```

#### Peer dependency
```bash
# ❌ ERROR
# @supabase/supabase-js requires @supabase/auth-helpers

# ✅ FIX
npm install @supabase/auth-helpers@latest
```

**Auto-fix**: Run `npm install` for missing packages
**Manual**: Version conflicts, peer dependency resolution

### error_type: "console"

**Pattern**: Console statements in production

```ts
// ❌ ERROR
console.log('User data:', userData)

// ✅ FIX - Remove completely
// (delete the line)

// ✅ FIX - Or use conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('User data:', userData)
}
```

**Auto-fix**: Delete console statements
**Manual**: Replace with proper logging if needed

### error_type: "todo"

**Pattern**: TODO/FIXME comments

```ts
// ❌ ERROR
// TODO: Add error handling
function fetchData() { ... }

// ✅ FIX - Implement it
function fetchData() {
  try {
    // ... implementation
  } catch (error) {
    handleError(error)
  }
}

// ✅ FIX - Or create issue
// GitHub issue #456 - Add error handling to fetchData
```

**Auto-fix**: None (mark as needs_manual)
**Manual**: Implement TODO or create tracking issue

### error_type: "deprecated"

**Pattern**: Deprecated API usage

#### Next.js deprecated
```tsx
// ❌ ERROR - next/head in App Router
import Head from 'next/head'

// ✅ FIX - Use metadata
export const metadata = {
  title: 'Page Title'
}
```

#### React deprecated
```tsx
// ❌ ERROR
componentWillMount() { ... }

// ✅ FIX
useEffect(() => { ... }, [])
```

**Auto-fix**: Simple replacements (imports, basic patterns)
**Manual**: Complex component refactoring

### error_type: "dead_code"

**Pattern**: Unused exports

```ts
// ❌ ERROR - Exported but never imported
export function unusedHelper() { ... }

// ✅ FIX - Remove export or entire function
// (delete if truly unused)
```

**Auto-fix**: Remove unused exports
**Manual**: Verify nothing external uses it

## Status Updates

After each fix:

**Fixed:**
```json
{
  "status": "fixed",
  "fixed_at": "ISO-8601",
  "fixed_code": "actual fixed code",
  "fix_notes": "Applied [fix type]: [description]",
  "verification": "Passed typecheck/build/lint"
}
```

**Needs Manual:**
```json
{
  "status": "needs_manual",
  "fix_notes": "Complex refactoring required - manual intervention needed",
  "error": "[what prevented auto-fix]",
  "recommendation": "[what human should do]"
}
```

**Failed:**
```json
{
  "status": "failed",
  "fix_notes": null,
  "error": "[error description]",
  "verification_failed": true
}
```

## Verification After Fixes

After each batch, re-run checks:

```bash
# TypeScript check
npm run typecheck

# Build check
npm run build

# Lint check
npm run lint
```

Update build_status in report metadata.

## Display Progress

### After Each Fix
```
✅ FIXED ERR-P### [file]:[line]
│
├─ Error Type: [build/type/lint/etc]
├─ Issue: [error message]
├─ Applied: [fix description]
├─ Verification: ✅ Passed [typecheck/build/lint]
├─ Rule: docs/rules/framework/[domain].md#err-p###
└─ Time: [timestamp]

📊 Batch Progress: [current]/[batch_size]
⏭️  Next: ERR-P###
```

### After Batch Complete
```
🎯 BATCH COMPLETE

📊 This Batch
├─ Fixed: [count]/[batch_size] issues
├─ Needs Manual: [count]
├─ Time: ~[minutes] minutes

🚦 Build Status After Fixes
├─ TypeScript: [✅ PASSING / ❌ FAILING] ([error_count] errors)
├─ Next.js Build: [✅ PASSING / ❌ FAILING]
└─ ESLint: [✅ PASSING / ⚠️ WARNINGS / ❌ FAILING]

📈 Overall Progress
├─ Total Issues: [total]
├─ Fixed: [fixed_count] ([fixed_percent]%)
├─ Remaining: [pending_count] ([pending_percent]%)
│
├─ By Status:
│   ├─ ✅ Fixed: [count]
│   ├─ ⏳ Pending: [count]
│   ├─ ⚠️  Needs Manual: [count]
│   └─ ❌ Failed: [count]
│
├─ By Error Type:
│   ├─ Build Errors: [fixed]/[total]
│   ├─ Type Errors: [fixed]/[total]
│   ├─ Lint Errors: [fixed]/[total]
│   ├─ Runtime Errors: [fixed]/[total]
│   ├─ Import Errors: [fixed]/[total]
│   ├─ Dependency Errors: [fixed]/[total]
│   ├─ Console Statements: [fixed]/[total]
│   ├─ TODO/FIXME: [fixed]/[total]
│   ├─ Deprecated Usage: [fixed]/[total]
│   └─ Dead Code: [fixed]/[total]
│
└─ By Priority:
    ├─ Critical (ERR-P): [fixed]/[total] ([percent]%)
    ├─ High (ERR-H): [fixed]/[total] ([percent]%)
    ├─ Medium (ERR-M): [fixed]/[total] ([percent]%)
    └─ Low (ERR-L): [fixed]/[total] ([percent]%)

💾 Report Updated: docs/analyze-fixes/errors/analysis-report.json

🔄 NEXT STEPS
Run /errors/fix again to fix next batch (10-20 issues)
Or run npm run typecheck/build/lint to verify manually
```

### When All Complete
```
🎉 ALL ERRORS FIXED!

📊 Final Statistics
Total Issues: [count]
├─ ✅ Fixed: [count] ([percent]%)
├─ ⚠️  Needs Manual: [count] ([percent]%)
└─ ❌ Failed: [count] ([percent]%)

🚦 Final Build Status
├─ TypeScript: ✅ PASSING
├─ Next.js Build: ✅ PASSING
└─ ESLint: ✅ PASSING

⚠️  Manual Review Required:
[List issues needing manual implementation]

Example:
- Circular dependency in features/auth/ - Refactor needed
- Complex type inference in queries.ts:145 - Manual type annotation
- TODO in mutations.ts:89 - Implement error handling

💾 Reports Updated:
├─ docs/analyze-fixes/errors/analysis-report.json
└─ docs/analyze-fixes/errors/analysis-report.md

📚 Related Documentation:
├─ TypeScript Rules: docs/rules/framework/typescript.md
├─ Next.js Rules: docs/rules/framework/nextjs.md
├─ React Rules: docs/rules/framework/react.md
└─ Task Guide: docs/rules/02-task-based-guide.md

✅ Build is passing! Ready to deploy.
```

## Fix Priority by Error Type

1. **dependency** - Install missing packages first (enables other fixes)
2. **import** - Fix import errors (enables type checking)
3. **build** - Fix TypeScript compilation (enables build)
4. **type** - Fix type errors (improves safety)
5. **lint** - Run eslint --fix (automated)
6. **runtime** - Add null checks (prevents crashes)
7. **console** - Remove console statements (cleanup)
8. **deprecated** - Replace deprecated APIs (future-proofing)
9. **dead_code** - Remove unused exports (cleanup)
10. **todo** - Address technical debt (quality)

## Automated Fix Capabilities

### Fully Automatable (>90% success)
- **Console statements** - Delete lines
- **Dead code** - Remove unused exports
- **ESLint auto-fixable** - Run eslint --fix
- **Simple type errors** - Add optional chaining
- **Missing dependencies** - npm install

### Partially Automatable (50-80% success)
- **Import errors** - Add imports if file exists
- **Type mismatches** - Simple type casts
- **Deprecated usage** - Simple replacements

### Manual Only (<30% automatable)
- **Circular dependencies** - Requires refactoring
- **Complex type errors** - Need context
- **TODO/FIXME** - Need implementation
- **Runtime logic** - Business logic required

## User Commands

- **"pause"** - Stop after current fix, save progress
- **"skip"** - Skip current error, mark as skipped
- **"status"** - Show current batch and overall progress
- **"verify"** - Re-run all build checks

## Batch Size

- **Default**: 10-20 errors per run
- **Min**: 10 errors
- **Max**: 30 errors
- **Adjust**: Fewer for complex errors requiring manual review

## Begin Fixing

1. Load `docs/analyze-fixes/errors/analysis-report.json`
2. Filter `status === "pending"`
3. Sort by `priority_order` (ascending: ERR-P001 → ERR-L999)
4. Take first 10-20 errors
5. Fix each using patterns above
6. Verify fixes by re-running checks
7. Update status after each
8. Save report after batch
9. Display build status

**Start now.** Fix next batch of pending errors in priority order. Verify with build checks.
