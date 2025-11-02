# Mutation Patterns

Quick reference for writing mutations using consolidated patterns.

## Standard Mutation Template

```typescript
'use server'
import 'server-only'

import {
  type MutationOptions,
  getCurrentTimestamp,
  createMutationLogger,
  RevalidationPatterns,
  buildAuditInsert,
  buildAuditUpdate,
} from '@/lib/mutations'
import { validateOrThrow } from '@/lib/validation'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function myMutation(
  id: string,
  data: MyData,
  options: MutationOptions = {},
) {
  // 1. Initialize logger (auto-starts)
  const logger = createMutationLogger('myMutation', { id })

  // 2. Get session and client (with dependency injection support)
  const session = options.session ?? await requireAuth()
  const supabase = options.supabase ?? await createClient()
  const timestamp = getCurrentTimestamp(options.now)

  // 3. Validate input
  const validated = validateOrThrow(mySchema, data)

  // 4. Perform database operation
  const { error } = await supabase
    .from('my_table')
    .insert({
      ...validated,
      ...buildAuditInsert(session.user.id, timestamp),
    })

  // 5. Handle errors with structured logging
  if (error) {
    logger.error('Operation failed', 'database', { error })
    throw error
  }

  // 6. Log success
  logger.success({ recordId: data.id })

  // 7. Revalidate cache
  RevalidationPatterns.afterServiceMutation()

  return { success: true }
}
```

## Common Patterns

### Create Operation

```typescript
export async function createResource(
  data: CreateData,
  options: MutationOptions = {},
) {
  const logger = createMutationLogger('createResource')
  const session = options.session ?? await requireAuth()
  const supabase = options.supabase ?? await createClient()
  const timestamp = getCurrentTimestamp(options.now)

  const validated = validateOrThrow(createSchema, data)

  const { data: record, error } = await supabase
    .from('resources')
    .insert({
      ...validated,
      ...buildAuditInsert(session.user.id, timestamp),
    })
    .select()
    .single()

  if (error) {
    logger.error('Create failed', 'database', { error })
    throw error
  }

  logger.success({ resourceId: record.id })
  RevalidationPatterns.afterResourceMutation()

  return record
}
```

### Update Operation

```typescript
export async function updateResource(
  id: string,
  data: Partial<UpdateData>,
  options: MutationOptions = {},
) {
  const logger = createMutationLogger('updateResource', { id })
  const session = options.session ?? await requireAuth()
  const supabase = options.supabase ?? await createClient()
  const timestamp = getCurrentTimestamp(options.now)

  const validated = validateOrThrow(updateSchema, data)

  const { error } = await supabase
    .from('resources')
    .update({
      ...validated,
      ...buildAuditUpdate(session.user.id, timestamp),
    })
    .eq('id', id)

  if (error) {
    logger.error('Update failed', 'database', { error })
    throw error
  }

  logger.success()
  RevalidationPatterns.afterResourceMutation()

  return { success: true }
}
```

### Delete Operation (Soft Delete)

```typescript
export async function deleteResource(
  id: string,
  options: MutationOptions = {},
) {
  const logger = createMutationLogger('deleteResource', { id })
  const session = options.session ?? await requireAuth()
  const supabase = options.supabase ?? await createClient()
  const timestamp = getCurrentTimestamp(options.now)

  const { error } = await supabase
    .from('resources')
    .update({
      deleted_at: timestamp,
      deleted_by_id: session.user.id,
      updated_at: timestamp,
      updated_by_id: session.user.id,
    })
    .eq('id', id)

  if (error) {
    logger.error('Delete failed', 'database', { error })
    throw error
  }

  logger.success()
  RevalidationPatterns.afterResourceMutation()

  return { success: true }
}
```

## Available Revalidation Patterns

### Portal-Specific

```typescript
// Business Portal
RevalidationPatterns.afterServiceMutation()
RevalidationPatterns.afterStaffMutation()
RevalidationPatterns.afterSettingsMutation()
RevalidationPatterns.afterLocationMutation()
RevalidationPatterns.afterCouponMutation()
RevalidationPatterns.afterChainMutation()
RevalidationPatterns.afterTransactionMutation()

// Staff Portal
RevalidationPatterns.afterScheduleMutation()
RevalidationPatterns.afterTimeOffMutation('staff')
RevalidationPatterns.afterProfileMutation('staff')

// Customer Portal
RevalidationPatterns.afterFavoriteMutation()
RevalidationPatterns.afterProfileMutation('customer')

// Admin Portal
RevalidationPatterns.afterSalonMutation()
RevalidationPatterns.afterUserMutation()

// Shared
RevalidationPatterns.afterAppointmentMutation(portal)
RevalidationPatterns.afterReviewMutation()
RevalidationPatterns.afterMessageMutation()
RevalidationPatterns.afterNotificationMutation()
```

### Custom Revalidation

```typescript
import { revalidatePortalPage, PORTAL_ROUTES } from '@/lib/mutations'

// Single page
revalidatePortalPage(PORTAL_ROUTES.BUSINESS_SERVICES)

// Multiple pages
revalidatePortalPages([
  PORTAL_ROUTES.BUSINESS_SERVICES,
  PORTAL_ROUTES.BUSINESS_DASHBOARD,
])

// Entire portal
revalidatePortal('business')
```

## Validation Patterns

### Basic Validation

```typescript
import { validateOrThrow, extractFirstError } from '@/lib/validation'

// Throws on error
const validated = validateOrThrow(mySchema, data)

// Safe parse
const result = safeParse(mySchema, data, 'Custom error message')
if (!result.success) {
  return { error: result.error }
}
const validated = result.data
```

### Multiple Schema Validation

```typescript
import { validateMultiple } from '@/lib/validation'

const result = validateMultiple({
  service: { schema: serviceSchema, data: serviceData, name: 'Service' },
  pricing: { schema: pricingSchema, data: pricingData, name: 'Pricing' },
  rules: { schema: rulesSchema, data: rulesData, name: 'Rules' },
})

if (!result.success) {
  logger.error('Validation failed', 'validation', { error: result.error })
  throw new Error(result.error)
}

const { service, pricing, rules } = result.data
```

## Error Categories

Use consistent error categories for structured logging:

```typescript
logger.error('Error message', category, context)
```

Available categories:
- `'validation'` - Input validation errors
- `'database'` - Database operation errors
- `'permission'` - Authorization errors
- `'not_found'` - Resource not found errors
- `'network'` - External API errors
- `'payment'` - Payment processing errors
- `'auth'` - Authentication errors
- `'system'` - System/infrastructure errors
- `'unknown'` - Uncategorized errors

## Testability

The `MutationOptions` interface supports dependency injection for testing:

```typescript
// In tests
const mockSupabase = createMockSupabase()
const mockSession = createMockSession()
const mockNow = () => new Date('2024-01-01')

await myMutation(id, data, {
  supabase: mockSupabase,
  session: mockSession,
  now: mockNow,
  skipAccessCheck: true,
})
```

## Migration Checklist

When updating an existing mutation:

- [ ] Replace custom Options type with `MutationOptions`
- [ ] Replace manual logger init with `createMutationLogger()`
- [ ] Replace timestamp logic with `getCurrentTimestamp()`
- [ ] Replace hardcoded `revalidatePath()` with `RevalidationPatterns`
- [ ] Replace manual Zod error extraction with `extractFirstError()`
- [ ] Add structured error logging
- [ ] Use `buildAuditInsert()` / `buildAuditUpdate()` for audit fields
- [ ] Update imports

## Anti-Patterns to Avoid

### ❌ DON'T: Manual logger initialization

```typescript
const logger = createOperationLogger('myMutation', {})
logger.start()
```

### ✅ DO: Use createMutationLogger

```typescript
const logger = createMutationLogger('myMutation', { id })
```

---

### ❌ DON'T: Hardcoded revalidation

```typescript
revalidatePath('/business/services', 'page')
```

### ✅ DO: Use revalidation patterns

```typescript
RevalidationPatterns.afterServiceMutation()
```

---

### ❌ DON'T: Custom timestamp logic

```typescript
const now = options.now?.() ?? new Date()
const timestamp = now.toISOString()
```

### ✅ DO: Use timestamp helper

```typescript
const timestamp = getCurrentTimestamp(options.now)
```

---

### ❌ DON'T: Manual Zod error extraction

```typescript
if (error instanceof z.ZodError) {
  return { error: error.issues[0]?.message ?? 'Validation failed' }
}
```

### ✅ DO: Use validation helpers

```typescript
import { extractFirstError } from '@/lib/validation'

if (error instanceof z.ZodError) {
  return { error: extractFirstError(error) }
}
```

---

### ❌ DON'T: Manual audit fields

```typescript
{
  created_by_id: session.user.id,
  updated_by_id: session.user.id,
  created_at: timestamp,
  updated_at: timestamp,
}
```

### ✅ DO: Use audit helpers

```typescript
import { buildAuditInsert } from '@/lib/mutations'

{
  ...data,
  ...buildAuditInsert(session.user.id, timestamp),
}
```

---

## See Also

- [Code Deduplication Summary](/CODE_DEDUPLICATION_SUMMARY.md)
- [Architecture Rules](/docs/rules/architecture.md)
- [Supabase Patterns](/docs/rules/supabase.md)
