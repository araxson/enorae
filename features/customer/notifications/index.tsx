import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { Notifications } from './components/notifications'

export function NotificationsFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Notifications />
    </Suspense>
  )
}

export { Notifications } from './components/notifications'
export * from './api/queries'
export * from './api/mutations'
