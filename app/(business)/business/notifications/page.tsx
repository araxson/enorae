import { BusinessNotificationManagement } from '@/features/business/notifications/management'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Notifications',
  description: 'Manage notification preferences and message history',
  noIndex: true,
})

export default async function NotificationsPage() {
  return <BusinessNotificationManagement />
}
