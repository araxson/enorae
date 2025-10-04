import { VerifyOTPForm } from '@/features/shared/auth/components/verify-otp-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email | Enorae',
  description: 'Verify your email address',
  robots: {
    index: false,
    follow: false,
  },
}

export default function VerifyOTPPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyOTPForm />
      </div>
    </div>
  )
}
