export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

export function parseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null

  try {
    const parsed = typeof date === 'string' ? new Date(date) : date
    return isValidDate(parsed) ? parsed : null
  } catch {
    return null
  }
}
