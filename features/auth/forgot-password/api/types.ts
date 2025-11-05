export type PasswordResetRequestResult =
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
  | { success: true; message: string }
