'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyOTP, resendOTP } from '../api/mutations'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import { OTPInput, ResendOTP } from './otp-input'

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
        <CardHeader className="space-y-4 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-6">
            <OTPInput
              length={6}
              onChange={setOtp}
              onComplete={setOtp}
              disabled={loading}
            />

            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Didn&apos;t receive the code?</p>
              <ResendOTP onResend={handleResend} cooldownSeconds={60} />
            </div>
          </div>

          {otp.length === 6 && (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription>Code entered. Click verify to continue.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

        <CardFooter>
          <div className="flex w-full flex-col gap-4">
            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </Button>

            <p className="text-sm font-medium text-center text-muted-foreground">
              Check your spam folder if you don&apos;t see the email
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
