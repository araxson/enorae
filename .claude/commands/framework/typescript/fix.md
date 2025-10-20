# TypeScript Fix - Reusable Session

Auto-fix TypeScript issues in batches. Run multiple times to complete all fixes.

## Input File

Read: `docs/analyze-fixes/typescript/analysis-report.json`

## Fix Patterns by Rule

### Rule: TS-P001 {#ts-p001}

**Fix**: Import correct types, remove 'any'

```ts
// ❌ WRONG
const data: any = await supabase.from('appointments').select('*')

// ✅ CORRECT
import type { Database } from '@/lib/types/database.types'
type Appointment = Database['public']['Views']['appointments']['Row']
const data: Appointment[] = await supabase.from('appointments').select('*')
```

### Rule: TS-P002 {#ts-p002}

**Fix**: Rename reserved word identifiers

```ts
// ❌ WRONG
export const let = 1
export const eval = () => {}

// ✅ CORRECT
export const level = 1
export const evaluate = () => {}
```

### Rule: TS-H101 {#ts-h101}

**Fix**: Assign before destructuring in using

```ts
// ❌ WRONG
for (using { client } of pool) {}

// ✅ CORRECT
for (using item of pool) {
  const { client } = item
}
```

### Rule: TS-H102 {#ts-h102}

**Fix**: Remove 'use strict' or rewrite parameters

```ts
// ❌ WRONG
'use strict'
function handler({ foo }: Request) {}

// ✅ CORRECT
function handler(request: Request & { foo: string }) {}
```

### Rule: TS-M301 {#ts-m301}

**Fix**: Remove leading zeros

```ts
// ❌ WRONG
const status = 009

// ✅ CORRECT
const status = 9
// Or for octal
const status = 0o11
```

### Rule: TS-M302 {#ts-m302}

**Fix**: Use generated Database types

```ts
import type { Database } from '@/lib/types/database.types'

// For views (reads)
type Appointment = Database['public']['Views']['appointments']['Row']

// For tables (writes)
type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
```

### Rule: TS-L701 {#ts-l701}

**Fix**: Use unknown + Zod instead of any

```ts
// ❌ WRONG
const data = response as any

// ✅ CORRECT
const data: unknown = response
const payload = schema.parse(data)
type Payload = typeof payload
```

## Process

1. Load report
2. Fix 10-20 pending issues in TS-P### → TS-L### order
3. Update status
4. Save report

**Start now.** Fix next batch of TypeScript issues.
