'use client'

import { useState } from 'react'
import { resetPassword } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { PasswordInput } from '@/features/auth/common/components/password-input'
import { PasswordStrengthIndicator, usePasswordStrength } from '@/features/auth/common/components/password-strength-indicator'
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

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { isValid: isPasswordValid } = usePasswordStrength(password)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    // Validate password strength
    if (!isPasswordValid) {
      setError('Please meet all password requirements')
      setLoading(false)
      return
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success, server action redirects to login
  }

  return (
    <div className="w-full max-w-md">
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex flex-col gap-1">
            <ItemTitle>Reset your password</ItemTitle>
            <ItemDescription>Enter your new password below</ItemDescription>
          </div>
        </ItemHeader>

        <form action={handleSubmit}>
          <ItemContent>
            <div className="flex flex-col gap-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Password reset failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <FieldContent>
                <PasswordInput
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  autoFocus
                />
                {password ? (
                  <FieldDescription>
                    <PasswordStrengthIndicator password={password} showRequirements />
                  </FieldDescription>
                ) : null}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
              <FieldContent>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
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
              </FieldContent>
            </Field>
          </div>
          </ItemContent>

          <ItemFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isPasswordValid || password !== confirmPassword}
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Resetting password...</span>
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
