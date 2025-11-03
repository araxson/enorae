// Barrel export for notifications API
// Provides centralized access to all notification queries and mutations

// Queries
export {
  getNotifications,
  getUnreadNotificationsCount,
  getNotificationsByChannel,
} from './queries'

// Mutations
export {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendNotification,
} from './mutations'
