import { Metadata } from 'next'
import { UserPreferences } from '@/features/shared/preferences'

export const metadata: Metadata = {
  title: 'User Preferences | Admin',
  description: 'Manage personal preferences for your admin account.',
}

export default async function AdminPreferencesPage() {
  return <UserPreferences />
}
