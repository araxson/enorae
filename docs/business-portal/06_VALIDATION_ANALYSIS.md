# Business Portal - Validation Analysis

**Date**: 2025-10-25  
**Portal**: Business  
**Layer**: Validation  
**Files Analyzed**: 40  
**Issues Found**: 2 (Critical: 0, High: 0, Medium: 2, Low: 0)

---

## Summary

- Inspected every `schema.ts` under `features/business/**/` plus the `api/schema.ts` variants for server actions.
- Most schemas follow `docs/stack-patterns/forms-patterns.md`, pairing Zod validation with server actions.
- Two Business settings modules still ship empty Zod objects (`z.object({})`), offering no runtime validation or type inference for their forms.
- These empty schemas cascade into mutations that accept unchecked `FormData`, undermining the “Validate inputs” requirement from the Business portal checklist.

---

## Issues

### Medium Priority

#### Issue #1: Salon Settings Schema Is Empty
**Severity**: Medium  
**File**: `features/business/settings-salon/schema.ts:1-4`  
**Rule Violation**: Form Validation Rule — `docs/stack-patterns/forms-patterns.md` (“Define Zod schemas for every form”)

**Current Code**:
```typescript
export const settingsSalonSchema = z.object({})
```

**Problem**:
- Provides no validation for `business_name`, `business_type`, or `established_at`, even though the corresponding mutation (`updateSalonInfo`) expects those fields.
- Type inference collapses to `{}`, so components relying on `SettingsSalonSchema` lose property safety.
- Contradicts Phase 1 instructions to “Validate inputs - Use Zod schemas for all user input.”

**Required Fix**:
```typescript
export const settingsSalonSchema = z.object({
  business_name: z.string().min(1).max(200),
  business_type: z.string().max(100).optional(),
  established_at: z.coerce.date().optional(),
})
```

**Steps to Fix**:
1. Mirror the database column types from `salons_view` (Supabase types).
2. Ensure the server mutation parses `formData` via the schema and handles coercion.
3. Update UI forms to use the inferred `SettingsSalonSchema`.

**Acceptance Criteria**:
- [ ] `settings-salon/schema.ts` validates every editable field.
- [ ] Mutation rejects invalid payloads with user-friendly errors.
- [ ] Type inference (`SettingsSalonSchema`) reflects actual fields.

**Dependencies**: None

---

#### Issue #2: Contact Settings Schema Missing Field Definitions
**Severity**: Medium  
**File**: `features/business/settings-contact/schema.ts:1-4`  
**Rule Violation**: Form Validation Rule — `docs/stack-patterns/forms-patterns.md`

**Current Code**:
```typescript
export const settingsContactSchema = z.object({})
```

**Problem**:
- Leaves booking email, phone numbers, social handles, etc., completely unchecked. The mutation relies on manual checks or database constraints, increasing error risk.
- Form components cannot infer types, so UI code treats form values as `any`.
- Violates Business portal checklist item “Validate inputs — Use Zod schemas.”

**Required Fix**:
```typescript
export const settingsContactSchema = z.object({
  primary_email: z.string().email(),
  primary_phone: z.string().min(8).max(20).optional(),
  booking_url: z.string().url().optional(),
  instagram_url: z.string().url().optional(),
  // …include remaining contact fields with appropriate validation
})
```

**Steps to Fix**:
1. Enumerate editable contact fields from `salon_contact_details_view`.
2. Define validation constraints (email, URL, length) per business requirements.
3. Update mutation to parse form data with the new schema, returning Zod errors to the UI.

**Acceptance Criteria**:
- [ ] Contact settings mutations reject invalid URLs/emails.
- [ ] `SettingsContactSchema` exposes typed fields to client forms.
- [ ] Regression tests (unit or integration) cover invalid submissions.

**Dependencies**: None

---

## Statistics

- Total Issues: 2
- Files Affected: 2
- Estimated Fix Time: 3 hours
- Breaking Changes: No (adds validation only)

---

## Next Steps

1. Implement full Zod schemas for salon/contact settings, then rerun form submissions to confirm error handling.
2. Audit the remaining 38 schema files for partial coverage (e.g., optional fields without constraints).
3. Consider adding a lint/checklist step to block `z.object({})` patterns in Business portal code.

---

## Related Files

This analysis should be done after:
- [x] `docs/business-portal/05_TYPES_ANALYSIS.md`

This analysis blocks:
- [ ] `docs/business-portal/07_SECURITY_ANALYSIS.md`
