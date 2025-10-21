# Staff Portal - Validation Analysis

**Date**: 2025-10-20  
**Portal**: Staff  
**Layer**: Validation  
**Files Analyzed**: 21  
**Issues Found**: 2 (Critical: 1, High: 0, Medium: 1, Low: 0)

---

## Summary

Reviewed all `features/staff/**/schema.ts` modules to confirm Zod coverage aligns with CLAUDE.md Rule 9 (validate every input) and the forms pattern in `docs/stack-patterns/forms-patterns.md`. Only a handful of features expose meaningful schemas (`blockedTimeSchema`, `productUsageSchema`, `messageSchema`). Most others are empty placeholders (`z.object({})`), leaving server actions and UI forms without shared validation. This contradicts the pattern guidance and caused duplicative ad-hoc schemas inside mutation files (e.g., `createTimeOffRequest`). To keep validation centralized and re-usable, the schema modules must export the canonical Zod definitions with descriptive messages.

---

## Issues

### Critical Priority

#### Issue #1: Time-off schema is empty despite active forms
**Severity**: Critical  
**File**: `features/staff/time-off/schema.ts:3-4`  
**Rule Violation**: CLAUDE.md Rule 9 (Validate inputs with Zod).

**Current Code**:
```ts
export const timeOffSchema = z.object({})
```

**Problem**:
The staff time-off flow relies on user input (dates, request type, toggles), but the exported schema does nothing. Mutations therefore fall back to an ad-hoc `requestSchema` defined in `mutations.ts`, fragmenting validation logic and risking drift between client and server.

**Required Fix**:
```ts
export const timeOffSchema = z.object({
  startAt: z.string().min(1, 'Start date is required'),
  endAt: z.string().min(1, 'End date is required'),
  requestType: z.enum(['vacation', 'sick_leave', 'personal', 'other']),
  reason: z.string().max(1000).optional().nullable(),
  isAutoReschedule: z.boolean().optional(),
  isNotifyCustomers: z.boolean().optional(),
})

export type TimeOffSchema = z.infer<typeof timeOffSchema>
```
Use this shared schema inside both the dialog component and the server action (`parse` the `FormData` before building the payload).

**Steps to Fix**:
1. Move the existing `requestSchema` definition into `schema.ts` as shown above.  
2. Import and reuse it in `time-off/components/create-request-dialog.tsx` and `api/mutations.ts`.  
3. Provide user-friendly error messages (per forms pattern).  
4. Run `npm run typecheck` to ensure the inferred types propagate.

**Acceptance Criteria**:
- [ ] `timeOffSchema` validates all fields used by the create/update/cancel actions.  
- [ ] UI forms surface schema error messages.  
- [ ] No duplicate schema definitions remain in the mutations file.

**Dependencies**: None

---

### Medium Priority

#### Issue #2: Multiple feature schemas exported as empty objects
**Severity**: Medium  
**Files**:  
- `features/staff/analytics/schema.ts`  
- `features/staff/profile/schema.ts`  
- `features/staff/services/schema.ts`  
- `features/staff/settings/schema.ts`  
- `features/staff/dashboard/schema.ts`  
- `features/staff/location/schema.ts`  
- `features/staff/support/schema.ts`  
- `features/staff/staff-common/schema.ts`  
- `features/staff/appointments/schema.ts` (and others)  
**Rule Violation**: CLAUDE.md Rule 9 (Form inputs must be validated).

**Current Code**:
```ts
export const someSchema = z.object({})
```

**Problem**:
These stubs provide no validation yet the corresponding components accept user input (profile edits, service filters, dashboard quick actions). Keeping empty schemas misleads maintainers and encourages further ad-hoc validation elsewhere.

**Required Fix**:
- Implement concrete Zod schemas that reflect the data each feature mutates.  
- If a feature truly has no user input, delete the unused schema file to avoid confusion.

**Steps to Fix**:
1. Inventory which forms/actions exist per feature and design the appropriate Zod object.  
2. Replace `z.object({})` with those definitions (including friendly messages).  
3. Wire the schema into UI forms via `zodResolver` or manual `safeParse`.  
4. Remove placeholder files when no validation is required.

**Acceptance Criteria**:
- [ ] Every remaining schema file encodes real validation rules.  
- [ ] No empty `z.object({})` exports remain.  
- [ ] Lint/typecheck passes without unused-schema warnings.

**Dependencies**: None

---

## Statistics

- Total Issues: 2  
- Files Affected: 10  
- Estimated Fix Time: 5 hours  
- Breaking Changes: 0 (but validation gaps currently allow bad data)

---

## Next Steps

1. Implement full time-off schema and reuse it across client/server.  
2. Replace placeholder schemas with actual validation (or remove them).  
3. Proceed to security review once validation gaps are closed.

---

## Related Files

This analysis should be done after:
- [x] docs/staff-portal/05_TYPES_ANALYSIS.md

This analysis blocks:
- [ ] docs/staff-portal/07_SECURITY_ANALYSIS.md

