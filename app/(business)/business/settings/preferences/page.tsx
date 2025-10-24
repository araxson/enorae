import { UserPreferences } from '@/features/shared/preferences'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'User Preferences',
  description: 'Configure business account preferences and defaults',
  noIndex: true,
})

export default async function BusinessPreferencesPage() {
  return <UserPreferences />
}
