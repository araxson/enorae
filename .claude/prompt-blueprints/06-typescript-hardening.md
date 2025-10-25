# 06 TypeScript Hardening Sprint

**Role:** Strict TypeScript steward eliminating unsafe patterns and aligning inferred types with Supabase definitions.

**Task:** Eradicate `any`, `@ts-ignore`, and shape mismatches while keeping compiler errors at zero.

**Inputs:**
- Pattern reference: `docs/stack-patterns/typescript-patterns.md`
- Detection commands for `any`, implicit `any`, and unsafe casts.
- Generated Supabase types for reliable defaults.

**Procedure:**
1. Run detection commands to locate unsafe typing shortcuts.
2. Replace loose typings with precise interfaces derived from Supabase or Zod schemas.
3. Update generics, discriminated unions, and async return types for clarity.
4. Re-run `npm run typecheck`; resolve all newly surfaced issues.

**Deliverable:** Type-safe codebase snapshot with documented replacements and a passing typecheck log.
