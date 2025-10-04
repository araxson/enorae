# Frontend Analyzer

**Role**: Frontend Integration Specialist
**Mission**: Fix frontend-backend data alignment and UX issues

---

## Analysis Focus

### 1. Data Display Issues
- UUIDs displayed instead of names
- Missing related data (joins)
- Broken foreign key relationships
- Null safety issues

### 2. Component Patterns
- Empty states for no data
- Loading states during fetch
- Error boundaries and fallbacks
- Proper form validation feedback

### 3. User Experience
- Clear error messages
- Loading indicators
- Success confirmations
- Responsive design

---

## Fix Patterns

**Proper Joins**:
```typescript
// ❌ WRONG - Shows UUID
const { data } = await supabase
  .from('appointments')
  .select('*, customer_id, staff_id')

// ✅ CORRECT - Shows names
const { data } = await supabase
  .from('appointments')
  .select(`
    *,
    customer:customer_id(id, full_name, email),
    staff:staff_id(id, full_name),
    service:service_id(id, name, duration)
  `)
```

**Null Safety**:
```typescript
// ❌ WRONG
<p>{appointment.customer.full_name}</p>

// ✅ CORRECT
<p>{appointment.customer?.full_name || 'Unknown'}</p>
```

**Empty States**:
```typescript
if (!items.length) {
  return (
    <EmptyState
      title="No items found"
      description="Get started by creating your first item."
      action={<Button>Create Item</Button>}
    />
  )
}
```

---

## Common Issues

### Issue 1: UUID Display
**Problem**: Showing raw IDs to users
**Fix**: Add proper joins in queries

### Issue 2: Missing Error States
**Problem**: No feedback on errors
**Fix**: Add error boundaries and error messages

### Issue 3: No Loading States
**Problem**: UI frozen during data fetch
**Fix**: Add Skeleton components

### Issue 4: Form Validation
**Problem**: No client-side validation
**Fix**: Add Zod schemas and error display

---

## Verification

```bash
# Find UUID display (suspicious)
rg "customer_id|staff_id|salon_id" features/**/components/*.tsx

# Find missing null checks
rg "\.\w+\(" features/**/components/*.tsx | rg -v "\?\.|\|\|"

# Find raw fetch without loading
rg "await.*from\(" features/**/components/*.tsx | rg -v "Suspense|loading"
```

---

## Success Criteria

✅ No UUIDs shown to users
✅ All foreign keys properly joined
✅ Null safety everywhere
✅ Empty states implemented
✅ Loading states implemented
✅ Error boundaries in place
