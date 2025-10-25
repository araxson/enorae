'use server'

import {
  deleteNotification as deleteNotificationAction,
  markAllNotificationsAsRead as markAllNotificationsAsReadAction,
  markNotificationAsRead as markNotificationAsReadAction,
  sendNotification as sendNotificationAction,
} from '@/features/shared/notifications/api/mutations'

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const markNotificationAsRead = createServerActionProxy(markNotificationAsReadAction)
export const markAllNotificationsAsRead = createServerActionProxy(markAllNotificationsAsReadAction)
export const deleteNotification = createServerActionProxy(deleteNotificationAction)
export const sendNotification = createServerActionProxy(sendNotificationAction)
