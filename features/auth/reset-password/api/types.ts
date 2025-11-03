export type PasswordResetResult =
  | { success: false; error: string }
  | { success: true }
