import { UserPreferencesFeature } from '@/features/shared/preferences'

export const metadata = {
  title: 'User Preferences',
  description: 'Manage your personal preferences',
}

export default function Page() {
  return <UserPreferencesFeature />
}
