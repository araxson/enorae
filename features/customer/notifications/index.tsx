import { Suspense } from 'react'

import { Notifications } from './components/notifications'

import { PageLoading } from '@/features/shared/ui-components'

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
