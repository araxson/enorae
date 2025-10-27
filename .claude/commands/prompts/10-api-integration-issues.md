# 10: API & Integration Issues

**Role:** Integration Architect

## Objective

Identify API contract mismatches, broken integrations, incomplete error handling, missing validation layers, and issues with external service calls and module boundaries.

## What to Search For

- API response structure mismatches
- Missing error response handling
- Incomplete API implementations
- Hardcoded URLs instead of configuration
- Missing retry logic for failures
- Incorrect HTTP methods for operations
- Missing request/response validation
- Version mismatches in dependencies
- Broken module contracts
- Missing integration tests
- Timeout handling missing

## How to Identify Issues

1. **Compare API calls** with actual endpoint implementations
2. **Find hardcoded URLs** that should be configurable
3. **Search for HTTP calls** without error handling
4. **Identify missing validation** of API responses
5. **Find module exports** that don't match imports

## Example Problems

```ts
// ❌ Missing error handling
const response = await fetch('/api/appointments')
const data = await response.json() // What if network fails? Response is error?

// ❌ Hardcoded URL
const API_URL = 'http://localhost:3000/api' // Should be env var

// ❌ Contract mismatch - API returns array but code expects object
const user = await fetchUser(id) // API returns [user] not user
const name = user.name // Crashes!

// ❌ Missing timeout
fetch('/api/slow-endpoint', {
  // No timeout - could hang indefinitely
})

// ❌ Wrong HTTP method
fetch('/api/appointments', { method: 'GET' }) // Should be POST for create

// ❌ Missing validation of API response
const appointments = await fetchAppointments()
appointments.forEach(a => a.startTime) // What if API changed structure?
```

## Fix Approach

- Add response validation with Zod
- Implement error handling for all API calls
- Use environment variables for URLs
- Add timeouts to fetch requests
- Use correct HTTP methods
- Add retry logic for transient failures
- Document API contracts
- Review `docs/ruls/supabase-patterns.md` and `docs/ruls/architecture-patterns.md` for integration rules

## Output Format

List findings as:
```
- CRITICAL: features/business/api/queries.ts:34 - Missing error handling in fetchAppointments()
- HIGH: features/customer/booking/api/mutations.ts:56 - Hardcoded URL should be env var
- HIGH: features/staff/clients/api/queries.ts:23 - API response structure mismatch
```

## Stack Pattern Reference

Review:
- `docs/ruls/supabase-patterns.md`
- `docs/ruls/architecture-patterns.md`
- `docs/ruls/typescript-patterns.md`

Complete integration audit and report all issues.
