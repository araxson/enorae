'use server'

import {
  deleteNotification as deleteNotificationAction,
  markAllNotificationsAsRead as markAllNotificationsAsReadAction,
  markNotificationAsRead as markNotificationAsReadAction,
  sendNotification as sendNotificationAction,
} from '@/features/shared/notifications/api/mutations'

type ServerAction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>

function createServerActionProxy<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
): ServerAction<TArgs, TResult> {
  return (...args) => action(...args)
}

export const markNotificationAsRead = createServerActionProxy(markNotificationAsReadAction)
export const markAllNotificationsAsRead = createServerActionProxy(markAllNotificationsAsReadAction)
export const deleteNotification = createServerActionProxy(deleteNotificationAction)
export const sendNotification = createServerActionProxy(sendNotificationAction)
