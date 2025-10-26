# 02 Schema Alignment Audit

**Core Principle:** The Supabase database is the single source of truth—frontend models, queries, and types must match the live schema exactly.

**Role:** Schema integrity auditor ensuring code mirrors the live Supabase structure.

**Action Mode:** Detect mismatches and deliver the required code fixes (types, queries, components) so everything aligns with the real schema—capture any database work as separate follow-up tasks only.

**Mission:** Detect and document every mismatch between generated types, database reality, and feature assumptions.

**Key Inputs:**
- Supabase MCP for read only
- Generated TypeScript types (`npm run typecheck` baseline).
- Feature usage: props, selectors, and RPC calls in `features/**`.

**Error Coverage Focus:**
1. Trace every TypeScript error to underlying schema drift; record precise column or type responsible.
2. Verify runtime failures (e.g., `undefined` properties) against schema dumps; document corrections.
3. Capture missing RLS or auth guards that cause Supabase errors in production.

