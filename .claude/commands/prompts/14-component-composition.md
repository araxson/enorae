# 14: Component Composition Issues

**Role:** Component Architect

## Objective

Identify prop drilling, over-nesting, monolithic components, poor component interfaces, and composition issues that create maintenance and readability problems.

## What to Search For

- Prop drilling (passing props through multiple levels)
- Components passing props they don't use
- Monolithic components (>300 lines)
- Over-nested component structures
- Poor component interfaces (too many props)
- Missing component composition patterns
- Tight coupling between components
- Hard to test component structures
- Components doing too much (multiple responsibilities)
- Lack of component abstraction
- Custom UI built instead of shadcn/ui primitives

## How to Identify Issues

1. **Find components** with >20 props being passed
2. **Search for prop forwarding** without using the prop
3. **Identify large files** (>300 lines) in components/
4. **Check for nested component nesting** (3+ levels deep)
5. **Find components** with complex render logic

## Example Problems

```tsx
// ❌ Prop drilling - passing props through multiple levels
function Dashboard() {
  return <AppointmentsList userId={userId} salonId={salonId} theme={theme} />
}

function AppointmentsList({ userId, salonId, theme }) {
  return <AppointmentItem userId={userId} salonId={salonId} theme={theme} />
}

function AppointmentItem({ userId, salonId, theme }) {
  // Finally uses props here, but passed through 2 levels unnecessarily
  return <div className={theme}>{userId}</div>
}

// ❌ Monolithic component (400+ lines)
export function Dashboard() {
  const [appointments, setAppointments] = useState([])
  const [customers, setCustomers] = useState([])
  const [metrics, setMetrics] = useState([])
  // ... 200 more lines of UI, logic, calculations
  return <div>{/* Complex JSX */}</div>
}

// ❌ Too many props (poor interface)
function AppointmentCard({
  id, name, email, phone, date, time, service, price,
  status, notes, therapist, location, duration, ...
}) {
  // Component is tied to too many details
}
```

## Fix Approach

- Use Context API to avoid prop drilling
- Split monolithic components into smaller ones
- Extract render logic into separate components
- Create component composition patterns
- Reduce component prop count
- Replace bespoke markup with shadcn/ui primitives and follow documented compositions
- Keep shadcn slots as plain text (no className overrides) and apply layout with parent containers
- Create reusable component families
- Review `docs/ruls/ui.md` and `docs/ruls/react-patterns.md` for component composition standards

## Output Format

List findings as:
```
- HIGH: features/business/dashboard/index.tsx - Monolithic component (420 lines), split into smaller components
- MEDIUM: features/customer/appointments/components/list.tsx:23 - Prop drilling: userId, salonId, theme passed through 3 levels
- MEDIUM: features/staff/clients/components/detail.tsx - Component has 22 props, reduce interface
```

## Stack Pattern Reference

Review:
- `docs/ruls/ui.md`
- `docs/ruls/react-patterns.md`
- `docs/ruls/architecture-patterns.md`

Complete component composition audit and report all issues.
