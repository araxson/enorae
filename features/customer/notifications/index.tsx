import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Notifications } from './components'

export function NotificationsFeature() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner /></div>}>
      <Notifications />
    </Suspense>
  )
}

export { Notifications } from './components'
export * from './types'
