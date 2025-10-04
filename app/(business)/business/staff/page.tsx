import { StaffManagement } from '@/features/business/staff'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Staff',
  description: 'Manage your salon staff members and schedules',
  noIndex: true,
})

export default async function StaffPage() {
  return <StaffManagement />
}
