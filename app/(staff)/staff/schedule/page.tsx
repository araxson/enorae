import { StaffSchedule } from '@/features/staff/schedule'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Schedule',
  description: 'View and manage your work schedule',
  noIndex: true,
})

export default async function StaffSchedulePage() {
  return <StaffSchedule />
}
