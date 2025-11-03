export type LoginResult =
  | { success: false; error: string; requiresOTP?: boolean; email?: string }
  | { success: true; requiresOTP: true; email: string }
  | { success: true; requiresOTP?: false; email?: never }
