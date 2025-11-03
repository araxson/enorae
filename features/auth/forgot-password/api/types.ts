export type PasswordResetRequestResult =
  | { success: false; error: string }
  | { success: true; message: string }
