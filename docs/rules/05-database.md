# Database (Supabase)

**Purpose:** Comprehensive Supabase patterns for schema design, RLS policies, migrations, type generation, and query optimization for secure multi-tenant applications.

**Last Updated:** 2025-11-03
**Stack Version:** Supabase JS 2.78.0, @supabase/ssr 0.7.0, PostgreSQL 15+, Supavisor (Connection Pooler)

## Recent Updates

**Latest Review (2025-11-03):**

1. **Connection Pooling Strategies** (New Pattern 13)
   - Added comprehensive Supavisor connection pooling guidance
   - Transaction mode (port 6543) for serverless functions
   - Session mode (port 5432) for persistent applications
   - Direct connections reserved for migrations and admin tasks only
   - Decision tree for choosing the right connection mode

2. **Connection Health Monitoring** (New Pattern 14)
   - Added `pg_stat_activity` monitoring patterns
   - Connection health check RPC functions
   - Idle connection detection and management
   - Long-running query identification

3. **Read Replicas for Scalability** (New Pattern 15)
   - Global deployment strategies with load balancer endpoint
   - Replication lag monitoring and handling
   - Read-after-write consistency patterns
   - Analytics query offloading to replicas

4. **Updated Detection Commands**
   - Connection pool utilization checks
   - Direct connection detection in serverless code
   - Replication lag monitoring verification
   - Read-after-write pattern detection

**Version Updates (Supabase JS 2.47.15 → 2.78.0, SSR 0.6.1 → 0.7.0):**

1. **RLS Performance Optimizations** (Critical)
   - Wrapping `auth.uid()` in `SELECT` now standard practice for caching
   - `TO authenticated/anon` role targeting prevents unnecessary policy evaluation
   - Use `ANY(ARRAY(...))` instead of `IN` for subquery optimization

2. **Realtime Broadcast Migration** (Breaking Change)
   - `postgres_changes` event listener deprecated for real-time updates
   - Use dedicated `broadcast` channels with private configuration
   - Requires RLS policies on `realtime.messages` table for authorization
   - Migration path: Replace `.on('postgres_changes', ...)` with `.channel(...).on('broadcast', ...)`

3. **Query Performance Tools** (New Feature)
   - `.explain({ analyze: true })` now available in supabase-js
   - Requires `pgrst.db_plan_enabled` setting on PostgREST server
   - Provides actual execution times and RLS policy verification

4. **Deprecated Features Removed** (Breaking Changes)
   - `auth.role()` → Use `TO authenticated/anon` in policies instead
   - `auth.email()` → Use `auth.jwt() ->> 'email'` instead
   - Response property `body` → Use `data` instead
   - Authentication methods renamed: `login()` → `signIn()`, `logout()` → `signOut()`, `signup()` → `signUp()`
   - Pagination: `offset()` + `limit()` → Use `range(start, end)` instead

5. **Security Enhancements**
   - `SECURITY DEFINER` functions now recommended for complex RLS policies
   - Explicit filters in queries improve performance even with RLS
   - Session validation: Always use `getUser()` instead of `getSession()` for authorization

---

## Quick Decision Tree

```
Need to query data?
├─ Server Component/Action → Use createServerClient (lib/supabase/server.ts)
├─ Client Component → Use createBrowserClient (lib/supabase/client.ts)
├─ Middleware → Use updateSession pattern
└─ Background job → Use service role client (trusted environments only)

Need to secure table?
├─ Enable RLS → ALTER TABLE ... ENABLE ROW LEVEL SECURITY
├─ Add policy → CREATE POLICY ... USING ((select auth.uid()) = user_id)
├─ Add index → CREATE INDEX ON table (user_id) for performance
└─ Test with pgTAP → Verify policies work correctly

Need to change schema?
├─ Create migration → supabase migration new <descriptive-name>
├─ Write DDL → Schema changes in migration file
├─ Test locally → supabase db reset (rebuilds from migrations)
├─ Generate types → supabase gen types typescript
└─ Deploy → supabase db push (after linking project)
```

---

## Critical Rules

### ✅ MUST Follow

1. **Enable RLS on all tables immediately after creation** - No table should be accessible without RLS policies
2. **Wrap auth functions in SELECT for performance** - Use `(SELECT auth.uid())` instead of `auth.uid()` directly in policies
3. **Always generate TypeScript types after schema changes** - Run `supabase gen types typescript` to keep types synchronized
4. **Use schema-qualified table names in mutations** - `.schema('scheduling').from('appointments')`
5. **Index columns used in RLS policies** - Create B-tree indexes on `user_id`, `tenant_id`, etc.
6. **Validate sessions with getUser() on server** - Never trust `getSession()` for authorization decisions
7. **Use views for read paths** - Never query schema tables directly; use views with embedded tenant filters
8. **Commit all migrations to version control** - Use `supabase migration new` for every schema change
9. **Target policies to specific roles** - Use `TO authenticated` or `TO anon` to avoid unnecessary policy evaluation
10. **Apply explicit filters in queries** - Even with RLS, add `.eq('user_id', userId)` for query optimization

### ❌ FORBIDDEN

1. **Direct SQL queries in client code** - Use Supabase query builder with generated types
2. **Missing RLS policies on exposed tables** - Every table in `public` schema must have RLS enabled
3. **Over-fetching data with SELECT *** - Always specify required columns: `.select('id,name,created_at')`
4. **Editing generated type files** - Never modify `database.types.ts` manually
5. **Using getSession() for authorization** - It reads from storage and can be spoofed; use `getUser()` instead
6. **Correlated subqueries in RLS policies** - Use `IN` or `ANY` with arrays instead of joins
7. **Service role keys in browser bundles** - Keep service keys server-only
8. **Manual schema changes in production** - Always use migrations via `supabase db push`
9. **Missing indexes on RLS-filtered columns** - Causes full table scans at scale
10. **Bypassing RLS with SECURITY INVOKER functions** - Default to `SECURITY DEFINER` for functions used in policies
11. **Using deprecated auth.role() in policies** (Since 2.x) - Use `TO authenticated/anon` instead
12. **Using deprecated auth.email() in policies** (Since 2.x) - Use `auth.jwt() ->> 'email'` instead
13. **Using postgres_changes for realtime** (Since 2.78.0) - Use broadcast channels with private config
14. **Using response.body instead of response.data** (Since 2.0) - Breaking change, use `.data` property
15. **Using offset() + limit() for pagination** (Since 2.0) - Use `range(start, end)` instead
16. **Unwrapped auth.uid() in RLS policies** - Always wrap in `SELECT` for performance: `(SELECT auth.uid())`
17. **Using direct connections in serverless functions** - Use Supavisor transaction mode (port 6543) instead
18. **Using prepared statements with transaction pooler** - Add `?pgbouncer=true` to disable prepared statements
19. **Reading from replica immediately after write** - Use primary database for read-after-write consistency
20. **Not monitoring replication lag with Read Replicas** - Always monitor lag to detect stale reads

---

## Patterns

### Pattern 1: Schema Design with RLS-First Approach

**When to use:** Creating new tables in multi-tenant application
**Implementation:**

```sql
-- ✅ CORRECT: Table with RLS enabled immediately
CREATE TABLE scheduling.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES organization.businesses(id),
  customer_id UUID NOT NULL REFERENCES identity.users(id),
  staff_id UUID REFERENCES organization.staff(id),
  service_id UUID NOT NULL REFERENCES catalog.services(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS immediately
ALTER TABLE scheduling.appointments ENABLE ROW LEVEL SECURITY;

-- Add performance indexes for RLS columns
CREATE INDEX idx_appointments_business_id ON scheduling.appointments(business_id);
CREATE INDEX idx_appointments_customer_id ON scheduling.appointments(customer_id);
CREATE INDEX idx_appointments_staff_id ON scheduling.appointments(staff_id);

-- Create policies for multi-tenant isolation
CREATE POLICY "Businesses can view their appointments"
  ON scheduling.appointments
  FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM organization.businesses
      WHERE owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Customers can view their appointments"
  ON scheduling.appointments
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = customer_id);

CREATE POLICY "Businesses can create appointments"
  ON scheduling.appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id IN (
      SELECT id FROM organization.businesses
      WHERE owner_id = (SELECT auth.uid())
    )
  );

-- ❌ WRONG: Table without RLS (exposes all data)
CREATE TABLE scheduling.appointments (...);
-- Missing: ALTER TABLE ... ENABLE ROW LEVEL SECURITY
```

**Why:** RLS provides database-level security that works across all access methods (REST API, client libraries, direct SQL). Enabling it immediately prevents accidental data exposure.

---

### Pattern 2: Optimized RLS Policies for Performance

**When to use:** Writing RLS policies that will execute on large tables
**Implementation:**

```sql
-- ✅ CORRECT: Optimized policy with cached function calls and no joins
CREATE POLICY "Users can access their team records"
  ON test_table
  TO authenticated
  USING (
    team_id = ANY (
      ARRAY(SELECT user_teams())
    )
  );

-- Supporting function (SECURITY DEFINER to bypass RLS on team_user table)
CREATE OR REPLACE FUNCTION user_teams()
  RETURNS INT[] AS
$$
BEGIN
  RETURN ARRAY(
    SELECT team_id
    FROM team_user
    WHERE user_id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index on filtered column
CREATE INDEX idx_test_table_team_id ON test_table(team_id);

-- ❌ WRONG: Policy with join (slow on large tables)
CREATE POLICY "Users can access their team records"
  ON test_table
  TO authenticated
  USING (
    (SELECT auth.uid()) IN (
      SELECT user_id
      FROM team_user
      WHERE team_user.team_id = test_table.team_id -- JOIN!
    )
  );

-- ❌ WRONG: Unwrapped auth.uid() (called once per row)
CREATE POLICY "Users can access their records"
  ON test_table
  TO authenticated
  USING (auth.uid() = user_id);

-- ✅ CORRECT: Wrapped in SELECT (cached per statement)
CREATE POLICY "Users can access their records"
  ON test_table
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
```

**Why:** Wrapping functions in `SELECT` causes PostgreSQL to cache the result per statement. Using `SECURITY DEFINER` functions avoids RLS overhead on joined tables. Avoiding joins prevents N×M comparisons.

---

### Pattern 3: Migration Workflow with Type Generation

**When to use:** Every schema change
**Implementation:**

```bash
# ✅ CORRECT: Full migration workflow

# 1. Create new migration
supabase migration new add_appointments_table

# 2. Write DDL in generated file (supabase/migrations/YYYYMMDDHHMMSS_add_appointments_table.sql)
# See Pattern 1 for SQL content

# 3. Test locally (rebuilds from scratch)
supabase db reset

# 4. Generate TypeScript types
supabase gen types typescript --project-id <PROJECT_REF> > lib/types/database.types.ts

# 5. Verify types in code
# import type { Database } from '@/lib/types/database.types'
# type Appointment = Database['scheduling']['Tables']['appointments']['Row']

# 6. Commit migration + types
git add supabase/migrations/* lib/types/database.types.ts
git commit -m "feat: add appointments table with RLS"

# 7. Deploy to production
supabase link --project-ref <PROJECT_REF>
supabase db push

# 8. Verify migration applied
supabase migration list --remote

# ❌ WRONG: Manual schema changes in Dashboard
# - Changes not tracked in version control
# - Team members can't reproduce schema
# - Production deploys become manual

# ❌ WRONG: Editing database.types.ts manually
# - Changes overwritten on next type generation
# - Types drift from actual schema
```

**Why:** Version-controlled migrations ensure reproducibility. Type generation keeps TypeScript in sync with database schema. Local testing with `db reset` verifies migrations are complete.

---

### Pattern 4: Type-Safe Queries with Generated Types

**When to use:** Every database query
**Implementation:**

```typescript
// ✅ CORRECT: Type-safe query with generated types
import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Re-export typed row for feature usage
export type Appointment = Database['scheduling']['Tables']['appointments']['Row']

const getSupabase = cache(async () => createClient())

export async function listAppointments(businessId: string): Promise<Appointment[]> {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .select('id, business_id, customer_id, start_time, end_time, status')
    .eq('business_id', businessId) // Explicit filter for query optimization
    .eq('user_id', user.id) // Even though RLS enforces this
    .order('start_time', { ascending: true })
    .returns<Appointment[]>()

  if (error) {
    console.error('Query error:', error)
    throw error
  }

  return data
}

// ❌ WRONG: No type safety
export async function listAppointments(businessId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('appointments') // No schema
    .select('*') // Over-fetching
  // No auth check
  // No error handling
  return data // Type is 'any'
}
```

**Why:** Generated types catch schema mismatches at compile time. Explicit column selection reduces payload size. Auth guards ensure RLS context is set. Explicit filters optimize query plans.

---

### Pattern 5: Secure Mutations with Server Actions

**When to use:** Creating, updating, or deleting data
**Implementation:**

```typescript
// ✅ CORRECT: Server Action with validation and RLS
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const appointmentSchema = z.object({
  customer_id: z.string().uuid(),
  service_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
})

export async function createAppointment(_: unknown, formData: FormData) {
  // 1. Parse and validate input
  const result = appointmentSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const payload = result.data
  const supabase = await createClient()

  // 2. Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 3. Get business_id for tenant isolation
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!business) {
    return { error: 'No business found for user' }
  }

  // 4. Insert with schema-qualified table
  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({
      ...payload,
      business_id: business.id, // Explicit tenant context
    })

  if (error) {
    console.error('Insert error:', error)
    return { error: error.message }
  }

  // 5. Invalidate cache
  revalidatePath('/business/appointments')
  return { error: null }
}

// ❌ WRONG: Client-side mutation (bypasses RLS, exposes keys)
'use client'
export async function createAppointment(formData: FormData) {
  const supabase = createBrowserClient(...)
  await supabase.from('appointments').insert(...) // Missing validation, auth check
}
```

**Why:** Server Actions run with secure server context. Zod validation prevents invalid data. `auth.getUser()` ensures RLS policies apply. Schema qualification prevents cross-schema confusion.

---

### Pattern 6: Views for Secure, Optimized Read Paths

**When to use:** Complex queries that need to join multiple tables or denormalize data
**Implementation:**

```sql
-- ✅ CORRECT: View with embedded RLS logic
CREATE VIEW public.appointments_view AS
SELECT
  a.id,
  a.business_id,
  a.customer_id,
  a.start_time,
  a.end_time,
  a.status,
  b.name AS business_name,
  u.email AS customer_email,
  s.title AS service_title
FROM scheduling.appointments a
JOIN organization.businesses b ON a.business_id = b.id
JOIN identity.users u ON a.customer_id = u.id
JOIN catalog.services s ON a.service_id = s.id;

-- Grant access to view
GRANT SELECT ON public.appointments_view TO authenticated;

-- Query view in application code
const { data } = await supabase
  .from('appointments_view')
  .select('*')
  .eq('business_id', businessId)

-- ❌ WRONG: Complex join in application code
const { data } = await supabase
  .from('appointments')
  .select(`
    *,
    businesses:business_id(name),
    users:customer_id(email),
    services:service_id(title)
  `)
// This works but is harder to maintain and repeats logic across features
```

**Why:** Views centralize complex query logic. RLS on underlying tables still applies. Views can be indexed and optimized separately.

---

### Pattern 7: PostgreSQL Functions for Complex Logic

**When to use:** Business logic that requires multiple queries, conditional logic, or performance optimization
**Implementation:**

```sql
-- ✅ CORRECT: SECURITY DEFINER function with explicit access control
CREATE OR REPLACE FUNCTION get_business_stats(p_business_id UUID)
  RETURNS JSON AS
$$
DECLARE
  result JSON;
BEGIN
  -- Verify caller owns the business
  IF NOT EXISTS (
    SELECT 1 FROM organization.businesses
    WHERE id = p_business_id AND owner_id = (SELECT auth.uid())
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Complex aggregation logic
  SELECT json_build_object(
    'total_appointments', COUNT(a.id),
    'total_revenue', SUM(s.price),
    'avg_rating', AVG(r.rating)
  )
  INTO result
  FROM scheduling.appointments a
  LEFT JOIN catalog.services s ON a.service_id = s.id
  LEFT JOIN engagement.reviews r ON a.id = r.appointment_id
  WHERE a.business_id = p_business_id
    AND a.status = 'completed'
    AND a.created_at > NOW() - INTERVAL '30 days';

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call from TypeScript
const { data, error } = await supabase
  .rpc('get_business_stats', { p_business_id: businessId })

// Type inference
type BusinessStats = {
  total_appointments: number
  total_revenue: number
  avg_rating: number
}

// ❌ WRONG: SECURITY INVOKER (inherits caller's RLS context, may be slow)
CREATE OR REPLACE FUNCTION get_business_stats(...)
  RETURNS JSON AS
$$
  -- Same logic but must check RLS on every table access
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

**Why:** `SECURITY DEFINER` functions run with creator's privileges, bypassing RLS overhead when manually validated. Complex logic stays in database for performance. JSON return type works well with TypeScript.

---

### Pattern 8: Indexes for RLS Query Performance

**When to use:** Tables with RLS policies filtering on specific columns
**Implementation:**

```sql
-- ✅ CORRECT: Indexes matching RLS policy filters

-- RLS policy filters on business_id
CREATE POLICY "Businesses view appointments"
  ON scheduling.appointments
  FOR SELECT
  TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = (SELECT auth.uid())));

-- Matching B-tree index
CREATE INDEX idx_appointments_business_id
  ON scheduling.appointments USING btree (business_id);

-- Composite index for common query patterns
CREATE INDEX idx_appointments_business_status_time
  ON scheduling.appointments (business_id, status, start_time);

-- Partial index for frequently filtered subset
CREATE INDEX idx_appointments_pending
  ON scheduling.appointments (business_id, start_time)
  WHERE status = 'pending';

-- ❌ WRONG: No index on RLS-filtered column
-- Causes full table scan for every query

-- ❌ WRONG: Index column order doesn't match query pattern
CREATE INDEX idx_appointments_wrong_order
  ON scheduling.appointments (start_time, business_id);
-- Query filters business_id first, then start_time, so this index is less effective
```

**Why:** Postgres uses indexes to quickly find rows matching RLS policies. Composite indexes support multi-column filters. Partial indexes reduce size and improve performance for common subsets.

---

### Pattern 9: Migration Testing with pgTAP

**When to use:** Critical RLS policies that must be verified
**Implementation:**

```sql
-- ✅ CORRECT: pgTAP test for RLS policy

-- File: supabase/tests/appointments_rls.test.sql
BEGIN;

SELECT plan(4);

-- Setup test data
SELECT tests.create_supabase_user('business@test.com');
SELECT tests.create_supabase_user('customer@test.com');

INSERT INTO organization.businesses (id, owner_id, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  tests.get_supabase_uid('business@test.com'),
  'Test Business'
);

INSERT INTO scheduling.appointments (business_id, customer_id, start_time, end_time)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  tests.get_supabase_uid('customer@test.com'),
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '2 hours'
);

-- Test 1: Business owner can see their appointments
SELECT tests.authenticate_as('business@test.com');
SELECT results_eq(
  'SELECT COUNT(*)::INT FROM appointments_view WHERE business_id = ''00000000-0000-0000-0000-000000000001''',
  ARRAY[1],
  'Business owner can view their appointments'
);

-- Test 2: Customer can see their appointments
SELECT tests.authenticate_as('customer@test.com');
SELECT results_eq(
  'SELECT COUNT(*)::INT FROM appointments_view',
  ARRAY[1],
  'Customer can view their appointments'
);

-- Test 3: Customer cannot see other customer's appointments
SELECT tests.create_supabase_user('other@test.com');
SELECT tests.authenticate_as('other@test.com');
SELECT results_eq(
  'SELECT COUNT(*)::INT FROM appointments_view',
  ARRAY[0],
  'Users cannot see other users'' appointments'
);

-- Test 4: Business cannot modify other business's appointments
SELECT tests.authenticate_as('business@test.com');
SELECT lives_ok(
  $$INSERT INTO scheduling.appointments (business_id, customer_id, start_time, end_time)
    VALUES (
      '00000000-0000-0000-0000-000000000001',
      tests.get_supabase_uid('customer@test.com'),
      NOW() + INTERVAL '2 days',
      NOW() + INTERVAL '2 days' + INTERVAL '1 hour'
    )$$,
  'Business can create appointments for their own business'
);

SELECT * FROM finish();
ROLLBACK;
```

**Why:** pgTAP tests verify RLS policies work as intended. Running in transaction (BEGIN/ROLLBACK) keeps test data isolated. Automated tests prevent regressions.

---

### Pattern 10: Real-time Subscriptions with RLS

**When to use:** Client components that need live updates
**Implementation:**

```typescript
// ✅ CORRECT: Real-time subscription with RLS filtering
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['scheduling']['Tables']['appointments']['Row']

export function AppointmentsRealtime({ businessId }: { businessId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    // Initial fetch
    supabase
      .from('appointments_view')
      .select('*')
      .eq('business_id', businessId)
      .then(({ data }) => {
        if (mounted && data) setAppointments(data)
      })

    // Subscribe to changes
    const channel = supabase
      .channel(`appointments:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'scheduling',
          table: 'appointments',
          filter: `business_id=eq.${businessId}`, // Server-side filter
        },
        (payload) => {
          if (!mounted) return

          switch (payload.eventType) {
            case 'INSERT':
              setAppointments((prev) => [...prev, payload.new as Appointment])
              break
            case 'UPDATE':
              setAppointments((prev) =>
                prev.map((a) => (a.id === payload.new.id ? (payload.new as Appointment) : a))
              )
              break
            case 'DELETE':
              setAppointments((prev) => prev.filter((a) => a.id !== payload.old.id))
              break
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [businessId, supabase])

  return (
    <ul>
      {appointments.map((appt) => (
        <li key={appt.id}>
          {appt.start_time} - {appt.status}
        </li>
      ))}
    </ul>
  )
}

// ❌ WRONG: Subscription without cleanup or filtering
export function AppointmentsRealtime() {
  const supabase = createClient()

  supabase
    .channel('appointments')
    .on('postgres_changes', { event: '*', schema: 'scheduling', table: 'appointments' }, ...)
    .subscribe()
  // Missing: channel cleanup, business_id filter, type safety
}
```

**Why:** Channel-specific subscriptions reduce network traffic. Server-side filters prevent unauthorized updates from reaching client. Cleanup prevents memory leaks.

---

### Pattern 11: Realtime Broadcast with Private Channels (Updated: Supabase JS 2.78.0)

**When to use:** Real-time updates for client components (replaces deprecated postgres_changes)
**Implementation:**

```typescript
// ✅ CORRECT: New broadcast pattern with private channels (Supabase JS 2.78.0+)
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type Message = Database['public']['Tables']['messages']['Row']

export function MessagesRealtime({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    // Initial fetch
    supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .then(({ data }) => {
        if (mounted && data) setMessages(data)
      })

    // Subscribe to broadcast channel with private config
    const channel = supabase
      .channel(`room:${roomId}:messages`, {
        config: { private: true } // Requires RLS on realtime.messages
      })
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        if (!mounted) return
        setMessages((prev) => [...prev, payload.payload as Message])
      })
      .on('broadcast', { event: 'UPDATE' }, (payload) => {
        if (!mounted) return
        setMessages((prev) =>
          prev.map((m) => (m.id === payload.payload.id ? (payload.payload as Message) : m))
        )
      })
      .on('broadcast', { event: 'DELETE' }, (payload) => {
        if (!mounted) return
        setMessages((prev) => prev.filter((m) => m.id !== payload.payload.id))
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])

  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg.id}>{msg.content}</li>
      ))}
    </ul>
  )
}

// ❌ DEPRECATED: Old postgres_changes pattern (removed in 2.78.0)
export function MessagesRealtimeOld({ roomId }: { roomId: string }) {
  const supabase = createClient()

  useEffect(() => {
    // This pattern is deprecated and will be removed
    const channel = supabase
      .channel('changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          // Handle changes
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])
}
```

**Required migration SQL:**

```sql
-- Add RLS policies for broadcast authorization
CREATE POLICY "authenticated_users_can_receive" ON realtime.messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_users_can_send" ON realtime.messages
  FOR INSERT TO authenticated WITH CHECK (true);

-- Optional: Room-specific authorization
CREATE POLICY "room_members_can_read" ON realtime.messages
  FOR SELECT TO authenticated
  USING (
    topic LIKE 'room:%' AND
    EXISTS (
      SELECT 1 FROM room_members
      WHERE user_id = auth.uid()
      AND room_id = SPLIT_PART(topic, ':', 2)::uuid
    )
  );

-- Performance index
CREATE INDEX idx_room_members_user_room
  ON room_members(user_id, room_id);
```

**Database trigger to send broadcasts:**

```sql
-- Function to notify table changes via broadcast
CREATE OR REPLACE FUNCTION notify_table_changes()
RETURNS trigger AS $$
DECLARE
  room_id_val text;
BEGIN
  -- Extract room_id from the record
  room_id_val := COALESCE(NEW.room_id, OLD.room_id)::text;

  -- Send broadcast to the room-specific channel
  PERFORM realtime.send(
    'room:' || room_id_val || ':messages',
    TG_OP, -- INSERT, UPDATE, or DELETE
    TG_TABLE_NAME,
    COALESCE(NEW, OLD)
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to messages table
CREATE TRIGGER messages_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_table_changes();
```

**Migration checklist:**
1. ✅ Add RLS policies to `realtime.messages` table
2. ✅ Replace `.on('postgres_changes', ...)` with `.channel().on('broadcast', ...)`
3. ✅ Add `{ config: { private: true } }` to channel options
4. ✅ Create database trigger to send broadcast messages
5. ✅ Use dedicated topic names (e.g., `room:${id}:messages`)
6. ✅ Test authorization with different users

**Why:** The new broadcast pattern is more scalable, supports private channels with RLS, and reduces server load. The dedicated topic pattern ensures messages only reach relevant subscribers. Triggers enable database-driven broadcasts without application code changes.

---

### Pattern 12: Query Performance Analysis with .explain()

**When to use:** Debugging slow queries or verifying RLS policy performance
**Implementation:**

```typescript
// ✅ CORRECT: Using .explain() for performance analysis (Supabase JS 2.78.0+)
import { createClient } from '@/lib/supabase/server'

export async function analyzeQueryPerformance() {
  const supabase = await createClient()

  // Get query plan with actual execution times
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('business_id', '123')
    .explain({ analyze: true })

  if (error) {
    console.error('Query error:', error)
    return
  }

  // data contains EXPLAIN ANALYZE output
  console.log(data)
  /*
  Output example:
  Aggregate  (cost=8.18..8.20 rows=1 width=112) (actual time=0.017..0.018 rows=1 loops=1)
    ->  Index Scan using appointments_business_id_idx on appointments
        (cost=0.15..8.17 rows=1 width=40) (actual time=0.012..0.012 rows=0 loops=1)
        Index Cond: (business_id = '123')
        Filter: (RLS policy applied here)
  Planning Time: 0.092 ms
  Execution Time: 0.046 ms
  */
}

// Required: Enable explain in PostgREST (development only!)
// Run this SQL on your database:
/*
ALTER ROLE authenticator SET pgrst.db_plan_enabled TO true;
NOTIFY pgrst, 'reload config';
*/

// ⚠️ PRODUCTION: Restrict explain() by IP address
/*
CREATE OR REPLACE FUNCTION filter_plan_requests()
RETURNS void AS $$
DECLARE
  headers   json := current_setting('request.headers', true)::json;
  client_ip text := coalesce(headers->>'cf-connecting-ip', '');
  accept    text := coalesce(headers->>'accept', '');
  your_ip   text := '123.123.123.123'; -- Replace with your IP
BEGIN
  IF accept LIKE 'application/vnd.pgrst.plan%' AND client_ip != your_ip THEN
    RAISE insufficient_privilege USING
      message = 'Not allowed to use application/vnd.pgrst.plan';
  END IF;
END;
$$ LANGUAGE plpgsql;

ALTER ROLE authenticator SET pgrst.db_pre_request TO 'filter_plan_requests';
NOTIFY pgrst, 'reload config';
*/
```

**Why:** `.explain()` provides actual execution times and shows how RLS policies affect query performance. This is invaluable for optimizing slow queries and verifying that indexes are being used. The IP-based restriction ensures production security.

---

### Pattern 13: Connection Pooling with Supavisor

**When to use:** Choosing the right connection strategy for your application architecture
**Implementation:**

```typescript
// ✅ CORRECT: Transaction mode for serverless functions (Supabase JS 2.78.0+)
// Use port 6543 for transient, short-lived connections

// .env
DATABASE_URL="postgres://postgres.your-tenant-id:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

// Configure Prisma for transaction mode
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Direct connection for migrations
}

// ✅ CORRECT: Session mode for persistent applications
// Use port 5432 when you need longer-lived connections with transaction support

// .env
DATABASE_URL="postgres://postgres.your-tenant-id:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

// ✅ CORRECT: Direct connection for database administration
// Use direct connection (db.xxx.supabase.co) for migrations, pg_dump, etc.

// .env
DIRECT_URL="postgresql://postgres:password@db.projectref.supabase.co:5432/postgres"

// Example: Using transaction pooler with Supabase Edge Functions
import { createClient } from '@supabase/supabase-js@2'

export default async function handler(req: Request) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  // Transient connection through pooler - automatically managed
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(10)

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
}

// ❌ WRONG: Using direct connection in serverless (will exhaust connections)
// Serverless functions scale horizontally, each creating new connections
const DATABASE_URL = "postgresql://postgres:password@db.projectref.supabase.co:5432/postgres"

// ❌ WRONG: Using prepared statements with transaction pooler
// Transaction mode doesn't support prepared statements
const { data } = await client.query({
  name: 'get-user', // This will fail in transaction mode
  text: 'SELECT * FROM users WHERE id = $1',
  values: [userId]
})

// ✅ CORRECT: Disable prepared statements for transaction mode
// In Prisma schema:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") + "?pgbouncer=true" // Disables prepared statements
}
```

**Connection mode decision tree:**

```
Choose connection mode:
├─ Serverless/Edge Functions? → Transaction mode (port 6543)
├─ Long-running app server? → Session mode (port 5432)
├─ Database migrations? → Direct connection
├─ pg_dump/restore? → Direct connection
└─ Need prepared statements? → Session mode or Direct connection
```

**Why:** Supavisor connection pooling prevents connection exhaustion in scalable architectures. Transaction mode is optimized for serverless with transient connections. Session mode supports longer-lived connections with full Postgres features. Direct connections are for administrative tasks only.

---

### Pattern 14: Monitoring Connection Health

**When to use:** Debugging connection issues, optimizing connection usage
**Implementation:**

```sql
-- ✅ CORRECT: Monitor live connections with pg_stat_activity
SELECT
  pg_stat_activity.pid as connection_id,
  datname as database,
  usename as connected_role,
  application_name,
  client_addr as client_ip,
  state,
  query_start,
  state_change,
  wait_event_type,
  wait_event,
  query
FROM pg_stat_activity
WHERE datname = 'postgres'
  AND usename != 'supabase_admin' -- Exclude internal connections
ORDER BY query_start DESC;

-- Identify idle connections hogging slots
SELECT
  count(*) as idle_connections,
  usename,
  application_name
FROM pg_stat_activity
WHERE state = 'idle'
  AND datname = 'postgres'
GROUP BY usename, application_name
ORDER BY idle_connections DESC;

-- Monitor connection usage by source
SELECT
  usename as role,
  application_name,
  count(*) as connection_count,
  max(backend_start) as latest_connection
FROM pg_stat_activity
WHERE datname = 'postgres'
GROUP BY usename, application_name
ORDER BY connection_count DESC;

-- Check for long-running queries blocking connections
SELECT
  pid,
  now() - query_start as duration,
  state,
  query
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - query_start > interval '5 minutes'
ORDER BY duration DESC;

-- Terminate idle connections (use cautiously)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND now() - state_change > interval '1 hour'
  AND usename = 'postgres'; -- Only terminate specific user connections
```

**TypeScript monitoring helper:**

```typescript
// ✅ CORRECT: Connection health check for server-side monitoring
'use server'

import { createClient } from '@/lib/supabase/server'

export async function getConnectionHealth() {
  const supabase = await createClient()

  const { data: connections, error } = await supabase
    .rpc('get_connection_stats')

  if (error) throw error

  return {
    totalConnections: connections.total,
    idleConnections: connections.idle,
    activeQueries: connections.active,
    maxConnections: connections.max_conn,
    utilizationPercent: (connections.total / connections.max_conn) * 100
  }
}

// Supporting RPC function (create via migration)
/*
CREATE OR REPLACE FUNCTION get_connection_stats()
RETURNS JSON AS
$$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', count(*),
    'idle', count(*) FILTER (WHERE state = 'idle'),
    'active', count(*) FILTER (WHERE state = 'active'),
    'max_conn', current_setting('max_connections')::int
  )
  INTO result
  FROM pg_stat_activity
  WHERE datname = current_database();

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/
```

**Why:** Monitoring connection health helps identify connection leaks, optimize pool sizes, and prevent "max connections" errors. `pg_stat_activity` provides real-time visibility into database activity.

---

### Pattern 15: Read Replicas for Global Scalability

**When to use:** Reducing latency for global users, load balancing read-heavy workloads
**Implementation:**

```typescript
// ✅ CORRECT: Using Read Replicas with load balancer endpoint
'use client'

import { createClient } from '@supabase/supabase-js'

// Load balancer automatically routes GET requests to nearest replica
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_LOAD_BALANCER_URL!, // New load balancer endpoint
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchGlobalData() {
  // This GET request automatically routes to nearest replica
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .limit(100)

  return data
}

// ✅ CORRECT: Explicit replica selection for analytics queries
const replicaClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_REPLICA_US_EAST_URL!, // Specific replica endpoint
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function runAnalyticsQuery() {
  // Heavy analytics query runs on replica, not primary
  const { data } = await replicaClient
    .rpc('calculate_monthly_revenue')

  return data
}

// ✅ CORRECT: Server Action with primary database for writes
'use server'

import { createClient } from '@/lib/supabase/server'

export async function createOrder(formData: FormData) {
  const supabase = await createClient() // Always uses primary for writes

  const { error } = await supabase
    .from('orders')
    .insert({
      customer_id: formData.get('customer_id'),
      total: formData.get('total')
    })

  if (error) return { error: error.message }
  return { error: null }
}

// ❌ WRONG: Expecting immediate read consistency on replica
export async function createAndReadOrder() {
  // Write to primary
  await supabase.from('orders').insert({ id: '123', total: 100 })

  // Read from replica immediately (may not have replicated yet!)
  const { data } = await replicaClient
    .from('orders')
    .select('*')
    .eq('id', '123')
    .single() // May return null due to replication lag!

  return data
}

// ✅ CORRECT: Read from primary after write for consistency
export async function createAndReadOrder() {
  const primaryClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Write to primary
  const { data: newOrder } = await primaryClient
    .from('orders')
    .insert({ total: 100 })
    .select()
    .single()

  return newOrder // Guaranteed to be consistent
}
```

**Monitoring replication lag:**

```sql
-- ✅ CORRECT: Check replication lag on Read Replica
-- Run this query on the replica database

SELECT
  now() - pg_last_xact_replay_timestamp() AS replication_lag;

-- Returns NULL if queried on primary
-- Returns interval (e.g., "00:00:02.5") if queried on replica
```

**When to use Read Replicas:**

```
Use Read Replicas when:
├─ Global user base → Deploy replicas in multiple regions
├─ Read-heavy workload → Offload analytics to replicas
├─ Complex reporting queries → Avoid impacting primary performance
└─ High availability → Redundancy for disaster recovery

Avoid Read Replicas for:
├─ Immediate read-after-write consistency → Use primary database
├─ Low-traffic applications → Connection pooling is sufficient
└─ Write-heavy workloads → Replicas don't help with writes
```

**Why:** Read Replicas reduce query latency for global users by serving reads from geographically closer databases. They also allow offloading heavy analytical queries without impacting primary database performance. However, asynchronous replication means there's a lag between primary and replica.

---

## Detection Commands

```bash
# Check for tables without RLS enabled
echo "SELECT schemaname, tablename FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'auth', 'storage', 'extensions')
AND NOT rowsecurity;" | psql $DATABASE_URL

# Find queries missing explicit filters (potential RLS performance issues)
rg "\.from\(['\"]" features --type ts | \
  grep -v "\.eq(" | \
  grep -v "\.in(" | \
  grep -v "\.filter("

# Detect unwrapped auth.uid() in RLS policies
echo "SELECT tablename, policyname, definition
FROM pg_policies
WHERE definition LIKE '%auth.uid()%'
AND definition NOT LIKE '%(select auth.uid())%';" | psql $DATABASE_URL

# Find mutations missing 'use server'
rg --files -g '*mutations.ts' features | \
  xargs -I{} sh -c "grep -L \"'use server'\" {} && echo '{}'"

# Check for missing indexes on RLS-filtered columns
echo "SELECT tablename, policyname, definition
FROM pg_policies
WHERE schemaname = 'public';" | psql $DATABASE_URL
# Then manually check if columns in USING clauses have indexes

# Detect getSession() usage (should use getUser() instead)
rg "\.getSession\(\)" features --type ts --type tsx

# Find storage operations in client components
rg "storage\.(from|upload|download)" features --type tsx -A 2 | \
  grep -B 2 "'use client'"

# Verify type generation is up to date
supabase gen types typescript --project-id $PROJECT_REF > /tmp/types.ts && \
  diff /tmp/types.ts lib/types/database.types.ts

# Check for schema tables accessed outside mutations
rg "\.schema\(" features --type ts | \
  grep -v "mutations.ts" | \
  grep -v "queries.ts"

# ====== NEW: Detect deprecated patterns (Supabase 2.x) ======

# Find deprecated postgres_changes usage (use broadcast instead)
rg "postgres_changes" features --type ts --type tsx

# Find deprecated auth.role() in RLS policies
echo "SELECT tablename, policyname, definition
FROM pg_policies
WHERE definition LIKE '%auth.role()%';" | psql $DATABASE_URL

# Find deprecated auth.email() in RLS policies
echo "SELECT tablename, policyname, definition
FROM pg_policies
WHERE definition LIKE '%auth.email()%';" | psql $DATABASE_URL

# Find deprecated .body property usage (should use .data)
rg "\.body\b" features --type ts --type tsx | grep -v "request.body"

# Find deprecated offset() usage (should use range())
rg "\.offset\(" features --type ts --type tsx

# Find deprecated login/logout/signup methods
rg "\.(login|logout|signup)\(" features --type ts --type tsx

# Find unwrapped auth.uid() in policies (performance issue)
echo "SELECT tablename, policyname, definition
FROM pg_policies
WHERE definition LIKE '%auth.uid()%'
  AND definition NOT LIKE '%(select auth.uid())%'
  AND definition NOT LIKE '%(SELECT auth.uid())%';" | psql $DATABASE_URL

# Check for missing TO clause in RLS policies (should specify authenticated/anon)
echo "SELECT schemaname, tablename, policyname, roles
FROM pg_policies
WHERE roles = '{public}';" | psql $DATABASE_URL

# Find queries without explicit filters (RLS performance issue)
rg "\.from\(['\"]" features --type ts | \
  grep -v "\.eq(" | \
  grep -v "\.in(" | \
  grep -v "\.filter(" | \
  grep -v "\.match("

# ====== NEW: Connection pooling and performance detection ======

# Detect direct connection usage in serverless code (should use pooler)
rg "db\..*\.supabase\.co:5432" --type ts --type env

# Find code using prepared statements with transaction pooler
rg "pgbouncer=true" --type ts | grep -v "prisma"

# Check connection pool utilization
echo "SELECT
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active,
  count(*) FILTER (WHERE state = 'idle') as idle,
  current_setting('max_connections')::int as max_connections
FROM pg_stat_activity
WHERE datname = current_database();" | psql $DATABASE_URL

# Detect Read Replica configuration without replication lag monitoring
rg "SUPABASE_REPLICA" --type env | head -1 && \
  rg "pg_last_xact_replay_timestamp" --type ts || \
  echo "⚠️  Using replicas without replication lag monitoring"

# Find immediate reads after writes (may fail with replicas)
rg "\.insert\(" features --type ts -A 5 | \
  grep -A 5 "\.select\(" | \
  head -20
```

---

## Quick Reference

| Pattern | When | Example | Since |
|---------|------|---------|-------|
| Enable RLS | Creating any table | `ALTER TABLE users ENABLE ROW LEVEL SECURITY` | Always |
| Wrap auth functions | Writing RLS policies | `USING ((SELECT auth.uid()) = user_id)` | Always |
| Target policy role | Writing RLS policies | `CREATE POLICY ... TO authenticated USING (...)` | 2.0+ |
| Index RLS columns | After creating RLS policy | `CREATE INDEX idx_user_id ON table(user_id)` | Always |
| Create migration | Any schema change | `supabase migration new add_users_table` | Always |
| Generate types | After migration | `supabase gen types typescript > database.types.ts` | Always |
| Type-safe query | Reading data | `.from('users').select('id,name').returns<User[]>()` | Always |
| Server mutation | Writing data | `'use server'` + `auth.getUser()` + schema validation | Always |
| Use views | Complex queries | `CREATE VIEW users_view AS SELECT ... FROM users JOIN ...` | Always |
| RLS function | Expensive policy logic | `CREATE FUNCTION user_teams() ... SECURITY DEFINER` | Always |
| Broadcast realtime | Live updates | `.channel('room:123', {config: {private: true}}).on('broadcast', ...)` | 2.78.0+ |
| Query performance | Debug slow queries | `.from('users').select('*').explain({analyze: true})` | 2.78.0+ |
| Explicit filters | All queries | `.from('users').select('*').eq('user_id', userId)` | Always |
| Transaction pooling | Serverless functions | Use port 6543 with `?pgbouncer=true` for Prisma | Always |
| Session pooling | Long-running servers | Use port 5432 for persistent connections | Always |
| Connection monitoring | Debug connection issues | Query `pg_stat_activity` for live connections | Always |
| Read Replicas | Global scalability | Use load balancer endpoint for geo-routing | Pro+ Plans |
| Replication lag check | Monitor replica health | `SELECT now() - pg_last_xact_replay_timestamp()` | With replicas |

---

**Related:**
- [01-architecture.md](01-architecture.md) - File structure for Supabase queries/mutations
- [02-typescript.md](02-typescript.md) - Type safety patterns for database types
- [04-nextjs.md](04-nextjs.md) - Server Actions and caching with Supabase
- [06-api.md](06-api.md) - Server Actions vs RPC functions
- [09-auth.md](09-auth.md) - Authentication patterns with Supabase Auth

---

**Last Verified:** 2025-11-03
**Next Review:** After major Supabase version update
