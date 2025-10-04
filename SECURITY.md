# Enorae Security Configuration

This document outlines required security configurations for the Enorae platform.

---

## Critical Security Settings

### 1. Supabase Auth Configuration

#### Leaked Password Protection ⚠️ **ACTION REQUIRED**

**Status**: Currently DISABLED
**Priority**: High

**Steps to Enable**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Enorae project
3. Navigate to **Authentication** → **Policies**
4. Find **Password Strength** section
5. Enable **"Prevent use of leaked passwords"**
6. Click **Save**

**What this does**:
- Checks passwords against HaveIBeenPwned.org database
- Prevents users from using compromised passwords
- Enhances account security significantly

**Reference**: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

---

#### Multi-Factor Authentication (MFA) ⚠️ **ACTION REQUIRED**

**Status**: Insufficient MFA options enabled
**Priority**: Medium-High

**Recommended MFA Methods**:

1. **TOTP (Time-based One-Time Password)** - Recommended ✅
   - Navigate to **Authentication** → **Providers**
   - Enable **"Time-based One-Time Password (TOTP)"**
   - Users can use apps like Google Authenticator, Authy

2. **Phone/SMS** (Optional)
   - Configure Twilio or similar SMS provider

**Steps to Enable TOTP**:
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **"Authenticator app (TOTP)"**
3. Toggle **ON**
4. Click **Save**

**Reference**: https://supabase.com/docs/guides/auth/auth-mfa

---

### 2. Database Security ✅ COMPLETE

All admin view security issues have been fixed via migration `20251003120000_fix_admin_view_security.sql`.

---

## Document Version: 1.0.0
## Last Updated: 2025-10-03
