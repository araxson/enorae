# 04: Error Handling Gaps

**Role:** Reliability Engineer

## Objective

Find missing error handling, unhandled edge cases, swallowed exceptions, missing validation, and incomplete error recovery paths.

## What to Search For

- Missing try-catch blocks around async operations
- Unhandled promise rejections
- Missing null/undefined checks
- Functions without error return handling
- Empty catch blocks (silent failures)
- Missing input validation
- Unhandled API errors
- Missing default values
- No fallback UI for error states
- Incomplete error recovery

## How to Identify Issues

1. **Find async functions** without try-catch
2. **Search for unhandled promise calls** (missing .catch())
3. **Identify missing null checks** before property access
4. **Find empty catch blocks** (error swallowing)
5. **Check API calls** for missing error handling

## Example Problems

```ts
// ❌ Unhandled promise rejection
async function fetchUser(id: string) {
  return await supabase.from('users_view').select('*').eq('id', id)
  // No error handling if fails
}

// ❌ Empty catch block (silent failure)
try {
  await deleteAppointment(id)
} catch (error) {
  // No error handling
}

// ❌ Missing null check
const name = user.profile.name.toUpperCase() // Crashes if user/profile null
```

## Fix Approach

- Add try-catch to all async operations
- Handle promise rejections explicitly
- Add null/undefined checks before access
- Implement proper catch block handling
- Add validation with Zod schemas
- Log errors appropriately
- Review `docs/stack-patterns/react-patterns.md` for error-handling guidance in async flows
- Fix every finding directly in code; do not produce additional documentation

## Output Format

List findings as:
```
- CRITICAL: features/business/api/mutations.ts:23 - Missing try-catch in updateSalon()
- HIGH: features/staff/appointments/api/queries.ts:45 - Unhandled promise rejection
- MEDIUM: features/customer/profile/api/queries.ts:12 - Missing null check on user.profile
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/react-patterns.md`
- `docs/stack-patterns/supabase-patterns.md`

Complete error handling audit and report all gaps.
