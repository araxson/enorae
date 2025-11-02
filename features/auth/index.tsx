// Login
export { LoginForm } from './login'
export { login } from './login'
export type { LoginResult, LoginSchema } from './login'

// Signup
export { SignupForm } from './signup'
export { signup } from './signup'
export type { SignupResult, SignupInput } from './signup'

// Forgot Password
export { ForgotPasswordForm } from './forgot-password'
export { requestPasswordReset } from './forgot-password'
export type { PasswordResetRequestResult, PasswordResetInput } from './forgot-password'

// Reset Password
export { ResetPasswordForm } from './reset-password'
export { resetPassword } from './reset-password'
export type { PasswordResetResult, ConfirmResetInput } from './reset-password'

// Verify OTP
export { VerifyOTPForm } from './verify-otp'
export { verifyOTP, resendOTP } from './verify-otp'
export type { VerifyOtpResult, ResendOtpResult, OTPInput } from './verify-otp'

// Common components
export { PasswordInput, PasswordStrengthIndicator, usePasswordStrength, OAuthButtons } from './common'

// Page wrappers
export { LoginPage, SignupPage } from './pages'
export {
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyOtpPage,
  forgotPasswordPageMetadata,
  resetPasswordPageMetadata,
  verifyOtpPageMetadata
} from './pages'
