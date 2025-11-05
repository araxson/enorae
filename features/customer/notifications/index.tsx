import { Suspense } from 'react'
import { CustomerNotificationsSkeleton, Notifications } from './components'

export function NotificationsFeature() {
  return (
    <Suspense fallback={<CustomerNotificationsSkeleton />}>
      <Notifications />
    </Suspense>
  )
}

export { Notifications, CustomerNotificationsSkeleton } from './components'
export type * from './api/types'
