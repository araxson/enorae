/**
 * Admin roles assignment helpers
 * Pure utility functions that can be imported by both server and client code
 */
import 'server-only'

import { z } from 'zod'
import { safeJsonParseStringArray } from '@/lib/utils/safe-json'

const permissionsArraySchema = z.array(z.string())

export function parsePermissions(
  raw: FormDataEntryValue | null,
): string[] | undefined {
  if (!raw || typeof raw !== 'string') return undefined

  const parsed = safeJsonParseStringArray(raw, [])
  if (parsed.length === 0) return undefined

  const validated = permissionsArraySchema.safeParse(parsed)
  return validated.success ? validated.data : undefined
}
