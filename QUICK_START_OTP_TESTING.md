# 🚀 Quick Start: Test OTP Email Verification

**Status**: ✅ Ready to Test Immediately
**Time**: 2 minutes

---

## Good News! ✨

**OTP is already enabled by default in Supabase.** No configuration needed - just test it!

---

## Test the Signup Flow

### Step 1: Sign Up (30 seconds)

```bash
# Navigate to signup page
http://localhost:3000/signup
```

Fill in the form:
```
Full Name: Test User
Email: your-email@example.com
Password: Test123!@#
Confirm Password: Test123!@#
```

Click **"Sign Up"**

### Step 2: Automatic Redirect (Instant)

You'll be automatically redirected to:
```
http://localhost:3000/auth/verify-otp?email=your-email@example.com
```

### Step 3: Check Your Email (30 seconds)

Look for an email from Supabase with subject:
```
Confirm Your Email
```

Email will contain:
```
Your verification code: 123456
```

### Step 4: Enter Code (30 seconds)

1. On the OTP verification page, enter the 6-digit code
2. Click **"Verify code"**
3. ✅ Success! You'll be redirected to `/customer/salons`

---

## Test the Login Flow (Unverified Email)

### Step 1: Try to Login (Without Verifying)

```bash
# Navigate to login page
http://localhost:3000/login
```

Enter the credentials from Step 1 above (without verifying email first)

### Step 2: Automatic Redirect to OTP

You'll see error message:
```
Please verify your email address first
```

After 2 seconds, automatically redirects to:
```
http://localhost:3000/auth/verify-otp?email=your-email@example.com
```

### Step 3: Verify and Login

1. Enter the 6-digit code from your email
2. Click **"Verify code"**
3. ✅ Email verified!
4. Now you can login normally

---

## Features to Test

### ✅ OTP Input
- [ ] 6 separate input boxes
- [ ] Auto-focus next box when typing
- [ ] Paste support (paste all 6 digits at once)
- [ ] Backspace navigates to previous box
- [ ] Accessibility (keyboard navigation)

### ✅ Resend Code
- [ ] "Didn't receive the code? Resend" button
- [ ] 60-second cooldown timer
- [ ] New code sent to email
- [ ] Can request multiple times (with rate limiting)

### ✅ Error Handling
- [ ] Wrong code → Error message
- [ ] Expired code (after 60 min) → Error message
- [ ] Rate limit exceeded → Error message
- [ ] Invalid email → Error message

### ✅ Success Flow
- [ ] Code entered → Green checkmark
- [ ] "Code entered. Click verify to continue" message
- [ ] Verify button enabled
- [ ] Successful verification → Redirect to portal

---

## Expected Behavior

### Signup Flow
```
Signup Form
    ↓
Automatic Redirect to OTP Page
    ↓
Email Received (6-digit code)
    ↓
Code Entered & Verified
    ↓
Redirect to /customer/salons
```

### Login Flow (Unverified)
```
Login Form (unverified email)
    ↓
Error: "Please verify your email"
    ↓
Automatic Redirect to OTP Page (after 2s)
    ↓
Code Entered & Verified
    ↓
Can now login normally
```

---

## Troubleshooting

### Email Not Received?

1. **Check spam/junk folder**
2. **Wait 1-2 minutes** (email delivery can be slow)
3. **Click "Resend code"** (60s cooldown)
4. **Check Supabase logs**:
   ```
   Supabase Dashboard → Logs → Filter by "email"
   ```

### Code Not Working?

1. **Check if code expired** (60 min validity)
2. **Request new code** (click Resend)
3. **Verify typo** (check all 6 digits carefully)
4. **Check console** for error messages

### Redirect Not Working?

1. **Check browser console** for errors
2. **Verify email in URL** parameter
3. **Clear browser cache** and try again
4. **Check network tab** for failed requests

---

## Development Tips

### View OTP Codes in Supabase

If you're using Supabase local development:

```bash
# Check Supabase Studio
http://localhost:54323

# Navigate to: Authentication → Users
# Click on your user → See recent OTP tokens
```

### Test with Different Emails

```bash
# Gmail
test+1@gmail.com
test+2@gmail.com
test+3@gmail.com

# All deliver to: test@gmail.com
# But treated as unique emails
```

### Rate Limiting Test

Try sending **6+ OTP requests** in 15 minutes:
```
✅ Request 1-5: Success
❌ Request 6+: Rate limit error
⏰ Wait 15 minutes to reset
```

---

## Production Checklist

Before deploying to production:

- [ ] Test with real email addresses (Gmail, Outlook, etc.)
- [ ] Verify email deliverability (not in spam)
- [ ] Configure custom SMTP provider (optional but recommended)
- [ ] Customize email template with branding
- [ ] Test on mobile devices
- [ ] Test with slow internet connection
- [ ] Verify error messages are user-friendly
- [ ] Test rate limiting (5 requests per 15 min)

---

## What's Already Working ✅

1. ✅ **OTP Generation** - Supabase creates 6-digit codes
2. ✅ **Email Sending** - Supabase sends OTP emails
3. ✅ **OTP Verification** - Backend validates codes
4. ✅ **Resend Functionality** - With 60s cooldown
5. ✅ **Rate Limiting** - 5 requests per 15 min
6. ✅ **Expiration** - 60-minute validity
7. ✅ **Automatic Redirects** - From signup and login
8. ✅ **Error Handling** - User-friendly messages
9. ✅ **UI Components** - Beautiful OTP input
10. ✅ **Accessibility** - Keyboard navigation

---

## Summary

**Everything is ready to test!** Just:

1. Go to `/signup`
2. Create an account
3. Check your email
4. Enter the 6-digit code
5. Done! ✅

**No Supabase configuration needed** - OTP works out of the box.

---

**Happy Testing!** 🎉

If everything works, you can delete this file and `SUPABASE_OTP_CONFIGURATION.md`.
