import { getUserPreferences } from './api/queries'
import { UserPreferencesClient } from './components/user-preferences-client'

export async function UserPreferences() {
  const preferences = await getUserPreferences()
  return <UserPreferencesClient initialPreferences={preferences} />
}
