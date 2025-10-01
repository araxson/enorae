# 🚀 ENORAE PROJECT - AI Development Guidelines

## 🎯 PROJECT OVERVIEW

**Enorae** is a modern salon booking platform built with Next.js 15, Supabase, and TypeScript. This document defines the MANDATORY rules and architecture for AI-assisted development.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Type Safety**: TypeScript 5.6, Zod validation
- **Deployment**: Vercel (Frontend), Supabase Cloud (Backend)

---

## 🏗️ SECTION 1: ARCHITECTURE - MODULAR MONOLITH

### 1.1 PROJECT STRUCTURE
```
enorae/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                 # App router pages
│       │   ├── (customer)/      # Customer-facing pages (enorae.com)
│       │   ├── business/        # Business dashboard (business.enorae.com)
│       │   └── admin/           # Admin panel (admin.enorae.com)
│       ├── features/            # Feature modules
│       ├── components/          # Shared components
│       └── lib/                 # Utilities & helpers
│
├── packages/
│   ├── database/               # Database types & client
│   │   ├── types.ts           # Auto-generated from Supabase
│   │   └── client.ts          # Supabase client wrapper
│   ├── ui/                    # Shared UI components
│   └── core/                  # Business logic & domain models
│
└── supabase/
    ├── migrations/            # Database migrations
    └── functions/            # Edge functions
```

### 1.2 DATABASE ARCHITECTURE
```
CLEAN DATABASE STRUCTURE (101 tables, 22 schemas):

📁 Business Domains (45 tables):
├── organization (8)    → Salons, staff, locations, chains
├── catalog (5)        → Services, categories, pricing
├── scheduling (7)     → Appointments, schedules, time-off
├── inventory (10)     → Products, stock, suppliers
├── identity (8)       → Users, roles, profiles, sessions
├── communication (3)  → Messages, notifications
├── analytics (3)      → Metrics, reports
└── engagement (1)     → Reviews, favorites

📁 System Schemas (56 tables):
├── auth (17)          → Supabase authentication
├── storage (7)        → File management
├── security (8)       → RLS, audit logs
└── [other system]     → Infrastructure
```

### 1.3 FEATURE MODULE PATTERN
Each feature module follows this structure:
```
features/[feature-name]/
├── components/        # Feature-specific UI components
├── hooks/            # Feature-specific React hooks
├── actions/          # Server actions
├── dal/              # Data access layer
├── types/            # Feature types
└── utils/            # Feature utilities
```

---

## ⚠️ SECTION 2: CRITICAL RULES - ZERO TOLERANCE

### 2.1 FORBIDDEN ACTIONS (AUTOMATIC REFUSAL)
| Action | Response |
|--------|----------|
| Create microservices | "Use feature modules in the monolith" |
| Create custom UI components | "Use shadcn/ui components only" |
| Create database tables | "Use existing 101 tables" |
| Add custom colors | "Use shadcn default colors only" |
| Create src/ folders | "Use flat structure, no src/" |
| Use 'any' type | "Import types from @/packages/database" |
| Skip auth checks | "All DAL functions need auth" |

### 2.2 DATABASE RULES
```typescript
// ❌ NEVER create new tables or schemas
CREATE TABLE ... // FORBIDDEN

// ❌ NEVER modify database structure without permission
ALTER TABLE ... // ASK USER FIRST

// ✅ ALWAYS use existing views and tables
SELECT * FROM public.salons // Use public views
```

### 2.3 TYPE SYSTEM RULES
```typescript
// ✅ CORRECT - Import database types
import type { Database } from '@/packages/database/types'
type Salon = Database['public']['Views']['salons']['Row']

// ❌ FORBIDDEN - Custom type definitions
interface Salon {
  id: string
  name: string
}

// ❌ FORBIDDEN - Any types
const salon: any = await getSalon()
```

---

## 📋 SECTION 3: DEVELOPMENT PATTERNS

### 3.1 DATA ACCESS LAYER (DAL) PATTERN
Every DAL function MUST follow this pattern:
```typescript
// features/[feature]/dal/queries.ts
import { createClient } from '@/packages/database/client'
import type { Database } from '@/packages/database/types'

export async function getSalons() {
  // 1. Create client
  const supabase = await createClient()

  // 2. Check auth (MANDATORY)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 3. Query with RLS
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', user.id)

  if (error) throw error
  return data
}
```

### 3.2 SERVER ACTIONS PATTERN
```typescript
// features/[feature]/actions/[feature].actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/packages/database/client'

export async function updateSalon(formData: FormData) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Update with validation
  const { error } = await supabase
    .from('salons')
    .update({ name: formData.get('name') })
    .eq('id', formData.get('id'))
    .eq('owner_id', user.id) // RLS check

  if (error) throw error
  revalidatePath('/business/salons')
}
```

### 3.3 COMPONENT PATTERN
```typescript
// features/[feature]/components/[component].tsx
import { getSalons } from '../dal/queries'

export async function SalonList() {
  const salons = await getSalons()

  return (
    <div className="grid gap-4">
      {salons.map(salon => (
        <Card key={salon.id}>
          <CardHeader>
            <CardTitle>{salon.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
```

---

## 🎨 SECTION 4: UI & STYLING RULES

### 4.1 COMPONENT RULES
- **ONLY** use shadcn/ui components
- **NEVER** create custom UI components
- **ALWAYS** use shadcn variants and sizes

### 4.2 COLOR SYSTEM
```css
/* ONLY use these semantic variables */
--background, --foreground
--primary, --secondary
--muted, --accent
--destructive
--border, --input, --ring
```

### 4.3 TAILWIND CSS 4
- **NO** tailwind.config files (CSS-based config)
- **NO** custom colors or themes
- **USE** only default Tailwind utilities

---

## 📁 SECTION 5: FILE & FOLDER NAMING

### 5.1 MANDATORY NAMING PATTERNS

#### Folders: `kebab-case`
```
✅ CORRECT:
- customer-portal/
- salon-dashboard/
- time-off-requests/

❌ WRONG:
- customerPortal/
- SalonDashboard/
- time_off_requests/
```

#### Files by Type:
```typescript
// Components: kebab-case.tsx
✅ salon-card.tsx
✅ booking-form.tsx
❌ SalonCard.tsx

// DAL: [feature].queries.ts
✅ salon.queries.ts
✅ booking.mutations.ts
❌ queries.ts

// Hooks: use-[name].ts
✅ use-salon-data.ts
❌ useSalonData.ts

// Actions: [feature].actions.ts
✅ salon.actions.ts
❌ actions.ts

// Types: [feature].types.ts
✅ salon.types.ts
❌ types.ts
```

### 5.2 FORBIDDEN PATTERNS
Never use these suffixes:
- `-fixed`, `-v2`, `-new`, `-old`, `-temp`
- `-updated`, `-revised`, `-enhanced`
- `-refactored`, `-improved`, `-optimized`

---

## 🔒 SECTION 6: SECURITY

### 6.1 AUTHENTICATION REQUIREMENTS
- **EVERY** data access needs auth check
- **NEVER** trust client-side auth alone
- **ALWAYS** verify in server components/actions
- **USE** Row Level Security (RLS)

### 6.2 MIDDLEWARE LIMITATIONS
```typescript
// middleware.ts - ONLY for route protection
export function middleware(request: NextRequest) {
  // Only use for static route protection
  // NOT for data authorization
}
```

---

## 📊 SECTION 7: DATABASE SCHEMA REFERENCE

### 7.1 CORE BUSINESS TABLES
```sql
-- Organization (8 tables)
salons                 -- Salon profiles
staff_profiles         -- Staff members
salon_locations        -- Multiple locations
salon_chains          -- Chain management
operating_hours       -- Business hours
salon_settings        -- Configuration
salon_media          -- Images/videos
salon_metrics        -- Performance data

-- Catalog (5 tables)
services              -- Service definitions
service_categories    -- Categories
service_pricing      -- Dynamic pricing
service_booking_rules -- Booking constraints
staff_services      -- Staff capabilities

-- Scheduling (7 tables)
appointments         -- Bookings
appointment_services -- Booked services
staff_schedules     -- Availability
blocked_times       -- Unavailable slots
time_off_requests   -- Leave management

-- Identity (8 tables)
profiles            -- User profiles
user_roles          -- Role assignments
sessions            -- Active sessions
audit_logs          -- Activity tracking
```

### 7.2 PUBLIC VIEWS (UPDATABLE)
All public schema views support INSERT, UPDATE, DELETE:
```sql
public.salons         -- Salon data with owner info
public.services       -- Services with categories
public.appointments   -- Appointments with details
public.staff         -- Staff with profiles
public.profiles      -- User profiles with metadata
```

---

## ⚡ SECTION 8: QUICK REFERENCE

### 8.1 COMMON COMMANDS
```bash
# Development
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm typecheck       # Type checking

# Database
pnpm db:types        # Generate TypeScript types
pnpm db:migrate      # Run migrations
pnpm db:seed         # Seed data

# Testing
pnpm test           # Run tests
pnpm test:e2e       # E2E tests
```

### 8.2 IMPORT PATHS
```typescript
// Database types
import type { Database } from '@/packages/database/types'

// Supabase client
import { createClient } from '@/packages/database/client'

// UI components
import { Button } from '@/components/ui/button'

// Feature modules
import { SalonList } from '@/features/salons/components/salon-list'
```

### 8.3 URL STRUCTURE
```
# Customer Pages
/                          # Homepage
/salons/[slug]            # Salon details
/book/[salon-slug]        # Booking flow

# Business Dashboard
/business                 # Dashboard home
/business/appointments    # Manage bookings
/business/staff          # Staff management
/business/analytics      # Reports

# Admin Panel
/admin                   # Admin home
/admin/salons           # All salons
/admin/users            # User management
```

---

## ✅ SECTION 9: PRE-FLIGHT CHECKLIST

Before writing ANY code, verify:
- [ ] Using existing database tables (101 tables)
- [ ] Importing types from @/packages/database
- [ ] Auth check in every DAL function
- [ ] Using shadcn/ui components only
- [ ] Following kebab-case naming
- [ ] No custom colors or themes
- [ ] No src/ folders
- [ ] No 'any' types
- [ ] No database modifications without permission

---

## 🚫 SECTION 10: IMMEDIATE STOP CONDITIONS

**STOP** and ask for clarification if:
1. Database table doesn't exist for feature
2. Type doesn't exist in database.types.ts
3. Tempted to create custom UI component
4. Want to modify database structure
5. Unsure about auth implementation
6. Column names don't match database

---

## 📌 FINAL RULES

1. **Simplicity First** - Don't over-engineer
2. **Use What Exists** - 101 tables are enough
3. **Type Safety** - Real types only
4. **Security Always** - Auth checks everywhere
5. **Consistency** - Follow patterns exactly
6. **No Assumptions** - Verify everything

---

## 🎯 MVP FEATURES TO BUILD

### Phase 1: Core Features (Week 1-2)
- [ ] Customer salon discovery
- [ ] Service browsing
- [ ] Appointment booking
- [ ] User authentication

### Phase 2: Business Features (Week 3-4)
- [ ] Business dashboard
- [ ] Staff management
- [ ] Schedule management
- [ ] Basic analytics

### Phase 3: Enhancement (Week 5-6)
- [ ] Reviews & ratings
- [ ] Email notifications
- [ ] Payment integration
- [ ] Mobile responsive

---

*Last Updated: 2025-09-30*
*Database: 101 tables, 22 schemas*
*Architecture: Modular Monolith*
*Status: Production-Ready*