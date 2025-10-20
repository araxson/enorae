# TypeScript Patterns - ENORAE

**Essential TypeScript 5.9 strict-mode rules for type-safe development.**

---

## Quick Reference

| What you need | Where to look |
|---------------|---------------|
| **Strict mode config** | [Critical Rules](#critical-rules) |
| **Supabase types** | [Supabase Integration](#supabase-integration) |
| **Generics** | [Generic Patterns](#generic-patterns) |
| **Utility types** | [Utility Types](#utility-types) |
| **Detection commands** | [Detection Commands](#detection-commands) |

---

## Stack

- **Version:** 5.9.3 (ES2022 target)
- **Mode:** `strict` + `noEmit`
- **Features:** const type params, `using`, `satisfies`

---

## 🚨 Critical Rules - MUST FOLLOW

### 1. NO `any` Types (Ever)

```ts
// ❌ FORBIDDEN
function process(data: any) { }  // ❌ NO
const result: any = getValue()   // ❌ NO

// ✅ CORRECT - Use proper types
function process(data: unknown) { }
const result: AppointmentRow = getValue()
```

### 2. NO Type Suppressions

```ts
// ❌ FORBIDDEN
// @ts-ignore
const value = dangerousCall()  // ❌ NO

// @ts-expect-error
const other = riskyOp()  // ❌ NO

// ✅ CORRECT - Fix the type error
const value: Expected = dangerousCall() as Expected
```

### 3. Use Generated Supabase Types

```ts
// ❌ FORBIDDEN - Hand-written types
interface Appointment {
  id: string
  customerId: string
  // ...
}

// ✅ CORRECT - Generated types
import type { Database } from '@/lib/types/database.types'
type Appointment = Database['public']['Views']['appointments_view']['Row']
```

### 4. Infer from Zod Schemas

```ts
// ❌ FORBIDDEN - Duplicate definition
const schema = z.object({ name: z.string() })
interface FormData { name: string }  // ❌ Duplicate

// ✅ CORRECT - Infer from schema
const schema = z.object({ name: z.string() })
type FormData = z.infer<typeof schema>  // ✅ Single source
```

### 5. Strict tsconfig Required

```json
{
  "compilerOptions": {
    "strict": true,                            // ✅ REQUIRED
    "noUncheckedIndexedAccess": true,         // ✅ REQUIRED
    "noPropertyAccessFromIndexSignature": true, // ✅ REQUIRED
    "useUnknownInCatchVariables": true,       // ✅ REQUIRED
    "noImplicitOverride": true,               // ✅ REQUIRED
    "noEmit": true                            // ✅ REQUIRED
  }
}
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",

    // Strict mode (REQUIRED)
    "strict": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,

    "noEmit": true,
    "types": ["@types/node", "@types/react"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Verify:** `npm run typecheck` must pass locally before commit.

---

## Supabase Integration

### Type Imports

```ts
import type { Database } from '@/lib/types/database.types'

// Views (for reads)
export type AppointmentRow = Database['public']['Views']['appointments_view']['Row']

// Tables (for writes)
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
```

### Typed Queries

```ts
export async function getAppointments(businessId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', businessId)
    .returns<AppointmentRow[]>()  // ✅ Explicit type

  if (error) throw error
  return data
}
```

### Zod + TypeScript

```ts
import { z } from 'zod'

export const createAppointmentSchema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
})

// ✅ Infer type from schema (single source of truth)
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
```

---

## Modern TypeScript Features

### `const` Type Parameters (Preserve Literals)

```ts
// ✅ Preserves literal types
declare function tuple<const T extends readonly unknown[]>(...items: T): T

const result = tuple('open', 42, { status: 'ok' })
// Type: readonly ['open', 42, { status: 'ok' }]

// Also works with objects
const config = { mode: 'compact' } as const
```

### `satisfies` Operator

```ts
// ✅ Type-check without widening
const metadata = {
  title: 'Appointments',
  description: 'Manage schedule',
} satisfies { title: string; description: string }

// metadata.title is still 'Appointments' (literal), not string
```

### `using` Declarations (Resource Management)

```ts
class Timer {
  constructor(private label: string) { console.time(label) }
  [Symbol.dispose]() { console.timeEnd(this.label) }
}

export async function timed<T>(task: () => Promise<T>) {
  using timer = new Timer('dashboard-load')  // ✅ Auto-disposed
  return task()
}
```

---

## Generic Patterns

### Generic Functions

```ts
function identity<const T>(value: T): T {
  return value
}

const literal = identity({ mode: 'compact' })  // Type preserved
```

### Constrained Generics

```ts
interface Identifiable { id: string }

function findById<const T extends Identifiable>(
  list: T[],
  id: string
): T | undefined {
  return list.find((item) => item.id === id)
}
```

### Generic React Components

```tsx
interface ListProps<T> {
  items: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T) => React.ReactNode
}

export function List<T>({ items, keyExtractor, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

---

## Type Patterns

### Discriminated Unions

```ts
type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: string }

function handleState(state: LoadState) {
  switch (state.status) {
    case 'success':
      return state.data  // ✅ TypeScript knows data exists
    case 'error':
      return state.error  // ✅ TypeScript knows error exists
  }
}
```

### Literal Unions (Prefer Over Enums)

```ts
// ✅ PREFERRED - Better tree shaking
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

// ❌ AVOID - Enums add runtime code
enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}
```

### Template Literal Types

```ts
type UserPath = `users/${string}`
type EventName<T extends string> = `on${Capitalize<T>}`
type CacheTag = `appointments:${string}` | 'appointments'

// Usage
const tag: CacheTag = 'appointments:123'  // ✅ Valid
const tag2: CacheTag = 'users:123'        // ❌ Type error
```

---

## Utility Types

### Built-in Utilities

```ts
// Type manipulation
type ServiceDraft = Partial<Service>
type RequiredService = Required<ServiceDraft>
type ReadonlyService = Readonly<Service>

// Key/property extraction
type ServiceId = Pick<Service, 'id'>
type ServiceWithoutId = Omit<Service, 'id'>

// Type inference
type FnReturn = ReturnType<typeof getAppointments>
type Resolved = Awaited<Promise<AppointmentRow[]>>
```

### Custom Utilities

```ts
type Nullable<T> = { [K in keyof T]: T[K] | null }

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
```

---

## Detection Commands

Run these before committing:

```bash
# 1. Any types (FORBIDDEN)
rg "\bany\b" --type ts --type tsx | grep -v "node_modules"

# 2. Type suppressions (FORBIDDEN)
rg "@ts-ignore|@ts-expect-error" --type ts --type tsx

# 3. Non-null assertions (avoid)
rg "!!|!\." --type ts --type tsx

# 4. Missing type-only imports
rg "import { .* } from '.*types'" --type ts --type tsx | grep -v "import type"

# 5. Typecheck passes
npm run typecheck
```

**Zero violations required before commit.**

---

## Pre-Commit Checklist

**Strict Mode:**
- [ ] `tsconfig.json` has `strict: true`
- [ ] All strict flags enabled (`noUncheckedIndexedAccess`, etc.)
- [ ] `npm run typecheck` passes with zero errors

**Type Safety:**
- [ ] No `any` types (explicit or implicit)
- [ ] No `@ts-ignore` or `@ts-expect-error`
- [ ] No non-null assertions (`!.` or `!!`) without justification

**Supabase Types:**
- [ ] All database types use `Database[...]` from generated types
- [ ] No hand-written database interfaces
- [ ] Queries use `.returns<Type[]>()` for explicit typing

**Zod Integration:**
- [ ] Schemas defined in `schema.ts`
- [ ] Types inferred via `z.infer<typeof schema>`
- [ ] No duplicate type definitions

**Modern Features:**
- [ ] Use `const` type parameters for literal preservation
- [ ] Use `satisfies` for type-checking without widening
- [ ] Template literal types for string unions

**Quality:**
- [ ] All detection commands pass (zero matches)
- [ ] Types are concise and maintainable
- [ ] Generic constraints are specific

---

## Common Patterns

**Union of strings:**
```ts
type Status = 'idle' | 'loading' | 'success' | 'error'
```

**Nullable properties:**
```ts
type ServiceDraft = {
  id?: string
  name: string
  price: number | null
}
```

**Conditional types:**
```ts
type Flatten<T> = T extends (infer U)[] ? U : T
type Result = Flatten<string[]>  // string
```

**Extract from object:**
```ts
const config = { api: '/api', timeout: 5000 } as const
type Config = typeof config
type ApiPath = Config['api']  // '/api'
```

---

**Last Updated:** 2025-10-20
**TypeScript Version:** 5.9.3
**Strict Mode:** Required
