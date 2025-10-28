/**
 * Admin roles assignment helpers
 * Pure utility functions that can be imported by both server and client code
 */

export function parsePermissions(
  raw: FormDataEntryValue | null,
): string[] | undefined {
  if (!raw || typeof raw !== 'string') return undefined

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return undefined
    // Type guard: filter to ensure all items are strings
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return undefined
  }
}
