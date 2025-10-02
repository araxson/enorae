ABSLOUTLY DO NOT CREATE .md files

# 🚀 ENORAE - AI Development Guidelines

> **Salon Booking Platform - Single Next.js App**
> **Last Updated**: 2025-10-01 (Next.js 15.5.4 installed)
> **Database**: 42 tables, 108 functions, 8 business domains, 11 roles
> **Architecture**: Single App with 4 Role-Based Portals
> **UI**: All shadcn/ui components pre-installed, Tailwind CSS 4

---

## 🎯 PROJECT OVERVIEW

**Enorae** is a modern salon booking platform built with Next.js 15 and Supabase.

### Tech Stack
- **Frontend**: Next.js 15.5.4 (App Router), React 19.1.0, TypeScript 5.6
- **Styling**: Tailwind CSS 4 (no config needed), shadcn/ui (all components installed)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Type Safety**: TypeScript strict mode, Zod validation
- **Deployment**: Vercel (Frontend), Supabase Cloud (Backend)
- **Layout System**: Custom layout components in `components/layout/` for consistency

---

## 🏗️ ARCHITECTURE: SINGLE NEXT.JS APP

### Why Single App?
✅ One database, one connection
✅ Simple deployment (one Vercel project)
✅ All domains tightly integrated
✅ Faster development
✅ Can scale to millions of users

### 4 Route Groups (Role-Based Portals):
```
app/
├── (marketing)/     → Public pages (unauthenticated)
├── (customer)/      → Customer portal (customer, vip_customer, guest)
├── (staff)/         → Staff portal (senior_staff, staff, junior_staff)
├── (business)/      → Business dashboard (tenant_owner, salon_owner, salon_manager)
└── (admin)/         → Platform admin (super_admin, platform_admin)
```

---

## 📁 PROJECT STRUCTURE PATTERN

**📖 See Complete Pattern**: `docs/CLEAN_STRUCTURE_PATTERN.md`

### High-Level Overview

```
project-root/
├── app/                          # Next.js App Router - ROUTES ONLY
│   ├── (portal-name)/           # Route group = Portal
│   │   ├── [feature]/           # Feature routes
│   │   │   └── page.tsx         # Ultra-thin page (5-15 lines)
│   │   ├── layout.tsx           # Portal layout
│   │   ├── error.tsx            # Error boundary
│   │   └── loading.tsx          # Loading state
│   └── globals.css              # Global styles
│
├── features/                     # BUSINESS LOGIC - Feature Modules
│   └── [feature-name]/          # One complete feature
│       ├── components/          # Feature UI components
│       ├── dal/                 # Data Access Layer
│       │   └── [feature].queries.ts
│       ├── actions/             # Server Actions
│       │   └── [feature].actions.ts
│       ├── hooks/              # React hooks (optional)
│       ├── lib/                # Feature utilities (optional)
│       ├── schemas/            # Zod validation (optional)
│       └── index.tsx           # Main export (Server Component)
│
├── components/                  # SHARED UI COMPONENTS
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/                 # Layout components (Box, Stack, Grid, etc.)
│   ├── shared/                 # Compound components (Cards, etc.)
│   └── typography/             # Text components (H1-H6, P, etc.)
│
├── lib/                        # SHARED UTILITIES
│   ├── supabase/              # Database clients
│   ├── types/                 # TypeScript types
│   ├── validations/           # Zod schemas
│   ├── utils/                 # Helper functions
│   ├── constants/             # App constants
│   └── hooks/                 # Global hooks
│
├── supabase/                   # DATABASE & BACKEND
│   ├── migrations/            # Schema migrations
│   └── config.toml           # Supabase config
│
├── docs/                       # DOCUMENTATION
│   ├── CLEAN_STRUCTURE_PATTERN.md  # ⭐ Complete structure guide
│   ├── 02-architecture/       # Architecture docs
│   ├── 03-database/          # Database docs
│   └── 04-frontend/          # Frontend docs
│
└── scripts/                    # Utility scripts
```

### Feature Module Pattern

**Core structure (required)**:

```
features/[feature-name]/
├── components/                  # Feature-specific UI (as needed)
│   └── [component-name].tsx    # Any components this feature needs
│
├── dal/                        # Data Access Layer (required)
│   └── [feature].queries.ts    # All database queries
│
├── actions/                    # Server Actions (if feature has mutations)
│   └── [feature].actions.ts    # Create, update, delete operations
│
└── index.tsx                   # Main export (required)
```

**Optional additions**:

```
├── hooks/                      # If feature needs custom hooks
│   └── use-[feature].ts
├── lib/                        # If feature needs utilities
│   └── [feature].utils.ts
├── schemas/                    # If feature needs validation
│   └── [feature].schemas.ts
└── types/                      # If feature needs custom types
    └── [feature].types.ts
```

**Component naming examples** (use what makes sense for your feature):
- `[feature]-list.tsx` - List/table view
- `[feature]-grid.tsx` - Grid view
- `[feature]-card.tsx` - Card component
- `[feature]-form.tsx` - Create/edit form
- `[feature]-detail.tsx` - Detail/modal view
- `[feature]-filters.tsx` - Filter controls
- `[name].client.tsx` - Client-side component

**📖 For complete patterns, naming conventions, and examples, see**: `docs/CLEAN_STRUCTURE_PATTERN.md`

---

## 🗄️ DATABASE ARCHITECTURE

### 8 Business Domain Schemas:

| Schema | Tables | Functions | Purpose |
|--------|--------|-----------|---------|
| **organization** | 8 | 8 | Salons, staff, locations, settings |
| **catalog** | 5 | 20 | Services, pricing, categories |
| **scheduling** | 5 | 19 | Appointments, schedules, availability |
| **inventory** | 11 | 2 | Products, stock, suppliers |
| **identity** | 5 | 21 | Users, profiles, roles, auth |
| **communication** | 3 | 14 | Messages, notifications |
| **analytics** | 3 | 20 | Metrics, reports, insights |
| **engagement** | 1 | 4 | Favorites |
| **TOTAL** | **42** | **108** | - |

### Public Schema (Query Layer):
- **10 queryable views** for querying (appointments, blocked_times, customer_favorites, profiles, salons, services, staff, staff_schedules, staff_services, user_roles)
- Maps to underlying domain tables
- **ALWAYS query from public views, NEVER direct schema tables**

---

## 🎭 ROLES (11 Total)

### Platform (2):
- `super_admin` - Full system access
- `platform_admin` - Platform management

### Business (3):
- `tenant_owner` - Multi-salon chain owner
- `salon_owner` - Single salon owner
- `salon_manager` - Salon manager

### Staff (3):
- `senior_staff` - Senior stylist/technician
- `staff` - Regular staff member
- `junior_staff` - Junior/trainee staff

### Customer (3):
- `vip_customer` - VIP/premium customer
- `customer` - Regular customer
- `guest` - Guest/anonymous user

---

## ⚠️ CRITICAL RULES - ZERO TOLERANCE

### 1. DATABASE RULES

```typescript
// ❌ NEVER create new tables or schemas
CREATE TABLE ... // FORBIDDEN

// ❌ NEVER modify database structure without permission
ALTER TABLE ... // ASK USER FIRST

// ✅ ALWAYS use public views for queries
const { data } = await supabase.from('appointments').select('*')

// ❌ NEVER query schema tables directly
const { data } = await supabase.schema('scheduling').from('appointments')
```

**Why?** Supabase type generator omits cross-schema foreign keys from Tables types. Only public Views have complete relationship definitions.

### 2. TYPE SYSTEM RULES

```typescript
// ✅ CORRECT - Import from lib/types
import type { Database } from '@/lib/types/database.types'
type Salon = Database['public']['Views']['salons']['Row']

// ❌ FORBIDDEN - Custom types for database entities
interface Salon { id: string; name: string }

// ❌ FORBIDDEN - Any types
const salon: any = await getSalon()

// ✅ CORRECT - Use Views types (not Tables)
type Appointment = Database['public']['Views']['appointments']['Row']
```

### 3. UI COMPONENT RULES

```typescript
// ✅ CORRECT - Use shadcn/ui components (ALL components are already installed)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

// ✅ CORRECT - Use layout components for consistent spacing and structure
import { Flex, Stack, Grid } from '@/components/layout'
import { Container, Section, Box } from '@/components/layout'
import { Center, Divider, Spacer } from '@/components/layout'

// Example: Page layout with proper structure
<Section size="lg">
  <Stack gap="xl">
    <Box>
      <h1>Page Title</h1>
      <p>Description</p>
    </Box>
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {/* Content cards */}
    </Grid>
  </Stack>
</Section>

// ❌ FORBIDDEN - Create custom UI primitives
// Don't create custom Button, Input, Card, Dialog components

// ❌ FORBIDDEN - Install new shadcn components (all are already installed)
// npx shadcn add button  // DON'T DO THIS - already installed

// ✅ ALLOWED - Compose shadcn components for features
// features/booking/components/booking-wizard.tsx (uses shadcn primitives)

// ✅ REQUIRED - Use layout components for consistent spacing
// See components/layout/ for available components
// See components/layout/README.md for usage patterns
```

**CRITICAL**: All shadcn/ui components are pre-installed. Never run `npx shadcn add [component]`.
**REQUIRED**: Always use layout components from `@/components/layout` for consistent spacing and structure.

### 4. STYLING & TAILWIND CSS 4 RULES

```css
/* ✅ CORRECT - Tailwind CSS 4 syntax (app/globals.css) */
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
}

/* ✅ CORRECT - Use CSS variables for theming */
:root {
  --primary: oklch(0.205 0 0);
  --radius: 0.625rem;
}

.dark {
  --primary: oklch(0.922 0 0);
}
```

**CRITICAL TAILWIND 4 RULES**:
- ❌ NO tailwind.config.ts file (not needed in Tailwind 4)
- ✅ All configuration in `app/globals.css` using `@theme inline`
- ✅ Use CSS variables for theming (`--color-*`, `--radius-*`)
- ✅ Dark mode via `.dark` class selector
- ✅ Use `@import "tw-animate-css"` for animations
- ❌ Never create tailwind.config.ts or tailwind.config.js

### 5. FILE NAMING RULES

```typescript
// ✅ Folders: kebab-case
salon-discovery/
staff-management/

// ✅ Components: kebab-case.tsx
salon-card.tsx
booking-form.tsx

// ✅ DAL: [feature].queries.ts
salon.queries.ts
booking.queries.ts

// ✅ Actions: [feature].actions.ts
salon.actions.ts

// ❌ NEVER use suffixes: -fixed, -v2, -new, -old, -temp
```

### 6. PAGE ARCHITECTURE RULES (ULTRA-THIN)

```typescript
// ✅ CORRECT - Ultra-thin page (5-15 lines max)
// app/(customer)/salons/page.tsx
import { SalonDiscovery } from '@/features/salon-discovery'

export default async function SalonsPage() {
  return <SalonDiscovery />
}

// ❌ FORBIDDEN - Business logic in page
export default async function SalonsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('salons').select('*')
  return <div>{data.map(...)}</div>
}

// ❌ FORBIDDEN - Data manipulation in page
export default async function SalonsPage() {
  const salons = await getSalons()
  const filtered = salons.filter(s => s.active)
  return <div>{filtered.map(...)}</div>
}

// ❌ FORBIDDEN - Complex layout in page
export default async function SalonsPage() {
  return (
    <div className="container">
      <div className="grid grid-cols-3">
        {/* 50 lines of JSX */}
      </div>
    </div>
  )
}
```

**CRITICAL**: Pages MUST be 5-15 lines max. NO business logic. NO data fetching. NO layout composition. ONLY render feature components. See **📄 PAGE ARCHITECTURE (ULTRA-THIN PATTERN)** section for complete rules.

---

## 📋 DATA ACCESS LAYER (DAL) PATTERN

Every feature has a DAL with this pattern:

```typescript
// features/[feature]/dal/[feature].queries.ts
import 'server-only'  // ⚠️ MANDATORY
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

export async function getSalons() {
  // 1. Create client
  const supabase = await createClient()

  // 2. Check auth (MANDATORY)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 3. Query from public views with explicit filter
  const { data, error } = await supabase
    .from('salons')  // public view
    .select('*')
    .eq('owner_id', user.id)  // Explicit filter helps RLS

  if (error) throw error
  return data
}
```

### DAL Rules:
1. ✅ Always add `'server-only'` directive
2. ✅ Always check auth first
3. ✅ Always query from public views
4. ✅ Always add explicit filters (helps RLS + query planner)
5. ✅ Always handle errors

---

## 🔐 RLS BEST PRACTICES (CRITICAL)

### Performance Pattern:

```sql
-- ❌ SLOW - Function called per row (171ms)
create policy "user_access" on todos
using ( auth.uid() = user_id );

-- ✅ FAST - Function called once (9ms) - 94% faster
create policy "user_access" on todos
to authenticated
using ( (select auth.uid()) = user_id );
```

### Always:
1. ✅ Wrap `auth.uid()` in `(select auth.uid())`
2. ✅ Specify `TO authenticated` role
3. ✅ Add indexes on RLS columns (`user_id`, `salon_id`)
4. ✅ Use explicit filters in queries (`.eq('user_id', user.id)`)

**📖 SEE**: `docs/SUPABASE_BEST_PRACTICES.md` for complete guide

---

## 📐 LAYOUT SYSTEM

### Available Layout Components

```typescript
// Core Primitives
import { Box, Container, Section, Spacer } from '@/components/layout'

// Flexbox
import { Flex, Stack, Group } from '@/components/layout'

// Grid
import { Grid } from '@/components/layout'

// Utilities
import { Center, Divider, VisuallyHidden } from '@/components/layout'
```

### Spacing Scale

- `none`: 0
- `xs`: 0.5rem (8px)
- `sm`: 1rem (16px)
- `md`: 1.5rem (24px)
- `lg`: 2rem (32px)
- `xl`: 2.5rem (40px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)

### Common Layout Patterns

```typescript
// Page Layout
<Section size="lg">
  <Stack gap="xl">
    <Box>
      <h1>Page Title</h1>
      <p>Description</p>
    </Box>
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {/* Content */}
    </Grid>
  </Stack>
</Section>

// Card Layout
<Box p="md" className="border rounded-lg">
  <Stack gap="sm">
    <h3>Card Title</h3>
    <Divider />
    <p>Content</p>
    <Group gap="sm">
      <Button>Action</Button>
      <Button variant="outline">Cancel</Button>
    </Group>
  </Stack>
</Box>

// Form Layout
<Container size="sm">
  <Stack gap="md" as="form">
    <Box>
      <Label>Name</Label>
      <Input />
    </Box>
    <Flex justify="end" gap="sm">
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Submit</Button>
    </Flex>
  </Stack>
</Container>
```

**REQUIRED**: Always use layout components for consistent spacing. See `components/layout/README.md` for full documentation.

---

## 🎨 COMPONENT PATTERNS

### Typography Components (ALWAYS USE)

```typescript
import { H1, H2, H3, H4, P, Lead, Large, Small, Muted } from '@/components/ui/typography'

// ✅ CORRECT
<H1>Page Title</H1>
<Lead>Introduction paragraph</Lead>
<P>Body content goes here</P>
<Small>Helper text or metadata</Small>

// ❌ AVOID - Don't use raw HTML with Tailwind classes
<h1 className="text-4xl font-bold">Title</h1>
<p className="text-xl text-gray-600">Intro</p>
```

### Compound Components (USE FOR COMMON PATTERNS)

We have pre-built compound components for common use cases:

```typescript
import { AppointmentCard, SalonCard, StatCard } from '@/components/shared'

// AppointmentCard - Customer & Business views
<AppointmentCard
  title="Haircut & Style"
  staffName="Sarah Johnson"
  date="March 15, 2025"
  time="2:00 PM"
  status="confirmed"
  onReschedule={() => {}}
  onViewDetails={() => {}}
  onCancel={() => {}}
/>

// SalonCard - Discovery page
<SalonCard
  name="Luxury Spa"
  description="Premium salon services"
  image="/images/salon.jpg"
  location="Downtown, City"
  rating={4.8}
  reviewCount={120}
  onBook={() => {}}
/>

// StatCard - Dashboard metrics
<StatCard
  label="Total Appointments"
  value={156}
  change={12}
  trend="up"
  description="vs last month"
/>
```

**Status Colors Available:**
- `pending` - Yellow/Warning
- `confirmed` - Green/Success
- `cancelled` - Red/Destructive
- `completed` - Blue/Info

### Server Components (Default):
```typescript
// app/(customer)/salons/page.tsx
import { getSalons } from '@/features/salon-discovery/dal/salons.queries'
import { SalonCard } from '@/components/shared'
import { Grid } from '@/components/layout'

export default async function SalonsPage() {
  const salons = await getSalons()

  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {salons.map(salon => (
        <SalonCard
          key={salon.id}
          name={salon.name}
          description={salon.description}
          image={salon.image}
          location={salon.location}
          rating={salon.rating}
          onBook={() => router.push(`/book/${salon.slug}`)}
        />
      ))}
    </Grid>
  )
}
```

### Client Components (Interactive):
```typescript
'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Stack } from '@/components/layout'

export function SearchBar() {
  const [search, setSearch] = useState('')

  return (
    <Stack gap="sm">
      <Input
        placeholder="Search salons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button>Search</Button>
    </Stack>
  )
}
```

### Server Actions:
```typescript
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateSalon(formData: FormData) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Update
  const { error } = await supabase
    .from('salons')
    .update({ name: formData.get('name') })
    .eq('id', formData.get('id'))
    .eq('owner_id', user.id)

  if (error) throw error
  revalidatePath('/business/salons')
}
```

---

## 📄 PAGE ARCHITECTURE (ULTRA-THIN PATTERN)

### ⚠️ CRITICAL: Pages MUST Be Ultra-Thin

**Pages are ONLY for rendering features. NO business logic. NO complex layouts. NO data manipulation.**

### The Ultra-Thin Page Rule:

```typescript
// ✅ PERFECT - Ultra-thin page (5-15 lines max)
// app/(customer)/salons/page.tsx
import { SalonDiscovery } from '@/features/salon-discovery'

export default async function SalonsPage() {
  return <SalonDiscovery />
}

// ✅ PERFECT - Ultra-thin with simple params
// app/(customer)/salons/[slug]/page.tsx
import { SalonDetail } from '@/features/salon-detail'

export default async function SalonDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <SalonDetail slug={slug} />
}

// ✅ GOOD - Minimal metadata + render
// app/(business)/dashboard/page.tsx
import { BusinessDashboard } from '@/features/dashboard'

export const metadata = {
  title: 'Dashboard',
  description: 'Business analytics and metrics'
}

export default async function DashboardPage() {
  return <BusinessDashboard />
}
```

### ❌ FORBIDDEN - Pages Doing Too Much:

```typescript
// ❌ WRONG - Business logic in page
export default async function SalonsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('salons').select('*')

  return <div>{data.map(salon => ...)}</div>
}

// ❌ WRONG - Complex layout in page
export default async function SalonsPage() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          {/* 50 lines of JSX */}
        </div>
      </div>
    </div>
  )
}

// ❌ WRONG - Data fetching + manipulation in page
export default async function SalonsPage() {
  const salons = await getSalons()
  const filtered = salons.filter(s => s.active)
  const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))

  return <div>{sorted.map(...)}</div>
}
```

### The Pattern:

```
Page (5-15 lines)
  ↓
Feature Component (business logic + layout)
  ↓
Sub-components (UI elements)
  ↓
Primitives (shadcn/ui + layout components)
```

### Examples by Portal:

```typescript
// ✅ Customer Portal Page
// app/(customer)/profile/page.tsx
import { CustomerProfile } from '@/features/customer-profile'

export default async function ProfilePage() {
  return <CustomerProfile />
}

// ✅ Business Portal Page
// app/(business)/appointments/page.tsx
import { AppointmentsManagement } from '@/features/appointments-management'

export default async function AppointmentsPage() {
  return <AppointmentsManagement />
}

// ✅ Staff Portal Page
// app/(staff)/schedule/page.tsx
import { StaffSchedule } from '@/features/staff-schedule'

export default async function SchedulePage() {
  return <StaffSchedule />
}

// ✅ Admin Portal Page
// app/(admin)/users/page.tsx
import { AdminUsers } from '@/features/admin-users'

export default async function UsersPage() {
  return <AdminUsers />
}
```

### Page Responsibilities:

| ✅ Pages SHOULD | ❌ Pages SHOULD NOT |
|----------------|---------------------|
| Render a single feature component | Fetch data from database |
| Pass route params to features | Contain business logic |
| Define metadata | Build complex layouts |
| Handle simple redirects | Map/filter/sort data |
| | Compose multiple features |
| | Contain UI elements |

### Where Logic Lives:

- **Pages** (`app/`)
  - Render features only
  - Pass params down
  - Define metadata

- **Features** (`features/[feature]/`)
  - Fetch data (via DAL)
  - Business logic
  - Layout composition
  - State management

- **Components** (`features/[feature]/components/`)
  - UI rendering
  - User interactions
  - Display logic

- **DAL** (`features/[feature]/dal/`)
  - Database queries
  - Auth checks
  - Data validation

### Real-World Example:

```typescript
// ✅ CORRECT ARCHITECTURE

// 1. Page (5 lines) - app/(business)/inventory/page.tsx
import { InventoryManagement } from '@/features/inventory'

export default async function InventoryPage() {
  return <InventoryManagement />
}

// 2. Feature (handles everything) - features/inventory/index.tsx
import { getProducts } from './dal/inventory.queries'
import { ProductsGrid } from './components/products-grid'
import { InventoryFilters } from './components/inventory-filters'
import { Section, Stack } from '@/components/layout'
import { H1 } from '@/components/ui/typography'

export async function InventoryManagement() {
  const products = await getProducts()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <H1>Inventory Management</H1>
        <InventoryFilters />
        <ProductsGrid products={products} />
      </Stack>
    </Section>
  )
}

// 3. DAL (data fetching) - features/inventory/dal/inventory.queries.ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getProducts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('salon_id', user.salon_id)

  if (error) throw error
  return data
}
```

### Why Ultra-Thin Pages?

1. ✅ **Separation of Concerns** - Pages route, features implement
2. ✅ **Reusability** - Features can be used anywhere
3. ✅ **Testability** - Test features independently
4. ✅ **Maintainability** - Clear boundaries
5. ✅ **Readability** - Obvious what each layer does

### Checklist for Every Page:

- [ ] Less than 15 lines of code
- [ ] Only imports feature component(s)
- [ ] Only passes route params (if needed)
- [ ] No database queries
- [ ] No data manipulation
- [ ] No layout composition
- [ ] No business logic

**VIOLATION PENALTY**: If a page exceeds 20 lines or contains business logic, it MUST be refactored.

---

## 🚦 ROLE-BASED ROUTING

### Middleware Protection:
```typescript
// middleware.ts
const ROUTE_ROLES = {
  '/staff': ['senior_staff', 'staff', 'junior_staff'],
  '/business': ['tenant_owner', 'salon_owner', 'salon_manager'],
  '/admin': ['super_admin', 'platform_admin'],
}
```

### Default Routes by Role:
- `super_admin`, `platform_admin` → `/admin`
- `tenant_owner`, `salon_owner`, `salon_manager` → `/business`
- `senior_staff`, `staff`, `junior_staff` → `/staff`
- `customer`, `vip_customer`, `guest` → `/explore`

**📖 SEE**: `docs/ROLE_BASED_ROUTING.md` for complete guide

---

## 📚 FEATURE MODULES (19 Modules)

### Standard Feature Structure:
```
features/[feature-name]/
├── components/           # Feature-specific UI
│   ├── [feature]-list.tsx
│   ├── [feature]-card.tsx
│   └── [feature]-form.tsx
├── dal/                 # Data Access Layer
│   └── [feature].queries.ts
├── actions/             # Server Actions
│   └── [feature].actions.ts
├── hooks/              # React hooks (optional)
│   └── use-[feature].ts
└── types/              # Feature types (optional)
    └── [feature].types.ts
```

### Feature-to-Schema Mapping:
- `salon-discovery` → organization.salons
- `booking` → scheduling.appointments + catalog.services
- `staff` → organization.staff_profiles + scheduling.staff_schedules
- `inventory` → inventory.* (11 tables)
- `analytics` → analytics.* (17 functions)

**📖 SEE**: `docs/FINAL_ARCHITECTURE.md` for all 19 features

---

## 🎯 IMPORT CONVENTIONS

```typescript
// 1. React & Next.js
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

// 2. External packages
import { z } from 'zod'
import { format } from 'date-fns'

// 3. Database types
import type { Database } from '@/lib/types/database.types'
import { createClient } from '@/lib/supabase/server'

// 4. UI components
import { Button, Card } from '@/components/ui/button'

// 5. Features
import { getSalons } from '@/features/salon-discovery/dal/salons.queries'

// 6. Relative imports (same feature)
import { SalonCard } from './salon-card'
```

---

## ⚡ QUICK COMMANDS

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm typecheck        # Type checking

# Database
pnpm db:types         # Generate TypeScript types
python3 scripts/generate-types.py  # Same as above

# Linting
pnpm lint             # ESLint
```

---

## ✅ PRE-FLIGHT CHECKLIST

Before writing ANY code:

- [ ] **Pages are ULTRA-THIN** (5-15 lines, only render features)
- [ ] Using existing database tables (42 tables, 8 schemas)
- [ ] Importing types from `@/lib/types/database.types`
- [ ] **Querying public views ONLY** (not schema.table directly)
- [ ] **Using `Database['public']['Views']` types** (not Tables)
- [ ] Auth check in every DAL function
- [ ] Using shadcn/ui components only (ALL components pre-installed)
- [ ] Using typography components from `@/components/ui/typography` (H1-H6, P, Lead, Small, Muted)
- [ ] Using compound components from `@/components/shared` (AppointmentCard, SalonCard, StatCard)
- [ ] Using layout components from `@/components/layout` for consistency
- [ ] Following kebab-case naming
- [ ] No 'any' types
- [ ] No database modifications without permission
- [ ] No Tailwind config file (Tailwind 4 uses CSS only)
- [ ] Wrap `auth.uid()` in `(select ...)` for RLS policies
- [ ] Add explicit filters in queries

**Available shadcn/ui Components** (all pre-installed):
- Forms: Button, Input, Label, Select, Checkbox, Radio, Switch, Slider, Textarea
- Layout: Card, Separator, Tabs, Dialog, Sheet, Drawer, Popover
- Navigation: Menu, Dropdown, Command, Breadcrumb, Navigation Menu
- Feedback: Alert, Toast (Sonner), Progress, Skeleton, Badge
- Data: Table, Avatar, Calendar, Carousel, Chart (Recharts)
- Advanced: Accordion, Collapsible, Hover Card, Context Menu, Toggle, Resizable Panels

---

## 🚫 STOP CONDITIONS

**STOP** and ask for clarification if:
1. Page is getting longer than 20 lines or contains business logic
2. Database table doesn't exist for feature
3. Type doesn't exist in database.types.ts
4. Tempted to create custom UI component
5. Want to modify database structure
6. Unsure about auth implementation
7. Column names don't match database
8. Need to query schema tables directly

---

## 📖 DOCUMENTATION

| Document | Purpose |
|----------|---------|
| `FINAL_ARCHITECTURE.md` | Complete project structure & features |
| `ROLE_BASED_ROUTING.md` | Roles, routes, middleware, permissions |
| `FRONTEND_BEST_PRACTICES.md` | Component patterns, DAL, state management |
| `SUPABASE_BEST_PRACTICES.md` | RLS, auth, query optimization |

---

## 🎯 DEVELOPMENT PRINCIPLES

1. **Simplicity First** - Don't over-engineer
2. **Use What Exists** - 42 tables are enough
3. **Type Safety** - Real types only (no 'any')
4. **Security Always** - Auth checks everywhere
5. **Consistency** - Follow patterns exactly
6. **Performance Matters** - Follow Supabase best practices
7. **Documentation First** - Read docs before coding

---

## 📊 PROJECT STATUS

- **Database**: ✅ Complete (42 tables, 108 functions, 10 public views)
- **Roles**: ✅ Complete (11 roles, 4 portals)
- **Architecture**: ✅ Defined (Single Next.js app)
- **Documentation**: ✅ Complete (7 comprehensive docs)
- **Implementation**: 🚧 Ready to build

---

**Last Updated**: 2025-10-01
**Database Version**: Production-ready
**Architecture**: Single App with Role-Based Portals
**Status**: Ready for Development 🚀
