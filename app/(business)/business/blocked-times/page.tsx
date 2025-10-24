import { BlockedTimesManagement } from '@/features/shared/blocked-times'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Blocked Times',
  description: 'Manage blocked time slots across the business calendar',
  noIndex: true,
})

export default async function BlockedTimesPage() {
  return <BlockedTimesManagement />
}
