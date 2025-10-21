# Database Schema Sync Command

## Overview

This command file (`database-schema-sync.md`) provides a complete workflow to align the ENORAE codebase with the actual Supabase database schema.

**Key Principle:** The database is the source of truth. All code must match the database, not the other way around.

## Usage

### As a Claude Code Command

```bash
/database-schema-sync
```

This will expand the prompt and guide you through:
1. Reading the actual database schema from Supabase
2. Identifying all code mismatches
3. Systematically fixing code to match database
4. Verifying all fixes

### Manual Usage

You can also reference the full prompt at:
```
.claude/commands/database-schema-sync.md
```

## What This Command Does

### Phase 1: Database Analysis
- Uses **Supabase MCP tools** (READ-ONLY) to fetch actual schema
- Lists all tables and views across all schemas
- Documents actual column names and types
- Identifies what code expects vs what database provides

### Phase 2: Code Fixes
- Provides 5 core rules for fixing code to match database
- Shows patterns for common mismatches:
  - Missing fields in views → Fetch separately or compute
  - Wrong column names → Use correct names from schema
  - RPC functions don't exist → Implement in TypeScript
  - Type mismatches → Handle transformations in code
  - Array/string mismatches → Normalize in application

### Phase 3: Systematic Codebase Updates
- Provides workflow for each mismatch
- Prioritizes files with most errors
- Guides transformation layer creation
- Ensures no regressions

### Phase 4: Verification
- TypeScript checking
- Type regeneration
- Regression testing

## Key Rules

### ✅ DO:
- Read database schema with Supabase MCP
- Update code to match database
- Create transformation layers in TypeScript
- Add proper type guards
- Test with actual queries

### ❌ DON'T:
- Edit the Supabase database
- Assume properties exist
- Create non-existent RPC functions
- Leave type errors unresolved
- Use `any` or type suppressions

## Example: Fixing a Mismatch

### Current Problem
```ts
// Error: Property 'amenities' does not exist on type 'Salon'
const amenities = salon.amenities
```

### Step 1: Check Database
Use Supabase MCP to see what the `salons` view actually contains - it probably doesn't have `amenities`

### Step 2: Find Where Data Actually Is
- Maybe it's a separate table: `salon_amenities`
- Maybe it's computed from descriptions
- Maybe it doesn't exist at all

### Step 3: Fix Code
```ts
// Option A: Fetch from separate table
const amenities = await db
  .from('salon_amenities')
  .select('name')
  .eq('salon_id', salon.id)

// Option B: Compute in TypeScript
const amenities = parseAmenitiesFromDescription(salon.description)

// Option C: Create extended type
type ExtendedSalon = Salon & {
  amenities?: string[] // Add as optional computed field
}
```

## Files with Most Mismatches

Priority order (highest error count first):
1. `features/customer/discovery/components/salon-description.tsx` (40 errors)
2. `features/customer/salon-detail/components/salon-header.tsx` (27 errors)
3. `features/business/reviews/components/reviews-list/review-card.tsx` (21 errors)
4. Query files in `features/*/api/queries.ts`
5. Mutation files in `features/*/api/mutations.ts`

## Next Steps

1. **Run the command:**
   ```bash
   /database-schema-sync
   ```

2. **Follow Phase 1:** Read the actual database schema using Supabase MCP

3. **Follow Phase 2:** Understand the core rules for fixing code

4. **Focus on high-priority files:** Start with components that have most errors

5. **Test systematically:** Run `npm run typecheck` after each batch of fixes

## Expected Outcomes

After using this command:
- ✅ 0 TypeScript errors from database type mismatches
- ✅ Code accurately reflects database schema
- ✅ Proper transformation layers for computed fields
- ✅ Database is single source of truth
- ✅ Maintainable, type-safe codebase

## Notes

- This command uses **READ-ONLY** Supabase operations
- Never modifies the database
- Only edits TypeScript code files
- Preserves all business logic
- Maintains test coverage
