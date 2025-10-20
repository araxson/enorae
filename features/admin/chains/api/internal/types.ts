export type ChainActionResponse =
  | { success: true; message: string }
  | { success: false; error: string }
