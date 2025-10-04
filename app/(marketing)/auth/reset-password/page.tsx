import { ResetPasswordForm } from '@/features/shared/auth/components/reset-password-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password | Enorae',
  description: 'Create a new password',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
