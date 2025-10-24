# Claude Commands

Reusable, portable commands for code quality and error fixing.

## Available Commands

### `/fix` - Comprehensive Error Fixing
**File:** `fix.md` (16KB, 665 lines)

The ultimate autonomous error fixer for any TypeScript/Next.js project.

**What it fixes:**
- TypeScript compilation errors (all TS2xxx codes)
- Import/export mismatches
- Type definition errors
- Schema/database type errors
- Component prop errors
- Null/undefined safety
- Async/await issues
- ESLint violations

**Features:**
- ✅ Completely autonomous (no questions asked)
- ✅ Categorizes errors by type
- ✅ Fixes in batches with progress tracking
- ✅ Handles cascading errors intelligently
- ✅ Real-world examples included
- ✅ TypeScript error code reference
- ✅ Works on any project (portable & reusable)

**Usage:**
```bash
/fix
```

**Expected outcome:**
- TypeScript errors: XXX → 0 ✅
- All import/export issues resolved
- All type errors fixed
- Clean typecheck passing

---

### `/ui-fix` - UI Pattern Enforcement
**File:** `ui-fix.md`

Enforces shadcn/ui component patterns across the codebase.

**What it fixes:**
- Custom typography imports
- Ad-hoc containers (use Card instead)
- Slot pattern violations
- Arbitrary color usage
- Component composition issues

**Usage:**
```bash
/ui-fix
```

---

### `/nextjs-fix` - Next.js 15 Pattern Enforcement
**File:** `nextjs-fix.md`

Ensures Next.js 15 App Router best practices.

**What it checks:**
- Async params/searchParams
- Page shell pattern (5-15 lines)
- Metadata exports
- Error boundaries
- File conventions
- Server Actions

**Usage:**
```bash
/nextjs-fix
```

---

### `/react-fix` - React 19 Pattern Enforcement
**File:** `react-fix.md`

Validates React 19 Server/Client component patterns.

**What it checks:**
- 'use client' directives
- Server/Client boundaries
- Hooks usage
- Suspense boundaries
- Component size
- Props drilling

**Usage:**
```bash
/react-fix
```

---

### `/supabase-fix` - Supabase Pattern Enforcement
**File:** `supabase-fix.md`

Ensures Supabase best practices and security.

**What it checks:**
- 'server-only' directives in queries
- 'use server' directives in mutations
- Auth guards (requireAuth, requireAnyRole)
- RLS patterns
- Schema usage
- Type safety (.returns<Type>())
- Cache invalidation (revalidatePath)

**Usage:**
```bash
/supabase-fix
```

---

### `/typescript-fix` - TypeScript Pattern Enforcement
**File:** `typescript-fix.md`

Enforces TypeScript strict mode and best practices.

**What it checks:**
- No 'any' types
- Strict null checks
- Type imports
- Proper type inference
- Generic constraints

**Usage:**
```bash
/typescript-fix
```

---

### `/forms-fix` - Forms Pattern Enforcement
**File:** `forms-fix.md`

Validates React Hook Form + Zod patterns.

**What it checks:**
- Zod schema validation
- Form composition
- Error handling
- Server Actions integration
- Type safety

**Usage:**
```bash
/forms-fix
```

---

### `/architecture-fix` - Architecture Pattern Enforcement
**File:** `architecture-fix.md`

Ensures proper feature organization and file structure.

**What it checks:**
- Feature organization
- File naming conventions
- Import structure
- Circular dependencies
- Code organization

**Usage:**
```bash
/architecture-fix
```

---

## Database Schema Sync Commands

### `/database-schema-analyze` - Analyze Database/Code Mismatches
**File:** `database-schema-analyze.md`

**⚠️ RUN THIS FIRST:** Analyzes TypeScript codebase against actual Supabase database schema.

**What it does:**
- Reads actual database schema using Supabase MCP
- Scans entire codebase for mismatches
- Categorizes issues by severity (Critical/High/Medium/Low)
- Generates organized reports in `docs/schema-sync/`
- Creates task lists with `[ ]` checkboxes for each issue
- Does NOT modify any code or database

**Generates these reports:**
```
docs/schema-sync/
├── 00-ANALYSIS-INDEX.md          # Navigation hub
├── 01-schema-overview.md          # Actual DB schema (source of truth)
├── 02-mismatch-summary.md         # Statistics
├── 03-missing-properties.md       # Category A + tasks
├── 04-wrong-column-names.md       # Category B + tasks
├── 05-type-mismatches.md          # Category C + tasks
├── 06-nonexistent-rpcs.md         # Category D + tasks
├── 07-nonexistent-tables.md       # Category E + tasks
├── 08-incorrect-selects.md        # Category F + tasks
└── 09-fix-priority.md             # Prioritized action plan
```

**Usage:**
```bash
/database-schema-analyze
```

**Expected outcome:**
- Comprehensive analysis reports generated
- All issues categorized and documented
- Task lists with [ ] checkboxes
- Ready for `/database-schema-fix`

---

### `/database-schema-fix` - Apply Schema Synchronization Fixes
**File:** `database-schema-fix.md`

**⚠️ RUN AFTER ANALYZE:** Applies fixes based on analysis reports.

**What it does:**
- Reads reports from `docs/schema-sync/`
- Applies fixes in priority order (Critical → High → Medium → Low)
- Updates task lists with `[x]` as it completes fixes
- Runs `npm run typecheck` after each batch
- Generates completion report
- Database = source of truth (code matches database)

**Fix categories:**
- **Critical:** Non-existent RPCs, tables/views
- **High:** Missing properties, wrong column names, incorrect selects
- **Medium:** Type mismatches, safety issues
- **Low:** Cleanup, type guards, documentation

**Usage:**
```bash
/database-schema-fix
```

**Expected outcome:**
- All TypeScript errors resolved
- Code types match database schema exactly
- Task lists updated with [x] completed
- Completion report generated
- TypeScript errors: XXX → 0 ✅

---

### Database Schema Sync Workflow

**Complete workflow:**

```bash
# 1. Analyze database vs code
/database-schema-analyze

# 2. Review analysis reports
cat docs/schema-sync/00-ANALYSIS-INDEX.md
cat docs/schema-sync/09-fix-priority.md

# 3. Apply fixes systematically
/database-schema-fix

# 4. Verify completion
npm run typecheck
cat docs/schema-sync/10-FIX-COMPLETION-REPORT.md
```

**When to use:**
- TypeScript errors reference missing database properties
- Database schema has been updated
- Planning a schema migration
- Quarterly code health checks
- Before major releases

---

## Database Fix Commands

A comprehensive suite of commands for systematically fixing database issues identified in the analysis reports.

### `/db-fix` - Fix One Database Issue
**File:** `db-fix.md`

Fixes one database issue at a time with verification.

**What it does:**
- Reads progress tracker
- Finds next unchecked task
- Applies fix using Supabase MCP
- Verifies the fix
- Updates progress tracker

**Usage:**
```bash
/db-fix
```

---

### `/db-fix-batch` - Fix Entire Category
**File:** `db-fix-batch.md`

Fixes all issues in a single category at once.

**What it does:**
- Processes entire category
- Applies multiple migrations
- Updates all completed tasks
- Provides summary report

**Usage:**
```bash
/db-fix-batch
```

---

### `/db-fix-rls` - Emergency RLS Security Fix
**File:** `db-fix-rls.md`

**⚠️ CRITICAL:** Fixes unprotected partition tables immediately.

**What it fixes:**
- 52 unprotected partition tables
- Missing RLS policies
- Tenant isolation vulnerabilities
- Cross-tenant data exposure risks

**Usage:**
```bash
/db-fix-rls  # Run this FIRST for security
```

---

### `/db-status` - Database Progress Report
**File:** `db-status.md`

Shows comprehensive database fix progress.

**What it reports:**
- Overall completion percentage
- Progress by priority
- Progress by category
- Recently completed tasks
- Next priority tasks
- Time estimates

**Usage:**
```bash
/db-status
```

---

### `/db-verify` - Verify All Fixes
**File:** `db-verify.md`

Verifies that completed fixes are working correctly.

**What it checks:**
- RLS policies active
- Indexes properly configured
- Views correctly defined
- Audit columns present
- Security compliance

**Usage:**
```bash
/db-verify
```

---

### `/db-rollback` - Rollback Database Changes
**File:** `db-rollback.md`

Safely rollback problematic database changes.

**What it does:**
- Lists recent migrations
- Creates rollback migration
- Updates progress tracker
- Verifies rollback success

**Usage:**
```bash
/db-rollback
```

---

### `/db-help` - Database Commands Help
**File:** `db-help.md`

Shows all available database commands and usage.

**Usage:**
```bash
/db-help
```

---

### Portal Fix Commands

Fix issues in specific portals:

- `/a:fix-customer-portal` - Fix Customer Portal issues
- `/a:fix-marketing-portal` - Fix Marketing Portal issues
- `/a:fix-business-portal` - Fix Business Portal issues
- `/a:fix-admin-portal` - Fix Admin Portal issues
- `/a:fix-staff-portal` - Fix Staff Portal issues

---

## Command Design Principles

All commands follow these principles:

1. **Autonomous** - No questions asked, fix everything automatically
2. **Portable** - Works across any similar project
3. **Reusable** - Can be run multiple times safely
4. **Comprehensive** - Covers all aspects of the pattern
5. **Educational** - Includes examples and explanations
6. **Verifiable** - Provides clear before/after metrics

## Quick Start

### Database Schema Sync (RECOMMENDED FIRST)

**⚠️ START HERE: Align TypeScript code with database schema:**

```bash
# 1. Analyze database vs code mismatches
/database-schema-analyze

# 2. Review analysis reports
cat docs/schema-sync/00-ANALYSIS-INDEX.md
cat docs/schema-sync/09-fix-priority.md

# 3. Apply fixes systematically
/database-schema-fix

# 4. Verify completion
npm run typecheck
cat docs/schema-sync/10-FIX-COMPLETION-REPORT.md
```

**Database Schema Sync Workflow:**
1. Run `/database-schema-analyze` first to generate reports
2. Review `docs/schema-sync/` for issue details
3. Run `/database-schema-fix` to apply fixes
4. Verify with `npm run typecheck`
5. Check completion report for summary

---

### Database Fixes (PRIORITY)

**⚠️ CRITICAL: Fix security vulnerabilities first:**

```bash
# 1. Check current database status
/db-status

# 2. Fix critical RLS security issues (52 unprotected tables)
/db-fix-rls

# 3. Verify security fixes
/db-verify

# 4. Continue with remaining fixes
/db-fix        # One at a time
# OR
/db-fix-batch  # Entire categories
```

**Database Fix Workflow:**
1. Always start with `/db-fix-rls` for security
2. Use `/db-fix` for careful, controlled fixes
3. Use `/db-fix-batch` to clear entire categories
4. Run `/db-verify` after fixes
5. Use `/db-rollback` if issues occur

### Code Fixes

**To fix all errors in your project:**

```bash
# Run the comprehensive error fixer
/fix

# Review changes
git diff

# If satisfied, commit
git add .
git commit -m "fix: resolve all TypeScript errors"
```

**To enforce all patterns:**

```bash
# Run all pattern enforcement commands
/ui-fix
/nextjs-fix
/react-fix
/supabase-fix
/typescript-fix
/forms-fix
/architecture-fix

# Review and commit
git diff
git add .
git commit -m "refactor: enforce all architecture patterns"
```

## Creating New Commands

To create a new command:

1. Create `.claude/commands/your-command.md`
2. Follow the template structure:
   - What it does
   - Detection commands
   - Fix strategies
   - Real examples
   - Success criteria
3. Make it autonomous (no user questions)
4. Make it portable (works on any project)
5. Add to this README

## Tips

**Run commands in order:**
1. `/fix` - Fix all errors first
2. `/architecture-fix` - Fix organization
3. `/ui-fix`, `/nextjs-fix`, `/react-fix` - Enforce patterns
4. `/supabase-fix`, `/typescript-fix` - Enforce best practices

**After running commands:**
- Review changes with `git diff`
- Run `npm run typecheck` to verify
- Run `npm run lint` for code quality
- Test critical paths

**If a command finds nothing to fix:**
That's great! Your codebase is already following the patterns. ✅

---

**Last Updated:** 2025-10-22
**Total Commands:** 22 (8 code + 9 database + 5 portal)
**Total Documentation:** ~95KB

**New:** Database Schema Sync commands for TypeScript/database alignment
