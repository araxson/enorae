// Barrel export for profile API
// Provides centralized access to all profile queries and mutations

// Queries
export {
  getProfileSummary,
  getMyProfileSummary,
} from './queries'

// Mutations
export {
  updateUsername,
  uploadAvatar,
  type ActionResponse,
} from './mutations'

// Schemas
export {
  profileUpdateSchema,
  profileMetadataSchema,
  avatarUploadSchema,
  profileSchema,
  type ProfileSchema,
  type ProfileUpdateSchema,
  type ProfileMetadataSchema,
  type AvatarUploadSchema,
} from './schema'
