'use client'

import type { SignupResult } from '../api/types'
import { useActionState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  Field,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { SignupFormHeader, SignupFormFields, SignupSocialButtons } from './sections'

export function SignupForm(): React.ReactElement {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<SignupResult, FormData>(signup, {
    success: false,
    error: '',
  } as SignupResult)
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state && 'errors' in state && state.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state])

  // Handle OTP redirect
  useEffect(() => {
    if (state && 'success' in state && state.success && 'requiresOTP' in state && state.requiresOTP && 'email' in state) {
      const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(state.email)}&type=email`
      router.push(redirectUrl)
    }
  }, [state, router])

  const hasErrors =
    state && 'errors' in state && state.errors && Object.keys(state.errors).length > 0

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={formAction} className="flex flex-col gap-6 p-6 md:p-8" noValidate>
            <FieldGroup className="gap-6">
              <SignupFormHeader />

              {/* Screen reader announcement for form status */}
              <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {isPending && 'Form is submitting, please wait'}
                {state && 'error' in state && state.error && !isPending && state.error}
              </div>

              {/* Error summary */}
              {hasErrors && (
                <Alert variant="destructive" role="alert" tabIndex={-1}>
                  <AlertCircle className="size-4" />
                  <AlertTitle>
                    There are {Object.keys('errors' in state && state.errors ? state.errors : {}).length} errors in the form
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {Object.entries('errors' in state && state.errors ? state.errors : {}).map(([field, messages]) => (
                        <li key={field}>
                          <a
                            href={`#${field}`}
                            className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                          >
                            {field === '_form' ? 'Form' : field}: {(messages as string[])[0]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* General error */}
              {state && 'error' in state && state.error && !hasErrors && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Sign up failed</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {/* Success message */}
              {state && 'success' in state && state.success && 'message' in state && state.message && (
                <Alert role="status" aria-live="polite">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <AlertTitle>Account created</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <SignupFormFields
                hasErrors={!!hasErrors}
                state={state}
                isPending={isPending}
                firstErrorRef={firstErrorRef as React.RefObject<HTMLInputElement>}
              />

              <Field className="space-y-2">
                <Button type="submit" disabled={isPending} aria-busy={isPending}>
                  {isPending ? (
                    <>
                      <Spinner className="size-4" />
                      <span aria-hidden="true">Creating account...</span>
                      <span className="sr-only">Creating your account, please wait</span>
                    </>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium underline-offset-4 hover:underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>

              <SignupSocialButtons />

              <FieldDescription className="px-2 text-center">
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
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-semibold text-primary">Enorae</span>
                </div>
                <p className="text-muted-foreground text-balance">
                  Create a free account to access smart scheduling, staff tools, and analytics.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
