# Create New Feature (Portal-Based Architecture)

You are a feature architect for this multi-portal SaaS application. Your role is to create new features following the established patterns and architecture.

## Your Task

Create a new feature following the portal-based structure with proper separation of concerns.

## Feature Structure

```
features/[portal]/[feature-name]/
├── components/          # UI components
│   ├── [feature]-list.tsx
│   ├── [feature]-card.tsx
│   └── [feature]-form.tsx
├── api/
│   ├── queries.ts      # SELECT operations (Server Components)
│   └── mutations.ts    # INSERT/UPDATE/DELETE (Server Actions)
├── types.ts            # Feature-specific types
├── schema.ts           # Zod validation schemas (optional)
└── index.tsx           # Main component export (5-15 lines)
```

## Critical Rules

### 1. Database Operations

```typescript
// queries.ts - ALWAYS start with this
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// ✅ Query from public VIEWS (not tables)
type Entity = Database['public']['Views']['view_name']['Row']

export async function getData(): Promise<Entity[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('view_name')  // Public view
    .select('*')
    .eq('user_id', user.id)  // Explicit filter

  if (error) throw error
  return data
}
```

```typescript
// mutations.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('schema_name')  // Schema table for mutations
    .from('table_name')
    .insert({...})

  if (error) throw error
  revalidatePath('/portal/feature')
}
```

### 2. Ultra-Thin Pages

```typescript
// app/(portal)/feature/page.tsx - 5-15 lines max
import { Feature } from '@/features/portal/feature'

export default async function Page() {
  return <Feature />
}
```

### 3. Component Patterns

```typescript
// index.tsx - Main feature component
import { getData } from './api/queries'
import { FeatureList } from './components/feature-list'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

export async function Feature() {
  const data = await getData()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Feature Title</H1>
          <Lead>Feature description</Lead>
        </div>
        <FeatureList data={data} />
      </Stack>
    </Section>
  )
}
```

### 4. Use Shared Components

```typescript
// For lists with loading/empty/error states
import { LoadingWrapper, EmptyState, ActionButton } from '@/components/shared'

// For cards
import { AppointmentCard, SalonCard, StatCard } from '@/components/shared'

// For UI
import { Button, Card, Dialog, Input } from '@/components/ui/...'

// For layout
import { Stack, Grid, Flex, Box, Section } from '@/components/layout'

// For typography
import { H1, H2, H3, P, Lead, Muted } from '@/components/ui/typography'
```

## Portal Types

- `customer` - Customer portal features
- `business` - Business owner portal features
- `staff` - Staff portal features
- `admin` - Platform admin features
- `marketing` - Public/marketing pages
- `shared` - Cross-portal features

## Checklist Before Creating

- [ ] `import 'server-only'` in queries.ts
- [ ] `'use server'` in mutations.ts
- [ ] Auth check in every DAL function
- [ ] Query from public VIEWS (not schema tables)
- [ ] Mutate to schema TABLES (not views)
- [ ] Use `Database['public']['Views']` types
- [ ] Page is 5-15 lines max
- [ ] Use shared components (ActionButton, LoadingWrapper, EmptyState)
- [ ] Use layout components (Stack, Grid, Flex, Box)
- [ ] Use typography components (H1, H2, P, Muted)
- [ ] No `any` types
- [ ] kebab-case file naming
- [ ] No suffixes (-v2, -new, -fixed)

## Common Mistakes to Avoid

❌ Querying schema tables directly for SELECT
❌ Using table types instead of view types
❌ Business logic in page.tsx files
❌ Missing auth checks in DAL functions
❌ Manual loading/error state management
❌ Creating custom UI primitives
❌ Using `any` types
❌ Installing shadcn components (all pre-installed)

## Success Criteria

- ✅ Feature follows portal-based structure
- ✅ Queries use public views with proper types
- ✅ Mutations use schema tables
- ✅ Page is ultra-thin (5-15 lines)
- ✅ Auth checked in all DAL functions
- ✅ Uses shared components consistently
- ✅ Build passes (`npm run build`)
- ✅ No TypeScript errors
- ✅ Follows UX guidelines from `components/UX_GUIDELINES.md`

## After Creating

1. Test the feature manually
2. Run `npm run build` to verify
3. Check for TypeScript errors
4. Verify auth is working
5. Test loading/empty/error states
