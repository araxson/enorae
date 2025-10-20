export type LoginResult = {
  error?: string
  requiresOTP?: boolean
  email?: string
}

export type SignupResult = {
  success?: true
  error?: string
  requiresOTP?: boolean
  email?: string
  message?: string
}

export type VerifyOtpResult = {
  success?: true
  error?: string
}

export type ResendOtpResult = {
  success?: true
  error?: string
  message?: string
}

export type PasswordResetRequestResult = {
  success?: true
  error?: string
  message?: string
}

export type PasswordResetResult = {
  error?: string
}
