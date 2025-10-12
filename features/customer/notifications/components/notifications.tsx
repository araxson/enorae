import { Container } from '@/components/layout'
import { Notifications as SharedNotifications } from '@/features/shared/notifications'

export async function Notifications() {
  return (
    <Container size="lg" className="pb-16 pt-6">
      <SharedNotifications />
    </Container>
  )
}
