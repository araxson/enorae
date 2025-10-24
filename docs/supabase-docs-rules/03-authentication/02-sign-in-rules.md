# 02. Sign-In Rules

## 2.1 Basic Sign-In Patterns

### Rule 2.1.1: Email and password sign-in (current API)
```javascript
// ✅ Current API - Use signInWithPassword
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'someone@email.com',
  password: 'password',
})

// Access user and session from data
if (data.user && data.session) {
  console.log('User signed in:', data.user.email)
  console.log('Session token:', data.session.access_token)
}
```

### Rule 2.1.2: Phone and password sign-in
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  phone: '+1234567890',
  password: 'password123'
})
```

### Rule 2.1.3: Provide CAPTCHA tokens when providers require it
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
  options: {
    captchaToken: turnstileResponseToken
  }
})
```

## 2.2 Migration Guide

### Rule 2.2.1: Update deprecated authentication methods
```javascript
// ❌ Deprecated v1 syntax (DO NOT USE)
const {
  body: { user },
} = await supabase.auth.login('someone@email.com', 'password')

// ❌ Deprecated v2 syntax (DO NOT USE)
const { user, error } = await supabase.auth.signIn({
  email: 'someone@email.com',
  password: 'password',
})

// ✅ Current API (ALWAYS USE THIS)
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'someone@email.com',
  password: 'password',
})

// Access user and session from data object
const user = data.user
const session = data.session
```

## 2.3 OTP Verification Rules

### Rule 2.3.1: Verify OTP for login
```javascript
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
})
```

### Rule 2.3.2: Email OTP verification
```javascript
const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email'
})
```

## 2.4 Social Authentication

### Rule 2.4.1: OAuth sign-in pattern
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000/auth/callback'
  }
})
```

### Rule 2.4.2: Multiple OAuth providers
```javascript
// Google sign-in
await supabase.auth.signInWithOAuth({ provider: 'google' })

// GitHub sign-in
await supabase.auth.signInWithOAuth({ provider: 'github' })

// Apple sign-in
await supabase.auth.signInWithOAuth({ provider: 'apple' })
```

## 2.5 Magic Link Authentication

### Rule 2.5.1: Send magic link
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://yourapp.com/auth/callback'
  }
})
```

### Rule 2.5.2: SMS magic link
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890'
})
```

## 2.6 Session Management

### Rule 2.6.1: Get current session
```javascript
const { data: { session }, error } = await supabase.auth.getSession()

if (session) {
  console.log('User is authenticated:', session.user)
} else {
  console.log('User is not authenticated')
}
```

### Rule 2.6.2: Get current user
```javascript
const { data: { user }, error } = await supabase.auth.getUser()

if (user) {
  console.log('Current user:', user.email)
}
```

## 2.7 Error Handling for Sign-In

### Rule 2.7.1: Handle authentication errors
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

if (error) {
  switch (error.message) {
    case 'Invalid login credentials':
      console.error('Wrong email or password')
      break
    case 'Email not confirmed':
      console.error('Please confirm your email first')
      break
    default:
      console.error('Authentication error:', error.message)
  }
  return
}

console.log('Successfully signed in:', data.user.email)
```

## 2.8 TypeScript Sign-In Patterns

### Rule 2.8.1: Type-safe sign-in implementation
```typescript
import type { AuthError, Session, User } from '@supabase/supabase-js'

const signInUser = async (
  email: string, 
  password: string
): Promise<{
  user: User | null,
  session: Session | null,
  error: AuthError | null
}> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return {
    user: data.user,
    session: data.session,
    error
  }
}
```

## 2.9 PKCE Sign-In Flow

### Rule 2.9.1: Redirect OAuth flows back to a code exchange route
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://your-app.com/auth/callback',
    queryParams: { prompt: 'consent' }
  }
})
```

### Rule 2.9.2: Exchange the authorization code for a session
```typescript
// app/auth/callback/route.ts
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) redirect('/dashboard')
  }

  redirect('/auth/auth-code-error')
}
```

## 2.10 Multi-Factor Authentication Challenges

### Rule 2.10.1: Detect when an additional factor is required
```javascript
const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

if (!error && data.currentLevel === 'aal1' && data.nextLevel === 'aal2') {
  setNeedsMfa(true)
}
```

### Rule 2.10.2: Challenge and verify a TOTP factor
```javascript
const factors = await supabase.auth.mfa.listFactors()
const totpFactor = factors.data.totp[0]

if (!totpFactor) throw new Error('No TOTP factor enrolled')

const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id })
const verify = await supabase.auth.mfa.verify({
  factorId: totpFactor.id,
  challengeId: challenge.data.id,
  code: userOneTimePassword
})
```
