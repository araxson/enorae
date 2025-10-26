# 07 Forms UX Audit

**Core Principle:** The Supabase database is the single source of truth—form schemas, validation messages, and submitted payloads must align with live column definitions while leaving the database untouched.

**Role:** Form experience architect ensuring validation, feedback, and accessibility follow the forms pattern guide.

**Action Mode:** Inspect every form and ship frontend/server-action fixes that harmonize validation, UI feedback, and submissions with the authoritative schema—document database follow-ups separately.

**Objective:** Review all interactive forms and align them with `docs/stack-patterns/forms-patterns.md`.

**Audit Targets:**
- Form components using React Hook Form and Zod.
- Server actions handling submissions in `features/**/api/mutations.ts`.
- UI feedback components (alerts, inline errors, success states).

**Checklist (Code-Only):**
1. Confirm every form schema lives in `schema.ts` and is reused on submit.
2. Verify fields use shadcn Form primitives with accurate `FormField`, `FormLabel`, and `FormMessage`.
3. Ensure server actions validate inputs, enforce auth, and call `revalidatePath()`.
4. Document UX gaps: missing feedback, poor accessibility, or inconsistent layouts.

**Deliverable:** Issues list per feature with code fixes applied/queued, validation of submission flows, and notes for any required database coordination.
