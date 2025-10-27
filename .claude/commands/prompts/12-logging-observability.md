# 12: Logging & Observability

**Role:** Observability Engineer

## Objective

Identify missing logging in critical paths, inconsistent logging patterns, insufficient error context, and gaps in observability that make debugging difficult.

## What to Search For

- Missing log statements in critical functions
- No logging in error handlers
- Over-logging (verbose, too many logs)
- Inconsistent log levels (info, warn, error)
- Missing context in log messages
- No logging around API calls
- Missing user/session context in logs
- Untraced async operations
- No logging in mutation/side effects
- Missing data transformation logs

## How to Identify Issues

1. **Find error handlers** without logging
2. **Search for API calls** without logging
3. **Identify mutation functions** without audit trail
4. **Check async operations** for logging
5. **Look for silent failures** (no error logging)

## Example Problems

```ts
// ❌ No logging on error
export async function deleteAppointment(id: string) {
  try {
    const { error } = await supabase
      .schema('scheduling')
      .from('appointments')
      .delete()
      .eq('id', id)
    if (error) throw error
  } catch (error) {
    // No logging of what went wrong
    throw error
  }
}

// ❌ No logging on critical operation
export async function processPayment(orderId: string, amount: number) {
  const result = await payment.charge(amount)
  // No log of payment attempt, success, or failure
  return result
}

// ❌ Missing context in logs
console.log('Error occurred')
// Should include: userId, operation, timestamp, specific error details

// ❌ No logging in async operation
setTimeout(() => {
  updateUserStatus(userId)
  // No way to trace this background operation
}, 5000)
```

## Fix Approach

- Add console.log/logger calls to critical paths
- Log before and after important operations
- Include context: userId, salonId, operation name
- Use consistent log levels (info, warn, error)
- Log API requests and responses (sanitized)
- Add logging to error handlers
- Log state changes and side effects
- Review `docs/ruls/architecture-patterns.md` for logging guidance in server actions and queries

## Output Format

List findings as:
```
- HIGH: features/business/api/mutations.ts:45 - deleteAppointment() has no error logging
- MEDIUM: features/customer/booking/api/mutations.ts:23 - processPayment() missing operation logging
- MEDIUM: features/staff/appointments/api/queries.ts:67 - Async operation not traced
```

## Stack Pattern Reference

Review:
- `docs/ruls/architecture-patterns.md`
- `docs/ruls/supabase-patterns.md`

Complete observability audit and report all logging gaps.
