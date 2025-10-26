# 21 Lib Organization Fix

**Core Principle:** Supabase remains the single source of truth—refactoring shared utilities must preserve schema-aligned contracts while leaving the database untouched and never editing `lib/database.type.ts`.

**Action Mode:** Audit the `lib/` directory, consolidate duplicated utilities, standardize exports, and implement code-only fixes that improve structure, readability, and pattern compliance without touching `lib/database.type.ts`.

**Role:** Library curator ensuring shared helpers, clients, and utilities follow ENORAE patterns and stay in sync with Supabase-driven types.

**Objective:** Deliver a clean, discoverable `lib/` folder with well-scoped modules, consistent naming, and clear entry points that support portals and features.

**Safety Constraints:**
- Do **not** modify `lib/database.type.ts` under any circumstance.
- Preserve Supabase client initialization patterns and auth helpers.
- Document any required database follow-up separately (e.g., new views or functions) rather than implementing them.

**Scope & Targets:**
- Supabase clients, auth/session helpers, caching utilities.
- Shared config/constants, URL builders, formatting helpers.
- Root-level `lib/index.ts` or barrel files.

**Error Remediation Checklist (Code-Only):**
1. Locate circular dependencies, duplicate helpers, or outdated modules.
2. Ensure utilities reference real schema fields/types (leveraging generated types without editing them).
3. Align naming, folder structure, and export patterns with `docs/stack-patterns/file-organization-patterns.md`.

**Execution Steps (Code Fixes Only):**
1. Inventory current `lib/` modules and map their consumers.
2. Merge or split files to match feature boundaries and reduce coupling (except `database.type.ts`).
3. Update import paths across the codebase to reflect the new structure.
4. Add or update barrel files to expose public helpers consistently.
5. Run `npm run typecheck` to confirm all refactors stay aligned with Supabase types.

**Deliverable:** Library reorganization summary documenting code changes applied, updated export paths, untouched `lib/database.type.ts`, and any database follow-up notes for future coordination.
