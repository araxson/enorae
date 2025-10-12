# Portal Analysis Commands

This directory contains slash commands for performing deep analysis of each portal in the Enorae platform.

## Available Commands

### Portal Analysis Commands

Run these commands to perform comprehensive audits of each portal:

- `/analyze-customer-portal` - Analyze customer portal (features/customer/ & app/(customer)/)
- `/analyze-business-portal` - Analyze business portal (features/business/ & app/(business)/)
- `/analyze-staff-portal` - Analyze staff portal (features/staff/ & app/(staff)/)
- `/analyze-admin-portal` - Analyze admin portal (features/admin/ & app/(admin)/)
- `/analyze-marketing-portal` - Analyze marketing portal (features/marketing/ & app/(marketing)/)

### Fix Commands

After analyzing a portal or structure, fix issues systematically:

**Portal-Specific Fixes:**
- `/fix-admin-portal` - Fix Admin Portal issues by layer and severity
- `/fix-business-portal` - Fix Business Portal issues by layer and severity
- `/fix-customer-portal` - Fix Customer Portal issues by layer and severity
- `/fix-staff-portal` - Fix Staff Portal issues by layer and severity
- `/fix-marketing-portal` - Fix Marketing Portal issues by layer and severity

**Structure Fixes:**
- `/fix-structure-issues` - Fix structural issues from analysis report (file placement, nesting, missing files)

### Project-Wide Commands

Analyze and fix codebase-wide issues:

- `/analyze-structure` - Deep analysis of project structure organization (file placement, naming, folder hierarchy)
- `/fix-structure-issues` - Fix structural issues from analysis report (reusable, priority-based)
- `/fix-inconsistencies` - Fix naming, structure, anti-patterns, and file size issues (legacy)

### Summary Command

After all portal analyses are complete:

- `/generate-project-summary` - Generate project-wide summary from all portal analyses

## Usage

### Step 0: Analyze Project Structure (Optional)

Before analyzing individual portals, check overall project organization:

```bash
# In Claude Code chat
/analyze-structure
```

This command:
- Analyzes `docs/project-tree.md` for structural issues
- Identifies misplaced files/folders across portals
- Finds naming inconsistencies
- Checks feature structure compliance
- Detects missing core files (index.tsx, api/, components/)
- Reports files in wrong directories
- Creates detailed report in `docs/structure-analysis-report.md`

Run this if you suspect:
- Features are in wrong portal directories
- File/folder organization is inconsistent
- Project structure deviates from CLAUDE.md patterns

### Step 1: Analyze Each Portal

Run each portal analysis command in sequence:

```bash
# In Claude Code chat
/analyze-customer-portal
```

Wait for completion, then run the next:

```bash
/analyze-business-portal
```

Continue with:
- `/analyze-staff-portal`
- `/analyze-admin-portal`
- `/analyze-marketing-portal`

### Step 2: Fix Issues (Optional)

#### Option A: Fix Structure Issues First (Recommended if structure analysis was run)

After running `/analyze-structure`, fix structural issues:

```bash
/fix-structure-issues
```

The command will:
1. Read `docs/structure-analysis-report.md`
2. Present issues by priority (Critical/High/Medium/Low)
3. Ask which priority level to fix
4. Systematically fix each issue
5. Verify changes with TypeScript
6. Generate fix report

**Usage examples:**
```bash
/fix-structure-issues                    # Interactive mode
/fix-structure-issues --priority critical  # Fix only critical issues
/fix-structure-issues --dry-run           # Preview changes without applying
/fix-structure-issues --priority all      # Fix all priorities
```

**Features:**
- ✅ Reads any structure analysis report
- ✅ Priority-based fixing (critical → high → medium → low)
- ✅ Creates missing files/directories
- ✅ Moves features to correct locations
- ✅ Updates imports automatically
- ✅ Refactors large files
- ✅ Dry-run mode for preview
- ✅ Rollback support
- ✅ Generates detailed fix reports

#### Option B: Fix Portal-Specific Issues

After analyzing a portal, fix issues systematically using the portal-specific fix command:

```bash
/fix-admin-portal
```

The command will ask you:
1. Which layer to fix (1-8 or "all")
2. Which severity to fix (critical/high/medium/low/all)

Example:
```
You: /fix-admin-portal
Claude: Which Admin Portal issues should I fix?
        Layer (1-8 or "all"):
        Severity (critical/high/medium/low/all):
You: layer 3, critical
Claude: [Reads analysis, creates fix plan, fixes issues one by one]
```

Use the corresponding fix command for each portal:
- `/fix-admin-portal` after `/analyze-admin-portal`
- `/fix-business-portal` after `/analyze-business-portal`
- `/fix-customer-portal` after `/analyze-customer-portal`
- `/fix-staff-portal` after `/analyze-staff-portal`
- `/fix-marketing-portal` after `/analyze-marketing-portal`

### Step 3: Generate Project Summary

After all portal analyses are complete:

```bash
/generate-project-summary
```

## Output Structure

Each portal analysis creates:

```
docs/
├── customer-portal/
│   ├── 00_SUMMARY.md
│   ├── 01_PAGES_ANALYSIS.md
│   ├── 02_QUERIES_ANALYSIS.md
│   ├── 03_MUTATIONS_ANALYSIS.md
│   ├── 04_COMPONENTS_ANALYSIS.md
│   ├── 05_TYPES_ANALYSIS.md
│   ├── 06_VALIDATION_ANALYSIS.md
│   ├── 07_SECURITY_ANALYSIS.md
│   └── 08_UX_ANALYSIS.md
├── business-portal/
│   └── ... (same structure)
├── staff-portal/
│   └── ... (same structure)
├── admin-portal/
│   └── ... (same structure)
├── marketing-portal/
│   └── ... (same structure)
└── 00_PROJECT_SUMMARY.md
```

## What Each Analysis Checks

### Project Structure Analysis (`/analyze-structure`)

Checks organization and file placement across the entire project:

- **Portal Organization**: Features in correct portal directories
- **Feature Structure**: Compliance with standard structure (index.tsx, api/, components/)
- **File Organization**: No forbidden suffixes (-v2, -new, -temp, etc.)
- **Naming Consistency**: kebab-case for files/folders, no PascalCase
- **Component Organization**: Shared vs portal-specific placement
- **API Layer**: queries.ts and mutations.ts in correct locations
- **Type System**: Proper organization of type files
- **App Routes**: Correct route group placement

Creates: `docs/structure-analysis-report.md`

### Portal-Specific Analysis

Each portal analysis (customer/business/staff/admin/marketing) checks 8 layers:

#### Layer 1: Pages
- Line count (5-15 max per CLAUDE.md Rule 3)
- No data fetching in pages
- Proper async/await for params
- Only renders feature components

### Layer 2: Queries
- `import 'server-only'` directive (Rule 4)
- Auth checks in every function (Rule 8)
- Uses getUser() not getSession()
- Queries from Views not Tables (Rule 1)
- Return types use Views (Rule 2)
- No 'any' types (Rule 11)

### Layer 3: Mutations
- `'use server'` directive
- Auth checks present
- Uses schema.table for mutations
- Calls revalidatePath()
- Error handling

### Layer 4: Components
- Client vs server separation
- Uses shadcn/ui components
- Uses layout components (Stack, Grid, Flex, Box)
- Uses typography (H1, H2, P, Muted)
- Proper TypeScript prop types

### Layer 5: Type Safety
- No 'any' types
- Uses View types not Table types
- Proper imports from database.types
- Function return types annotated
- Component prop types defined

### Layer 6: Validation
- Zod schemas for forms
- Validation rules
- User-friendly error messages
- Schema matches database types

### Layer 7: Security
- Auth checks comprehensive
- RLS policies verified via Supabase MCP
- No SQL injection vectors
- Input sanitization

### Layer 8: UX
- Loading states present
- Error states/boundaries
- Empty states
- Mobile responsive
- Accessibility (ARIA, semantic HTML)

## Tools Used

Each analysis leverages:

1. **Context7 MCP** - Fetch latest best practices for:
   - Next.js 15 App Router
   - React 19 Server Components
   - TypeScript 5.6
   - Supabase patterns

2. **Supabase MCP** - Database analysis:
   - List available public views
   - Verify RLS policies
   - Get security/performance advisors
   - Check view usage

## Expected Timeline

- **Each portal analysis**: 15-30 minutes
- **Project summary**: 5-10 minutes
- **Total time**: 1.5-3 hours for complete analysis

## Notes

- Run analyses one at a time to avoid context overload
- Each analysis creates detailed .md files with specific issues
- All issues include exact file paths, line numbers, and fixes
- Issues are prioritized by severity (Critical/High/Medium/Low)
- Project summary aggregates all portal findings

## After Analysis

Once all analyses are complete:

1. Review `docs/00_PROJECT_SUMMARY.md` for project-wide overview
2. Review individual portal summaries for detailed breakdowns
3. Start fixing Critical issues first (see recommended fix order)
4. Track progress using individual layer .md files
5. Re-run analyses after major fixes to verify improvements

## Complete Workflow

### Option A: Analyze All, Then Fix All

0. Run `/analyze-structure` (optional but recommended first)
1. Run all portal analyses (5 commands)
2. Generate project summary
3. Review all findings
4. Prioritize fixes across portals
5. Use portal-specific fix commands systematically

### Option B: Analyze and Fix Per Portal (Recommended)

0. Run `/analyze-structure` (optional - if structural issues suspected)
1. Run `/analyze-admin-portal`
2. Review `docs/admin-portal/00_SUMMARY.md`
3. Run `/fix-admin-portal` → all layers, critical
4. Run `/fix-admin-portal` → all layers, high
5. Move to next portal (e.g., `/analyze-business-portal`)
6. Generate project summary at the end

### Option C: Structure-First Approach (For Messy Codebases) **[RECOMMENDED]**

1. Run `/analyze-structure` to identify organizational issues
2. Review `docs/structure-analysis-report.md`
3. Run `/fix-structure-issues --priority critical` to fix critical issues
4. Run `/fix-structure-issues --priority high` to fix high priority issues
5. Verify with `npm run typecheck`
6. Then proceed with portal-specific analyses

**Why this approach works best:**
- Fixes fundamental organization issues first
- Establishes proper file/folder structure
- Makes portal-specific analyses more accurate
- Creates solid foundation before detailed fixes
- New `/fix-structure-issues` command handles most fixes automatically

### Option D: Targeted Fixes

1. Run specific portal analysis (e.g., `/analyze-admin-portal`)
2. Review specific layer (e.g., `docs/admin-portal/03_MUTATIONS_ANALYSIS.md`)
3. Run portal fix command (e.g., `/fix-admin-portal` → layer 3, critical)
4. Verify with `npm run typecheck`
5. Re-run analysis to verify improvements

## Recommended Approach

**For established codebases**: Use **Option B** (Analyze and Fix Per Portal)
- Keeps scope manageable
- Immediate feedback on fixes
- Can verify before moving to next portal
- Maintains context between analysis and fixes
- Allows for incremental progress

**For messy/disorganized codebases**: Use **Option C** (Structure-First)
- Fixes fundamental organization issues first
- Establishes proper file/folder structure
- Makes portal-specific analyses more effective
- Reduces "noise" in later analyses
- Creates solid foundation for code quality fixes
