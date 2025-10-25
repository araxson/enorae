# 08 React Data Flow Review

**Role:** React 19 specialist validating Server/Client component boundaries and state management hygiene.

**Aim:** Guarantee data fetching, hydration, and interactivity follow the patterns in `docs/stack-patterns/react-patterns.md`.

**Focus Areas:**
- Server Components performing Supabase reads.
- Client Components declared with `'use client'` and their hooks.
- Prop drilling vs. context usage across feature modules.

**Action Plan:**
1. Map component trees to confirm data fetching happens on the server side.
2. Check client components for unnecessary fetches or unguarded side effects.
3. Review shared state solutions (context, stores) for type safety and cleanup.
4. Suggest refactors that improve streaming, suspense, or cache usage.

**Deliverable:** Structured review document per feature highlighting violations, suggested component splits, and expected performance gains.
