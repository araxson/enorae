'use client'

import type { VerifyOtpResult, ResendOtpResult } from '../api/types'
import { useState, useActionState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyOTP, resendOTP } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import { ResendOTP } from './resend-otp'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

interface VerifyOTPFormProps {
  email?: string
  type?: 'email' | 'sms' | 'recovery'
  redirectTo?: string
}

export function VerifyOTPForm({
  email: initialEmail,
  type = 'email',
  redirectTo = '/',
}: VerifyOTPFormProps): React.ReactElement {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email')
  const email = initialEmail || emailFromUrl || ''

  const [state, formAction, isPending] = useActionState<VerifyOtpResult, FormData>(
    verifyOTP,
    null as unknown as VerifyOtpResult
  )
  const [otp, setOtp] = useState('')

  // Handle success redirect
  useEffect(() => {
    if (state?.success) {
      router.push(redirectTo)
    }
  }, [state?.success, router, redirectTo])

  // Clear OTP on error
  useEffect(() => {
    if (state && !state.success && state.error) {
      setOtp('')
    }
  }, [state])

  async function handleResend() {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('type', type === 'recovery' ? 'recovery' : 'signup')

    await resendOTP(formData)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={formAction} className="flex flex-col gap-6 p-6 md:p-8" noValidate>
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Shield className="size-12 text-primary" aria-hidden="true" />
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We sent a 6-digit code to <span className="font-medium">{email}</span>
                </p>
              </div>

              {/* Screen reader announcement for form status */}
              <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {isPending && 'Form is submitting, please wait'}
                {state && !state.success && state.error && !isPending && state.error}
              </div>

              {/* Hidden fields for form data */}
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="type" value={type} />

              {state && !state.success && state.error && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Verification failed</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <Field>
                <FieldLabel htmlFor="token">
                  Verification code
                  <span className="text-destructive" aria-label="required"> *</span>
                </FieldLabel>
                <InputOTP
                  id="token"
                  name="token"
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isPending}
                  containerClassName="justify-center gap-4"
                  required
                  aria-required="true"
                  aria-invalid={!!(state && !state.success && state.errors?.['token'])}
                  aria-describedby={
                    state && !state.success && state.errors?.['token']
                      ? 'token-error'
                      : undefined
                  }
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {state && !state.success && state.errors?.['token'] && (
                  <p id="token-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.errors['token'][0]}
                  </p>
                )}
                <FieldDescription className="flex flex-col items-center gap-2 text-center text-sm">
                  <span className="text-muted-foreground">
                    Didn&apos;t receive the code?
                  </span>
                  <ResendOTP onResend={handleResend} cooldownSeconds={60} />
                </FieldDescription>
              </Field>

              {otp.length === 6 && (
                <Alert>
                  <CheckCircle2 className="size-4 text-primary" />
                  <AlertTitle>Ready to verify</AlertTitle>
                  <AlertDescription>Code entered. Click verify to continue.</AlertDescription>
                </Alert>
              )}

              <Field className="space-y-2">
                <Button
                  type="submit"
                  disabled={isPending || otp.length !== 6}
                  aria-busy={isPending}
                >
                  {isPending ? (
                    <>
                      <Spinner className="size-4" />
                      <span aria-hidden="true">Verifying...</span>
                      <span className="sr-only">Verifying your code, please wait</span>
                    </>
                  ) : (
                    <span>Verify code</span>
                  )}
                </Button>
                <FieldDescription className="text-center text-sm">
                  Check your spam folder if you don&apos;t see the email
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="size-8 text-primary" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground text-balance">
                  Secure your account with one-time verification for bookings and account changes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
