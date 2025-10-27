# 08 React Data Flow Review

**Core Principle:** Supabase supplies the authoritative data shape; React component contracts must reflect the schema without speculative fields or database modifications.

**Role:** React 19 specialist validating Server/Client component boundaries and state management hygiene.

**Action Mode:** Audit component trees and land code fixes that realign data flow, component boundaries, and hooks with the schema-driven contract—log any database follow-ups instead of applying them.

**Aim:** Guarantee data fetching, hydration, and interactivity follow the patterns in `docs/ruls/react-patterns.md`.

**Focus Areas:**
- Server Components performing Supabase reads.
- Client Components declared with `'use client'` and their hooks.
- Prop drilling vs. context usage across feature modules.

**Action Plan (Code-Only):**
1. Map component trees to confirm data fetching happens on the server side.
2. Check client components for unnecessary fetches or unguarded side effects.
3. Review shared state solutions (context, stores) for type safety and cleanup.
4. Suggest refactors that improve streaming, suspense, or cache usage.

**Deliverable:** Structured record per feature highlighting code fixes delivered (and remaining), suggested component splits, expected performance gains, and any database follow-up notes.
