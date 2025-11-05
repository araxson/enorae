import 'server-only'

export const logAdminQueryError = (context: string, error: unknown): void => {
  console.error(`[AdminQuery] ${context}`, error)
}
