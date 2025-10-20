# Workflow: Creating a New Feature

Step-by-step guide for creating a new feature in ENORAE.

---

## Overview

This workflow covers creating a complete feature from scratch, including:
- Setting up the feature directory structure
- Creating database queries and mutations
- Building UI components
- Adding a page route
- Testing and validation

**Time estimate**: 1-3 hours (depending on complexity)

---

## Prerequisites

Before starting:
- ✅ You know which portal the feature belongs to (customer/business/staff/admin)
- ✅ You have the feature requirements/specifications
- ✅ You understand the data model (which tables/views you'll use)
- ✅ You've read the relevant rules:
  - [`domains/architecture.md`](../domains/architecture.md)
  - [`domains/database.md`](../domains/database.md)
  - [`domains/ui.md`](../domains/ui.md)

---

## Step 1: Create Feature Directory

### 1.1 Create Directory Structure

```bash
mkdir -p features/{portal}/{feature-name}/{api,components}
touch features/{portal}/{feature-name}/index.tsx
touch features/{portal}/{feature-name}/types.ts
touch features/{portal}/{feature-name}/schema.ts
touch features/{portal}/{feature-name}/api/queries.ts
touch features/{portal}/{feature-name}/api/mutations.ts
```

**Example:**
```bash
mkdir -p features/customer/loyalty-program/{api,components}
touch features/customer/loyalty-program/index.tsx
touch features/customer/loyalty-program/types.ts
touch features/customer/loyalty-program/schema.ts
touch features/customer/loyalty-program/api/queries.ts
touch features/customer/loyalty-program/api/mutations.ts
```

**Rules**: [ARCH-H101](../03-QUICK-SEARCH.md#arch-h101)

---

## Step 2: Define Types

### 2.1 Create TypeScript Types

Edit `types.ts`:

```ts
import type { Database } from '@/lib/types/database.types'

// Types from database views (for reads)
export type LoyaltyProgram = Database['public']['Views']['loyalty_programs']['Row']
export type LoyaltyReward = Database['public']['Views']['loyalty_rewards']['Row']

// Types from schema tables (for writes)
export type LoyaltyProgramInsert = Database['engagement']['Tables']['loyalty_programs']['Insert']
export type LoyaltyProgramUpdate = Database['engagement']['Tables']['loyalty_programs']['Update']

// Feature-specific types
export interface LoyaltyStats {
  totalPoints: number
  redeemedPoints: number
  availableRewards: number
}
```

**Rules**: [TS-P001](../03-QUICK-SEARCH.md#ts-p001), [TS-M302](../03-QUICK-SEARCH.md#ts-m302)

---

## Step 3: Create Validation Schema

### 3.1 Define Zod Schemas

Edit `schema.ts`:

```ts
import { z } from 'zod'

export const redeemRewardSchema = z.object({
  reward_id: z.string().uuid(),
  points_cost: z.number().min(1)
})

export const updateProgramSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  active: z.boolean()
})

export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>
```

**Rules**: [DB-M302](../03-QUICK-SEARCH.md#db-m302), [SEC-M302](../03-QUICK-SEARCH.md#sec-m302)

---

## Step 4: Create Database Queries

### 4.1 Create queries.ts

Edit `api/queries.ts`:

```ts
import 'server-only' // ← CRITICAL: Must be first line

import { createClient } from '@/lib/supabase/server'
import type { LoyaltyProgram, LoyaltyReward, LoyaltyStats } from '../types'

export async function getLoyaltyProgram(): Promise<LoyaltyProgram | null> {
  const supabase = await createClient()

  // Auth check - REQUIRED
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Query public view
  const { data, error } = await supabase
    .from('loyalty_programs')  // ← Public view
    .select('*')
    .eq('customer_id', user.id)
    .maybeSingle<LoyaltyProgram>()

  if (error) throw error
  return data
}

export async function getLoyaltyStats(): Promise<LoyaltyStats> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Batch independent queries
  const [program, rewards] = await Promise.all([
    getLoyaltyProgram(),
    getAvailableRewards()
  ])

  return {
    totalPoints: program?.points_balance || 0,
    redeemedPoints: program?.points_redeemed || 0,
    availableRewards: rewards.length
  }
}

export async function getAvailableRewards(): Promise<LoyaltyReward[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('loyalty_rewards')
    .select('*')
    .eq('active', true)
    .returns<LoyaltyReward[]>()

  if (error) throw error
  return data || []
}
```

**Critical rules**:
- [ARCH-P001](../03-QUICK-SEARCH.md#arch-p001) - `import 'server-only'` MUST be first line
- [DB-P001](../03-QUICK-SEARCH.md#db-p001) - Query public views
- [DB-P002](../03-QUICK-SEARCH.md#db-p002) - Auth check in every function
- [SEC-P001](../03-QUICK-SEARCH.md#sec-p001) - Use getUser(), not getSession()
- [TS-P001](../03-QUICK-SEARCH.md#ts-p001) - No 'any' types

---

## Step 5: Create Mutations

### 5.1 Create mutations.ts

Edit `api/mutations.ts`:

```ts
'use server' // ← CRITICAL: Must be first line

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redeemRewardSchema } from '../schema'
import type { RedeemRewardInput } from '../schema'

export async function redeemReward(input: unknown) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Validate with Zod
  const payload = redeemRewardSchema.parse(input)

  // Mutate schema table
  const { data, error } = await supabase
    .schema('engagement')  // ← Schema table for writes
    .from('loyalty_redemptions')
    .insert({
      customer_id: user.id,
      reward_id: payload.reward_id,
      points_cost: payload.points_cost
    })
    .select()
    .single()

  if (error) throw error

  // Invalidate cache
  revalidatePath('/customer/loyalty')

  return data
}
```

**Critical rules**:
- [ARCH-P001](../03-QUICK-SEARCH.md#arch-p001) - `'use server'` MUST be first line
- [DB-P002](../03-QUICK-SEARCH.md#db-p002) - Auth check
- [DB-M302](../03-QUICK-SEARCH.md#db-m302) - Zod validation
- [DB-H103](../03-QUICK-SEARCH.md#db-h103) - revalidatePath after mutation
- [SEC-M302](../03-QUICK-SEARCH.md#sec-m302) - Validate before writes

---

## Step 6: Create UI Components

### 6.1 Create Main Feature Component

Edit `index.tsx`:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getLoyaltyStats, getAvailableRewards } from './api/queries'
import { RewardsList } from './components/rewards-list'
import { StatsCard } from './components/stats-card'

export async function LoyaltyProgram() {
  // Fetch data in Server Component
  const [stats, rewards] = await Promise.all([
    getLoyaltyStats(),
    getAvailableRewards()
  ])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Loyalty Program</h1>
        <p className="text-muted-foreground">Earn points and redeem rewards</p>
      </div>

      <StatsCard stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <RewardsList rewards={rewards} />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Critical rules**:
- [UI-P004](../03-QUICK-SEARCH.md#ui-p004) - No typography imports; use shadcn slots + design tokens
- [UI-P002](../03-QUICK-SEARCH.md#ui-p002) - Complete shadcn compositions
- [REACT-P001](../03-QUICK-SEARCH.md#react-p001) - Server Component fetches data

### 6.2 Create Client Component (if needed)

Create `components/rewards-list.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { redeemReward } from '../api/mutations'
import type { LoyaltyReward } from '../types'

interface Props {
  rewards: LoyaltyReward[]
}

export function RewardsList({ rewards }: Props) {
  const [redeeming, setRedeeming] = useState<string | null>(null)

  const handleRedeem = async (reward: LoyaltyReward) => {
    setRedeeming(reward.id)
    try {
      await redeemReward({
        reward_id: reward.id,
        points_cost: reward.points_required
      })
    } catch (error) {
      console.error('Failed to redeem reward:', error)
    } finally {
      setRedeeming(null)
    }
  }

  if (rewards.length === 0) {
    return <p className="text-muted-foreground">No rewards available</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rewards.map((reward) => (
        <Card key={reward.id}>
          <CardHeader>
            <CardTitle>{reward.name}</CardTitle>
            <CardDescription>{reward.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Badge variant="secondary">{reward.points_required} points</Badge>
            <Button
              onClick={() => handleRedeem(reward)}
              disabled={redeeming === reward.id}
            >
              {redeeming === reward.id ? 'Redeeming...' : 'Redeem'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

**Rules**:
- [REACT-P001](../03-QUICK-SEARCH.md#react-p001) - Client Component receives data as props
- [UI-P004](../03-QUICK-SEARCH.md#ui-p004) - Use shadcn slots (CardTitle, CardDescription, Badge)

---

## Step 7: Create Page Route

### 7.1 Create Page File

Create `app/(customer)/customer/loyalty/page.tsx`:

```tsx
import { LoyaltyProgram } from '@/features/customer/loyalty-program'

export default async function Page() {
  return <LoyaltyProgram />
}
```

**Critical rules**:
- [ARCH-P002](../03-QUICK-SEARCH.md#arch-p002) - Page is 5-15 lines
- [NEXT-M301](../03-QUICK-SEARCH.md#next-m301) - Ultra-thin pages

---

## Step 8: Testing & Validation

### 8.1 Type Check
```bash
npm run typecheck
```

**Must pass** - Fix all type errors before proceeding

### 8.2 Manual Testing Checklist

- [ ] Page loads without errors
- [ ] Data displays correctly
- [ ] Mutations work (create/update/delete)
- [ ] Auth enforcement works (try accessing while logged out)
- [ ] Loading states display
- [ ] Error states display
- [ ] Responsive design works (mobile/desktop)

### 8.3 Rules Compliance Check

- [ ] `import 'server-only'` in queries.ts ([ARCH-P001](../03-QUICK-SEARCH.md#arch-p001))
- [ ] `'use server'` in mutations.ts ([ARCH-P001](../03-QUICK-SEARCH.md#arch-p001))
- [ ] Auth checks in all functions ([DB-P002](../03-QUICK-SEARCH.md#db-p002))
- [ ] Querying public views ([DB-P001](../03-QUICK-SEARCH.md#db-p001))
- [ ] Using Database types ([TS-P001](../03-QUICK-SEARCH.md#ts-p001))
- [ ] Zod validation in mutations ([DB-M302](../03-QUICK-SEARCH.md#db-m302))
- [ ] revalidatePath after mutations ([DB-H103](../03-QUICK-SEARCH.md#db-h103))
- [ ] No typography imports; shadcn slots used ([UI-P004](../03-QUICK-SEARCH.md#ui-p004))
- [ ] Complete shadcn compositions ([UI-P002](../03-QUICK-SEARCH.md#ui-p002))
- [ ] Page is 5-15 lines ([ARCH-P002](../03-QUICK-SEARCH.md#arch-p002))

---

## Common Issues & Solutions

### Issue: "Module not found: Can't resolve 'server-only'"
**Solution**: Install package: `npm install server-only`

### Issue: Type errors on Database types
**Solution**: Regenerate types: `npm run db:types`

### Issue: "Unauthorized" errors
**Solution**: Verify auth check is before Supabase calls

### Issue: Mutations don't update UI
**Solution**: Add `revalidatePath()` after mutation

### Issue: TypeScript complains about 'any'
**Solution**: Import proper types from Database['public']['Views']

---

## Next Steps

After completing the feature:

1. **Add to navigation** (if needed)
2. **Add tests** (if project has testing setup)
3. **Update documentation** (if feature is complex)
4. **Code review** (get teammate review)
5. **Deploy to staging** (test in staging environment)

---

**📖 Related Documentation:**
- [Task-Based Guide](../04-TASK-GUIDE.md#create-a-new-feature)
- [Architecture Rules](../domains/architecture.md)
- [Database Rules](../domains/database.md)
- [UI Rules](../domains/ui.md)

**Last Updated:** 2025-10-18
