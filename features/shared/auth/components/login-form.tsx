'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack, Flex } from '@/components/layout'
import { AlertCircle } from 'lucide-react'
import { Small } from '@/components/ui/typography'
import { PasswordInput } from './password-input'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)

      // IMPROVED: Redirect to OTP verification if email not verified
      if (result.requiresOTP && result.email) {
        setTimeout(() => {
          const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(result.email!)}&type=email`
          window.location.href = redirectUrl
        }, 2000) // Show error message for 2 seconds before redirecting
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
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
              <Flex justify="between" align="center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </Flex>
              <PasswordInput
                id="password"
                name="password"
                required
                placeholder="Enter your password"
              />
            </Stack>
          </Stack>
        </CardContent>

        <CardFooter>
          <Stack gap="sm" className="w-full">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Small className="text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline hover:text-foreground">
                Sign up
              </Link>
            </Small>
          </Stack>
        </CardFooter>
      </form>
    </Card>
  )
}
