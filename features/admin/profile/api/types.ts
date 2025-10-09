import type { Database } from '@/lib/types/database.types'

export type AdminUserRow = Database['public']['Views']['admin_users_overview']['Row']
export type MetadataRow = Database['identity']['Tables']['profiles_metadata']['Row']
export type PreferencesRow = Database['identity']['Tables']['profiles_preferences']['Row']
export type UserRoleRow = Database['identity']['Tables']['user_roles']['Row']
export type AuditLogRow = Database['audit']['Tables']['audit_logs']['Row']

export interface ProfileSearchResult {
  id: string
  fullName: string | null
  email: string | null
  username: string | null
  primaryRole: string | null
  roles: string[]
  status: string | null
}

export interface ProfileSummary extends ProfileSearchResult {
  avatarUrl: string | null
  createdAt: string | null
  updatedAt: string | null
  countryCode: string | null
  locale: string | null
  timezone: string | null
  lastActiveAt: string | null
  emailVerified: boolean | null
}

export interface ProfileMetadataDetail {
  fullName: string | null
  avatarUrl: string | null
  avatarThumbnailUrl: string | null
  coverImageUrl: string | null
  interests: string[]
  tags: string[]
  socialProfiles: Record<string, string>
}

export interface ProfilePreferencesDetail {
  countryCode: string | null
  locale: string | null
  timezone: string | null
  preferences: Record<string, unknown>
  updatedAt: string | null
}

export interface ProfileRoleSummary {
  id: string
  role: string
  salonId: string | null
  isActive: boolean
  permissions: string[]
  createdAt: string | null
}

export interface ProfileActivityEntry {
  id: string
  createdAt: string | null
  eventType: string | null
  action: string | null
  entityType: string | null
  entityId: string | null
  isSuccess: boolean | null
  severity: string | null
  ipAddress: string | null
  userAgent: string | null
}

export interface ProfileDetail {
  summary: ProfileSummary
  metadata: ProfileMetadataDetail
  preferences: ProfilePreferencesDetail
  roles: ProfileRoleSummary[]
  activity: ProfileActivityEntry[]
}
