'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '@/features/shared/auth/api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { PasswordInput } from './password-input'
import { PasswordStrengthIndicator, usePasswordStrength } from './password-strength-indicator'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ButtonGroup } from '@/components/ui/button-group'

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { isValid: isPasswordValid } = usePasswordStrength(password)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

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

    try {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success && result?.requiresOTP && result?.email) {
        const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(result.email)}&type=email`
        router.push(redirectUrl)
      } else if (result?.success && result?.message) {
        setSuccess(result.message)
      }
    } catch (error) {
      console.error('[SignupForm] unexpected error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up to start booking appointments
        </CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent>
          <FieldSet className="gap-6">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sign up failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            {success ? (
              <Alert>
                <AlertTitle>Account created</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            ) : null}

            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <FieldContent>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <PasswordInput
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                  {password ? (
                    <FieldDescription>
                      <PasswordStrengthIndicator password={password} showRequirements />
                    </FieldDescription>
                  ) : null}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <FieldContent>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  {confirmPassword && password !== confirmPassword ? (
                    <FieldDescription className="text-destructive font-medium">
                      Passwords do not match
                    </FieldDescription>
                  ) : null}
                  {confirmPassword && password === confirmPassword ? (
                    <FieldDescription className="text-primary font-medium">
                      ✓ Passwords match
                    </FieldDescription>
                  ) : null}
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>

        <CardFooter>
          <ButtonGroup className="w-full flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isPasswordValid || password !== confirmPassword}
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
            <p className="text-sm font-medium text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:text-foreground">
                Sign in
              </Link>
            </p>
          </ButtonGroup>
        </CardFooter>
      </form>
      </Card>
    </div>
  )
}
