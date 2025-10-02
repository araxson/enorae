# 🔒 SUPABASE BEST PRACTICES

> **Navigation**: [📘 Docs Index](./INDEX.md) | [🏠 README](../README.md) | [🤖 CLAUDE.md](../CLAUDE.md)

> **Performance Optimization, RLS Patterns, and Security**
> **Based on Official Supabase Documentation Research (January 2025)**
> **Last Updated**: 2025-10-01

This document contains production-ready patterns and best practices for working with Supabase in Next.js 15 App Router applications.

---

## 📑 Table of Contents

1. [Authentication & Row Level Security (RLS)](#1-authentication--row-level-security-rls)
2. [Next.js App Router Integration](#2-nextjs-app-router-integration)
3. [Type Safety & Type Generation](#3-type-safety--type-generation)
4. [Query Performance Optimization](#4-query-performance-optimization)
5. [Database Functions & Migrations](#5-database-functions--migrations)
6. [Edge Functions Best Practices](#6-edge-functions-best-practices)
7. [Error Handling & Debugging](#7-error-handling--debugging)

---

## 1. Authentication & Row Level Security (RLS)

### 1.1 Critical RLS Performance Patterns

#### ✅ ALWAYS Wrap Functions in SELECT Statements
**WHY**: Allows Postgres to cache function results per statement instead of per row (~95% performance improvement)

```sql
-- ❌ SLOW - Function executed for EVERY row (171ms)
create policy "user_access" on test_table
to authenticated
using ( auth.uid() = user_id );

-- ✅ FAST - Function executed ONCE per statement (9ms)
create policy "user_access" on test_table
to authenticated
using ( (select auth.uid()) = user_id );
```

**Performance Impact**: 171ms → 9ms (94% improvement)

#### ✅ ALWAYS Specify Roles with TO

```sql
-- ❌ BAD - Policy runs for ALL roles including 'anon'
create policy "user_access" on test_table
using ( (select auth.uid()) = user_id );

-- ✅ GOOD - Policy only runs for authenticated users
create policy "user_access" on test_table
to authenticated
using ( (select auth.uid()) = user_id );
```

**Performance Impact**: Prevents unnecessary policy evaluation for anonymous users

#### ✅ ALWAYS Add Indexes on RLS Columns

```sql
-- Add index on columns used in RLS policies
create index user_id_idx on test_table using btree (user_id);

-- For foreign key relationships
create index team_id_idx on test_table using btree (team_id);
```

**Performance Impact**: 171ms → <0.1ms (99.9% improvement)

### 1.2 RLS Policy Patterns

#### Basic User-Owned Data

```sql
-- Enable RLS
alter table todos enable row level security;

-- Policy for SELECT
create policy "users_view_own_todos" on todos
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Policy for INSERT
create policy "users_create_own_todos" on todos
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

-- Policy for UPDATE
create policy "users_update_own_todos" on todos
  for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- Policy for DELETE
create policy "users_delete_own_todos" on todos
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );
```

#### Team/Organization Access

```sql
-- ❌ SLOW - Direct join (9,000ms)
create policy "team_access" on test_table
to authenticated
using (
  auth.uid() in (
    select user_id from team_user
    where team_user.team_id = test_table.team_id
  )
);

-- ✅ FAST - Reverse join with IN (20ms)
create policy "team_access" on test_table
to authenticated
using (
  team_id in (
    select team_id from team_user
    where user_id = (select auth.uid())
  )
);

-- ✅ FASTEST - Security definer function (16ms)
create or replace function user_teams()
returns int[]
language plpgsql
security definer
set search_path = ''
as $$
begin
  return array(
    select team_id
    from public.team_user
    where user_id = (select auth.uid())
  );
end;
$$;

create policy "team_access" on test_table
to authenticated
using ( team_id = any(array(select user_teams())) );
```

**Performance Impact**: 9,000ms → 16ms (99.8% improvement)

#### Multi-Factor Authentication (MFA) Enforcement

```sql
-- Enforce MFA for sensitive operations
create policy "mfa_required_for_updates" on profiles
  as restrictive
  for update
  to authenticated
  using ( (select auth.jwt()->>'aal') = 'aal2' );

-- Conditional MFA (only for users who enabled MFA)
create policy "conditional_mfa" on sensitive_table
  as restrictive
  to authenticated
  using (
    array[auth.jwt()->>'aal'] <@ (
      select
        case
          when count(id) > 0 then array['aal2']
          else array['aal1', 'aal2']
        end as aal
      from auth.mfa_factors
      where (select auth.uid()) = user_id and status = 'verified'
    )
  );
```

#### Public + Authenticated Access

```sql
-- Allow both anonymous and authenticated users
create policy "public_read_access" on profiles
  for select
  to authenticated, anon
  using ( true );

-- Restrict to authenticated only
create policy "authenticated_only" on profiles
  for select
  to authenticated
  using ( true );
```

### 1.3 Security Definer Functions

```sql
-- Use for complex RLS logic to bypass RLS on helper tables
create or replace function private.has_admin_role()
returns boolean
language plpgsql
security definer
set search_path = '' -- CRITICAL: Prevents search_path attacks
as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid())
    and role = 'admin'
  );
end;
$$;

-- Use in RLS policy
create policy "admin_access" on sensitive_table
to authenticated
using ( (select private.has_admin_role()) );
```

**⚠️ CRITICAL**: Always set `search_path = ''` on security definer functions

### 1.4 Client-Side Query Optimization

```typescript
// ❌ BAD - Relies only on RLS (slower query plan)
const { data } = await supabase
  .from('todos')
  .select();

// ✅ GOOD - Explicit filter helps query planner (faster)
const { data } = await supabase
  .from('todos')
  .select()
  .eq('user_id', userId);
```

**WHY**: Even with RLS, explicit filters help Postgres create better query plans

---

## 2. Next.js App Router Integration

### 2.1 Supabase Client Creation Patterns

#### Server Client (`utils/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component
            // Can be ignored if middleware is refreshing sessions
          }
        },
      },
    }
  )
}
```

#### Browser Client (`utils/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### Middleware (`middleware.ts`)

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

#### Middleware Session Update (`utils/supabase/middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // CRITICAL: Don't remove - Refreshes auth tokens
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return supabaseResponse
}
```

### 2.2 Server Components

```typescript
import { createClient } from '@/utils/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Query with RLS automatically applied
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)

  return <div>{/* Render todos */}</div>
}
```

### 2.3 Server Actions

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createTodo(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string

  // Insert with automatic RLS
  const { error } = await supabase
    .from('todos')
    .insert({ title, user_id: user.id })

  if (error) {
    throw error
  }

  revalidatePath('/todos')
}

export async function deleteTodo(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // RLS ensures user can only delete their own todos
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/todos')
}
```

### 2.4 Client Components

```typescript
'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [todos, setTodos] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function loadTodos() {
      const { data } = await supabase.from('todos').select('*')
      setTodos(data || [])
    }
    loadTodos()
  }, [])

  return <div>{/* Render todos */}</div>
}
```

---

## 3. Type Safety & Type Generation

### 3.1 Generate Types from Database

```bash
# Generate types from remote project
npx supabase gen types typescript --project-id "$PROJECT_REF" > packages/database/types.ts

# Generate types from local development
npx supabase gen types typescript --local > packages/database/types.ts
```

### 3.2 Use Generated Types

```typescript
// packages/database/types.ts (auto-generated)
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          user_id: string
          title: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          completed?: boolean
          created_at?: string
        }
      }
    }
  }
}
```

```typescript
// Usage in application
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/packages/database/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ✅ Fully type-safe queries
const { data } = await supabase
  .from('todos') // ✅ Autocomplete table names
  .select('id, title, completed') // ✅ Autocomplete column names
  .eq('user_id', userId) // ✅ Type-checked values
```

### 3.3 Helper Types for Queries

```typescript
import { QueryData } from '@supabase/supabase-js'

// Define query once
const todosWithUserQuery = supabase
  .from('todos')
  .select(`
    id,
    title,
    user:profiles (
      id,
      email,
      full_name
    )
  `)

// Extract type from query
type TodosWithUser = QueryData<typeof todosWithUserQuery>

// Use type-safe data
const { data } = await todosWithUserQuery
const todos: TodosWithUser = data // ✅ Fully typed including nested joins
```

### 3.4 Custom JSON Types

```typescript
import { MergeDeep } from 'type-fest'
import { Database as DatabaseGenerated } from './database-generated.types'

type CustomMetadata = {
  theme: 'light' | 'dark'
  notifications: boolean
  preferences: {
    language: string
    timezone: string
  }
}

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        profiles: {
          Row: {
            metadata: CustomMetadata | null
          }
        }
      }
    }
  }
>

// ✅ Type-safe JSON querying
const { data } = await supabase
  .from('profiles')
  .select('metadata->theme, metadata->preferences->language')
// TypeScript knows: { theme: 'light' | 'dark', language: string }
```

---

## 4. Query Performance Optimization

### 4.1 RLS Performance Checklist

```typescript
// ✅ DO: Add explicit filters (helps query planner)
const { data } = await supabase
  .from('todos')
  .select()
  .eq('user_id', user.id) // Explicit filter

// ✅ DO: Select only needed columns
const { data } = await supabase
  .from('todos')
  .select('id, title, completed') // Only what you need

// ✅ DO: Use pagination for large datasets
const { data } = await supabase
  .from('todos')
  .select()
  .range(0, 9) // First 10 items

// ❌ DON'T: Fetch all columns when you don't need them
const { data } = await supabase
  .from('todos')
  .select('*') // Fetches everything

// ❌ DON'T: Fetch without pagination
const { data } = await supabase
  .from('todos')
  .select() // Could return millions of rows
```

### 4.2 Database Indexes

```sql
-- Index columns used in WHERE clauses
create index todos_user_id_idx on todos(user_id);

-- Index columns used in ORDER BY
create index todos_created_at_idx on todos(created_at desc);

-- Composite index for common query patterns
create index todos_user_status_idx on todos(user_id, completed);

-- Index for text search
create index todos_title_idx on todos using gin(to_tsvector('english', title));
```

### 4.3 Query Analysis

```typescript
// Enable query plan analysis (development only)
const { data, error } = await supabase
  .from('todos')
  .select()
  .eq('user_id', userId)
  .explain({ analyze: true })

console.log(data) // Shows query execution plan
```

```sql
-- Server-side query analysis
set session role authenticated;
set request.jwt.claims to '{"sub":"user-id-here"}';

explain analyze
select * from todos
where user_id = (select auth.uid());
```

---

## 5. Database Functions & Migrations

### 5.1 Migration Best Practices

```sql
-- Migration: 20250101120000_create_todos.sql

-- Add migration metadata comment
-- Purpose: Create todos table with RLS
-- Tables: todos
-- Dependencies: auth.users

-- Create table
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  completed boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Add helpful comments
comment on table public.todos is 'User todo items with RLS';
comment on column public.todos.user_id is 'Owner of the todo item';

-- Add indexes
create index todos_user_id_idx on public.todos(user_id);
create index todos_created_at_idx on public.todos(created_at desc);

-- Enable RLS
alter table public.todos enable row level security;

-- Create RLS policies (separate policy per operation)
create policy "users_select_own_todos" on public.todos
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "users_insert_own_todos" on public.todos
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "users_update_own_todos" on public.todos
  for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create policy "users_delete_own_todos" on public.todos
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Add updated_at trigger
create trigger todos_updated_at
  before update on public.todos
  for each row
  execute function public.handle_updated_at();
```

### 5.2 Database Functions

```sql
-- Use SECURITY INVOKER by default (safer)
create or replace function get_user_todos()
returns setof todos
language sql
security invoker -- Runs as calling user (respects RLS)
stable
as $$
  select * from todos
  where user_id = (select auth.uid())
  order by created_at desc;
$$;

-- Use SECURITY DEFINER only when necessary
create or replace function admin_get_all_todos()
returns setof todos
language plpgsql
security definer -- Runs as function creator (bypasses RLS)
set search_path = '' -- CRITICAL: Prevents attacks
as $$
begin
  -- Verify admin role
  if not (select private.is_admin()) then
    raise exception 'Unauthorized: Admin access required';
  end if;

  return query
  select * from public.todos
  order by created_at desc;
end;
$$;

-- Revoke public execute permissions
revoke execute on function admin_get_all_todos() from public;
grant execute on function admin_get_all_todos() to authenticated;
```

---

## 6. Edge Functions Best Practices

### 6.1 Function Organization

```
supabase/
├── functions/
│   ├── _shared/
│   │   ├── supabase.ts       # Reusable Supabase clients
│   │   ├── cors.ts           # CORS headers
│   │   └── auth.ts           # Auth helpers
│   ├── api-webhook/
│   │   └── index.ts
│   └── send-email/
│       └── index.ts
```

### 6.2 CORS Handling

```typescript
// functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// functions/my-function/index.ts
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Your function logic
    const data = { message: 'Success' }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

### 6.3 Authentication in Edge Functions

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  // Verify user authentication
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // User is authenticated - proceed with logic
  return new Response(JSON.stringify({ userId: user.id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
```

### 6.4 Optimization

```typescript
// ✅ Use selective imports for npm packages
import { Sheets } from 'npm:@googleapis/sheets'
import { JWT } from 'npm:google-auth-library/build/src/auth/jwtclient'

// ❌ Avoid importing entire packages
// import * as googleapis from 'npm:googleapis'
```

---

## 7. Error Handling & Debugging

### 7.1 Client-Side Error Handling

```typescript
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from '@supabase/supabase-js'

const { data, error } = await supabase.functions.invoke('my-function', {
  body: { foo: 'bar' },
})

if (error) {
  if (error instanceof FunctionsHttpError) {
    const errorMessage = await error.context.json()
    console.error('Function returned an error:', errorMessage)
  } else if (error instanceof FunctionsRelayError) {
    console.error('Relay error:', error.message)
  } else if (error instanceof FunctionsFetchError) {
    console.error('Fetch error:', error.message)
  }
}
```

### 7.2 Database Function Logging

```sql
create or replace function debug_example(input_val int)
returns void
language plpgsql
as $$
declare
  result_val int;
begin
  raise log 'Function start: input=%', input_val;

  -- Your logic
  select input_val * 2 into result_val;

  raise log 'Calculated result: %', result_val;

  -- Error handling
  if result_val < 0 then
    raise exception 'Invalid result: %', result_val;
  end if;

  raise log 'Function end: result=%', result_val;
exception
  when others then
    raise exception 'Error in debug_example: %', sqlerrm;
end;
$$;
```

### 7.3 RLS Policy Debugging

```sql
-- Test as specific user
set session role authenticated;
set request.jwt.claims to '{"sub":"user-uuid-here","role":"authenticated"}';

-- Run query
select * from todos;

-- Reset
set session role postgres;
```

---

## 📊 Performance Comparison Summary

| Optimization | Before | After | Improvement |
|--------------|--------|-------|-------------|
| Wrap auth.uid() in SELECT | 171ms | 9ms | 94% faster |
| Add index on RLS column | 171ms | <0.1ms | 99.9% faster |
| Specify TO authenticated | 170ms | <0.1ms | 99.9% faster |
| Optimize join queries | 9,000ms | 20ms | 99.8% faster |
| Security definer function | 178,000ms | 12ms | 99.99% faster |

---

## 🔗 Official Resources

- [Supabase Docs](https://supabase.com/docs)
- [RLS Performance Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Next.js Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Type Generation](https://supabase.com/docs/guides/api/rest/generating-types)

---

**Last Updated**: 2025-01-10
**Research Source**: Official Supabase Documentation via Context7 MCP
**Application**: Enorae Salon Booking Platform
