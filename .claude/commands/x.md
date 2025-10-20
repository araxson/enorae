⏺ # Comprehensive Project Structure Audit & Fix

  ## Objective
  Audit the entire Enorae codebase for structural issues, anti-patterns, duplications, and violations of best practices. Find and fix all issues systematically.

  ## Scope

  ### 1. Architecture Violations
  - [ ] **Feature Directory Structure** ([ARCH-H101](./docs/rules/01-rules-index.md#arch-h101))
    - Verify all features follow: `features/[portal]/[feature]/{api/,components/,types.ts,schema.ts,index.tsx}`
    - Find features missing required files (queries.ts, mutations.ts, index.tsx)
    - Find features with incorrect nesting or extra layers
    - Flag features using horizontal structure (by file type instead of domain)

  - [ ] **Page Complexity** ([ARCH-P002](./docs/rules/01-rules-index.md#arch-p002))
    - Find all pages > 15 lines (excluding imports/exports)
    - Find pages with business logic (should only render feature components)
    - Find pages with direct database calls (should be in features/*/api/)
    - Find pages with inline components (should be in features/*/components/)

  - [ ] **Server Directives** ([ARCH-P001](./docs/rules/01-rules-index.md#arch-p001))
    - Verify ALL `queries.ts` have `import 'server-only'` at top
    - Verify ALL `mutations.ts` have `'use server'` directive
    - Find server code without proper directives
    - Find client code trying to import server-only modules

  ### 2. Code Duplication & Redundancy
  - [ ] **Duplicate Components**
    - Find components with same/similar names in different features
    - Find components with identical/near-identical code (>80% similarity)
    - Find wrapper components that just pass props (unnecessary abstraction)
    - Find `index.ts` files that just re-export one thing

  - [ ] **Duplicate Logic**
    - Find duplicate database queries across features
    - Find duplicate validation schemas (Zod)
    - Find duplicate utility functions
    - Find duplicate type definitions
    - Find duplicate constants/enums

  - [ ] **Duplicate Styles**
    - Find duplicate className patterns (extract to shared component)
    - Find inline styles that should use Tailwind classes
    - Find custom CSS that duplicates existing shadcn/ui components

  ### 3. Misplaced Files
  - [ ] **Components in Wrong Location**
    - Find shared components in feature folders (should be in `components/shared/`)
    - Find feature-specific components in `components/` (should be in `features/*/components/`)
    - Find portal-specific components in wrong portal folder
    - Find UI primitives outside `components/ui/` (should never create these - use shadcn/ui)

  - [ ] **API Files in Wrong Location**
    - Find database queries in component files (should be in `api/queries.ts`)
    - Find mutations in component files (should be in `api/mutations.ts`)
    - Find API calls in pages (should be in features)
    - Find business logic in route handlers (should be in features/*/api/)

  - [ ] **Types in Wrong Location**
    - Find types scattered across component files (consolidate to `types.ts`)
    - Find shared types in feature folders (should be in `lib/types/` or `types/`)
    - Find database types manually defined (should use generated types from `lib/supabase/database.types.ts`)

  - [ ] **Utils in Wrong Location**
    - Find utility functions in component files (should be in `lib/utils/` or feature `utils.ts`)
    - Find business logic in `lib/utils/` (should be in features)
    - Find duplicate utils across features (consolidate to `lib/utils/`)

  ### 4. Naming Violations
  - [ ] **File Naming**
    - Find files not using kebab-case: `UserProfile.tsx` → `user-profile.tsx`
    - Find inconsistent suffixes: `user-profile.types.ts` → `types.ts`
    - Find abbreviated names: `usr-prof.tsx` → `user-profile.tsx`
    - Find vague names: `data.ts`, `helpers.ts`, `utils.ts` (be specific)

  - [ ] **Component Naming**
    - Find components not using PascalCase
    - Find components with generic names: `Card`, `List`, `Item` (add context)
    - Find components with redundant suffixes: `UserCardComponent` → `UserCard`

  - [ ] **Function Naming**
    - Find functions not using camelCase
    - Find unclear function names: `get()`, `handle()`, `doThing()`
    - Find inconsistent naming: `getUser` vs `fetchUser` vs `retrieveUser` (pick one pattern)

  ### 5. Database Anti-Patterns
  - [ ] **Query Issues** ([DB-P001](./docs/rules/01-rules-index.md#db-p001))
    - Find queries selecting from schema tables (should use public views)
    - Find queries without auth checks ([DB-P002](./docs/rules/01-rules-index.md#db-p002))
    - Find queries with `SELECT *` on large tables (specify columns)
    - Find N+1 query patterns (batch with joins)

  - [ ] **Type Issues** ([TS-M302](./docs/rules/01-rules-index.md#ts-m302))
    - Find manual type definitions duplicating database types
    - Find queries not using `Database['public']['Views']` types
    - Find mutations not using `Database['public']['Tables']` types
    - Find `any` types from database operations

  - [ ] **Mutation Issues**
    - Find mutations without Zod validation ([DB-M302](./docs/rules/01-rules-index.md#db-m302))
    - Find mutations without `revalidatePath` ([DB-H103](./docs/rules/01-rules-index.md#db-h103))
    - Find mutations without error handling
    - Find mutations without auth checks

  ### 6. UI Anti-Patterns
  - [ ] **Typography Violations** ([UI-P004](./docs/rules/01-rules-index.md#ui-p004))
    - Find imports from `@/components/ui/typography` (H1, P, Muted, etc.)
    - Should use: shadcn component slots (CardTitle, CardDescription, Badge) or semantic HTML + design tokens

  - [ ] **Component Violations** ([UI-P003](./docs/rules/01-rules-index.md#ui-p003))
    - Find custom UI components (buttons, inputs, dialogs, etc.)
    - Find usage of non-shadcn/ui libraries (Material-UI, Ant Design, etc.)
    - Find reimplemented shadcn/ui components

  - [ ] **Color Violations** ([UI-H102](./docs/rules/01-rules-index.md#ui-h102))
    - Find arbitrary colors: `bg-blue-500`, `text-gray-600`, `border-slate-200`
    - Find hex/rgb colors: `bg-[#fff]`, `text-[rgb(0,0,0)]`
    - Should use semantic tokens: `bg-background`, `text-foreground`, `bg-muted`, etc.

  - [ ] **Composition Violations** ([UI-P002](./docs/rules/01-rules-index.md#ui-p002))
    - Find incomplete Dialog compositions (missing DialogHeader, DialogTitle, DialogDescription)
    - Find incomplete Card compositions (missing CardHeader, CardTitle)
    - Find incomplete Form compositions (missing Field, Label)

  ### 7. Security Issues
  - [ ] **Auth Violations** ([SEC-P001](./docs/rules/01-rules-index.md#sec-p001))
    - Find `getSession()` usage (should use `getUser()`)
    - Find missing auth checks in queries/mutations
    - Find client-side auth checks (should be server-side)
    - Find exposed sensitive data (passwords, tokens, API keys)

  - [ ] **RLS Issues** ([SEC-P003](./docs/rules/01-rules-index.md#sec-p003))
    - Find RLS policies not wrapping `auth.uid()` in SELECT: `(select auth.uid())`
    - Find missing tenant isolation in multi-tenant queries
    - Find bypassed RLS with service role client

  ### 8. Performance Issues
  - [ ] **Missing Indexes** ([PERF-H101](./docs/rules/quality/performance.md))
    - Find foreign keys without indexes
    - Find frequently filtered columns without indexes
    - Find frequently joined columns without indexes

  - [ ] **Inefficient Queries**
    - Find queries in loops (batch with Promise.all or joins)
    - Find queries selecting unnecessary data
    - Find missing pagination on large datasets
    - Find sequential async operations (use Promise.all)

  ### 9. TypeScript Issues
  - [ ] **Type Safety** ([TS-P001](./docs/rules/01-rules-index.md#ts-p001))
    - Find all `any` types (should be properly typed)
    - Find all `@ts-ignore` / `@ts-expect-error` (fix root cause)
    - Find missing return types on functions
    - Find implicit any from missing type imports

  - [ ] **Import Issues**
    - Find inconsistent import paths (use `@/` alias)
    - Find unused imports
    - Find circular dependencies
    - Find barrel export issues (re-export loops)

  ### 10. Testing Gaps
  - [ ] **Missing Tests**
    - Find critical mutations without tests
    - Find complex business logic without tests
    - Find utilities without tests
    - Find RLS policies without tests

  ### 11. Documentation Issues
  - [ ] **Missing Documentation**
    - Find complex functions without JSDoc
    - Find features without README
    - Find API endpoints without descriptions
    - Find shared components without usage examples

  ### 12. Accessibility Issues
  - [ ] **A11y Violations** ([quality/accessibility.md](./docs/rules/quality/accessibility.md))
    - Find images without alt text
    - Find buttons without accessible names
    - Find forms without labels
    - Find missing ARIA attributes on interactive elements
    - Find insufficient color contrast

  ---

  ## Execution Plan

  1. **Analysis Phase** (Run all checks above)
     - Generate comprehensive report grouped by:
       - Critical (breaks functionality/security)
       - High (violates core rules, hard to maintain)
       - Medium (violates best practices)
       - Low (minor improvements)

  2. **Prioritization**
     - Fix Critical issues first (security, broken functionality)
     - Then High issues (architectural violations, major duplication)
     - Then Medium issues (naming, minor duplication)
     - Finally Low issues (documentation, minor optimizations)

  3. **Automated Fixes** (where possible)
     - Rename files to kebab-case
     - Add missing server directives
     - Remove typography imports; use shadcn slots or design tokens
     - Replace arbitrary colors with semantic tokens
     - Remove unused imports

  4. **Manual Fixes** (where automation isn't safe)
     - Refactor misplaced components
     - Consolidate duplicate logic
     - Restructure features not following vertical slice
     - Add missing auth checks
     - Fix complex type issues

  5. **Validation**
     - Run `npm run typecheck` (must pass)
     - Run `npm run build` (must succeed)
     - Run tests (must pass)
     - Visual regression testing (UI should look identical)

  ---

  ## Output Format

  For each violation found, provide:

  [SEVERITY] [RULE-CODE] File: path/to/file.ts:line

  Issue: <what's wrong>
  Current:
  Expected:
  Fix: <automated | manual | needs-review>
  Impact:

  **Example:**
  [CRITICAL] [SEC-P001] features/user/api/queries.ts:15

  Issue: Using getSession() instead of getUser()
  Current: const { data: session } = await supabase.auth.getSession()
  Expected: const { data: { user } } = await supabase.auth.getUser()
  Fix: automated
  Impact: Session can be spoofed, user object cannot. Security vulnerability.

  ---

  ## Success Criteria

  - [ ] Zero CRITICAL violations
  - [ ] < 10 HIGH violations
  - [ ] All features follow vertical slice architecture
  - [ ] All pages are 5-15 lines
  - [ ] All queries/mutations have proper directives
  - [ ] No duplicate code (DRY principle)
  - [ ] All files properly named (kebab-case)
  - [ ] All UI uses shadcn/ui component slots + semantic design tokens
  - [ ] All database operations have auth checks
  - [ ] TypeScript strict mode passes
  - [ ] Build succeeds
  - [ ] Tests pass

  ---

  ## Tools to Use

  1. **architecture-analyzer** - Check feature structure, page complexity, directives
  2. **database-analyzer** - Check query patterns, RLS, auth checks
  3. **ui-analyzer** - Check Typography, shadcn/ui usage, color tokens
  4. **typescript-analyzer** - Check type safety, any usage
  5. **security-analyzer** - Check auth patterns, RLS, exposed data
  6. **performance-analyzer** - Check queries, indexes, batching
  7. **accessibility-analyzer** - Check a11y violations
  8. **Grep/Glob** - Find duplicates, naming violations, specific patterns