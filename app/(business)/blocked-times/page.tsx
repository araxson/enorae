import { BlockedTimesManagement } from '@/features/blocked-times'

export const metadata = {
  title: 'Blocked Times',
  description: 'Manage blocked time slots',
}

export default async function BlockedTimesPage() {
  return <BlockedTimesManagement />
}
