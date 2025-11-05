'use client'

import type { LoginResult } from '../api/types'
import { useActionState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { PasswordInput } from '@/features/auth/common/components'
import { MarketingPanel } from './marketing-panel'
import { LoginOAuthSection } from './login-oauth-section'
import { login } from '../api/mutations'

export function LoginForm(): React.ReactElement {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(login, {})
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Handle OTP redirect
  useEffect(() => {
    if (state?.requiresOTP && state?.email) {
      const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(state.email)}&type=email`
      router.push(redirectUrl)
    }
  }, [state?.requiresOTP, state?.email, router])

  const hasErrors = state?.errors && Object.keys(state.errors ?? {}).length > 0

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Login to your Enorae account
                </p>
              </div>

              {/* Screen reader announcement for form status */}
              <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {isPending && 'Form is submitting, please wait'}
                {state?.error && !isPending && state.error}
              </div>

              {/* Error summary for screen readers and visual users */}
              {hasErrors && (
                <Alert variant="destructive" role="alert" tabIndex={-1}>
                  <AlertCircle className="size-4" />
                  <AlertTitle>There are {Object.keys(state.errors ?? {}).length} errors in the form</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {Object.entries(state.errors ?? {}).map(([field, messages]) => (
                        <li key={field}>
                          <a
                            href={`#${field}`}
                            className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                          >
                            {field}: {(messages as string[])[0]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* General error message */}
              {state?.error && !hasErrors && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Login failed</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {/* OTP redirect message */}
              {state?.requiresOTP && (
                <Alert variant="default" role="status" aria-live="polite">
                  <CheckCircle2 className="size-4 text-blue-600" />
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription>
                    Redirecting to verification page...
                  </AlertDescription>
                </Alert>
              )}

              <form action={formAction} className="flex flex-col gap-6" noValidate>
                {/* Email field */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupInput
                      ref={state?.errors?.['email'] ? firstErrorRef : null}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      aria-required="true"
                      aria-invalid={!!state?.errors?.['email']}
                      aria-describedby={state?.errors?.['email'] ? 'email-error' : undefined}
                      disabled={isPending}
                    />
                  </InputGroup>
                  {state?.errors?.['email'] && (
                    <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                      {state.errors['email'][0]}
                    </p>
                  )}
                </Field>

                {/* Password field */}
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
                  <PasswordInput
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    aria-required="true"
                    aria-invalid={!!state?.errors?.['password']}
                    aria-describedby={state?.errors?.['password'] ? 'password-error' : undefined}
                    disabled={isPending}
                  />
                  {state?.errors?.['password'] && (
                    <p id="password-error" className="text-sm text-destructive mt-1" role="alert">
                      {state.errors['password'][0]}
                    </p>
                  )}
                </Field>

                <div className="text-center">
                  <FieldDescription>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium underline-offset-4 hover:underline">
                      Sign up
                    </Link>
                  </FieldDescription>
                </div>

                <Field>
                  <Button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                  >
                    {isPending ? (
                      <>
                        <Spinner />
                        <span aria-hidden="true">Signing in...</span>
                        <span className="sr-only">Signing in, please wait</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </Field>

                <LoginOAuthSection />
              </form>
            </div>
            <MarketingPanel />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
