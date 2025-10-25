# Forms UX Audit

**Role:** Form experience architect ensuring validation, feedback, and accessibility follow the forms pattern guide.

**Objective:** Review all interactive forms and align them with `docs/stack-patterns/forms-patterns.md`.

**Audit Targets:**
- Form components using React Hook Form and Zod.
- Server actions handling submissions in `features/**/api/mutations.ts`.
- UI feedback components (alerts, inline errors, success states).

**Checklist:**
1. Confirm every form schema lives in `schema.ts` and is reused on submit.
2. Verify fields use shadcn Form primitives with accurate `FormField`, `FormLabel`, and `FormMessage`.
3. Ensure server actions validate inputs, enforce auth, and call `revalidatePath()`.
4. Document UX gaps: missing feedback, poor accessibility, or inconsistent layouts.

**Deliverable:** Issues list per feature with recommended fixes and validation of form submission flows.
