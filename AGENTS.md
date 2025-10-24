# Claude Agent Guide

Fast reference for Claude Code when contributing to ENORAE.
Never Edit the database.type.ts
---
NEVER USE OR CREATE BULK FIX SCRIPT. THIS WILL BREAK THE PROJECT
## Stack Patterns Documentation

**Complete, standalone pattern files for the ENORAE tech stack.**

- **Start here:** `docs/stack-patterns/00-INDEX.md`
- **Main architecture:** `docs/stack-patterns/architecture-patterns.md`
- **All patterns are standalone** - Each file is completely portable with full context

### Quick Navigation

| Task | Read this pattern file |
| --- | --- |
| **New feature** | `docs/stack-patterns/architecture-patterns.md` |
| **New page/route** | `docs/stack-patterns/nextjs-patterns.md` |
| **UI components** | `docs/stack-patterns/ui-patterns.md` |
| **Database queries** | `docs/stack-patterns/supabase-patterns.md` |
| **Forms & validation** | `docs/stack-patterns/forms-patterns.md` |
| **Type safety** | `docs/stack-patterns/typescript-patterns.md` |
| **React components** | `docs/stack-patterns/react-patterns.md` |
| **File organization** | `docs/stack-patterns/file-organization-patterns.md` |

**💡 Tip:** Each pattern file is self-contained with complete examples, detection commands, and best practices. No cross-references needed.

---

## Critical Reminders

### UI Components

- **Use shadcn/ui primitives** from `@/components/ui/*`
- **Fetch missing components** via shadcn MCP (`mcp__shadcn__get-component-docs`)
- **Never edit** `components/ui/*` files
- **Eliminate custom Typography** - No imports from `@/components/ui/typography`
- **Use component slots AS-IS** - CardTitle, CardDescription, AlertTitle, etc. with **zero styling changes**
- **Apply layout classes only** - Use `flex`, `gap`, `padding` for arrangement
- **No slot customization** - Never add `className="text-lg font-bold"` to slots
- **Restructure to shadcn compositions** - Content blocks → Cards, callouts → Alerts
- **Fallback rarely** - Use semantic HTML only when no shadcn primitive exists
- **No arbitrary styling** - No custom Tailwind utilities, no arbitrary colors
- **Never edit `app/globals.css`**

**Reference:** `docs/stack-patterns/ui-patterns.md`

---

### Database & Security

- **Reads from public views** - Query `*_view` tables, not schema tables
- **Writes to schema tables** - Use `.schema('schema_name').from('table')`
- **Always verify auth** - `getUser()` or `verifySession()` before any database operation
- **Validate inputs** - Use Zod schemas for all user input
- **Revalidate paths** - Call `revalidatePath()` after mutations
- **RLS tenant scoping** - Filter by tenant/user ID in all queries

**Reference:** `docs/stack-patterns/supabase-patterns.md`

---

### Architecture

- **Pages are shells (5-15 lines)** - Render feature components only
- **Server-only directives** - `features/**/api/queries.ts` must have `import 'server-only'`
- **Server actions** - `features/**/api/mutations.ts` must start with `'use server'`
- **Canonical structure** - `components/`, `api/`, `types.ts`, `schema.ts`, `index.tsx`
- **Feature organization** - `features/{portal}/{feature}/`

**Reference:** `docs/stack-patterns/architecture-patterns.md`

---

### Next.js, React, TypeScript

- **App Router only** - No Pages Router, no `getInitialProps`, no `getServerSideProps`
- **Server Components for data** - Fetch in Server Components, not Client Components
- **Client Components for interactivity** - Use `'use client'` for hooks and events
- **TypeScript strict mode** - No `any`, no `@ts-ignore`, strict compiler flags
- **Type safety everywhere** - Use generated database types, Zod inference

**Reference:**
- `docs/stack-patterns/nextjs-patterns.md`
- `docs/stack-patterns/react-patterns.md`
- `docs/stack-patterns/typescript-patterns.md`

---

## Frequent Violations (Avoid These)

1. ❌ Importing from `@/components/ui/typography` → ✅ Use shadcn slots (CardTitle, etc.)
2. ❌ Adding `className="text-lg font-bold"` to slots → ✅ Use slots as-is
3. ❌ Wrapping slots in extra `<span>`/`<p>` → ✅ Render text directly
4. ❌ Building custom UI primitives → ✅ Use existing shadcn components
5. ❌ Editing `components/ui/*` → ✅ Never edit, only import
6. ❌ Arbitrary Tailwind classes → ✅ Use layout classes only
7. ❌ Querying schema tables for reads → ✅ Query public views
8. ❌ Missing auth guards → ✅ Always verify with `getUser()`
9. ❌ Business logic in pages → ✅ Pages are 5-15 line shells
10. ❌ Using `any` type → ✅ TypeScript strict mode always
11. ❌ Missing `revalidatePath()` → ✅ Call after all mutations

**When stuck:** Read the relevant pattern file in `docs/stack-patterns/`

---

## Code Reference Examples

### Database Query Pattern

```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getSalonDashboard(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salon_dashboard') // ✅ Public view
    .select('*')
    .eq('owner_id', user.id)

  if (error) throw error
  return data
}
```

**Full patterns:** `docs/stack-patterns/supabase-patterns.md`

---

### UI Component Pattern

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function EmptyAppointments() {
  return (
    <Card>
      <CardHeader className="mb-4">
        {/* ✅ Use slots with ZERO styling changes */}
        <CardTitle>Nothing scheduled</CardTitle>
        <CardDescription>Once clients book, appointments will appear here.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        {/* ✅ Layout classes (flex, gap, justify-between) OK */}
        {/* ❌ DO NOT: <CardTitle className="text-lg font-bold"> */}
        <Badge variant="outline">0 bookings</Badge>
        <Button>Create a service</Button>
      </CardContent>
    </Card>
  )
}
```

**Full patterns:** `docs/stack-patterns/ui-patterns.md`

---

### Page Shell Pattern

```tsx
import { Suspense } from 'react'
import { BusinessDashboard } from '@/features/business/dashboard'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BusinessDashboard />
    </Suspense>
  )
}
```

**Full patterns:** `docs/stack-patterns/nextjs-patterns.md`

---

### Server Mutation Pattern

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function createUser(formData: FormData) {
  const supabase = await createClient()

  // 1. Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Validate
  const validated = schema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  // 3. Write to schema table
  const { error } = await supabase
    .schema('organization')
    .from('users')
    .insert({
      ...validated,
      created_by: user.id,
    })

  if (error) throw error

  // 4. Revalidate
  revalidatePath('/users')
  return { success: true }
}
```

**Full patterns:** `docs/stack-patterns/supabase-patterns.md` + `docs/stack-patterns/forms-patterns.md`

---

## Project Structure

### Portals
- `(marketing)` - Public marketing pages
- `(customer)` - Customer portal
- `(staff)` - Staff portal
- `(business)` - Business owner portal
- `(admin)` - Admin portal

### Feature Organization
```
features/{portal}/{feature}/
├── components/       # UI components
├── api/
│   ├── queries.ts   # Server-only reads (public views)
│   └── mutations.ts # Server actions (schema tables)
├── types.ts         # TypeScript types
├── schema.ts        # Zod validation schemas
└── index.tsx        # Main feature export
```

### Database Schemas
- `organization` - Organization/tenant data (US spelling)
- `catalog` - Products, services, pricing
- `scheduling` - Appointments, bookings
- `identity` - Users, profiles, auth
- `communication` - Messages, notifications
- `analytics` - Metrics, reports
- `engagement` - Marketing, campaigns

**Full details:** `docs/stack-patterns/architecture-patterns.md`

---

## Tech Stack

| Technology | Version | Pattern File |
|-----------|---------|--------------|
| Next.js | 15.5.4 | `nextjs-patterns.md` |
| React | 19.1.0 | `react-patterns.md` |
| TypeScript | 5.9.3 | `typescript-patterns.md` |
| Supabase | 2.47.15 | `supabase-patterns.md` |
| shadcn/ui | Latest | `ui-patterns.md` |
| React Hook Form | 7.63.0 | `forms-patterns.md` |
| Zod | 3.25.76 | `forms-patterns.md` |
| lucide-react | 0.544.0 | `ui-patterns.md` |

---

## Pre-Commit Checklist

Before committing code:

1. ✅ **Read relevant pattern file** from `docs/stack-patterns/`
2. ✅ **Run type check** - `npm run typecheck` (must pass)
3. ✅ **Verify auth guards** - All queries/mutations check user
4. ✅ **Check server directives** - `'server-only'` in queries, `'use server'` in mutations
5. ✅ **Validate UI patterns** - No typography imports, slots used as-is
6. ✅ **No arbitrary styling** - Layout classes only, no custom colors
7. ✅ **Pages are thin** - 5-15 lines, render feature components only
8. ✅ **TypeScript strict** - No `any`, no `@ts-ignore`
9. ✅ **Revalidate paths** - Called after mutations
10. ✅ **Public views for reads** - Schema tables for writes

---

## Detection Commands

Run these to find violations:

```bash
# Missing 'server-only' in queries.ts
rg "export async function" features/**/api/queries.ts -l | xargs -I {} sh -c "grep -L \"import 'server-only'\" {}"

# Missing 'use server' in mutations.ts
rg "export async function" features/**/api/mutations.ts -l | xargs -I {} sh -c "grep -L \"'use server'\" {}"

# Typography imports (should not exist)
rg "from '@/components/ui/typography'" --type tsx

# Missing auth checks
rg "export async function" features/**/api -A 5 | grep -L "getUser\|verifySession"

# Using 'any' type
rg "\bany\b" --type ts --type tsx | grep -v "node_modules"

# Arbitrary colors
rg "#[0-9a-fA-F]{3,6}" --type tsx | grep -v "app/globals.css"

# Pages > 15 lines
find app -name 'page.tsx' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 15 ] && echo "$1: $lines lines"' _ {} \;
```

**Full detection commands in each pattern file.**

---

## Quick Start Workflows

### Creating a New Feature

1. Read `docs/stack-patterns/architecture-patterns.md`
2. Create: `features/{portal}/{feature}/`
3. Add structure: `components/`, `api/`, `types.ts`, `schema.ts`, `index.tsx`
4. Write queries in `api/queries.ts` (with `import 'server-only'`)
5. Write mutations in `api/mutations.ts` (with `'use server'`)
6. Create UI in `components/`
7. Export from `index.tsx`

### Adding a Database Query

1. Read `docs/stack-patterns/supabase-patterns.md`
2. Add to `features/{portal}/{feature}/api/queries.ts`
3. Include `import 'server-only'` at top
4. Verify auth with `getUser()`
5. Query from public view (`*_view`)
6. Filter by tenant/user ID
7. Handle errors

### Building a Form

1. Read `docs/stack-patterns/forms-patterns.md`
2. Define Zod schema in `schema.ts`
3. Create form with `useForm` + `zodResolver`
4. Add shadcn Form components
5. Handle submission with server action
6. Display success/error feedback

**All workflows in:** `docs/stack-patterns/00-INDEX.md`

---

## Updating Pattern Documentation

To update pattern files with latest best practices:

```bash
# Read the update prompt
cat UPDATE_PATTERNS_PROMPT.md

# Then ask Claude to execute the updates using Context7 MCP
```

**Update prompt:** `UPDATE_PATTERNS_PROMPT.md`

---

## Database Schema Synchronization Agents

### Two-Step Schema Sync Process

When TypeScript code and database schema are out of sync, use these agents in sequence:

**Step 1: Analyze (database-schema-analyzer)**
- Reads actual Supabase database schema using MCP
- Scans codebase for mismatches
- Generates organized reports in `docs/schema-sync/`
- Creates task lists with [ ] checkboxes for each issue
- Does NOT modify any code or database

**Step 2: Fix (database-schema-fixer)**
- Reads analysis reports from `docs/schema-sync/`
- Applies fixes systematically (database = source of truth)
- Updates task lists with [x] as it completes fixes
- Runs typecheck after each batch
- Generates completion report

### When to Use

**Use database-schema-analyzer when:**
- TypeScript errors reference missing database properties
- Database schema has been updated
- You want to audit code/schema alignment
- Planning a schema migration
- Quarterly code health checks

**Use database-schema-fixer when:**
- You have analysis reports in `docs/schema-sync/`
- Ready to apply schema alignment fixes
- TypeScript errors need systematic resolution

### Example Workflow

```bash
# 1. Generate analysis reports
# Claude will use database-schema-analyzer agent

# 2. Review reports
cat docs/schema-sync/00-ANALYSIS-INDEX.md
cat docs/schema-sync/09-fix-priority.md

# 3. Apply fixes
# Claude will use database-schema-fixer agent

# 4. Verify
npm run typecheck
cat docs/schema-sync/10-FIX-COMPLETION-REPORT.md
```

### Report Structure

Analysis creates organized reports:
```
docs/schema-sync/
├── 00-ANALYSIS-INDEX.md          # Navigation hub
├── 01-schema-overview.md          # Actual database schema (source of truth)
├── 02-mismatch-summary.md         # Statistics
├── 03-missing-properties.md       # Category A + task list
├── 04-wrong-column-names.md       # Category B + task list
├── 05-type-mismatches.md          # Category C + task list
├── 06-nonexistent-rpcs.md         # Category D + task list
├── 07-nonexistent-tables.md       # Category E + task list
├── 08-incorrect-selects.md        # Category F + task list
├── 09-fix-priority.md             # Prioritized action plan
└── 10-FIX-COMPLETION-REPORT.md    # Generated after fixes
```

### Task List Format

Reports use standardized task tracking:

**Before fixing:**
```markdown
- [ ] Fix features/business/dashboard/api/queries.ts:45 - Property amenities does not exist
```

**After fixing:**
```markdown
- [x] Fix features/business/dashboard/api/queries.ts:45 - Property amenities does not exist
  - **Fixed:** Removed amenities access, using actual schema columns only
  - **Date:** 2025-10-22
```

### Critical Rules

**Analyzer Agent:**
- ✅ READ database schema using Supabase MCP
- ✅ Generate ALL report files with task lists
- ✅ Categorize by severity (Critical/High/Medium/Low)
- ❌ NEVER modify code or database

**Fixer Agent:**
- ✅ READ analysis reports first
- ✅ Use database schema as SOURCE OF TRUTH
- ✅ Update task lists with [x] as you complete them
- ✅ Run typecheck after each batch
- ❌ NEVER modify database schema
- ❌ NEVER use `any` or `@ts-ignore`

---

## Getting Help

**Need pattern examples?** → Read `docs/stack-patterns/{topic}-patterns.md`

**Unsure which file to read?** → Start with `docs/stack-patterns/00-INDEX.md`

**Building a feature?** → `docs/stack-patterns/architecture-patterns.md`

**Working with database?** → `docs/stack-patterns/supabase-patterns.md`

**Creating UI?** → `docs/stack-patterns/ui-patterns.md`

**Building forms?** → `docs/stack-patterns/forms-patterns.md`

**Database/code out of sync?** → Use `database-schema-analyzer` then `database-schema-fixer`

**All pattern files are standalone and portable** - read any file independently.

---

## Available Agents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `database-schema-analyzer` | Analyze database/code mismatches | Before fixing schema issues |
| `database-schema-fixer` | Apply schema synchronization fixes | After analysis reports generated |
| `stack-patterns-validator` | Audit ENORAE patterns compliance | Before major releases |
| `ui-pattern-enforcer` | Enforce shadcn/ui patterns | UI consistency audits |

**Agent Documentation:** `.claude/agents/`

---

**Maintained by:** Development Team
**Last Updated:** 2025-10-22
**Pattern Files:** `docs/stack-patterns/` (8 files, 100% standalone)
**Agents:** `.claude/agents/` (Database schema sync, pattern validation, UI enforcement)

Stay within these patterns to keep ENORAE consistent, accessible, secure, and maintainable.
