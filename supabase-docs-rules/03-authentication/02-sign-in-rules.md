# 02. Sign-In Rules

## 2.1 Basic Sign-In Patterns

### Rule 2.1.1: Email and password sign-in (v2 syntax)
```javascript
const { user, error } = await supabase.auth.signIn({
  email: 'someone@email.com',
  password: 'password',
})
```

### Rule 2.1.2: Phone and password sign-in
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  phone: '+1234567890',
  password: 'password123'
})
```

## 2.2 Migration from v1 to v2 Syntax

### Rule 2.2.1: Update deprecated login method
```javascript
// ❌ Old v1 syntax
const {
  body: { user },
} = await supabase.auth.login('someone@email.com', 'password')

// ✅ New v2 syntax
const { user, error } = await supabase.auth.signIn({
  email: 'someone@email.com',
  password: 'password',
})
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