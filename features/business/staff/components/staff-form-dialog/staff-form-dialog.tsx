// DEPRECATED: This file used React Hook Form which is FORBIDDEN
// Use staff-form-migrated.tsx instead which uses Server Actions with useActionState
//
// FORBIDDEN PATTERNS DETECTED:
// - React Hook Form (useForm hook)
// - @/components/ui/form (shadcn form component wrapping RHF)
// - Client-side form handling with onSubmit
//
// CORRECT PATTERN:
// - Native HTML forms with Server Actions
// - useActionState for form state management
// - Progressive enhancement with noValidate
//
// See: docs/rules/07-forms.md

export function StaffFormDialog() {
  throw new Error(
    'StaffFormDialog is deprecated. Use StaffFormMigrated instead. ' +
    'React Hook Form is FORBIDDEN. See docs/rules/07-forms.md'
  )
}
