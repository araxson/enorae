# 02: Security Issues

**Role:** Security Reviewer

## Objective

Identify security vulnerabilities including missing auth checks, exposed secrets, injection risks, unsafe data handling, and authentication/authorization gaps.

## What to Search For
 * CRITICAL SECURITY:
 * - ALWAYS use getUser() instead of getSession()
 * - getSession() reads from cookies (can be spoofed)
 * - getUser() validates with Supabase servers (secure)
 *
 * Based on Next.js 15 + Supabase security best practices
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 */
- Missing `getUser()` or `verifySession()` checks
- Hardcoded API keys, passwords, tokens
- Exposed sensitive environment variables
- SQL injection or similar injection patterns
- Unsafe `eval()`, `Function()` usage
- Missing input validation
- Unencrypted sensitive data handling
- Missing CORS validation
- Server actions without `'use server'` directive

## How to Identify Issues

1. **Search for API/mutation functions** without auth verification
2. **Scan for hardcoded secrets** (API_KEY, token, secret patterns)
3. **Find missing validation** on user inputs
4. **Check for unsafe operations** (eval, dangerouslySetInnerHTML)
5. **Verify server directives** on sensitive operations

## Example Problems

```ts
// ❌ Missing auth check
export async function deleteUser(id: string) {
  const { error } = await supabase
    .schema('identity')
    .from('users')
    .delete()
    .eq('id', id)
  return error
}

// ❌ Hardcoded secret
const API_KEY = "sk_live_2024_secret_key_123"
```

## Fix Approach

- Add `getUser()` verification to all mutations
- Remove all hardcoded secrets (use env variables)
- Add Zod validation to all inputs
- Add 'use server' to server actions
- Ensure Supabase writes use `supabase.schema('<schema>').from('<table>')`
- Review `docs/stack-patterns/supabase-patterns.md` for auth, RLS, and mutation requirements
- Fix every finding directly in code; do not produce additional documentation

## Output Format

List findings as:
```
- CRITICAL: features/admin/api/mutations.ts:23 - Missing auth check in deleteUser()
- HIGH: features/staff/api/queries.ts:1 - Hardcoded API_KEY exposed
- MEDIUM: features/business/api/mutations.ts:45 - No input validation
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/supabase-patterns.md`
- `docs/stack-patterns/architecture-patterns.md`

Complete security audit and report all vulnerabilities.
