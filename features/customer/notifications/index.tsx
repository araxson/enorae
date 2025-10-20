import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { Notifications as NotificationsComponent } from './components/notifications'

export function NotificationsFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <NotificationsComponent />
    </Suspense>
  )
}

export { NotificationsComponent as Notifications } from './components/notifications'
export * from './api/queries'
export * from './api/mutations'
