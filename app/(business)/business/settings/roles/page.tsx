import { RolesManagement } from '@/features/business/settings-roles'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'User Roles Management',
  description: 'Manage user roles, permissions, and access policies',
  noIndex: true,
})

export default async function RolesManagementPage() {
  return <RolesManagement />
}
