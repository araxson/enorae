import { BusinessNotificationManagement } from './management'

export function BusinessNotificationsFeature() {
  return <BusinessNotificationManagement />
}

export { BusinessNotificationManagement }
export * from './api/queries/index'
export * from './api/mutations/index'
export type * from './api/types'
