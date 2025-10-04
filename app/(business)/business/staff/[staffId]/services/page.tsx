import { getStaffById } from '@/features/business/staff/api/queries'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { StaffServices } from '@/features/business/staff-services'

type PageProps = {
  params: Promise<{ staffId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { staffId } = await params
  const staff = await getStaffById(staffId).catch(() => null)

  return genMeta({
    title: staff ? `${staff.full_name || 'Staff'} - Services` : 'Staff Services',
    description: 'Manage services for staff member',
    noIndex: true,
  })
}

export default async function StaffServicesPage({ params }: PageProps) {
  const { staffId } = await params
  return <StaffServices staffId={staffId} />
}
