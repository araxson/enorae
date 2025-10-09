import { Metadata } from 'next'
import { UserPreferences } from '@/features/shared/preferences'

export const metadata: Metadata = {
  title: 'User Preferences | Business',
  description: 'Configure your business account preferences.',
}

export default async function BusinessPreferencesPage() {
  return <UserPreferences />
}
