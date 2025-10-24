import { OperatingHoursManagement } from '@/features/business/operating-hours'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Operating Hours',
  description: 'Manage salon operating hours and availability',
  noIndex: true,
})

export default async function OperatingHoursPage() {
  return <OperatingHoursManagement />
}
