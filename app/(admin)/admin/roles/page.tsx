import type { Metadata } from 'next'
import { AdminRoles } from '@/features/admin/roles'

export const metadata: Metadata = {
  title: 'Role Management - Admin Portal - ENORAE',
  description: 'Manage user roles and permissions across the platform',
}

export default function AdminRolesPage() {
  return <AdminRoles />
}
