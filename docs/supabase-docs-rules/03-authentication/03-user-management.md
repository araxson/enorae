# 03. User Management Rules

## 3.1 User Data Retrieval

### Rule 3.1.1: Get current user information
```javascript
const { data: { user }, error } = await supabase.auth.getUser()

if (user) {
  console.log('User ID:', user.id)
  console.log('Email:', user.email)
  console.log('Created at:', user.created_at)
  console.log('User metadata:', user.user_metadata)
}
```

### Rule 3.1.2: Server-side user retrieval by ID
```javascript
// Server-side only - requires service_role key
const { data, error } = await supabase.auth.admin.getUserById(userId)
```

### Rule 3.1.3: Get user by cookie (SSR)
```javascript
// Server-side rendering context
const { data, error } = await supabase.auth.admin.getUserByCookie(req, res)
```

## 3.2 User Profile Updates

### Rule 3.2.1: Update user metadata
```javascript
const { data, error } = await supabase.auth.updateUser({
  data: {
    first_name: 'John',
    last_name: 'Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  }
})
```

### Rule 3.2.2: Update email address
```javascript
const { data, error } = await supabase.auth.updateUser({
  email: 'newemail@example.com'
})

// User will receive confirmation email
```

### Rule 3.2.3: Update password
```javascript
const { data, error } = await supabase.auth.updateUser({
  password: 'new-secure-password'
})
```

## 3.3 Admin User Management

### Rule 3.3.1: Admin update user attributes
```javascript
// Server-side only
const { data, error } = await supabase.auth.admin.updateUserById(
  userId,
  {
    email: 'admin-updated@example.com',
    email_confirmed_at: new Date().toISOString(),
    user_metadata: {
      full_name: 'Admin Updated Name'
    }
  }
)
```

### Rule 3.3.2: List all users (admin)
```javascript
// Server-side only
const { data, error } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000
})
```

### Rule 3.3.3: Generate magic links without exposing service keys
```javascript
const { data, error } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: 'invitee@example.com',
  options: {
    data: { role: 'editor' },
    redirectTo: 'https://yourapp.com/auth/callback'
  }
})

if (data?.properties?.action_link) {
  await sendCustomEmail(data.properties.action_link)
}
```

## 3.4 Multi-Factor Management

### Rule 3.4.1: Inspect enrolled factors and assurance level
```javascript
const [{ data: factors }, { data: aal }] = await Promise.all([
  supabase.auth.mfa.listFactors(),
  supabase.auth.mfa.getAuthenticatorAssuranceLevel()
])

if (aal.currentLevel === 'aal1' && factors.totp.length === 0) {
  console.log('Encourage the user to enroll MFA')
}
```

### Rule 3.4.2: Enroll a TOTP factor with challenge and verify
```javascript
const enrollment = await supabase.auth.mfa.enroll({ factorType: 'totp' })
const factorId = enrollment.data.id

const challenge = await supabase.auth.mfa.challenge({ factorId })
const verify = await supabase.auth.mfa.verify({
  factorId,
  challengeId: challenge.data.id,
  code: userSuppliedCode
})
```

### Rule 3.4.3: Unenroll a factor that is no longer valid
```javascript
await supabase.auth.mfa.unenroll({
  factorId: obsoleteFactorId
})
```

## 3.5 User Invitations

### Rule 3.4.1: Invite user by email
```javascript
const { data, error } = await supabase.auth.admin.inviteUserByEmail(
  'invited@example.com',
  {
    data: {
      role: 'editor',
      department: 'marketing'
    },
    redirectTo: 'https://yourapp.com/accept-invite'
  }
)
```

## 3.6 User Session Management

### Rule 3.5.1: Sign out user
```javascript
const { error } = await supabase.auth.signOut()

if (error) {
  console.error('Sign out error:', error.message)
} else {
  console.log('Successfully signed out')
}
```

### Rule 3.5.2: Sign out from all devices
```javascript
const { error } = await supabase.auth.signOut({ scope: 'global' })
```

### Rule 3.5.3: Refresh session
```javascript
const { data, error } = await supabase.auth.refreshSession()

if (data.session) {
  console.log('Session refreshed:', data.session.access_token)
}
```

## 3.7 Auth State Listening

### Rule 3.6.1: Listen to auth state changes
```javascript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event)
    
    switch (event) {
      case 'SIGNED_IN':
        console.log('User signed in:', session.user.email)
        break
      case 'SIGNED_OUT':
        console.log('User signed out')
        break
      case 'TOKEN_REFRESHED':
        console.log('Token refreshed')
        break
      case 'USER_UPDATED':
        console.log('User updated:', session.user)
        break
    }
  }
)

// Unsubscribe when component unmounts
// subscription.unsubscribe()
```

## 3.8 Password Recovery

### Rule 3.7.1: Reset password request
```javascript
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://yourapp.com/reset-password'
  }
)
```

### Rule 3.7.2: Update password after reset
```javascript
// Called after user clicks reset link
const { data, error } = await supabase.auth.updateUser({
  password: 'new-secure-password'
})
```

## 3.9 TypeScript User Management

### Rule 3.8.1: Type-safe user operations
```typescript
import type { User, UserAttributes, AuthError } from '@supabase/supabase-js'

const updateUserProfile = async (
  updates: UserAttributes
): Promise<{
  user: User | null,
  error: AuthError | null
}> => {
  const { data, error } = await supabase.auth.updateUser(updates)
  
  return {
    user: data.user,
    error
  }
}
```
