export type VerifyOtpResult =
  | { success: false; error: string }
  | { success: true }

export type ResendOtpResult =
  | { success: false; error: string }
  | { success: true; message: string }
