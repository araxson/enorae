// Barrel export for preferences API
// Provides centralized access to all preference queries and mutations

// Queries
export {
  getUserPreferences,
  getUserPreference,
} from './queries'

// Mutations
export {
  upsertUserPreference,
  deleteUserPreference,
  updateNotificationPreferences,
  updateAdvancedPreferences,
  type ActionResponse,
} from './mutations'

// Schemas
export {
  themeModeEnum,
  dateFormatEnum,
  timeFormatEnum,
  languageCodeEnum,
  userPreferencesSchema,
  advancedPreferencesSchema,
  notificationTimingSchema,
  type UserPreferencesSchema,
  type AdvancedPreferencesSchema,
  type NotificationTimingSchema,
} from './schema'
