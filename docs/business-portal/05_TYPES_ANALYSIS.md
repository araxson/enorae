# Business Portal - Types Analysis

**Date**: 2025-10-25  
**Portal**: Business  
**Layer**: Types  
**Files Analyzed**: 580  
**Issues Found**: 2 (Critical: 0, High: 2, Medium: 0, Low: 0)

---

## Summary

- Re-scanned the Business portal after regenerating Supabase types (2025-10-25). The `Database` type now exposes `salons_view`, `staff_profiles_view`, `appointments_view`, etc.
- Located several stale aliases that target defunct view names (`salons`, `messages`). These compile only because TypeScript treats the key access as `any`, masking runtime failures.
- `.returns<...>()` is rarely used across the Business domain, allowing implicit `any` payloads even in strict mode. Once the incorrect aliases are fixed, adding `.returns` will surface further mismatches.

---

## Issues

### High Priority

#### Issue #1: `Views['salons']` Type Alias No Longer Exists
**Severity**: High  
**File**: `features/business/business-common/api/queries/salon.ts:6`  
**Rule Violation**: Type Safety Rule — `docs/stack-patterns/typescript-patterns.md` (“Type aliases must mirror generated Supabase types”)

**Current Code**:
```typescript
type Salon = Database['public']['Views']['salons']['Row']
```

**Problem**:
- Supabase MCP regenerated types show `public.Views.salons_view` (see `mcp__supabase__generate_typescript_types`). Accessing `'salons'` falls back to `any`, so `Salon` resolves to `unknown`.
- Downstream logic (e.g., `return data as Salon`) compiles but bypasses type checking. If the view schema changes, no compile-time errors are raised.
- Mirrors the runtime failure documented in Layer 2 Issue #1.

**Required Fix**:
```typescript
type Salon = Database['public']['Views']['salons_view']['Row']
```

**Steps to Fix**:
1. Update the alias to `salons_view`.
2. Propagate the corrected type wherever `Salon` is exported (several features import it).
3. Run `npm run typecheck` to surface any downstream property access mismatches.

**Acceptance Criteria**:
- [ ] No references to `Views['salons']` remain.
- [ ] TypeScript compiles without implicit `any` casts in salon helpers.

**Dependencies**: None

---

#### Issue #2: Notifications Types Reference Missing `messages` View
**Severity**: High  
**File**: `features/business/notifications/api/queries.ts:7-25`  
**Rule Violation**: Type Safety Rule — `docs/stack-patterns/typescript-patterns.md`

**Current Code**:
```typescript
type MessageRow = Database['public']['Views']['messages']['Row']
type NotificationStatus = Database['public']['Enums']['notification_status']
```

**Problem**:
- `public.Views` does not include `messages`; only `communication_message_threads_view` exists. The alias resolves to `any`, so the derived `NotificationPayload` accepts arbitrary shapes.
- This hides schema drift when the underlying RPC or view changes (strings vs JSON).
- The mismatch also fuels the runtime bug described in Layer 2 Issue #2 (querying `supabase.from('messages')`).

**Required Fix**:
```typescript
type MessageRow = Database['public']['Views']['communication_message_threads_view']['Row']
// or define a bespoke payload interface if notifications should reference a different model
```

**Steps to Fix**:
1. Replace the alias with the correct Supabase view (or create a Zod schema if notifications should not mirror threads directly).
2. Add `.returns<MessageRow[]>()` to all notification fetches to maintain compile-time safety.
3. Run `npm run typecheck` to confirm consumers adapt.

**Acceptance Criteria**:
- [ ] Notification types reference valid keys from `Database`.
- [ ] Notification queries return typed data (via `.returns<...>()` or equivalent).

**Dependencies**: None

---

## Statistics

- Total Issues: 2
- Files Affected: 2
- Estimated Fix Time: 2 hours
- Breaking Changes: Low (type-only, but reveals downstream gaps)

---

## Next Steps

1. Apply the alias fixes, then rerun `npm run typecheck` to catch follow-up mismatches.
2. Add `.returns<...>()` across Business portal Supabase queries to keep types in sync going forward.
3. Consider adding a lint rule or codemod to flag `Database['public']['Views']['foo']` keys not present in generated types.

---

## Related Files

This analysis should be done after:
- [x] `docs/business-portal/04_COMPONENTS_ANALYSIS.md`

This analysis blocks:
- [ ] `docs/business-portal/06_VALIDATION_ANALYSIS.md`
