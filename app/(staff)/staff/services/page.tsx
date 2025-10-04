import { StaffServices } from '@/features/staff/services'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Services',
  description: 'Manage the services you provide',
  noIndex: true,
})

export default async function StaffServicesPage() {
  return <StaffServices />
}
