'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldDescription, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { PasswordInput } from '@/features/auth/common/components/password-input'
import { OAuthButtons } from '@/features/auth/common/components/oauth-buttons'
import { MarketingPanel } from './marketing-panel'
import { login } from '../api/mutations'
import { loginSchema, type LoginSchema } from '../api/schema'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleSubmit(values: LoginSchema) {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)

      const result = await login(formData)

      if (result?.error) {
        setError(result.error)

        if (result.requiresOTP && result.email) {
          setTimeout(() => {
            const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(result.email!)}&type=email`
            router.push(redirectUrl)
          }, 2000)
        }
      }
    } catch (error) {
      console.error('[LoginForm] unexpected error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Login to your Enorae account
                  </p>
                </div>

                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Login failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <InputGroup>
                          <InputGroupAddon>
                            <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                          </InputGroupAddon>
                          <FormControl>
                            <InputGroupInput
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              autoComplete="email"
                              autoCorrect="off"
                              spellCheck={false}
                              {...field}
                            />
                          </FormControl>
                        </InputGroup>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <Link
                            href="/auth/forgot-password"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />

                <Field>
                  <Button type="submit" disabled={loading || form.formState.isSubmitting}>
                    {loading || form.formState.isSubmitting ? (
                      <>
                        <Spinner />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </Field>

                <div className="text-center">
                  <FieldDescription>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium underline-offset-4 hover:underline">
                      Sign up
                    </Link>
                  </FieldDescription>
                </div>

                <FieldSeparator>Or continue with</FieldSeparator>

                <OAuthButtons />

                <div className="px-2 text-center">
                  <FieldDescription>
                    By clicking continue, you agree to our{' '}
                    <Link href="/terms" className="underline-offset-4 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline-offset-4 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </FieldDescription>
                </div>
              </form>
            </Form>
            <MarketingPanel />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
