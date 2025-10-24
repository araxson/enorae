# Staff Portal - Validation Analysis

**Date**: 2025-10-23
**Portal**: Staff
**Layer**: Validation
**Files Analyzed**: 20
**Issues Found**: 1 (Critical: 0, High: 1, Medium: 0, Low: 0)

---

## Summary

- Located `schema.ts` files for each staff feature; several form workflows (blocked times, messages) rely on Zod schemas before invoking server actions.
- A number of modules, however, still export placeholder `z.object({})` definitions, providing zero validation coverage despite the Rule 2 requirement (“Validate inputs – Use Zod”).
- No localized error messaging beyond generic strings; where validation exists (e.g., `blockedTimeSchema`), constraints align with business rules (end time after start time, reason length ≤ 500).

---

## Issues

### High Priority

#### Issue #1: Placeholder schemas provide no validation
**Severity**: High  
**Files**:  
- `features/staff/time-off/schema.ts:3`  
- `features/staff/appointments/schema.ts:3`  
- `features/staff/clients/schema.ts:3` *(others may be unused but still exported)*
  
**Rule Violation**: Rule 2 – Inputs must be validated with Zod before hitting server actions.

**Current Code**:
```typescript
export const timeOffSchema = z.object({})
```

**Problem**:
- An empty Zod object accepts any payload, so downstream mutations receive unvalidated data (e.g., time-off requests, appointment updates, client actions).
- This contradicts the standardized form workflow in `docs/stack-patterns/forms-patterns.md`, and it undermines security (RLS cannot prevent malformed payloads).

**Required Fix**:
Define explicit schemas that mirror the form fields and database constraints, e.g.:
```typescript
export const timeOffSchema = z.object({
  start_at: z.coerce.date(),
  end_at: z.coerce.date().refine((value, ctx) => value >= ctx.parent.start_at, 'End date must be after start date'),
  request_type: z.enum(['vacation', 'sick_leave', 'personal', 'other']),
  reason: z.string().trim().min(1).max(500),
})
```

**Steps to Fix**:
1. Inventory forms in each feature (`time-off`, `appointments`, `clients`, etc.).
2. Model the expected payload with Zod types, reflecting database requirements (enums, length constraints, required vs optional fields).
3. Update client forms to use the new schemas via `zodResolver`.
4. Run `npm run typecheck` and relevant UI tests.

**Acceptance Criteria**:
- [ ] Every exported schema validates the fields submitted by its feature forms.
- [ ] Invalid submissions are rejected client-side and server-side with meaningful error messages.

**Dependencies**: Requires accurate database typings (see Layer 5 Issue #1) to ensure parity between Zod schemas and Supabase columns.

---

## Statistics

- Total Issues: 1
- Files Affected: 3 (placeholders should be replaced)
- Estimated Fix Time: 2 hours
- Breaking Changes: Low (validation only)

---

## Next Steps

1. Replace placeholder Zod schemas with concrete definitions per feature.
2. Coordinate with the type generation fix (Layer 5) to align validation with actual column types.

---

## Related Files

This analysis should be done after:
- [x] Layer 5 type safety review

This analysis blocks:
- [ ] Layer 7 security assessment
