'use client'

import type { PasswordResetResult } from '../api/types'
import { useState, useActionState, useRef, useEffect } from 'react'
import { resetPassword } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { PasswordInput, PasswordStrengthIndicator, usePasswordStrength } from '@/features/auth/common/components'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function ResetPasswordForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState<PasswordResetResult, FormData>(
    resetPassword,
    null as unknown as PasswordResetResult
  )
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const firstErrorRef = useRef<HTMLInputElement>(null)

  const { isValid: isPasswordValid } = usePasswordStrength(password)

  // Focus first error field after validation
  useEffect(() => {
    if (state && !state.success && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state])

  const hasErrors = state && !state.success && 'errors' in state && state.errors && Object.keys(state.errors).length > 0

  return (
    <div className="w-full max-w-md">
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex flex-col gap-1">
            <ItemTitle>Reset your password</ItemTitle>
            <ItemDescription>Enter your new password below</ItemDescription>
          </div>
        </ItemHeader>

        <form action={formAction} noValidate>
          <ItemContent>
            <div className="flex flex-col gap-6">
            {/* Screen reader announcement for form status */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {isPending && 'Form is submitting, please wait'}
              {state && !state.success && 'error' in state && state.error && !isPending && state.error}
            </div>

            {/* Error summary */}
            {hasErrors && state && !state.success && 'errors' in state && state.errors && (
              <Alert variant="destructive" role="alert" tabIndex={-1}>
                <AlertCircle className="size-4" />
                <AlertTitle>There are {Object.keys(state.errors).length} errors in the form</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {Object.entries(state.errors).map(([field, messages]) => (
                      <li key={field}>
                        <a
                          href={`#${field}`}
                          className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                          {field}: {(messages as string[])[0]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* General error */}
            {state && !state.success && 'error' in state && state.error && !hasErrors && (
              <Alert variant="destructive" role="alert">
                <AlertCircle className="size-4" />
                <AlertTitle>Password reset failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel htmlFor="password">
                New password
                <span className="text-destructive" aria-label="required"> *</span>
              </FieldLabel>
              <FieldContent>
                <PasswordInput
                  ref={state && !state.success && 'errors' in state && state.errors?.['password'] ? firstErrorRef : null}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  aria-required="true"
                  aria-invalid={!!(state && !state.success && 'errors' in state && state.errors?.['password'])}
                  aria-describedby={
                    state && !state.success && 'errors' in state && state.errors?.['password']
                      ? 'password-error password-strength'
                      : 'password-strength'
                  }
                  disabled={isPending}
                  autoFocus
                />
                {password ? (
                  <FieldDescription id="password-strength">
                    <PasswordStrengthIndicator password={password} showRequirements />
                  </FieldDescription>
                ) : null}
                {state && !state.success && 'errors' in state && state.errors?.['password'] && (
                  <p id="password-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.errors['password'][0]}
                  </p>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm new password
                <span className="text-destructive" aria-label="required"> *</span>
              </FieldLabel>
              <FieldContent>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  aria-required="true"
                  aria-invalid={!!(state && !state.success && 'errors' in state && state.errors?.['confirmPassword'])}
                  aria-describedby={
                    state && !state.success && 'errors' in state && state.errors?.['confirmPassword']
                      ? 'confirmPassword-error'
                      : undefined
                  }
                  disabled={isPending}
                />
                {confirmPassword && password !== confirmPassword ? (
                  <FieldDescription className="text-destructive font-medium">
                    Passwords do not match
                  </FieldDescription>
                ) : null}
                {confirmPassword && password === confirmPassword ? (
                  <FieldDescription className="text-primary font-medium">
                    Passwords match
                  </FieldDescription>
                ) : null}
                {state && !state.success && 'errors' in state && state.errors?.['confirmPassword'] && (
                  <p id="confirmPassword-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.errors['confirmPassword'][0]}
                  </p>
                )}
              </FieldContent>
            </Field>
          </div>
          </ItemContent>

          <ItemFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <Spinner className="size-4" />
                  <span aria-hidden="true">Resetting password...</span>
                  <span className="sr-only">Resetting your password, please wait</span>
                </>
              ) : (
                <span>Reset password</span>
              )}
            </Button>
          </ItemFooter>
        </form>
      </Item>
    </div>
  )
}
