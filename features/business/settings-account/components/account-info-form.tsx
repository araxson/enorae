'use client'

import { useActionState, useRef, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { updateProfileAction } from '@/features/business/settings-account/api/mutations'
import { TextField } from './account-info-form-fields'
import { FormErrorSummary, FormStatusAlerts } from './password-form-alerts'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles_view']['Row']

interface AccountInfoFormProps {
  profile: Profile
}

type FormState = {
  success?: boolean
  message?: string
  errors?: {
    fullName?: string[]
    phone?: string[]
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <Spinner className="size-4" />
          <span>Saving...</span>
        </>
      ) : (
        <span>Save Changes</span>
      )}
    </Button>
  )
}

export function AccountInfoForm({ profile }: AccountInfoFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(updateProfileAction, {})
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Account Information</ItemTitle>
        <ItemDescription>Update your personal information</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {state?.message && state.message}
        </div>

        {/* Error summary for screen readers */}
        {hasErrors && <FormErrorSummary errors={state.errors!} />}

        <form action={formAction} noValidate>
          <FieldSet>
            <FieldGroup className="gap-6">
              <FormStatusAlerts state={state} />

              <TextField
                id="email"
                label="Email"
                type="email"
                defaultValue={profile['email']}
                disabled
                hint="Email cannot be changed here. Contact support if needed."
              />

              <TextField
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                defaultValue={profile['full_name']}
                placeholder="Enter your full name"
                required
                error={state?.errors?.fullName}
                ref={state?.errors?.fullName ? firstErrorRef : null}
              />

              <TextField
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                defaultValue={profile['phone']}
                placeholder="+1 (555) 000-0000"
                error={state?.errors?.phone}
              />

              <SubmitButton />
            </FieldGroup>
          </FieldSet>
        </form>
      </ItemContent>
    </Item>
  )
}
