import type { Metadata } from 'next'
import { LoginForm } from './login'
import { SignupForm } from './signup'
import { ForgotPasswordForm } from './forgot-password'
import { ResetPasswordForm } from './reset-password'
import { VerifyOTPForm } from './verify-otp'

// Page wrapper component
function AuthCenteredPage({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
    </div>
  )
}

// Login Page
export function LoginPage(): React.ReactElement {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}

// Signup Page
export function SignupPage(): React.ReactElement {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}

// Verify OTP Page
export const verifyOtpPageMetadata: Metadata = {
  title: 'Verify Email | Enorae',
  description: 'Verify your email address',
  robots: {
    index: false,
    follow: false,
  },
}

export function VerifyOtpPage(): React.ReactElement {
  return (
    <AuthCenteredPage>
      <VerifyOTPForm />
    </AuthCenteredPage>
  )
}

// Reset Password Page
export const resetPasswordPageMetadata: Metadata = {
  title: 'Reset Password | Enorae',
  description: 'Create a new password',
  robots: {
    index: false,
    follow: false,
  },
}

export function ResetPasswordPage(): React.ReactElement {
  return (
    <AuthCenteredPage>
      <ResetPasswordForm />
    </AuthCenteredPage>
  )
}

// Forgot Password Page
export const forgotPasswordPageMetadata: Metadata = {
  title: 'Forgot Password | Enorae',
  description: 'Reset your password',
  robots: {
    index: false,
    follow: false,
  },
}

export function ForgotPasswordPage(): React.ReactElement {
  return (
    <AuthCenteredPage>
      <ForgotPasswordForm />
    </AuthCenteredPage>
  )
}
