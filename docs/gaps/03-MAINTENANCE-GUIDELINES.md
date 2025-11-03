# Database Schema Alignment - Maintenance Guidelines

**Last Updated:** 2025-11-02
**Maintenance Schedule:** Quarterly (every 3 months)

---

## Overview

This document provides guidelines for maintaining database schema alignment as you develop new features and modify existing code.

---

## Pre-Development Checklist

Before starting work on any feature:

- [ ] Review current database schema via Supabase dashboard
- [ ] Check if required tables/views exist
- [ ] Verify RLS policies for relevant tables
- [ ] Check audit logging setup
- [ ] Review existing patterns in similar features

---

## Feature Development Guidelines

### 1. New Database Table

**When you need a new table:**

```sql
-- Step 1: Create in appropriate schema
CREATE TABLE organization.new_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES organization.salons(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_id UUID,
  updated_by_id UUID,
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  -- business fields here
);

-- Step 2: Enable RLS
ALTER TABLE organization.new_feature ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policy
CREATE POLICY "Users can access their salons' features"
ON organization.new_feature
FOR SELECT
USING (
  salon_id IN (
    SELECT salon_id FROM identity.user_roles
    WHERE user_id = auth.uid()
  )
);
```

**Step 3: Create corresponding view in public schema**

```sql
CREATE VIEW public.new_feature_view AS
SELECT
  f.*,
  s.name as salon_name
FROM organization.new_feature f
JOIN organization.salons s ON f.salon_id = s.id
WHERE f.deleted_at IS NULL;
```

**Step 4: Regenerate types**

```bash
pnpm db:types
```

**Step 5: Create queries and mutations**

```typescript
// features/admin/new-feature/api/queries/data.ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getFeatures(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  return supabase
    .from('new_feature_view')  // ← View for read
    .select('*')
    .eq('salon_id', salonId)
}

// features/admin/new-feature/api/mutations/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type NewFeatureInsert = Database['organization']['Tables']['new_feature']['Insert']

export async function createFeature(data: NewFeatureInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const result = await supabase
    .schema('organization')  // ← Schema for write
    .from('new_feature')
    .insert({ ...data, created_by_id: user.id })
    .select()
    .single()

  if (result.error) throw result.error

  revalidatePath('/admin/features')
  return result.data
}
```

---

### 2. New Columns on Existing Table

**When adding columns to existing table:**

```sql
-- Step 1: Add column
ALTER TABLE organization.salons
ADD COLUMN new_field VARCHAR(255);

-- Step 2: Update view if needed
CREATE OR REPLACE VIEW public.salons_view AS
SELECT
  s.*,
  -- existing fields...
  s.new_field
FROM organization.salons s
WHERE s.deleted_at IS NULL;

-- Step 3: Regenerate types
-- (Run: pnpm db:types)
```

**Step 4: Update code**

```typescript
// Update mutation to use new field
const insertData: Database['organization']['Tables']['salons']['Insert'] = {
  // existing fields...
  new_field: value,  // ← Use the generated type
}
```

---

### 3. New RPC Function

**When you need an RPC function:**

```sql
-- Step 1: Create function in appropriate schema
CREATE OR REPLACE FUNCTION organization.calculate_salon_rating(
  p_salon_id UUID
) RETURNS NUMERIC AS $$
  SELECT AVG(rating)::NUMERIC
  FROM engagement.salon_reviews
  WHERE salon_id = p_salon_id
  AND deleted_at IS NULL;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Step 2: Grant execute permission
GRANT EXECUTE ON FUNCTION organization.calculate_salon_rating(UUID)
TO authenticated;

-- Step 3: Regenerate types
-- (Run: pnpm db:types)
```

**Step 4: Call from code**

```typescript
const { data, error } = await supabase
  .schema('organization')  // ← Schema where function lives
  .rpc('calculate_salon_rating', {
    p_salon_id: salonId,
  })

if (error) throw error
return data as number
```

---

### 4. New Public View

**When you need a new public view:**

```sql
-- Step 1: Create view
CREATE VIEW public.my_new_view AS
SELECT
  t1.id,
  t1.name,
  t2.related_data,
  COUNT(t3.items) as item_count
FROM organization.table1 t1
LEFT JOIN organization.table2 t2 ON t1.id = t2.table1_id
LEFT JOIN engagement.table3 t3 ON t1.id = t3.table1_id
WHERE t1.deleted_at IS NULL
GROUP BY t1.id, t1.name, t2.related_data;

-- Step 2: Set grants for auth users
GRANT SELECT ON public.my_new_view TO authenticated;

-- Step 3: Regenerate types
-- (Run: pnpm db:types)
```

**Step 4: Use in queries**

```typescript
const { data } = await supabase
  .from('my_new_view')  // ← Use in queries
  .select('*')
  .eq('id', recordId)
```

---

## Schema Change Workflow

### Complete Workflow for New Feature with Database

1. **Plan & Design**
   - [ ] Design database schema
   - [ ] Plan views needed
   - [ ] Plan RLS policies
   - [ ] Plan audit logging

2. **Create Database Objects**
   - [ ] Create tables in appropriate schema
   - [ ] Enable RLS and create policies
   - [ ] Create public views
   - [ ] Create RPC functions if needed
   - [ ] Add indexes for performance

3. **Regenerate Types**
   ```bash
   pnpm db:types
   ```

4. **Implement Code**
   - [ ] Create query files (with `import 'server-only'`)
   - [ ] Create mutation files (with `'use server'`)
   - [ ] Add auth guards
   - [ ] Add error handling
   - [ ] Add revalidatePath calls

5. **Add Audit Logging**
   ```typescript
   const { error: auditError } = await supabase
     .schema('audit')
     .from('audit_logs')
     .insert({
       event_type: 'feature_created',
       event_category: 'business',
       action: 'create_feature',
       entity_type: 'feature',
       entity_id: featureId,
       user_id: session.user.id,
       metadata: { /* details */ },
     })
   ```

6. **Type Check**
   ```bash
   pnpm typecheck
   ```

7. **Test Locally**
   - [ ] Test all CRUD operations
   - [ ] Test RLS policies
   - [ ] Test auth guards
   - [ ] Test error cases

8. **Code Review**
   - [ ] Review patterns followed
   - [ ] Review type safety
   - [ ] Review auth implementation
   - [ ] Review error handling

---

## Pattern Checklist for Code Review

### Queries

- [ ] Uses `import 'server-only'`
- [ ] Has auth guard (`getUser()` or `requireAuth()`)
- [ ] Selects from public view (not table)
- [ ] Checks for errors
- [ ] No `any` types
- [ ] Uses generated Database types where needed

### Mutations

- [ ] Uses `'use server'` directive
- [ ] Has auth guard (`requireAuth()` or role check)
- [ ] Inserts to schema-qualified table (not public)
- [ ] Uses generated Insert type
- [ ] Checks for errors
- [ ] Calls `revalidatePath()` on success
- [ ] Adds audit log entry

### RPC Calls

- [ ] Properly schema-qualified (`.schema('schemaName')`)
- [ ] Error checking on result
- [ ] Auth guard before call
- [ ] Type-safe return value

---

## Common Mistakes to Avoid

### ❌ Reading from Schema Tables

```typescript
// WRONG - Reading from table instead of view
const { data } = await supabase
  .from('appointments')  // ← Table, not view!
  .select('*')
```

**Fix:** Use the view
```typescript
// CORRECT
const { data } = await supabase
  .from('appointments_view')  // ← View
  .select('*')
```

### ❌ Writing to Public Schema

```typescript
// WRONG - Writing to public schema
const { data } = await supabase
  .from('appointments')  // ← No schema!
  .insert(appointmentData)
```

**Fix:** Use schema-qualified table
```typescript
// CORRECT
const { data } = await supabase
  .schema('scheduling')  // ← Schema specified
  .from('appointments')
  .insert(appointmentData)
```

### ❌ Missing Auth Checks

```typescript
// WRONG - No auth check
export async function getAppointments() {
  const supabase = await createClient()
  return supabase.from('appointments_view').select('*')
}
```

**Fix:** Add auth guard
```typescript
// CORRECT
export async function getAppointments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  return supabase.from('appointments_view').select('*')
}
```

### ❌ Missing Revalidation

```typescript
// WRONG - No cache invalidation
export async function createAppointment() {
  const result = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert(appointmentData)

  return result  // ← Cache not invalidated!
}
```

**Fix:** Revalidate after mutation
```typescript
// CORRECT
export async function createAppointment() {
  const result = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert(appointmentData)

  revalidatePath('/appointments')
  return result
}
```

---

## Testing Your Changes

### Local Testing Checklist

```bash
# 1. Regenerate types after schema changes
pnpm db:types

# 2. Run type checker
pnpm typecheck

# 3. Start dev server
pnpm dev

# 4. Test manually
# - Create operation
# - Read operation
# - Update operation
# - Delete operation
# - Error cases
# - Auth-denied cases

# 5. Check browser console for errors
# 6. Check server logs for issues
```

### Type Checking

```bash
# Ensure no TypeScript errors
pnpm typecheck

# Expected output: "Type checking passed!"
```

---

## Quarterly Maintenance Tasks

Run these quarterly (every 3 months):

1. **Update Database Types**
   ```bash
   pnpm db:types
   git diff lib/types/database.types.ts
   # Review any changes and commit
   ```

2. **Audit Database Access**
   - Run the alignment audit script
   - Review any schema mismatches
   - Check for new code patterns that violate guidelines

3. **Performance Review**
   - Check slow query logs
   - Review index usage
   - Check table growth
   - Verify partition maintenance

4. **Security Review**
   - Verify RLS policies still appropriate
   - Check auth implementation
   - Review audit logs

5. **Type Safety Audit**
   - Check for any `any` type usage
   - Verify generated types are used
   - Look for manual type duplications

---

## Emergency Procedures

### If Database Type Generation Breaks

```bash
# 1. Check database connectivity
# 2. Verify Supabase project is accessible
# 3. Try regenerating types
pnpm db:types

# 4. If still broken, check recent schema changes
# 5. Verify all migrations are applied
# 6. Check Supabase project status
```

### If Code Won't Typecheck

```bash
# 1. Regenerate types
pnpm db:types

# 2. Check for any schema changes
# 3. Look at recent commits affecting database code
git log --oneline -- features/*/api/
git log --oneline -- lib/types/

# 4. If queries fail, verify tables/views exist
# 5. If mutations fail, check schema specifications
```

---

## Documentation

### When to Document

- [ ] New table created
- [ ] New view created
- [ ] New RPC function created
- [ ] New feature with database component
- [ ] Changes to RLS policies
- [ ] Changes to audit logging

### Where to Document

1. **Code Comments**
   - WHY the database structure exists
   - Any special considerations

2. **README Files**
   - Feature overview
   - Database schema for feature
   - How to use the APIs

3. **This File**
   - Update quarterly checklist
   - Add any new patterns

---

## Quick Reference

### File Structure for New Feature

```
features/portal/feature/
├── api/
│   ├── queries/
│   │   ├── index.ts                 # Re-exports
│   │   └── data.ts                  # Query functions
│   ├── mutations/
│   │   ├── index.ts                 # Re-exports
│   │   └── actions.ts               # Mutation functions
│   ├── schema.ts                    # Zod validation schemas
│   └── types.ts                     # Feature-specific types (if needed)
├── components/
│   ├── feature-form.tsx             # Main component
│   └── index.ts                     # Export
└── index.tsx                        # Feature entry point
```

### Query Template

```typescript
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('view_name')
    .select('*')

  if (error) throw error
  return data
}
```

### Mutation Template

```typescript
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type DataInsert = Database['schema']['Tables']['table']['Insert']

export async function createData(data: DataInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: result, error } = await supabase
    .schema('schema')
    .from('table')
    .insert(data)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/path')
  return result
}
```

---

## Support & References

### Documentation
- CLAUDE.md - Development guidelines
- docs/rules/database.md - Database patterns
- Supabase docs - Official documentation

### Tools
- `pnpm db:types` - Regenerate database types
- `pnpm typecheck` - Type checking
- Supabase dashboard - Schema inspection

### Contacts
- For database questions: Review CLAUDE.md
- For schema changes: Use Supabase dashboard
- For type issues: Run `pnpm db:types`

---

## Changelog

| Date | Change |
|------|--------|
| 2025-11-02 | Initial guidelines created |

---

**Document Version:** 1.0
**Last Updated:** 2025-11-02
**Next Review:** 2026-02-02
