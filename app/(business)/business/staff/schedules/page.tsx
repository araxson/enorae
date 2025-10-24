import { StaffSchedulesManagement } from '@/features/business/staff-schedules'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Staff Schedules',
  description: 'Manage staff working schedules and availability',
  noIndex: true,
})

export default async function StaffSchedulesPage() {
  return <StaffSchedulesManagement />
}
