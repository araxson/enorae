# Admin Portal Deep Analysis

ADMIN PORTAL DEEP ANALYSIS
**Key Principle:** The database is the source of truth. All code must match the database, not the other way around.
You are performing a comprehensive audit of the Admin Portal in the Enorae salon booking platform.

## PHASE 1: GATHER BEST PRACTICES & CONTEXT

1. Use Context7 to fetch latest best practices:
   - Next.js 15 App Router patterns
   - React 19 Server Components
   - TypeScript 5.6 type safety
   - Supabase client-side and server-side patterns

2. Use Supabase MCP to understand database:
   - List all available public views (list_tables with schemas: ['public'])
   - Check what views are used in admin portal
   - Verify RLS policies exist
   - Get advisors for security and performance issues

## PHASE 1.5: DATABASE SCHEMA ALIGNMENT

**CRITICAL**: The database is the source of truth. All code must match the actual Supabase schema.

### Step 1: Fetch Actual Database Schema

Use Supabase MCP to read the ACTUAL database structure:

```bash
# List all tables in all schemas
mcp__supabase__list_tables(project_id: "nwmcpfioxerzodvbjigw", schemas: ["public", "catalog", "scheduling", "inventory", "identity", "communication", "analytics", "engagement", "organisation"])

# Get generated TypeScript types
mcp__supabase__generate_typescript_types(project_id: "nwmcpfioxerzodvbjigw")
```

### Step 2: Document Actual Schema

For each schema and table/view, document:
- **Actual columns** (from Supabase)
- **Column types** (actual, not assumed)
- **What code expects** (from TypeScript errors)
- **Gap analysis** (what's missing/wrong)

### Step 3: Find All Code Mismatches in Admin Portal

Scan admin codebase for:
- Properties accessed that don't exist in database
- Database columns not used in code
- Type mismatches
- RPC function calls with wrong parameters
- Query selections that don't match view structure

### Key Rules for Database Alignment:

**Rule 1: Database View Properties Are Sacred**
```ts
// ✗ WRONG - Assuming property exists
const amenities = salon.amenities // Property doesn't exist!

// ✓ CORRECT - Use what database actually provides
const amenities = salon.special_features || salon.tags // Use real columns
```

**Rule 2: Only Select Available Columns**
```ts
// ✗ WRONG - Selecting columns that don't exist
.select('amenities, specialties, staff_count')

// ✓ CORRECT - Select only what view actually has
.select('*') // or explicitly list real columns from schema
```

**Rule 3: Transform at Application Level**
```ts
// ✓ CORRECT - Add computed fields in TypeScript, not database
const extendedSalon = {
  ...dbSalon,
  services_count: calculateServicesCount(dbSalon.id),
  specialties: parseSpecialtiesFromDescription(dbSalon.description),
}
```

**Rule 4: RPC Functions Must Exist**
```ts
// ✗ WRONG - Calling RPC that doesn't exist
.rpc('validate_coupon', { p_code, p_salon_id })

// ✓ CORRECT - Only call RPC functions that exist in database
// First verify RPC exists, then call with correct parameters
```

**Rule 5: Match Query Return Types Exactly**
```ts
// ✗ WRONG - Assuming more fields than query returns
interface Salon {
  id: string
  amenities: string[] // Doesn't come from query!
}

// ✓ CORRECT - Match actual query response
type Salon = Database['public']['Views']['salons']['Row']
// With optional extended fields only if they're computed
type ExtendedSalon = Salon & {
  computed_amenities?: string[]
}
```

### Document in Phase 2 Findings:

As you analyze each layer, document database alignment issues with a dedicated section:
- Which properties are assumed but don't exist
- Type mismatches between code and database
- Missing RPC functions
- Column name mismatches
- These become HIGH priority fixes

---

## PHASE 2: SYSTEMATIC LAYER ANALYSIS

Analyze admin portal in this exact order:

### LAYER 1: PAGES (app/(admin)/**/page.tsx)
- Find all page files
- Check line count (5-15 max per CLAUDE.md Rule 3)
- Verify no data fetching in pages
- Check proper async/await for params
- Verify only renders feature components

Output: docs/admin-portal/01_PAGES_ANALYSIS.md

### LAYER 2: QUERIES (features/admin/**/api/queries.ts)
- Find all query files
- Check 'import server-only' directive 
- Verify auth checks in every function
- Check uses getUser() not getSession() 
- Verify queries use Views not Tables 
- Check return types use Database['public']['Views']
- Find any 'any' types 
- Use Supabase MCP to verify views exist

Output: docs/admin-portal/02_QUERIES_ANALYSIS.md

### LAYER 3: MUTATIONS (features/admin/**/api/mutations.ts)
- Find all mutation files
- Check 'use server' directive
- Verify auth checks present
- Check uses .schema('schema_name').from('table') for mutations
- Verify revalidatePath() after changes
- Check error handling

Output: docs/admin-portal/03_MUTATIONS_ANALYSIS.md

### LAYER 4: COMPONENTS (features/admin/**/components/*.tsx)
- Check client vs server component separation
- Verify using shadcn/ui components (not custom primitives)
- Check using layout components (Stack, Grid, Flex, Box)
- Check using typography (H1, H2, P, Muted)
- Verify proper TypeScript prop types
- Check no 'any' types

Output: docs/admin-portal/04_COMPONENTS_ANALYSIS.md

### LAYER 5: TYPE SAFETY (features/admin/**/*.ts(x))
- Search for all 'any' type usage
- Search for Database['public']['Tables'] (should be Views)
- Check proper imports from @/lib/types/database.types
- Verify function return types annotated
- Check component prop types

Output: docs/admin-portal/05_TYPES_ANALYSIS.md

### LAYER 6: VALIDATION (features/admin/**/schema.ts)
- Find all Zod schema files
- Check form validation coverage
- Verify error messages user-friendly
- Check schema matches database types

Output: docs/admin-portal/06_VALIDATION_ANALYSIS.md

### LAYER 7: SECURITY (features/admin/**/api/*.ts)
- Verify all DAL functions have auth
- Check RLS policies using Supabase MCP get_advisors
- Verify no SQL injection vectors
- Check input sanitization
- Use Supabase MCP to check security advisors
- EXTRA: Verify admin-only access controls


## PHASE 3: CREATE SUMMARY

Create docs/admin-portal/00_SUMMARY.md with:
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
# Admin Portal - [LAYER] Analysis

**Date**: [DATE]
**Portal**: Admin
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

START WITH: Create docs/admin-portal/ directory and begin Layer 1 analysis.
