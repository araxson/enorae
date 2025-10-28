export interface AdminProfileOverview {}

export interface AdminProfileFilter {}

// Re-export types from api/types.ts
export type {
  AdminUserRow,
  MetadataRow,
  PreferencesRow,
  UserRoleRow,
  AuditLogRow,
  ProfileSearchResult,
  ProfileSummary,
  ProfileMetadataDetail,
  ProfilePreferencesDetail,
  ProfileRoleSummary,
  ProfileActivityEntry,
  ProfileDetail,
} from './api/queries/types'
