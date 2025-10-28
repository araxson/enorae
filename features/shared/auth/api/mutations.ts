// Import and re-export all mutations from organized directory
// Each mutation file has 'use server' directive, making them server actions
export { login } from './mutations/login'
export { signup } from './mutations/signup'
export { logout } from './mutations/logout'
export { requestPasswordReset, resetPassword } from './mutations/password-reset'
export { verifyOTP, resendOTP } from './mutations/otp'

// Re-export types for convenience
export type {
  LoginResult,
  SignupResult,
  VerifyOtpResult,
  ResendOtpResult,
  PasswordResetRequestResult,
  PasswordResetResult,
} from './types'
