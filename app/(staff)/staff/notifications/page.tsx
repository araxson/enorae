import { Notifications } from '@/features/shared/notifications'

export const metadata = {
  title: 'Notifications',
  description: 'View and manage your notifications',
}

export default async function NotificationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <Notifications />
    </div>
  )
}
