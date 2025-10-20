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
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === 'string')
    ) {
      return parsed as string[]
    }
  } catch {
    return undefined
  }

  return undefined
}
