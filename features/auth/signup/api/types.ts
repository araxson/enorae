export interface SignupResult {
  error?: string
  success?: boolean
  message?: string
  requiresOTP?: boolean
  email?: string
}
