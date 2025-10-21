import { StaffServices } from '@/features/business/staff-services'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({ title: 'Staff Services', description: 'Manage services for staff member', noIndex: true })

export default async function StaffServicesPage({ params }: { params: Promise<{ 'staff-id': string }> }) {
  return <StaffServices params={params} />
}
