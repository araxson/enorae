'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/layout'
import { AlertCircle } from 'lucide-react'
import { Small } from '@/components/ui/typography'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
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
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </Stack>
          </Stack>
        </CardContent>

        <CardFooter>
          <Stack gap="sm" className="w-full">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <Small className="text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:text-foreground">
                Sign in
              </Link>
            </Small>
          </Stack>
        </CardFooter>
      </form>
    </Card>
  )
}
