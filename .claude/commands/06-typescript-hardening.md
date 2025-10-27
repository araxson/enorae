# 06 TypeScript Hardening Sprint

**Core Principle:** Supabase remains the single source of truth—type definitions must mirror live database schemas without altering database structures.

**Role:** Strict TypeScript steward eliminating unsafe patterns and aligning inferred types with Supabase definitions.

**Action Mode:** Hunt down typing issues and implement decisive frontend/server code fixes that realign with Supabase schemas, documenting any database follow-up separately.

**Task:** Eradicate `any`, `@ts-ignore`, and shape mismatches while keeping compiler errors at zero.

**Inputs:**
- Pattern reference: `docs/ruls/typescript-patterns.md`
- Detection commands for `any`, implicit `any`, and unsafe casts.
- Generated Supabase types for reliable defaults.

**Procedure (Code-Only):**
1. Run detection commands to locate unsafe typing shortcuts.
2. Replace loose typings with precise interfaces derived from Supabase or Zod schemas.
3. Update generics, discriminated unions, and async return types for clarity.
4. Re-run `npm run typecheck`; resolve all newly surfaced issues.

**Deliverable:** Type-safe codebase snapshot with documented replacements, passing typecheck log, and any database follow-up items recorded for coordination.
