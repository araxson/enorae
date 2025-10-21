# Database Schema Sync Fix

**Role:** You are a TypeScript database synchronization specialist. Your mission is to align the ENORAE codebase with the actual Supabase database schema. The database is the source of truth - all code must match it.

**IMPORTANT:** You will READ the database schema using Supabase MCP tools. You will NOT edit the database. You will ONLY edit the code.

---

## Phase 1: Database Schema Analysis

### Step 1: Fetch Actual Database Schema

Use Supabase MCP to read the ACTUAL database structure:

```bash
# List all tables in all schemas
mcp__supabase__list_tables(project_id: "nwmcpfioxerzodvbjigw", schemas: ["public", "catalog", "scheduling", "inventory", "identity", "communication", "analytics", "engagement", "organisation"])

# Get generated TypeScript types
mcp__supabase__generate_typescript_types(project_id: "nwmcpfioxerzodvbjigw")
```

### Step 2: Document Actual Schema

For each schema and table/view, document:
- **Actual columns** (from Supabase)
- **Column types** (actual, not assumed)
- **What code expects** (from TypeScript errors)
- **Gap analysis** (what's missing/wrong)

### Step 3: Find All Code Mismatches

Scan codebase for:
- Properties accessed that don't exist in database
- Database columns not used in code
- Type mismatches
- RPC function calls with wrong parameters
- Query selections that don't match view structure

---

## Phase 2: Code Fixes (Database is Ground Truth)

### Rule 1: Database View Properties Are Sacred
```ts
// ❌ WRONG - Assuming property exists
const amenities = salon.amenities // Property doesn't exist!

// ✅ CORRECT - Use what database actually provides
const amenities = salon.special_features || salon.tags // Use real columns
```

### Rule 2: Only Select Available Columns
```ts
// ❌ WRONG - Selecting columns that don't exist
.select('amenities, specialties, staff_count')

// ✅ CORRECT - Select only what view actually has
.select('*') // or explicitly list real columns from schema
```

### Rule 3: Transform at Application Level
```ts
// ✅ CORRECT - Add computed fields in TypeScript, not database
const extendedSalon = {
  ...dbSalon,
  services_count: calculateServicesCount(dbSalon.id),
  specialties: parseSpecialtiesFromDescription(dbSalon.description),
}
```

### Rule 4: RPC Functions Must Exist
```ts
// ❌ WRONG - Calling RPC that doesn't exist
.rpc('validate_coupon', { p_code, p_salon_id })

// ✅ CORRECT - Only call RPC functions that exist in database
// First verify RPC exists, then call with correct parameters
```

### Rule 5: Match Query Return Types Exactly
```ts
// ❌ WRONG - Assuming more fields than query returns
interface Salon {
  id: string
  amenities: string[] // Doesn't come from query!
}

// ✅ CORRECT - Match actual query response
type Salon = Database['public']['Views']['salons']['Row']
// With optional extended fields only if they're computed
type ExtendedSalon = Salon & {
  computed_amenities?: string[]
}
```

---

## Phase 3: Systematic Codebase Fixes

### Workflow for Each Mismatch:

1. **Identify the error**
   - File with type error
   - Property that doesn't exist
   - Expected type vs actual type

2. **Check database**
   - Does property exist? (Use Supabase schema)
   - What is the actual column name?
   - What is the actual type?

3. **Fix the code** (NEVER change database)
   - Option A: Use different column that exists
   - Option B: Remove the property access
   - Option C: Compute the value in TypeScript
   - Option D: Fetch from related table

4. **Update types**
   - Regenerate types from actual schema
   - Update component interfaces
   - Add proper type guards

### Common Patterns to Fix:

#### Pattern 1: Missing Fields in Views
**Problem:** Code expects `staff_count`, `amenities`, `specialties` on salons view
**Solution:** These should be fetched separately or computed:
```ts
// Instead of:
const salons = await db.from('salons').select('*, staff_count, amenities')

// Do:
const salons = await db.from('salons').select('*')
const staffCounts = await db.from('staff').select('salon_id, count(*)')
// Merge in application code
```

#### Pattern 2: Wrong Column Names
**Problem:** Code uses `salon_id`, database has `id`
**Solution:** Use correct column names from schema:
```ts
.eq('id', salonId) // Correct column name from schema
```

#### Pattern 3: RPC Functions Don't Exist
**Problem:** Code calls `.rpc('validate_coupon', {...})`
**Solution:** Implement logic in TypeScript or verify RPC exists:
```ts
// If RPC doesn't exist, implement in code
export async function validateCoupon(code: string) {
  const { data } = await db
    .from('coupons')
    .select('*')
    .eq('code', code)
  return data && isValid(data)
}
```

#### Pattern 4: Type Mismatch on Array/String
**Problem:** Code expects `string[]` but database returns `string`
**Solution:** Handle both or transform:
```ts
const serviceNames = typeof data.service_names === 'string'
  ? data.service_names.split(',')
  : data.service_names || []
```

---

## Phase 4: Verification

After each batch of fixes:

1. **Run typecheck**
   ```bash
   npm run typecheck
   ```
   Verify error count decreases

2. **Update generated types** (if schema was recently updated)
   ```bash
   mcp__supabase__generate_typescript_types()
   ```

3. **Verify no regressions**
   - Components still render
   - API queries still work
   - No new errors introduced

---

## Critical Instructions

### DO:
- ✅ Use Supabase MCP to READ schema
- ✅ Update code to match database
- ✅ Create transformation layers in TypeScript
- ✅ Add proper type guards
- ✅ Document assumptions about data structure
- ✅ Test changes with actual queries

### DON'T:
- ❌ Modify the Supabase database
- ❌ Assume properties exist without checking schema
- ❌ Create RPC functions that don't exist
- ❌ Leave type errors unresolved
- ❌ Use `any` or type suppressions
- ❌ Ignore schema mismatches

---

## Files to Focus On (Priority Order)

These files have the most mismatches with database:

1. **View-related components** (salon details, reviews, etc.)
   - features/customer/discovery/components/salon-description.tsx (40 errors)
   - features/customer/salon-detail/components/salon-header.tsx (27 errors)
   - features/business/reviews/components/reviews-list/review-card.tsx (21 errors)

2. **Query files** (data fetching)
   - features/customer/salon-search/api/queries.ts
   - features/business/coupons/api/coupons.mutations.ts
   - features/staff/commission/api/queries/

3. **Mutation files** (data modification)
   - features/shared/notifications/api/mutations.ts
   - features/shared/blocked-times/api/mutations/
   - features/staff/blocked-times/api/mutations.ts

---

## Expected Outcome

- ✅ All TypeScript errors resolved
- ✅ Code types match actual database schema
- ✅ No `any` types or suppressions
- ✅ Proper transformation layers for computed fields
- ✅ Database is source of truth
- ✅ Code is maintainable and type-safe

**Start by reading the database schema. Then systematically fix code to match it. Never edit database.**
