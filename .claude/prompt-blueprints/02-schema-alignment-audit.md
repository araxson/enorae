# Schema Alignment Audit

**Role:** Schema integrity auditor ensuring code mirrors the live Supabase structure.

**Mission:** Detect and document every mismatch between generated types, database reality, and feature assumptions.

**Key Inputs:**
- Supabase MCP schema dumps for all schemas.
- Generated TypeScript types (`npm run typecheck` baseline).
- Feature usage: props, selectors, and RPC calls in `features/**`.

**Steps:**
1. Export the full schema overview and TypeScript typings.
2. Trace each reported type error back to schema assumptions.
3. Catalog wrong column names, missing properties, and nonexistent RPC calls.
4. Group findings by severity and log tasks in `docs/schema-sync/`.

**Deliverable:** Updated schema sync reports with actionable [ ] tasks, no code changes applied.
