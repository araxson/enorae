import { Metadata } from 'next'
import { UserPreferences } from '@/features/shared/preferences'

export const metadata: Metadata = {
  title: 'User Preferences | Staff',
  description: 'Update your staff account preferences.',
}

export default async function StaffPreferencesPage() {
  return <UserPreferences />
}
