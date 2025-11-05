'use client'

import { useActionState, useRef, useEffect, useState } from 'react'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { updatePasswordAction } from '@/features/business/settings-account/api/mutations'
import { PasswordField } from './password-form-fields'
import { FormErrorSummary, FormStatusAlerts } from './password-form-alerts'
import { PasswordFormSubmitButton } from './password-form-submit'

type FormState = {
  success?: boolean
  message?: string
  errors?: {
    currentPassword?: string[]
    newPassword?: string[]
    confirmPassword?: string[]
  }
}

export function PasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [state, formAction] = useActionState<FormState, FormData>(updatePasswordAction, {})
  const formRef = useRef<HTMLFormElement>(null)
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Reset form on success
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state?.success])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Change Password</ItemTitle>
        <ItemDescription>Update your password to keep your account secure</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {state?.message && state.message}
        </div>

        {/* Error summary for screen readers */}
        {hasErrors && <FormErrorSummary errors={state.errors!} />}

        <form ref={formRef} action={formAction} noValidate>
          <FieldSet>
            <FieldGroup className="gap-6">
              <FormStatusAlerts state={state} />

              <PasswordField
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                showPassword={showCurrent}
                onToggleShow={() => setShowCurrent(!showCurrent)}
                error={state?.errors?.currentPassword}
                autoComplete="current-password"
                ref={state?.errors?.currentPassword ? firstErrorRef : null}
              />

              <PasswordField
                id="newPassword"
                name="newPassword"
                label="New Password"
                showPassword={showNew}
                onToggleShow={() => setShowNew(!showNew)}
                error={state?.errors?.newPassword}
                hint="Must be at least 8 characters"
                autoComplete="new-password"
                minLength={8}
              />

              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                showPassword={showConfirm}
                onToggleShow={() => setShowConfirm(!showConfirm)}
                error={state?.errors?.confirmPassword}
                autoComplete="new-password"
                minLength={8}
              />

              <PasswordFormSubmitButton />
            </FieldGroup>
          </FieldSet>
        </form>
      </ItemContent>
    </Item>
  )
}
