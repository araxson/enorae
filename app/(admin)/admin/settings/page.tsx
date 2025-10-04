import { Metadata } from 'next'
import { AdminSettings } from '@/features/admin/settings'

export const metadata: Metadata = {
  title: 'Platform Settings | Admin',
  description: 'Configure platform-wide settings',
}

export default function AdminSettingsPage() {
  return <AdminSettings />
}
