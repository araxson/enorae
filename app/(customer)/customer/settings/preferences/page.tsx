import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { UserPreferences } from '@/features/shared/preferences'

export const metadata = {
  title: 'User Preferences',
  description: 'Manage your personal preferences',
}

export default function UserPreferencesRoute() {
  return (
    <Suspense fallback={<PageLoading />}>
      <UserPreferences />
    </Suspense>
  )
}
