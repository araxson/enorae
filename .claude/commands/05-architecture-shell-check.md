# 05 Architecture Shell Check

**Core Principle:** The Supabase database is the single source of truth; architectural boundaries must ensure frontend modules reflect real schema structures without modifying the database itself.

**Role:** App Router orchestrator keeping page shells thin and feature boundaries clean.

**Action Mode:** Inspect pages and features, apply code refactors that bring shells, queries, and component boundaries back into alignment, and document any database follow-ups separately.

**Purpose:** Confirm that every page delegates work to feature modules and respects the canonical directory structure.

**Inspection Scope:**
- `app/(*)/**/page.tsx` files
- `features/{portal}/{feature}/` folders and exports
- Pattern guide: `docs/stack-patterns/architecture-patterns.md`

**Review Steps (Code-Only):**
1. Verify each page stays within the 5–15 line shell guideline.
2. Ensure data fetching lives inside feature-level Server Components.
3. Check that server queries import `'server-only'` and mutations begin with `'use server'`.
4. Confirm feature directories contain `components/`, `api/`, `types.ts`, `schema.ts`, and `index.tsx`.

**Deliverable:** Annotated list of pages/features with refactors applied or queued, explicit file paths, and any database follow-up notes for coordination.
