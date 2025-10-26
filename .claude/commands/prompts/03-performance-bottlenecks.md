# 03: Performance Bottlenecks

**Role:** Performance Optimizer

## Objective

Identify performance issues including unnecessary re-renders, inefficient data fetching, large bundle files, missing optimization hooks, and algorithmic inefficiencies.

## What to Search For

- Components without React.memo when needed
- Missing useMemo() for expensive computations
- Missing useCallback() for event handlers
- N+1 query patterns (fetching in loops)
- Page shells exceeding 15 lines (should just render feature components)
- Unoptimized images and assets
- Missing lazy loading patterns
- Inline object/array creation in render
- Infinite loops or redundant calculations
- Bundle size bloat

## How to Identify Issues

2. **Search for expensive operations** in render paths
3. **Identify missing optimization directives** (memo, useMemo, useCallback)
4. **Check data fetching patterns** for N+1 issues
5. **Analyze bundle imports** for unnecessary dependencies
6. **Flag app route pages** over 15 lines that include business logic instead of delegating to features

## Example Problems

```tsx
// ❌ Re-renders unnecessarily on prop changes
function List({ items, onSelect }) {
  return items.map(item => (
    <Item key={item.id} onSelect={onSelect} /> // handler recreated each render
  ))
}

// ❌ N+1 pattern
for (const user of users) {
  const appointments = await fetchAppointments(user.id)
}
```

## Fix Approach

- Wrap components with React.memo()
- Use useMemo() for expensive calculations
- Use useCallback() for stable function references
- Batch API calls instead of N+1
- Split large components
- Use lazy loading for routes/components
- Review `docs/stack-patterns/react-patterns.md` and `docs/stack-patterns/architecture-patterns.md` for performance guidance
- Fix every finding directly in code; do not produce additional documentation

## Output Format

List findings as:
```
- HIGH: features/customer/appointments/components/list.tsx:45 - Large file (620 lines), should split
- MEDIUM: features/business/dashboard/index.tsx:12 - Missing React.memo on <Item>
- MEDIUM: features/staff/clients/api/queries.ts:34 - N+1 pattern in loop
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/react-patterns.md`
- `docs/stack-patterns/architecture-patterns.md`

Complete performance audit and report all bottlenecks.
