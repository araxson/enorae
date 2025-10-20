# File Organization Patterns

**Canonical structure with file size management strategies**

## Core Principle

Start simple, scale only when needed. Files can grow, but maintain clear boundaries.

---

## The Canonical Structure

```
features/{portal}/{feature}/
├── components/       # UI components
├── api/
│   ├── queries.ts   # Server-only reads
│   └── mutations.ts # Server actions
├── types.ts         # TypeScript types
├── schema.ts        # Zod validation schemas
└── index.tsx        # Main feature export
```

**Golden Rule:** This is the starting point. Only deviate when file size becomes unmanageable.

---

## When to Split Files

### File Size Thresholds

| File Type | Keep as Single | Consider Splitting | Must Split |
|-----------|----------------|-------------------|------------|
| `queries.ts` | < 300 lines | 300-500 lines | > 500 lines |
| `mutations.ts` | < 300 lines | 300-500 lines | > 500 lines |
| `components/` | < 200 lines/component | 200-400 lines | > 400 lines |
| `types.ts` | < 200 lines | 200-400 lines | > 400 lines |
| `schema.ts` | < 150 lines | 150-300 lines | > 300 lines |

### Signs You Need to Split

1. ✅ **Scrolling fatigue** - Taking >5 seconds to find a function
2. ✅ **Multiple concerns** - File handles 3+ distinct domains
3. ✅ **Merge conflicts** - Frequent git conflicts in same file
4. ✅ **Import bloat** - 20+ imports at the top
5. ✅ **Test complexity** - Hard to isolate for testing

---

## Splitting Strategy: API Files

### Stage 1: Single File (< 300 lines)

```
api/
├── queries.ts      # All reads
└── mutations.ts    # All writes
```

**Example (`api/queries.ts`):**
```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

// Appointments
export async function getAppointments(salonId: string) { ... }
export async function getAppointmentById(id: string) { ... }

// Staff
export async function getStaffMembers(salonId: string) { ... }
export async function getStaffSchedule(staffId: string) { ... }

// Services
export async function getServices(salonId: string) { ... }
```

---

### Stage 2: Grouped Queries (300-500 lines)

**When to use:** File is getting long but concerns are clear.

```
api/
├── queries/
│   ├── index.ts           # Re-export all
│   ├── appointments.ts    # Appointment reads
│   ├── staff.ts          # Staff reads
│   └── services.ts       # Service reads
└── mutations/
    ├── index.ts           # Re-export all
    ├── appointments.ts    # Appointment writes
    └── staff.ts          # Staff writes
```

**Structure:**

`api/queries/appointments.ts`:
```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getAppointments(salonId: string) { ... }
export async function getAppointmentById(id: string) { ... }
export async function getAppointmentStats(salonId: string) { ... }
```

`api/queries/index.ts`:
```ts
// Re-export everything for clean imports
export * from './appointments'
export * from './staff'
export * from './services'
```

**Usage:**
```ts
// ✅ Import from index
import { getAppointments, getStaffMembers } from '@/features/business/appointments/api/queries'

// ❌ Don't import from subfiles
import { getAppointments } from '@/features/business/appointments/api/queries/appointments'
```

---

### Stage 3: Domain Subfolders (> 500 lines)

**When to use:** Multiple distinct domains within the feature.

```
api/
├── queries/
│   ├── index.ts                    # Re-export all
│   ├── appointments/
│   │   ├── index.ts               # Re-export domain
│   │   ├── get-list.ts
│   │   ├── get-by-id.ts
│   │   └── get-stats.ts
│   ├── staff/
│   │   ├── index.ts
│   │   ├── get-members.ts
│   │   └── get-schedule.ts
│   └── services/
│       └── index.ts
└── mutations/
    └── ...same pattern
```

**Structure:**

`api/queries/appointments/get-list.ts`:
```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getAppointments(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('owner_id', user.id)

  if (error) throw error
  return data
}
```

`api/queries/appointments/index.ts`:
```ts
export * from './get-list'
export * from './get-by-id'
export * from './get-stats'
```

`api/queries/index.ts`:
```ts
export * from './appointments'
export * from './staff'
export * from './services'
```

**Usage remains the same:**
```ts
// ✅ Still import from top-level
import { getAppointments, getStaffMembers } from '@/features/business/appointments/api/queries'
```

---

## Splitting Strategy: Components

### Stage 1: Flat Structure (< 10 components)

```
components/
├── appointments-table.tsx
├── appointment-card.tsx
├── appointment-filters.tsx
├── stats-card.tsx
└── empty-state.tsx
```

**Best for:** Simple features with few components.

---

### Stage 2: Grouped Components (10-20 components)

**When to use:** Clear functional groupings.

```
components/
├── table/
│   ├── appointments-table.tsx
│   ├── table-row.tsx
│   ├── table-filters.tsx
│   └── table-pagination.tsx
├── stats/
│   ├── stats-overview.tsx
│   ├── stats-card.tsx
│   └── revenue-chart.tsx
├── appointment-card.tsx
└── empty-state.tsx
```

**Rules:**
- ✅ Group by UI concern (table, stats, forms)
- ✅ Keep related components together
- ❌ Don't nest more than 1 level
- ❌ Don't create single-file folders

---

### Stage 3: Feature Subcomponents (> 20 components)

**When to use:** Large, complex features.

```
components/
├── dashboard/
│   ├── index.tsx              # Main dashboard component
│   ├── metrics-section.tsx
│   ├── appointments-section.tsx
│   └── staff-section.tsx
├── table/
│   ├── index.tsx              # Main table component
│   ├── table-row.tsx
│   ├── table-filters.tsx
│   └── table-actions.tsx
├── forms/
│   ├── appointment-form.tsx
│   └── reschedule-form.tsx
└── shared/
    ├── stat-card.tsx
    └── empty-state.tsx
```

**Guidelines:**
- Each subfolder should have an `index.tsx` as the main component
- Related components live in the same folder
- Maximum 1 level of nesting
- "shared" folder for truly reusable components within feature

---

## Splitting Strategy: Types

### Stage 1: Single File (< 200 lines)

```
types.ts
```

**Example:**
```ts
// Database types
export interface Appointment {
  id: string
  salon_id: string
  staff_id: string
  customer_id: string
  start_time: string
  status: AppointmentStatus
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

// Component props
export interface AppointmentsTableProps {
  appointments: Appointment[]
  onEdit: (id: string) => void
  onCancel: (id: string) => void
}

// API responses
export interface AppointmentStats {
  total: number
  pending: number
  revenue: number
}
```

---

### Stage 2: Domain Types (200-400 lines)

```
types/
├── index.ts           # Re-export all
├── appointments.ts    # Appointment types
├── staff.ts          # Staff types
└── services.ts       # Service types
```

**Example (`types/appointments.ts`):**
```ts
export interface Appointment {
  id: string
  salon_id: string
  staff_id: string
  customer_id: string
  start_time: string
  status: AppointmentStatus
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface AppointmentsTableProps {
  appointments: Appointment[]
  onEdit: (id: string) => void
}

export interface AppointmentStats {
  total: number
  pending: number
  revenue: number
}
```

`types/index.ts`:
```ts
export * from './appointments'
export * from './staff'
export * from './services'
```

**Usage:**
```ts
// ✅ Import from index
import { Appointment, Staff } from '@/features/business/appointments/types'
```

---

### Stage 3: Categorized Types (> 400 lines)

**For very large features only.**

```
types/
├── index.ts
├── database/
│   ├── index.ts
│   ├── appointments.ts
│   ├── staff.ts
│   └── services.ts
├── api/
│   ├── index.ts
│   ├── requests.ts
│   └── responses.ts
└── components/
    ├── index.ts
    ├── props.ts
    └── events.ts
```

---

## Splitting Strategy: Schemas

### Stage 1: Single File (< 150 lines)

```
schema.ts
```

**Example:**
```ts
import { z } from 'zod'

export const appointmentSchema = z.object({
  salon_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  start_time: z.string().datetime(),
  duration: z.number().min(15).max(480),
  notes: z.string().optional(),
})

export const rescheduleSchema = z.object({
  appointment_id: z.string().uuid(),
  new_start_time: z.string().datetime(),
})

export const cancelSchema = z.object({
  appointment_id: z.string().uuid(),
  reason: z.string().min(10).max(500),
})
```

---

### Stage 2: Domain Schemas (150-300 lines)

```
schemas/
├── index.ts              # Re-export all
├── appointments.ts       # Appointment schemas
├── staff.ts             # Staff schemas
└── services.ts          # Service schemas
```

**Usage:**
```ts
// ✅ Import from index
import { appointmentSchema, rescheduleSchema } from '@/features/business/appointments/schemas'
```

---

## Decision Tree

```
Start with canonical structure
    │
    ├── queries.ts < 300 lines? ───► Keep single file
    │   │
    │   └── NO ───► Split into queries/ folder
    │                │
    │                └── Still growing? ───► Add domain subfolders
    │
    ├── components/ < 10 files? ───► Keep flat
    │   │
    │   └── NO ───► Group by UI concern
    │                │
    │                └── > 20 files? ───► Add feature subfolders
    │
    └── types.ts < 200 lines? ───► Keep single file
        │
        └── NO ───► Split by domain
```

---

## Real-World Examples

### Small Feature (Marketing FAQ)

```
features/marketing/faq/
├── components/
│   ├── faq-list.tsx
│   └── faq-item.tsx
├── api/
│   └── queries.ts          # 50 lines
├── types.ts                # 30 lines
└── index.tsx
```

**Perfect.** No splitting needed.

---

### Medium Feature (Business Dashboard)

```
features/business/dashboard/
├── components/
│   ├── metrics-cards.tsx
│   ├── recent-bookings.tsx
│   ├── reviews-card.tsx
│   └── staff-summary.tsx
├── api/
│   ├── queries/
│   │   ├── index.ts
│   │   ├── appointments.ts  # 80 lines
│   │   ├── revenue.ts      # 60 lines
│   │   └── staff.ts        # 70 lines
│   └── mutations.ts         # 40 lines
├── types.ts                 # 120 lines
├── schema.ts               # 50 lines
└── index.tsx
```

**Good.** Stage 2 splitting for queries, rest stays simple.

---

### Large Feature (Business Appointments)

```
features/business/appointments/
├── components/
│   ├── table/
│   │   ├── index.tsx
│   │   ├── table-row.tsx
│   │   ├── table-filters.tsx
│   │   └── table-actions.tsx
│   ├── forms/
│   │   ├── create-form.tsx
│   │   └── reschedule-form.tsx
│   ├── stats/
│   │   ├── stats-overview.tsx
│   │   └── revenue-chart.tsx
│   └── appointment-card.tsx
├── api/
│   ├── queries/
│   │   ├── index.ts
│   │   ├── appointments/
│   │   │   ├── index.ts
│   │   │   ├── get-list.ts
│   │   │   ├── get-by-id.ts
│   │   │   └── get-stats.ts
│   │   └── staff/
│   │       ├── index.ts
│   │       └── get-available.ts
│   └── mutations/
│       ├── index.ts
│       ├── create.ts
│       ├── update.ts
│       ├── cancel.ts
│       └── reschedule.ts
├── types/
│   ├── index.ts
│   ├── appointments.ts
│   └── api.ts
├── schemas/
│   ├── index.ts
│   ├── appointments.ts
│   └── validation.ts
└── index.tsx
```

**Acceptable.** Stage 3 for complex feature, but still maintains boundaries.

---

## Anti-Patterns to Avoid

### ❌ Don't: Over-engineer small features

```
features/marketing/newsletter/
├── api/
│   └── mutations/
│       └── internal/
│           └── email/
│               └── subscribe.ts    # 20 lines
```

**Fix:** Just use `api/mutations.ts`

---

### ❌ Don't: Create single-file folders

```
components/
├── header/
│   └── header.tsx           # Only file in folder
└── footer/
    └── footer.tsx           # Only file in folder
```

**Fix:**
```
components/
├── header.tsx
└── footer.tsx
```

---

### ❌ Don't: Nest more than 2 levels

```
api/
└── queries/
    └── internal/
        └── appointments/
            └── helpers/
                └── filters/
                    └── date-range.ts    # Too deep!
```

**Fix:** Extract helpers to shared utility or flatten structure.

---

### ❌ Don't: Split prematurely

```
api/
├── queries/
│   ├── get-user.ts          # 15 lines
│   └── get-profile.ts       # 20 lines
└── mutations/
    ├── update-user.ts       # 25 lines
    └── update-profile.ts    # 30 lines
```

**Fix:** Combine into single files until they exceed 300 lines.

---

## Import Patterns

### Always use index re-exports

**Bad:**
```ts
import { getAppointments } from '@/features/business/appointments/api/queries/appointments/get-list'
```

**Good:**
```ts
import { getAppointments } from '@/features/business/appointments/api/queries'
```

### Index.ts pattern

**Every subfolder needs index.ts:**

`api/queries/appointments/index.ts`:
```ts
export * from './get-list'
export * from './get-by-id'
export * from './get-stats'
```

`api/queries/index.ts`:
```ts
export * from './appointments'
export * from './staff'
```

**Result:** Clean, simple imports regardless of internal structure.

---

## Migration Guide

### Consolidating Over-Split Files

**Current:**
```
api/
└── internal/
    ├── queries/
    │   ├── appointments.ts   # 40 lines
    │   ├── staff.ts         # 35 lines
    │   └── services.ts      # 30 lines
```

**Step 1:** Create `api/queries.ts`

```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

// === Appointments ===
export async function getAppointments(salonId: string) { ... }
export async function getAppointmentById(id: string) { ... }

// === Staff ===
export async function getStaffMembers(salonId: string) { ... }

// === Services ===
export async function getServices(salonId: string) { ... }
```

**Step 2:** Update imports

```bash
# Find all imports
rg "from '@/features/business/appointments/api/internal/queries" --type tsx

# Replace with
"from '@/features/business/appointments/api/queries"
```

**Step 3:** Delete old structure

```bash
rm -rf api/internal/
```

---

## Summary Rules

1. **Start simple** - Single files until size demands splitting
2. **Split by domain** - Group related functions, not by operation type
3. **Use index.ts** - Always re-export for clean imports
4. **Max 2 levels** - Don't create deep nesting
5. **No single-file folders** - If folder has 1 file, eliminate folder
6. **300-line threshold** - Split when files exceed this
7. **Import from index** - Never import from subfiles directly
8. **Group related code** - Keep cohesive functions together

---

## Quick Reference

| Size | Structure | Example |
|------|-----------|---------|
| Small (< 300 lines) | Single file | `api/queries.ts` |
| Medium (300-500) | Flat subfiles | `api/queries/{domain}.ts` |
| Large (> 500) | Domain folders | `api/queries/{domain}/{operation}.ts` |

**When in doubt:** Keep it simple. Only add structure when pain is real.

---

**Last Updated:** 2025-10-20
**Applies to:** All feature folders in ENORAE
