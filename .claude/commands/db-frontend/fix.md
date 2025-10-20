# Database-Frontend Alignment Fix - Reusable Session

Auto-fix database-frontend alignment issues in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted issues, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/db-frontend-alignment/analysis-report.json`

## Rules Reference

**Primary Rules**:
- `docs/rules/core/database.md`
- `docs/rules/framework/typescript.md`
- `docs/rules/core/architecture.md`
- `docs/rules/core/ui.md`
- `docs/rules/quality/accessibility.md`

**Index**: `docs/rules/01-rules-index.md`
**Task Guide**: `docs/rules/02-task-based-guide.md`

## Process

### 1. Load Report
```
Read: analysis-report.json
Filter: issues where status === "pending"
Sort: by priority_order (ascending - ALIGN-P001 → ALIGN-L999)
Take: First 10-20 issues
```

### 2. Fix Batch
For each issue in batch (ALIGN-P001 → ALIGN-L999):
1. Identify gap_type
2. Read target files
3. Apply fix based on fix_pattern from rule
4. Update files
5. Update issue status in JSON
6. Save report
7. Continue to next

### 3. Batch Complete

After fixing batch:
```
Show progress summary
Save updated report
Indicate if more issues remain
```

## Fix Patterns by Rule

### Rule: ALIGN-P001 {#align-p001}

**Pattern**: Every database table/view has corresponding frontend queries
**Fix**: Create missing query function

```ts
// ❌ WRONG - No query for staff_schedules table

// ✅ CORRECT - Add query
// File: features/staff/schedules/api/queries.ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type StaffSchedule = Database['public']['Tables']['staff_schedules']['Row']

export async function getStaffSchedules(staffId: string): Promise<StaffSchedule[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('staff_schedules')
    .select('*')
    .eq('staff_id', staffId)

  if (error) throw error
  return data
}
```

**Auto-fix**: Generate scaffold query file with TODO comments
**Manual**: Complete business logic, add filters, joins

**Reference**: `docs/rules/core/database.md#db-p001`
**Related**: DB-P001, ARCH-P001

### Rule: ALIGN-P002 {#align-p002}

**Pattern**: Every mutable table has corresponding frontend mutations
**Fix**: Create missing mutation functions

```ts
// ❌ WRONG - Appointments table missing delete mutation

// ✅ CORRECT - Add delete mutation
// File: features/business/appointments/api/mutations.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteAppointment(appointmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)

  if (error) throw error

  revalidatePath('/business/appointments')
  return { success: true }
}
```

**Auto-fix**: Generate mutation scaffold with auth check and revalidatePath
**Manual**: Add business logic, validation, error handling

**Reference**: `docs/rules/core/database.md#db-p002`
**Related**: DB-P002, DB-H103

### Rule: ALIGN-P003 {#align-p003}

**Pattern**: Frontend types use generated Database types
**Fix**: Replace manual types with generated types

```ts
// ❌ WRONG - Manual type definition
// File: features/business/appointments/types.ts
interface Appointment {
  id: string
  salon_id: string
  customer_id: string
  // Incomplete, will drift from schema
}

// ✅ CORRECT - Use generated type
import type { Database } from '@/lib/types/database.types'

export type Appointment = Database['public']['Views']['appointments']['Row']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']
```

**Auto-fix**: Replace manual interface with import
**Manual**: None (fully automatable)

**Reference**: `docs/rules/framework/typescript.md#ts-m302`
**Related**: TS-M302, DB-M301

### Rule: ALIGN-H101 {#align-h101}

**Pattern**: Tables with queries have complete UI components
**Fix**: Generate missing UI component scaffolds

```tsx
// ❌ WRONG - getServices() exists but no UI components

// ✅ CORRECT - Add list component
// File: features/business/services/components/ServicesList.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ServicesListProps {
  services: Service[]
}

export function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            No services found
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: Add more fields */}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

**Auto-fix**: Generate component scaffold with TODO comments
**Manual**: Complete component with all fields, styling, interactions

**Reference**: `docs/rules/core/architecture.md#arch-h101`
**Related**: ARCH-H101, UI-P004

### Rule: ALIGN-H102 {#align-h102}

**Pattern**: Form components include all editable columns
**Fix**: Add missing form fields

```tsx
// ❌ WRONG - Missing duration_minutes and is_active fields

// ✅ CORRECT - Complete form
// File: features/business/services/components/ServiceForm.tsx
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Field } from '@/components/ui/field'

export function ServiceForm() {
  return (
    <form className="space-y-4">
      <Field label="Service Name" required>
        <Input name="name" />
      </Field>

      <Field label="Description">
        <Textarea name="description" />
      </Field>

      <Field label="Price" required>
        <Input name="price" type="number" />
      </Field>

      {/* ADD MISSING FIELDS */}
      <Field label="Duration (minutes)" required>
        <Input name="duration_minutes" type="number" min={15} max={480} />
      </Field>

      <Field label="Active">
        <Switch name="is_active" />
      </Field>
    </form>
  )
}
```

**Auto-fix**: Add missing Field + Input/Textarea/Switch with proper props
**Manual**: Adjust validation, styling, conditional fields

**Reference**: `docs/rules/core/ui.md#ui-p002`
**Related**: UI-P002, A11Y-H103

### Rule: ALIGN-H103 {#align-h103}

**Pattern**: Zod schemas match database column types
**Fix**: Update schema validation to match database

```ts
// ❌ WRONG - Type mismatch
// Database: duration_minutes: number (required, 15-480)
const createServiceSchema = z.object({
  duration: z.number().optional() // Wrong: optional, wrong name
})

// ✅ CORRECT - Matching schema
import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  duration_minutes: z.number().min(15).max(480), // Matches DB
  is_active: z.boolean().default(true)
})
```

**Auto-fix**: Update schema fields to match database types and constraints
**Manual**: Add custom business validation rules

**Reference**: `docs/rules/core/database.md#db-m302`
**Related**: DB-M302, TS-M302

### Rule: ALIGN-H104 {#align-h104}

**Pattern**: Database relationships are navigable in UI
**Fix**: Add navigation links for foreign keys

```tsx
// ❌ WRONG - Shows staff_id but no navigation
<P>Staff: {appointment.staff_id}</P>

// ✅ CORRECT - Navigable relationship
import Link from 'next/link'

<P>
  Staff:
  <Link
    href={`/staff/${appointment.staff_id}`}
    className="text-primary hover:underline ml-1"
  >
    {appointment.staff_member?.name || appointment.staff_id}
  </Link>
</P>
```

**Auto-fix**: Replace static text with Link component
**Manual**: Ensure related data is fetched in query

**Reference**: `docs/rules/core/database.md#db-p001`
**Related**: DB-P001

### Rule: ALIGN-M301 {#align-m301}

**Pattern**: Orphaned frontend code is removed
**Fix**: Delete queries/mutations/types/components for non-existent tables

```ts
// ❌ WRONG - Query for removed customer_wallets table
export async function getCustomerWallets() { ... }

// ✅ CORRECT - Remove orphaned code
// Delete entire features/customer/wallet/ directory
// Remove getCustomerWallets from queries.ts
// Remove wallet routes from app/(customer)/customer/wallet/
```

**Auto-fix**: Delete orphaned files and directories
**Manual**: Ensure no other code references deleted items

**Reference**: `docs/rules/core/architecture.md#arch-m301`
**Related**: ARCH-M301

### Rule: ALIGN-M302 {#align-m302}

**Pattern**: List views display key columns
**Fix**: Add missing columns to list/table components

```tsx
// ❌ WRONG - Only shows name, email
<Table>
  <TableRow>
    <TableCell>{customer.name}</TableCell>
    <TableCell>{customer.email}</TableCell>
  </TableRow>
</Table>

// ✅ CORRECT - Shows all key columns
<Table>
  <TableRow>
    <TableCell>{customer.name}</TableCell>
    <TableCell>{customer.email}</TableCell>
    <TableCell>{customer.phone}</TableCell>
    <TableCell>
      <Badge>{customer.status}</Badge>
    </TableCell>
    <TableCell>{formatDate(customer.created_at)}</TableCell>
  </TableRow>
</Table>
```

**Auto-fix**: Add TableCell elements for missing columns
**Manual**: Format values, add conditional styling

**Reference**: `docs/rules/core/ui.md#ui-p004`
**Related**: UI-P004

### Rule: ALIGN-M303 {#align-m303}

**Pattern**: Empty states guide users
**Fix**: Add Empty component when no data

```tsx
// ❌ WRONG - No empty state
{appointments.length > 0 && <AppointmentsList data={appointments} />}

// ✅ CORRECT - Helpful empty state
import { Empty } from '@/components/ui/empty'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

{appointments.length === 0 ? (
  <Empty
    icon={<CalendarIcon className="h-12 w-12" />}
    title="No appointments yet"
    description="Create your first appointment to get started"
    action={<Button>Create Appointment</Button>}
  />
) : (
  <AppointmentsList data={appointments} />
)}
```

**Auto-fix**: Wrap list with empty state check
**Manual**: Customize icon, title, description, action

**Reference**: `docs/rules/core/ui.md#ui-p002`
**Related**: UI-P002, A11Y-H101

### Rule: ALIGN-M304 {#align-m304}

**Pattern**: CRUD operations have corresponding UI affordances
**Fix**: Add buttons/actions for existing mutations

```tsx
// ❌ WRONG - deleteAppointment exists but no delete button

// ✅ CORRECT - Add delete button
import { Button } from '@/components/ui/button'
import { deleteAppointment } from '../api/mutations'

<div className="flex gap-2">
  <Button onClick={handleEdit}>Edit</Button>
  <Button
    onClick={() => deleteAppointment(appointment.id)}
    variant="destructive"
  >
    Delete
  </Button>
</div>
```

**Auto-fix**: Add button with onClick handler
**Manual**: Add confirmation dialog, loading states, error handling

**Reference**: `docs/rules/core/ui.md#ui-h103`
**Related**: UI-H103, A11Y-H101

## Status Updates

After each fix:

**Fixed:**
```json
{
  "status": "fixed",
  "fixed_at": "ISO-8601",
  "fixed_code": "actual fixed code",
  "fix_notes": "Applied [rule pattern]: [description]"
}
```

**Scaffolded (needs completion):**
```json
{
  "status": "needs_manual",
  "fix_notes": "Scaffold generated - manual completion required: [what remains]",
  "scaffolded_files": ["list of generated files"]
}
```

**Deleted (orphaned code):**
```json
{
  "status": "fixed",
  "fix_notes": "Removed orphaned code: [list of deleted files/functions]",
  "deleted_items": ["list"]
}
```

**Failed:**
```json
{
  "status": "failed",
  "fix_notes": null,
  "error": "[error description]"
}
```

## Display Progress

### After Each Fix
```
✅ FIXED ALIGN-P### [entity]:[gap_type]
│
├─ Entity: [table/feature name]
├─ Gap: [missing_query/missing_ui/type_mismatch/etc]
├─ Applied: [fix description]
├─ Files: [list of modified files]
├─ Rule: docs/rules/core/[domain].md#align-p###
└─ Time: [timestamp]

📊 Batch Progress: [current]/[batch_size]
⏭️  Next: ALIGN-P###
```

### After Batch Complete
```
🎯 BATCH COMPLETE

📊 This Batch
├─ Fixed: [count]/[batch_size] issues
├─ Scaffolded: [count] (need manual completion)
├─ Deleted: [count] orphaned files
├─ Time: ~[minutes] minutes

📈 Overall Progress
├─ Total Issues: [total]
├─ Fixed: [fixed_count] ([fixed_percent]%)
├─ Remaining: [pending_count] ([pending_percent]%)
│
├─ By Status:
│   ├─ ✅ Fixed: [count]
│   ├─ ⏳ Pending: [count]
│   ├─ 🏗️  Scaffolded: [count] (needs completion)
│   ├─ ⏭️  Skipped: [count]
│   └─ ❌ Failed: [count]
│
├─ By Gap Type:
│   ├─ Missing Queries: [fixed]/[total]
│   ├─ Missing Mutations: [fixed]/[total]
│   ├─ Missing UI: [fixed]/[total]
│   ├─ Type Mismatches: [fixed]/[total]
│   ├─ Orphaned Code: [fixed]/[total]
│   ├─ Incomplete CRUD: [fixed]/[total]
│   └─ Missing UX: [fixed]/[total]
│
└─ By Priority:
    ├─ Critical (ALIGN-P): [fixed]/[total] ([percent]%)
    ├─ High (ALIGN-H): [fixed]/[total] ([percent]%)
    ├─ Medium (ALIGN-M): [fixed]/[total] ([percent]%)
    └─ Low (ALIGN-L): [fixed]/[total] ([percent]%)

💾 Report Updated: docs/analyze-fixes/db-frontend-alignment/analysis-report.json

🔄 NEXT STEPS
Run /db-frontend/fix again to fix next batch (10-20 issues)
```

### When All Complete
```
🎉 ALL DATABASE-FRONTEND ALIGNMENT ISSUES FIXED!

📊 Final Statistics
Total Issues: [count]
├─ ✅ Fixed: [count] ([percent]%)
├─ 🏗️  Scaffolded: [count] ([percent]%) - Need manual completion
├─ ⏭️  Skipped: [count] ([percent]%)
└─ ❌ Failed: [count] ([percent]%)

🏗️  Scaffolded Code (Needs Completion):
[List scaffolded features with TODO items]

Example:
- features/staff/schedules/ - Complete query logic, add filters
- features/business/services/components/ServiceForm.tsx - Add custom validation
- features/customer/preferences/ - Implement settings UI

⚠️  Manual Review Required:
[List issues needing manual implementation]

💾 Reports Updated:
├─ docs/analyze-fixes/db-frontend-alignment/analysis-report.json
└─ docs/analyze-fixes/db-frontend-alignment/analysis-report.md

📚 Related Documentation:
├─ Database Rules: docs/rules/core/database.md
├─ TypeScript Rules: docs/rules/framework/typescript.md
├─ Architecture Rules: docs/rules/core/architecture.md
├─ UI Rules: docs/rules/core/ui.md
└─ Task Guide: docs/rules/02-task-based-guide.md

✅ No more pending issues. All automatic fixes complete!
🏗️  [count] scaffolds generated - manual completion needed.
```

## Fix Strategy by Gap Type

### missing_query
1. Generate queries.ts if doesn't exist
2. Add query function with proper types
3. Add auth check and error handling
4. Mark as "scaffolded" - needs business logic completion

### missing_mutation
1. Generate mutations.ts if doesn't exist
2. Add mutation function with Zod validation
3. Add auth check and revalidatePath
4. Mark as "scaffolded" - needs business logic completion

### missing_ui
1. Generate component directory if doesn't exist
2. Create List/Detail/Form components with shadcn/ui
3. Use shadcn component slots (CardTitle, Badge, etc.) and empty states
4. Mark as "scaffolded" - needs full implementation

### type_mismatch
1. Replace manual types with Database imports
2. Update Zod schemas to match
3. Fix nullable/required mismatches
4. Mark as "fixed" - fully automatable

### orphaned_code
1. Identify all files/functions referencing removed tables
2. Delete files safely (check for imports first)
3. Remove functions from existing files
4. Mark as "fixed" - fully automatable

### incomplete_crud
1. Identify missing operations (C/R/U/D)
2. Generate missing mutations
3. Add corresponding UI buttons/actions
4. Mark as "scaffolded" - needs completion

### missing_ux
1. Add empty states to list components
2. Add loading states
3. Add error states
4. Add filters/pagination if applicable
5. Mark as "scaffolded" - needs customization

## User Commands

- **"pause"** - Stop after current fix, save progress
- **"skip"** - Skip current issue, mark as skipped
- **"status"** - Show current batch and overall progress
- **"scaffold only"** - Only generate scaffolds, don't auto-fix

## Batch Size

- **Default**: 10-20 issues per run
- **Min**: 10 issues
- **Max**: 30 issues
- **Adjust**: Fewer for complex scaffolding tasks

## Begin Fixing

1. Load `docs/analyze-fixes/db-frontend-alignment/analysis-report.json`
2. Filter `status === "pending"`
3. Sort by `priority_order` (ascending: ALIGN-P001 → ALIGN-L999)
4. Take first 10-20 issues
5. Fix each using patterns from docs/rules/
6. Update status after each
7. Save report after batch

**Start now.** Fix next batch of pending issues in priority order.
