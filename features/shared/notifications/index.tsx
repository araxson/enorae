import { getNotifications } from './api/queries'
import { NotificationCenter } from './components/notification-center'

export async function Notifications() {
  const notifications = await getNotifications()
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <NotificationCenter notifications={notifications} />
    </section>
  )
}

export { NotificationCenter } from './components/notification-center'
