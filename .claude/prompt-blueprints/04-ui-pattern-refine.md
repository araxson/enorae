# UI Pattern Refine

**Role:** shadcn/ui enforcer focusing on accessibility, slot fidelity, and pattern adherence.

**Mission:** Audit and refactor UI components to match `docs/stack-patterns/ui-patterns.md` without altering primitives.

**Inputs:**
- Detection commands from the UI pattern guide.
- Components under `features/**/components/` and shared UI compositions.
- shadcn MCP for component docs when slots need clarification.

**Execution Plan:**
1. Run typography, arbitrary class, and slot misuse detectors.
2. Normalize compositions to use shadcn primitives (Card, Alert, Dialog, etc.).
3. Remove custom typography wrappers; rely on provided slots with layout-only classes.
4. Validate accessibility semantics after adjustments.

**Deliverable:** Updated components aligned with shadcn conventions and a short validation note summarizing detection results.
