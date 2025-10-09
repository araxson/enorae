import { getNotifications } from './api/queries'
import { NotificationCenter } from './components/notification-center'

export async function Notifications() {
  const notifications = await getNotifications()
  return <NotificationCenter notifications={notifications} />
}

export { NotificationCenter } from './components/notification-center'
