# Admin Portal - Validation Analysis

**Date**: 2025-10-26
**Portal**: Admin
**Layer**: Validation
**Files Analyzed**: 27
**Issues Found**: 2 (Critical: 0, High: 1, Medium: 1, Low: 0)

---

## Summary

Inspected all feature-level Zod schemas (`features/admin/**/schema.ts`) plus the ad-hoc validators embedded in mutations. While several API layers do pull in targeted schemas (e.g., rate-limit tracking, profile updates), most feature root schemas are empty placeholders exporting `z.object({})`, offering zero validation despite the architecture pattern expecting meaningful shape definitions. One mutation also parses JSON outside Zod, so malformed payloads bubble up as opaque errors instead of structured feedback.

---

## Issues

### High Priority

#### Issue #1: Feature schemas are empty placeholders (`z.object({})`)
**Severity**: High  
**File**: `features/admin/staff/schema.ts`, `features/admin/analytics/schema.ts`, `features/admin/reviews/schema.ts`, `features/admin/moderation/schema.ts`, `features/admin/database-health/schema.ts`, `features/admin/chains/schema.ts`, `features/admin/finance/schema.ts`, `features/admin/roles/schema.ts`, `features/admin/profile/schema.ts`, `features/admin/salons/schema.ts`, `features/admin/security-monitoring/schema.ts`, `features/admin/admin-common/schema.ts`, `features/admin/users/schema.ts`, `features/admin/security/schema.ts`, `features/admin/appointments/schema.ts`, `features/admin/messages/schema.ts`, `features/admin/dashboard/schema.ts`, `features/admin/settings/schema.ts`  
**Rule Violation**: Forms Patterns – “Define concrete Zod schemas per feature; no empty scaffolds” (`docs/stack-patterns/forms-patterns.md`)

**Current Code**:
```ts
export const usersSchema = z.object({})
export type UsersSchema = z.infer<typeof usersSchema>
```

**Problem**: These exported schemas provide no validation. Developers importing them get a false sense of coverage while every field passes unchecked. Pattern docs expect each feature to expose a canonical schema (used by forms, server actions, and tests) that validates length constraints, enums, and required fields. Empty objects violate that guarantee.

**Required Fix**:
```ts
export const usersSchema = z.object({
  search: z.string().trim().max(120).optional(),
  status: z.enum(['active', 'suspended', 'deleted']).optional(),
  role: z.enum(['super_admin', 'platform_admin', 'tenant_owner']).optional(),
})
```

**Steps to Fix**:
1. Audit each feature’s inputs (filters, forms, mutations) and describe the expected payload in its `schema.ts`.
2. Replace `z.object({})` with a concrete shape that mirrors actual business rules (string lengths, enums, number ranges, booleans, etc.).
3. Update any consumers (forms or server actions) to reuse the shared schema, then run `npm run typecheck` to confirm inference still compiles.

**Acceptance Criteria**:
- [ ] No `z.object({})` placeholders remain in admin feature schema files.
- [ ] Each schema enumerates the inputs used by its feature and rejects invalid shapes.
- [ ] Forms and mutations import the new schema definitions instead of duplicating validation logic.

**Dependencies**: None

---

### Medium Priority

#### Issue #2: `logSecurityIncident` parses JSON outside Zod validation
**Severity**: Medium  
**File**: `features/admin/security-incidents/api/mutations.ts:60-87`  
**Rule Violation**: Forms Patterns – “Validate raw input with Zod before parsing” (`docs/stack-patterns/forms-patterns.md`, “Preprocess payloads safely”)

**Current Code**:
```ts
const resourcesJson = formData.get('impactedResources')?.toString()
const impactedResources = resourcesJson ? JSON.parse(resourcesJson) : []

const validated = logIncidentSchema.parse({
  …,
  impactedResources,
})
```

**Problem**: If `impactedResources` is invalid JSON, `JSON.parse` throws before Zod ever runs, leading to a generic “Unknown error” response. Users receive no actionable validation message, and the mutation bypasses the guardrails we expect from schema-driven validation.

**Required Fix**:
```ts
const validated = logIncidentSchema.safeParse({
  eventType: formData.get('eventType'),
  severity: formData.get('severity'),
  description: formData.get('description'),
  impactedResources: formData.get('impactedResources'),
})

if (!validated.success) {
  return { error: validated.error.errors[0]?.message ?? 'Invalid incident payload' }
}

const resources = validated.data.impactedResources
```
*Alternative:* use `z.preprocess` inside the schema to parse JSON safely.

**Steps to Fix**:
1. Wrap JSON parsing in a `try/catch` or move parsing into the schema via `z.preprocess`, surfacing a friendly error if parsing fails.
2. Return a descriptive validation error instead of falling through to the catch-all.
3. Add a quick regression test that submits malformed JSON to ensure the mutation responds with a 400-style message.

**Acceptance Criteria**:
- [ ] `logSecurityIncident` no longer throws on invalid JSON; instead, it returns a validation error.
- [ ] JSON parsing happens within Zod (via `z.preprocess`) or inside a guarded block.
- [ ] Validation errors expose actionable messages to the admin UI.

**Dependencies**: None

---

### Low Priority

_No low-severity issues found._

---

## Statistics

- Total Issues: 2
- Files Affected: 18
- Estimated Fix Time: 2.5 hours
- Breaking Changes: No

---

## Next Steps

1. Replace the placeholder feature schemas with real Zod validations that match form inputs.
2. Harden JSON parsing in `logSecurityIncident` (and any similar endpoints) so malformed payloads yield meaningful validation errors.

---

## Related Files

This analysis should be done after:
- [x] Layer 5 – Type Safety analysis

This analysis blocks:
- [ ] Layer 7 – Security analysis
