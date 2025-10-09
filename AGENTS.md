# Repository Guidelines

## Project Structure & Module Organization
- Next.js app roots live under `app/` using route groups per portal. Each page stays thin (5–15 lines) and delegates to a feature module.
- Feature modules sit in `features/[portal]/[feature]/` using kebab-case names. Typical layout:
  ```
# Feature Module Pattern

Use this as a template when adding or refactoring feature modules under `features/`.

```text
features/
  [portal]/
    [feature]/
      index.tsx
      api/
        [feature].queries.ts
        [feature].mutations.ts
      components/
        [Feature]-client.tsx
        [Component].tsx
        [component-group]/
          index.ts
          [ComponentPart].tsx
      hooks/
        use-[hook].ts
      utils/
        [helper].ts
    shared/
      api/
        [shared-scope].queries.ts
        [shared-scope].mutations.ts
      components/
        [SharedComponent].tsx
      hooks/
        use-[shared-hook].ts
      utils/
        [shared-helper].ts
  shared/
    [domain]/
      index.tsx
      api/
        [domain].queries.ts
        [domain].mutations.ts
      components/
        [DomainComponent].tsx
      hooks/
        use-[domain-hook].ts
      utils/
        [domain-helper].ts
```

## File Size Guidelines

- Page entries (`index.tsx`): keep to 5–15 lines by delegating to feature components.
- Components and hooks: ≤200 lines; break out subcomponents or hooks when approaching the limit.
- Helpers in `utils/`: ≤150 lines; prefer small, focused utilities.
- Documentation files (like this one): ≤250 lines; split into additional docs if needed.

- Shared libraries live in `lib/`, helpers in `lib/utils` or `lib/cache`, and tests in `tests/`.

## Build, Test, and Development Commands
- `npm run dev` – start the Next.js dev server (Turbopack) with hot reload.
- `npm run build` – create a production build (fails on type/lint violations).
- `npm run lint` – run ESLint with project rules.
- `npm run typecheck` – run TypeScript in strict mode; must pass before shipping.
- `npm run test` – execute the test suite (Vitest/Jest depending on package configuration).

## Coding Style & Naming Conventions
- TypeScript/React with eslint-config-next and project-specific rules; Prettier formatting (spaces, 2-space indent).
- Always import Supabase types from `lib/types/database.types.ts` or the curated re-exports in `lib/types/app.types.ts`.
- No custom business entity types—“No database table = No feature.”
- File caps: components/hooks/DAL ≤200 lines, helpers ≤150 lines, docs ≤250 lines. Split files when approaching these boundaries.
- Reuse shadcn/ui components (`@/components/ui/*`) and layout primitives (`@/components/layout`); never re-create primitives.

## Testing Guidelines
- Vitest-based unit tests in `tests/` mirror the feature structure (`tests/[portal]/[feature].test.ts`).
- Name tests with the `.test.ts` suffix and use descriptive `describe/it` blocks.
- Run `npm run test` locally; aim to cover new logic and maintain existing coverage.

## Commit & Pull Request Guidelines
- Follow conventional, action-oriented commit subjects (e.g., `feat: add staff schedule mutations`, `fix: split stock level table`, `docs: update feature rules`).
- Each PR should include:
  - Summary of changes and affected feature(s)
  - Linked issue or ticket reference
  - Screenshots or CLI output when UI or tooling changes
  - Confirmation that `npm run typecheck` and relevant tests passed
- Never commit generated artifacts or local environment files. Use feature branches named `feature/<slug>` or `fix/<slug>`.

## Security & Configuration Tips
- `.env` values are managed via Supabase; never commit secrets.
- All DAL functions must start with `import 'server-only'`, enforce auth, and call the correct Supabase client (`createServiceRoleClient` or `createClient`).
