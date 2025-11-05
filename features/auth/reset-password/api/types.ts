export type PasswordResetResult =
  | { success: false; error: string; errors?: Record<string, string[]> }
  | { success: true }
