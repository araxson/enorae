export type VerifyOtpResult =
  | { success: false; error: string; errors?: Record<string, string[]> }
  | { success: true }

export type ResendOtpResult =
  | { success: false; error: string; errors?: Record<string, string[]> }
  | { success: true; message: string }
