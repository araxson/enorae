import type { Metadata } from 'next'

import { AuthCenteredPage } from './components/auth-centered-page'
import { ForgotPasswordForm } from './components/forgot-password-form'
import { ResetPasswordForm } from './components/reset-password-form'
import { VerifyOTPForm } from './components/verify-otp-form'

export const verifyOtpPageMetadata: Metadata = {
  title: 'Verify Email | Enorae',
  description: 'Verify your email address',
  robots: {
    index: false,
    follow: false,
  },
}

export function VerifyOtpPage() {
  return (
    <AuthCenteredPage>
      <VerifyOTPForm />
    </AuthCenteredPage>
  )
}

export const resetPasswordPageMetadata: Metadata = {
  title: 'Reset Password | Enorae',
  description: 'Create a new password',
  robots: {
    index: false,
    follow: false,
  },
}

export function ResetPasswordPage() {
  return (
    <AuthCenteredPage>
      <ResetPasswordForm />
    </AuthCenteredPage>
  )
}

export const forgotPasswordPageMetadata: Metadata = {
  title: 'Forgot Password | Enorae',
  description: 'Reset your password',
  robots: {
    index: false,
    follow: false,
  },
}

export function ForgotPasswordPage() {
  return (
    <AuthCenteredPage>
      <ForgotPasswordForm />
    </AuthCenteredPage>
  )
}
