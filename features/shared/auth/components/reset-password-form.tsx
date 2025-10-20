'use client'

import { useState } from 'react'
import { resetPassword } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/layout'
import { AlertCircle } from 'lucide-react'
import { PasswordInput } from './password-input'
import { PasswordStrengthIndicator, usePasswordStrength } from './password-strength-indicator'

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
      <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent>
          <Stack gap="md">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Stack gap="xs">
              <Label htmlFor="password">New password</Label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                autoFocus
              />
              {password && (
                <PasswordStrengthIndicator password={password} showRequirements />
              )}
            </Stack>

            <Stack gap="xs">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <small className="text-sm font-medium leading-none text-destructive">Passwords do not match</small>
              )}
              {confirmPassword && password === confirmPassword && (
                <small className="text-sm font-medium leading-none text-green-600">Passwords match</small>
              )}
            </Stack>
          </Stack>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !isPasswordValid || password !== confirmPassword}
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </Button>
        </CardFooter>
      </form>
      </Card>
    </div>
  )
}
