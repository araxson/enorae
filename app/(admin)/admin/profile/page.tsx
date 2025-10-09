import { AdminProfile } from '@/features/admin/profile'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Profile',
  description: 'Manage your admin profile and information',
  noIndex: true,
})

export default async function AdminProfilePage() {
  return <AdminProfile />
}
