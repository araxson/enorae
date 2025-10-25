import 'server-only'

import type { AdminUserRow, MetadataRow, ProfileSummary } from './types'

export const sanitizeSearchTerm = (term: string) =>
  term.replace(/[%]/g, '\\%').replace(/_/g, '\\_')

export const toRecord = (value: MetadataRow['social_profiles']): Record<string, string> => {
  if (!value || typeof value !== 'object') return {}

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>(
    (acc, [key, raw]) => {
      if (typeof raw === 'string' && raw.trim().length > 0) {
        acc[key] = raw.trim()
      }
      return acc
    },
    {},
  )
}

export const mapSummary = (
  row: AdminUserRow,
  lastActiveAt: string | null,
): ProfileSummary => ({
  id: row['id'] ?? '',
  fullName: row['full_name'] ?? null,
  email: row['email'] ?? null,
  username: row['username'] ?? null,
  primaryRole: row['primary_role'] ?? null,
  roles: row['roles'] ?? [],
  status: row['status'] ?? null,
  avatarUrl: row['avatar_url'] ?? null,
  createdAt: row['created_at'] ?? null,
  updatedAt: row['updated_at'] ?? null,
  countryCode: row['country_code'] ?? null,
  locale: row['locale'] ?? null,
  timezone: row['timezone'] ?? null,
  lastActiveAt,
  emailVerified: row['email_verified'] ?? null,
})
