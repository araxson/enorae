# Customer Portal Deep Analysis

CUSTOMER PORTAL DEEP ANALYSIS

You are performing a comprehensive audit of the Customer Portal in the Enorae salon booking platform.

## PHASE 1: GATHER BEST PRACTICES & CONTEXT

1. Use Context7 to fetch latest best practices:
   - Next.js 15 App Router patterns
   - React 19 Server Components
   - TypeScript 5.6 type safety
   - Supabase client-side and server-side patterns

2. Use Supabase MCP to understand database:
   - List all available public views (list_tables with schemas: ['public'])
   - Check what views are used in customer portal
   - Verify RLS policies exist
   - Get advisors for security and performance issues

## PHASE 2: SYSTEMATIC LAYER ANALYSIS

Analyze customer portal in this exact order:

### LAYER 1: PAGES (app/(customer)/**/page.tsx)
- Find all page files
- Check line count (5-15 max per CLAUDE.md Rule 3)
- Verify no data fetching in pages
- Check proper async/await for params
- Verify only renders feature components

Output: docs/customer-portal/01_PAGES_ANALYSIS.md

### LAYER 2: QUERIES (features/customer/**/api/queries.ts)
- Find all query files
- Check 'import server-only' directive (CLAUDE.md Rule 4)
- Verify auth checks in every function
- Check uses getUser() not getSession() (CLAUDE.md Rule 8)
- Verify queries use Views not Tables (CLAUDE.md Rule 1)
- Check return types use Database['public']['Views'] (CLAUDE.md Rule 2)
- Find any 'any' types (CLAUDE.md Rule 11)
- Use Supabase MCP to verify views exist

Output: docs/customer-portal/02_QUERIES_ANALYSIS.md

### LAYER 3: MUTATIONS (features/customer/**/api/mutations.ts)
- Find all mutation files
- Check 'use server' directive
- Verify auth checks present
- Check uses .schema('schema_name').from('table') for mutations
- Verify revalidatePath() after changes
- Check error handling

Output: docs/customer-portal/03_MUTATIONS_ANALYSIS.md

### LAYER 4: COMPONENTS (features/customer/**/components/*.tsx)
- Check client vs server component separation
- Verify using shadcn/ui components (not custom primitives)
- Check using layout components (Stack, Grid, Flex, Box)
- Check using typography (H1, H2, P, Muted)
- Verify proper TypeScript prop types
- Check no 'any' types

Output: docs/customer-portal/04_COMPONENTS_ANALYSIS.md

### LAYER 5: TYPE SAFETY (features/customer/**/*.ts(x))
- Search for all 'any' type usage
- Search for Database['public']['Tables'] (should be Views)
- Check proper imports from @/lib/types/database.types
- Verify function return types annotated
- Check component prop types

Output: docs/customer-portal/05_TYPES_ANALYSIS.md

### LAYER 6: VALIDATION (features/customer/**/schema.ts)
- Find all Zod schema files
- Check form validation coverage
- Verify error messages user-friendly
- Check schema matches database types

Output: docs/customer-portal/06_VALIDATION_ANALYSIS.md

### LAYER 7: SECURITY (features/customer/**/api/*.ts)
- Verify all DAL functions have auth
- Check RLS policies using Supabase MCP get_advisors
- Verify no SQL injection vectors
- Check input sanitization
- Use Supabase MCP to check security advisors

Output: docs/customer-portal/07_SECURITY_ANALYSIS.md

### LAYER 8: UX (features/customer/**/*.tsx)
- Check loading states present
- Check error boundaries/states
- Check empty states
- Verify mobile responsive
- Check accessibility (ARIA labels, semantic HTML)

Output: docs/customer-portal/08_UX_ANALYSIS.md

## PHASE 3: CREATE SUMMARY

Create docs/customer-portal/00_SUMMARY.md with:
- Total issues by severity
- Issues by layer
- Quick stats (files analyzed, issues found)
- Recommended fix order
- Estimated effort

## REQUIREMENTS FOR EACH .md FILE:
- Use the standard analysis template structure
- Include exact file paths with line numbers
- Show current code vs. required fix
- Number issues sequentially within each layer
- Include acceptance criteria for each issue
- Reference CLAUDE.md rules violated
- Cite Context7 best practices where applicable
- Include Supabase MCP findings

## TEMPLATE STRUCTURE FOR EACH LAYER FILE:

```markdown
# Customer Portal - [LAYER] Analysis

**Date**: [DATE]
**Portal**: Customer
**Layer**: [Pages/Queries/Mutations/Components/Types/Validation/Security/UX]
**Files Analyzed**: [COUNT]
**Issues Found**: [COUNT] (Critical: X, High: X, Medium: X, Low: X)

---

## Summary

[Brief overview of what was checked and overall health]

---

## Issues

### Critical Priority

#### Issue #1: [Clear Descriptive Title]
**Severity**: Critical
**File**: `path/to/file.ts:45-52`
**Rule Violation**: Rule X - [Description]

**Current Code**:
```typescript
// Show exact problematic code with line numbers
```

**Problem**:
[Clear description of the issue]

**Required Fix**:
```typescript
// Show correct code
```

**Steps to Fix**:
1. Step one
2. Step two
3. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

**Dependencies**: None / Requires Task #X

---

### High Priority

[Same structure]

---

### Medium Priority

[Same structure]

---

### Low Priority

[Same structure]

---

## Statistics

- Total Issues: X
- Files Affected: X
- Estimated Fix Time: X hours
- Breaking Changes: X

---

## Next Steps

1. Fix Critical issues first
2. Move to High priority
3. After all fixed, proceed to next layer

---

## Related Files

This analysis should be done after:
- [ ] [Previous dependencies]

This analysis blocks:
- [ ] [Next steps]
```

START WITH: Create docs/customer-portal/ directory and begin Layer 1 analysis.
