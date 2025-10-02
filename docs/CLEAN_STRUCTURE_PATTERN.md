# 🏗️ CLEAN PROJECT STRUCTURE PATTERN

> **The Perfect Pattern for Scalable Next.js + Supabase Apps**
>
> Based on: Next.js 15, React Server Components, Feature-First Architecture

---

## 📐 THE GOLDEN PATTERN

### Root Structure (Single App)

```
project-root/
├── app/                          # Next.js App Router (ROUTES ONLY)
│   ├── (portal-name)/           # Route group = Portal
│   │   ├── [feature]/           # Feature route
│   │   │   └── page.tsx         # 5-15 lines max
│   │   ├── layout.tsx           # Portal layout
│   │   ├── error.tsx            # Error boundary
│   │   └── loading.tsx          # Loading state
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
│
├── features/                     # Business Logic (FEATURE MODULES)
│   └── [feature-name]/          # One feature module
│       ├── components/          # Feature-specific UI
│       │   ├── [component].tsx
│       │   └── [component].client.tsx  # If needs 'use client'
│       ├── dal/                 # Data Access Layer
│       │   └── [feature].queries.ts
│       ├── actions/             # Server Actions
│       │   └── [feature].actions.ts
│       ├── hooks/              # React Hooks (optional)
│       │   └── use-[feature].ts
│       ├── lib/                # Feature utilities (optional)
│       │   ├── [feature].utils.ts
│       │   └── [feature].constants.ts
│       ├── types/              # Feature types (optional)
│       │   └── [feature].types.ts
│       ├── schemas/            # Zod schemas (optional)
│       │   └── [feature].schemas.ts
│       └── index.tsx           # Main export (Server Component)
│
├── components/                  # Shared UI Components
│   ├── ui/                     # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── [component].tsx
│   ├── layout/                 # Layout primitives
│   │   ├── primitives/
│   │   │   ├── box.tsx
│   │   │   ├── container.tsx
│   │   │   └── section.tsx
│   │   ├── flex/
│   │   │   ├── flex.tsx
│   │   │   ├── stack.tsx
│   │   │   └── group.tsx
│   │   ├── grid/
│   │   │   └── grid.tsx
│   │   └── index.ts
│   ├── shared/                 # Compound components
│   │   ├── [card-type]-card.tsx
│   │   └── index.ts
│   └── typography/             # Text components
│       ├── headings.tsx
│       ├── text.tsx
│       └── index.ts
│
├── lib/                        # Shared Libraries & Utils
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   └── server.ts          # Server client
│   ├── types/
│   │   ├── database.types.ts  # Generated from Supabase
│   │   └── index.ts
│   ├── validations/
│   │   ├── [domain].schemas.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── [category].utils.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── [category].constants.ts
│   │   └── index.ts
│   ├── hooks/                 # Global hooks
│   │   ├── use-[name].ts
│   │   └── index.ts
│   └── utils.ts               # Generic utils
│
├── public/                     # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── supabase/                   # Database & Backend
│   ├── migrations/
│   │   └── [timestamp]_[name].sql
│   ├── functions/             # Edge Functions
│   │   └── [function-name]/
│   └── config.toml
│
├── scripts/                    # Utility scripts
│   ├── [script-name].py
│   └── README.md
│
├── docs/                       # Documentation
│   ├── 01-getting-started/
│   ├── 02-architecture/
│   ├── 03-database/
│   ├── 04-frontend/
│   └── index.md
│
├── .env.local                 # Environment variables
├── .env.example              # Example env file
├── middleware.ts             # Next.js middleware
├── next.config.ts           # Next.js config
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md               # Project overview
```

---

## 📦 FEATURE MODULE PATTERN (The Core)

### Standard Feature Structure

```
features/[feature-name]/
├── components/                    # Feature-specific components
│   ├── [feature]-list.tsx        # List/Grid component
│   ├── [feature]-card.tsx        # Card component
│   ├── [feature]-form.tsx        # Form component
│   ├── [feature]-detail.tsx      # Detail view
│   ├── [feature]-filters.tsx     # Filters component
│   └── [feature]-[part].client.tsx  # Client component
│
├── dal/                          # Data Access Layer
│   └── [feature].queries.ts      # All database queries
│
├── actions/                      # Server Actions
│   └── [feature].actions.ts      # All mutations
│
├── hooks/                        # Feature hooks (optional)
│   └── use-[feature].ts
│
├── lib/                          # Feature utilities (optional)
│   ├── [feature].utils.ts       # Helper functions
│   └── [feature].constants.ts   # Feature constants
│
├── types/                        # Feature types (optional)
│   └── [feature].types.ts       # Custom types
│
├── schemas/                      # Zod schemas (optional)
│   └── [feature].schemas.ts     # Validation schemas
│
└── index.tsx                     # Main export (Server Component)
```

---

## 📝 FILE NAMING CONVENTIONS

### The Rules

| Type | Pattern | Example |
|------|---------|---------|
| **Folders** | `kebab-case` | `salon-discovery/` |
| **Components** | `[name].tsx` | `salon-card.tsx` |
| **Client Components** | `[name].client.tsx` | `search-filters.client.tsx` |
| **DAL** | `[feature].queries.ts` | `salon.queries.ts` |
| **Actions** | `[feature].actions.ts` | `salon.actions.ts` |
| **Types** | `[feature].types.ts` | `salon.types.ts` |
| **Hooks** | `use-[name].ts` | `use-salon.ts` |
| **Utils** | `[category].utils.ts` | `date.utils.ts` |
| **Constants** | `[category].constants.ts` | `routes.constants.ts` |
| **Schemas** | `[feature].schemas.ts` | `salon.schemas.ts` |
| **Pages** | `page.tsx` | `page.tsx` (Next.js convention) |
| **Layouts** | `layout.tsx` | `layout.tsx` (Next.js convention) |

### ❌ NEVER Use

- Suffixes: `-v2`, `-new`, `-old`, `-final`, `-fixed`, `-temp`, `-backup`
- Underscores: `salon_discovery/`
- PascalCase folders: `SalonDiscovery/`
- Index files in folders: `components/SalonCard/index.tsx` (prefer flat)

---

## 🎯 EXAMPLES BY TYPE

### Example 1: Simple Feature (Read-Only)

```
features/salon-discovery/
├── components/
│   ├── salon-grid.tsx              # Grid display
│   ├── salon-card.tsx              # Individual card
│   └── search-filters.client.tsx   # Client-side filters
├── dal/
│   └── salon.queries.ts            # getSalons(), getSalonBySlug()
└── index.tsx                       # Main component
```

**index.tsx** (8 lines):
```typescript
import { getSalons } from './dal/salon.queries'
import { SalonDiscoveryClient } from './components/salon-discovery-client'

export async function SalonDiscovery() {
  const salons = await getSalons()
  return <SalonDiscoveryClient initialSalons={salons} />
}
```

---

### Example 2: Complex Feature (CRUD)

```
features/appointment-management/
├── components/
│   ├── appointment-table.tsx       # Table view
│   ├── appointment-row.tsx         # Table row
│   ├── appointment-form.tsx        # Create/Edit form
│   ├── appointment-detail.tsx      # Detail modal
│   ├── appointment-filters.tsx     # Filter controls
│   └── appointment-status.tsx      # Status badge
├── dal/
│   └── appointment.queries.ts      # All queries
├── actions/
│   └── appointment.actions.ts      # CRUD actions
├── hooks/
│   └── use-appointment.ts          # Custom hook
├── schemas/
│   └── appointment.schemas.ts      # Zod validation
└── index.tsx                       # Main component
```

---

### Example 3: Feature with Submodules

```
features/inventory-management/
├── components/
│   ├── products/                   # Products submodule
│   │   ├── product-table.tsx
│   │   ├── product-form.tsx
│   │   └── product-card.tsx
│   ├── suppliers/                  # Suppliers submodule
│   │   ├── supplier-grid.tsx
│   │   └── supplier-form.tsx
│   ├── stock/                      # Stock submodule
│   │   ├── stock-alerts.tsx
│   │   └── stock-movements.tsx
│   └── inventory-stats.tsx         # Overview stats
├── dal/
│   └── inventory.queries.ts        # All inventory queries
├── actions/
│   └── inventory.actions.ts        # All inventory mutations
└── index.tsx                       # Main dashboard
```

---

## 🗂️ APP ROUTER PATTERN (Ultra-Thin Pages)

### Portal Structure

```
app/
├── (marketing)/                    # Public pages
│   ├── page.tsx                   # Homepage
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── signup/
│   │   └── page.tsx               # Signup page
│   ├── explore/
│   │   └── page.tsx               # Browse salons
│   ├── layout.tsx                 # Marketing layout
│   ├── error.tsx                  # Error boundary
│   └── loading.tsx                # Loading state
│
├── (customer)/                     # Customer portal
│   ├── profile/
│   │   └── page.tsx               # Profile
│   ├── salons/
│   │   ├── page.tsx               # Browse
│   │   └── [slug]/
│   │       └── page.tsx           # Salon detail
│   ├── book/
│   │   └── [salonId]/
│   │       └── page.tsx           # Booking flow
│   ├── favorites/
│   │   └── page.tsx               # Favorites
│   ├── layout.tsx                 # Customer layout (with sidebar)
│   ├── error.tsx
│   └── loading.tsx
│
├── (business)/                     # Business portal
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard
│   ├── appointments/
│   │   └── page.tsx               # Appointments
│   ├── services/
│   │   ├── page.tsx               # Services list
│   │   ├── categories/
│   │   │   └── page.tsx           # Categories
│   │   └── pricing/
│   │       └── page.tsx           # Pricing
│   ├── staff/
│   │   ├── page.tsx               # Staff list
│   │   └── schedules/
│   │       └── page.tsx           # Schedules
│   ├── inventory/
│   │   ├── page.tsx               # Products
│   │   ├── suppliers/
│   │   │   └── page.tsx           # Suppliers
│   │   └── alerts/
│   │       └── page.tsx           # Stock alerts
│   ├── layout.tsx                 # Business layout
│   ├── error.tsx
│   └── loading.tsx
│
├── (staff)/                        # Staff portal
│   ├── schedule/
│   │   └── page.tsx               # My schedule
│   ├── appointments/
│   │   └── page.tsx               # My appointments
│   ├── time-off/
│   │   └── page.tsx               # Request time off
│   ├── layout.tsx
│   ├── error.tsx
│   └── loading.tsx
│
├── (admin)/                        # Admin portal
│   ├── dashboard/
│   │   └── page.tsx               # Admin dashboard
│   ├── users/
│   │   └── page.tsx               # User management
│   ├── salons/
│   │   └── page.tsx               # Salon management
│   ├── layout.tsx
│   ├── error.tsx
│   └── loading.tsx
│
├── layout.tsx                      # Root layout
├── page.tsx                        # Root page (redirects)
├── error.tsx                       # Global error
├── loading.tsx                     # Global loading
└── globals.css                     # Global styles
```

### Page Pattern (5-15 lines)

```typescript
// app/(business)/appointments/page.tsx
import { AppointmentManagement } from '@/features/appointment-management'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Appointments',
  description: 'Manage salon appointments',
  noIndex: true,
})

export default async function AppointmentsPage() {
  return <AppointmentManagement />
}
```

---

## 🔧 LIB FOLDER PATTERN

### Organized by Purpose

```
lib/
├── supabase/
│   ├── client.ts                   # Browser client factory
│   ├── server.ts                   # Server client factory
│   └── middleware.ts               # Middleware client (optional)
│
├── types/
│   ├── database.types.ts           # Generated from Supabase
│   ├── common.types.ts             # Shared app types
│   └── index.ts                    # Barrel export
│
├── validations/
│   ├── auth.schemas.ts             # Auth validation
│   ├── booking.schemas.ts          # Booking validation
│   ├── salon.schemas.ts            # Salon validation
│   └── index.ts
│
├── utils/
│   ├── date.utils.ts               # Date utilities
│   ├── string.utils.ts             # String utilities
│   ├── currency.utils.ts           # Currency utilities
│   └── index.ts
│
├── constants/
│   ├── routes.constants.ts         # Route paths
│   ├── roles.constants.ts          # User roles
│   ├── status.constants.ts         # Status values
│   └── index.ts
│
├── hooks/
│   ├── use-auth.ts                 # Auth hook
│   ├── use-toast.ts                # Toast hook
│   ├── use-media-query.ts          # Media query hook
│   └── index.ts
│
├── config/
│   ├── site.config.ts              # Site metadata
│   └── env.ts                      # Env validation
│
└── utils.ts                        # Generic utilities (cn, etc.)
```

---

## 🎨 COMPONENT ORGANIZATION

### Shared Components

```
components/
├── ui/                             # shadcn/ui primitives (DO NOT MODIFY)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── [50+ components].tsx
│
├── layout/                         # Layout primitives
│   ├── primitives/
│   │   ├── box.tsx                # Generic container
│   │   ├── container.tsx          # Max-width container
│   │   ├── section.tsx            # Semantic section
│   │   └── spacer.tsx             # Spacing utility
│   ├── flex/
│   │   ├── flex.tsx               # Flexbox container
│   │   ├── stack.tsx              # Vertical flex
│   │   └── group.tsx              # Horizontal flex
│   ├── grid/
│   │   └── grid.tsx               # CSS Grid
│   ├── utils/
│   │   ├── center.tsx             # Centering utility
│   │   ├── divider.tsx            # Divider component
│   │   └── visually-hidden.tsx    # A11y hidden
│   ├── types.ts                   # Shared types
│   └── index.ts                   # Barrel export
│
├── shared/                         # Compound components
│   ├── appointment-card.tsx       # Appointment card
│   ├── salon-card.tsx             # Salon card
│   ├── staff-card.tsx             # Staff card
│   ├── stat-card.tsx              # Stat/metric card
│   └── index.ts
│
└── typography/                     # Typography components
    ├── headings.tsx               # H1-H6
    ├── text.tsx                   # P, Lead, Large, Small
    ├── inline.tsx                 # Strong, Em, Code
    ├── lists.tsx                  # Ul, Ol, Li
    └── index.ts
```

---

## 📋 CHECKLIST: Clean Structure

### Feature Module ✅
- [ ] Folder name is `kebab-case`
- [ ] Has `index.tsx` as main export
- [ ] Has `dal/[feature].queries.ts` for data access
- [ ] Has `actions/[feature].actions.ts` for mutations (if needed)
- [ ] Components are in `components/` subfolder
- [ ] No business logic in components
- [ ] All exports go through `index.tsx`

### Page ✅
- [ ] 5-15 lines maximum
- [ ] Only imports and renders feature component
- [ ] Has metadata (if needed)
- [ ] No data fetching
- [ ] No business logic
- [ ] No layout composition

### DAL File ✅
- [ ] Has `import 'server-only'` at top
- [ ] All functions check auth
- [ ] Only queries from public views
- [ ] Proper error handling
- [ ] Uses proper types from database.types.ts
- [ ] Named `[feature].queries.ts`

### Actions File ✅
- [ ] Has `'use server'` directive
- [ ] All functions are async
- [ ] Proper validation with Zod
- [ ] Calls `revalidatePath()` after mutations
- [ ] Named `[feature].actions.ts`

### Component File ✅
- [ ] Named `[component-name].tsx`
- [ ] Client components have `.client.tsx` suffix (optional but clear)
- [ ] No database queries
- [ ] No direct Supabase usage
- [ ] Props are properly typed

---

## 🎯 ANTI-PATTERNS TO AVOID

### ❌ DON'T Do This

```typescript
// ❌ Business logic in page
export default async function Page() {
  const supabase = await createClient()
  const data = await supabase.from('salons').select()
  return <div>{data.map(...)}</div>
}

// ❌ Database queries in component
export function SalonList() {
  const supabase = createClient()
  const { data } = await supabase.from('salons').select()
  return <div>{data.map(...)}</div>
}

// ❌ Nested folder components
features/salon-discovery/
└── components/
    └── SalonCard/
        ├── index.tsx
        ├── SalonCard.tsx
        └── SalonCard.test.tsx

// ❌ Mixed naming conventions
features/
├── salon-discovery/
├── Staff_Management/
└── bookingFlow/

// ❌ Generic names
components/
├── component.tsx
├── new-component.tsx
├── component-v2.tsx
└── temp-fix.tsx
```

### ✅ DO This Instead

```typescript
// ✅ Page renders feature
export default async function Page() {
  return <SalonDiscovery />
}

// ✅ Component uses DAL
export async function SalonList() {
  const salons = await getSalons() // from DAL
  return <SalonGrid salons={salons} />
}

// ✅ Flat component structure
features/salon-discovery/
└── components/
    ├── salon-card.tsx
    ├── salon-grid.tsx
    └── search-filters.tsx

// ✅ Consistent naming
features/
├── salon-discovery/
├── staff-management/
└── booking-flow/

// ✅ Descriptive names
components/
├── salon-card.tsx
├── appointment-table.tsx
└── booking-form.tsx
```

---

## 🚀 MIGRATION PATH

### From Current Structure to Clean Structure

1. **Pages** - Already good! ✅
2. **Features** - Move DB queries to DAL
3. **Components** - Flatten nested structures
4. **Lib** - Organize by purpose
5. **Types** - Consolidate in lib/types

### Step-by-Step

```bash
# 1. Clean up features
features/[feature]/
  components/           # ✅ Keep
  dal/                 # ✅ Keep
  actions/             # ✅ Keep
  hooks/               # ✅ Add if needed
  lib/                 # ✅ Add for utils
  schemas/             # ✅ Add for validation
  index.tsx            # ✅ Keep

# 2. Organize lib/
lib/
  supabase/           # ✅ Already good
  types/              # ✅ Already good
  validations/        # ➕ Add
  utils/              # ➕ Add
  constants/          # ➕ Add
  hooks/              # ➕ Add

# 3. No changes needed
app/                  # ✅ Already perfect
components/           # ✅ Already good
```

---

## 📚 REAL-WORLD EXAMPLE

### Complete Feature: Salon Discovery

```
features/salon-discovery/
├── components/
│   ├── salon-grid.tsx              # Displays grid of salons
│   ├── salon-card.tsx              # Individual salon card
│   ├── search-bar.client.tsx       # Search input (client)
│   ├── filter-bar.client.tsx       # Filters (client)
│   └── salon-discovery-client.tsx  # Client wrapper
│
├── dal/
│   └── salon.queries.ts            # getSalons(), searchSalons()
│
├── lib/
│   └── salon.utils.ts              # formatSalonData(), etc.
│
├── schemas/
│   └── salon.schemas.ts            # salonSearchSchema (Zod)
│
└── index.tsx                       # Main export (Server Component)
```

**Full Implementation**:

```typescript
// features/salon-discovery/index.tsx
import { getSalons } from './dal/salon.queries'
import { SalonDiscoveryClient } from './components/salon-discovery-client'

export async function SalonDiscovery() {
  const salons = await getSalons()
  return <SalonDiscoveryClient initialSalons={salons} />
}

// features/salon-discovery/dal/salon.queries.ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

export async function getSalons() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Salon[]
}

// features/salon-discovery/components/salon-discovery-client.tsx
'use client'
import { useState } from 'react'
import { SalonGrid } from './salon-grid'
import { SearchBar } from './search-bar.client'
import { FilterBar } from './filter-bar.client'
import { Section, Stack } from '@/components/layout'

type Props = {
  initialSalons: Salon[]
}

export function SalonDiscoveryClient({ initialSalons }: Props) {
  const [salons, setSalons] = useState(initialSalons)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <SearchBar onSearch={handleSearch} />
        <FilterBar onFilter={handleFilter} />
        <SalonGrid salons={salons} />
      </Stack>
    </Section>
  )
}

// app/(customer)/salons/page.tsx
import { SalonDiscovery } from '@/features/salon-discovery'

export default async function SalonsPage() {
  return <SalonDiscovery />
}
```

---

## 🎓 SUMMARY

### The Perfect Pattern

1. **Pages** = 5-15 lines, only render features
2. **Features** = Complete business modules
3. **Components** = Flat structure, clear names
4. **DAL** = All database queries, auth checks
5. **Actions** = All mutations, validation
6. **Lib** = Organized by purpose
7. **Naming** = Consistent kebab-case

### Key Principles

- **Separation of Concerns** - Each layer has one job
- **Feature-First** - Organize by feature, not by type
- **Flat Structure** - Avoid deep nesting
- **Clear Naming** - Name things what they are
- **Consistency** - Same pattern everywhere

---

**Follow this pattern and your codebase will be:**
- ✅ Easy to navigate
- ✅ Easy to test
- ✅ Easy to scale
- ✅ Easy to onboard new developers
- ✅ Production-ready

**Generated**: 2025-10-02
**Based on**: Next.js 15, React 19, Industry Best Practices
