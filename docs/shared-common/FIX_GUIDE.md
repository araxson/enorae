# Shared/Common Codebase - Fix Guide

**Quick Reference for Addressing Identified Violations**

---

## Medium Severity Fixes (Required)

### Fix 1: blocked-times - Use Public View Instead of Table

**File:** `/Users/afshin/Desktop/Enorae/features/shared/blocked-times/api/queries.ts`

**Lines:** 27, 47, 72, 93

**Current (Incorrect):**
```typescript
const { data, error } = await supabase
  .from('blocked_times')  // ❌ Direct table access
  .select('*')
  .eq('salon_id', salonId)
```

**Fix (Correct):**
```typescript
const { data, error } = await supabase
  .from('blocked_times_view')  // ✅ Use public view
  .select('*')
  .eq('salon_id', salonId)
```

**Steps:**
1. Verify `public.blocked_times_view` exists in database
2. If not, create view:
   ```sql
   CREATE OR REPLACE VIEW public.blocked_times_view AS
   SELECT * FROM scheduling.blocked_times
   WHERE deleted_at IS NULL;

   GRANT SELECT ON public.blocked_times_view TO authenticated;
   ```
3. Update all 4 occurrences in queries.ts

---

### Fix 2: appointments - Use Public View Instead of Table

**File:** `/Users/afshin/Desktop/Enorae/features/shared/appointments/api/queries.ts`

**Lines:** 27, 43, 59

**Current (Incorrect):**
```typescript
const { data, error } = await supabase
  .from('appointments')  // ❌ Direct table access
  .select('*')
  .eq('salon_id', salonId)
```

**Fix (Correct):**
```typescript
const { data, error } = await supabase
  .from('appointments_view')  // ✅ Use public view
  .select('*')
  .eq('salon_id', salonId)
```

**Note:** Check if `appointments_view` already exists (type definition suggests it does).

**Steps:**
1. Verify view exists
2. Update all 3 occurrences in queries.ts

---

### Fix 3: sessions - Verify View Usage

**File:** `/Users/afshin/Desktop/Enorae/features/shared/sessions/api/queries.ts`

**Lines:** 24, 48

**Current:**
```typescript
const { data, error } = await supabase
  .from('sessions')  // May be correct if view exists
  .select('*')
  .eq('user_id', user.id)
```

**Action Required:**
1. Verify if `sessions` is a view or table
2. Type definition suggests it IS a view: `Database['public']['Views']['sessions']['Row']`
3. If already a view: ✅ No change needed
4. If it's a table: Create `sessions_view` and update queries

---

## Low Severity Fixes (Optional)

### Fix 4: testimonial-card - Clean Up Inline Styling

**File:** `/Users/afshin/Desktop/Enorae/components/marketing/testimonial-card.tsx`

**Lines:** 35-36

**Current (Acceptable but not ideal):**
```typescript
<Star
  className={`h-4 w-4 ${
    index < rating ? 'fill-primary text-primary' : 'fill-muted text-muted'
  }`}
/>
```

**Fix Option 1 - Use cn() utility:**
```typescript
import { cn } from '@/lib/utils'

<Star
  className={cn(
    'h-4 w-4',
    index < rating
      ? 'fill-primary text-primary'
      : 'fill-muted text-muted'
  )}
/>
```

**Fix Option 2 - Extract to const:**
```typescript
const starClassName = cn(
  'h-4 w-4',
  index < rating
    ? 'fill-primary text-primary'
    : 'fill-muted text-muted'
)

<Star className={starClassName} />
```

---

### Fix 5: auth - Add Validation Schemas

**File:** `/Users/afshin/Desktop/Enorae/features/shared/auth/schema.ts`

**Current (Empty):**
```typescript
import { z } from 'zod'

export const authSchema = z.object({})
export type AuthSchema = z.infer<typeof authSchema>
```

**Fix (Complete schemas):**
```typescript
import { z } from 'zod'

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type LoginSchema = z.infer<typeof loginSchema>

// Signup schema
export const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
export type SignupSchema = z.infer<typeof signupSchema>

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

// Reset password schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

// Verify OTP schema
export const verifyOTPSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().length(6, 'OTP must be 6 digits'),
})
export type VerifyOTPSchema = z.infer<typeof verifyOTPSchema>
```

---

### Fix 6: auth forms - Migrate to React Hook Form (Optional)

**Files:**
- `features/shared/auth/components/login-form.tsx`
- `features/shared/auth/components/signup-form.tsx`

**Current Pattern (Works but no client validation):**
```typescript
async function handleSubmit(formData: FormData) {
  const result = await login(formData)
  if (result?.error) setError(result.error)
}

<form action={handleSubmit}>
  <Input name="email" type="email" required />
  <Input name="password" type="password" required />
</form>
```

**Improved Pattern (React Hook Form + Zod):**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginSchema) {
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    const result = await login(formData)
    if (result?.error) {
      form.setError('root', { message: result.error })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}
```

**Benefits:**
- ✅ Client-side validation before submission
- ✅ Better error handling per field
- ✅ Loading states managed automatically
- ✅ Better accessibility (aria-invalid, aria-describedby)
- ✅ Type-safe form values

---

## SQL Scripts for Database Views

### Create blocked_times_view

```sql
-- Drop existing view if needed
DROP VIEW IF EXISTS public.blocked_times_view;

-- Create view for blocked times
CREATE OR REPLACE VIEW public.blocked_times_view AS
SELECT
  bt.id,
  bt.salon_id,
  bt.staff_id,
  bt.start_time,
  bt.end_time,
  bt.reason,
  bt.is_recurring,
  bt.recurrence_pattern,
  bt.recurrence_end_date,
  bt.created_at,
  bt.updated_at,
  bt.created_by_id,
  bt.updated_by_id
FROM scheduling.blocked_times bt
WHERE bt.deleted_at IS NULL;

-- Grant access to authenticated users
GRANT SELECT ON public.blocked_times_view TO authenticated;

-- Add RLS policy
ALTER TABLE public.blocked_times_view ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view blocked times for their salons"
ON public.blocked_times_view
FOR SELECT
TO authenticated
USING (
  salon_id IN (
    SELECT salon_id
    FROM organization.staff_salons
    WHERE user_id = auth.uid()
  )
  OR
  salon_id IN (
    SELECT id
    FROM organization.salons
    WHERE owner_id = auth.uid()
  )
);

-- Add helpful comment
COMMENT ON VIEW public.blocked_times_view IS 'Public view of blocked times with RLS for multi-tenant access';
```

### Verify appointments_view Exists

```sql
-- Check if view exists
SELECT EXISTS (
  SELECT FROM pg_views
  WHERE schemaname = 'public'
  AND viewname = 'appointments_view'
);

-- If it doesn't exist, create it
CREATE OR REPLACE VIEW public.appointments_view AS
SELECT
  a.id,
  a.salon_id,
  a.customer_id,
  a.staff_id,
  a.service_id,
  a.start_time,
  a.end_time,
  a.status,
  a.notes,
  a.created_at,
  a.updated_at
FROM scheduling.appointments a
WHERE a.deleted_at IS NULL;

GRANT SELECT ON public.appointments_view TO authenticated;
```

---

## Testing Checklist

After applying fixes, verify:

### Database Pattern Fixes
- [ ] Run queries to ensure views return correct data
- [ ] Verify RLS policies work correctly
- [ ] Test read operations with different user roles
- [ ] Confirm mutations still write to schema tables

### UI Pattern Fixes
- [ ] Visual regression test on testimonial cards
- [ ] Verify star ratings display correctly

### Form Schema Fixes
- [ ] Import schemas in mutation files
- [ ] Test validation errors display correctly
- [ ] Verify successful submissions still work

### React Hook Form Migration (if applied)
- [ ] Client-side validation fires before submission
- [ ] Error messages display per field
- [ ] Form state management works (loading, disabled)
- [ ] Accessibility attributes present (aria-*)

---

## Priority Order

1. **HIGH** - Fix database view usage (Fixes 1-3)
2. **MEDIUM** - Add auth validation schemas (Fix 5)
3. **LOW** - Clean up inline styling (Fix 4)
4. **OPTIONAL** - Migrate to React Hook Form (Fix 6)

---

## Estimated Time

- Fix 1 (blocked_times): 15 minutes
- Fix 2 (appointments): 10 minutes (verify view exists)
- Fix 3 (sessions): 5 minutes (verify only)
- Fix 4 (testimonial-card): 5 minutes
- Fix 5 (auth schemas): 20 minutes
- Fix 6 (RHF migration): 2-3 hours per form (optional)

**Total Required Time: ~1 hour**
**Total Optional Time: ~6-9 hours**

---

## Questions?

Refer to:
- `docs/stack-patterns/supabase-patterns.md` - Database view patterns
- `docs/stack-patterns/forms-patterns.md` - React Hook Form patterns
- `docs/stack-patterns/ui-patterns.md` - Component styling patterns

---

**Last Updated:** 2025-10-20
