import type { Metadata } from 'next'
import { AdminStaff } from '@/features/admin/staff'

export const metadata: Metadata = {
  title: 'Staff Management - Admin Portal - ENORAE',
  description: 'Manage staff members and their roles across all salons',
}

export default function AdminStaffPage() {
  return <AdminStaff />
}
