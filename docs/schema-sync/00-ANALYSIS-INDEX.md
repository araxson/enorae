# Database Schema Analysis - Navigation Index

**Analysis Date:** 2025-10-25
**Analysis Type:** Comprehensive TypeScript Code vs. Supabase Schema Mismatch Analysis
**Status:** Complete

---

## Executive Summary

This analysis identifies critical mismatches between ENORAE TypeScript code and the actual Supabase database schema. The database schema contains 22 distinct schemas with hundreds of tables and views, but the TypeScript code contains numerous references to views and tables that:

1. **Do not exist** in the specified schema
2. **Exist in different schemas** (schema mismatch)
3. **Have missing or incorrect columns** (column name/type mismatches)
4. **Call non-existent RPC functions**
5. **Use incorrect select statements**

**Critical Finding:** The code frequently queries tables/views without specifying the correct schema, causing TypeScript compilation errors and potential runtime failures.

---

## Database Schema Structure

The ENORAE Supabase database is organized into 22 schemas:

| # | Schema | Purpose |
|---|--------|---------|
| 1 | `admin` | Admin tools and monitoring |
| 2 | `analytics` | Platform and business analytics |
| 3 | `archive` | Archived data storage |
| 4 | `audit` | Audit logging and compliance |
| 5 | `billing` | Payment and billing management |
| 6 | `cache` | Caching layer |
| 7 | `catalog` | Products, services, pricing |
| 8 | `communication` | Messages and notifications |
| 9 | `compliance` | Compliance and legal |
| 10 | `engagement` | Marketing and engagement |
| 11 | `graphql_public` | GraphQL API |
| 12 | `identity` | Users, profiles, authentication |
| 13 | `integration` | Third-party integrations |
| 14 | `monitoring` | System monitoring |
| 15 | `organization` | Organizations and tenants |
| 16 | `patterns` | Design patterns storage |
| 17 | `public` | Public-facing data |
| 18 | `scheduling` | Appointments and scheduling |
| 19 | `security` | Security and access control |
| 20 | `utility` | Utility functions |
| 21 | `graphql_public` | GraphQL public schema |
| 22 | (default public) | Default public schema |

---

## Quick Navigation

| Report | Issues | Priority | Status |
|--------|--------|----------|--------|
| [01-schema-overview.md](01-schema-overview.md) | Reference | - | Complete |
| [02-mismatch-summary.md](02-mismatch-summary.md) | 150+ | Overview | Complete |
| [03-missing-properties.md](03-missing-properties.md) | 45+ | High | Complete |
| [04-wrong-column-names.md](04-wrong-column-names.md) | 38+ | High | Complete |
| [05-type-mismatches.md](05-type-mismatches.md) | 32+ | Medium | Complete |
| [06-nonexistent-rpcs.md](06-nonexistent-rpcs.md) | 8+ | Critical | Complete |
| [07-nonexistent-tables.md](07-nonexistent-tables.md) | 12+ | Critical | Complete |
| [08-incorrect-selects.md](08-incorrect-selects.md) | 15+ | High | Complete |
| [09-fix-priority.md](09-fix-priority.md) | All | Action Plan | Complete |

---

## Key Findings

### Critical Issues (Must Fix)

1. **Schema Mismatch (Most Common)**
   - Code queries `audit_logs_view` without schema prefix
   - Should be: `.schema('audit').from('audit_logs_view')`
   - **Impact:** Causes TS2769 "No overload matches" errors across multiple files

2. **Missing Views/Tables (12 instances)**
   - Code references views that don't exist in specified schema
   - Examples: `audit_logs_view`, `salon_reviews_with_counts_view`
   - **Impact:** Runtime query failures

3. **Non-Existent RPC Functions (8 instances)**
   - Code calls RPC functions that don't exist in database
   - Example: `create_index_on_column` (used but not defined)
   - **Impact:** RPC call failures at runtime

### High Priority Issues

4. **Missing Columns (45 instances)**
   - Code accesses properties that don't exist on queried rows
   - Example: `user_id` on view when column doesn't exist
   - **Impact:** Runtime property access errors

5. **Wrong Column Names (38 instances)**
   - Code uses incorrect column names
   - Example: `activeThreads` when database has `archived_threads`
   - **Impact:** Type safety failures, incorrect data access

### Medium Priority Issues

6. **Type Mismatches (32 instances)**
   - Code expects different types than database provides
   - Example: `string[]` vs `string`, `number` vs `string | null`
   - **Impact:** Type casting errors, potential data handling bugs

---

## Issues by Severity

| Severity | Count | Category | Examples |
|----------|-------|----------|----------|
| Critical | 20 | Schema mismatches, missing tables, non-existent RPCs | audit_logs_view, create_index_on_column |
| High | 83 | Missing properties, wrong column names | user_id, activeThreads, compression_type |
| Medium | 32 | Type mismatches, incorrect select statements | string vs string[], number vs number\|null |
| Low | 15 | Null handling, optional property issues | nullable types, undefined checks |
| **TOTAL** | **150+** | | |

---

## Files Most Affected

| File | Error Count | Severity |
|------|-------------|----------|
| features/admin/moderation/api/queries.ts | 12 | Critical/High |
| features/admin/dashboard/api/queries.ts | 8 | Critical/High |
| features/admin/profile/api/queries.ts | 7 | Critical/High |
| features/admin/roles/api/queries.ts | 6 | High |
| features/admin/database-performance/api/ | 5 | Critical |
| features/admin/messages/api/ | 4 | High |
| features/business/notifications/api/ | 3 | Medium |
| features/customer/dashboard/api/ | 3 | Medium |
| (and 40+ more files) | 100+ | Various |

---

## Task Progress

**Total Tasks:** 150+
**Completed:** 0
**Remaining:** 150+

Each report (03-08) contains detailed task lists with [ ] checkboxes. Use the [database-schema-fixer](../../.claude/agents/database-schema-fixer.md) agent to track completion.

---

## Analysis Methodology

This analysis uses a multi-phase approach:

**Phase 1: Schema Discovery**
- Read actual Supabase database schema from `lib/types/database.types.ts`
- Documented all 22 schemas with tables, views, and functions
- Extracted canonical type definitions

**Phase 2: Code Analysis**
- Ran `npm run typecheck` to capture TypeScript compilation errors
- Searched codebase for `.from()` calls (327 files analyzed)
- Searched codebase for `.rpc()` calls (13 files with RPC usage)
- Analyzed property accesses and type references

**Phase 3: Gap Analysis**
- Compared code references against actual schema
- Categorized issues into 6 categories (A-F)
- Identified schema mismatches as primary root cause
- Classified severity levels

**Phase 4: Report Generation**
- Generated 9 detailed reports
- Created task lists with [ ] checkboxes
- Documented file paths and line numbers
- Provided fix recommendations

---

## Root Causes Analysis

### Primary Issue: Schema Mismatch

The majority of errors stem from **schema-qualified queries without proper schema prefix**. Example:

**Current (Broken):**
```typescript
await supabase.from('audit_logs_view').select('*')
// Error: Can't find audit_logs_view in public schema
```

**Correct (Fixed):**
```typescript
await supabase.schema('audit').from('audit_logs_view').select('*')
// Success: Query uses correct schema
```

### Secondary Issue: Column Name Errors

Properties are accessed that don't exist on the queried view:

**Current (Broken):**
```typescript
const data = await supabase.from('salon_reviews_view').select('amenities')
// amenities column doesn't exist
```

**Correct (Fixed):**
```typescript
const data = await supabase.from('salon_reviews_view').select('*')
// Use actual columns that exist
```

### Tertiary Issue: Non-Existent RPC Functions

Code calls RPC functions not defined in database:

**Current (Broken):**
```typescript
await supabase.rpc('create_index_on_column', { ... })
// Function doesn't exist in database
```

**Correct (Fixed):**
```typescript
// Use actual RPC function or implement via SQL migration
await supabase.rpc('existing_rpc_function', { ... })
```

---

## How to Use These Reports

### For Developers

1. **Start with:** [02-mismatch-summary.md](02-mismatch-summary.md) - Overview of all issues
2. **Find your file:** Check which report has errors in your code
3. **Read category report:** (03-08) for detailed issue description
4. **View task:** [ ] checkbox with specific line number and fix
5. **Check priority:** [09-fix-priority.md](09-fix-priority.md) for recommended fix order

### For Code Review

1. **Reference:** [01-schema-overview.md](01-schema-overview.md) - Source of truth for schema
2. **Validate:** Check that code uses correct schema names
3. **Verify:** Ensure all `.from()` calls specify proper schema
4. **Audit:** Confirm RPC functions exist in database

### For Project Management

1. **Count issues:** [02-mismatch-summary.md](02-mismatch-summary.md) - Total issue count
2. **Estimate effort:** [09-fix-priority.md](09-fix-priority.md) - Fix time estimates
3. **Track progress:** Use task lists and [ ] checkboxes
4. **Monitor completion:** Update reports as fixes are applied

---

## Next Steps

### Immediate Actions

1. Review [02-mismatch-summary.md](02-mismatch-summary.md) for high-level overview
2. Check [09-fix-priority.md](09-fix-priority.md) for recommended fix order
3. Read [01-schema-overview.md](01-schema-overview.md) for schema reference

### Systematic Fixes

Use the [database-schema-fixer](../../.claude/agents/database-schema-fixer.md) agent to:
- Apply fixes systematically by category
- Update task lists with [x] as fixes complete
- Run `npm run typecheck` after each batch
- Verify no regressions introduced

### Recommended Fix Order

1. **Critical:** Non-existent tables/views (Block all queries)
2. **Critical:** Non-existent RPC functions (Block RPC calls)
3. **Critical:** Schema mismatches (Most common issue)
4. **High:** Missing columns/properties (Type safety)
5. **High:** Wrong column names (Data access)
6. **Medium:** Type mismatches (Type safety)
7. **Low:** Null handling (Edge cases)

---

## Verification Checklist

Before considering schema sync complete:

- [ ] All 150+ issues have been addressed
- [ ] `npm run typecheck` passes with 0 errors
- [ ] All task lists show [x] for completed items
- [ ] All `.from()` queries specify correct schema
- [ ] All RPC calls reference existing functions
- [ ] All property accesses match database columns
- [ ] Code passes unit and integration tests
- [ ] Database migrations are deployed

---

## Contact & Support

For questions about these reports:

- **Schema Reference:** See [01-schema-overview.md](01-schema-overview.md)
- **Specific Issues:** See category reports [03-08]
- **Fix Recommendations:** See [09-fix-priority.md](09-fix-priority.md)
- **Implementation Help:** Contact database-schema-fixer agent

---

**Report Generated:** 2025-10-25
**Analysis Tool:** TypeScript + Supabase MCP
**Database Version:** Supabase PostgreSQL 13.0.5
**Maintainer:** Development Team
