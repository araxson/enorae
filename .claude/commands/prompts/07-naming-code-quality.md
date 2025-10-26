# 07: Naming & Code Quality

**Role:** Code Quality Expert

## Objective

Identify poor naming conventions, code smells, magic numbers/strings, misleading variable names, and overall code quality issues that affect maintainability.

## What to Search For

- Single letter variable names (except loops)
- Misleading function/variable names
- Magic numbers without explanation (0, -1, 100, 1000)
- Magic strings without constants
- Comments explaining obvious code
- TODO/FIXME comments left behind
- Inconsistent naming conventions
- Overly complex functions
- Poor function naming (unclear purpose)
- Boolean variable names that aren't "is/has/can"

## How to Identify Issues

1. **Search for magic numbers** (standalone numbers in code)
2. **Find unclear variable names** (a, b, x, temp)
3. **Identify TODO/FIXME comments**
4. **Search for boolean fields** not prefixed with "is"
5. **Find functions with vague names** (process, handle, do)

## Example Problems

```ts
// ❌ Magic number - what does 86400 mean?
const timestamp = Date.now() - 86400 * 1000

// ❌ Unclear naming
function p(u) {
  return u.map(x => x.v * 1.1)
}

// ❌ Non-boolean naming convention
const active = true // Should be: isActive
const loading = false // Should be: isLoading

// ❌ TODO left behind
// TODO: Fix this performance issue - should not be left

// ❌ Vague function naming
function handle(data) {
  // Does what exactly?
}
```

## Fix Approach

- Replace magic numbers with named constants
- Rename unclear variables to descriptive names
- Add "is/has/can" prefix to booleans
- Remove obsolete TODO/FIXME comments
- Rename functions to clearly describe their purpose
- Consolidate duplicated constants
- Review `docs/stack-patterns/typescript-patterns.md` for naming and readability conventions

## Output Format

List findings as:
```
- MEDIUM: features/business/analytics/api/queries.ts:23 - Magic number: 86400
- MEDIUM: features/staff/clients/api/queries.ts:45 - Unclear var name: p, u, x
- LOW: features/customer/appointments/components/list.tsx:12 - Boolean naming: active (should be: isActive)
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/typescript-patterns.md`
- `docs/stack-patterns/file-organization-patterns.md`

Complete code quality audit and report all naming issues.
