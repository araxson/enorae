# Marketing Portal Deep Analysis

MARKETING PORTAL DEEP ANALYSIS

You are performing a comprehensive audit of the Marketing Portal (public pages) in the Enorae salon booking platform.

## PHASE 1: GATHER BEST PRACTICES & CONTEXT

1. Use Context7 to fetch latest best practices:
   - Next.js 15 App Router patterns
   - React 19 Server Components
   - TypeScript 5.6 type safety
   - Supabase client-side and server-side patterns

2. Use Supabase MCP to understand database:
   - List all available public views (list_tables with schemas: ['public'])
   - Check what views are used in marketing portal
   - Verify public data access patterns

## PHASE 2: SYSTEMATIC LAYER ANALYSIS

Analyze marketing portal in this exact order:

### LAYER 1: PAGES (app/(marketing)/**/page.tsx)
- Find all page files
- Check line count (5-15 max per CLAUDE.md Rule 3)
- Verify no data fetching in pages
- Check proper async/await for params
- Verify only renders feature components

Output: docs/marketing-portal/01_PAGES_ANALYSIS.md

### LAYER 2: QUERIES (features/marketing/**/api/queries.ts)
- Find all query files
- Check 'import server-only' directive (CLAUDE.md Rule 4)
- Verify queries use Views not Tables (CLAUDE.md Rule 1)
- Check return types use Database['public']['Views'] (CLAUDE.md Rule 2)
- Find any 'any' types (CLAUDE.md Rule 11)
- Use Supabase MCP to verify views exist
- Note: Auth may be optional for public data

Output: docs/marketing-portal/02_QUERIES_ANALYSIS.md

### LAYER 3: MUTATIONS (features/marketing/**/api/mutations.ts)
- Find all mutation files (contact forms, etc.)
- Check 'use server' directive
- Check rate limiting for public forms
- Verify input validation
- Check error handling

Output: docs/marketing-portal/03_MUTATIONS_ANALYSIS.md

### LAYER 4: COMPONENTS (features/marketing/**/components/*.tsx)
- Check client vs server component separation
- Verify using shadcn/ui components (not custom primitives)
- Check using layout components (Stack, Grid, Flex, Box)
- Check using typography (H1, H2, P, Muted)
- Verify proper TypeScript prop types
- Check no 'any' types

Output: docs/marketing-portal/04_COMPONENTS_ANALYSIS.md

### LAYER 5: TYPE SAFETY (features/marketing/**/*.ts(x))
- Search for all 'any' type usage
- Search for Database['public']['Tables'] (should be Views)
- Check proper imports from @/lib/types/database.types
- Verify function return types annotated
- Check component prop types

Output: docs/marketing-portal/05_TYPES_ANALYSIS.md

### LAYER 6: VALIDATION (features/marketing/**/schema.ts)
- Find all Zod schema files
- Check form validation coverage
- Verify error messages user-friendly
- Check schema matches database types

Output: docs/marketing-portal/06_VALIDATION_ANALYSIS.md

### LAYER 7: SECURITY (features/marketing/**/api/*.ts)
- Verify rate limiting on public endpoints
- Check input sanitization
- Verify no sensitive data exposed
- Check CORS policies

Output: docs/marketing-portal/07_SECURITY_ANALYSIS.md

### LAYER 8: UX & SEO (features/marketing/**/*.tsx)
- Check loading states present
- Check error boundaries/states
- Check empty states
- Verify mobile responsive
- Check accessibility (ARIA labels, semantic HTML)
- Check SEO (meta tags, structured data)
- Check performance (image optimization, lazy loading)

Output: docs/marketing-portal/08_UX_SEO_ANALYSIS.md

## PHASE 3: CREATE SUMMARY

Create docs/marketing-portal/00_SUMMARY.md with:
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
# Marketing Portal - [LAYER] Analysis

**Date**: [DATE]
**Portal**: Marketing
**Layer**: [Pages/Queries/Mutations/Components/Types/Validation/Security/UX & SEO]
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

START WITH: Create docs/marketing-portal/ directory and begin Layer 1 analysis.
