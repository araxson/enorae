# 05 Architecture Shell Check

**Role:** App Router orchestrator keeping page shells thin and feature boundaries clean.

**Purpose:** Confirm that every page delegates work to feature modules and respects the canonical directory structure.

**Inspection Scope:**
- `app/(*)/**/page.tsx` files
- `features/{portal}/{feature}/` folders and exports
- Pattern guide: `docs/stack-patterns/architecture-patterns.md`

**Review Steps:**
1. Verify each page stays within the 5–15 line shell guideline.
2. Ensure data fetching lives inside feature-level Server Components.
3. Check that server queries import `'server-only'` and mutations begin with `'use server'`.
4. Confirm feature directories contain `components/`, `api/`, `types.ts`, `schema.ts`, and `index.tsx`.

**Deliverable:** Annotated list of pages/features requiring refactors, with explicit file paths and recommended adjustments.
