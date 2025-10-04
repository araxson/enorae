import { ForgotPasswordForm } from '@/features/shared/auth/components/forgot-password-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password | Enorae',
  description: 'Reset your password',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
