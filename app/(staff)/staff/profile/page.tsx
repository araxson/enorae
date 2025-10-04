import { StaffProfile } from '@/features/staff/profile'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Profile',
  description: 'Manage your staff profile and information',
  noIndex: true,
})

export default async function StaffProfilePage() {
  return <StaffProfile />
}
