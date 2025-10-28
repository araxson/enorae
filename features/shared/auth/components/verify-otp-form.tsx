'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyOTP, resendOTP } from '@/features/shared/auth/api/mutations'
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
}: VerifyOTPFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const email = initialEmail || emailFromUrl || ''

  async function handleVerify() {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('token', otp)
    formData.append('type', type)

    const result = await verifyOTP(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      setOtp('') // Clear OTP on error
    } else if (result?.success) {
      router.push(redirectTo)
    }
  }

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
          <div className="flex flex-col gap-6 p-6 md:p-8">
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Shield className="size-12 text-primary" aria-hidden="true" />
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We sent a 6-digit code to <span className="font-medium">{email}</span>
                </p>
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Verification failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Field>
                <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading}
                  containerClassName="justify-center gap-4"
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
                <FieldDescription className="flex flex-col items-center gap-2 text-center text-sm">
                  <span className="text-muted-foreground">
                    Didn&apos;t receive the code?
                  </span>
                  <ResendOTP onResend={handleResend} cooldownSeconds={60} />
                </FieldDescription>
              </Field>

              {otp.length === 6 ? (
                <Alert>
                  <CheckCircle2 className="size-4 text-primary" />
                  <AlertTitle>Ready to verify</AlertTitle>
                  <AlertDescription>Code entered. Click verify to continue.</AlertDescription>
                </Alert>
              ) : null}

              <Field className="space-y-2">
                <Button onClick={handleVerify} disabled={loading || otp.length !== 6}>
                  {loading ? (
                    <>
                      <Spinner className="size-4" />
                      <span>Verifying...</span>
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
          </div>
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
