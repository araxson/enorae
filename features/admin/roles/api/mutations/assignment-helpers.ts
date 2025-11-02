/**
 * Admin roles assignment helpers
 * Pure utility functions that can be imported by both server and client code
 */

import { z } from 'zod'

const permissionsArraySchema = z.array(z.string())

export function parsePermissions(
  raw: FormDataEntryValue | null,
): string[] | undefined {
  if (!raw || typeof raw !== 'string') return undefined

  try {
    const parsed = JSON.parse(raw)
    const validated = permissionsArraySchema.safeParse(parsed)
    return validated.success ? validated.data : undefined
  } catch {
    return undefined
  }
}
