# Analyze Project Structure Organization

Perform a deep structural analysis of the codebase to identify and fix organizational issues.

## Phase 0: Gather Latest Best Practices

**IMPORTANT**: Before analyzing the project structure, use Context7 MCP to fetch the latest documentation and best practices for:

- **Next.js 15**: Latest patterns, App Router conventions, Server Components, Server Actions
- **Supabase**: Database patterns, RLS policies, auth patterns, real-time features
- **shadcn/ui**: Component usage, composition patterns, customization
- **Tailwind CSS 4**: CSS-first configuration, design tokens, best practices
- **TypeScript 5.6**: Latest type patterns, strict mode, utility types
- **React 19**: Latest hooks, concurrent features, best practices

Use the Context7 tools to ensure analysis is based on current best practices:
```typescript
// Example: Fetch Next.js 15 documentation
mcp__context7__resolve-library-id({ libraryName: "next.js" })
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "app router server components",
  tokens: 5000
})
```

**Database Schema Analysis**: Use Supabase MCP tools (READ-ONLY) to understand the database structure:
```typescript
// List available views and tables
mcp__supabase__list_tables({ schemas: ["public"] })

// Explore database structure
mcp__supabase__execute_sql({
  query: "SELECT * FROM information_schema.views WHERE table_schema = 'public' LIMIT 10"
})
```

**IMPORTANT**: Only use READ-ONLY operations (list_tables, execute_sql with SELECT queries). Never use apply_migration or mutations during analysis.

This ensures the structural analysis aligns with the latest framework recommendations and identifies patterns that may be outdated or could be improved using newer features.

## Phase 0.5: DATABASE SCHEMA ALIGNMENT CONTEXT

**CRITICAL**: While analyzing structure, keep database schema alignment in mind:

### Key Principles:

1. **Database is source of truth** - All code must match actual Supabase schema
2. **Views for reads** - Never query schema tables directly, use public views
3. **Schema tables for writes** - Use `.schema('schema_name').from('table')` for mutations
4. **No assumed properties** - Only use columns that actually exist in database
5. **Transform in TypeScript** - Computed fields go in application layer, not database

### During Structure Analysis:

Identify structural issues that may hide database alignment problems:
- Features in wrong portals may have incorrect data access patterns
- Misaligned queries.ts files may be accessing non-existent views
- Orphaned files might have outdated database queries
- Duplicate features across portals likely have conflicting database assumptions

### Document Database Issues:

When you find structural problems, check if they're related to:
- Property access errors (missing columns in views)
- RPC function calls that don't exist
- Type mismatches between code expectations and database schema
- Query selections that don't match view structure

These structural issues often mask or are caused by database misalignments. Report them together.

---

## Phase 1: Deep Analysis

**CRITICAL**: Perform a comprehensive review of the **ENTIRE PROJECT STRUCTURE**. Don't limit analysis to known problem areas - examine every directory, file, and organizational pattern across the full codebase to identify all structural issues, inconsistencies, and opportunities for improvement.

Read and analyze `docs/project-tree.md` in sections (file is large, read strategically):

### 1.1 Portal Organization Analysis
Check each portal directory structure:
- `features/customer/` - Customer-facing features
- `features/business/` - Business owner features
- `features/staff/` - Staff member features
- `features/admin/` - Platform admin features
- `features/marketing/` - Public marketing features
- `features/shared/` - Cross-portal shared features

**Identify:**
- ✗ Features in wrong portal directories
- ✗ Misaligned feature purposes (e.g., customer feature in business/)
- ✗ Duplicate features across portals
- ✗ Features that should be in `shared/`

### 1.2 Feature Structure Compliance
For each feature in `features/[portal]/[feature]/`:

**Required Structure:**
```
[feature]/
├── index.tsx           # Main component export
├── components/         # UI components
├── api/
│   ├── queries.ts     # SELECT operations
│   └── mutations.ts   # INSERT/UPDATE/DELETE operations
├── types.ts           # Feature-specific types (optional)
└── schema.ts          # Zod validation (optional)
```

**Identify:**
- ✗ Missing `index.tsx` entry points
- ✗ Missing `api/` directories
- ✗ Missing `components/` directories
- ✗ Features with business logic not in api/
- ✗ Incorrect file locations (queries not in api/)
- ✗ Non-standard folder names (e.g., `utils/`, `helpers/`, `lib/`)

### 1.3 File Organization Issues

**Identify:**
- ✗ Files with forbidden suffixes: `-v2`, `-new`, `-old`, `-temp`, `-test`, `-backup`, `-fixed`, `-enhanced`
- ✗ Files with prefix patterns: `new-`, `old-`, `temp-`, `test-`
- ✗ Duplicate files (same functionality, different names)
- ✗ Files in wrong directories (e.g., components in root, queries outside api/)
- ✗ Orphaned files (no imports/exports)

### 1.4 Naming Consistency

**Identify:**
- ✗ camelCase folders (should be kebab-case)
- ✗ PascalCase files (should be kebab-case)
- ✗ Inconsistent naming patterns within features
- ✗ Generic names that don't reflect purpose (e.g., `utils.ts`, `helpers.ts`, `index2.tsx`)

### 1.5 Component Organization

**Identify:**
- ✗ Shared components in portal-specific directories
- ✗ Portal-specific components in shared directories
- ✗ UI primitives that should use shadcn/ui
- ✗ Layout components not using layout system
- ✗ Components with business logic (should be in api/)

### 1.6 API Layer Organization

**Identify:**
- ✗ Query functions not in `queries.ts`
- ✗ Mutation functions not in `mutations.ts`
- ✗ Mixed queries and mutations in same file
- ✗ Client-side data fetching (should be Server Components)
- ✗ Missing `'server-only'` directive in queries.ts
- ✗ Missing `'use server'` directive in mutations.ts

### 1.7 Type System Organization

**Identify:**
- ✗ Inline type definitions (should be in types.ts)
- ✗ `any` types anywhere
- ✗ Types using `Database['public']['Tables']` (should use `Views`)
- ✗ Duplicate type definitions across features
- ✗ Missing type exports

### 1.8 App Directory Structure

Check `app/` route organization:

**Identify:**
- ✗ Business logic in page.tsx files (should be <15 lines)
- ✗ Data fetching in pages (should be in feature components)
- ✗ Missing route groups: `(customer)`, `(business)`, `(staff)`, `(admin)`, `(marketing)`
- ✗ Routes in wrong portal groups
- ✗ Duplicate routes across portals

## Phase 2: Generate Report

Create a detailed report in `docs/structure-analysis-report.md`:

### Report Structure:
```markdown
# Project Structure Analysis Report
Date: [YYYY-MM-DD]

## Executive Summary
- Total Issues Found: [number]
- Critical Issues: [number]
- High Priority: [number]
- Medium Priority: [number]
- Low Priority: [number]

## 🔴 CRITICAL ISSUES (Fix Immediately)

### Portal Organization
- [ ] [Feature Name] in wrong portal: `features/[wrong]/[feature]` → should be `features/[correct]/[feature]`
  - Reason: [why it belongs in different portal]
  - Impact: [user confusion, incorrect access control, etc.]

### Feature Structure Violations
- [ ] Missing `index.tsx`: `features/[portal]/[feature]/`
- [ ] Missing `api/` directory: `features/[portal]/[feature]/`

### File Naming
- [ ] Forbidden suffix: `path/to/file-v2.tsx` → `path/to/file.tsx`

## 🟠 HIGH PRIORITY ISSUES

### Component Organization
- [ ] Shared component in portal: `features/[portal]/components/[name]` → `components/shared/[name]`

### API Layer
- [ ] Missing directive: `features/[portal]/[feature]/api/queries.ts` needs `'server-only'`

## 🟡 MEDIUM PRIORITY ISSUES

### Naming Consistency
- [ ] PascalCase file: `path/to/MyFile.tsx` → `path/to/my-file.tsx`

### Type Organization
- [ ] Inline types: Extract to `features/[portal]/[feature]/types.ts`

## 🟢 LOW PRIORITY IMPROVEMENTS

### Code Organization
- [ ] Generic name: `utils.ts` → descriptive name based on purpose

## Recommended File Moves

| Current Path | New Path | Reason |
|-------------|----------|--------|
| [old] | [new] | [reason] |

## Recommended Deletions

| File | Reason |
|------|--------|
| [path] | [duplicate/unused/temp] |

## Recommended Renames

| Old Name | New Name | Reason |
|----------|----------|--------|
| [old] | [new] | [naming convention] |
```

## Phase 3: Fix Issues (Optional)

If user confirms, fix issues systematically:

### Priority Order:
1. 🔴 Critical: Portal misalignment, missing core files
2. 🟠 High: Component organization, API directives
3. 🟡 Medium: Naming consistency, type organization
4. 🟢 Low: Code organization improvements

### For Each Fix:
1. Make the change (move/rename/create file)
2. Update all imports
3. Run `npm run typecheck`
4. Mark as complete in report: `- [x]`
5. Report: `✓ Fixed: [description]`

## Rules

- ✅ Analyze thoroughly before suggesting fixes
- ✅ Group related issues together
- ✅ Provide clear reasoning for each issue
- ✅ Prioritize by impact on maintainability
- ✅ Consider existing patterns in codebase
- ❌ Don't make assumptions without evidence
- ❌ Don't suggest changes that break conventions
- ❌ Don't fix without user confirmation

## Output Format

After analysis:
```
📊 Structure Analysis Complete

Issues Found:
- 🔴 Critical: [N] issues
- 🟠 High: [N] issues
- 🟡 Medium: [N] issues
- 🟢 Low: [N] issues

📄 Report saved to: docs/structure-analysis-report.md

Next Steps:
1. Review the report
2. Confirm which priority levels to fix
3. I'll systematically fix and verify each change
```

## Advanced Analysis (Deep Dive)

If requested, perform additional checks:

### Cross-References
- Find all files importing from a feature
- Identify circular dependencies
- Map feature relationships

### Consistency Patterns
- Compare similar features across portals
- Identify pattern deviations
- Suggest standardization opportunities

### Architectural Alignment
- Verify adherence to CLAUDE.md guidelines
- Check database query patterns (views vs tables)
- Validate auth patterns in DAL
- Review Server Component vs Client Component usage
