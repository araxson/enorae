# 08: Async/Promise Issues

**Role:** Async Specialist

## Objective

Find async/await and Promise handling issues including missing awaits, race conditions, unhandled rejections, improper error handling, and timing-dependent bugs.

## What to Search For

- Missing await on Promise calls
- Unhandled Promise rejections
- Race conditions in async code
- Callback hell / deeply nested callbacks
- Promise.all() used incorrectly
- Missing Promise.catch() or .finally()
- Timing-dependent bugs
- Shared state in concurrent operations
- Async operations in useEffect without cleanup
- Missing AbortController usage

## How to Identify Issues

1. **Search for async functions** without await keyword
2. **Find Promise calls** without .catch()
3. **Identify concurrent operations** on shared state
4. **Check for Promise.all() misuse**
5. **Find setTimeout/setInterval** without cleanup

## Example Problems

```ts
// ❌ Missing await
async function fetchData() {
  const data = fetchFromAPI() // Missing await!
  return data.json()
}

// ❌ Unhandled promise rejection
const promise = fetchData()
// No .catch() or try-catch

// ❌ Race condition
let userState = null
async function loadUser(id) {
  const user = await fetchUser(id)
  userState = user // Race: what if another call happens?
}

// ❌ Nested callback hell
loadUser().then(u => {
  loadAppointments(u.id).then(a => {
    loadServices(a.serviceIds).then(s => {
      // Too many nesting levels
    })
  })
})

// ❌ Missing cleanup in useEffect
useEffect(() => {
  const timer = setTimeout(() => {
    setState(value)
  }, 1000)
  // Missing cleanup - causes memory leak
}, [])
```

## Fix Approach

- Always await Promise calls
- Add .catch() or wrap in try-catch
- Use Promise.all() only for independent operations
- Use async/await instead of callback chains
- Add AbortController for cancellable operations
- Add cleanup functions for timers
- Review `docs/stack-patterns/react-patterns.md` for async lifecycle guidance

## Output Format

List findings as:
```
- CRITICAL: features/customer/booking/api/mutations.ts:34 - Missing await on fetchAvailability()
- HIGH: features/business/dashboard/api/queries.ts:56 - Unhandled promise rejection
- HIGH: features/staff/appointments/components/list.tsx:78 - Race condition on state update
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/react-patterns.md`
- `docs/stack-patterns/architecture-patterns.md`

Complete async audit and report all issues.
