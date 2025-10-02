# Ultrathink - Comprehensive Code Quality & Security Audit

Perform a comprehensive, multi-layer analysis of the entire codebase to identify and fix all issues. Execute a systematic audit covering security, architecture, performance, type safety, and data integrity.

## Analysis Scope

Execute the following analysis passes in order:

### 1. Security Audit (CRITICAL)
- [ ] **Access Control**: Check all server actions for proper authorization
  - Verify ownership checks before data modification
  - Check for broken access control (CWE-639)
  - Validate user can only access their own resources

- [ ] **Input Validation**: Audit all user inputs
  - UUID format validation
  - SQL injection prevention
  - XSS prevention
  - Business logic validation (dates, limits, constraints)

- [ ] **Authentication**: Verify auth checks
  - All protected routes have middleware checks
  - All server actions check `auth.getUser()`
  - All DAL functions have auth guards

- [ ] **Error Handling**: Check exception handling
  - All async functions wrapped in try-catch
  - No sensitive data leaked in errors
  - User-friendly error messages

- [ ] **Environment Variables**: Validate secrets management
  - No hardcoded secrets or API keys
  - All env vars validated through schema
  - Proper use of NEXT_PUBLIC_ prefix

### 2. TypeScript Type Safety (HIGH PRIORITY)
- [ ] **Compilation**: Run `pnpm tsc --noEmit`
  - Fix all type errors
  - No use of `any` types
  - No use of `@ts-ignore` or `@ts-expect-error`

- [ ] **Database Types**: Verify type usage
  - Using `Database['public']['Views']` not `Tables`
  - Proper type imports from `@/lib/types/database.types`
  - No custom types for database entities

- [ ] **Strict Mode**: Ensure TypeScript strict mode enabled
  - Check tsconfig.json has `"strict": true`
  - All nullable types properly handled

### 3. Architecture Compliance (HIGH PRIORITY)
- [ ] **Ultra-Thin Pages**: Verify page architecture
  - All pages are 5-15 lines maximum
  - Pages only render feature components
  - No business logic in pages
  - No data fetching in pages
  - No complex layouts in pages

- [ ] **DAL Pattern**: Check Data Access Layer
  - All database queries in `dal/*.queries.ts` files
  - All DAL files have `'server-only'` directive
  - All DAL functions check auth first
  - Queries use public views, not direct schema access

- [ ] **Server Actions**: Validate server action pattern
  - All actions have `'use server'` directive
  - Proper validation with Zod schemas
  - Error handling with try-catch
  - Appropriate revalidation strategy

### 4. Frontend-Backend Data Alignment (HIGH PRIORITY)
- [ ] **Query Relationships**: Check database queries
  - Appointments show customer/staff names (not IDs)
  - All foreign keys properly joined
  - Use Supabase join syntax for related data
  - Example: `.select('*, customer:customer_id(id, full_name, email)')`

- [ ] **Component Display**: Verify UI components
  - Tables show names not UUIDs
  - Cards show relational data
  - Proper fallbacks for missing data
  - Null-safe access with `?.` operator

### 5. File Organization & Naming (MEDIUM PRIORITY)
- [ ] **Naming Conventions**: Check file names
  - All folders use kebab-case
  - All components use kebab-case.tsx
  - DAL files use `[feature].queries.ts`
  - Actions use `[feature].actions.ts`
  - No suffixes: -fixed, -v2, -new, -old, -temp

- [ ] **Import Paths**: Verify import structure
  - Using `@/` aliases for absolute imports
  - Proper import order (React, Next, external, internal)
  - No circular dependencies

### 6. Next.js Best Practices (MEDIUM PRIORITY)
- [ ] **Metadata**: Check all pages have metadata
  - Static metadata for simple pages
  - Dynamic `generateMetadata()` for dynamic routes
  - Private pages use `noIndex: true`
  - Public pages include SEO keywords

- [ ] **Loading & Error States**: Verify error boundaries
  - All route groups have `loading.tsx`
  - All route groups have `error.tsx`
  - Client components for error boundaries
  - Proper skeleton UI in loading states

- [ ] **Middleware**: Check route protection
  - All protected routes in middleware config
  - Role-based access control implemented
  - Public routes properly defined
  - Redirects to appropriate default routes

- [ ] **Caching & Revalidation**: Validate cache strategy
  - Proper use of `revalidatePath()` after mutations
  - Consider `revalidateTag()` for specific cache invalidation
  - Server components for data fetching
  - Client components only for interactivity

### 7. Component Patterns (MEDIUM PRIORITY)
- [ ] **UI Components**: Check shadcn/ui usage
  - Never create custom primitives (Button, Input, etc.)
  - Never run `npx shadcn add` (all installed)
  - Use layout components from `@/components/layout`
  - Use typography components (H1-H6, P, Lead, Muted)

- [ ] **Navigation**: Verify navigation
  - Use Next.js `Link` component (not `<a>`)
  - Proper `href` attributes
  - No `onClick` handlers on links

- [ ] **Forms**: Check form implementation
  - All inputs have proper labels with `htmlFor`
  - Server actions for form submission
  - Loading states during submission
  - Error messages displayed to user

### 8. Database Query Optimization (MEDIUM PRIORITY)
- [ ] **N+1 Queries**: Check for query inefficiencies
  - Use joins instead of multiple queries
  - Batch related data fetches
  - Proper use of `select()` with relationships

- [ ] **RLS Performance**: Verify Row Level Security
  - Wrap `auth.uid()` in `(select auth.uid())`
  - Add explicit filters to help RLS
  - Check indexes exist on RLS columns

- [ ] **Query Specificity**: Avoid `select('*')` when possible
  - Select only needed columns for large tables
  - Use `select('column1, column2')` for better performance

### 9. Accessibility (LOW PRIORITY)
- [ ] **ARIA Labels**: Check accessibility attributes
  - Buttons have descriptive labels
  - Form inputs properly labeled
  - Images have alt text

- [ ] **Semantic HTML**: Verify proper HTML structure
  - Headings in correct order (H1 → H2 → H3)
  - Proper use of semantic elements
  - Keyboard navigation support

### 10. Performance (LOW PRIORITY)
- [ ] **Bundle Size**: Check for optimization opportunities
  - Lazy load heavy components
  - Dynamic imports for large modules
  - Proper code splitting

- [ ] **Images**: Verify Next.js Image usage
  - Use `next/image` not `<img>`
  - Proper `width` and `height` attributes
  - Image optimization configured in next.config.ts

## Execution Instructions

For each pass:
1. **Create TodoWrite** with all checkboxes for that pass
2. **Execute checks** systematically
3. **Document findings** in a temporary list
4. **Fix all issues** found in that pass
5. **Verify fixes** with TypeScript compilation
6. **Mark todo complete** before moving to next pass

## Fix Priority Order

1. 🔴 **CRITICAL** - Security vulnerabilities
2. 🟠 **HIGH** - Type errors, broken access control
3. 🟡 **MEDIUM** - Architecture violations, missing metadata
4. 🟢 **LOW** - Accessibility, performance optimizations

## Deliverables

Upon completion, create/update these files:

1. **`docs/SECURITY_AUDIT_REPORT.md`**
   - All security findings and fixes
   - OWASP Top 10 compliance status
   - Vulnerability severity scores
   - Recommendations for future

2. **`docs/FRONTEND_BACKEND_ALIGNMENT.md`**
   - Database query analysis
   - Frontend display issues fixed
   - Performance improvements from joins
   - Before/after comparisons

3. **`docs/ARCHITECTURE_COMPLIANCE.md`** (if violations found)
   - Ultra-thin page violations fixed
   - DAL pattern enforcement
   - Server action improvements

## Success Criteria

✅ **0 TypeScript errors**
✅ **0 critical security vulnerabilities**
✅ **0 high-priority issues**
✅ **All pages follow ultra-thin pattern**
✅ **All queries properly joined**
✅ **All UI shows names not IDs**
✅ **Comprehensive documentation created**

## Final Verification

Run these commands to verify:

```bash
# TypeScript compilation
pnpm tsc --noEmit

# Linting
pnpm lint

# Build check
pnpm build
```

All must pass with 0 errors.

---

**Expected Outcome**: A production-ready codebase with no critical issues, full type safety, proper security controls, and optimal frontend-backend data flow.
