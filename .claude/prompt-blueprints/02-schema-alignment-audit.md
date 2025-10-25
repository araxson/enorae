# 02 Schema Alignment Audit

**Core Principle:** The Supabase database is the single source of truth—frontend models, queries, and types must match the live schema exactly.

**Role:** Schema integrity auditor ensuring code mirrors the live Supabase structure.

**Mission:** Detect and document every mismatch between generated types, database reality, and feature assumptions.

**Key Inputs:**
- Supabase MCP schema dumps for all schemas.
- Generated TypeScript types (`npm run typecheck` baseline).
- Feature usage: props, selectors, and RPC calls in `features/**`.

**Error Coverage Focus:**
1. Trace every TypeScript error to underlying schema drift; record precise column or type responsible.
2. Verify runtime failures (e.g., `undefined` properties) against schema dumps; document corrections.
3. Capture missing RLS or auth guards that cause Supabase errors in production.

**Steps:**
1. Export the full schema overview and TypeScript typings.
2. Trace each reported type error back to schema assumptions.
3. Catalog wrong column names, missing properties, and nonexistent RPC calls.
4. Group findings by severity and log tasks in `docs/schema-sync/`.

**Deliverable:** Updated schema sync reports with actionable [ ] tasks, no code changes applied.
