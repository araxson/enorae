# Rules Documentation (NEW)

**Last Updated:** 2025-11-03
**Status:** Production-Ready
**Source:** Context7 MCP + Existing Rules Migration

---

## Quick Start

**Read in this order:**

```
01-architecture.md  → File structure, naming, limits
02-typescript.md    → Type safety, strict mode, generics
03-react.md         → Server/Client Components, React 19 hooks
04-nextjs.md        → App Router, caching, async params
05-database.md      → Supabase schema, RLS, migrations
06-api.md           → Server Actions, Route Handlers, Zod validation
07-forms.md         → Zod-only validation, useActionState
08-ui.md            → shadcn/ui composition, Tailwind patterns
09-auth.md          → Supabase Auth, getUser vs getSession
```

**For new features:** Read 01 → 03 → 04 → 06 → 07
**For database work:** Read 05 → 06 → 09
**For UI work:** Read 08 → 03

---

## Stack Versions (from Context7)

| Technology | Version | Source |
|------------|---------|--------|
| **Next.js** | 15/16 (App Router) | `/vercel/next.js` |
| **React** | 19 | `/facebook/react` |
| **TypeScript** | 5.9.2 | `/microsoft/typescript` |
| **Supabase JS** | 2.47.15 | `/supabase/supabase` |
| **@supabase/ssr** | 0.6.1 | `/supabase/supabase` |
| **Tailwind CSS** | 4.0 | `/tailwindlabs/tailwindcss.com` |
| **shadcn/ui** | 0.9.0 | `/shadcn-ui/ui` |
| **Zod** | 3.24.2 | `/colinhacks/zod` |

---

## Exclusive Stack (FORBIDDEN Alternatives)

### Database
- ✅ **Supabase ONLY**
- ❌ Prisma, Drizzle, MongoDB, Firebase

### Auth
- ✅ **Supabase Auth ONLY**
- ❌ Auth0, Clerk, NextAuth, Lucia

### UI
- ✅ **shadcn/ui ONLY**
- ❌ Material-UI, Chakra UI, Ant Design, Headless UI

### Forms
- ✅ **Zod + Server Actions ONLY**
- ❌ React Hook Form (STRICTLY FORBIDDEN)
- ❌ Formik, Yup, VeeValidate

### Styling
- ✅ **Tailwind CSS**
- ❌ CSS Modules, Styled Components, Emotion, Sass

---

## Before-Writing-Code Checklist

### 1. File Placement (01-architecture.md)
- [ ] Does this file belong in `features/[portal]/[feature]/` or `lib/`?
- [ ] Is this a page, component, query, mutation, or type?
- [ ] Does a feature folder already exist for this?
- [ ] Will this file exceed 200 lines? (If yes, plan split now)

### 2. Type Safety (02-typescript.md)
- [ ] Am I using `unknown` instead of `any`?
- [ ] Do I need a type guard for runtime validation?
- [ ] Should I infer this type from Zod schema or Supabase types?
- [ ] Is strict mode enabled in tsconfig.json?

### 3. Component Type (03-react.md)
```
Server Component if:
  - Fetches data
  - No interactivity (useState, useEffect, event handlers)
  - No browser APIs

Client Component if:
  - Uses hooks (useState, useEffect, useActionState)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - Third-party libraries requiring 'use client'
```

### 4. Caching Strategy (04-nextjs.md)
```
revalidateTag('tag', 'max')  → After write operations (updateTag for immediate)
revalidatePath('/path', 'page') → After mutations affecting specific pages
unstable_cache(fn, keys, { tags }) → For expensive computations
```

### 5. Database Operations (05-database.md)
- [ ] Does this table have RLS enabled?
- [ ] Are RLS policies using `(select auth.uid())` for caching?
- [ ] Do I need a migration for this schema change?
- [ ] Have I generated TypeScript types after migration?
- [ ] Are there indexes on RLS-filtered columns?

### 6. API Pattern (06-api.md)
```
Server Action if:
  - Form submission
  - Mutation (create, update, delete)
  - Called from Client Component

Route Handler if:
  - REST API for external clients
  - Webhooks
  - Streaming responses
  - File downloads
```

### 7. Form Validation (07-forms.md)
- [ ] Is validation defined with Zod schema?
- [ ] Am I using `useActionState` for form state?
- [ ] Does the Server Action use `safeParse()` for validation?
- [ ] Are field-level errors displayed?
- [ ] Is the form accessible (ARIA labels, error announcements)?
- [ ] **Am I AVOIDING React Hook Form?** (FORBIDDEN)

### 8. UI Components (08-ui.md)
- [ ] Does shadcn/ui have a component for this? (Check with `npx shadcn@latest add`)
- [ ] Am I leaving slot `className` props pristine? (NO custom styling on Title/Description)
- [ ] Am I using semantic components? (Item/Empty/Field, not Card for everything)
- [ ] Mobile-first responsive design? (`sm:`, `md:`, `lg:`)
- [ ] Dark mode support? (`dark:` prefix)

### 9. Authentication (09-auth.md)
- [ ] Am I using `getUser()` (NOT `getSession()`) for server-side auth?
- [ ] Does middleware call `await supabase.auth.getUser()` to refresh session?
- [ ] Are protected routes using `redirect()` from `next/navigation`?
- [ ] Are RLS policies using `auth.uid()` for user isolation?

---

## Quick Reference Tables

### File Size Limits

| File Type | Max Lines | When to Split |
|-----------|-----------|---------------|
| `page.tsx` | 100 | Extract to components/ |
| Server Component | 200 | Extract logic to queries/ |
| Client Component | 200 | Split into smaller components |
| Server Action | 50 | One action per file |
| Query file | 150 | Split by domain/feature |
| Mutation file | 100 | One mutation per file |
| Type file | 300 | Split by domain |

### Component Triggers

| Need | Pattern | File |
|------|---------|------|
| Fetch data | Server Component with `cache()` | 03-react.md |
| Form submission | `useActionState` + Server Action | 07-forms.md |
| Optimistic update | `useOptimistic` hook | 03-react.md |
| Loading state | `<Suspense>` boundary | 03-react.md |
| Pending button | `useFormStatus` hook | 07-forms.md |
| User interaction | Client Component with `'use client'` | 03-react.md |
| API endpoint | Route Handler | 06-api.md |
| Webhook | Route Handler with signature verification | 06-api.md |

### Cache Invalidation

| Scenario | Command | File |
|----------|---------|------|
| After write | `updateTag('tag')` (immediate) | 04-nextjs.md |
| Specific page | `revalidatePath('/path', 'page')` | 04-nextjs.md |
| Layout tree | `revalidatePath('/path', 'layout')` | 04-nextjs.md |
| Background sync | `revalidateTag('tag', 'max')` | 04-nextjs.md |
| All cache | `revalidatePath('/', 'layout')` | 04-nextjs.md |

### Auth Context

| Context | Client Type | Method | File |
|---------|-------------|--------|------|
| Server Component | `createServerClient` | `getUser()` | 09-auth.md |
| Server Action | `createServerClient` | `getUser()` | 09-auth.md |
| Route Handler | `createServerClient` | `getUser()` | 09-auth.md |
| Middleware | `createServerClient` | `getUser()` + `updateSession` | 09-auth.md |
| Client Component | `createBrowserClient` | `getUser()` or `getSession()` | 09-auth.md |

### Validation

| Data Source | Pattern | File |
|-------------|---------|------|
| Form submission | `safeParse(Object.fromEntries(formData))` | 07-forms.md |
| API request | `safeParse(await request.json())` | 06-api.md |
| Query params | `safeParse({ id: params.id })` | 06-api.md |
| File upload | `z.instanceof(File).refine(...)` | 07-forms.md |

---

## Detection Commands

Run these to find violations in your codebase:

```bash
# Find oversized files
fd -e tsx -e ts -x wc -l {} \; | awk '$1 > 200 {print $2 " has " $1 " lines"}'

# Find React Hook Form usage (FORBIDDEN)
rg "react-hook-form|useForm\(|zodResolver" --type ts

# Find client-side database calls (FORBIDDEN)
rg "createClient.*cookies.*get.*set" app/ features/ --type tsx -A 3 | rg "useState|useEffect"

# Find getSession() usage (should be getUser())
rg "getSession\(\)" --type ts -g "!**/middleware.ts"

# Find missing 'use client' directives
rg "useState|useEffect|onClick|onChange" --type tsx -B 5 | rg -v "use client"

# Find Server Actions without 'use server'
rg "export async function.*FormData" --type ts -B 5 | rg -v "use server"

# Find RLS policies without auth.uid()
rg "CREATE POLICY|ALTER POLICY" supabase/migrations/ -A 10 | rg -v "auth\.uid\(\)"

# Find tables without RLS enabled
rg "CREATE TABLE" supabase/migrations/ | rg -v "ENABLE ROW LEVEL SECURITY"

# Find validation without Zod
rg "if.*\.length|if.*\.match|if.*typeof" features/ --type ts -g "**/mutations/*.ts" -g "**/actions/*.ts"
```

---

## Common Violations & Fixes

### 1. Wrong Client Type
❌ **WRONG:**
```tsx
'use client'
export default async function Page() {
  const data = await fetch('/api/data') // Client Components can't be async
}
```

✅ **CORRECT:**
```tsx
// Server Component (no directive needed)
export default async function Page() {
  const data = await fetch('/api/data')
  return <ClientList data={data} />
}
```

### 2. Missing Auth Guard
❌ **WRONG:**
```ts
'use server'
export async function deleteItem(id: string) {
  await supabase.from('items').delete().eq('id', id) // No auth check!
}
```

✅ **CORRECT:**
```ts
'use server'
export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  await supabase.from('items').delete().eq('id', id)
}
```

### 3. Client-Side Database Call
❌ **WRONG:**
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

export function DataList() {
  const [data, setData] = useState([])

  useEffect(() => {
    createClient().from('items').select('*').then(...)
  }, [])
}
```

✅ **CORRECT:**
```tsx
// Server Component fetches
async function DataList() {
  const supabase = await createClient()
  const { data } = await supabase.from('items').select('*')
  return <ClientList data={data} />
}

// Client Component receives props
'use client'
function ClientList({ data }: { data: Item[] }) {
  return <ul>{data.map(...)}</ul>
}
```

### 4. React Hook Form Usage
❌ **WRONG:**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function MyForm() {
  const form = useForm({ resolver: zodResolver(schema) })
}
```

✅ **CORRECT:**
```tsx
'use client'
import { useActionState } from 'react'

function MyForm() {
  const [state, action, pending] = useActionState(serverAction, null)
  return <form action={action}>...</form>
}
```

### 5. Slot Styling Override
❌ **WRONG:**
```tsx
import { Card, CardTitle } from '@/components/ui/card'

<Card>
  <CardTitle className="text-red-500">Title</CardTitle> {/* NO! */}
</Card>
```

✅ **CORRECT:**
```tsx
import { Card, CardTitle } from '@/components/ui/card'

<Card>
  <CardTitle>Title</CardTitle>
  <div className="text-red-500">Custom content</div>
</Card>
```

---

## Migration from Old Rules

### What Changed?

| Old File | New File(s) | Key Changes |
|----------|-------------|-------------|
| `architecture.md` | `01-architecture.md` | Next.js 15/16 App Router patterns, async params, file size limits |
| `typescript.md` | `02-typescript.md` | TypeScript 5.x features (`const` type params, `satisfies`), Supabase types |
| `react.md` | `03-react.md` | React 19 hooks (useActionState, useOptimistic), Server/Client split |
| `nextjs.md` | `04-nextjs.md` | Next.js 16 breaking changes, updateTag vs revalidateTag, async params |
| `supabase.md` | `05-database.md` + `09-auth.md` | Split into database and auth concerns, RLS optimization, getClaims() |
| `forms.md` | `07-forms.md` | **ELIMINATED React Hook Form**, Zod-only validation, useActionState |
| `ui.md` | `08-ui.md` | shadcn/ui v0.9.0 new components, Tailwind CSS v4, slot styling rules |
| N/A | `06-api.md` | **NEW** - Server Actions vs Route Handlers decision tree, Zod validation |

### Breaking Changes to Note

**Next.js 16:**
- `params` and `searchParams` are now `Promise<T>` (must `await`)
- `revalidateTag(tag, 'max')` requires cache profile
- `revalidatePath(path, 'page')` requires type parameter
- Supabase `createClient()` is async (must `await`)

**React 19:**
- `useFormState` renamed to `useActionState`
- `useOptimistic` replaces manual optimistic patterns
- `useFormStatus` replaces custom pending state logic

**Forms:**
- React Hook Form is now **FORBIDDEN**
- All forms use native HTML + Server Actions
- Validation is server-side with Zod `safeParse()`

**shadcn/ui:**
- Use semantic components (Item/Empty/Field) over generic Card
- Slot styling is **FORBIDDEN** (no `className` on Title/Description)
- New components: Spinner, Kbd, ButtonGroup, InputGroup, Field, Item, Empty

---

## File Structure Summary

```
docs/rules/
├── old files...         # Original rules (UNTOUCHED)
└── new/
    ├── readme.md                 # This file
    ├── 01-architecture.md        # 35KB - File structure, naming, limits
    ├── 02-typescript.md          # 29KB - Type safety, strict mode
    ├── 03-react.md               # 24KB - Server/Client, React 19 hooks
    ├── 04-nextjs.md              # 23KB - App Router, caching, async
    ├── 05-database.md            # 25KB - Supabase, RLS, migrations
    ├── 06-api.md                 # 30KB - Server Actions, validation
    ├── 07-forms.md               # 24KB - Zod validation, useActionState
    ├── 08-ui.md                  # 25KB - shadcn/ui, Tailwind patterns
    └── 09-auth.md                # 30KB - Supabase Auth, session mgmt
```

**Total:** 9 files, 245KB of comprehensive documentation

---

## Context7 Libraries Used

All documentation is based on the latest official sources:

1. **Next.js** - `/vercel/next.js` (v15/16 App Router)
2. **React** - `/facebook/react` (v19)
3. **TypeScript** - `/microsoft/typescript` (v5.9.2)
4. **Supabase** - `/supabase/supabase` (JS 2.47.15, SSR 0.6.1)
5. **Zod** - `/colinhacks/zod` (v3.24.2)
6. **Tailwind CSS** - `/tailwindlabs/tailwindcss.com` (v4.0)
7. **shadcn/ui** - `/shadcn-ui/ui` (v0.9.0)

---

## Success Criteria

- [x] 9 files created in `docs/rules/`
- [x] readme.md created
- [x] All files follow template structure
- [x] Context7 data fetched for all topics
- [x] Original files in `docs/rules/` untouched
- [x] Decision trees in all files
- [x] FORBIDDEN sections in all files
- [x] Detection commands in all files
- [x] Real, production-ready examples (no placeholders)
- [x] Stack-specific (Supabase, Zod, shadcn/ui, Next.js 15/16)

---

## How to Use This Documentation

### For Developers
1. **Before coding:** Run through the "Before-Writing-Code Checklist" above
2. **During coding:** Reference the specific pattern file (01-09)
3. **After coding:** Run detection commands to find violations
4. **Before PR:** Review "Common Violations & Fixes" section

### For AI Code Assistants
1. **Read files in order** for comprehensive understanding
2. **Use Quick Reference Tables** for instant pattern lookup
3. **Check FORBIDDEN sections** before suggesting solutions
4. **Run Detection Commands** to validate suggested changes
5. **Reference specific pattern numbers** (e.g., "Pattern 3 from 03-react.md")

### For Code Reviews
1. **Check file placement** against 01-architecture.md
2. **Verify type safety** against 02-typescript.md patterns
3. **Validate auth patterns** against 09-auth.md (getUser vs getSession)
4. **Confirm no FORBIDDEN libraries** (React Hook Form, other UI libs, etc.)
5. **Run detection commands** to catch missed violations

---

## Next Steps

1. **Review each file** (01-09) to ensure accuracy and completeness
2. **Run detection commands** on current codebase to find violations
3. **Update team documentation** to reference these new rules
4. **Create migration plan** for existing code violating new patterns
5. **Integrate into CI/CD** (run detection commands as pre-commit hooks)

---

**Documentation generated on 2025-11-03 by 9 parallel rules-upgrader agents using Context7 MCP.**
