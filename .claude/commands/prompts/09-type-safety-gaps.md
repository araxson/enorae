# 09: Type Safety Gaps

**Role:** TypeScript Expert

## Objective

Identify TypeScript type safety issues beyond compiler errors, including implicit any types, unsafe casting, missing type guards, and runtime type mismatches.

## What to Search For

- Implicit any types (despite compiler settings)
- Unsafe type assertions (as any, as unknown)
- Missing type guards before property access
- Unsafe property access on objects
- Type casting instead of proper typing
- Any type escaping via function returns
- Missing generics in reusable functions
- Unsafe array/object indexing
- Missing discriminated unions
- Function parameter type mismatches

## How to Identify Issues

1. **Search for `as any` and `as unknown`** patterns
2. **Find functions** returning any or untyped
3. **Search for property access** without type guards
4. **Identify generic functions** without proper typing
5. **Find unsafe array indexing** without bounds checks

## Example Problems

```ts
// ❌ Unsafe casting
const user = response as any
user.profile.name // TypeScript can't help if wrong shape

// ❌ Missing type guard
function getName(user: User | null) {
  return user.name // TypeScript error, but missed at runtime
}

// ❌ Implicit any
function process(data) { // Implicit any
  return data.value * 2
}

// ❌ Unsafe property access
const value = config['setting'] // What if 'setting' doesn't exist?

// ❌ Missing discriminated union
type Result = { success: boolean; data?: any; error?: any }
// Should use discriminated union for type safety
```

## Fix Approach

- Replace `as any` with proper type definitions
- Add type guards before unsafe access
- Use discriminated unions for conditional types
- Add generics to reusable functions
- Create proper type definitions for API responses
- Use `const as const` for literal types
- Review `docs/stack-patterns/typescript-patterns.md` for strict typing requirements

## Output Format

List findings as:
```
- CRITICAL: features/business/api/queries.ts:23 - Unsafe casting: as any
- HIGH: features/customer/profile/api/mutations.ts:45 - Missing type guard before property access
- MEDIUM: features/staff/appointments/api/queries.ts:12 - Implicit any parameter: data
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/typescript-patterns.md`
- `docs/stack-patterns/supabase-patterns.md`

Complete type safety audit and report all gaps.
