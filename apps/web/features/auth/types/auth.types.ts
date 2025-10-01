export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  fullName: string
  userType: 'customer' | 'business'
}

export interface AuthError {
  message: string
  code?: string
}