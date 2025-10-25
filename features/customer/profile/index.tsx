import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { MetadataForm } from '@/features/shared/profile-metadata'
import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { ProfileEditForm } from '@/features/shared/profile/components/profile-edit-form'
import { UsernameForm } from '@/features/shared/profile/components/username-form'
import { AppointmentsList } from './components/appointments-list'
import { ProfileHeader } from './components/profile-header'
import { getProfile, getUserAppointments } from './api/queries'

export const customerProfileMetadata = genMeta({
  title: 'My Profile',
  description: 'Manage your profile and view your appointment history.',
  noIndex: true,
})

export async function CustomerProfile() {
  let profile
  let appointments
  let metadata

  try {
    profile = await getProfile()
    appointments = await getUserAppointments()
    metadata = await getCurrentUserMetadata()
  } catch {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>Please log in to view your profile.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ProfileHeader profile={profile} />
      <UsernameForm currentUsername={profile['username']} />
      <ProfileEditForm profile={profile} />
      <MetadataForm metadata={metadata} />
      <AppointmentsList appointments={appointments} />
    </div>
  )
}

export function CustomerProfileFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CustomerProfile />
    </Suspense>
  )
}
