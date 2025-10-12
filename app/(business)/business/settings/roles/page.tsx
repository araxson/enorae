import { RolesManagement } from '@/features/business/settings-roles'

export const metadata = {
  title: 'User Roles Management',
  description: 'Manage user roles and permissions',
}

export default async function RolesManagementPage() {
  return <RolesManagement />
}
