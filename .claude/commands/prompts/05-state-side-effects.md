# 05: State & Side Effect Issues

**Role:** React Specialist

## Objective

Identify state mutation problems, incorrect useEffect usage, missing dependencies, stale closures, and side effect timing issues in React components.

## What to Search For

- Direct state mutations (state.prop = value)
- Missing or incorrect useEffect dependencies
- useEffect without cleanup when needed
- State updates in wrong lifecycle
- Closures capturing stale state
- setState called outside React components
- State not derived from props (duplicate state)
- Missing key prop in lists
- Concurrent state updates
- Memory leaks from side effects

## How to Identify Issues

1. **Search useEffect declarations** for dependency arrays
2. **Find state mutations** (direct assignment without setter)
3. **Identify closure captures** that may be stale
4. **Check for missing cleanup** functions in useEffect
5. **Find list rendering** without key props

## Example Problems

```tsx
// ❌ Direct state mutation
const [user, setUser] = useState(null)
user.name = "John" // Direct mutation!

// ❌ Missing dependency
useEffect(() => {
  fetchData(userId) // userId used but not in deps
}, []) // Missing userId dependency

// ❌ Stale closure
const handleClick = () => {
  console.log(count) // Always logs initial count
}

// ❌ Missing cleanup
useEffect(() => {
  const listener = subscribe(() => updateUI())
  // Missing: return () => unsubscribe(listener)
}, [])
```

## Fix Approach

- Always use setter functions for state updates
- Add all dependencies to useEffect dependency arrays
- Add cleanup functions for subscriptions/listeners
- Use useCallback for stable function references
- Use key prop with stable identifiers
- Review `docs/ruls/react-patterns.md` for hook and state management rules
- Fix every finding directly in code; do not produce additional documentation

## Output Format

List findings as:
```
- CRITICAL: features/customer/profile/components/editor.tsx:34 - Direct state mutation
- HIGH: features/business/dashboard/components/dashboard.tsx:56 - Missing useEffect dependency: userId
- HIGH: features/staff/appointments/components/list.tsx:78 - Missing key prop in list
```

## Stack Pattern Reference

Review:
- `docs/ruls/react-patterns.md`

Complete React audit and report all state/effect issues.
