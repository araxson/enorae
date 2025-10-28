
**Core Principle:** Database is source of truth—code must conform to database, never the reverse.

**Mission:**
1. Read database schema using Supabase MCP (READ-ONLY) and focus on one portal
2. Find ALL mismatches between database and code
4. Fix mismatches by aligning code to database

**CRITICAL RULES:**
- ❌ NEVER edit database schema
- ❌ NEVER edit `lib/types/database.types.ts`
- ❌ NEVER use mock data
- ❌ NEVER create extra markdown docs
- ✅ Use Supabase MCP to READ database only
- ✅ Ask user before deleting features

---

## Step 1: Scan Database

Use Supabase MCP to discover:
```
mcp__supabase__list_tables - Get all tables/views from all schemas
mcp__supabase__generate_typescript_types - Get current types
```

Extract from each schema:
- Tables and views (especially `*_view` public views)
- RPC functions
- Column names and types

---

## Step 2: Scan Codebase

Find database access:
```bash
find app -name "page.tsx" -type f
find features -name "queries.ts" -o -name "mutations.ts"
```

---

## Step 3: Identify Mismatches

### Type A: Schema Mismatches (CRITICAL - breaks app)
1. **Non-existent tables/views** - `.from('table')` but table doesn't exist
2. **Non-existent columns** - `row.column` but column doesn't exist
3. **Non-existent RPCs** - `.rpc('func')` but RPC doesn't exist
4. **Type mismatches** - Types don't match database schema
5. **Invalid schemas** - `.schema('name')` but schema doesn't exist
6. **Wrong SELECTs** - Selecting columns that don't exist

### Type B: Feature Gaps (code doesn't implement what database supports)
1. **LIST** - Missing index/dashboard page
2. **SHOW** - Missing detail page
3. **CREATE** - Missing create form/mutation
4. **UPDATE** - Missing edit form/mutation
5. **DELETE** - Missing delete action

---


## Step 4: Fix Mismatches

### PHASE 1: Fix Schema Mismatches (Type A)

### PHASE 2: Implement Features (Type B)

For each CRITICAL/HIGH gap:

**1. Implementation checklist:**
- [ ] Verify table/view exists (Supabase MCP)
- [ ] Verify all columns exist (Supabase MCP)
- [ ] `queries.ts` has `'server-only'`
- [ ] `mutations.ts` has `'use server'`
- [ ] Auth checks in all queries/mutations
- [ ] Use public views for reads
- [ ] Use schema tables for writes
- [ ] Zod validation schemas
- [ ] `revalidatePath()` after mutations
- [ ] shadcn/ui components only
- [ ] Pages are thin shells
- [ ] No `any` types
- [ ] No mock data
- [ ] No extra markdown files

**3. Test and verify:**
- Run `npm run typecheck`
- Test CRUD operations
- Update gap report with ✅

---

## Success Criteria

**Audit Complete:**
- ✅ Database scanned (Supabase MCP)
- ✅ Code scanned

**Fix Complete:**
- ✅ All schema mismatches fixed
- ✅ All CRITICAL gaps implemented
- ✅ All HIGH gaps implemented
- ✅ Zero TypeScript errors
- ✅ No mock data
- ✅ No extra markdown files
- ✅ Database never edited
- ✅ Code 100% aligned with database
