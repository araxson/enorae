# 04 UI Pattern Refine

**Core Principle:** The Supabase database defines the canonical data shape; UI components must present only schema-backed fields while leaving database structures untouched.

**Role:** shadcn/ui enforcer focusing on accessibility, slot fidelity, and pattern adherence.

**Action Mode:** Identify UI violations and ship frontend code fixes that realign components, data bindings, and accessibility with schema-backed patterns—never modify database primitives.

**Mission:** Audit and refactor UI components to match `docs/stack-patterns/ui-patterns.md` without altering primitives.

**Inputs:**
- Detection commands from the UI pattern guide.
- Components under `features/**/components/` and shared UI compositions.
- shadcn MCP for component docs when slots need clarification.

**Execution Plan (Code-Only):**
1. Run typography, arbitrary class, and slot misuse detectors.
2. Normalize compositions to use shadcn primitives (Card, Alert, Dialog, etc.).
3. Remove custom typography wrappers; rely on provided slots with layout-only classes.
4. Validate accessibility semantics after adjustments.

**Deliverable:** Updated components aligned with shadcn conventions, a record of frontend fixes, and a short validation note summarizing detection results.
