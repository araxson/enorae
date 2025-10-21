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

## Command Design Principles

All commands follow these principles:

1. **Autonomous** - No questions asked, fix everything automatically
2. **Portable** - Works across any similar project
3. **Reusable** - Can be run multiple times safely
4. **Comprehensive** - Covers all aspects of the pattern
5. **Educational** - Includes examples and explanations
6. **Verifiable** - Provides clear before/after metrics

## Quick Start

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

**Last Updated:** 2025-10-20
**Total Commands:** 8
**Total Documentation:** ~50KB
