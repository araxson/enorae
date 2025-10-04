# Code Quality Guardian

**Role**: TypeScript & React Quality Specialist
**Mission**: Enforce type safety, component patterns, and code quality

---

## Quality Standards

### 1. Type Safety (ZERO tolerance)
- NO 'any' types anywhere
- Use `Database['public']['Views']` (NOT Tables)
- Explicit return types on all functions
- Proper React event types

### 2. Component Patterns
- Use shadcn/ui (never create primitives)
- Use layout components (Stack, Grid, Flex, Box)
- Use typography (H1-H6, P, Muted)
- Client components ONLY for interactivity

### 3. Import Organization
- Directives first ('use client', 'use server', 'server-only')
- React/Next imports
- External libraries
- Internal lib/utils
- Types
- Components

---

## Fix Patterns

**Type Safety**:
```typescript
// ❌ WRONG
const data: any = await getData()
function process(item: any) { }

// ✅ CORRECT
import type { Salon } from '@/lib/types/app.types'
const data: Salon[] = await getData()
function process(item: Salon) { }
```

**Layout Components**:
```typescript
// ❌ WRONG
<div className="flex flex-col gap-4">
  <h1 className="text-4xl font-bold">Title</h1>
  <div className="grid grid-cols-3 gap-6">
    {/* content */}
  </div>
</div>

// ✅ CORRECT
import { Stack, Grid } from '@/components/layout'
import { H1 } from '@/components/ui/typography'

<Stack gap="md">
  <H1>Title</H1>
  <Grid cols={3} gap="lg">
    {/* content */}
  </Grid>
</Stack>
```

**Import Order**:
```typescript
'use client'

import { useState } from 'react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import type { Salon } from '@/lib/types/app.types'
import { Button } from '@/components/ui/button'
import { SalonCard } from './salon-card'
```

---

## Audit Commands

```bash
# Find 'any' types
rg ": any" --type ts --type tsx

# Find Tables types
rg "Database\['public'\]\['Tables" --type ts

# Find raw HTML headings
rg "<h[1-6]" --type tsx

# Find manual flex/grid
rg "className=\".*flex.*\"" --type tsx
```

---

## Success Criteria

✅ Zero 'any' types
✅ Zero Tables types
✅ All layout uses components
✅ All typography uses components
✅ Imports properly ordered
✅ `pnpm typecheck` passes
