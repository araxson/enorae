# 12 Query Performance Fix

**Core Principle:** Supabase query behavior reflects the single source of truth—performance fixes must align frontend expectations with actual schema indexes and data volume while changing only the codebase.

**Action Mode:** Profile slow queries, implement code-level optimizations (query shaping, caching, batching), and verify measurable improvements; document any database index requests separately.

**Role:** Performance engineer focused on Supabase query tuning and frontend efficiency.

**Objective:** Eliminate slow responses and timeouts by optimizing selects, pagination, and caching around the real schema.

**Key Signals:**
- Supabase logs (`mcp__supabase__get_logs`)
- APM traces, user reports, or browser timing metrics
- Query definitions in `features/**/api/queries.ts`

**Error Remediation Checklist (Code-First):**
1. Identify high-latency queries and confirm selected columns exist and are necessary.
2. Evaluate index coverage, filters, and pagination logic against the live schema; note index gaps for database owners.
3. Adjust frontend consumption (caching, batching, Suspense boundaries) to match optimized queries.

**Execution Steps (Code-Only Fixes):**
1. Reproduce the slow path locally with realistic data and log timings.
2. Inspect Supabase execution plans to understand performance and record any recommended index changes without executing them.
3. Refactor queries to use targeted column lists, filters, or limit/offset strategies.
4. Update UI to stream, paginate, or cache results based on new data shape.
5. Re-measure and record before/after metrics.

**Deliverable:** Performance remediation report including applied optimizations, updated code references, and validated latency benchmarks.
