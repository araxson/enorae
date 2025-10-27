# 15: Form Validation Issues

**Role:** Form Validation Specialist

## Objective

Identify missing validation schemas, inconsistent validation patterns, poor error handling in forms, client/server validation mismatches, and inadequate input validation.

## What to Search For

- Forms without Zod validation schemas
- Missing client-side validation
- Inconsistent validation patterns across forms
- No server-side validation
- Poor error message UX
- Unvalidated user inputs
- Missing custom validators
- No password strength validation
- Missing date/email validation
- Validation logic in components instead of schemas

## How to Identify Issues

1. **Find form components** without schema.ts files
2. **Search for form inputs** without validation
3. **Identify server actions** without input validation
4. **Check for hardcoded validation** in components
5. **Find forms** with poor error messages

## Example Problems

```tsx
// ❌ No validation schema
export async function createAppointment(formData: FormData) {
  const name = formData.get('name') // No validation!
  const email = formData.get('email')
  const phone = formData.get('phone')
  // Direct use without checking
  await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({ name, email, phone })
}

// ❌ Validation logic in component
function BookingForm() {
  const [errors, setErrors] = useState({})
  
  const handleSubmit = (data) => {
    if (!data.email.includes('@')) {
      setErrors({ email: 'Invalid email' })
    }
    // Validation scattered in component
  }
}

// ❌ No server-side validation
export async function updateProfile(userId: string, data: any) {
  // Trust client validation only
  const { error } = await supabase
    .schema('identity')
    .from('profiles')
    .update(data)
    .eq('id', userId)
}

// ❌ Missing password validation
const password = formData.get('password')
if (password.length < 6) { // Weak validation
  throw new Error('Too short')
}

// ❌ Inconsistent error messages
if (!email) return 'Email is required'
if (!phone) return 'Phone field missing'
// Different styles, inconsistent UX
```

## Fix Approach

- Create Zod schemas for all forms
- Use React Hook Form with zodResolver
- Validate on both client and server
- Create consistent error message format
- Add custom validators for complex rules
- Validate before server submission
- Display user-friendly error messages
- Review `docs/ruls/forms-patterns.md` for form, schema, and server action requirements

## Output Format

List findings as:
```
- HIGH: features/business/appointments/components/booking-form.tsx - No Zod schema, validation in component
- HIGH: features/customer/booking/api/mutations.ts:34 - Missing server-side validation
- MEDIUM: features/staff/profile/components/edit-form.tsx - Inconsistent error messages
```

## Stack Pattern Reference

Review:
- `docs/ruls/forms-patterns.md`
- `docs/ruls/supabase-patterns.md`

Complete form validation audit and report all issues.
