# Fix All Errors
## Quick Reference

**Common Commands:**
```bash
# Find all errors
npm run typecheck 2>&1 | grep "error TS"

# Count errors
npm run typecheck 2>&1 | grep -c "error TS"

# Find missing imports
rg "Cannot find module|has no exported member" /tmp/ts-errors.txt

# Find type errors
rg "not assignable to type|does not exist on type" /tmp/ts-errors.txt

# Fix specific file
npm run typecheck 2>&1 | grep "path/to/file.ts"
```

## What This Does

This command systematically finds and fixes ALL types of errors in your project:
- TypeScript compilation errors (TS2xxx)
- ESLint violations
- Import/export mismatches (TS2307, TS2305)
- Missing dependencies
- Type definition errors (TS2339, TS2322, TS2769)
- Path resolution errors (TS2307)
- Schema/database type mismatches
- Broken component references
- Invalid prop types
- Runtime error patterns

## Instructions

**IMPORTANT: Work completely autonomously. Do NOT ask questions. Fix everything you find.**

### Step 1: Initial Assessment

Run comprehensive error detection:

```bash
# TypeScript errors
npm run typecheck 2>&1 | tee /tmp/ts-errors.txt

# ESLint errors (if configured)
npm run lint 2>&1 | tee /tmp/eslint-errors.txt || true

# Build errors (if applicable)
npm run build 2>&1 | tee /tmp/build-errors.txt || true
```

Analyze output and categorize errors by type:
1. **Import errors** - Cannot find module, no exported member
2. **Type errors** - Type mismatch, missing properties, wrong types
3. **Schema errors** - Database type mismatches, RLS issues
4. **Component errors** - Missing props, invalid JSX
5. **Configuration errors** - tsconfig, path aliases, dependencies
6. **Runtime patterns** - Null checks, async/await, error handling

### Step 2: Fix Errors by Category

Work through each category systematically. Fix in order of impact:

#### A. Missing Module Errors (Highest Priority)

**Detection Pattern:**
```
Cannot find module '@/components/xyz'
Module '"./api/queries"' has no exported member 'functionName'
```

**Fix Strategy:**
1. Check if module was deleted/moved:
   ```bash
   find . -name "xyz.tsx" -o -name "xyz.ts" | grep -v node_modules
   git log --all --full-history -- "**/xyz.ts*"
   ```

2. If moved, update all imports:
   ```bash
   rg "from '@/components/xyz'" --type ts --type tsx -l
   ```

3. If deleted, find replacement:
   - Check git history for what replaced it
   - Look for similar components
   - Update imports to new location

4. If export missing, add to index file:
   - Read the source file
   - Add export to index.ts/tsx
   - Ensure function/type is actually defined

#### B. Type Definition Errors

**Detection Pattern:**
```
Property 'xyz' does not exist on type 'ABC'
Type 'X' is not assignable to type 'Y'
No overload matches this call
```

**Fix Strategy:**
1. Read the type definition file
2. Check actual usage vs expected type
3. Fix by:
   - Adding missing properties to type
   - Updating type to match usage
   - Casting where appropriate (last resort)
   - Fixing the data structure if wrong

4. For database types:
   - Check if type regeneration needed
   - Verify schema matches database
   - Update type imports

#### C. Import/Export Mismatches

**Detection Pattern:**
```
Module '"./xyz"' has no exported member 'ABC'
```

**Fix Strategy:**
1. Read the source file being imported
2. Check what's actually exported
3. Fix by:
   - Adding missing export: `export { ABC }`
   - Fixing import name to match export
   - Adding to index.ts barrel export
   - Removing import if function doesn't exist

#### D. Schema/Database Type Errors

**Detection Pattern:**
```
Argument of type '"table_name"' is not assignable to parameter of type...
Column 'xyz' does not exist on 'table_name'
```

**Fix Strategy:**
1. Check database schema:
   - Verify table exists in correct schema
   - Check column names match database
   - Verify view vs table usage

2. Fix by:
   - Using correct schema: `.schema('schema_name')`
   - Using correct table/view name
   - Updating column names to match database
   - Regenerating types if schema changed

#### E. Component/JSX Errors

**Detection Pattern:**
```
Property 'xyz' does not exist on type 'IntrinsicAttributes & Props'
Type 'X' is not assignable to type 'ReactNode'
```

**Fix Strategy:**
1. Read component definition
2. Check prop types interface
3. Fix by:
   - Adding missing prop to interface
   - Providing required props at call site
   - Making props optional if appropriate
   - Fixing prop types to match usage

#### F. Path Alias Errors

**Detection Pattern:**
```
Cannot find module '@/xyz'
```

**Fix Strategy:**
1. Check tsconfig.json paths configuration
2. Verify actual file location
3. Fix by:
   - Using correct path alias
   - Adding missing alias to tsconfig
   - Using relative path if alias broken
   - Updating file location

#### G. Async/Await Errors

**Detection Pattern:**
```
Property 'xyz' does not exist on type 'Promise<T>'
'await' has no effect on the type of this expression
```

**Fix Strategy:**
1. Check if value is Promise
2. Fix by:
   - Adding `await` keyword
   - Removing unnecessary `await`
   - Adding `async` to function
   - Properly unwrapping Promise types

#### H. Null/Undefined Errors

**Detection Pattern:**
```
Object is possibly 'null'
Object is possibly 'undefined'
```

**Fix Strategy:**
1. Add null checks
2. Use optional chaining: `obj?.property`
3. Use nullish coalescing: `value ?? default`
4. Add type guards
5. Filter null values before usage

### Step 3: Fix in Batches

**Critical Rules:**
1. **Fix in batches of 10-15 files maximum**
2. **Run typecheck after each batch:**
   ```bash
   npm run typecheck
   ```
3. **If new errors appear, fix immediately**
4. **If errors reduce, continue to next batch**
5. **Track progress: X errors → Y errors**

### Step 4: Handle Cascading Errors

Some errors cause many others:
- Fix root cause first (usually missing exports)
- Re-run typecheck to see which errors disappeared
- Continue with remaining errors

### Step 5: Final Verification

After all fixes:

```bash
# Must pass with zero errors
npm run typecheck

# Should pass (fix critical violations only)
npm run lint || true

# Verify build works (if applicable)
npm run build || true
```

## Error Priority Order

Fix in this order for maximum impact:

1. **Missing modules/exports** - Blocks everything
2. **Type definition errors** - Cascades to many files
3. **Schema/database errors** - Data integrity issues
4. **Import path errors** - Prevents compilation
5. **Component prop errors** - Runtime failures
6. **Null/undefined errors** - Runtime safety
7. **Async/await errors** - Logic bugs
8. **ESLint warnings** - Code quality (low priority)

## TypeScript Error Code Reference

**Import/Export Errors:**
- **TS2307** - Cannot find module
- **TS2305** - Module has no exported member
- **TS2304** - Cannot find name

**Type Errors:**
- **TS2322** - Type not assignable
- **TS2339** - Property does not exist on type
- **TS2345** - Argument type not assignable
- **TS2769** - No overload matches this call
- **TS2741** - Property missing in type
- **TS2532** - Object is possibly 'undefined'
- **TS2531** - Object is possibly 'null'

**Function Errors:**
- **TS2554** - Expected X arguments, got Y
- **TS2556** - Expected X type parameters
- **TS7006** - Parameter implicitly has 'any' type

**Async Errors:**
- **TS2349** - This expression is not callable
- **TS1308** - 'await' expression only allowed in async function

## Common Error Patterns & Fixes

### Pattern 1: Deleted Module Still Imported

**Error:**
```
Cannot find module '@/components/layout'
```

**Fix:**
1. Find what replaced it:
   ```bash
   git log --all --full-history -- "**/layout/**"
   ```
2. Update all imports:
   ```bash
   rg "from '@/components/layout'" -l | xargs -I {} echo {}
   ```
3. Replace with new path or remove if obsolete

### Pattern 2: Missing Export

**Error:**
```
Module '"./api/queries"' has no exported member 'getXYZ'
```

**Fix:**
1. Read `api/queries.ts`
2. Check if function exists:
   - If yes: Add `export { ABC }`
   - If no: Check if renamed, update imports
   - If deleted: Remove all imports and usages

### Pattern 3: Type Mismatch

**Error:**
```
Type 'string | undefined' is not assignable to type 'string'
```

**Fix Options:**
1. Add null check: `if (value) { ... }`
2. Use non-null assertion: `value!` (only if certain)
3. Make type accept undefined: `string | undefined`
4. Provide default: `value ?? 'default'`

### Pattern 4: Database Schema Error

**Error:**
```
Argument of type '"salon_reviews"' is not assignable to parameter
```

**Fix:**
1. Check if using correct schema:
   ```ts
   .schema('engagement').from('salon_reviews')
   ```
2. Verify table exists in database
3. Use view for reads, schema table for writes

### Pattern 5: Promise Not Awaited

**Error:**
```
Property 'xyz' does not exist on type 'Promise<T>'
```

**Fix:**
```ts
// Before
const data = getData()
data.xyz // Error

// After
const data = await getData()
data.xyz // Works
```

## Automation Strategy

1. **Parse typecheck output** to extract:
   - File path
   - Line number
   - Error code
   - Error message

2. **Group errors** by:
   - File (fix all errors in one file together)
   - Type (fix all import errors, then type errors, etc.)
   - Root cause (one missing export causes 50 errors)

3. **Fix systematically:**
   - Start with files with most errors
   - Fix root causes first
   - Re-run typecheck frequently
   - Stop if errors increase

4. **Verify fixes:**
   - Each batch must reduce total errors
   - No new errors introduced
   - Final typecheck must pass

## Output Format

Provide a summary after completion:

```
## Error Fixing Summary

### Initial State
- TypeScript errors: XXX
- ESLint errors: XXX
- Build errors: XXX

### Errors Fixed
1. Missing modules: XX files updated
2. Type definitions: XX files fixed
3. Import/exports: XX files corrected
4. Schema errors: XX files updated
5. Component errors: XX files fixed
6. Other errors: XX files updated

### Final State
- TypeScript errors: 0 ✅
- ESLint errors: XX (non-critical)
- Build: Success ✅

### Files Modified
- path/to/file1.ts
- path/to/file2.tsx
- (list all modified files)

### Remaining Issues
- (list any unfixed errors with reasons)
```

## Special Cases

### When Errors Can't Be Fixed

If an error cannot be fixed automatically:
1. **Document why** - Add comment explaining the issue
2. **Add TODO** - Mark for manual review
3. **Suppress if safe** - Use `@ts-expect-error` with explanation
4. **Report in summary** - Include in final output

### When Types Need Regeneration

If database types are stale:
1. Note in summary: "Database types may need regeneration"
2. Continue fixing other errors
3. Suggest running type generation command

### When Dependencies Are Missing

If npm packages are missing:
1. Check package.json
2. Note in summary
3. Do NOT run npm install automatically
4. List missing dependencies for user

## Reusability

This command works across projects because it:
- Detects errors generically (TypeScript, ESLint, build)
- Categorizes by pattern, not specific files
- Uses project's own npm scripts
- Adapts to any codebase structure
- Provides clear before/after metrics

## Success Criteria

✅ **Must achieve:**
- Zero TypeScript errors (`npm run typecheck` passes)
- No new errors introduced
- All critical paths working

✅ **Should achieve:**
- Most ESLint errors fixed
- Build succeeds (if applicable)
- Code quality improved

✅ **Nice to have:**
- All warnings resolved
- Dead code removed
- Types strengthened

## Real-World Examples

### Example 1: Missing Layout Module

**Error:**
```
features/staff/location/index.tsx(1,32): error TS2307:
Cannot find module '@/components/layout' or its corresponding type declarations.
```

**Investigation:**
```bash
# Check if module exists
ls components/layout  # Error: No such file

# Check git history
git log --all --oneline -- "**/components/layout/**"
# Shows: "refactor: remove layout components"

# Find what replaced it
git show af92e27 --stat | grep layout
```

**Fix:**
```tsx
// Before
import { Box } from '@/components/layout'

// After (check current codebase)
import { Card } from '@/components/ui/card'
// OR remove if no longer needed
```

### Example 2: Missing Export

**Error:**
```
features/staff/commission/index.tsx(4,3): error TS2305:
Module '"./api/queries"' has no exported member 'getStaffCommission'.
```

**Investigation:**
```bash
# Read the queries file
cat features/staff/commission/api/queries.ts
# Check if function exists but not exported
```

**Fix Option A - Function exists:**
```ts
// In features/staff/commission/api/queries.ts
export async function getStaffCommission() { ... }  // ✅ Add export

// OR in index.ts
export { getStaffCommission } from './queries/stats'  // ✅ Re-export
```

**Fix Option B - Function doesn't exist:**
```tsx
// In features/staff/commission/index.tsx
// Remove the import entirely
- import { getStaffCommission } from './api/queries'  // ❌ Remove
```

### Example 3: Schema Table Type Error

**Error:**
```
features/admin/moderation/api/mutations/ban-review-author.mutation.ts(29,13): error TS2769:
Argument of type '"salon_reviews"' is not assignable to parameter of type '"database_operations_log"'.
```

**Fix:**
```ts
// Before - Wrong schema inferred
const { data: review } = await supabase
  .from('salon_reviews')  // ❌ Not in current schema context

// After - Explicit schema
const { data: review } = await supabase
  .schema('engagement')
  .from('salon_reviews')  // ✅ Correct
  .select('customer_id, salon_id')
```

### Example 4: Type Narrowing

**Error:**
```
Property 'customer_id' does not exist on type 'SelectQueryError<...>'
```

**Fix:**
```ts
// Before
const { data: review } = await supabase
  .schema('engagement')
  .from('salon_reviews')
  .select('customer_id')
  .eq('id', reviewId)
  .single()

if (!review) throw new Error('Not found')
console.log(review.customer_id)  // ❌ Type error

// After - Proper type handling
const { data: review, error } = await supabase
  .schema('engagement')
  .from('salon_reviews')
  .select('customer_id')
  .eq('id', reviewId)
  .maybeSingle<{ customer_id: string }>()  // ✅ Explicit type

if (error) throw error
if (!review) throw new Error('Not found')
console.log(review.customer_id)  // ✅ Works
```

### Example 5: Cascading Errors

**Problem:** 113 errors all from missing `@/components/layout`

**Strategy:**
1. Fix the root cause (one missing module)
2. Re-run typecheck
3. Watch 113 errors → 0 errors

**Commands:**
```bash
# Before fix
npm run typecheck 2>&1 | grep -c "error TS"  # 127 errors

# Find all files importing layout
rg "from '@/components/layout'" -l --type tsx

# Fix all at once with find/replace
rg "from '@/components/layout'" -l --type tsx | \
  xargs sed -i '' "s|@/components/layout|@/components/ui/card|g"

# After fix
npm run typecheck 2>&1 | grep -c "error TS"  # 14 errors (113 fixed!)
```

## Debugging Tips

**When stuck on an error:**

1. **Read the full error message**
   ```bash
   npm run typecheck 2>&1 | grep -A 5 "path/to/file.ts"
   ```

2. **Check the actual file**
   ```bash
   cat -n path/to/file.ts | sed -n '25,35p'  # Lines 25-35
   ```

3. **Find similar working code**
   ```bash
   rg "pattern that works" --type tsx -C 3
   ```

4. **Check git history**
   ```bash
   git log -p --follow -- path/to/file.ts | less
   ```

5. **Verify types**
   ```bash
   # Check what's actually exported
   rg "^export (async )?function|^export (const|let|var)|^export \{" file.ts
   ```

---

**Remember: Be autonomous. Fix everything you can. Document what you can't. Report results clearly.**
