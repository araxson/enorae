import { UserPreferences } from '@/features/shared/preferences'

export const metadata = {
  title: 'User Preferences',
  description: 'Manage your personal preferences',
}

export default async function UserPreferencesPage() {
  return <UserPreferences />
}
