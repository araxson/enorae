---
name: auth-deep-fix
description: Deep analysis and fix of authentication system using Supabase MCP and Context7
tags: [auth, debug, supabase, fix]
---

# 🔐 Deep Auth Analysis & Fix

You are tasked with performing a **comprehensive investigation and fix** of the authentication system.

## 📋 Project Context

**Tech Stack:**
- Next.js 15.5.4 App Router
- Supabase Auth (Email/Password, OTP, Password Reset)
- 11 User Roles: `super_admin`, `platform_admin`, `tenant_owner`, `salon_owner`, `salon_manager`, `senior_staff`, `staff`, `junior_staff`, `vip_customer`, `customer`, `guest`
- RLS-protected tables: `auth.users`, `identity.profiles`, `identity.user_roles`

**Auth Flow:**
1. Signup → Creates user in `auth.users` → Trigger creates profile + assigns role
2. Login → Verifies credentials → Redirects to role-based portal
3. All roles login at `/login`, redirected to appropriate portal after authentication

## 🎯 Your Mission

**Perform these steps in order:**

### 1. Read Latest Supabase Auth Documentation
```
Use Context7 MCP to fetch latest Supabase Auth best practices:
- Search for: "supabase auth email password signup"
- Search for: "supabase auth triggers rls policies"
- Search for: "supabase auth row level security"
- Identify any breaking changes or new recommendations
```

### 2. Investigate Current State via Supabase MCP
```sql
-- Get auth logs (last 5 minutes)
mcp__supabase__get_logs(service: "auth")

-- Check all user accounts
SELECT email, email_confirmed_at, encrypted_password IS NOT NULL as has_password,
       last_sign_in_at, created_at, banned_until
FROM auth.users ORDER BY created_at DESC LIMIT 15;

-- Check profiles and roles sync
SELECT u.email, p.id IS NOT NULL as has_profile, ur.role, ur.is_active
FROM auth.users u
LEFT JOIN identity.profiles p ON u.id = p.id
LEFT JOIN identity.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;

-- Check trigger and function
SELECT t.tgname, pn.nspname || '.' || p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace pn ON p.pronamespace = pn.oid
WHERE t.tgname LIKE '%user%';

-- Check RLS policies blocking signup
SELECT schemaname, tablename, policyname, cmd, with_check
FROM pg_policies
WHERE schemaname = 'identity' AND cmd = 'INSERT';
```

### 3. Test Auth Flows
```
Test these scenarios:
1. Signup new user → Check profile created → Check role assigned
2. Login existing user → Check redirect works → Verify session
3. Password reset → Check email sent → Verify reset works
4. OTP verification → Check flow completes
```

### 4. Frontend Code Analysis
```
Check these files for issues:
- features/shared/auth/api/mutations.ts (Server Actions)
- features/shared/auth/components/*.tsx (Forms)
- lib/supabase/server.ts (Supabase client)
- middleware.ts (Session refresh, redirects)
- lib/validations/auth.ts (Zod schemas)
```

### 5. Common Issues to Check

**Database Issues:**
- [ ] Trigger function exists and is correct
- [ ] RLS policies allow trigger to insert
- [ ] No duplicate functions (identity vs public schema)
- [ ] Profiles table matches function schema
- [ ] Password hashes use correct bcrypt cost (should be $2a$10$)

**Code Issues:**
- [ ] Server Actions handle errors properly
- [ ] Redirect happens OUTSIDE try-catch
- [ ] Validation schemas match form fields
- [ ] Error messages are user-friendly

**Configuration Issues:**
- [ ] Email confirmation settings
- [ ] Supabase URL/keys correct
- [ ] CSP allows Supabase domains

### 6. Fix All Issues
```
For each issue found:
1. Create migration if database change needed
2. Update code if logic issue found
3. Document the fix
4. Verify fix works
```

### 7. Final Verification
```
After fixes:
1. Try signup with NEW email
2. Verify profile + role created
3. Try login with created account
4. Check redirect to correct portal
5. Confirm no console errors
```

## 📤 Deliverables

Create a report: `docs/AUTH_FIX_REPORT_[DATE].md` with:
1. Issues found (with SQL queries/code showing the problem)
2. Root causes (explain WHY each issue occurred)
3. Fixes applied (migrations + code changes)
4. Test results (before/after)
5. Remaining issues (if any)

**Be thorough. Check EVERYTHING. Fix EVERYTHING. Test EVERYTHING.**
