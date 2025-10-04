# 🚀 ENORAE - AI Development Guidelines

> **Salon Booking Platform - Multi-Tenant SaaS**
> **Stack**: Next.js 15.5.4, React 19, TypeScript 5.6, Supabase, Tailwind CSS 4
> **Database**: Multi-schema architecture with public views, functions, and RLS policies
> **UI**: All shadcn/ui components pre-installed

---

## 🚨 CRITICAL RULES

### 1. Database: Views for SELECT, Schema for Mutations
```typescript
// ✅ SELECT: Query public views
await supabase.from('appointments').select('*')

// ✅ MUTATIONS: Use schema tables
await supabase.schema('scheduling').from('appointments').insert({...})
```

### 2. Types: ALWAYS Use Views (Never Tables)
```typescript
// ✅ CORRECT
type Salon = Database['public']['Views']['salons']['Row']

// ❌ FORBIDDEN
type Salon = Database['public']['Tables']['salons']['Row']
```

### 3. Pages: Ultra-Thin (5-15 lines max)
```typescript
// ✅ CORRECT
export default async function Page() {
  return <FeatureComponent />
}

// ❌ NO data fetching or business logic in pages
```

### 4. Auth: Check in EVERY DAL Function
```typescript
// ✅ MANDATORY
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')
```

---

## ⚠️ COMMON AI MISTAKES

### Mistake #1: Creating Unnecessary Files
**Rule**: NEVER create files with suffixes like `-v2`, `-new`, `-fixed`, `-old`, `-temp`

### Mistake #2: Verbose Responses
**Rule**: Be concise. No preambles. No summaries unless asked.

### Mistake #3: Installing Already-Installed Components
**Rule**: ALL shadcn/ui components are pre-installed. Just import them.

### Mistake #4: Creating Custom UI Primitives
**Rule**: Use shadcn/ui components. Compose them, don't recreate them.

### Mistake #5: Not Using Layout Components
**Rule**: Always use layout components for consistent spacing.

### Mistake #6: Not Using Typography Components
**Rule**: Always use typography components (H1, H2, P, Muted, etc.).

### Mistake #7: Missing 'server-only' Directive
**Rule**: EVERY DAL file MUST start with `import 'server-only'`

### Mistake #8: Missing Auth Checks
**Rule**: EVERY DAL function MUST check auth before queries.

### Mistake #9: Creating Tailwind Config File
**Rule**: Tailwind CSS 4 uses CSS-only config. NO tailwind.config files.

### Mistake #10: Not Wrapping auth.uid() in RLS Policies
```sql
-- ❌ SLOW (171ms)
using ( auth.uid() = owner_id );

-- ✅ FAST (9ms) - 94% better performance
using ( (select auth.uid()) = owner_id );
```

### Mistake #11: Using 'any' Types
**Rule**: NEVER use `any`. Always use proper types from database.types.

### Mistake #12: Business Logic in Pages
**Rule**: Pages MUST be 5-15 lines. Only render feature components.

---

## 📋 QUICK REFERENCE

### Database
- **Multiple schemas** (organization, catalog, scheduling, inventory, identity, communication, analytics, engagement)
- **Public views** for all query operations (use Supabase MCP to discover available views)
- **Database functions** and **role-based access control** across all portals

### Type System
```typescript
import type { Database } from '@/lib/types/database.types'

// ✅ ALWAYS use Views (not Tables)
type Salon = Database['public']['Views']['salons']['Row']
```

### Query Pattern
```typescript
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('view_name')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw error
  return data
}
```

### Feature Structure (Portal-Based)
```
features/
├── customer/          # Customer portal features
├── business/          # Business portal features
├── staff/             # Staff portal features
├── admin/             # Platform admin features
├── marketing/         # Marketing/landing pages
└── shared/            # Cross-portal features

[portal]/[feature]/
├── components/        # UI components
├── api/               # Data operations
│   ├── queries.ts    # SELECT (Server Components)
│   └── mutations.ts  # INSERT/UPDATE/DELETE (Server Actions)
├── types.ts           # Feature types
├── schema.ts          # Zod validation
└── index.tsx          # Main component export
```

### Available UI Components (Pre-installed)
- **Forms**: Button, Input, Label, Select, Checkbox, Radio, Switch, Slider, Textarea
- **Layout**: Card, Separator, Tabs, Dialog, Sheet, Drawer, Popover, Stack, Grid, Flex, Box, Section
- **Typography**: H1, H2, H3, H4, P, Lead, Large, Small, Muted
- **Navigation**: Menu, Dropdown, Command, Breadcrumb
- **Feedback**: Alert, Toast, Progress, Skeleton, Badge
- **Data**: Table, Avatar, Calendar, Carousel, Chart
- **Shared**: AppointmentCard, SalonCard, StatCard

---

## 🎯 PROJECT OVERVIEW

**Enorae** is a modern salon booking platform with role-based access.

### Tech Stack
- **Frontend**: Next.js 15.5.4, React 19.1.0, TypeScript 5.6
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Deployment**: Vercel, Supabase Cloud

### Architecture: Single Next.js App with Multiple Portals

```
app/
├── (marketing)/    → Public pages
├── (customer)/     → Customer portal
├── (staff)/        → Staff portal
├── (business)/     → Business dashboard
└── (admin)/        → Platform admin
```

---

## 🗄️ DATABASE ARCHITECTURE

### Business Domain Schemas

| Schema | Purpose |
|--------|---------|
| **organization** | Salons, staff, locations, chains |
| **catalog** | Services, categories, pricing |
| **scheduling** | Appointments, schedules, availability |
| **inventory** | Products, stock, suppliers |
| **identity** | Users, profiles, roles |
| **communication** | Messages, notifications |
| **analytics** | Metrics, reports, insights |
| **engagement** | Favorites |

### Public Views (Query Layer)

**CRITICAL**: Query from public views ONLY, never from schema tables.

**Available Views**:
Public views aggregate data across schemas with complete type definitions, RLS policies, and optimized joins. Use Supabase MCP tools to discover all available views.

**Common Views Include**:
- `appointments` - Booking information with related entities
- `salons` - Salon details with locations and ratings
- `services` - Service catalog with pricing
- `staff` - Staff members with schedules and services
- `profiles` - User profiles with roles
- And more... (use `list_tables` MCP tool to see all)

**Why Views?**
- ✅ Complete type definitions (cross-schema foreign keys)
- ✅ RLS policies applied
- ✅ Optimized joins
- ✅ Stable API

---

## 🎭 ROLES & PERMISSIONS

### Platform
- `super_admin` - Full system access
- `platform_admin` - Platform management

### Business
- `tenant_owner` - Multi-salon chain owner
- `salon_owner` - Single salon owner
- `salon_manager` - Salon manager

### Staff
- `senior_staff`, `staff`, `junior_staff`

### Customer
- `vip_customer`, `customer`, `guest`

### Default Routes
- Admin → `/admin`
- Business → `/business`
- Staff → `/staff`
- Customer → `/explore`

---

## 🚨 CRITICAL RULES

### Rule 1: Database Operations

```typescript
// ✅ Use Supabase MCP tools for database operations
// ✅ Query from public views only
// ✅ Add explicit filters (helps RLS)
// ❌ Never query schema tables directly
// ❌ Never create/modify schema without permission

const { data } = await supabase
  .from('appointments')
  .select('*')
  .eq('user_id', user.id)
```

### Rule 2: Type System

```typescript
// ✅ CORRECT
type Salon = Database['public']['Views']['salons']['Row']

// ❌ FORBIDDEN
type Salon = Database['public']['Tables']['salons']['Row']
const salon: any = await getSalon(id)
```

### Rule 3: Page Architecture

```typescript
// ✅ CORRECT - Ultra-thin (5-15 lines)
export default async function Page() {
  return <FeatureComponent />
}

// ✅ With params
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <FeatureDetail slug={slug} />
}

// ❌ NO data fetching, business logic, or complex layout in pages
```

### Rule 4: Data Layer Pattern

```typescript
// features/[portal]/[feature]/api/queries.ts
import 'server-only'  // MANDATORY - First line
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

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
// features/[portal]/[feature]/api/mutations.ts
'use server'  // Server Action
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
  revalidatePath('/path')
}
```

**Checklist**:
- [ ] `import 'server-only'` in queries.ts
- [ ] `'use server'` in mutations.ts
- [ ] Auth check in every function
- [ ] Views for SELECT, schema for mutations
- [ ] Typed return values
- [ ] No `any` types

### Rule 5: UI Components

```typescript
// ✅ Use shadcn/ui (pre-installed)
import { Button, Card, Dialog, Input } from '@/components/ui/...'
import { Stack, Grid, Flex, Box } from '@/components/layout'
import { H1, P, Muted } from '@/components/ui/typography'

// ❌ Don't create custom primitives
// ❌ Don't install shadcn components
```

### Rule 6: Styling (Tailwind CSS 4)

```css
/* ✅ All config in app/globals.css */
@theme inline {
  --color-primary: var(--primary);
}

/* ❌ NO tailwind.config.ts */
```

### Rule 7: File Naming

```
✅ CORRECT: features/salon-discovery/components/salon-card.tsx
❌ WRONG: features/salonDiscovery/components/SalonCard-v2.tsx
```

- Folders/files: `kebab-case`
- DAL: `[feature].queries.ts`
- Actions: `[feature].actions.ts`
- NO suffixes: `-v2`, `-new`, `-fixed`

### Rule 8: Authentication & RLS

```typescript
// ✅ Auth check in every DAL function
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')
```

```sql
-- ✅ Fast RLS (wrap auth.uid)
create policy "user_access" on table_name
to authenticated
using ( (select auth.uid()) = user_id );
```

---

## 📐 LAYOUT SYSTEM

### Components
```typescript
import { Box, Container, Section, Spacer } from '@/components/layout'
import { Flex, Stack, Group } from '@/components/layout'
import { Grid } from '@/components/layout'
import { Center, Divider } from '@/components/layout'
```

### Spacing Scale
| Size | Value | Pixels |
|------|-------|--------|
| `xs` | 0.5rem | 8px |
| `sm` | 1rem | 16px |
| `md` | 1.5rem | 24px |
| `lg` | 2rem | 32px |
| `xl` | 2.5rem | 40px |

### Common Patterns
```typescript
// Page Layout
<Section size="lg">
  <Stack gap="xl">
    <Box><H1>Title</H1></Box>
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {/* Content */}
    </Grid>
  </Stack>
</Section>

// Card Layout
<Card>
  <Stack gap="md" p="lg">
    <H3>Title</H3>
    <Divider />
    <P>Content</P>
    <Flex justify="end" gap="sm">
      <Button variant="outline">Cancel</Button>
      <Button>Submit</Button>
    </Flex>
  </Stack>
</Card>
```

---

## 🎨 QUICK PATTERNS

### Feature Component (index.tsx)
```typescript
// features/[portal]/[feature]/index.tsx
import { getData } from './api/queries'
import { FeatureList } from './components/feature-list'

export async function Feature() {
  const data = await getData()
  return <FeatureList data={data} />
}
```

### Client Component
```typescript
'use client'
import { useState } from 'react'

export function Filters() {
  const [search, setSearch] = useState('')
  return <Input value={search} onChange={e => setSearch(e.target.value)} />
}
```

---

## ✅ BEFORE YOU CODE

**Database**
- [ ] Querying public views (not schema tables)
- [ ] Using `Database['public']['Views']` types

**Pages**
- [ ] Page is 5-15 lines max
- [ ] No business logic, only renders feature component

**Data Layer**
- [ ] `import 'server-only'` in queries.ts
- [ ] `'use server'` in mutations.ts
- [ ] Auth check in every function
- [ ] No `any` types

**Components**
- [ ] Using shadcn/ui components (pre-installed)
- [ ] Using layout components (Stack, Grid, Flex, Box)
- [ ] Using typography (H1, H2, P, Muted)

**Files**
- [ ] kebab-case naming
- [ ] No suffixes (-v2, -new, -fixed)
- [ ] No tailwind.config.ts

---

## 🎯 PRINCIPLES

1. **Simplicity** - Use what exists
2. **Type Safety** - No `any`, ever
3. **Security** - Auth in every function
4. **Consistency** - Follow patterns exactly
5. **Minimal** - Be concise

---

**Version**: 3.0.0 | **Last Updated**: 2025-10-02
