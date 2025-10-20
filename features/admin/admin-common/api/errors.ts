import 'server-only'

export const logAdminQueryError = (context: string, error: unknown) => {
  console.error(`[AdminQuery] ${context}`, error)
}
