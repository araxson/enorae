# CRUD Audit & Fix Prompt

Use this prompt to audit and fix CRUD operations in your codebase.

---

## 🎯 Quick Prompt (Copy & Paste)

```
ULTRATHINK: Audit all CRUD operations for correctness.

1. Use Context7 MCP to read Supabase best practices
2. Use Supabase MCP to get my database schema (list_tables)
3. Analyze all **/actions/*.actions.ts files
4. Check:
   - CREATE: All required fields present, correct types
   - READ: Queries use correct fields from actual schema
   - UPDATE: Only updates existing fields
   - DELETE: Follows soft-delete pattern where appropriate
5. Verify:
   - Auth checks in every function
   - Ownership verification chains
   - Type safety (no 'any' types)
   - RLS-friendly explicit filters
6. Fix all issues found
7. Document findings in docs/CRUD_AUDIT_REPORT.md

DO NOT create tests. Fix issues directly.
```

---

## 📋 Detailed Prompt (For Complex Issues)

```
ULTRATHINK: Deep CRUD audit with database schema verification.

Context:
- Project: Next.js 15 + Supabase salon booking platform
- Database: 42 tables across 8 schemas
- Pattern: Ultra-thin pages, feature-based architecture

Tasks:
1. **Database Knowledge**
   - Use Supabase MCP: list_tables for schemas ['organization', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement']
   - Note actual table columns and types

2. **Best Practices**
   - Use Context7 MCP: search Supabase docs for:
     * Row Level Security patterns
     * Server-side queries
     * Type generation
     * Error handling

3. **CRUD Analysis**
   For each action file:
   - ✅ CREATE: Verify insert data matches table schema
   - ✅ READ: Check queries use actual column names
   - ✅ UPDATE: Verify updated fields exist
   - ✅ DELETE: Check soft-delete (deleted_at) vs hard-delete pattern

4. **Security Analysis**
   - Auth: Every function checks user
   - Ownership: Verifies user owns resource
   - UUID: Validates all IDs
   - RLS: Uses explicit filters (e.g., .eq('salon_id', salon.id))

5. **Fix Priority**
   - P0 (Critical): Core functionality broken
   - P1 (High): Security issues, data integrity
   - P2 (Medium): Inconsistencies, missing features
   - P3 (Low): Optimizations

6. **Deliverables**
   - Fix all P0 and P1 issues immediately
   - Document all findings in docs/CRUD_AUDIT_REPORT.md
   - List P2/P3 issues for future work
   - Verify TypeScript compilation passes

NO TESTS. Fix code directly. Use database.types.ts for type information.
```

---

## 🎨 Focused Prompts (Single Issues)

### Fix Specific Feature
```
Fix CRUD operations in features/[FEATURE_NAME]:
1. Use Supabase MCP to check [TABLE_NAME] schema
2. Use Context7 for Supabase best practices
3. Fix all type mismatches and missing fields
4. Verify auth and ownership checks
5. Test TypeScript compilation
```

### Schema Alignment
```
Align all action files with database schema:
1. Use Supabase MCP: list_tables for all schemas
2. Compare database.types.ts with actual code
3. Fix mismatched field names (e.g., description vs legal_name)
4. Remove references to non-existent fields
5. Verify with pnpm typecheck
```

### Security Audit
```
Security audit all CRUD operations:
1. Use Context7: read Supabase RLS best practices
2. Check every action file for:
   - getUser() auth check
   - Ownership verification (salon_id, user_id)
   - UUID validation
   - Explicit RLS filters
3. Fix any security gaps
4. Document findings
```

---

## 💡 Tips

1. **Always specify schemas**: `['organization', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement']`

2. **Reference the report**: If a previous audit exists, mention `docs/CRUD_AUDIT_REPORT.md`

3. **Be specific**: Instead of "fix everything", say "fix booking system service attachment"

4. **Trust the MCPs**: They have direct database access and latest docs

---

## 🔧 Example Usage

```
ULTRATHINK: Fix appointment booking system.

The booking creates appointments but doesn't attach services.
1. Use Supabase MCP to check 'appointments' and 'appointment_services' tables
2. Use Context7 for Supabase transaction patterns
3. Fix booking.actions.ts to create both records
4. Add rollback if service attachment fails
5. Verify TypeScript compiles
```

Result: Claude will analyze the issue, check the actual database schema, read best practices, and implement the fix with proper error handling.
