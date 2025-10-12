const MAX_TEXT_LENGTH = 1000

export function sanitizeAdminText(value: string | undefined | null, fallback = ''): string {
  if (!value) return fallback
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .slice(0, MAX_TEXT_LENGTH)
}
