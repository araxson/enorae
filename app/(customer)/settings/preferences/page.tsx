import { UserPreferences } from '@/features/user-preferences'
import { getUserPreferences } from '@/features/user-preferences/dal/user-preferences.queries'

export const metadata = {
  title: 'User Preferences',
  description: 'Manage your personal preferences',
}

export default async function UserPreferencesPage() {
  const preferences = await getUserPreferences()
  return <UserPreferences initialPreferences={preferences} />
}
