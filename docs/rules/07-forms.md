# Forms & Validation

**Purpose:** Server-first forms with Zod-only validation, progressive enhancement, and native HTML patterns

**Last Updated:** 2025-11-03 (ULTRA-DEEP ANALYSIS)
**Stack Version:** Zod 3.24.2 (v4.0.1 available), React 19, Next.js 15/16

**Enhancement Status:** COMPREHENSIVE - Added 12 advanced patterns covering:
- Advanced Zod schema composition and discriminated unions
- Dynamic field arrays with add/remove functionality
- Debounced async validation and auto-save patterns
- Comprehensive accessibility implementation (WCAG 2.1 AA)
- Performance optimization for large forms
- Production-ready rate limiting and audit logging
- Complete testing strategies for schemas and Server Actions

---

## Recent Updates (2025-11-03)

### Zod v4 Features Available (Optional Migration)
- **New string format functions**: Top-level functions like `z.email()`, `z.uuidv4()`, `z.url()` for better tree-shaking
- **Unified error parameter**: `error` parameter replaces deprecated `message` parameter
- **`.overwrite()` method**: Type-preserving transformations that maintain JSON Schema compatibility
- **Zod Mini**: Tree-shakable functional API alternative (`zod/mini`)

**Note:** This project currently uses Zod 3.24.2. Zod v4 patterns are documented for future migration but are not required at this time.

### React 19 Form Patterns Confirmed
- **useActionState**: Three-argument version with permalink for progressive enhancement
- **useFormStatus**: Must be called in child component of `<form>`
- **useOptimistic**: Confirmed pattern for instant UI feedback
- **Server Actions**: Remains the only approved form submission method

---

## Quick Decision Tree

```
Form submission needed?
├─ Native HTML form + Server Action (ALWAYS start here)
│  ├─ Validation needed? → Zod safeParse on server
│  ├─ Loading state? → useActionState + isPending
│  └─ Optimistic update? → useOptimistic hook
│
├─ File upload? → Native <input type="file"> + FormData
│  └─ Validate server-side with Zod .instanceof(File).refine()
│
└─ Multi-step wizard? → React state for steps + Zod per-step validation
```

---

## Critical Rules

### ✅ MUST Follow
1. **Server Actions ONLY** - All form submissions go through Next.js Server Actions
2. **Zod ONLY** - No React Hook Form, Formik, Yup, or any other form library
3. **Progressive enhancement** - Forms work without JavaScript via native HTML
4. **Server-side validation** - Always use `safeParse()` on server, never trust client
5. **useActionState** - For form state management and error display (React 19)
6. **Native HTML inputs** - Use uncontrolled inputs with `name` attributes

### ❌ FORBIDDEN
1. **React Hook Form** - STRICTLY FORBIDDEN (use native forms + Server Actions)
2. **Formik** - FORBIDDEN (use native forms + Server Actions)
3. **Yup** - FORBIDDEN (use Zod)
4. **Client-only validation** - FORBIDDEN (validate on server)
5. **useForm hook** - FORBIDDEN (use useActionState instead)
6. **zodResolver** - FORBIDDEN (we don't use React Hook Form)
7. **Controlled inputs for forms** - Use uncontrolled with `defaultValue`

---

## Patterns

### Pattern 1: Basic Server Action Form with Zod Validation
**When to use:** Any form submission that needs validation
**Implementation:**

```typescript
// app/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Define schema
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export async function updateProfile(prevState: any, formData: FormData) {
  // Validate with Zod
  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    bio: formData.get('bio'),
  })

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? 'Invalid data',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Mutation logic
  const { name, email, bio } = parsed.data
  // await db.update(...)

  revalidatePath('/profile')
  return { message: 'Profile updated successfully' }
}
```

```tsx
// app/profile/page.tsx
'use client'

import { useActionState } from 'react'
import { updateProfile } from './actions'

export default function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, {})

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={isPending}
        />
        {state?.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
        />
        {state?.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" disabled={isPending} />
        {state?.errors?.bio && (
          <p className="text-sm text-destructive">{state.errors.bio[0]}</p>
        )}
      </div>

      {state?.message && (
        <p aria-live="polite" className="text-sm">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

// ❌ WRONG - React Hook Form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// This is FORBIDDEN - use native forms + Server Actions instead
```

---

### Pattern 2: Pending State with useFormStatus
**When to use:** Extract submit button to separate component for better organization
**Critical Rule:** useFormStatus MUST be called in a component that is a child of `<form>`, NOT in the same component that renders the `<form>`.

**Implementation:**

```tsx
// components/submit-button.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export function SubmitButton({ children }: { children: React.ReactNode }) {
  // ✅ CORRECT - useFormStatus in child component of <form>
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : children}
    </Button>
  )
}

// Usage in form
<form action={formAction}>
  <input name="title" />
  <SubmitButton>Create Post</SubmitButton>
</form>

// ❌ WRONG - useFormStatus in same component as <form>
function Form() {
  const { pending } = useFormStatus() // ❌ Will NEVER be true!
  // useFormStatus does not track the form rendered in this component
  return <form action={submit}>...</form>
}

// ✅ CORRECT - useFormStatus in child component
function Submit() {
  const { pending } = useFormStatus() // ✅ Works correctly
  return <button disabled={pending}>Submit</button>
}

// Advanced: Access form data during submission
function SubmitWithData() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <div>
      <button type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit'}
      </button>
      {pending && data && (
        <p>Requesting {data.get('username')}...</p>
      )}
    </div>
  )
}
```

---

### Pattern 3: Complex Validation with Zod Refinements
**When to use:** Cross-field validation, password confirmation, conditional logic, async validation
**Implementation:**

```typescript
// Password confirmation with superRefine
const passwordSchema = z
  .object({
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['confirmPassword'],
      })
    }
  })

// Alternative using .refine() with path
const passwordSchemaAlt = z
  .object({
    password: z.string().min(12),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'], // Error will appear on confirmPassword field
  })

const appointmentSchema = z.object({
  scheduledAt: z.string().datetime('Invalid datetime format'),
  duration: z.coerce.number().min(15).max(480),
}).refine(
  (data) => new Date(data.scheduledAt) > new Date(),
  { message: 'Appointment must be in the future', path: ['scheduledAt'] }
)

const businessCustomerSchema = z
  .object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Name is required'),
    businessName: z.string().optional(),
    taxId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'business') {
      if (!data.businessName) {
        ctx.addIssue({
          code: 'custom',
          message: 'Business name is required',
          path: ['businessName'],
        })
      }
      if (!data.taxId) {
        ctx.addIssue({
          code: 'custom',
          message: 'Tax ID is required for businesses',
          path: ['taxId'],
        })
      }
    }
  })

// Async refinement example (database check)
const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
}).refine(
  async (data) => {
    // Simulate async validation (e.g., check if username exists)
    await new Promise(resolve => setTimeout(resolve, 100))
    return !await usernameExists(data.username)
  },
  {
    message: 'Username already taken',
    path: ['username'],
  }
)

// ❌ WRONG - Using .parse() with async refinement
const result = schema.parse(data) // Will throw error!

// ✅ CORRECT - Using .parseAsync() with async refinement
const result = await schema.parseAsync(data)

// ✅ CORRECT - Using .safeParseAsync() (preferred)
const result = await schema.safeParseAsync(data)
if (!result.success) {
  // Handle errors
}

// ❌ WRONG - Client-side validation only
const handleSubmit = (e) => {
  e.preventDefault()
  const result = schema.safeParse(data)
  // Validation only on client is FORBIDDEN
}

// ✅ CORRECT - Server-side validation
export async function submitForm(prevState: any, formData: FormData) {
  'use server'
  const result = schema.safeParse(Object.fromEntries(formData))
  // Validation on server is REQUIRED
}

// ✅ CORRECT - Async server-side validation
export async function submitFormAsync(prevState: any, formData: FormData) {
  'use server'
  const result = await userSchema.safeParseAsync({
    email: formData.get('email'),
    username: formData.get('username'),
  })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }
  // ... mutation
}
```

---

### Pattern 4: File Upload with Validation
**When to use:** Image uploads, document uploads, media files
**Implementation:**

```typescript
// app/actions.ts
'use server'

import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const avatarSchema = z.object({
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'File must be less than 5MB',
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only JPEG, PNG, and WebP images are allowed',
    }),
})

export async function uploadAvatar(prevState: any, formData: FormData) {
  const parsed = avatarSchema.safeParse({
    file: formData.get('file'),
  })

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? 'Invalid file',
    }
  }

  const { file } = parsed.data

  // Upload to storage (e.g., Supabase Storage)
  // const { data, error } = await supabase.storage
  //   .from('avatars')
  //   .upload(`${userId}/${file.name}`, file)

  return { message: 'Avatar uploaded successfully' }
}
```

```tsx
// app/profile/avatar-upload.tsx
'use client'

import { useActionState } from 'react'
import { uploadAvatar } from './actions'

export default function AvatarUpload() {
  const [state, formAction, isPending] = useActionState(uploadAvatar, {})

  return (
    <form action={formAction}>
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp"
        required
        disabled={isPending}
      />

      {state?.message && (
        <p className="text-sm">{state.message}</p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Uploading...' : 'Upload Avatar'}
      </button>
    </form>
  )
}

// ❌ WRONG - Controlled file input
const [file, setFile] = useState<File | null>(null)
<input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
// File inputs cannot be controlled - use FormData

// ✅ CORRECT - Uncontrolled file input with FormData
<input type="file" name="file" />
```

---

### Pattern 5: Optimistic Updates with useOptimistic
**When to use:** Instant UI feedback before server confirmation (likes, comments, etc.)
**Implementation:**

```tsx
'use client'

import { useOptimistic } from 'react'
import { sendMessage } from './actions'

type Message = {
  text: string
  sending?: boolean
}

export function MessageThread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newMessage) => [
    ...state,
    { text: newMessage, sending: true },
  ])

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string
    addOptimisticMessage(message)
    await sendMessage(formData)
  }

  return (
    <>
      {optimisticMessages.map((m, i) => (
        <div key={i}>
          {m.text}
          {m.sending && <small className="text-muted"> (Sending...)</small>}
        </div>
      ))}

      <form action={formAction}>
        <input type="text" name="message" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </>
  )
}
```

```typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
  const message = formData.get('message') as string

  // Save to database
  // await db.messages.create({ text: message })

  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

  revalidatePath('/messages')
}
```

---

### Pattern 6: Multi-Step Form Wizard
**When to use:** Complex forms with multiple sections (onboarding, checkout, etc.)
**Implementation:**

```tsx
'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { createAccount } from './actions'

const steps = ['Personal', 'Business', 'Verify'] as const

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, formAction, isPending] = useActionState(createAccount, {})

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <form action={formAction}>
      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`flex-1 h-2 rounded ${
              i <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {currentStep === 0 && (
        <div>
          <h2>Personal Information</h2>
          <input name="name" placeholder="Full name" required />
          <input name="email" type="email" placeholder="Email" required />
          <button type="button" onClick={nextStep}>Next</button>
        </div>
      )}

      {/* Step 2: Business Info */}
      {currentStep === 1 && (
        <div>
          <h2>Business Information</h2>
          <input name="businessName" placeholder="Business name" required />
          <input name="taxId" placeholder="Tax ID" required />
          <div className="flex gap-2">
            <button type="button" onClick={prevStep}>Back</button>
            <button type="button" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}

      {/* Step 3: Verification */}
      {currentStep === 2 && (
        <div>
          <h2>Verify Details</h2>
          <p>Review your information before submitting.</p>
          {state?.message && <p>{state.message}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={prevStep}>Back</button>
            <button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
```

---

### Pattern 7: Common Zod Validation Patterns
**When to use:** Reusable validation schemas across forms
**Implementation:**

```typescript
import { z } from 'zod'

// Email validation with transform
export const emailSchema = z
  .string()
  .email('Enter a valid email')
  .transform((val) => val.toLowerCase().trim())

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number')
  .or(z.literal('')) // Optional phone

// URL validation
export const websiteSchema = z
  .string()
  .url('Enter a valid URL')
  .or(z.literal('')) // Optional URL

// UUID validation (multiple versions)
export const uuidSchema = z.string().uuid() // Any version
export const uuidv4Schema = z.string().uuid({ version: 'v4' }) // Specific version
// Convenience methods: z.uuidv4(), z.uuidv6(), z.uuidv7(), z.uuidv8()

// Price validation
export const priceSchema = z
  .coerce
  .number()
  .min(0, 'Price cannot be negative')
  .max(999999, 'Price too high')
  .multipleOf(0.01, 'Use up to 2 decimal places')

// Array validation
export const servicesSchema = z
  .array(z.string().uuid())
  .min(1, 'Select at least one service')
  .max(5, 'Maximum 5 services per booking')

// Date validation
export const futureDateSchema = z
  .string()
  .datetime('Invalid datetime format')
  .refine((date) => new Date(date) > new Date(), {
    message: 'Date must be in the future',
  })

// Operating hours validation
export const operatingHoursSchema = z
  .object({
    openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
    closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  })
  .refine((data) => data.closeTime > data.openTime, {
    message: 'Close time must be after open time',
    path: ['closeTime'],
  })

// Enum validation
export const currencySchema = z.enum(['USD', 'EUR', 'GBP'], {
  errorMap: () => ({ message: 'Select a valid currency' }),
})

// String transforms (Zod 3.x)
export const trimmedStringSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(z.string().min(1, 'Field is required'))

// Multiple string validations chained
export const complexString = z.string()
  .min(5, 'Too short')
  .max(10, 'Too long')
  .includes('@', 'Must contain @')
  .trim()
  .toLowerCase()

// String format validations
export const stringFormats = {
  email: z.string().email(),
  url: z.string().url(),
  uuid: z.string().uuid(),
  cuid: z.string().cuid(),
  ulid: z.string().ulid(),
  emoji: z.string().emoji(),
  ipv4: z.string().ip({ version: 'v4' }),
  ipv6: z.string().ip({ version: 'v6' }),
}

// Zod v4 Preview: Top-level format functions (for future migration)
// z.email()
// z.url()
// z.uuidv4()
// z.uuidv7()
// z.ipv4()
// z.ipv6()
```

---

### Pattern 8: Error Handling and Display
**When to use:** Consistent error messaging across all forms
**Implementation:**

```tsx
'use client'

import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateSettings } from './actions'

export default function SettingsForm() {
  const [state, formAction, isPending] = useActionState(updateSettings, {})

  return (
    <form action={formAction}>
      {/* Global form error */}
      {state?.message && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Field-level errors */}
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" disabled={isPending} />
        {state?.errors?.name && (
          <p className="text-sm text-destructive" role="alert">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      {/* Success message */}
      {state?.success && (
        <Alert variant="default">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Settings updated successfully</AlertDescription>
        </Alert>
      )}

      <button type="submit" disabled={isPending}>
        Save Changes
      </button>
    </form>
  )
}
```

```typescript
// app/actions.ts
'use server'

import { z } from 'zod'

export async function updateSettings(prevState: any, formData: FormData) {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
  })

  const parsed = schema.safeParse({
    name: formData.get('name'),
  })

  if (!parsed.success) {
    return {
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
      success: false,
    }
  }

  try {
    // Mutation logic
    // await db.update(...)

    return {
      message: 'Settings updated',
      success: true,
    }
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }
  }
}
```

---

### Pattern 9: Progressive Enhancement with Permalink
**When to use:** Ensure form works before JavaScript loads (React 19 feature)
**Implementation:**

```tsx
'use client'

import { useActionState } from 'react'
import { updateProfile } from './actions'

export default function ProfileForm() {
  // Third argument is permalink for progressive enhancement
  // If form submits before JS loads, React redirects to this URL
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    null,
    '/profile/update' // ← Permalink
  )

  return (
    <form action={formAction}>
      <input name="name" required />
      <button type="submit" disabled={isPending}>
        Update Profile
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}
```

```typescript
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function updateProfile(prevState: any, formData: FormData) {
  const name = formData.get('name') as string

  // ... validation and mutation

  // If coming from permalink (no JS), this redirect works
  // If coming from JS, this also works
  redirect('/profile')
}
```

**Why this matters:**
- Form works even if JavaScript hasn't loaded yet
- React can redirect to permalink URL before hydration completes
- Provides true progressive enhancement without extra code

---

### Pattern 10: Redirecting After Success
**When to use:** Navigate to different page after successful form submission
**Implementation:**

```typescript
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
})

export async function createPost(prevState: any, formData: FormData) {
  const parsed = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? 'Invalid data',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Create post
  // const post = await db.post.create({ data: parsed.data })
  const postId = 'new-post-id'

  revalidatePath('/posts')
  redirect(`/posts/${postId}`) // Short-circuit rendering, navigate immediately
}

// ❌ WRONG - Redirecting in client component
const handleSubmit = async () => {
  await createPost()
  router.push('/posts') // Don't do this
}

// ✅ CORRECT - Redirect in Server Action
export async function createPost(...) {
  // ... mutation logic
  redirect('/posts') // Do this
}
```

---

## Detection Commands

```bash
# Find React Hook Form usage (FORBIDDEN)
rg "useForm\(" --type tsx features
rg "from ['\"]react-hook-form['\"]" --type tsx features
rg "zodResolver" --type tsx features
rg "@hookform/resolvers" --type tsx features

# Find Formik usage (FORBIDDEN)
rg "useFormik\(" --type tsx features
rg "from ['\"]formik['\"]" --type tsx features

# Find Yup usage (FORBIDDEN)
rg "from ['\"]yup['\"]" --type ts features

# Find client-side Supabase mutations (should be in Server Actions)
rg "supabase\.(from|rpc)" --type tsx features -g "!actions.ts"

# Find forms without Server Actions
rg "<form" --type tsx features | rg -v "action="

# Find missing useActionState for forms with actions
rg "action={" --type tsx features -A 5 | rg -v "useActionState"

# Find controlled file inputs (should be uncontrolled)
rg "onChange.*File" --type tsx features

# Verify Zod validation is server-side
rg "safeParse" --type ts features -g "actions.ts" # Should find many
rg "safeParse" --type tsx features -g "!actions.ts" # Should find none

# Find forms missing progressive enhancement (no 'use client')
rg "<form action=" --type tsx features | rg -B 5 "^'use client'"

# Find incorrect useFormStatus usage (in same component as <form>)
rg "useFormStatus" --type tsx features -A 10 | rg "return.*<form"

# Find async refinements without parseAsync/safeParseAsync
rg "\.refine\(async" --type ts features -A 5 | rg -v "(parseAsync|safeParseAsync)"

# Find deprecated Zod message parameter (should use error in v4)
rg "\.min\([^)]*message:" --type ts features
rg "\.max\([^)]*message:" --type ts features
rg "\.refine\([^)]*message:" --type ts features

# Find missing permalink in useActionState (3rd argument)
rg "useActionState\([^)]+\)" --type tsx features | rg -v "useActionState\([^,]+,[^,]+,[^)]+\)"

# Verify error flattening for field errors
rg "error\.flatten\(\)\.fieldErrors" --type ts features -g "actions.ts"

# Find forms without disabled state during pending
rg "disabled={isPending}" --type tsx features
```

---

## Quick Reference

| Pattern | Trigger | Example |
|---------|---------|---------|
| Basic form | Any data submission | `<form action={serverAction}>` |
| Validation | User input needs checking | `schema.safeParse(Object.fromEntries(formData))` |
| Async validation | Database/API check needed | `await schema.safeParseAsync(data)` |
| Loading state | Show pending during submit | `const [state, action, isPending] = useActionState(...)` |
| Progressive enhancement | Pre-hydration form submit | `useActionState(action, null, '/permalink')` |
| Submit button state | Extract button logic | `useFormStatus()` in child component |
| File upload | Image/document upload | `z.instanceof(File).refine(...)` |
| Optimistic update | Instant feedback needed | `useOptimistic(data, updateFn)` |
| Multi-step | Complex wizard flow | `useState` for step + validate per step |
| Error display | Show validation errors | `state?.errors?.fieldName?.[0]` |
| Redirect | Navigate after success | `redirect('/path')` in Server Action |
| Cache refresh | Update after mutation | `revalidatePath('/path')` |

### Zod Version Compatibility

| Feature | Zod 3.x (Current) | Zod v4 (Available) | Migration Required |
|---------|-------------------|--------------------|--------------------|
| String formats | `z.string().email()` | `z.email()` (top-level) | Optional (both work) |
| Error messages | `{ message: 'error' }` | `{ error: 'error' }` | Recommended |
| Transforms | `.transform()` | `.transform()` + `.overwrite()` | Optional |
| Refinements | `.refine()`, `.superRefine()` | Same + `.check()` | No change needed |
| Async parsing | `.parseAsync()`, `.safeParseAsync()` | Same | No change needed |
| Error handling | `.flatten()`, `.format()` | Same | No change needed |

---

## Accessibility Requirements

1. **Labels**: Every input MUST have associated `<label>` with `htmlFor`
2. **Error announcements**: Use `aria-live="polite"` for error messages
3. **Disabled states**: Disable form during `isPending` to prevent double-submit
4. **Focus management**: Return focus to first error field after validation
5. **Required fields**: Use native `required` attribute + Zod validation
6. **Keyboard navigation**: Ensure tab order is logical

```tsx
// ✅ CORRECT - Accessible form
<form action={formAction}>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-invalid={!!state?.errors?.email}
    aria-describedby={state?.errors?.email ? 'email-error' : undefined}
    disabled={isPending}
  />
  {state?.errors?.email && (
    <p id="email-error" className="text-sm text-destructive" role="alert">
      {state.errors.email[0]}
    </p>
  )}

  <p aria-live="polite" className="sr-only">
    {isPending ? 'Form is submitting' : ''}
  </p>

  <button type="submit" disabled={isPending}>
    Submit
  </button>
</form>

// ❌ WRONG - Missing accessibility features
<form>
  <input name="email" /> {/* No label */}
  <span>{error}</span> {/* No aria-live */}
  <button>Submit</button> {/* No disabled state */}
</form>
```

---

## Common Mistakes to Avoid

### Mistake 1: Using React Hook Form
```tsx
// ❌ FORBIDDEN
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  // STOP - React Hook Form is FORBIDDEN
}

// ✅ CORRECT
'use client'
import { useActionState } from 'react'

function MyForm() {
  const [state, formAction, isPending] = useActionState(serverAction, {})
  return <form action={formAction}>...</form>
}
```

### Mistake 2: Client-Side Validation Only
```tsx
// ❌ FORBIDDEN - Client-side validation only
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const result = schema.safeParse(data)
  if (result.success) {
    fetch('/api/submit', { body: JSON.stringify(result.data) })
  }
}

// ✅ CORRECT - Server-side validation
'use server'
export async function submitForm(prevState: any, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }
  // ... mutation
}
```

### Mistake 3: Controlled File Inputs
```tsx
// ❌ WRONG - Controlled file input
const [file, setFile] = useState<File | null>(null)
<input type="file" onChange={(e) => setFile(e.target.files?.[0])} />

// ✅ CORRECT - Uncontrolled file input
<input type="file" name="file" />
// Access via FormData in Server Action
```

### Mistake 4: Missing Progressive Enhancement
```tsx
// ❌ WRONG - Form only works with JavaScript
<button onClick={async () => {
  await submitData()
}}>Submit</button>

// ✅ CORRECT - Works without JavaScript
<form action={serverAction}>
  <button type="submit">Submit</button>
</form>

// ✅ EVEN BETTER - Progressive enhancement with permalink (React 19)
function MyForm() {
  const [state, action] = useActionState(serverAction, null, '/fallback-url')
  return (
    <form action={action}>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Mistake 5: Using .parse() with Async Refinements
```tsx
// ❌ WRONG - Will throw error
const schema = z.string().refine(async (val) => await checkDB(val))
const result = schema.parse(data) // ❌ Error: async refinement needs parseAsync

// ✅ CORRECT - Use parseAsync or safeParseAsync
const result = await schema.parseAsync(data)
// or
const result = await schema.safeParseAsync(data)
```

### Mistake 6: useFormStatus in Wrong Component
```tsx
// ❌ WRONG - useFormStatus in same component as <form>
function MyForm() {
  const { pending } = useFormStatus() // Will NEVER be true!
  return <form action={action}>...</form>
}

// ✅ CORRECT - useFormStatus in child of <form>
function SubmitButton() {
  const { pending } = useFormStatus() // Works correctly
  return <button disabled={pending}>Submit</button>
}

function MyForm() {
  return (
    <form action={action}>
      <SubmitButton />
    </form>
  )
}
```

---

## Zod v4 Migration Guide (Optional)

**Current Status:** This project uses Zod 3.24.2. Zod v4.0.1 is available but migration is optional.

### When to Migrate
- **Now:** If you want better tree-shaking and smaller bundles
- **Later:** Current Zod 3.x patterns work fine and are fully supported
- **Never:** No breaking changes force migration

### Key Changes in Zod v4

#### 1. Error Parameter (Recommended Change)
```typescript
// Zod 3.x (Still works in v4)
z.string().min(5, { message: 'Too short' })
z.string().refine(check, { message: 'Invalid' })

// Zod v4 (New style)
z.string().min(5, { error: 'Too short' })
z.string().refine(check, { error: 'Invalid' })
```

#### 2. Top-Level String Format Functions (Optional)
```typescript
// Zod 3.x
z.string().email()
z.string().url()
z.string().uuid()

// Zod v4 (Better tree-shaking)
z.email()
z.url()
z.uuidv4()
z.uuidv7()
z.ipv4()
z.iso.datetime()
```

#### 3. New .overwrite() Method (Optional)
```typescript
// Use when you need type-preserving transforms
const schema = z.number().overwrite(val => val ** 2).max(100)
// Unlike .transform(), .overwrite() maintains the number type
```

#### 4. Zod Mini (Advanced)
```typescript
// Functional API for maximum tree-shaking
import * as z from 'zod/mini'

z.string().check(
  z.minLength(5),
  z.maxLength(10),
  z.refine(val => val.includes('@'))
)
```

### Migration Strategy
1. **Update gradually** - Both styles work in v4
2. **Start with new files** - Use `{ error: ... }` in new schemas
3. **Automated refactor** - Use find/replace for `message:` → `error:`
4. **No rush** - Zod 3.x patterns remain valid

---

## Advanced Patterns

### Pattern 11: Schema Composition and Reusability
**When to use:** Build complex schemas from reusable base schemas
**Implementation:**

```typescript
// lib/schemas/base.ts
import { z } from 'zod'

// Base schemas for composition
export const timestampSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'Use 2-letter state code'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
})

export const contactSchema = z.object({
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
})

// Compose into complex schemas
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
}).merge(contactSchema).merge(timestampSchema)

export const businessSchema = z.object({
  businessName: z.string().min(1, 'Business name required'),
  taxId: z.string().min(9, 'Valid tax ID required'),
}).merge(contactSchema).merge(addressSchema).merge(timestampSchema)

// Partial schemas for updates
export const updateCustomerSchema = customerSchema.partial().required({ email: true })

// Pick specific fields
export const customerContactOnlySchema = customerSchema.pick({
  email: true,
  phone: true,
})

// Omit sensitive fields
export const customerPublicSchema = customerSchema.omit({
  createdAt: true,
  updatedAt: true,
})

// Extend schemas
export const premiumCustomerSchema = customerSchema.extend({
  membershipTier: z.enum(['gold', 'platinum', 'diamond']),
  loyaltyPoints: z.number().int().min(0),
})
```

---

### Pattern 12: Discriminated Unions for Polymorphic Forms
**When to use:** Forms where field requirements change based on a discriminator field
**Implementation:**

```typescript
// Notification preferences schema with discriminated union
const emailNotificationSchema = z.object({
  type: z.literal('email'),
  email: z.string().email('Valid email required'),
  frequency: z.enum(['instant', 'daily', 'weekly']),
})

const smsNotificationSchema = z.object({
  type: z.literal('sms'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Valid phone required'),
  frequency: z.enum(['instant', 'daily']), // SMS doesn't support weekly
})

const pushNotificationSchema = z.object({
  type: z.literal('push'),
  deviceToken: z.string().min(1, 'Device token required'),
  frequency: z.literal('instant'), // Push is always instant
})

export const notificationPreferenceSchema = z.discriminatedUnion('type', [
  emailNotificationSchema,
  smsNotificationSchema,
  pushNotificationSchema,
])

// Server Action
export async function updateNotificationPreference(
  prevState: any,
  formData: FormData
) {
  'use server'

  const parsed = notificationPreferenceSchema.safeParse({
    type: formData.get('type'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    deviceToken: formData.get('deviceToken'),
    frequency: formData.get('frequency'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  // TypeScript knows the exact type based on discriminator
  if (parsed.data.type === 'email') {
    // parsed.data.email is available (type-safe)
    // parsed.data.phone is NOT available (correctly)
  }

  return { message: 'Preferences updated' }
}
```

```tsx
// Client component with conditional fields
'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { updateNotificationPreference } from './actions'

export default function NotificationForm() {
  const [notifType, setNotifType] = useState<'email' | 'sms' | 'push'>('email')
  const [state, formAction, isPending] = useActionState(
    updateNotificationPreference,
    {}
  )

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="type">Notification Type</label>
        <select
          id="type"
          name="type"
          value={notifType}
          onChange={(e) => setNotifType(e.target.value as any)}
          disabled={isPending}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
      </div>

      {/* Conditional fields based on type */}
      {notifType === 'email' && (
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
          />
          {state?.errors?.email && (
            <p className="text-sm text-destructive">{state.errors.email[0]}</p>
          )}
        </div>
      )}

      {notifType === 'sms' && (
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            disabled={isPending}
          />
          {state?.errors?.phone && (
            <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
          )}
        </div>
      )}

      {notifType === 'push' && (
        <div>
          <label htmlFor="deviceToken">Device Token</label>
          <input
            id="deviceToken"
            name="deviceToken"
            required
            disabled={isPending}
          />
          {state?.errors?.deviceToken && (
            <p className="text-sm text-destructive">
              {state.errors.deviceToken[0]}
            </p>
          )}
        </div>
      )}

      {/* Frequency field with conditional options */}
      <div>
        <label htmlFor="frequency">Frequency</label>
        <select id="frequency" name="frequency" required disabled={isPending}>
          <option value="instant">Instant</option>
          {notifType !== 'push' && <option value="daily">Daily</option>}
          {notifType === 'email' && <option value="weekly">Weekly</option>}
        </select>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  )
}
```

---

### Pattern 13: Dynamic Field Arrays (Add/Remove Items)
**When to use:** Forms with repeatable sections (multiple addresses, services, etc.)
**Implementation:**

```typescript
// Schema for dynamic array of services
const serviceItemSchema = z.object({
  serviceId: z.string().uuid('Invalid service'),
  staffId: z.string().uuid('Invalid staff member'),
  duration: z.coerce.number().min(15).max(480),
  price: z.coerce.number().min(0),
})

export const bookingSchema = z.object({
  customerId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  services: z
    .array(serviceItemSchema)
    .min(1, 'At least one service required')
    .max(5, 'Maximum 5 services per booking'),
})

export async function createBooking(prevState: any, formData: FormData) {
  'use server'

  // Parse dynamic array from FormData
  const services: any[] = []
  let index = 0

  while (formData.has(`services[${index}].serviceId`)) {
    services.push({
      serviceId: formData.get(`services[${index}].serviceId`),
      staffId: formData.get(`services[${index}].staffId`),
      duration: formData.get(`services[${index}].duration`),
      price: formData.get(`services[${index}].price`),
    })
    index++
  }

  const parsed = bookingSchema.safeParse({
    customerId: formData.get('customerId'),
    scheduledAt: formData.get('scheduledAt'),
    services,
  })

  if (!parsed.success) {
    return {
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Create booking with multiple services
  // await db.booking.create({ data: parsed.data })

  return { message: 'Booking created successfully' }
}
```

```tsx
// Client component with dynamic fields
'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { createBooking } from './actions'

type Service = {
  id: string
  serviceId: string
  staffId: string
  duration: number
  price: number
}

export default function BookingForm() {
  const [services, setServices] = useState<Service[]>([
    { id: crypto.randomUUID(), serviceId: '', staffId: '', duration: 30, price: 0 },
  ])
  const [state, formAction, isPending] = useActionState(createBooking, {})

  const addService = () => {
    if (services.length < 5) {
      setServices([
        ...services,
        { id: crypto.randomUUID(), serviceId: '', staffId: '', duration: 30, price: 0 },
      ])
    }
  }

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices(services.filter((s) => s.id !== id))
    }
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="customerId" value="user-id-here" />
      <input type="hidden" name="scheduledAt" value={new Date().toISOString()} />

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={service.id} className="border p-4 rounded-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">Service {index + 1}</h3>
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="text-destructive text-sm"
                  disabled={isPending}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`service-${index}`}>Service</label>
                <select
                  id={`service-${index}`}
                  name={`services[${index}].serviceId`}
                  required
                  disabled={isPending}
                >
                  <option value="">Select service...</option>
                  <option value="service-1">Haircut</option>
                  <option value="service-2">Color</option>
                </select>
              </div>

              <div>
                <label htmlFor={`staff-${index}`}>Staff</label>
                <select
                  id={`staff-${index}`}
                  name={`services[${index}].staffId`}
                  required
                  disabled={isPending}
                >
                  <option value="">Select staff...</option>
                  <option value="staff-1">Alice</option>
                  <option value="staff-2">Bob</option>
                </select>
              </div>

              <div>
                <label htmlFor={`duration-${index}`}>Duration (min)</label>
                <input
                  id={`duration-${index}`}
                  name={`services[${index}].duration`}
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  defaultValue={30}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor={`price-${index}`}>Price ($)</label>
                <input
                  id={`price-${index}`}
                  name={`services[${index}].price`}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length < 5 && (
        <button
          type="button"
          onClick={addService}
          className="mt-4 text-sm text-primary"
          disabled={isPending}
        >
          + Add Another Service
        </button>
      )}

      {state?.errors?.services && (
        <p className="text-sm text-destructive mt-2">
          {state.errors.services[0]}
        </p>
      )}

      {state?.message && (
        <p className="mt-4" aria-live="polite">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={isPending} className="mt-6">
        {isPending ? 'Creating Booking...' : 'Create Booking'}
      </button>
    </form>
  )
}
```

---

### Pattern 14: Debounced Async Validation
**When to use:** Check username availability, email uniqueness, etc., without hammering the server
**Implementation:**

```typescript
// lib/hooks/use-debounced-validation.ts
'use client'

import { useState, useEffect, useCallback } from 'react'

export function useDebouncedValidation(
  value: string,
  validationFn: (value: string) => Promise<{ valid: boolean; message?: string }>,
  delay = 500
) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    message?: string
  } | null>(null)

  const validate = useCallback(async (val: string) => {
    if (!val) {
      setValidationResult(null)
      return
    }

    setIsValidating(true)
    try {
      const result = await validationFn(val)
      setValidationResult(result)
    } catch (error) {
      setValidationResult({ valid: false, message: 'Validation failed' })
    } finally {
      setIsValidating(false)
    }
  }, [validationFn])

  useEffect(() => {
    const timer = setTimeout(() => {
      validate(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay, validate])

  return { isValidating, validationResult }
}
```

```typescript
// app/actions.ts
'use server'

export async function checkUsernameAvailability(username: string) {
  // Simulate database check
  await new Promise((resolve) => setTimeout(resolve, 300))

  const taken = ['admin', 'user', 'test'].includes(username.toLowerCase())

  return {
    valid: !taken,
    message: taken ? 'Username is already taken' : 'Username is available',
  }
}
```

```tsx
// Component with debounced validation
'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { useDebouncedValidation } from '@/lib/hooks/use-debounced-validation'
import { checkUsernameAvailability, createAccount } from './actions'

export default function SignupForm() {
  const [username, setUsername] = useState('')
  const [state, formAction, isPending] = useActionState(createAccount, {})

  const { isValidating, validationResult } = useDebouncedValidation(
    username,
    checkUsernameAvailability
  )

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isPending}
          aria-invalid={validationResult?.valid === false}
          aria-describedby="username-feedback"
        />

        <div id="username-feedback" className="text-sm mt-1">
          {isValidating && (
            <span className="text-muted-foreground">Checking availability...</span>
          )}
          {!isValidating && validationResult?.valid === true && (
            <span className="text-green-600">✓ {validationResult.message}</span>
          )}
          {!isValidating && validationResult?.valid === false && (
            <span className="text-destructive">✗ {validationResult.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || isValidating || validationResult?.valid === false}
      >
        {isPending ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}
```

---

### Pattern 15: Auto-Save with Debouncing
**When to use:** Long forms, draft content, user preferences (save without explicit submit)
**Implementation:**

```typescript
// lib/hooks/use-auto-save.ts
'use client'

import { useEffect, useRef } from 'react'

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const dataRef = useRef(data)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      saveFn(dataRef.current)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, saveFn])
}
```

```typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const draftSchema = z.object({
  title: z.string().max(200),
  content: z.string().max(10000),
  tags: z.array(z.string()).optional(),
})

export async function saveDraft(draftId: string, data: unknown) {
  const parsed = draftSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: 'Invalid draft data' }
  }

  // Save to database
  // await db.draft.update({ where: { id: draftId }, data: parsed.data })

  revalidatePath(`/drafts/${draftId}`)
  return { success: true, savedAt: new Date().toISOString() }
}
```

```tsx
// Component with auto-save
'use client'

import { useState, useCallback } from 'react'
import { useAutoSave } from '@/lib/hooks/use-auto-save'
import { saveDraft } from './actions'

export default function DraftEditor({ draftId }: { draftId: string }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  const handleSave = useCallback(
    async (data: { title: string; content: string }) => {
      setSaveStatus('saving')
      const result = await saveDraft(draftId, data)
      setSaveStatus(result.success ? 'saved' : 'error')
    },
    [draftId]
  )

  useAutoSave({ title, content }, handleSave, 2000)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Edit Draft</h2>
        <div className="text-sm text-muted-foreground">
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && '✓ Saved'}
          {saveStatus === 'error' && '✗ Save failed'}
        </div>
      </div>

      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          maxLength={10000}
        />
      </div>
    </div>
  )
}
```

---

### Pattern 16: Unsaved Changes Warning
**When to use:** Prevent accidental navigation away from forms with unsaved data
**Implementation:**

```tsx
// lib/hooks/use-unsaved-changes.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useUnsavedChanges(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges) return

    // Browser navigation warning
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])
}
```

```tsx
// Component with unsaved changes protection
'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { useUnsavedChanges } from '@/lib/hooks/use-unsaved-changes'
import { updateProfile } from './actions'

export default function ProfileForm({ initialData }: { initialData: any }) {
  const [hasChanges, setHasChanges] = useState(false)
  const [state, formAction, isPending] = useActionState(updateProfile, {})

  useUnsavedChanges(hasChanges && !isPending)

  const handleFormChange = () => {
    if (!hasChanges) setHasChanges(true)
  }

  const handleSubmit = async (formData: FormData) => {
    setHasChanges(false) // Clear warning before submit
    return formAction(formData)
  }

  return (
    <form action={handleSubmit} onChange={handleFormChange}>
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
          <p className="text-sm text-yellow-800">
            You have unsaved changes. Don't forget to save!
          </p>
        </div>
      )}

      <input
        name="name"
        defaultValue={initialData.name}
        disabled={isPending}
      />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
```

---

## Advanced Accessibility Patterns

### Pattern 17: Comprehensive Accessible Form
**When to use:** All production forms must meet WCAG 2.1 AA standards
**Implementation:**

```tsx
'use client'

import { useActionState, useRef, useEffect } from 'react'
import { createAccount } from './actions'

export default function AccessibleSignupForm() {
  const [state, formAction, isPending] = useActionState(createAccount, {})
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <div>
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {state?.message && !isPending && state.message}
      </div>

      {/* Error summary for screen readers */}
      {hasErrors && (
        <div
          role="alert"
          className="bg-destructive/10 border border-destructive p-4 rounded-md mb-6"
          tabIndex={-1}
        >
          <h2 className="font-semibold text-destructive mb-2">
            There are {Object.keys(state.errors).length} errors in the form
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(state.errors).map(([field, messages]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="text-destructive underline hover:no-underline"
                >
                  {field}: {(messages as string[])[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form action={formAction} noValidate>
        {/* Email field with full accessibility */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Email Address
            <span className="text-destructive" aria-label="required">
              {' '}*
            </span>
          </label>
          <input
            ref={state?.errors?.email ? firstErrorRef : null}
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!state?.errors?.email}
            aria-describedby={
              state?.errors?.email ? 'email-error email-hint' : 'email-hint'
            }
            disabled={isPending}
            className={state?.errors?.email ? 'border-destructive' : ''}
          />
          <p id="email-hint" className="text-sm text-muted-foreground mt-1">
            We'll never share your email with anyone else.
          </p>
          {state?.errors?.email && (
            <p
              id="email-error"
              className="text-sm text-destructive mt-1"
              role="alert"
            >
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password field with strength indicator */}
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-1">
            Password
            <span className="text-destructive" aria-label="required">
              {' '}*
            </span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            aria-required="true"
            aria-invalid={!!state?.errors?.password}
            aria-describedby="password-requirements password-error"
            disabled={isPending}
            className={state?.errors?.password ? 'border-destructive' : ''}
          />
          <div id="password-requirements" className="text-sm text-muted-foreground mt-1">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside ml-2">
              <li>At least 12 characters</li>
              <li>One uppercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>
          {state?.errors?.password && (
            <p
              id="password-error"
              className="text-sm text-destructive mt-1"
              role="alert"
            >
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Checkbox with proper accessibility */}
        <div className="mb-4">
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              aria-required="true"
              aria-invalid={!!state?.errors?.terms}
              aria-describedby={state?.errors?.terms ? 'terms-error' : undefined}
              disabled={isPending}
              className="mt-1"
            />
            <label htmlFor="terms" className="ml-2">
              I agree to the{' '}
              <a href="/terms" className="text-primary underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary underline">
                Privacy Policy
              </a>
              <span className="text-destructive" aria-label="required">
                {' '}*
              </span>
            </label>
          </div>
          {state?.errors?.terms && (
            <p
              id="terms-error"
              className="text-sm text-destructive mt-1 ml-6"
              role="alert"
            >
              {state.errors.terms[0]}
            </p>
          )}
        </div>

        {/* Submit button with loading state */}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <span className="sr-only">Creating your account, please wait</span>
              <span aria-hidden="true">Creating Account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Success message */}
        {state?.success && (
          <div
            role="status"
            aria-live="polite"
            className="bg-green-50 border border-green-200 p-3 rounded-md mt-4"
          >
            <p className="text-green-800">✓ Account created successfully!</p>
          </div>
        )}
      </form>
    </div>
  )
}
```

**Accessibility Checklist:**
- ✅ Every input has associated `<label>` with `htmlFor`
- ✅ Required fields marked with `aria-required="true"` and visual indicator
- ✅ Error states have `aria-invalid="true"`
- ✅ Error messages linked with `aria-describedby`
- ✅ Error messages have `role="alert"` for immediate announcement
- ✅ Form status announced with `aria-live="polite"`
- ✅ Error summary at top with skip links to fields
- ✅ Focus management (first error field receives focus)
- ✅ Submit button disabled during submission with `aria-busy`
- ✅ Loading states announced to screen readers with `sr-only` text
- ✅ Hint text linked with `aria-describedby`
- ✅ Keyboard navigation fully supported (no keyboard traps)

---

## Performance Optimization Patterns

### Pattern 18: Large Form Optimization
**When to use:** Forms with 50+ fields, complex validation, or slow devices
**Implementation:**

```tsx
'use client'

import { useState, useMemo, memo } from 'react'
import { useActionState } from 'react'

// Memoize individual field components to prevent unnecessary re-renders
const FormField = memo(function FormField({
  name,
  label,
  type = 'text',
  error,
  disabled,
}: {
  name: string
  label: string
  type?: string
  error?: string
  disabled: boolean
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  )
})

// Group fields into sections to isolate re-renders
const PersonalInfoSection = memo(function PersonalInfoSection({
  errors,
  disabled,
}: {
  errors: any
  disabled: boolean
}) {
  return (
    <fieldset>
      <legend className="font-semibold text-lg mb-4">Personal Information</legend>
      <FormField
        name="firstName"
        label="First Name"
        error={errors?.firstName?.[0]}
        disabled={disabled}
      />
      <FormField
        name="lastName"
        label="Last Name"
        error={errors?.lastName?.[0]}
        disabled={disabled}
      />
      <FormField
        name="email"
        label="Email"
        type="email"
        error={errors?.email?.[0]}
        disabled={disabled}
      />
    </fieldset>
  )
})

const BusinessInfoSection = memo(function BusinessInfoSection({
  errors,
  disabled,
}: {
  errors: any
  disabled: boolean
}) {
  return (
    <fieldset>
      <legend className="font-semibold text-lg mb-4">Business Information</legend>
      <FormField
        name="businessName"
        label="Business Name"
        error={errors?.businessName?.[0]}
        disabled={disabled}
      />
      <FormField
        name="taxId"
        label="Tax ID"
        error={errors?.taxId?.[0]}
        disabled={disabled}
      />
    </fieldset>
  )
})

export default function LargeForm() {
  const [state, formAction, isPending] = useActionState(submitLargeForm, {})

  // Memoize errors object to prevent unnecessary re-renders
  const errors = useMemo(() => state?.errors ?? {}, [state?.errors])

  return (
    <form action={formAction}>
      {/* Render sections independently to isolate updates */}
      <PersonalInfoSection errors={errors} disabled={isPending} />
      <BusinessInfoSection errors={errors} disabled={isPending} />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

---

## Production Patterns

### Pattern 19: Rate Limiting Form Submissions
**When to use:** Prevent spam, abuse, or accidental double-submissions
**Implementation:**

```typescript
// lib/rate-limit.ts
import { headers } from 'next/headers'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(identifier: string, maxRequests = 5, windowMs = 60000) {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Clean up expired entries
  if (record && now > record.resetAt) {
    rateLimitMap.delete(identifier)
  }

  const current = rateLimitMap.get(identifier)

  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    }
  }

  current.count++
  return { allowed: true, remaining: maxRequests - current.count }
}

export async function getClientIdentifier() {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'
  return ip
}
```

```typescript
// app/actions.ts
'use server'

import { z } from 'zod'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactForm(prevState: any, formData: FormData) {
  // Rate limit by IP address
  const identifier = await getClientIdentifier()
  const rateCheck = await rateLimit(identifier, 3, 300000) // 3 requests per 5 minutes

  if (!rateCheck.allowed) {
    const minutesUntilReset = Math.ceil(
      ((rateCheck.resetAt ?? 0) - Date.now()) / 60000
    )
    return {
      message: `Too many requests. Please try again in ${minutesUntilReset} minute(s).`,
      rateLimited: true,
    }
  }

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return {
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Process contact form submission
  // await sendEmail(parsed.data)

  return {
    message: 'Message sent successfully!',
    success: true,
  }
}
```

---

### Pattern 20: Audit Logging Form Changes
**When to use:** Track who changed what and when for compliance/security
**Implementation:**

```typescript
// lib/audit-log.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function logFormSubmission(data: {
  userId: string
  formType: string
  action: 'create' | 'update' | 'delete'
  entityId?: string
  changes?: Record<string, { old: any; new: any }>
  metadata?: Record<string, any>
}) {
  const supabase = await createClient()

  await supabase.from('audit_logs').insert({
    user_id: data.userId,
    form_type: data.formType,
    action: data.action,
    entity_id: data.entityId,
    changes: data.changes,
    metadata: data.metadata,
    ip_address: data.metadata?.ipAddress,
    user_agent: data.metadata?.userAgent,
    created_at: new Date().toISOString(),
  })
}

export function detectChanges<T extends Record<string, any>>(
  oldData: T,
  newData: T
): Record<string, { old: any; new: any }> {
  const changes: Record<string, { old: any; new: any }> = {}

  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = { old: oldData[key], new: newData[key] }
    }
  }

  return changes
}
```

```typescript
// app/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { logFormSubmission, detectChanges } from '@/lib/audit-log'
import { createClient } from '@/lib/supabase/server'

const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
})

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { message: 'Unauthorized' }
  }

  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    bio: formData.get('bio'),
  })

  if (!parsed.success) {
    return {
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Get old data for change detection
  const { data: oldProfile } = await supabase
    .from('profiles')
    .select('name, email, bio')
    .eq('id', user.id)
    .single()

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update(parsed.data)
    .eq('id', user.id)

  if (error) {
    return { message: error.message }
  }

  // Log the changes
  if (oldProfile) {
    const changes = detectChanges(oldProfile, parsed.data)

    if (Object.keys(changes).length > 0) {
      await logFormSubmission({
        userId: user.id,
        formType: 'profile_update',
        action: 'update',
        entityId: user.id,
        changes,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      })
    }
  }

  revalidatePath('/profile')
  return { message: 'Profile updated successfully', success: true }
}
```

---

## Testing Strategies

### Pattern 21: Schema Testing
**When to use:** Ensure Zod schemas validate correctly in all edge cases
**Implementation:**

```typescript
// __tests__/schemas/profile.test.ts
import { describe, it, expect } from 'vitest'
import { profileSchema } from '@/lib/schemas/profile'

describe('profileSchema', () => {
  it('validates correct profile data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Software developer',
    }

    const result = profileSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
    }
  })

  it('rejects missing required fields', () => {
    const invalidData = {
      email: 'john@example.com',
      // name is missing
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name')
    }
  })

  it('rejects invalid email format', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email',
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
      expect(result.error.issues[0].message).toContain('email')
    }
  })

  it('rejects bio longer than 500 characters', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'a'.repeat(501),
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('bio')
    }
  })

  it('transforms email to lowercase', () => {
    const data = {
      name: 'John Doe',
      email: 'JOHN@EXAMPLE.COM',
    }

    const result = profileSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('john@example.com')
    }
  })
})

// __tests__/schemas/cross-field-validation.test.ts
import { describe, it, expect } from 'vitest'
import { passwordSchema } from '@/lib/schemas/auth'

describe('passwordSchema cross-field validation', () => {
  it('validates matching passwords', () => {
    const validData = {
      password: 'SecureP@ssw0rd123',
      confirmPassword: 'SecureP@ssw0rd123',
    }

    const result = passwordSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects non-matching passwords', () => {
    const invalidData = {
      password: 'SecureP@ssw0rd123',
      confirmPassword: 'DifferentP@ssw0rd',
    }

    const result = passwordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword')
      expect(result.error.issues[0].message).toContain('match')
    }
  })
})
```

### Pattern 22: Server Action Testing
**When to use:** Test form submission logic, validation, and error handling
**Implementation:**

```typescript
// __tests__/actions/profile.test.ts
import { describe, it, expect, vi } from 'vitest'
import { updateProfile } from '@/app/profile/actions'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
      })),
    },
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ error: null })),
      })),
    })),
  })),
}))

describe('updateProfile Server Action', () => {
  it('returns validation errors for invalid data', async () => {
    const formData = new FormData()
    formData.append('name', '') // Invalid: empty name
    formData.append('email', 'invalid-email') // Invalid: bad email format

    const result = await updateProfile({}, formData)

    expect(result.message).toBe('Validation failed')
    expect(result.errors).toBeDefined()
    expect(result.errors.name).toBeDefined()
    expect(result.errors.email).toBeDefined()
  })

  it('successfully updates profile with valid data', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('bio', 'Software developer')

    const result = await updateProfile({}, formData)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Profile updated successfully')
  })

  it('handles bio with maximum length', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('bio', 'a'.repeat(500)) // Exactly 500 chars

    const result = await updateProfile({}, formData)

    expect(result.success).toBe(true)
  })

  it('rejects bio exceeding maximum length', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('bio', 'a'.repeat(501)) // Too long

    const result = await updateProfile({}, formData)

    expect(result.errors?.bio).toBeDefined()
  })
})
```

---

## Updated Detection Commands

```bash
# Find React Hook Form usage (FORBIDDEN)
rg "useForm\(" --type tsx features
rg "from ['\"]react-hook-form['\"]" --type tsx features
rg "zodResolver" --type tsx features

# Find forms without rate limiting (should check in Server Actions)
rg "export async function.*FormData" --type ts features -A 20 | rg -v "rateLimit"

# Find forms without audit logging (critical forms only)
rg "export async function (update|delete|create)" --type ts features/admin -A 20 | rg -v "logFormSubmission"

# Find missing accessibility attributes
rg "<input" --type tsx features | rg -v "aria-label|aria-labelledby"
rg "<input" --type tsx features | rg -v "aria-invalid"
rg "role=['\"]alert['\"]" --type tsx features # Should find error messages

# Find forms without error summaries (accessibility issue)
rg "useActionState" --type tsx features -A 30 | rg -v "role=['\"]alert['\"]"

# Find dynamic arrays without proper indexing
rg "\.append\(['\"][^'\"]+\[" --type tsx features # Check FormData appends for arrays

# Find debounced validation usage
rg "useDebouncedValidation|useDebounce" --type tsx features

# Find auto-save implementations
rg "useAutoSave" --type tsx features

# Find forms without unsaved changes warning
rg "useActionState" --type tsx features -A 30 | rg -v "useUnsavedChanges|beforeunload"

# Find memo usage for performance (should see in large forms)
rg "memo\(function" --type tsx features

# Find async validation without proper handling
rg "\.refine\(async" --type ts features -A 5 | rg -v "safeParseAsync"

# Verify discriminated unions are properly typed
rg "discriminatedUnion" --type ts features

# Find schema composition patterns
rg "\.merge\(|\.extend\(|\.pick\(|\.omit\(" --type ts features

# Find forms missing disabled state during submission
rg "disabled={isPending}" --type tsx features # Should find many

# Verify proper FormData parsing for arrays
rg "while.*formData\.has" --type ts features # Dynamic array parsing
rg "services\[.*\]" --type ts features # Array field naming

# Check for proper focus management
rg "useRef.*Error|firstError" --type tsx features
rg "\.focus\(\)" --type tsx features -B 5 | rg "error"
```

---

**Related:**
- [02-typescript.md](./02-typescript.md) - Type safety for Zod schemas
- [04-nextjs.md](./04-nextjs.md) - Server Actions, revalidation, redirect
- [06-api.md](./06-api.md) - Server Action patterns and error handling
- [08-ui.md](./08-ui.md) - shadcn/ui form components (NOT used with Server Actions)
