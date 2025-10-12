import { StaffProfilePage } from '@/features/customer/staff-profiles'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StaffDetailPage({ params }: PageProps) {
  const { id } = await params

  return <StaffProfilePage staffId={id} />
}
