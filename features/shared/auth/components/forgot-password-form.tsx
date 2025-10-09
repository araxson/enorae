'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { AlertCircle, CheckCircle2, Mail, ArrowLeft } from 'lucide-react'
import { Small } from '@/components/ui/typography'

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await requestPasswordReset(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Stack gap="md">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Click the link in the email to reset your password. The link will expire in 1
                  hour.
                </AlertDescription>
              </Alert>

              <Small className="text-center text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
              </Small>
            </Stack>
          </CardContent>

          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Forgot password?</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
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
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <Small className="text-muted-foreground">
                  We&apos;ll send a password reset link to this email
                </Small>
              </Stack>
            </Stack>
          </CardContent>

          <CardFooter>
            <Stack gap="sm" className="w-full">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </Stack>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
