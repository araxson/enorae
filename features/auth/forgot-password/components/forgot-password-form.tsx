'use client'

import type { PasswordResetRequestResult } from '../api/types'
import { useActionState, useEffect, useRef } from 'react'
import { requestPasswordReset } from '../api/mutations'
import { ForgotPasswordSuccess } from './forgot-password-success'
import { ForgotPasswordFormFields } from './forgot-password-form-fields'

export function ForgotPasswordForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState<PasswordResetRequestResult, FormData>(
    requestPasswordReset,
    {
      success: false,
      error: '',
    } as PasswordResetRequestResult
  )
  const firstErrorRef = useRef<HTMLInputElement | null>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state && !state.success && state.error && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state])

  if (state && state.success) {
    return <ForgotPasswordSuccess message={state.message} />
  }

  return (
    <ForgotPasswordFormFields
      formAction={formAction}
      isPending={isPending}
      error={state && !state.success ? state.error : undefined}
      firstErrorRef={firstErrorRef}
    />
  )
}
