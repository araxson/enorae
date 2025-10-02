'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack, Box } from '@/components/layout'
import { AlertCircle } from 'lucide-react'
import { P, Small } from '@/components/ui/typography'

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
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Small className="text-center text-muted-foreground">
              Don't have an account?{' '}
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
