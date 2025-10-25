'use server'

import { login as loginAction, signup as signupAction, logout as logoutAction } from './internal/login'
import {
  requestPasswordReset as requestPasswordResetAction,
  resetPassword as resetPasswordAction,
} from './internal/password'
import { verifyOTP as verifyOTPAction, resendOTP as resendOTPAction } from './internal/otp'
import type {
  LoginResult,
  SignupResult,
  VerifyOtpResult,
  ResendOtpResult,
  PasswordResetRequestResult,
  PasswordResetResult,
} from './internal/types'

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const login = createServerActionProxy(loginAction)
export const signup = createServerActionProxy(signupAction)
export const logout = createServerActionProxy(logoutAction)
export const requestPasswordReset = createServerActionProxy(requestPasswordResetAction)
export const resetPassword = createServerActionProxy(resetPasswordAction)
export const verifyOTP = createServerActionProxy(verifyOTPAction)
export const resendOTP = createServerActionProxy(resendOTPAction)

export type {
  LoginResult,
  SignupResult,
  VerifyOtpResult,
  ResendOtpResult,
  PasswordResetRequestResult,
  PasswordResetResult,
}
