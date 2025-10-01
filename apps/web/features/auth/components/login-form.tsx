'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { Input } from '@enorae/ui'
import { Label } from '@enorae/ui'
import { loginAction } from '../actions/auth.actions'
import { useState } from 'react'

export function LoginForm() {
  const [error, setError] = useState<string>()

  const handleSubmit = async (formData: FormData) => {
    const result = await loginAction(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Sign in to your Enorae account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}