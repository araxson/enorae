export {
  sendNotification,
  markNotificationsRead,
} from './send'
export { updateNotificationPreferences } from './preferences'
export {
  upsertNotificationTemplate,
  deleteNotificationTemplate,
} from './templates'
export {
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendReviewRequest,
  sendTestNotification,
} from './workflows'
// Export specific functions from helpers to avoid duplicates
export { validateNotificationData, sendNotificationEmail, logNotificationActivity } from './helpers'
// Export everything from utilities (includes getSupabaseClient, ensureRecipientAuthorized)
export * from './utilities'
export * from './test'
