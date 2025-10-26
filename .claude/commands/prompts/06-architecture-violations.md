# 06: Architecture Violations

**Role:** Architecture Reviewer

## Objective

Find architectural problems including mixed concerns, circular dependencies, incorrect layer separation, business logic in UI, and violations of design principles.

## What to Search For

- Business logic in components/pages
- Data fetching in Client Components
- Server operations in Client Components
- Circular imports/dependencies
- Incorrect directory structure
- Mixed concerns (UI + API + Business logic)
- Server functions without `'use server'`
- Client Component code in API layer
- Hard coupling between modules
- Missing abstraction layers

## How to Identify Issues

1. **Find Client Components** fetching data directly
2. **Scan components** for business logic
3. **Identify circular imports** with ripgrep
4. **Check file organization** against canonical structure
5. **Find hard-coded values** that should be configurable

## Example Problems

```tsx
// ❌ Business logic in component (should be in API)
function Dashboard() {
  const [appointments, setAppointments] = useState([])
  
  useEffect(() => {
    const filtered = appointments.filter(a => a.status === 'confirmed')
    // Complex business logic here
  }, [appointments])
}

// ❌ Client Component fetching data
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
}

// ❌ Circular dependency
// components/A.tsx imports B
// components/B.tsx imports A
```

## Fix Approach

- Move business logic to api/queries or api/mutations
- Move data fetching to Server Components
- Extract business logic to utility functions
- Break circular dependencies
- Follow canonical feature structure
- Keep Next.js pages as 5-15 line shells that only render feature components
- Use proper layer separation
- Review `docs/stack-patterns/architecture-patterns.md` for feature structure and server/client rules

## Output Format

List findings as:
```
- CRITICAL: features/business/dashboard/index.tsx:45 - Business logic in component
- HIGH: features/customer/profile/components/editor.tsx:1 - Client Component fetching data
- HIGH: components/A.tsx ↔ components/B.tsx - Circular dependency
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/architecture-patterns.md`
- `docs/stack-patterns/nextjs-patterns.md`

Complete architecture audit and report all violations.
