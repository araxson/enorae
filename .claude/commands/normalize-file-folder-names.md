# Normalize File & Folder Names (Complete Pass)

## Objective
Detect every file or directory whose name violates repo conventions (casing, redundancy, ambiguity) and fully complete the rename cycle so the codebase ends with consistent, best-practice naming without broken imports or routes.

## Guardrails
- Review `docs/rules/01-architecture.md` (plus relevant rule docs) before touching anything.
- NEVER edit `components/ui/*`, `app/globals.css`, or `lib/types/database.types.ts`.
- Preserve existing uncommitted work; do not revert or overwrite unrelated changes.
- Use `git mv` for renames so file history remains intact.

## What “Best Practice Naming” Means Here
- Folders/files: kebab-case (lowercase with dashes) unless Next.js reserves the filename (`page.tsx`, `layout.tsx`, `route.ts`, `default.tsx`, `template.tsx`, etc.).
- Avoid redundant words (`button-button.tsx` → `button.tsx`, `user-user-profile` → `user-profile`).
- Ensure directory index barrels remain `index.ts` and accurately re-export renamed modules.
- Keep names domain-focused and concise (e.g., `billing-summary-card.tsx`, not `card-component.tsx`).

## Reconnaissance
1. Inventory all directories and files, excluding tooling caches:
   - `find . -type d -not -path '*/\.*' -not -path './node_modules*' -not -path './.next*' -not -path './supabase/.branches*' | sort`
   - `find . -type f -not -path '*/\.*' -not -path './node_modules*' -not -path './.next*' -not -path './supabase/.branches*' | sort`
2. Flag items that break rules:
   - Non-kebab-case (`[A-Z]`, spaces, underscores).
   - Redundant suffixes/prefixes (`-component`, `Component.tsx`, double words).
   - Ambiguous or truncated names that hide intent.
3. Cross-check Next.js special files to confirm they remain in the right spot and naming.

## Build the Rename Backlog
1. Group findings by feature or domain so changes stay scoped.
2. For each rename candidate, record:
   - `currentPath`
   - `newPath` (kebab-case, descriptive, no redundancy)
   - Why the change is needed (e.g., `PascalCase`, `duplicate term`, `generic name`)
   - References that must be updated (imports, re-exports, tests, stories, config).
3. Confirm the plan obeys architecture boundaries (features vs. lib, index files per directory, etc.).

## Execute the Renames
1. Work feature-by-feature to avoid sprawling diffs.
2. Rename with `git mv currentPath newPath`.
3. Update all references using `rg 'old-name'` and adjust imports/exports, including barrel files and dynamic imports.
4. Update docs, stories, or scripts referencing the old paths.
5. When TypeScript path aliases are involved, ensure mappings still resolve.

## Validate the Completion
1. Run fast checks:
   - `pnpm lint`
   - `pnpm typecheck`
   - Targeted tests if the feature has coverage (`pnpm test --filter <feature>`).
2. Optionally run `pnpm dev` smoke test to confirm routes/build succeed.
3. Review `git status` and `git diff` to confirm only expected renames/updates exist.
4. Produce a rename report summarizing before → after paths and any follow-up notes.

## Final Output Expectations
- Deliver a list of all renames with reasoning and confirmation all references were updated.
- Call out any questionable names left untouched and why they remain pending.
- Suggest next steps if deeper refactors or follow-up tests are advisable.
