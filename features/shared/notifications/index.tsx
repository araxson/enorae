import { Section } from '@/components/layout'
import { getNotifications } from './api/queries'
import { NotificationCenter } from './components/notification-center'

export async function Notifications() {
  const notifications = await getNotifications()
  return (
    <Section size="lg">
      <NotificationCenter notifications={notifications} />
    </Section>
  )
}

export { NotificationCenter } from './components/notification-center'
