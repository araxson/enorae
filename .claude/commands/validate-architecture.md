# validate-architecture

Deep architectural analysis to identify AND fix violations against established patterns and best practices.

## Task

1. Scan the codebase for architectural violations
2. Report findings with specific file paths and line numbers
3. **Automatically fix** violations where safe to do so
4. Provide manual fix instructions for complex violations

## Patterns to Validate

### 1. Feature Module Structure
Check `features/[portal]/[feature]/` follows:
```
index.tsx                    # Main export (5-15 lines)
api/
  queries.ts                 # SELECT ops (import 'server-only')
  mutations.ts               # INSERT/UPDATE/DELETE ('use server')
components/
  [Feature]-client.tsx       # Main client component
  [Component].tsx            # Sub-components
hooks/
  use-[hook].ts              # Custom hooks
utils/
  [helper].ts                # Utilities
```

**Violations to flag:**
- Missing `index.tsx` as main export
- Business logic in `index.tsx` (>15 lines)
- Missing `'server-only'` in queries.ts
- Missing `'use server'` in mutations.ts
- Incorrect folder nesting or naming

**Auto-fix when safe:**
- Add missing `'server-only'` directive to queries.ts
- Add missing `'use server'` directive to mutations.ts
- Extract business logic from index.tsx to components/

### 2. Database Access Pattern
**Queries (SELECT):**
- Must use public views: `.from('view_name')`
- Must NOT query schema tables directly in queries
- Types must use: `Database['public']['Views']['name']['Row']`

**Mutations (INSERT/UPDATE/DELETE):**
- Must use schema tables: `.schema('schema_name').from('table_name')`
- Must include auth check first
- Must call `revalidatePath()` after mutations

**Violations to flag:**
- Querying schema tables in SELECT operations
- Using `Database['public']['Tables']` types
- Missing auth checks in queries/mutations
- Using `getSession()` instead of `getUser()`
- Missing `revalidatePath()` in mutations

**Auto-fix when safe:**
- Replace `.schema('x').from('table')` with `.from('view')` in queries
- Replace `['Tables']` with `['Views']` in type definitions
- Add auth checks: `const { data: { user } } = await supabase.auth.getUser()`
- Replace `getSession()` with `getUser()`
- Add `revalidatePath()` after mutations

### 3. Page Architecture
Pages in `app/(portal)/*/page.tsx` must:
- Be 5-15 lines maximum
- Only render feature components
- No data fetching or business logic
- No complex layouts

**Violations to flag:**
- Pages >15 lines
- Direct Supabase calls in pages
- Business logic in pages
- Complex UI composition in pages

### 4. Type Safety
**Rules:**
- NO `any` types anywhere
- Use `Database['public']['Views']` for types
- Import from `@/lib/types/database.types`
- Properly typed function returns

**Violations to flag:**
- Usage of `any` type
- Missing type imports
- Untyped function returns
- Using table types instead of view types

**Auto-fix when safe:**
- Replace `:any` with proper types from `Database['public']['Views']`
- Add missing type imports from `@/lib/types/database.types`
- Add explicit return types to functions

### 5. File Naming & Organization
**Rules:**
- Folders/files: `kebab-case`
- NO suffixes: `-v2`, `-new`, `-fixed`, `-old`, `-temp`, `-enhanced`
- NO prefixes: `new-`, `temp-`, `enhanced-`
- DAL files: `[feature].queries.ts`, `[feature].mutations.ts`

**Violations to flag:**
- PascalCase or camelCase file/folder names
- Versioned or temporary file names
- Incorrect DAL file naming

### 6. File Size Limits
- Pages (`index.tsx`): ≤15 lines
- Components: ≤200 lines (**except `components/ui/`** - shadcn components exempt)
- Hooks: ≤200 lines
- Utils: ≤150 lines

**Violations to flag:**
- Files exceeding size limits (excluding `components/ui/`)
- Suggest splitting oversized files into smaller modules

**Auto-fix when safe:**
- Extract oversized components into sub-components
- Split large utils into focused helper functions

### 7. Component Usage
**Rules:**
- Use shadcn/ui components (pre-installed)
- Use layout components: `Stack`, `Grid`, `Flex`, `Box`
- Use typography: `H1`, `H2`, `P`, `Muted`
- NO custom primitives replicating shadcn

**Violations to flag:**
- Custom button/input/card implementations
- Missing layout component usage
- Direct Tailwind for layouts (should use components)

### 8. Security Patterns
**Rules:**
- Every DAL function must check auth
- Use `getUser()` NEVER `getSession()`
- RLS policies must wrap `auth.uid()`: `(select auth.uid())`

**Violations to flag:**
- Missing auth checks
- Using `getSession()`
- Unwrapped `auth.uid()` in SQL/policies

## Output Format

Provide a structured report:

### ✅ Auto-Fixed (Already Applied)
- **File**: `path/to/file.ts:line`
- **Fixed**: What was changed
- **Commit**: Include in next commit

### ❌ Critical Violations (Must Fix Manually)
- **File**: `path/to/file.ts:line`
- **Issue**: Description
- **Fix**: Step-by-step instructions

### ⚠️ Warnings (Should Fix)
- **File**: `path/to/file.ts:line`
- **Issue**: Description
- **Suggestion**: Improvement

### 📊 Architecture Score
- Pattern Compliance: X/8 patterns followed
- Auto-Fixed: X violations
- Manual Fixes Needed: X violations
- Warnings: X issues
- Overall Grade: A/B/C/D/F

## Scope

Scan these directories:
- `features/` (all portals)
- `app/` (all pages)
- `components/` (**exclude `components/ui/`** - shadcn components)
- `lib/`

**Exclusions:**
- `components/ui/*` - shadcn/ui components (no size limits)
- `node_modules/`
- `.next/`
- Generated files (`database.types.ts`)

Focus on recent changes and high-traffic areas first.
