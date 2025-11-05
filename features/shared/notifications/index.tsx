import { Section } from '@/features/shared/ui'
import { getNotifications } from './api/queries'
import { NotificationCenter } from './components'

export async function Notifications() {
  const notifications = await getNotifications()
  return (
    <Section width="lg">
      <NotificationCenter notifications={notifications} />
    </Section>
  )
}

export { NotificationCenter, NotificationCenterSkeleton } from './components'
export type * from './api/types'
