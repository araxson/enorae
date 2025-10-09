import { BusinessNotificationManagement } from '@/features/business/notifications/management'

export const metadata = {
  title: 'Notifications',
  description: 'View and manage your notifications',
}

export default async function NotificationsPage() {
  return <BusinessNotificationManagement />
}
