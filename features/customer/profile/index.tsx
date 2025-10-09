import { getProfile, getUserAppointments } from './api/queries'
import { ProfileHeader } from './components/profile-header'
import { AppointmentsList } from './components/appointments-list'
import { UsernameForm } from '@/features/shared/profile/components/username-form'
import { ProfileEditForm } from '@/features/shared/profile/components/profile-edit-form'
import { MetadataForm } from '@/features/shared/profile-metadata'
import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
      <UsernameForm currentUsername={profile.username} />
      <ProfileEditForm profile={profile} />
      <MetadataForm metadata={metadata} />
      <AppointmentsList appointments={appointments} />
    </div>
  )
}
