export type SignupResult =
  | { success: false; error: string; errors?: Record<string, string[]> }
  | { success: true; requiresOTP: true; email: string }
  | { success: true; requiresOTP?: false; message: string }
  | { success: true; requiresOTP?: false; message?: never }
