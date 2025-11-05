import type { Metadata } from 'next'
import { AdminSalons } from '@/features/admin/salons'

export const metadata: Metadata = {
  title: 'Salon Management - Admin Portal - ENORAE',
  description: 'Manage salon listings, approvals, and settings',
}

export default function SalonsPage() {
  return <AdminSalons />
}
