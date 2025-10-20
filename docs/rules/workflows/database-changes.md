# Workflow: Database Schema Changes

Step-by-step guide for making database schema changes safely.

---

## Overview

This workflow covers:
- Creating migrations
- Adding/modifying tables
- Creating RLS policies
- Adding indexes
- Regenerating TypeScript types

**⚠️ IMPORTANT**: Always test in local/staging before production

---

## Prerequisites

- ✅ Supabase CLI installed (`npx supabase --version`)
- ✅ Local Supabase running (`npx supabase start`)
- ✅ You've read:
  - [`domains/database.md`](../domains/database.md)
  - [`domains/security.md`](../domains/security.md)
  - [`domains/performance.md`](../domains/performance.md)

---

## Step 1: Create Migration File

### 1.1 Generate Migration

```bash
npx supabase migration new {description}
```

**Example:**
```bash
npx supabase migration new add_loyalty_programs
```

This creates: `supabase/migrations/{timestamp}_{description}.sql`

---

## Step 2: Write Migration SQL

### 2.1 Create Table

```sql
-- Create table in appropriate schema
create table engagement.loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references identity.users(id) on delete cascade,
  points_balance integer not null default 0,
  points_redeemed integer not null default 0,
  tier text not null default 'bronze',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add indexes (REQUIRED for foreign keys)
create index loyalty_programs_customer_id_idx on engagement.loyalty_programs(customer_id);

-- Add updated_at trigger
create trigger loyalty_programs_updated_at
  before update on engagement.loyalty_programs
  for each row execute function patterns.trigger_set_updated_at();
```

**Rules**: [PERF-H101](../03-QUICK-SEARCH.md#perf-h101) - Index all foreign keys

### 2.2 Create Public View

```sql
-- Create public view for reads (encapsulates tenant filtering)
create or replace view public.loyalty_programs as
  select
    lp.id,
    lp.customer_id,
    lp.points_balance,
    lp.points_redeemed,
    lp.tier,
    lp.created_at,
    lp.updated_at
  from engagement.loyalty_programs lp
  where lp.customer_id = (select auth.uid());  -- ← Tenant filter
```

**Rules**: [DB-P001](../03-QUICK-SEARCH.md#db-p001) - Reads use public views

### 2.3 Create RLS Policies

```sql
-- Enable RLS
alter table engagement.loyalty_programs enable row level security;

-- Policy for SELECT (customers see own programs)
create policy "Customers view own loyalty program"
  on engagement.loyalty_programs
  for select
  using ((select auth.uid()) = customer_id);  -- ← Wrap auth.uid()

-- Policy for INSERT (customers create own programs)
create policy "Customers create own loyalty program"
  on engagement.loyalty_programs
  for insert
  with check ((select auth.uid()) = customer_id);

-- Policy for UPDATE (customers update own programs)
create policy "Customers update own loyalty program"
  on engagement.loyalty_programs
  for update
  using ((select auth.uid()) = customer_id)
  with check ((select auth.uid()) = customer_id);

-- Restrictive policy for sensitive operations (optional)
create policy "MFA required for point redemption"
  on engagement.loyalty_programs
  as restrictive
  to authenticated
  using (
    (select auth.jwt()->>'aal') = 'aal2'
    or points_redeemed = 0  -- Allow first-time users
  );
```

**Critical rules**:
- [DB-P003](../03-QUICK-SEARCH.md#db-p003) - Multi-tenant RLS enforces tenant scope
- [SEC-P003](../03-QUICK-SEARCH.md#sec-p003) - Wrap auth.uid() in SELECT
- [DB-H101](../03-QUICK-SEARCH.md#db-h101) - Use auth.jwt() for metadata
- [DB-H102](../03-QUICK-SEARCH.md#db-h102) - MFA for sensitive tables

---

## Step 3: Test Migration Locally

### 3.1 Apply Migration

```bash
npx supabase db reset  # Resets local DB and applies all migrations
```

### 3.2 Verify Tables Created

```bash
npx supabase db diff  # Should show no differences
```

### 3.3 Test RLS Policies

```sql
-- In Supabase Studio SQL editor:

-- Set user context
set request.jwt.claim.sub = '{user_id}';

-- Test SELECT (should only see own records)
select * from engagement.loyalty_programs;

-- Test INSERT
insert into engagement.loyalty_programs (customer_id, points_balance)
values ('{user_id}', 100);

-- Test cross-tenant access (should fail)
insert into engagement.loyalty_programs (customer_id, points_balance)
values ('{different_user_id}', 100);
```

---

## Step 4: Add Indexes for Performance

### 4.1 Foreign Key Indexes (REQUIRED)

```sql
-- Index every foreign key
create index loyalty_programs_customer_id_idx
  on engagement.loyalty_programs(customer_id);
```

### 4.2 Query-Specific Indexes

```sql
-- Index columns used in WHERE clauses
create index loyalty_programs_tier_idx
  on engagement.loyalty_programs(tier);

-- Composite index for common queries
create index loyalty_programs_customer_tier_idx
  on engagement.loyalty_programs(customer_id, tier);
```

### 4.3 Check Supabase Advisor

```sql
-- Run performance advisor
select * from supabase__get_advisors(type := 'performance');
```

Look for:
- `unindexed_foreign_keys` - Add missing indexes
- `duplicate_index` - Remove duplicates
- `unused_index` - Consider removing after verification

**Rules**: [PERF-H101](../03-QUICK-SEARCH.md#perf-h101), [PERF-H102](../03-QUICK-SEARCH.md#perf-h102)

---

## Step 5: Regenerate TypeScript Types

### 5.1 Generate Types

```bash
npm run db:types
```

This updates `lib/types/database.types.ts`

### 5.2 Verify Types

```ts
import type { Database } from '@/lib/types/database.types'

// Should be available:
type LoyaltyProgram = Database['public']['Views']['loyalty_programs']['Row']
type LoyaltyProgramInsert = Database['engagement']['Tables']['loyalty_programs']['Insert']
type LoyaltyProgramUpdate = Database['engagement']['Tables']['loyalty_programs']['Update']
```

**Rules**: [TS-M302](../03-QUICK-SEARCH.md#ts-m302)

---

## Step 6: Update Application Code

### 6.1 Create Queries

```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type LoyaltyProgram = Database['public']['Views']['loyalty_programs']['Row']

export async function getLoyaltyProgram() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Query public view (not schema table)
  const { data, error } = await supabase
    .from('loyalty_programs')  // ← View name
    .select('*')
    .maybeSingle<LoyaltyProgram>()

  if (error) throw error
  return data
}
```

### 6.2 Create Mutations

```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateLoyaltyPoints(points: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Mutate schema table
  const { data, error } = await supabase
    .schema('engagement')  // ← Schema name
    .from('loyalty_programs')
    .update({ points_balance: points })
    .eq('customer_id', user.id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/customer/loyalty')
  return data
}
```

---

## Step 7: Test Application

### 7.1 Type Check

```bash
npm run typecheck
```

Must pass without errors.

### 7.2 Runtime Testing

- [ ] Create records (INSERT works)
- [ ] Read records (SELECT from view works)
- [ ] Update records (UPDATE works)
- [ ] Delete records (DELETE works)
- [ ] RLS prevents cross-tenant access
- [ ] Auth checks prevent unauthorized access

---

## Step 8: Deploy to Staging

### 8.1 Push Migration

```bash
npx supabase db push  # Pushes to linked project
```

### 8.2 Verify in Staging

- [ ] Migration applied successfully
- [ ] Tables created
- [ ] Views created
- [ ] RLS policies active
- [ ] Indexes created
- [ ] Application works as expected

---

## Step 9: Deploy to Production

### 9.1 Review Checklist

- [ ] Migration tested in local
- [ ] Migration tested in staging
- [ ] RLS policies verified
- [ ] Foreign keys indexed
- [ ] Types regenerated
- [ ] Application code updated
- [ ] Type check passes
- [ ] No breaking changes

### 9.2 Deploy

```bash
# Production deployment (via Supabase dashboard or CI/CD)
npx supabase db push --linked-project production
```

### 9.3 Monitor

- [ ] Check for errors in Supabase logs
- [ ] Monitor query performance
- [ ] Verify RLS is enforcing correctly
- [ ] Check application functionality

---

## Common Migration Patterns

### Adding a Column

```sql
-- Add column with default (safe - no locking)
alter table engagement.loyalty_programs
  add column lifetime_points integer not null default 0;

-- Backfill data if needed
update engagement.loyalty_programs
  set lifetime_points = points_balance + points_redeemed;
```

### Renaming a Column

```sql
-- Rename column
alter table engagement.loyalty_programs
  rename column tier to membership_tier;

-- Update view
create or replace view public.loyalty_programs as
  select
    lp.id,
    lp.membership_tier  -- ← Updated column name
    -- ... other columns
  from engagement.loyalty_programs lp;
```

### Adding an Enum Type

```sql
-- Create enum type
create type engagement.loyalty_tier as enum ('bronze', 'silver', 'gold', 'platinum');

-- Use in table
alter table engagement.loyalty_programs
  alter column tier type engagement.loyalty_tier using tier::engagement.loyalty_tier;
```

### Creating a Junction Table

```sql
-- Many-to-many relationship
create table engagement.customer_rewards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references identity.users(id) on delete cascade,
  reward_id uuid not null references engagement.rewards(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(customer_id, reward_id)
);

-- Indexes (REQUIRED for foreign keys)
create index customer_rewards_customer_id_idx on engagement.customer_rewards(customer_id);
create index customer_rewards_reward_id_idx on engagement.customer_rewards(reward_id);

-- RLS
alter table engagement.customer_rewards enable row level security;

create policy "Customers view own rewards"
  on engagement.customer_rewards
  for select
  using ((select auth.uid()) = customer_id);
```

---

## Rollback Procedure

If migration fails in production:

### Option 1: Create Rollback Migration

```bash
npx supabase migration new rollback_{description}
```

```sql
-- Reverse the changes
drop table if exists engagement.loyalty_programs cascade;
drop view if exists public.loyalty_programs;
```

### Option 2: Restore from Backup

Via Supabase dashboard:
1. Database → Backups
2. Select backup before migration
3. Restore

---

## Troubleshooting

### Issue: RLS denying legitimate access
**Check**: Verify auth.uid() matches expected user
**Fix**: Test policies with specific user IDs

### Issue: Foreign key constraint violation
**Check**: Referenced record exists
**Fix**: Insert parent record first, or use ON DELETE CASCADE

### Issue: Type generation fails
**Check**: Supabase CLI version is current
**Fix**: Update CLI: `npm install -g supabase`

### Issue: Migration conflicts
**Check**: Multiple developers creating migrations
**Fix**: Coordinate migration creation, rebase if needed

---

**📖 Related Documentation:**
- [Database Rules](../domains/database.md)
- [Security Rules](../domains/security.md)
- [Performance Rules](../domains/performance.md)
- [Task-Based Guide](../04-TASK-GUIDE.md#modify-database-schema)

**Last Updated:** 2025-10-18
