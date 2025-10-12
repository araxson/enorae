import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { Notifications } from '@/features/customer/notifications'

export const metadata = {
  title: 'Notifications',
  description: 'View and manage your notifications',
}

export default function CustomerNotificationsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Notifications />
    </Suspense>
  )
}
