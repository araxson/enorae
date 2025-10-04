# 📧 Supabase OTP Email Verification Configuration

**Status**: ✅ Code Updated - OTP Already Enabled by Default
**Priority**: OPTIONAL (Just Testing Needed)
**Effort**: 2-5 minutes

---

## Overview

The authentication system has been updated to use **OTP (One-Time Password) email verification** instead of confirmation links. This provides:

✅ Better security
✅ Improved user experience
✅ No redirect URLs to manage
✅ Works on any device/email client

---

## Good News! ✨

**OTP is already enabled by default in Supabase!** You can start testing immediately. The configuration below is only needed if you want to customize the email templates or verify settings.

---

## Changes Made

### 1. Signup Flow Updated ✅
- **File**: `features/shared/auth/api/mutations.ts`
- **Change**: Signup now returns `requiresOTP: true` and redirects to OTP verification
- **Impact**: Users receive a 6-digit code via email instead of a confirmation link

### 2. OTP Verification Flow ✅
- **File**: `features/shared/auth/components/verify-otp-form.tsx`
- **Feature**: Already implemented with resend functionality
- **User Flow**: Signup → Receive Email → Enter 6-digit code → Verified

---

## Optional: Verify Supabase Configuration

### Check Email OTP Settings (Already Enabled ✓)

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your **Enorae project**
3. Navigate to **Authentication** → **Providers** → **Email**

You should see:

```
✅ Enable Email Provider
✅ Enable Secure email change (OTP already enabled)
```

**No changes needed!** Supabase uses OTP by default.

### Customize Email Template (Optional)

Navigate to **Authentication** → **Email Templates** → **Confirm signup**

Replace the default template with an OTP-friendly version:

```html
<h2>Welcome to Enorae!</h2>

<p>Thank you for signing up. To verify your email address, please use the following code:</p>

<div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
  {{ .Token }}
</div>

<p><strong>This code will expire in 60 minutes.</strong></p>

<p>If you didn't request this code, you can safely ignore this email.</p>

<p>Best regards,<br>The Enorae Team</p>
```

### Configure OTP Expiration (Optional)

Navigate to **Authentication** → **Settings**:

- **OTP Expiration**: 3600 seconds (60 minutes) - Recommended
- **Rate Limiting**: Keep enabled to prevent abuse

---

## Email Template Variables

When customizing email templates, use these Supabase variables:

- `{{ .Token }}` - The 6-digit OTP code
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL
- `{{ .ConfirmationURL }}` - Legacy confirmation link (not needed with OTP)

---

## Testing the OTP Flow

### 1. Test Signup

```bash
# Navigate to signup page
http://localhost:3000/signup

# Fill in the form:
Email: test@example.com
Password: Test123!@#
Full Name: Test User

# Click "Sign Up"
```

### 2. Expected Behavior

1. ✅ Form submits successfully
2. ✅ Redirects to `/auth/verify-otp?email=test@example.com`
3. ✅ User receives email with 6-digit code
4. ✅ User enters code in OTP input
5. ✅ Verification succeeds → Redirects to appropriate portal

### 3. Email Format

Subject: **Confirm Your Email**

Body:
```
Your verification code: 123456

This code will expire in 60 minutes.
```

---

## Development vs Production

### Development (Local)

For local development, Supabase sends OTP emails to **Inbucket** (if enabled) or real emails:

```bash
# Check your Supabase project for local email settings
# OTPs are logged in Supabase Studio under Authentication → Users
```

### Production

In production, configure a **custom SMTP provider** for better deliverability:

1. Navigate to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (e.g., SendGrid, AWS SES, Mailgun)

Example SMTP Configuration:
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
Sender email: noreply@enorae.com
Sender name: Enorae
```

---

## Security Considerations

### Rate Limiting ✅

OTP requests are rate-limited by default:
- **5 requests per 15 minutes** per email
- Prevents brute force attacks

### OTP Expiration ✅

- Default: **60 minutes** (3600 seconds)
- Recommended: Keep at 60 minutes for user convenience
- Can be reduced to 10-15 minutes for higher security

### Code Length ✅

- Fixed at **6 digits** (100,000 to 999,999)
- Provides 1 million possible combinations
- Combined with rate limiting = secure

---

## Troubleshooting

### Issue: OTP email not received

**Solutions**:
1. Check spam/junk folder
2. Verify email provider settings in Supabase
3. Check Supabase logs for email delivery errors
4. Use the "Resend code" button (60-second cooldown)

### Issue: "Invalid or expired token"

**Solutions**:
1. Code expired (60 minutes) - Request new code
2. Code already used - Request new code
3. Typo in code - Check digits carefully
4. Rate limit hit - Wait 15 minutes

### Issue: Redirect to OTP page not working

**Solutions**:
1. Check browser console for errors
2. Verify email parameter in URL
3. Check signup mutation returns `requiresOTP: true`

---

## Migration from Confirmation Links

If you previously used email confirmation links:

### Old Flow (Confirmation Link):
```
1. User signs up
2. Receives email with link
3. Clicks link
4. Email verified ✓
```

### New Flow (OTP):
```
1. User signs up
2. Redirects to OTP page
3. Receives email with 6-digit code
4. Enters code
5. Email verified ✓
```

### Advantages of OTP:
- ✅ Works on mobile devices better
- ✅ No URL copying/pasting needed
- ✅ Codes are shorter and easier to type
- ✅ Better security (can't be shared via URL)
- ✅ Automatic expiration

---

## Files Changed

### Backend
- `features/shared/auth/api/mutations.ts` - Signup returns OTP requirement

### Frontend
- `features/shared/auth/components/signup-form.tsx` - Redirects to OTP verification
- `features/shared/auth/components/verify-otp-form.tsx` - Already implemented ✓
- `features/shared/auth/components/otp-input.tsx` - Already implemented ✓

### Pages
- `app/(marketing)/auth/verify-otp/page.tsx` - Already exists ✓

---

## Next Steps

### Immediate (Ready to Test!)
1. ✅ **Test signup flow** - OTP already works!
2. ✅ **Check your email** - You'll receive a 6-digit code
3. ✅ **Enter code** - Verify it works

### Optional Enhancements
4. 🔄 **Customize email template** - Make it branded
5. 🔄 **Configure production SMTP** - Better deliverability (before deployment)

### After Testing
6. ✅ **Delete this file** - Once everything is confirmed working

---

## Support

If you encounter issues:

1. **Supabase Docs**: https://supabase.com/docs/guides/auth/auth-email-otp
2. **Email Templates**: https://supabase.com/docs/guides/auth/auth-email-templates
3. **SMTP Setup**: https://supabase.com/docs/guides/auth/auth-smtp

---

**Last Updated**: 2025-10-04
**Status**: Ready for Configuration
