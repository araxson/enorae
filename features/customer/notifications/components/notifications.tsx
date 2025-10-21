import { Notifications as SharedNotifications } from '@/features/shared/notifications'

export async function Notifications() {
  return (
    <div className="mx-auto w-full px-6 max-w-6xl pb-16 pt-6">
      <SharedNotifications />
    </div>
  )
}
