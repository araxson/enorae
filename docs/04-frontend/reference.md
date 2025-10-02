# 📚 FRONTEND - REFERENCE

> **Navigation**: [📘 Docs Index](../index.md) | [🏠 README](../../README.md) | [🤖 CLAUDE.md](../../CLAUDE.md)

> **Enorae Platform - Quick Reference & Conventions**
> **Last Updated**: 2025-10-01

---

## 📋 TABLE OF CONTENTS

1. [Feature Module Reference](#feature-module-reference)
2. [UI Component Library](#ui-component-library)
3. [Routing Structure](#routing-structure)
4. [Naming Conventions](#naming-conventions)
5. [Security Best Practices](#security-best-practices)
6. [Import Organization](#import-organization)
7. [Quick Checklist](#quick-checklist)
8. [Additional Resources](#additional-resources)

---

## 📚 FEATURE MODULE REFERENCE

### Current Feature Modules

| Feature | Domain | Tables Used | Status |
|---------|--------|-------------|--------|
| `salon-discovery` | Organization | salons, salon_locations | ✅ Active |
| `salon-detail` | Organization | salons, staff_profiles, services | ✅ Active |
| `staff-management` | Organization | staff_profiles, staff_services | ✅ Active |
| `services-management` | Catalog | services, service_categories | ✅ Active |
| `booking` | Scheduling | appointments, services, staff_profiles | ✅ Active |
| `appointments-management` | Scheduling | appointments, appointment_services | ✅ Active |
| `blocked-times` | Scheduling | blocked_times, staff_schedules | ✅ Active |
| `auth` | Identity | profiles, sessions | ✅ Active |
| `customer-profile` | Identity | profiles, appointments | ✅ Active |
| `dashboard` | Analytics | daily_metrics, appointments | ✅ Active |
| `analytics` | Analytics | daily_metrics, operational_metrics | ✅ Active |
| `advanced-analytics` | Analytics | daily_metrics (with AI) | ✅ Active |
| `favorites` | Engagement | customer_favorites | ✅ Active |
| `notifications` | Communication | messages, webhook_queue | ✅ Active |
| `admin-dashboard` | Admin | All tables | ✅ Active |
| `admin-salons` | Admin | salons | ✅ Active |
| `admin-users` | Admin | profiles, user_roles | ✅ Active |
| `home` | Public | salons | ✅ Active |
| `navigation` | UI | - | ✅ Active |

### Planned Features

| Feature | Domain | Priority | Description |
|---------|--------|----------|-------------|
| `inventory` | Inventory | Medium | Product & stock management |
| `messaging` | Communication | Low | Direct customer-salon messaging |
| `reviews` | Engagement | Medium | Customer reviews & ratings |
| `loyalty` | Engagement | Low | Loyalty programs |
| `reports` | Analytics | Medium | Exportable business reports |

---

## 🎨 UI COMPONENT LIBRARY

### Workspace Package: `@enorae/ui`

All UI components come from `packages/ui` (shadcn/ui based):

```typescript
// Import from workspace package
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Select,
  Dialog,
  Skeleton,
  Alert
} from '@enorae/ui'

// Layout components
import {
  Container,
  Stack,
  Grid,
  Flex,
  Center,
  Divider
} from '@enorae/ui/layout'
```

### Custom Component Rules

1. **Never create custom UI primitives** (buttons, inputs, cards)
2. **Compose shadcn components** for feature-specific needs
3. **Use Tailwind for spacing/layout** only
4. **No custom colors** - use semantic tokens only

---

## 🚦 ROUTING STRUCTURE

### App Router Structure

```
app/
├── (customer)/              # Customer-facing routes
│   ├── page.tsx            # Homepage (/)
│   ├── salons/
│   │   ├── page.tsx        # Salon listing (/salons)
│   │   └── [slug]/
│   │       └── page.tsx    # Salon detail (/salons/:slug)
│   └── profile/
│       └── page.tsx        # Customer profile (/profile)
│
├── business/               # Business dashboard
│   ├── layout.tsx         # Business layout with sidebar
│   ├── page.tsx           # Dashboard home (/business)
│   ├── appointments/
│   │   └── page.tsx       # Appointments (/business/appointments)
│   ├── staff/
│   │   └── page.tsx       # Staff management (/business/staff)
│   ├── services/
│   │   └── page.tsx       # Services (/business/services)
│   └── analytics/
│       └── page.tsx       # Analytics (/business/analytics)
│
├── admin/                 # Admin panel
│   ├── layout.tsx        # Admin layout
│   ├── page.tsx          # Admin dashboard (/admin)
│   ├── salons/
│   │   └── page.tsx      # All salons (/admin/salons)
│   └── users/
│       └── page.tsx      # All users (/admin/users)
│
├── auth/                 # Auth routes
│   ├── login/
│   │   └── page.tsx     # Login (/auth/login)
│   └── signup/
│       └── page.tsx     # Signup (/auth/signup)
│
└── api/                  # API routes
    └── webhooks/
        └── route.ts      # Webhook handlers
```

---

## 📝 NAMING CONVENTIONS

### Files

| Type | Convention | Example |
|------|------------|---------|
| Components | `kebab-case.tsx` | `salon-card.tsx` |
| Pages | `page.tsx` | `page.tsx` |
| Layouts | `layout.tsx` | `layout.tsx` |
| Loading | `loading.tsx` | `loading.tsx` |
| Error | `error.tsx` | `error.tsx` |
| DAL | `[feature].queries.ts` | `salon.queries.ts` |
| Actions | `[feature].actions.ts` | `salon.actions.ts` |
| Types | `[feature].types.ts` | `salon.types.ts` |
| Hooks | `use-[name].ts` | `use-salon.ts` |

### Folders

- **Always `kebab-case`**: `salon-discovery/`, `staff-management/`
- **Never underscores or PascalCase**: ❌ `salon_discovery/`, ❌ `SalonDiscovery/`

### Variables & Functions

```typescript
// Variables: camelCase
const salonData = await getSalons()
const appointmentList = []

// Functions: camelCase
function handleSubmit() {}
async function fetchUserData() {}

// Components: PascalCase
function SalonCard() {}
export default function SalonDetailPage() {}

// Constants: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5_000_000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
```

---

## 🔒 SECURITY BEST PRACTICES

### 1. Always Validate Input

```typescript
import { z } from 'zod'

const appointmentSchema = z.object({
  salon_id: z.string().uuid(),
  service_id: z.string().uuid(),
  scheduled_at: z.string().datetime()
})

export async function createAppointment(data: unknown) {
  const validated = appointmentSchema.parse(data)
  // Now safe to use
}
```

### 2. Never Trust Client-Side Auth

```typescript
// ❌ BAD - Client provides user ID
export async function deleteAppointment(appointmentId: string, userId: string) {
  await supabase.from('appointments').delete().eq('id', appointmentId)
}

// ✅ GOOD - Server verifies auth
export async function deleteAppointment(appointmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)
    .eq('customer_id', user.id)  // Verify ownership
}
```

### 3. Use RLS Policies

All tables have RLS enabled. Always:
1. Check `auth.uid()` in policies
2. Wrap in `(select auth.uid())` for performance
3. Add explicit filters in queries

### 4. Sanitize User Input

```typescript
import DOMPurify from 'isomorphic-dompurify'

// For rich text/HTML
const sanitized = DOMPurify.sanitize(userInput)

// For search queries
const safeQuery = searchQuery.replace(/[^\w\s]/gi, '')
```

---

## 📦 IMPORT ORGANIZATION

### Import Order

```typescript
// 1. React & Next.js
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

// 2. External packages
import { z } from 'zod'
import { format } from 'date-fns'

// 3. Workspace packages
import type { Database } from '@enorae/database/types'
import { createClient } from '@enorae/database/client'
import { Button, Card } from '@enorae/ui'

// 4. Absolute imports (app-level)
import { getSalons } from '@/features/salons/dal/salons.queries'
import { SalonCard } from '@/features/salons/components/salon-card'

// 5. Relative imports (same feature)
import { ServiceList } from './components/service-list'
import { useService } from './hooks/use-service'
```

### Import Paths (Single App)

```typescript
// ✅ CORRECT - Use @ alias for all app imports
import type { Database } from '@/lib/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { getSalons } from '@/features/salon-discovery/dal/salons.queries'
import { formatPrice } from '@/lib/utils/format'

// ❌ WRONG - Relative imports across features
// import { getSalons } from '../../../features/salons/dal/salons.queries'
```

---

## 🎯 QUICK CHECKLIST

Before committing a new feature:

- [ ] Feature module follows standard structure
- [ ] DAL queries use `'server-only'` directive
- [ ] All queries use public schema views (not schema.table)
- [ ] Types imported from `@enorae/database/types`
- [ ] Auth check in every DAL function
- [ ] RLS policies wrapped in `(select auth.uid())`
- [ ] Explicit filters added (`.eq('user_id', user.id)`)
- [ ] Components use shadcn/ui only
- [ ] File names in kebab-case
- [ ] No 'any' types
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] TypeScript strict mode passes
- [ ] Tests written (if applicable)

---

## 📚 ADDITIONAL RESOURCES

- **Database Best Practices**: [`docs/03-database/best-practices.md`](../03-database/best-practices.md)
- **Architecture Overview**: [`docs/02-architecture/overview.md`](../02-architecture/overview.md)
- **Project README**: [`README.md`](../../README.md)
- **AI Guidelines**: [`CLAUDE.md`](../../CLAUDE.md)

---

**Last Updated**: 2025-10-01
**Maintained By**: Enorae Development Team
**Status**: Production-Ready ✅
