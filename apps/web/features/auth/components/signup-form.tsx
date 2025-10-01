'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { Input } from '@enorae/ui'
import { Label } from '@enorae/ui'
import { RadioGroup, RadioGroupItem } from '@enorae/ui'
import { signupAction } from '../actions/auth.actions'
import { useState } from 'react'

export function SignupForm() {
  const [error, setError] = useState<string>()
  const [userType, setUserType] = useState<'customer' | 'business'>('customer')

  const handleSubmit = async (formData: FormData) => {
    formData.set('userType', userType)
    const result = await signupAction(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Join Enorae to start booking or managing your salon
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
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

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
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup value={userType} onValueChange={(v) => setUserType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="cursor-pointer">
                  Customer (Book appointments)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business" className="cursor-pointer">
                  Business Owner (Manage salon)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}