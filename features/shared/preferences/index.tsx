import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { getUserPreferences } from './api/queries'
import { UserPreferencesClient } from './components'

export async function UserPreferences() {
  const preferences = await getUserPreferences()
  return <UserPreferencesClient initialPreferences={preferences} />
}

export function UserPreferencesFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <UserPreferences />
    </Suspense>
  )
}
export * from './types'
