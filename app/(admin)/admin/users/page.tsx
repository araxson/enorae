import { UserManagement } from '@/features/admin/users'

export const metadata = {
  title: 'User Management',
  description: 'Manage platform users',
}

export default function UsersPage() {
  return <UserManagement />
}
