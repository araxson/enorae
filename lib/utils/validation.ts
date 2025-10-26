/**
 * Validation utilities for common patterns (UUIDs, etc.)
 */

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function parseUuid(value: FormDataEntryValue | null | undefined) {
  const stringValue = value?.toString()
  if (!stringValue || !UUID_REGEX.test(stringValue)) {
    return { error: 'Invalid identifier' as const }
  }
  return { value: stringValue }
}

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}
