# 01. Sign-Up Rules

## 1.1 Basic Sign-Up Patterns

### Rule 1.1.1: Email and password sign-up (v2 syntax)
```javascript
const { user, error } = await supabase.auth.signUp({
  email: 'someone@email.com',
  password: 'password',
})
```

### Rule 1.1.2: Phone and password sign-up
```javascript
const { data, error } = await supabase.auth.signUp({
  phone: '+1234567890',
  password: 'strongPassword123',
  options: {
    captchaToken: 'your_captcha_token_here',
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
})
```

## 1.2 Sign-Up with Additional Data

### Rule 1.2.1: Include user metadata during sign-up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe',
      age: 30
    }
  }
})
```

### Rule 1.2.2: CAPTCHA token integration
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    captchaToken: 'captcha-token-from-service'
  }
})
```

## 1.3 PKCE Flow Rules (Server-Side Auth)

### Rule 1.3.1: Point confirmations to a code-exchange route
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'valid.email@supabase.io',
  password: 'example-password',
  options: {
    emailRedirectTo: 'https://your-app.com/auth/confirm'
  }
})
```

> Note: In PKCE flows update the email template to include `?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}` so the confirm route can exchange the token. See the Supabase PKCE guide for the exact markup.

### Rule 1.3.2: Exchange the auth code for a session on the server
```typescript
// app/auth/confirm/route.ts (Next.js App Router)
import { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      await supabase.auth.exchangeCodeForSession(token_hash)
      redirect(next)
    }
  }

  redirect('/auth/auth-code-error')
}
```

> Security reminder: `exchangeCodeForSession` is required in PKCE so the server issues a verified session before redirecting.

### Rule 1.3.3: Provide a fallback error experience
```tsx
// Minimal React component rendered when verification fails
export function AuthCodeError() {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1>Link expired</h1>
      <p>Request a new confirmation email to finish signing in.</p>
    </div>
  )
}
```

## 1.4 Migration from v1 to v2 Syntax

### Rule 1.3.1: Update deprecated signup method
```javascript
// ❌ Old v1 syntax
const {
  body: { user },
} = await supabase.auth.signup('someone@email.com', 'password')

// ✅ New v2 syntax
const { user, error } = await supabase.auth.signUp({
  email: 'someone@email.com',
  password: 'password',
})
```

## 1.5 Server-Side Sign-Up Rules

### Rule 1.4.1: API endpoint pattern for phone sign-up
```javascript
// POST /auth/v1/signup/phone
const response = await fetch('/auth/v1/signup/phone', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + serviceRoleKey
  },
  body: JSON.stringify({
    phone: '+1234567890',
    password: 'strongPassword123',
    options: {
      data: {
        first_name: 'John',
        last_name: 'Doe'
      }
    }
  })
})
```

## 1.6 Error Handling for Sign-Up

### Rule 1.5.1: Always check for errors
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

if (error) {
  console.error('Sign-up error:', error.message)
  return
}

if (data.user) {
  console.log('User created:', data.user.id)
}
```

### Rule 1.5.2: Handle confirmation requirements
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

if (data.user && !data.user.email_confirmed_at) {
  console.log('Please check your email for confirmation link')
}
```

## 1.7 TypeScript Sign-Up Patterns

### Rule 1.6.1: Type-safe sign-up implementation
```typescript
import type { AuthError, User } from '@supabase/supabase-js'

const signUpUser = async (email: string, password: string): Promise<{
  user: User | null,
  error: AuthError | null
}> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  
  return {
    user: data.user,
    error
  }
}
```
