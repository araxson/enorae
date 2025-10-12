import { BusinessNotificationManagement } from './management'

export function BusinessNotificationsFeature() {
  return <BusinessNotificationManagement />
}

export { BusinessNotificationManagement }
export * from './api/queries'
export * from './api/mutations'
export * from './types'
