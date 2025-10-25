'use server'

import {
  deleteNotificationTemplate as deleteNotificationTemplateAction,
  markNotificationsRead as markNotificationsReadAction,
  sendAppointmentConfirmation as sendAppointmentConfirmationAction,
  sendAppointmentReminder as sendAppointmentReminderAction,
  sendNotification as sendNotificationAction,
  sendReviewRequest as sendReviewRequestAction,
  sendTestNotification as sendTestNotificationAction,
  updateNotificationPreferences as updateNotificationPreferencesAction,
  upsertNotificationTemplate as upsertNotificationTemplateAction,
} from './mutations'

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const sendNotification = createServerActionProxy(sendNotificationAction)
export const markNotificationsRead = createServerActionProxy(markNotificationsReadAction)
export const updateNotificationPreferences = createServerActionProxy(
  updateNotificationPreferencesAction
)
export const upsertNotificationTemplate = createServerActionProxy(upsertNotificationTemplateAction)
export const deleteNotificationTemplate = createServerActionProxy(deleteNotificationTemplateAction)
export const sendAppointmentConfirmation = createServerActionProxy(
  sendAppointmentConfirmationAction
)
export const sendAppointmentReminder = createServerActionProxy(sendAppointmentReminderAction)
export const sendReviewRequest = createServerActionProxy(sendReviewRequestAction)
export const sendTestNotification = createServerActionProxy(sendTestNotificationAction)
