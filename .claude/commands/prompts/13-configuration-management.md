# 13: Configuration Management

**Role:** Configuration Auditor

## Objective

Find hardcoded values that should be configurable, missing environment variable usage, inconsistent configuration patterns, and configuration accessed from wrong layers.

## What to Search For

- Hardcoded URLs, ports, hostnames
- Hardcoded API endpoints
- Magic numbers for timeouts, retries, limits
- Hardcoded feature flags
- Database connection strings
- API keys in code (not env vars)
- Hardcoded file paths
- Hardcoded domain names
- Hardcoded timeouts and delays
- Environment-specific values mixed in code

## How to Identify Issues

1. **Search for hardcoded URLs** (http://, https://)
2. **Find magic numbers** (timeouts, retries: 3000, 5, 1000)
3. **Scan for localhost references**
4. **Search for .env references** in code
5. **Identify config-like values** in components

## Example Problems

```ts
// ❌ Hardcoded URL
const API_URL = 'https://api.production.com'
export async function fetchUser(id: string) {
  const response = await fetch(`${API_URL}/users/${id}`)
  return response.json()
}

// ❌ Magic number without explanation
const timeout = 30000 // What is this? 30 seconds? Unclear
await Promise.race([
  fetchData(),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), timeout))
])

// ❌ Hardcoded environment-specific value
const DATABASE_URL = 'postgres://localhost:5432/salon_dev'

// ❌ Config in wrong layer (component)
export function Dashboard() {
  const MAX_ITEMS = 50 // Should be in config, not component
  return <List maxItems={MAX_ITEMS} />
}

// ❌ Missing env var usage
const apiKey = 'sk_live_2024_abc123' // Should be: process.env.STRIPE_API_KEY
```

## Fix Approach

- Move URLs to environment variables
- Create constants file for magic numbers
- Add comments explaining config values
- Use .env.local/.env.example files
- Create centralized config module
- Use environment-specific configs
- Document required env variables
- Review `docs/ruls/architecture-patterns.md` for configuration management standards

## Output Format

List findings as:
```
- CRITICAL: features/business/api/queries.ts:12 - Hardcoded API URL 'https://api.production.com'
- HIGH: features/customer/booking/api/mutations.ts:45 - Magic number 30000 without explanation
- HIGH: lib/supabase/client.ts:23 - Database URL hardcoded, should use process.env
```

## Stack Pattern Reference

Review:
- `docs/ruls/architecture-patterns.md`
- `docs/ruls/file-organization-patterns.md`

Complete configuration audit and report all hardcoded values.
