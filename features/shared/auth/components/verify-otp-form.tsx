'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyOTP, resendOTP } from '@/features/shared/auth/api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import { OTPInput, ResendOTP } from './otp-input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

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
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-4 items-center justify-center">
          <div className="mb-4 flex items-center justify-center">
            <Shield className="h-12 w-12 text-primary" aria-hidden="true" />
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>

      <CardContent>
        <FieldSet className="gap-6">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel>Verification code</FieldLabel>
              <FieldContent className="items-center gap-4">
                <OTPInput
                  length={6}
                  onChange={setOtp}
                  onComplete={setOtp}
                  disabled={loading}
                />
                <FieldDescription className="flex items-center justify-center gap-2 text-center">
                  <span className="font-medium text-muted-foreground">
                    Didn&apos;t receive the code?
                  </span>
                  <ResendOTP onResend={handleResend} cooldownSeconds={60} />
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>

          {otp.length === 6 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Ready to verify</AlertTitle>
              <AlertDescription>Code entered. Click verify to continue.</AlertDescription>
            </Alert>
          ) : null}
        </FieldSet>
      </CardContent>

        <CardFooter>
          <ButtonGroup className="w-full flex-col gap-4">
            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify code</span>
              )}
            </Button>

            <p className="text-sm font-medium text-center text-muted-foreground">
              Check your spam folder if you don&apos;t see the email
            </p>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  )
}
