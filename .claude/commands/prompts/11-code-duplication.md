# 11: Code Duplication & DRY Violations

**Role:** Code Deduplication Specialist

## Objective

Identify copy-pasted code blocks, duplicated logic, repeated implementations, and refactoring opportunities to consolidate shared functionality and reduce maintenance burden.

## What to Search For

- Identical code blocks across multiple files
- Similar logic repeated with minor variations
- Duplicate helper functions
- Repeated component implementations
- Copy-pasted query/mutation patterns
- Duplicate validation logic
- Repeated API call patterns
- Similar UI component structures
- Duplicate utility functions
- Repeated error handling patterns

## How to Identify Issues

1. **Search for similar function names** across different files
2. **Find identical code patterns** using ripgrep
3. **Identify similar logic blocks** that do the same thing
4. **Scan for repeated calculations** or transformations
5. **Check utils/helpers** for duplicate implementations

## Example Problems

```ts
// ❌ Duplicated in features/business/appointments/api/queries.ts
export async function fetchAppointments(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return await supabase.from('appointments_view').select('*').eq('salon_id', salonId)
}

// ❌ Same logic duplicated in features/staff/appointments/api/queries.ts
export async function getStaffAppointments(staffId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return await supabase.from('appointments_view').select('*').eq('staff_id', staffId)
}

// ❌ Duplicate validation logic
const validateEmail = (email: string) => /^[^@]+@[^@]+\.[^@]+$/.test(email)
// Same validator exists in 3 other files
```

## Fix Approach

- Extract duplicated code to shared utilities
- Create generic functions for similar patterns
- Consolidate validation schemas
- Create reusable query/mutation factories
- Move common logic to helper functions
- Use barrel exports for easy imports
- Review `docs/stack-patterns/architecture-patterns.md` for guidance on shared utilities and feature boundaries

## Output Format

List findings as:
```
- HIGH: Code duplication found in features/business/appointments/api/queries.ts:23 and features/staff/appointments/api/queries.ts:45
  - Identical fetchAppointments logic, consider extracting to lib/utils/appointments.ts
- MEDIUM: Duplicate validateEmail found in 3 files, should be lib/utils/validation.ts
- MEDIUM: Similar form submission pattern in components/ - create reusable form hook
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/architecture-patterns.md`
- `docs/stack-patterns/react-patterns.md`

Complete duplication audit and report all opportunities for consolidation.
