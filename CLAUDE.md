# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Never edit:** `components/ui/*`, `app/globals.css`, `lib/types/database.types.ts`

---

## Essential Commands

### Development
```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking (MUST pass before commits)
```

### Database & Types
```bash
pnpm db:types         # Generate TypeScript types from Supabase database
pnpm scan:schema      # Scan database schema for analysis
pnpm scan:schema:analyze  # Analyze schema scan results
pnpm scan:schema:full     # Full schema scan and analysis
```

### Testing & Validation
```bash
pnpm test             # Run tests
pnpm validate:migration <file>        # Validate single migration
pnpm validate:migrations:all          # Validate all migrations
pnpm lint:shadcn      # Check shadcn/ui slot usage compliance
```

---

## Critical Architecture Rules

### 1. NEVER Edit These Files
- ❌ `lib/types/database.types.ts` - Auto-generated from database
- ❌ `components/ui/*` - shadcn/ui primitives (import only, never modify)
- ❌ `app/globals.css` - Global styles are locked

### 2. NEVER Create Bulk Fix Scripts
**This will break the project.** Always make targeted, specific changes.

### 3. Pages Are Thin Shells (5-15 Lines)
```tsx
// ✅ CORRECT - Pages only render feature components
import { Suspense } from 'react'
import { DashboardFeature } from '@/features/business/dashboard'

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardFeature />
    </Suspense>
  )
}

// ❌ WRONG - Business logic in pages
export default async function Page() {
  const supabase = await createClient()  // ❌ NO
  const data = await supabase.from...    // ❌ NO
  return <div>{data}</div>               // ❌ NO
}
```

### 4. Server Directives Are Required
```ts
// api/queries.ts - MUST start with:
import 'server-only'

// api/mutations.ts - MUST start with:
'use server'

// Client components - MUST start with:
'use client'
```

### 5. Always Use getUser() for Auth
```ts
// ✅ CORRECT - getUser() verifies with auth server
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')

// ❌ WRONG - getSession() can be spoofed
const { data: { session } } = await supabase.auth.getSession()
```

---

## Project Architecture

### Portal Structure
```
app/
├── (marketing)/     # Public marketing pages
├── (customer)/      # Customer portal
├── (staff)/         # Staff portal
├── (business)/      # Business owner portal
└── (admin)/         # Platform admin portal
```

### Feature Organization
```
features/{portal}/{feature}/
├── components/      # UI components (server/client)
├── api/
│   ├── queries.ts   # Server-only reads (import 'server-only')
│   └── mutations.ts # Server actions ('use server')
├── types.ts         # TypeScript types
├── schema.ts        # Zod validation schemas
└── index.tsx        # Feature entry point (Server Component)
```

### Database Schema Organization
ENORAE uses PostgreSQL schemas for domain separation:
- `organization` - Salons, staff, locations, chains
- `catalog` - Services, pricing, categories
- `scheduling` - Appointments, availability, bookings
- `identity` - Users, profiles, roles, auth
- `communication` - Messages, notifications
- `analytics` - Metrics, reports, insights
- `engagement` - Reviews, favorites

**Key Pattern:**
- **Read from public views** (e.g., `salon_dashboard_view`)
- **Write to schema tables** (e.g., `organization.salons`)

---

## Next.js 16 Patterns

### Params and SearchParams Are Async
```tsx
// ✅ CORRECT
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ query?: string }>
}) {
  const { id } = await params
  const { query } = await searchParams
  return <Feature id={id} query={query} />
}

// ❌ WRONG - Direct access will fail
export default function Page({ params }: { params: { id: string } }) {
  return <Feature id={params.id} />  // Runtime error
}
```

### Async Request APIs
```ts
// ✅ CORRECT - All request APIs are now async
const cookieStore = await cookies()
const headersList = await headers()
const draft = await draftMode()

// ❌ WRONG - Synchronous access removed
const cookieStore = cookies()  // Error in Next.js 16
```

### Use proxy.ts Instead of middleware.ts
- File must be named `proxy.ts` (not `middleware.ts`)
- Export default function (not named export)
- Only for session refresh, NOT auth checks

---

## Database Patterns

### Reading Data (Queries)
```ts
// features/{portal}/{feature}/api/queries.ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getSalonDashboard(userId: string) {
  const supabase = await createClient()

  // 1. Always verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) throw new Error('Unauthorized')

  // 2. Read from public views
  const { data, error } = await supabase
    .from('salon_dashboard_view')  // ✅ View, not schema table
    .select('*')
    .eq('owner_id', user.id)

  if (error) throw error
  return data
}
```

### Writing Data (Mutations)
```ts
// features/{portal}/{feature}/api/mutations.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  description: z.string()
})

export async function createSalon(formData: FormData) {
  const supabase = await createClient()

  // 1. Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Validate input
  const validated = schema.parse({
    name: formData.get('name'),
    description: formData.get('description')
  })

  // 3. Write to schema table
  const { error } = await supabase
    .schema('organization')  // ✅ Write to schema
    .from('salons')
    .insert({
      ...validated,
      owner_id: user.id
    })

  if (error) throw error

  // 4. Revalidate cache
  revalidatePath('/salons')
  return { success: true }
}
```

---

## UI Patterns (shadcn/ui)

### Semantic Richness Over Repetition

**Mandate:** Replace generic shadcn components with semantically richer primitives wherever possible.

- Avoid repetitive use of any single component (especially Card)
- Identify UI intent → Consult component catalog → Select best-matching primitive
- Only use generic fallback when no better match exists

**Examples:**
- Statistics display → Chart components (not Cards)
- Navigation sections → Tabs, Accordion, Navigation Menu (not Card groups)
- Action-oriented content → Alert, Dialog, Sheet (not Cards)
- Data lists → Table, Data Table (not Card lists)

### Use Slots As-Is (NO Custom Styling)
```tsx
// ✅ CORRECT - Use slots without modification
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DashboardCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue summary</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        {/* Layout classes (flex, gap) are OK */}
        <Button>View Details</Button>
      </CardContent>
    </Card>
  )
}

// ❌ WRONG - Custom styling on slots
<CardTitle className="text-2xl font-bold text-blue-500">  // ❌ NO
<CardDescription className="text-sm opacity-70">          // ❌ NO
```

### Never Import Typography Components
```tsx
// ❌ WRONG - Typography components don't exist
import { H1, H2, P } from '@/components/ui/typography'  // ❌ NO

// ✅ CORRECT - Use shadcn slots or semantic HTML
import { CardTitle } from '@/components/ui/card'
<CardTitle>Heading</CardTitle>

// Or semantic HTML when no slot exists
<h1 className="text-3xl font-bold">Heading</h1>
```

### Fetching Missing shadcn Components
```bash
# Use the shadcn MCP tool to check available components
mcp__shadcn__list-components

# Get component documentation
mcp__shadcn__get-component-docs <component-name>

# Install new component
mcp__shadcn__install-component <component-name> --runtime pnpm
```

---

## TypeScript Patterns

### Strict Mode is Enabled
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

**This means:**
- ❌ No `any` types
- ❌ No `@ts-ignore` comments
- ✅ All types must be explicit
- ✅ Array/object access needs checks
- ✅ Use Zod for runtime validation

### Using Database Types
```ts
// ✅ CORRECT - Import from auto-generated types
import type { Database } from '@/lib/types/database.types'

type Salon = Database['organization']['Tables']['salons']['Row']
type SalonInsert = Database['organization']['Tables']['salons']['Insert']
type SalonUpdate = Database['organization']['Tables']['salons']['Update']
```

---

## Form Patterns

### Standard Form Structure
```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// 1. Define schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email')
})

type FormValues = z.infer<typeof formSchema>

export function ExampleForm() {
  // 2. Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' }
  })

  // 3. Handle submit with server action
  async function onSubmit(values: FormValues) {
    await createUser(values)
  }

  // 4. Render with shadcn Form components
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## File Splitting Strategy

### When to Split Files

| File Type | Keep Single | Consider Split | Must Split |
|-----------|-------------|----------------|------------|
| `queries.ts` | < 300 lines | 300-500 lines | > 500 lines |
| `mutations.ts` | < 300 lines | 300-500 lines | > 500 lines |
| `components/*` | < 200 lines | 200-400 lines | > 400 lines |

### Splitting Pattern
```
# Stage 1: Single file (< 300 lines)
api/
├── queries.ts
└── mutations.ts

# Stage 2: Grouped by domain (300-500 lines)
api/
├── queries/
│   ├── index.ts          # Re-export all
│   ├── appointments.ts
│   ├── staff.ts
│   └── services.ts
└── mutations/
    └── (same structure)

# Stage 3: Subfolder per domain (> 500 lines)
api/
└── queries/
    ├── index.ts
    ├── appointments/
    │   ├── index.ts
    │   ├── get-list.ts
    │   └── get-by-id.ts
    └── staff/
        └── (similar)
```

---

## Stack Patterns Documentation

Complete, standalone pattern documentation is in `docs/ruls/`:

| Pattern File | Coverage |
|-------------|----------|
| `00-INDEX.md` | Navigation hub and quick reference |
| `nextjs.md` | Next.js App Router, routing, caching |
| `react.md` | React hooks, Server Components, composition |
| `typescript.md` | Type safety, strict mode, generics |
| `supabase.md` | Auth, database, RLS, real-time |
| `ui.md` | shadcn/ui components, slot patterns |
| `forms.md` | React Hook Form + Zod validation |
| `architecture.md` | ENORAE feature structure, portals |
| `file-organization.md` | Canonical structure, splitting |

**Read pattern files when:**
- Building new features → `architecture.md`
- Querying database → `supabase.md`
- Creating forms → `forms.md`
- Building UI → `ui.md`
- Fixing types → `typescript.md`

---

## Available Agents

Specialized agents in `.claude/agents/` for code audits:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `performance-fixer` | Find performance bottlenecks | After major features |
| `security-fixer` | Security vulnerability audit | Before releases |
| `type-safety-fixer` | Type safety issues | Post-development |
| `ui-pattern-enforcer` | shadcn/ui compliance | UI work complete |
| `architecture-fixer` | Architecture violations | Code reviews |
| `form-validation-fixer` | Form pattern compliance | Form implementations |
| `accessibility-fixer` | A11y issues | UI components |
| `dead-code-fixer` | Unused code detection | Code cleanup |
| `import-dependency-fixer` | Import organization | After refactoring |

**Usage:** Agents are triggered automatically when relevant or via explicit request.

---

## Database Schema Sync Workflow

### When TypeScript Errors Reference Missing Database Properties

1. **Analyze:** Use the database schema analyzer agent
2. **Review:** Check `docs/schema-sync/` reports
3. **Fix:** Use database schema fixer agent
4. **Verify:** Run `pnpm typecheck`

**Key Rule:** Database is the source of truth. Code must conform to schema.

---

## Pre-Commit Checklist

Before committing:

1. ✅ `pnpm typecheck` - Must pass with 0 errors
2. ✅ Auth guards present - All queries/mutations check `getUser()`
3. ✅ Server directives - `'server-only'` in queries, `'use server'` in mutations
4. ✅ UI patterns - No typography imports, slots used as-is
5. ✅ Pages are thin - 5-15 lines maximum
6. ✅ No `any` types - TypeScript strict mode
7. ✅ Revalidate paths - Called after mutations
8. ✅ Read from views - Write to schema tables

---

## Common Workflows

### Creating a New Feature
1. Create: `features/{portal}/{feature}/`
2. Add structure: `components/`, `api/`, `types.ts`, `schema.ts`, `index.tsx`
3. Write queries in `api/queries.ts` (with `import 'server-only'`)
4. Write mutations in `api/mutations.ts` (with `'use server'`)
5. Build UI in `components/`
6. Export from `index.tsx`
7. Import in page: `app/{portal}/{route}/page.tsx`

### Adding a Database Query
1. Add to `features/{portal}/{feature}/api/queries.ts`
2. Include `import 'server-only'` at top
3. Verify auth with `getUser()`
4. Query from public view
5. Filter by tenant/user ID
6. Handle errors with proper types

### Regenerating Database Types
1. Make changes in Supabase dashboard
2. Run: `pnpm db:types`
3. Types generate to: `lib/types/database.types.ts`
4. Run: `pnpm typecheck` to verify

---

## Tech Stack Versions

- **Next.js:** 16.0.0 (App Router, Turbopack)
- **React:** 19.2.0 (Server/Client Components)
- **TypeScript:** 5.x (Strict mode)
- **Supabase:** 2.47.15 (`@supabase/ssr`)
- **Node.js:** 20.9.0+ required
- **Package Manager:** pnpm

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Validated at startup via `lib/env.ts` using Zod schemas.

---

## Detection Commands

Find common violations:

```bash
# Missing 'server-only' in queries.ts
rg "export async function" features/**/api/queries.ts -l | xargs -I {} sh -c "grep -L \"import 'server-only'\" {}"

# Missing 'use server' in mutations.ts
rg "export async function" features/**/api/mutations.ts -l | xargs -I {} sh -c "grep -L \"'use server'\" {}"

# Typography imports (should not exist)
rg "from '@/components/ui/typography'" --type tsx

# Using 'any' type
rg "\bany\b" --type ts --type tsx -g '!node_modules'

# Pages > 15 lines
find app -name 'page.tsx' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 15 ] && echo "$1: $lines lines"' _ {} \;
```

---

## Additional Resources

- **Setup Guide:** `README.md` - Comprehensive getting started
- **Pattern Docs:** `docs/ruls/` - All architectural patterns
- **Agent Docs:** `.claude/agents/` - Specialized agent documentation
- **Migration Summary:** `TURBOPACK_MIGRATION_SUMMARY.md` - Next.js upgrade notes

---

**Last Updated:** 2025-10-26
**Status:** Production-ready codebase with 0 TypeScript errors
