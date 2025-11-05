# Backend API Patterns

**Purpose:** Comprehensive production-ready guide for Server Actions, Route Handlers, validation, error handling, security, performance optimization, and advanced API patterns in Next.js 15+ App Router

**Last Updated:** 2025-01-03
**Stack Version:** Next.js 15.1.8, React 19.2.0, Zod 3.24.2, Supabase JS 2.47.15

---

## Recent Updates (Jan 2025)

### Next.js 15.1.8 Critical Changes
- **Async cookies required:** `cookies()` now returns a Promise - always `await cookies()`
- **Async params in Route Handlers:** Dynamic route params must be awaited (`await context.params`)
- **Enhanced Form component:** New `next/form` component with better client-side navigation during transitions
- **updateTag for immediate consistency:** Prefer `updateTag()` over `revalidateTag()` for read-your-own-writes pattern
- **Better error handling patterns:** Return structured error objects, never throw in Server Actions
- **Improved streaming support:** Better Server-Sent Events and streaming response handling
- **Enhanced security headers:** Built-in CSRF protection for Server Actions

### Zod 3.24.2 Features
- **Improved async validation:** Use `.safeParseAsync()` for schemas with async refinements
- **Better error formatting:** `.flatten()` provides cleaner field-level error structures
- **Enhanced refinements:** Custom validation logic with async support and better error paths
- **Type-safe parsing:** Discriminated unions for success/error states
- **Performance improvements:** Faster parsing for large schemas

### React 19.2.0 Updates
- **useActionState stable:** Officially stable hook for form state management
- **useOptimistic enhancements:** Better optimistic updates with automatic rollback
- **Better error boundaries:** Enhanced error handling for Server Components
- **Improved Suspense:** Better streaming and loading states
- **Form action enhancements:** Native form integration improvements

---

## Quick Decision Tree

```
Need to handle data mutation from a form?
  → Use Server Action (prefer this 99% of the time)

Need to expose a REST API endpoint for external clients?
  → Use Route Handler

Need to handle webhooks from third-party services?
  → Use Route Handler with signature verification

Need non-POST HTTP methods (GET, PUT, DELETE, PATCH)?
  → Use Route Handler (but consider if Server Actions can work)

Need to redirect after mutation?
  → Use Server Action with redirect()

Need to stream responses or return non-JSON data?
  → Use Route Handler with streaming

Need progressive enhancement (works without JavaScript)?
  → Use Server Action with native <form> or next/form

Need rate limiting or idempotency?
  → Use Server Action with custom middleware patterns

Need file uploads with validation?
  → Use Server Action with FormData + Zod file validation

Need background job triggers?
  → Use Server Action to enqueue, Route Handler for webhooks
```

---

## Critical Rules

### ✅ MUST Follow

1. **Always validate with Zod** - Use `safeParse()` or `safeParseAsync()` in all Server Actions and Route Handlers
2. **Always check auth first** - Call `supabase.auth.getUser()` before any database operation
3. **Always use async createClient()** - Next.js 15+ requires `await createClient()` (cookies are async)
4. **Always invalidate cache** - Use `updateTag()` for immediate consistency, `revalidateTag()` for background
5. **Always handle errors gracefully** - Return user-friendly messages, log technical details
6. **Always mark Server Actions** - Start file with `'use server'` directive
7. **Always use FormData in forms** - Extract values with `.get()`, validate with Zod
8. **Always return consistent types** - Server Actions should return same shape on success/error
9. **Always verify webhook signatures** - Use cryptographic verification for all webhooks
10. **Always sanitize file uploads** - Validate MIME types, file sizes, and content before processing

### ❌ FORBIDDEN

1. **Client-side database calls** - NEVER import `createClient` from `@/lib/supabase/client` in mutations
2. **Skipping validation** - NEVER trust FormData or request bodies without Zod validation
3. **Exposing secrets** - NEVER return service role keys, raw error objects, or sensitive data
4. **Missing auth checks** - NEVER query Supabase without verifying `user` exists
5. **Validation without Zod** - NEVER use custom validation logic (no Yup, Joi, or manual checks)
6. **Throwing in Server Actions** - NEVER throw errors in Server Actions (return error objects instead)
7. **Using getSession() for auth** - NEVER use `getSession()` for authentication (use `getUser()`)
8. **Sync cookies()** - NEVER use `cookies()` without await (Next.js 15+)
9. **Sync params** - NEVER use `context.params` without await in Route Handlers (Next.js 15+)
10. **Sync parsing with async refinements** - NEVER use `safeParse()` when schema has async refinements (use `safeParseAsync()`)
11. **Trusting file uploads** - NEVER process uploaded files without MIME type and size validation
12. **Missing rate limiting** - NEVER expose public endpoints without rate limiting for critical actions
13. **Missing idempotency** - NEVER allow duplicate critical operations (payments, bookings) without idempotency keys
14. **Unsafe error messages** - NEVER expose database errors, stack traces, or implementation details to clients

---

## Server Actions

### File Organization

```
features/
├── business/
│   └── appointments/
│       ├── api/
│       │   ├── mutations.ts          ← 'use server' at top
│       │   ├── queries.ts            ← 'server-only' import
│       │   └── middleware.ts         ← Rate limiting, auth helpers
│       ├── schema.ts                 ← Zod schemas
│       ├── types.ts                  ← TypeScript types
│       └── utils/
│           ├── validation.ts         ← Custom validation helpers
│           └── formatting.ts         ← Data transformation
```

**Rules:**
- Server Actions live in `api/mutations.ts` files
- Queries live in `api/queries.ts` files
- Always mark mutations with `'use server'` directive
- Always import `'server-only'` in queries
- Extract reusable logic to `utils/` folder

### Naming Conventions

```typescript
// ✅ CORRECT - Verb-first, descriptive, domain-specific
export async function createAppointment(formData: FormData) {}
export async function updateAppointmentStatus(id: string, status: string) {}
export async function cancelAppointmentWithRefund(id: string, reason: string) {}
export async function rescheduleAppointmentSlot(id: string, newDate: string) {}

// ❌ WRONG - Noun-first, vague, non-descriptive
export async function appointment(formData: FormData) {}
export async function handleUpdate(id: string) {}
export async function remove(id: string) {}
export async function doAction(id: string) {}
```

### Basic Server Action Pattern

```typescript
// features/business/appointments/api/mutations.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentSchema } from '../schema'
import { updateTag, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type ActionResult<T = void> = {
  error: string | null
  data?: T
  fieldErrors?: Record<string, string[]>
}

export async function createAppointment(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  // 1. Validate input with Zod
  const payload = appointmentSchema.safeParse({
    customer_id: formData.get('customer_id'),
    service_id: formData.get('service_id'),
    staff_id: formData.get('staff_id'),
    scheduled_at: formData.get('scheduled_at'),
    notes: formData.get('notes'),
  })

  if (!payload.success) {
    return {
      error: 'Validation failed',
      fieldErrors: payload.error.flatten().fieldErrors
    }
  }

  // 2. Create authenticated Supabase client
  const supabase = await createClient()

  // 3. Check authentication (ALWAYS FIRST)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Auth error:', authError)
    return { error: 'Unauthorized' }
  }

  // 4. Perform database mutation with RLS protection
  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({
      ...payload.data,
      business_id: user.id,
      created_at: new Date().toISOString(),
    })
    .select('id, scheduled_at, customer_id')
    .single()

  if (error) {
    console.error('Database error:', error.code, error.message)

    // Map specific database errors to user-friendly messages
    if (error.code === '23505') {
      return { error: 'This time slot is already booked' }
    }
    if (error.code === '23503') {
      return { error: 'Invalid customer, service, or staff selection' }
    }

    return { error: 'Failed to create appointment. Please try again.' }
  }

  // 5. Invalidate cache for immediate consistency (read-your-own-writes)
  updateTag(`appointments:${user.id}`)
  updateTag(`appointment:${data.id}`)
  updateTag(`staff-schedule:${payload.data.staff_id}`)

  // 6. Optional: Trigger background jobs (notifications, emails)
  // await queueNotification({ type: 'appointment_created', appointmentId: data.id })

  // 7. Redirect to success page
  redirect(`/business/appointments/${data.id}`)
}
```

### Advanced Server Action with Rate Limiting

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { cookies } from 'next/headers'

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function sendMessageAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Rate limiting: 5 messages per minute per user
  try {
    await limiter.check(5, user.id)
  } catch {
    return {
      error: 'Too many requests. Please wait before sending more messages.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }

  // Validation
  const result = messageSchema.safeParse({
    recipient_id: formData.get('recipient_id'),
    content: formData.get('content'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Sanitize content (prevent XSS)
  const sanitizedContent = sanitizeHtml(result.data.content, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: { a: ['href'] }
  })

  // Insert message
  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: result.data.recipient_id,
      content: sanitizedContent,
    })

  if (error) {
    console.error('Message send error:', error)
    return { error: 'Failed to send message' }
  }

  updateTag(`messages:${user.id}`)
  updateTag(`messages:${result.data.recipient_id}`)

  return { error: null }
}
```

### Idempotent Server Action (Critical Operations)

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { generateIdempotencyKey } from '@/lib/utils'

// For critical operations like payments, bookings
export async function processPaymentAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ transactionId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Extract idempotency key from form data
  const idempotencyKey = formData.get('idempotency_key') as string

  if (!idempotencyKey) {
    return { error: 'Missing idempotency key' }
  }

  // Check if this operation was already processed
  const { data: existing } = await supabase
    .schema('analytics')
    .from('transactions')
    .select('id, status')
    .eq('idempotency_key', idempotencyKey)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    // Already processed - return existing result
    return {
      error: null,
      data: { transactionId: existing.id }
    }
  }

  // Validate payment data
  const result = paymentSchema.safeParse({
    amount: Number(formData.get('amount')),
    currency: formData.get('currency'),
    payment_method: formData.get('payment_method'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Process payment (with idempotency key)
  const { data, error } = await supabase
    .schema('analytics')
    .from('transactions')
    .insert({
      user_id: user.id,
      idempotency_key: idempotencyKey,
      amount: result.data.amount,
      currency: result.data.currency,
      payment_method: result.data.payment_method,
      status: 'processing',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Payment processing error:', error)
    return { error: 'Payment failed' }
  }

  // Process payment with external provider
  // ... Stripe/payment logic here

  updateTag(`transactions:${user.id}`)

  return {
    error: null,
    data: { transactionId: data.id }
  }
}
```

### Server Action with Retry Logic

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error

      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}

export async function syncExternalDataAction(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  try {
    // Retry external API call with exponential backoff
    const externalData = await retryWithBackoff(async () => {
      const response = await fetch('https://api.example.com/data', {
        headers: { Authorization: `Bearer ${process.env.API_KEY}` }
      })

      if (!response.ok) throw new Error('API request failed')
      return response.json()
    })

    // Process and store data
    const { error } = await supabase
      .from('synced_data')
      .upsert({
        user_id: user.id,
        data: externalData,
        synced_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Database error:', error)
      return { error: 'Failed to sync data' }
    }

    updateTag(`synced-data:${user.id}`)
    return { error: null }

  } catch (error) {
    console.error('Sync failed after retries:', error)
    return { error: 'External service unavailable. Please try again later.' }
  }
}
```

### Server Action with File Upload

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// File validation schema
const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File must be less than 5MB'
    })
    .refine((file) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      return validTypes.includes(file.type)
    }, {
      message: 'Only JPEG, PNG, and WebP images are allowed'
    }),
  salon_id: z.string().uuid(),
  caption: z.string().max(500).optional(),
})

export async function uploadSalonImageAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Validate file upload
  const result = fileUploadSchema.safeParse({
    file: formData.get('file'),
    salon_id: formData.get('salon_id'),
    caption: formData.get('caption'),
  })

  if (!result.success) {
    return {
      error: 'File validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  const { file, salon_id, caption } = result.data

  // Verify user owns this salon
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('id', salon_id)
    .eq('business_id', user.id)
    .maybeSingle()

  if (!salon) {
    return { error: 'Salon not found or access denied' }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${salon_id}/${Date.now()}.${fileExt}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('salon-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { error: 'Failed to upload image' }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('salon-images')
    .getPublicUrl(fileName)

  // Save metadata to database
  const { error: dbError } = await supabase
    .schema('onboarding')
    .from('salon_media')
    .insert({
      salon_id,
      media_type: 'image',
      url: publicUrl,
      caption,
      uploaded_by: user.id,
    })

  if (dbError) {
    console.error('Database error:', dbError)
    // Cleanup: delete uploaded file
    await supabase.storage.from('salon-images').remove([fileName])
    return { error: 'Failed to save image metadata' }
  }

  updateTag(`salon-media:${salon_id}`)

  return {
    error: null,
    data: { url: publicUrl }
  }
}
```

### Multi-Step Form with State Management

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Step 1: Basic info
export async function saveBasicInfoStep(
  formData: FormData
): Promise<ActionResult<{ draftId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const result = basicInfoSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Save draft to database
  const { data, error } = await supabase
    .from('salon_drafts')
    .insert({
      user_id: user.id,
      step: 'basic_info',
      data: result.data,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Draft save error:', error)
    return { error: 'Failed to save progress' }
  }

  // Store draft ID in cookie for next step
  const cookieStore = await cookies()
  cookieStore.set('salon_draft_id', data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return {
    error: null,
    data: { draftId: data.id }
  }
}

// Step 2: Services
export async function saveServicesStep(
  formData: FormData
): Promise<ActionResult> {
  const cookieStore = await cookies()
  const draftId = cookieStore.get('salon_draft_id')?.value

  if (!draftId) {
    return { error: 'No draft found. Please start from step 1.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Validate services
  const result = servicesSchema.safeParse({
    services: JSON.parse(formData.get('services') as string),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Update draft
  const { error } = await supabase
    .from('salon_drafts')
    .update({
      step: 'services',
      data: result.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', draftId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Draft update error:', error)
    return { error: 'Failed to save progress' }
  }

  return { error: null }
}

// Step 3: Finalize and publish
export async function finalizeSalonAction(
  formData: FormData
): Promise<ActionResult<{ salonId: string }>> {
  const cookieStore = await cookies()
  const draftId = cookieStore.get('salon_draft_id')?.value

  if (!draftId) {
    return { error: 'No draft found. Please start from step 1.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Retrieve complete draft
  const { data: draft, error: draftError } = await supabase
    .from('salon_drafts')
    .select('data')
    .eq('id', draftId)
    .eq('user_id', user.id)
    .single()

  if (draftError || !draft) {
    return { error: 'Draft not found' }
  }

  // Create final salon
  const { data: salon, error: salonError } = await supabase
    .schema('onboarding')
    .from('salons')
    .insert({
      business_id: user.id,
      ...draft.data,
      status: 'active',
    })
    .select('id')
    .single()

  if (salonError) {
    console.error('Salon creation error:', salonError)
    return { error: 'Failed to create salon' }
  }

  // Cleanup draft and cookie
  await supabase.from('salon_drafts').delete().eq('id', draftId)
  cookieStore.delete('salon_draft_id')

  updateTag(`salons:${user.id}`)
  redirect(`/business/salons/${salon.id}`)
}
```

---

## Validation & Security

### Multi-Step Validation Pattern

```typescript
import { z } from 'zod'

// Client-side validation (basic)
const clientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Server-side validation (comprehensive)
const serverSchema = clientSchema.extend({
  email: z.string()
    .email()
    .refine(async (email) => {
      const supabase = await createClient()
      const { data } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle()
      return !data
    }, 'Email already registered'),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
})

// Database-level validation (constraints + RLS)
// Enforced by Postgres CHECK constraints and RLS policies

export async function registerUserAction(
  formData: FormData
): Promise<ActionResult> {
  // Step 1: Server validation
  const result = await serverSchema.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Step 2: Database operation (with RLS)
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    console.error('Signup error:', error)
    return { error: 'Registration failed' }
  }

  return { error: null }
}
```

### Input Sanitization for XSS Prevention

```typescript
'use server'

import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must not exceed 1000 characters'),
  salon_id: z.string().uuid(),
})

export async function submitReviewAction(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const result = reviewSchema.safeParse({
    rating: Number(formData.get('rating')),
    comment: formData.get('comment'),
    salon_id: formData.get('salon_id'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Sanitize HTML to prevent XSS
  const sanitizedComment = sanitizeHtml(result.data.comment, {
    allowedTags: [], // Strip all HTML tags
    allowedAttributes: {},
    textFilter: (text) => {
      // Remove any remaining script-like content
      return text.replace(/<script/gi, '&lt;script')
    }
  })

  // Additional validation: check for spam patterns
  const spamPatterns = [
    /\b(buy|cheap|discount|click here|visit)\b/gi,
    /http[s]?:\/\//gi, // URLs
    /\b\d{10,}\b/gi, // Long numbers (phone/card)
  ]

  if (spamPatterns.some(pattern => pattern.test(sanitizedComment))) {
    return { error: 'Review appears to contain spam or promotional content' }
  }

  const { error } = await supabase
    .schema('reviews')
    .from('reviews')
    .insert({
      customer_id: user.id,
      salon_id: result.data.salon_id,
      rating: result.data.rating,
      comment: sanitizedComment,
    })

  if (error) {
    console.error('Review submission error:', error)
    return { error: 'Failed to submit review' }
  }

  updateTag(`reviews:${result.data.salon_id}`)
  return { error: null }
}
```

### CSRF Protection (Built-in)

```typescript
// Next.js 15+ automatically provides CSRF protection for Server Actions
// via origin checking and custom headers

// ✅ CORRECT - Server Actions are protected by default
'use server'

export async function deleteAccountAction() {
  // Next.js automatically validates:
  // 1. Origin header matches request origin
  // 2. Custom headers present (Next-Action)
  // 3. Request came from same-site

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Safe to proceed - CSRF protection automatic
  const { error } = await supabase.auth.admin.deleteUser(user.id)

  if (error) {
    return { error: 'Failed to delete account' }
  }

  redirect('/goodbye')
}

// ❌ Route Handlers need manual CSRF protection
// app/api/delete-account/route.ts
export async function POST(request: NextRequest) {
  // Must manually verify CSRF token for Route Handlers
  const csrfToken = request.headers.get('x-csrf-token')
  const cookieToken = request.cookies.get('csrf-token')?.value

  if (!csrfToken || csrfToken !== cookieToken) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }

  // Proceed with operation
}
```

### SQL Injection Prevention

```typescript
// ✅ CORRECT - Using Supabase client (parameterized queries)
'use server'

export async function searchSalonsAction(
  searchTerm: string
): Promise<ActionResult<Salon[]>> {
  const supabase = await createClient()

  // Supabase automatically parameterizes queries - safe from SQL injection
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .ilike('name', `%${searchTerm}%`) // Safe: parameterized
    .limit(20)

  if (error) {
    console.error('Search error:', error)
    return { error: 'Search failed', data: [] }
  }

  return { error: null, data }
}

// ❌ WRONG - Raw SQL concatenation (never do this)
export async function searchSalonsUnsafe(searchTerm: string) {
  const supabase = await createClient()

  // NEVER do this - SQL injection vulnerability
  const { data } = await supabase.rpc('raw_query', {
    query: `SELECT * FROM salons WHERE name LIKE '%${searchTerm}%'`
  })

  return data
}

// ✅ CORRECT - Using RPC with parameters
export async function searchSalonsRPC(searchTerm: string) {
  const supabase = await createClient()

  // Safe: parameters are properly escaped
  const { data, error } = await supabase.rpc('search_salons', {
    p_search_term: searchTerm,
    p_limit: 20
  })

  if (error) {
    return { error: 'Search failed', data: [] }
  }

  return { error: null, data }
}
```

---

## Error Handling Framework

### Typed Error Responses

```typescript
// lib/types/errors.ts
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'

export type ActionError = {
  error: string
  code?: ErrorCode
  fieldErrors?: Record<string, string[]>
  retryable?: boolean
  retryAfter?: number // seconds
}

export type ActionSuccess<T = void> = {
  error: null
  data?: T
}

export type ActionResult<T = void> = ActionError | ActionSuccess<T>

// Type guard
export function isActionError<T>(
  result: ActionResult<T>
): result is ActionError {
  return result.error !== null
}
```

### Error Recovery Strategies

```typescript
'use server'

import { ActionResult, ErrorCode } from '@/lib/types/errors'

export async function createBookingWithRecovery(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: 'Please sign in to continue',
      code: 'UNAUTHORIZED',
      retryable: false
    }
  }

  const result = bookingSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      error: 'Please check your input',
      code: 'VALIDATION_ERROR',
      fieldErrors: result.error.flatten().fieldErrors,
      retryable: true
    }
  }

  // Attempt booking
  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({
      customer_id: user.id,
      ...result.data,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Booking error:', error.code, error.message)

    // Conflict: slot already taken
    if (error.code === '23505') {
      return {
        error: 'This time slot is no longer available. Please choose another time.',
        code: 'CONFLICT',
        retryable: true
      }
    }

    // Foreign key violation: invalid references
    if (error.code === '23503') {
      return {
        error: 'Selected service or staff is no longer available',
        code: 'NOT_FOUND',
        retryable: true
      }
    }

    // Database unavailable
    if (error.message.includes('connection')) {
      return {
        error: 'Service temporarily unavailable. Please try again in a moment.',
        code: 'EXTERNAL_SERVICE_ERROR',
        retryable: true,
        retryAfter: 60
      }
    }

    // Unknown error
    return {
      error: 'Booking failed. Our team has been notified.',
      code: 'INTERNAL_ERROR',
      retryable: true
    }
  }

  updateTag(`appointments:${user.id}`)

  return {
    error: null,
    data: { id: data.id }
  }
}
```

### User-Friendly Error Messages

```typescript
// lib/utils/error-messages.ts
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNAUTHORIZED: 'Please sign in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment and try again.',
  CONFLICT: 'This action conflicts with existing data',
  INTERNAL_ERROR: 'Something went wrong. Our team has been notified.',
  EXTERNAL_SERVICE_ERROR: 'External service temporarily unavailable',
}

export function getErrorMessage(code?: ErrorCode, custom?: string): string {
  if (custom) return custom
  if (code) return ERROR_MESSAGES[code]
  return ERROR_MESSAGES.INTERNAL_ERROR
}
```

### Error Logging and Monitoring

```typescript
'use server'

import * as Sentry from '@sentry/nextjs'

type ErrorContext = {
  userId?: string
  action: string
  metadata?: Record<string, unknown>
}

function logError(error: Error, context: ErrorContext) {
  // Console logging for development
  console.error(`[${context.action}] Error:`, {
    message: error.message,
    stack: error.stack,
    ...context
  })

  // Sentry logging for production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        action: context.action,
        userId: context.userId,
      },
      extra: context.metadata,
    })
  }
}

export async function deleteAppointmentAction(
  id: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized', code: 'UNAUTHORIZED' }

  try {
    const { error } = await supabase
      .schema('scheduling')
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('customer_id', user.id)

    if (error) {
      logError(new Error(error.message), {
        userId: user.id,
        action: 'deleteAppointment',
        metadata: { appointmentId: id, errorCode: error.code }
      })

      return {
        error: 'Failed to delete appointment',
        code: 'INTERNAL_ERROR',
        retryable: true
      }
    }

    updateTag(`appointments:${user.id}`)
    return { error: null }

  } catch (error) {
    logError(error as Error, {
      userId: user.id,
      action: 'deleteAppointment',
      metadata: { appointmentId: id }
    })

    return {
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      retryable: true
    }
  }
}
```

---

## Performance Optimization

### Request Deduplication

```typescript
'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

// Deduplicate requests within the same render
export const getAppointmentDetails = cache(async (id: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (error) throw error

  return data
})

// Usage: Called multiple times but executes only once per render
export default async function AppointmentPage({ params }: { params: { id: string } }) {
  const appointment = await getAppointmentDetails(params.id)
  const sameAppointment = await getAppointmentDetails(params.id) // Cached!

  return <div>{appointment.service_name}</div>
}
```

### Batching Multiple Actions

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

type BulkUpdateInput = {
  id: string
  status: 'confirmed' | 'cancelled'
}

export async function bulkUpdateAppointmentsAction(
  updates: BulkUpdateInput[]
): Promise<ActionResult<{ updated: number }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Validate all updates
  const schema = z.array(z.object({
    id: z.string().uuid(),
    status: z.enum(['confirmed', 'cancelled'])
  }))

  const result = schema.safeParse(updates)

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Batch update in single transaction
  const { data, error } = await supabase.rpc('bulk_update_appointments', {
    p_updates: result.data,
    p_user_id: user.id
  })

  if (error) {
    console.error('Bulk update error:', error)
    return { error: 'Failed to update appointments' }
  }

  // Invalidate cache for all updated appointments
  result.data.forEach(({ id }) => updateTag(`appointment:${id}`))
  updateTag(`appointments:${user.id}`)

  return {
    error: null,
    data: { updated: data.count }
  }
}
```

### Streaming Responses

```typescript
// app/api/stream-messages/route.ts
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Subscribe to real-time messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'communication',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`
          },
          (payload) => {
            const data = encoder.encode(`data: ${JSON.stringify(payload.new)}\n\n`)
            controller.enqueue(data)
          }
        )
        .subscribe()

      // Keep connection alive
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(': keepalive\n\n'))
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive)
        channel.unsubscribe()
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
```

### Parallel Execution Pattern

```typescript
'use server'

export async function getDashboardDataAction(): Promise<ActionResult<DashboardData>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Execute queries in parallel
  const [
    appointmentsResult,
    revenueResult,
    reviewsResult,
    staffResult
  ] = await Promise.allSettled([
    supabase.from('appointments_view').select('*').eq('business_id', user.id),
    supabase.rpc('get_monthly_revenue', { p_business_id: user.id }),
    supabase.from('reviews_summary').select('*').eq('salon_id', user.id),
    supabase.from('staff').select('id, name').eq('salon_id', user.id)
  ])

  // Handle results
  const appointments = appointmentsResult.status === 'fulfilled'
    ? appointmentsResult.value.data ?? []
    : []

  const revenue = revenueResult.status === 'fulfilled'
    ? revenueResult.value.data ?? 0
    : 0

  const reviews = reviewsResult.status === 'fulfilled'
    ? reviewsResult.value.data ?? []
    : []

  const staff = staffResult.status === 'fulfilled'
    ? staffResult.value.data ?? []
    : []

  return {
    error: null,
    data: {
      appointments,
      revenue,
      reviews,
      staff,
    }
  }
}
```

---

## Route Handlers

### Basic Route Handler

```typescript
// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', user.id)

  if (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Validate with Zod
  const result = appointmentSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        fieldErrors: result.error.flatten().fieldErrors
      },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({ ...result.data, business_id: user.id })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }

  updateTag(`appointments:${user.id}`)

  return NextResponse.json({ data }, { status: 201 })
}
```

### Dynamic Route Handler (with async params)

```typescript
// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  // ✅ Next.js 15+ - Must await params
  const { id } = await context.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('id', id)
    .eq('business_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const result = updateAppointmentSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update(result.data)
    .eq('id', id)
    .eq('business_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  updateTag(`appointment:${id}`)
  updateTag(`appointments:${user.id}`)

  return NextResponse.json({ data })
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('business_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  updateTag(`appointment:${id}`)
  updateTag(`appointments:${user.id}`)

  return NextResponse.json({ success: true })
}
```

### Webhook Handler (Signature Verification)

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Process event
  const supabase = await createClient()

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Update transaction status
      const { error } = await supabase
        .schema('analytics')
        .from('transactions')
        .update({
          status: 'completed',
          stripe_payment_intent_id: paymentIntent.id,
          completed_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)

      if (error) {
        console.error('Transaction update failed:', error)
      }

      updateTag('transactions')
      break

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object as Stripe.PaymentIntent

      await supabase
        .schema('analytics')
        .from('transactions')
        .update({
          status: 'failed',
          error_message: failedIntent.last_payment_error?.message
        })
        .eq('stripe_payment_intent_id', failedIntent.id)

      updateTag('transactions')
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
```

### Supabase Webhook Handler

```typescript
// app/api/webhooks/supabase/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

function verifySupabaseSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-supabase-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Verify signature
  const isValid = verifySupabaseSignature(
    body,
    signature,
    process.env.SUPABASE_WEBHOOK_SECRET!
  )

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)

  // Handle different webhook types
  switch (payload.type) {
    case 'INSERT':
      if (payload.table === 'appointments') {
        // Send notification
        await sendAppointmentNotification(payload.record)
      }
      break

    case 'UPDATE':
      if (payload.table === 'appointments' && payload.record.status === 'cancelled') {
        // Handle cancellation
        await handleAppointmentCancellation(payload.record)
      }
      break

    default:
      console.log(`Unhandled webhook type: ${payload.type}`)
  }

  return NextResponse.json({ received: true })
}

async function sendAppointmentNotification(appointment: any) {
  // Implementation for sending notification
  console.log('Sending notification for appointment:', appointment.id)
}

async function handleAppointmentCancellation(appointment: any) {
  // Implementation for handling cancellation
  console.log('Processing cancellation for appointment:', appointment.id)
}
```

---

## Testing Strategies

### Unit Testing Server Actions

```typescript
// features/business/appointments/api/mutations.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAppointment } from './mutations'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'user-123' } },
        error: null
      }))
    },
    schema: vi.fn(() => ({
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: 'appointment-123' },
              error: null
            }))
          }))
        }))
      }))
    }))
  }))
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  updateTag: vi.fn(),
  revalidatePath: vi.fn()
}))

// Mock redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url) => {
    throw new Error(`REDIRECT:${url}`)
  })
}))

describe('createAppointment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create appointment with valid data', async () => {
    const formData = new FormData()
    formData.append('customer_id', 'customer-123')
    formData.append('service_id', 'service-123')
    formData.append('staff_id', 'staff-123')
    formData.append('scheduled_at', '2025-01-15T10:00:00Z')

    await expect(
      createAppointment({ error: null }, formData)
    ).rejects.toThrow('REDIRECT:/business/appointments/appointment-123')
  })

  it('should return validation error for invalid data', async () => {
    const formData = new FormData()
    formData.append('customer_id', 'invalid')

    const result = await createAppointment({ error: null }, formData)

    expect(result.error).toBe('Validation failed')
    expect(result.fieldErrors).toBeDefined()
  })

  it('should return error when user is not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn(() => ({
          data: { user: null },
          error: new Error('Not authenticated')
        }))
      }
    } as any)

    const formData = new FormData()
    formData.append('customer_id', 'customer-123')
    formData.append('service_id', 'service-123')
    formData.append('staff_id', 'staff-123')
    formData.append('scheduled_at', '2025-01-15T10:00:00Z')

    const result = await createAppointment({ error: null }, formData)

    expect(result.error).toBe('Unauthorized')
  })
})
```

### Integration Testing with Database

```typescript
// features/business/appointments/api/mutations.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { createAppointment } from './mutations'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

let testUser: any
let testSalon: any

describe('createAppointment integration', () => {
  beforeAll(async () => {
    // Setup test data
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create test user
    const { data: { user } } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test-password-123'
    })
    testUser = user

    // Create test salon
    const { data: salon } = await supabase
      .from('salons')
      .insert({ business_id: user!.id, name: 'Test Salon' })
      .select()
      .single()
    testSalon = salon
  })

  afterAll(async () => {
    // Cleanup test data
    const supabase = createClient(supabaseUrl, supabaseKey)

    await supabase.from('salons').delete().eq('id', testSalon.id)
    await supabase.auth.admin.deleteUser(testUser.id)
  })

  it('should create appointment in database', async () => {
    const formData = new FormData()
    formData.append('customer_id', testUser.id)
    formData.append('service_id', 'service-123')
    formData.append('staff_id', 'staff-123')
    formData.append('scheduled_at', '2025-01-15T10:00:00Z')

    const result = await createAppointment({ error: null }, formData)

    // Verify appointment exists in database
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('customer_id', testUser.id)
      .single()

    expect(data).toBeDefined()
    expect(data.service_id).toBe('service-123')
  })
})
```

### E2E Testing with Forms

```typescript
// e2e/appointments/create.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Create Appointment', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'test-password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/business/dashboard')
  })

  test('should create appointment successfully', async ({ page }) => {
    await page.goto('/business/appointments/new')

    // Fill form
    await page.selectOption('select[name="customer_id"]', 'customer-123')
    await page.selectOption('select[name="service_id"]', 'service-123')
    await page.selectOption('select[name="staff_id"]', 'staff-123')
    await page.fill('input[name="scheduled_at"]', '2025-01-15T10:00')

    // Submit
    await page.click('button[type="submit"]')

    // Verify redirect and success
    await page.waitForURL(/\/business\/appointments\/[a-z0-9-]+/)
    await expect(page.locator('h1')).toContainText('Appointment Details')
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/business/appointments/new')

    // Submit without filling form
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.locator('.text-destructive')).toBeVisible()
  })
})
```

---

## Production Patterns

### Audit Logging

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

type AuditAction =
  | 'appointment.created'
  | 'appointment.updated'
  | 'appointment.cancelled'
  | 'user.login'
  | 'user.logout'
  | 'payment.processed'

async function logAuditEvent(
  action: AuditAction,
  userId: string,
  metadata?: Record<string, unknown>
) {
  const supabase = await createClient()

  await supabase
    .schema('analytics')
    .from('audit_logs')
    .insert({
      action,
      user_id: userId,
      metadata,
      ip_address: metadata?.ip,
      user_agent: metadata?.userAgent,
      timestamp: new Date().toISOString()
    })
}

export async function cancelAppointmentAction(
  id: string,
  reason: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Get appointment details for audit log
  const { data: appointment } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (!appointment) {
    return { error: 'Appointment not found' }
  }

  // Cancel appointment
  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update({
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('customer_id', user.id)

  if (error) {
    console.error('Cancellation error:', error)
    return { error: 'Failed to cancel appointment' }
  }

  // Log audit event
  await logAuditEvent('appointment.cancelled', user.id, {
    appointmentId: id,
    scheduledAt: appointment.scheduled_at,
    reason,
  })

  updateTag(`appointment:${id}`)
  updateTag(`appointments:${user.id}`)

  return { error: null }
}
```

### Performance Monitoring

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

async function trackPerformance(
  action: string,
  duration: number,
  metadata?: Record<string, unknown>
) {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Vercel Analytics, Datadog, etc.
    console.log('[Performance]', { action, duration, ...metadata })
  }
}

export async function performanceMonitoredAction(
  formData: FormData
): Promise<ActionResult> {
  const startTime = Date.now()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Perform action
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', user.id)

  const duration = Date.now() - startTime

  // Track performance
  await trackPerformance('fetchAppointments', duration, {
    userId: user.id,
    recordCount: data?.length ?? 0,
    success: !error
  })

  if (error) {
    return { error: 'Failed to fetch appointments' }
  }

  return { error: null, data }
}
```

### Feature Flags Integration

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

async function isFeatureEnabled(
  featureName: string,
  userId?: string
): Promise<boolean> {
  // Check feature flag from database or external service
  const supabase = await createClient()

  const { data } = await supabase
    .from('feature_flags')
    .select('enabled, rollout_percentage')
    .eq('name', featureName)
    .maybeSingle()

  if (!data) return false

  // If fully enabled
  if (data.enabled && data.rollout_percentage === 100) {
    return true
  }

  // If partial rollout, use user ID hash
  if (data.enabled && userId) {
    const hash = hashUserId(userId)
    return hash % 100 < data.rollout_percentage
  }

  return false
}

function hashUserId(userId: string): number {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export async function createAppointmentWithNewFeature(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check if new scheduling algorithm is enabled for this user
  const useNewAlgorithm = await isFeatureEnabled('new-scheduling-algorithm', user.id)

  if (useNewAlgorithm) {
    // Use new implementation
    return createAppointmentV2(formData, user.id)
  } else {
    // Use existing implementation
    return createAppointmentV1(formData, user.id)
  }
}
```

### A/B Testing Pattern

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

type Variant = 'control' | 'variant_a' | 'variant_b'

async function getExperimentVariant(
  experimentName: string,
  userId: string
): Promise<Variant> {
  const supabase = await createClient()

  // Check if user already assigned to variant
  const { data: assignment } = await supabase
    .from('experiment_assignments')
    .select('variant')
    .eq('experiment_name', experimentName)
    .eq('user_id', userId)
    .maybeSingle()

  if (assignment) {
    return assignment.variant as Variant
  }

  // Assign new variant (33% split)
  const hash = hashUserId(userId)
  const variant: Variant =
    hash % 3 === 0 ? 'control' :
    hash % 3 === 1 ? 'variant_a' : 'variant_b'

  // Store assignment
  await supabase
    .from('experiment_assignments')
    .insert({
      experiment_name: experimentName,
      user_id: userId,
      variant,
    })

  return variant
}

async function trackExperimentEvent(
  experimentName: string,
  userId: string,
  variant: Variant,
  event: string,
  metadata?: Record<string, unknown>
) {
  const supabase = await createClient()

  await supabase
    .from('experiment_events')
    .insert({
      experiment_name: experimentName,
      user_id: userId,
      variant,
      event,
      metadata,
      timestamp: new Date().toISOString()
    })
}

export async function submitBookingWithExperiment(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Get experiment variant
  const variant = await getExperimentVariant('checkout-flow-v2', user.id)

  // Track experiment start
  await trackExperimentEvent('checkout-flow-v2', user.id, variant, 'checkout_started')

  // Run variant logic
  let result: ActionResult

  if (variant === 'control') {
    result = await processBookingOriginal(formData)
  } else if (variant === 'variant_a') {
    result = await processBookingVariantA(formData)
  } else {
    result = await processBookingVariantB(formData)
  }

  // Track result
  await trackExperimentEvent('checkout-flow-v2', user.id, variant,
    result.error ? 'checkout_failed' : 'checkout_completed',
    { error: result.error }
  )

  return result
}
```

---

## Detection Commands

```bash
# Find Server Actions without 'use server'
rg --files features -g 'mutations.ts' | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# Find queries without 'server-only'
rg --files features -g 'queries.ts' | xargs -I{} sh -c "grep -L \"import 'server-only'\" {}"

# Find Server Actions using getSession() instead of getUser()
rg "getSession\(\)" features -g 'mutations.ts' --type ts

# Find Server Actions without Zod validation
rg "formData\.get\(" features -g 'mutations.ts' --type ts -A 5 | grep -v "safeParse"

# Find Server Actions without auth checks
rg "export async function" features -g 'mutations.ts' --type ts -A 10 | grep -v "getUser()"

# Find Route Handlers without error handling
rg "export async function (GET|POST|PUT|DELETE)" app/api --type ts -A 20 | grep -v "try"

# Find createClient() without await (Next.js 15+ violation)
rg "= createClient\(\)" --type ts | grep -v "await createClient"

# Find cookies() without await (Next.js 15+ violation)
rg "cookies\(\)" --type ts | grep -v "await cookies"

# Find context.params without await in Route Handlers
rg "context\.params" app/api --type ts | grep -v "await context.params"

# Find Server Actions throwing errors (should return error objects)
rg "throw new Error" features -g 'mutations.ts' --type ts

# Find unsafe FormData extraction (without Zod)
rg "formData\.get\(['\"][^'\"]+['\"]\) as" features --type ts

# Find validation without Zod (manual checks)
rg "if \(.*\.length <|if \(.*\.match\(|if \(typeof" features -g 'mutations.ts' --type ts

# Find async refinements using safeParse instead of safeParseAsync
rg "\.refine\(async" --type ts -A 10 | rg "safeParse\(" | grep -v "safeParseAsync"

# Find schemas not using flatten() for error handling
rg "\.error\.issues" features --type ts | grep -v "flatten()"

# Find old <form> tags (should use next/form for new code)
rg "<form" app --type tsx | grep -v "import Form from 'next/form'"

# Find missing rate limiting on critical actions
rg "export async function (send|create|update|delete)" features -g 'mutations.ts' --type ts -A 5 | grep -v "rateLimit"

# Find file uploads without validation
rg "formData\.get\(['\"]file['\"]\)" features --type ts -A 3 | grep -v "instanceof File"

# Find webhooks without signature verification
rg "webhooks" app/api --type ts -A 10 | grep -v "verify.*signature"

# Find critical operations without idempotency keys
rg "(payment|transaction|booking)" features -g 'mutations.ts' --type ts -A 10 | grep -v "idempotency"

# Find database errors exposed to client
rg "return.*error\.(message|code)" features -g 'mutations.ts' --type ts

# Find missing audit logging for sensitive actions
rg "export async function (delete|cancel|update)" features -g 'mutations.ts' --type ts -A 15 | grep -v "logAudit"

# Find unhandled Promise rejections
rg "await.*supabase" features --type ts | grep -v "error"

# Find missing input sanitization
rg "formData\.get\(['\"].*comment|review|message" features --type ts -A 3 | grep -v "sanitize"
```

---

## Quick Reference

| Pattern | Server Action | Route Handler |
|---------|---------------|---------------|
| **Start with** | `'use server'` | `export async function GET/POST` |
| **Validation** | `schema.safeParse(formData)` | `schema.safeParse(await req.json())` |
| **Async validation** | `await schema.safeParseAsync()` | `await schema.safeParseAsync()` |
| **Error formatting** | `error.flatten().fieldErrors` | `error.flatten().fieldErrors` |
| **Auth check** | `await supabase.auth.getUser()` | `await supabase.auth.getUser()` |
| **Return error** | `return { error: 'msg', code }` | `NextResponse.json({ error }, { status })` |
| **Success return** | `return { error: null, data }` | `NextResponse.json({ data })` |
| **Redirect** | `redirect('/path')` | `NextResponse.redirect(new URL('/path'))` |
| **Cache invalidation** | `updateTag()` (immediate) | `updateTag()` (immediate) |
| **Form component** | `<Form action={}>` (next/form) | N/A |
| **Form data** | `formData.get('field')` | `await request.formData()` |
| **JSON body** | N/A | `await request.json()` |
| **Cookies** | `await cookies()` | `await cookies()` |
| **Route params** | N/A | `await context.params` |
| **Rate limiting** | Custom middleware | Custom middleware |
| **File upload** | `formData.get('file')` + validation | `await request.formData()` |
| **Streaming** | N/A | `ReadableStream` |
| **Webhooks** | N/A | Signature verification required |
| **CSRF protection** | Built-in | Manual token verification |

---

## Advanced Patterns Summary

### Security Hardening Checklist
- ✅ Always validate with Zod (client + server)
- ✅ Always check authentication first
- ✅ Always verify webhook signatures
- ✅ Always sanitize user-generated content
- ✅ Always use RLS for database access
- ✅ Never expose database errors to clients
- ✅ Never trust file uploads without validation
- ✅ Rate limit all public endpoints

### Performance Optimization Checklist
- ✅ Use `cache()` for request deduplication
- ✅ Batch multiple operations when possible
- ✅ Use parallel execution with `Promise.all()`
- ✅ Implement streaming for large datasets
- ✅ Use `updateTag()` for immediate cache invalidation
- ✅ Optimize database queries (indexes, views)

### Production Readiness Checklist
- ✅ Implement audit logging for sensitive actions
- ✅ Add performance monitoring
- ✅ Use feature flags for gradual rollouts
- ✅ Set up A/B testing infrastructure
- ✅ Implement idempotency for critical operations
- ✅ Add retry logic with exponential backoff
- ✅ Monitor error rates and track exceptions
- ✅ Test with unit, integration, and E2E tests

---

**Related:** [07-forms.md](./07-forms.md), [05-database.md](./05-database.md), [04-nextjs.md](./04-nextjs.md), [09-auth.md](./09-auth.md), [02-typescript.md](./02-typescript.md)
