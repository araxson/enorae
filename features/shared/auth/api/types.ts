export type LoginResult = {
  error?: string
  requiresOTP?: boolean
  email?: string
}

export type SignupResult = {
  success?: boolean
  error?: string
  requiresOTP?: boolean
  email?: string
  message?: string
}

export type PasswordResetRequestResult = {
  success?: boolean
  error?: string
  message?: string
}

export type PasswordResetResult = {
  success?: boolean
  error?: string
}

export type VerifyOtpResult = {
  success?: boolean
  error?: string
}

export type ResendOtpResult = {
  success?: boolean
  error?: string
  message?: string
}
