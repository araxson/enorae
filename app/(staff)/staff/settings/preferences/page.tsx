import { Metadata } from 'next'
import { StaffSettingsPage } from '@/features/staff/settings'

export const metadata: Metadata = {
  title: 'User Preferences | Staff',
  description: 'Update your staff account preferences.',
}

export default async function StaffPreferencesPage() {
  return <StaffSettingsPage />
}
