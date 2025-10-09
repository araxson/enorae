// Queries
export {
  getUnreadCount,
  getUnreadCounts,
  getRecentNotifications,
  getNotificationPreferences,
} from './api/queries'

// Mutations
export {
  sendNotification,
  markNotificationsRead,
  updateNotificationPreferences,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendReviewRequest,
} from './api/mutations'
