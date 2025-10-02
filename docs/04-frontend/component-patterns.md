# 🎨 FRONTEND - COMPONENT PATTERNS

> **Navigation**: [📘 Docs Index](../index.md) | [🏠 README](../../README.md) | [🤖 CLAUDE.md](../../CLAUDE.md)

> **Enorae Platform - Next.js 15 & Supabase Patterns**
> **Database**: 42 business tables across 8 domains
> **Architecture**: Single Next.js App with Feature-Based Organization
> **Last Updated**: 2025-10-01

---

## 📋 TABLE OF CONTENTS

1. [Complete Project Tree](#complete-project-tree)
2. [Feature Module Architecture](#feature-module-architecture)
3. [Database-Aligned Structure](#database-aligned-structure)
4. [Type Safety Patterns](#type-safety-patterns)
5. [Data Access Layer (DAL) Best Practices](#data-access-layer-dal-best-practices)
6. [Component Patterns](#component-patterns)

---

## 📁 COMPLETE PROJECT TREE

```
enorae/
├── .next/                          # Next.js build output (git ignored)
├── node_modules/                   # Dependencies (git ignored)
├── public/                         # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-bg.jpg
│   │   └── placeholder-salon.jpg
│   ├── fonts/                      # Custom fonts (optional)
│   └── favicon.ico
│
├── app/                            # Next.js 15 App Router
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Homepage (/)
│   ├── loading.tsx                 # Root loading
│   ├── error.tsx                   # Root error boundary
│   ├── not-found.tsx               # 404 page
│   ├── globals.css                 # Global styles + Tailwind
│   │
│   ├── (customer)/                 # Customer-facing routes
│   │   ├── layout.tsx              # Customer layout (header, footer)
│   │   ├── salons/
│   │   │   ├── page.tsx            # Salon listing (/salons)
│   │   │   ├── loading.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx        # Salon detail (/salons/:slug)
│   │   │       ├── loading.tsx
│   │   │       └── not-found.tsx
│   │   ├── book/
│   │   │   └── [salon-slug]/
│   │   │       └── page.tsx        # Booking flow (/book/:slug)
│   │   └── profile/
│   │       ├── page.tsx            # Customer profile (/profile)
│   │       ├── appointments/
│   │       │   └── page.tsx        # My appointments
│   │       ├── favorites/
│   │       │   └── page.tsx        # Favorite salons
│   │       └── settings/
│   │           └── page.tsx        # Account settings
│   │
│   ├── business/                   # Business dashboard routes
│   │   ├── layout.tsx              # Business layout (sidebar)
│   │   ├── page.tsx                # Dashboard home (/business)
│   │   ├── appointments/
│   │   │   ├── page.tsx            # Appointments list
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Appointment detail
│   │   ├── staff/
│   │   │   ├── page.tsx            # Staff list
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Add staff
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Edit staff
│   │   ├── services/
│   │   │   ├── page.tsx            # Services list
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Add service
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Edit service
│   │   ├── schedule/
│   │   │   └── page.tsx            # Schedule management
│   │   ├── analytics/
│   │   │   └── page.tsx            # Analytics dashboard
│   │   ├── inventory/
│   │   │   └── page.tsx            # Inventory (future)
│   │   └── settings/
│   │       └── page.tsx            # Business settings
│   │
│   ├── admin/                      # Admin panel routes
│   │   ├── layout.tsx              # Admin layout
│   │   ├── page.tsx                # Admin dashboard (/admin)
│   │   ├── salons/
│   │   │   ├── page.tsx            # All salons
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Salon details
│   │   ├── users/
│   │   │   ├── page.tsx            # All users
│   │   │   └── [id]/
│   │   │       └── page.tsx        # User details
│   │   └── analytics/
│   │       └── page.tsx            # Platform analytics
│   │
│   ├── auth/                       # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx            # Login page (/auth/login)
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup page (/auth/signup)
│   │   ├── reset-password/
│   │   │   └── page.tsx            # Password reset
│   │   └── callback/
│   │       └── route.ts            # OAuth callback
│   │
│   └── api/                        # API routes
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts        # Auth callback handler
│       ├── webhooks/
│       │   └── route.ts            # Webhook endpoints
│       └── health/
│           └── route.ts            # Health check
│
├── components/                     # Shared UI components (shadcn/ui)
│   ├── ui/                         # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── tooltip.tsx
│   │   └── ...
│   ├── layout/                     # Layout components
│   │   ├── container.tsx
│   │   ├── stack.tsx
│   │   ├── grid.tsx
│   │   ├── flex.tsx
│   │   └── center.tsx
│   └── typography/                 # Typography components
│       ├── heading.tsx
│       └── text.tsx
│
├── features/                       # Feature modules (business logic)
│   ├── home/                       # Homepage feature
│   │   ├── components/
│   │   │   ├── hero-section.tsx
│   │   │   ├── featured-salons.tsx
│   │   │   └── salon-search.tsx
│   │   └── dal/
│   │       └── home.queries.ts
│   │
│   ├── salon-discovery/            # Salon browsing
│   │   ├── components/
│   │   │   ├── salon-grid.tsx
│   │   │   ├── salon-card.tsx
│   │   │   ├── search-filters.tsx
│   │   │   └── pagination.tsx
│   │   ├── dal/
│   │   │   └── salons.queries.ts
│   │   └── types/
│   │       └── filters.types.ts
│   │
│   ├── salon-detail/               # Individual salon view
│   │   ├── components/
│   │   │   ├── salon-header.tsx
│   │   │   ├── service-list.tsx
│   │   │   ├── staff-grid.tsx
│   │   │   └── review-section.tsx
│   │   └── dal/
│   │       └── salon.queries.ts
│   │
│   ├── booking/                    # Booking flow
│   │   ├── components/
│   │   │   ├── booking-form.tsx
│   │   │   ├── service-selector.tsx
│   │   │   ├── staff-selector.tsx
│   │   │   ├── date-time-picker.tsx
│   │   │   └── booking-summary.tsx
│   │   ├── dal/
│   │   │   └── booking.queries.ts
│   │   └── actions/
│   │       └── booking.actions.ts
│   │
│   ├── auth/                       # Authentication
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   ├── login-page.tsx
│   │   │   └── signup-page.tsx
│   │   └── actions/
│   │       └── auth.actions.ts
│   │
│   ├── customer-profile/           # Customer profile
│   │   ├── components/
│   │   │   ├── profile-header.tsx
│   │   │   ├── appointments-list.tsx
│   │   │   └── appointment-card.tsx
│   │   ├── dal/
│   │   │   └── profile.queries.ts
│   │   └── actions/
│   │       └── appointment.actions.ts
│   │
│   ├── dashboard/                  # Business dashboard
│   │   ├── components/
│   │   │   ├── metrics-cards.tsx
│   │   │   ├── recent-bookings.tsx
│   │   │   └── revenue-chart.tsx
│   │   └── dal/
│   │       └── dashboard.queries.ts
│   │
│   ├── appointments-management/    # Business appointments
│   │   ├── components/
│   │   │   ├── appointments-table.tsx
│   │   │   ├── appointments-filters.tsx
│   │   │   └── appointment-status-badge.tsx
│   │   ├── dal/
│   │   │   └── appointments.queries.ts
│   │   └── actions/
│   │       └── appointments.actions.ts
│   │
│   ├── staff-management/           # Staff management
│   │   ├── components/
│   │   │   ├── staff-list.tsx
│   │   │   ├── staff-form.tsx
│   │   │   └── staff-schedule.tsx
│   │   ├── dal/
│   │   │   └── staff.queries.ts
│   │   └── actions/
│   │       └── staff.actions.ts
│   │
│   ├── services-management/        # Services management
│   │   ├── components/
│   │   │   ├── services-grid.tsx
│   │   │   ├── service-card.tsx
│   │   │   └── service-form.tsx
│   │   ├── dal/
│   │   │   └── services.queries.ts
│   │   └── actions/
│   │       └── services.actions.ts
│   │
│   ├── analytics/                  # Business analytics
│   │   ├── components/
│   │   │   ├── analytics-overview.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   └── metrics-grid.tsx
│   │   └── dal/
│   │       └── analytics.queries.ts
│   │
│   ├── advanced-analytics/         # AI analytics
│   │   ├── components/
│   │   │   ├── ai-insights.tsx
│   │   │   └── forecasting-chart.tsx
│   │   └── dal/
│   │       └── advanced-analytics.queries.ts
│   │
│   ├── blocked-times/              # Staff blocked times
│   │   ├── components/
│   │   │   └── blocked-times-calendar.tsx
│   │   ├── dal/
│   │   │   └── blocked-times.queries.ts
│   │   └── actions/
│   │       └── blocked.actions.ts
│   │
│   ├── favorites/                  # Customer favorites
│   │   ├── components/
│   │   │   └── favorites-grid.tsx
│   │   ├── dal/
│   │   │   └── favorites.queries.ts
│   │   └── actions/
│   │       └── favorites.actions.ts
│   │
│   ├── notifications/              # Notifications
│   │   ├── components/
│   │   │   └── notification-list.tsx
│   │   └── actions/
│   │       └── notification.actions.ts
│   │
│   ├── navigation/                 # Navigation components
│   │   └── components/
│   │       ├── app-sidebar.tsx
│   │       └── business-sidebar.tsx
│   │
│   ├── admin-dashboard/            # Admin dashboard
│   │   ├── components/
│   │   │   └── admin-overview.tsx
│   │   └── dal/
│   │       └── admin.queries.ts
│   │
│   ├── admin-salons/               # Admin salons
│   │   └── dal/
│   │       └── salons.queries.ts
│   │
│   └── admin-users/                # Admin users
│       └── dal/
│           └── users.queries.ts
│
├── lib/                            # Shared utilities & helpers
│   ├── supabase/
│   │   ├── client.ts               # Supabase browser client
│   │   ├── server.ts               # Supabase server client
│   │   └── middleware.ts           # Auth middleware helpers
│   ├── types/
│   │   ├── database.types.ts       # Generated database types
│   │   └── database.helpers.ts     # Type helper utilities
│   ├── utils/
│   │   ├── cn.ts                   # Tailwind class merge utility
│   │   ├── format.ts               # Date/number formatters
│   │   └── validation.ts           # Zod schemas
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Mobile detection hook
│   │   ├── use-toast.tsx           # Toast notifications
│   │   └── use-debounce.ts         # Debounce hook
│   └── constants/
│       ├── routes.ts               # App route constants
│       └── config.ts               # App configuration
│
├── styles/                         # Additional styles (optional)
│   └── custom.css                  # Custom CSS if needed
│
├── scripts/                        # Utility scripts
│   ├── generate-types.py           # Generate Supabase types
│   └── seed.ts                     # Database seeding
│
├── supabase/                       # Supabase configuration
│   ├── config.toml                 # Supabase config
│   ├── schema-dump.sql             # Schema backup
│   ├── migrations/                 # Database migrations
│   │   ├── 20240101_initial.sql
│   │   └── 20240102_add_features.sql
│   └── functions/                  # Edge functions
│       └── webhook-handler/
│           └── index.ts
│
├── tests/                          # Test files
│   ├── unit/
│   │   └── features/
│   ├── integration/
│   └── e2e/
│       └── salon-booking.spec.ts
│
├── docs/                           # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEVELOPMENT.md
│   ├── FRONTEND_BEST_PRACTICES.md
│   ├── SUPABASE_BEST_PRACTICES.md
│   └── README.md
│
├── .claude/                        # Claude Code configs
│   ├── agents/
│   └── commands/
│
├── .env.local                      # Environment variables (git ignored)
├── .env.example                    # Example env file
├── .gitignore
├── components.json                 # shadcn/ui config
├── next.config.mjs                 # Next.js config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
├── postcss.config.mjs              # PostCSS config
├── package.json                    # Dependencies
├── pnpm-lock.yaml                  # Lock file
├── CLAUDE.md                       # AI development guidelines
└── README.md                       # Project README
```

---

## 🏗️ FEATURE MODULE ARCHITECTURE

### Core Principle: Domain-Driven Feature Modules

Each feature module is **self-contained** and maps directly to business domains in the database.

### Standard Feature Structure

```
features/[feature-name]/
├── components/           # Feature-specific UI components
│   ├── [feature]-list.tsx
│   ├── [feature]-card.tsx
│   ├── [feature]-form.tsx
│   └── [feature]-filters.tsx
├── dal/                 # Data Access Layer (queries/mutations)
│   └── [feature].queries.ts
├── actions/             # Server Actions
│   └── [feature].actions.ts
├── hooks/              # Feature-specific React hooks (optional)
│   └── use-[feature].ts
├── types/              # Feature-specific types (optional)
│   └── [feature].types.ts
├── utils/              # Feature utilities (optional)
│   └── [feature].utils.ts
└── index.tsx           # Feature entry point (ONLY if needed)
```

### Feature Module Rules

1. **Single Responsibility**: Each feature handles one business domain
2. **No Cross-Feature Imports**: Features should not import from other features
3. **Shared Code**: Use `packages/ui` for shared components, `lib/` for shared utilities
4. **Database First**: Feature structure mirrors database schema domains

---

## 🗄️ DATABASE-ALIGNED STRUCTURE

### Schema-to-Feature Mapping

Our database has **8 core business schemas**. Features align with these:

#### 1. Organization Domain (8 tables)
```typescript
// Tables: salons, staff_profiles, salon_locations, salon_chains,
//         operating_hours, salon_settings, salon_media, salon_metrics

Features:
├── salon-discovery/        // Browse & search salons
├── salon-detail/          // Individual salon view
├── staff-management/      // Manage staff members
└── admin-salons/          // Admin salon management
```

#### 2. Catalog Domain (5 tables)
```typescript
// Tables: services, service_categories, service_pricing,
//         service_booking_rules, staff_services

Features:
├── services-management/   // CRUD services
└── booking/              // Service selection in booking flow
```

#### 3. Scheduling Domain (7 tables)
```typescript
// Tables: appointments, appointment_services, staff_schedules,
//         blocked_times, time_off_requests

Features:
├── appointments-management/  // Business view of appointments
├── booking/                 // Customer booking flow
├── blocked-times/           // Staff unavailability
└── customer-profile/        // Customer's appointment history
```

#### 4. Identity Domain (8 tables)
```typescript
// Tables: profiles, user_roles, role_permissions, sessions,
//         password_reset_tokens, email_verification_tokens,
//         mfa_factors, audit_logs

Features:
├── auth/                 // Login, signup, password reset
├── customer-profile/     // User profile management
└── admin-users/          // Admin user management
```

#### 5. Analytics Domain (3 tables)
```typescript
// Tables: daily_metrics, operational_metrics, manual_transactions

Features:
├── analytics/            // Business analytics dashboard
├── advanced-analytics/   // AI insights & forecasting
└── dashboard/           // Business dashboard with metrics
```

#### 6. Communication Domain (3 tables)
```typescript
// Tables: messages, message_threads, webhook_queue

Features:
├── notifications/        // Notification management
└── [future: messaging]   // Direct messaging (planned)
```

#### 7. Engagement Domain (1 table)
```typescript
// Tables: customer_favorites

Features:
└── favorites/           // Customer favorites
```

#### 8. Inventory Domain (10 tables)
```typescript
// Tables: products, product_categories, product_inventory,
//         inventory_transactions, suppliers, purchase_orders,
//         purchase_order_items, stock_alerts, barcode_mappings

Features:
└── [future: inventory]  // Inventory management (planned)
```

### Public Schema Views (Query Layer)

**CRITICAL**: Always query from `public` schema views, never direct schema tables.

```typescript
// ✅ CORRECT - Query public views
const { data } = await supabase
  .from('appointments')  // public.appointments view
  .select(`
    *,
    salon:salons(*),
    customer:profiles(*),
    staff:staff_profiles(*)
  `)

// ❌ WRONG - Direct schema access (missing relationships in types)
const { data } = await supabase
  .schema('scheduling')
  .from('appointments')  // scheduling.appointments table
  .select('*')
```

**Why?** Supabase type generator omits cross-schema foreign key relationships from `Tables` types. Only `public.Views` have complete relationship definitions.

---

## 🎯 TYPE SAFETY PATTERNS

### 1. Import Database Types

```typescript
// ✅ ALWAYS import from lib/types
import type { Database } from '@/lib/types/database.types'

// Define types using Views (not Tables)
type Salon = Database['public']['Views']['salons']['Row']
type Appointment = Database['public']['Views']['appointments']['Row']
type Service = Database['public']['Views']['services']['Row']

// For relationships, use Views for autocomplete
type AppointmentWithRelations = Database['public']['Views']['appointments']['Row'] & {
  salon: Database['public']['Views']['salons']['Row']
  customer: Database['public']['Views']['profiles']['Row']
}
```

### 2. Type Helper Utilities

```typescript
// lib/types/database.helpers.ts
import type { Database } from '@enorae/database/types'

// Generic row type extractor
export type Row<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row']

// Generic insert type extractor
export type Insert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

// Generic update type extractor
export type Update<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Usage in features
type Salon = Row<'salons'>
type AppointmentInsert = Insert<'appointments'>
type ServiceUpdate = Update<'services'>
```

### 3. Form Data Types

```typescript
// features/services-management/types/service.types.ts
import type { Row, Insert, Update } from '@/lib/types/database.helpers'

// Read-only view
export type Service = Row<'services'>

// Form input (for create)
export type ServiceFormData = Insert<'services'>

// Form input (for update)
export type ServiceUpdateData = Update<'services'>

// Extended with relations
export type ServiceWithCategory = Service & {
  category: Row<'service_categories'>
  staff: Row<'staff_profiles'>[]
}
```

---

## 🔐 DATA ACCESS LAYER (DAL) BEST PRACTICES

### DAL Structure

Every feature has a `dal/` folder with `.queries.ts` files:

```typescript
// features/[feature]/dal/[feature].queries.ts
import 'server-only'  // ⚠️ MANDATORY
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
```

### Pattern 1: Authenticated Query

```typescript
export async function getSalons(): Promise<Salon[]> {
  const supabase = await createClient()

  // 1. ALWAYS check auth first
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Query with explicit filter (helps RLS + query planner)
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', user.id)  // Explicit filter
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Pattern 2: Query with Relationships

```typescript
export async function getAppointmentWithDetails(
  appointmentId: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Use TypeScript relationships from public views
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      salon:salons(id, name, slug, address),
      customer:profiles(id, username, email),
      staff:staff_profiles(id, name, bio),
      services:appointment_services(
        *,
        service:services(id, name, price, duration_minutes)
      )
    `)
    .eq('id', appointmentId)
    .single()

  if (error) throw error
  return data
}
```

### Pattern 3: Pagination

```typescript
export async function getSalonsPaginated({
  page = 1,
  perPage = 10,
  search = ''
}: {
  page?: number
  perPage?: number
  search?: string
}) {
  const supabase = await createClient()

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('salons')
    .select('*', { count: 'exact' })
    .range(from, to)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data,
    pagination: {
      page,
      perPage,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / perPage)
    }
  }
}
```

### Pattern 4: RLS-Optimized Queries

```typescript
// ⚠️ PERFORMANCE CRITICAL - Follow Supabase RLS best practices

export async function getUserAppointments() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ✅ FAST - Explicit filter helps query planner + RLS
  // RLS policy: (select auth.uid()) = customer_id
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', user.id)  // Explicit filter
    .order('scheduled_at', { ascending: false })

  if (error) throw error
  return data
}

// ❌ SLOW - Relies only on RLS (no explicit filter)
// export async function getUserAppointments() {
//   const { data } = await supabase.from('appointments').select()
//   return data
// }
```

### DAL Error Handling

```typescript
export async function getSalon(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  // Handle specific error types
  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Salon not found')
    }
    throw error
  }

  return data
}
```

---

## ⚡ COMPONENT PATTERNS

### 1. Server Components (Default)

```typescript
// features/salon-discovery/index.tsx
import { getSalonsPaginated } from './dal/salons.queries'
import { SalonGrid } from './components/salon-grid'
import { SearchFilters } from './components/search-filters'

type Props = {
  searchParams: {
    page?: string
    search?: string
  }
}

export default async function SalonDiscoveryPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''

  // Data fetching in server component
  const { data: salons, pagination } = await getSalonsPaginated({
    page,
    search
  })

  return (
    <div className="container py-8">
      <SearchFilters />
      <SalonGrid salons={salons} pagination={pagination} />
    </div>
  )
}
```

### 2. Client Components (Interactive)

```typescript
// features/salon-discovery/components/search-filters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@enorae/ui'
import { useDebouncedCallback } from 'use-debounce'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set('search', value)
      params.set('page', '1')  // Reset to page 1
    } else {
      params.delete('search')
    }

    router.push(`?${params.toString()}`)
  }, 300)

  return (
    <Input
      placeholder="Search salons..."
      defaultValue={searchParams.get('search') || ''}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

### 3. Presentation Components

```typescript
// features/salon-discovery/components/salon-card.tsx
import type { Database } from '@enorae/database/types'
import { Card, CardHeader, CardTitle, CardDescription } from '@enorae/ui'
import Link from 'next/link'

type Salon = Database['public']['Views']['salons']['Row']

type Props = {
  salon: Salon
}

export function SalonCard({ salon }: Props) {
  return (
    <Link href={`/salons/${salon.slug}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{salon.name}</CardTitle>
          <CardDescription>{salon.address}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
```

### 4. Form Components with Server Actions

```typescript
// features/services-management/components/service-form.tsx
'use client'

import { useFormState } from 'react-dom'
import { createService } from '../actions/services.actions'
import { Button, Input, Label } from '@enorae/ui'

export function ServiceForm() {
  const [state, formAction] = useFormState(createService, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Haircut"
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          placeholder="50.00"
        />
      </div>

      {state?.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button type="submit">Create Service</Button>
    </form>
  )
}
```

### 5. Loading States

```typescript
// features/salon-discovery/loading.tsx
import { Skeleton } from '@enorae/ui'

export default function SalonDiscoveryLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  )
}
```

---

**Last Updated**: 2025-10-01
**Maintained By**: Enorae Development Team
**Status**: Production-Ready ✅
