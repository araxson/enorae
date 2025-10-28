# 22 File Placement Fix

**Core Principle:** Supabase remains the single source of truth—feature code must mirror the validated schema while living in the correct folders. All fixes stay within the codebase; never modify the database.

**Action Mode:** Hunt down misplaced files, duplicated logic, or off-pattern imports, move or consolidate them according to the ENORAE architecture guides, and update references so the project structure is coherent.

**Role:** Repository organizer enforcing `docs/ruls/architecture-patterns.md` and related architecture conventions.

**Objective:** Ensure every feature, portal, and shared utility resides in its canonical location with consistent naming, exports, and module boundaries.

**Safety Constraints:**
- Do **not** touch `lib/database.type.ts`.
- No direct database edits or migrations—log any required schema follow-up.
- Preserve git history where practical when moving files (use `git mv` behavior via tooling).

**Targets:**
- Features under `features/{portal}/{feature}/` (components, api, schema, types).
- App router pages in `app/(portal)/`.
- Shared utilities (`lib/`, `components/`, `hooks/`, etc.).
- Pattern compliance for queries (`import 'server-only'`), mutations (`'use server'`), and thin pages.

**Tooling Prerequisite:**
1. Run `python scripts/generate_project_tree.py` to refresh `docs/project-tree-ai.json`.
2. Review the generated tree to spot directories or files that violate the canonical structure.

**Misplacement Detection Checklist (Code-Only):**
1. Compare `docs/project-tree-ai.json` against `docs/ruls/architecture-patterns.md`.
2. Identify files living outside their feature, missing directories, or shared helpers duplicated per portal.
3. Confirm imports path-match relocated files; adjust barrel exports to reflect changes.

**Execution Steps (Code Fixes Only):**
1. Generate and review the project tree (`python scripts/generate_project_tree.py`) to build the relocation plan.
2. Inventory suspicious files via `find`/`rg` against pattern expectations.
3. Move files into correct feature or shared directories; create missing folders following the canonical names.
4. Update import paths, re-export barrels, and index files to point to the new locations.
5. Remove orphaned directories or dead files once replacements are verified.
6. Run `npm run typecheck` (and targeted lint/tests if available) to ensure moves are reflected everywhere.

**Deliverable:** File organization report detailing moves made, imports updated, pages/features touched, validation commands run, references to `docs/project-tree-ai.json`, and any database follow-up notes for coordination.
