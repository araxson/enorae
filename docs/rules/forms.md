# Form Patterns

**Standalone reference for forms built with React Hook Form 7 + Zod + shadcn/ui. No external dependencies.**

---

## Stack Context

- **React Hook Form:** 7.x
- **Zod:** 3.x
- **Resolver:** `@hookform/resolvers/zod`
- **UI Primitives:** `@/components/ui/form`, `@/components/ui/input`, `@/components/ui/select`, etc.
- **Server Actions:** Primary mutation pathway (`useActionState`, `useFormStatus`)

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Schema Patterns](#schema-patterns)
3. [Form Composition](#form-composition)
4. [Server Action Integration](#server-action-integration)
5. [Error Handling & Messaging](#error-handling--messaging)
6. [Advanced Patterns](#advanced-patterns)
7. [Detection Commands](#detection-commands)
8. [Quick Reference Checklist](#quick-reference-checklist)

---

## Core Concepts

- **Zod defines truth.** All inputs pass through a Zod schema before reaching a mutation.
- **React Hook Form manages state.** Use `useForm` with `zodResolver` for synchronous validation.
- **shadcn form components.** Always wrap fields in `FormField` + `FormItem` + `FormControl` + `FormLabel` + `FormMessage`.
- **Server Action first.** Prefer `<form action={serverAction}>` to reduce client code and guarantee auth.
- **Pending UX.** Use `useFormStatus` inside the form or `useActionState` to mirror server results.

---

## Schema Patterns

### Primitive Fields

```ts
import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  timezone: z.string().min(1),
})
```

### Nested Objects & Arrays

```ts
export const serviceSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  durationMinutes: z.coerce.number().min(15).max(480),
  tags: z.array(z.string()).max(5),
})
```

### Refinements & Transforms

```ts
export const passwordSchema = z
  .object({ password: z.string().min(12), confirmPassword: z.string() })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({ code: 'custom', message: 'Passwords must match', path: ['confirmPassword'] })
    }
  })
```

### Common Validation Patterns

```ts
import { z } from 'zod'

// Phone number validation
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number')
  .or(z.literal(''))  // Optional phone

// URL validation
export const websiteSchema = z.string()
  .url('Enter a valid URL')
  .or(z.literal(''))  // Optional URL

// Date/time validation
export const appointmentSchema = z.object({
  scheduledAt: z.string()
    .datetime('Invalid datetime format')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Appointment must be in the future',
    }),
  duration: z.coerce.number()
    .min(15, 'Minimum 15 minutes')
    .max(480, 'Maximum 8 hours'),
})

// Business hours validation
export const operatingHoursSchema = z.object({
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
}).refine((data) => data.closeTime > data.openTime, {
  message: 'Close time must be after open time',
  path: ['closeTime'],
})

// Price validation with currency
export const pricingSchema = z.object({
  amount: z.coerce.number()
    .min(0, 'Price cannot be negative')
    .max(999999, 'Price too high')
    .multipleOf(0.01, 'Use up to 2 decimal places'),
  currency: z.enum(['USD', 'EUR', 'GBP'], {
    errorMap: () => ({ message: 'Select a valid currency' }),
  }),
})

// File upload validation (server-side)
export const avatarUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File must be less than 5MB',
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
      message: 'Only JPEG, PNG, and WebP images are allowed',
    }),
})

// Conditional validation
export const customerSchema = z.object({
  type: z.enum(['individual', 'business']),
  name: z.string().min(1, 'Name is required'),
  businessName: z.string().optional(),
  taxId: z.string().optional(),
}).superRefine((data, ctx) => {
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

// Array validation with min/max
export const serviceSelectionSchema = z.object({
  services: z.array(z.string().uuid())
    .min(1, 'Select at least one service')
    .max(5, 'Maximum 5 services per booking'),
})

// Multi-field cross-validation
export const discountSchema = z.object({
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().min(0).optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'percentage') {
    if (data.value > 100) {
      ctx.addIssue({
        code: 'custom',
        message: 'Percentage cannot exceed 100%',
        path: ['value'],
      })
    }
    if (!data.maxDiscount) {
      ctx.addIssue({
        code: 'custom',
        message: 'Maximum discount amount is required for percentage discounts',
        path: ['maxDiscount'],
      })
    }
  }
})

// Transform input (e.g., trim, lowercase)
export const emailSchema = z.string()
  .email('Enter a valid email')
  .transform((val) => val.toLowerCase().trim())

// Optional with default
export const settingsSchema = z.object({
  notifications: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
})

// Nullable vs optional
export const noteSchema = z.object({
  required: z.string(),              // Must exist, can't be null
  optional: z.string().optional(),   // Can be undefined
  nullable: z.string().nullable(),   // Can be null
  both: z.string().nullable().optional(), // Can be null or undefined
})
```

---

## Form Composition

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { profileSchema } from '../schema'

export function ProfileForm({ defaultValues }: { defaultValues: z.infer<typeof profileSchema> }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: 'onSubmit',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern (US)</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton />
      </form>
    </Form>
  )
}
```

### Pending Button with `useFormStatus`

```tsx
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save changes'}
    </Button>
  )
}
```

---

## Server Action Integration

### Action Signature & Return Shape

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { profileSchema } from '../schema'
import { revalidatePath, updateTag } from 'next/cache'

interface ActionState {
  message?: string
  values: z.infer<typeof profileSchema>
}

export async function updateProfile(prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? 'Invalid data', values: prev?.values ?? parsed.data }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { message: 'Unauthorized', values: parsed.data }
  }

  const { error } = await supabase
    .schema('identity')
    .from('profiles')
    .update({ full_name: parsed.data.name, timezone: parsed.data.timezone })
    .eq('id', user.id)

  if (error) {
    return { message: error.message, values: parsed.data }
  }

  updateTag(`profile:${user.id}`)
  revalidatePath('/settings/profile')
  return { values: parsed.data }
}
```

> ⚠️ `updateTag` only works inside Server Actions. Route handlers must call `revalidateTag(tag, 'max')` instead (Next.js 15 caching docs).

### Client Hook with `useActionState`

```tsx
'use client'

import { useActionState } from 'react'
import { updateProfile } from '../api/mutations'

export function ProfileFormContainer({ defaults }: { defaults: { name: string; timezone: string } }) {
  const [state, action, pending] = useActionState(updateProfile, { values: defaults })

  return (
    <form action={action} className="space-y-4">
      <input name="name" defaultValue={state.values.name} className="input" />
      <input name="timezone" defaultValue={state.values.timezone} className="input" />
      {state.message && <p className="text-sm text-destructive">{state.message}</p>}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
```

> The async function passed to `useActionState` receives `(previousState, formData)` and must return the next state. Call `redirect('/settings/profile')` inside the action after a successful update to short-circuit rendering, as shown in the React 19 `<form action>` documentation.

---

## Error Handling & Messaging

- Prefer schema-level messages (`z.string().min(1, 'Name is required')`).
- For server errors, return structured state: `{ fieldErrors?: Record<string, string>; message?: string }`.
- Use `<FormMessage />` for field errors; use alerts (`<Alert variant="destructive">`) for global errors.

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

{state.message && (
  <Alert variant="destructive">
    <AlertTitle>Unable to save</AlertTitle>
    <AlertDescription>{state.message}</AlertDescription>
  </Alert>
)}
```

---

## Advanced Patterns

### Dynamic Field Arrays

```tsx
'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { servicesSchema } from '../schema'

export function ServicesForm({ defaultValues }: { defaultValues: z.infer<typeof servicesSchema> }) {
  const form = useForm({ resolver: zodResolver(servicesSchema), defaultValues })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'services' })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input {...form.register(`services.${index}.name`)} placeholder="Service name" />
            <Input {...form.register(`services.${index}.price`, { valueAsNumber: true })} type="number" placeholder="Price" />
            <Button type="button" variant="ghost" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: '', price: 0, durationMinutes: 30, tags: [] })}
          >
            Add service
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

### Multi-step Wizard

- Maintain state inside React Hook Form; control step index separately.
- Validate per step by calling `trigger(['fieldA', 'fieldB'])` before advancing.
- Persist progress via Server Action when necessary to avoid data loss.

### File Uploads

- File inputs cannot be controlled by React Hook Form; use uncontrolled `<input type="file">` + `FormData` in Server Actions.
- Validate file metadata (size/type) with Zod’s `.refine` on the server.

---

## Detection Commands

```bash
# useForm without zodResolver
rg "useForm\(" --type tsx -n | xargs -I{} sh -c "grep -q 'zodResolver' {} || echo 'Missing resolver -> {}'"

# Missing Form primitives (FormField + FormItem)
rg "<form" --type tsx features \
  | xargs -I{} sh -c "grep -q 'FormField' {} || echo 'Missing FormField -> {}'"

# React Hook Form + shadcn mismatch (inputs not wrapped in FormControl)
rg "<Input" --type tsx features \
  | xargs -I{} sh -c "grep -q 'FormControl' {} || echo 'Input missing FormControl -> {}'"

# Client-side mutation handlers (should be Server Actions)
rg "supabase\.schema" features --type tsx
```

---

## Quick Reference Checklist

- [ ] Every form has a Zod schema and uses `zodResolver`.
- [ ] Fields are wrapped in `FormField` / `FormItem` / `FormControl` / `FormMessage`.
- [ ] Server Actions return structured state and invalidate relevant cache tags.
- [ ] `useFormStatus` or `useActionState` powers pending and error UI.
- [ ] Field arrays leverage `useFieldArray`; keys come from `field.id`.
- [ ] File uploads pass through `FormData` -> Server Action (no direct Supabase from client).
- [ ] No inline validation strings; messages live in Zod schema.
- [ ] Detection commands return no violations.

---

**Last Updated:** 2025-10-21 (Added comprehensive validation pattern examples)
