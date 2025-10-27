import { Suspense } from 'react'

import { Notifications } from './components/notifications'

import { Spinner } from '@/components/ui/spinner'

export function NotificationsFeature() {

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      }
    >
      <Notifications />
    </Suspense>
  )
}

export { Notifications } from './components/notifications'
export * from './api/queries'
export * from './api/mutations'
