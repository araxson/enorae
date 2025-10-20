'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/layout'
import { AlertCircle } from 'lucide-react'
import { PasswordInput } from './password-input'
import { PasswordStrengthIndicator, usePasswordStrength } from './password-strength-indicator'

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
          <Stack gap="md">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Stack gap="xs">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
              />
            </Stack>

            <Stack gap="xs">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </Stack>

            <Stack gap="xs">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              {password && (
                <PasswordStrengthIndicator password={password} showRequirements />
              )}
            </Stack>

            <Stack gap="xs">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <small className="text-sm font-medium leading-none text-destructive">Passwords do not match</small>
              )}
              {confirmPassword && password === confirmPassword && (
                <small className="text-sm font-medium leading-none text-green-600">✓ Passwords match</small>
              )}
            </Stack>
          </Stack>
        </CardContent>

        <CardFooter>
          <Stack gap="sm" className="w-full">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isPasswordValid || password !== confirmPassword}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <small className="text-sm font-medium leading-none text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:text-foreground">
                Sign in
              </Link>
            </small>
          </Stack>
        </CardFooter>
      </form>
      </Card>
    </div>
  )
}
