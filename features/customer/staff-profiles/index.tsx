import { Section } from '@/components/layout'
import { notFound } from 'next/navigation'
import { getStaffProfile } from './api/queries'
import { StaffProfileDetail } from './components/staff-profile-detail'

export async function StaffProfilePage({ staffId }: { staffId: string }) {
  const profile = await getStaffProfile(staffId)

  if (!profile) {
    notFound()
  }

  return (
    <Section size="lg">
      <StaffProfileDetail profile={profile} />
    </Section>
  )
}

export { getStaffProfile, getSalonStaff } from './api/queries'
export type { StaffProfile } from './api/queries'
