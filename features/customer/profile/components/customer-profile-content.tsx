import { MetadataForm } from '@/features/shared/profile-metadata'
import { ProfileEditForm, UsernameForm } from '@/features/shared/profile/components'
import { AppointmentsList, ProfileHeader } from '.'
import type { getProfile, getUserAppointments } from '../api/queries'
import type { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'

type CustomerProfileContentProps = {
  profile: Awaited<ReturnType<typeof getProfile>>
  appointments: Awaited<ReturnType<typeof getUserAppointments>>
  metadata: Awaited<ReturnType<typeof getCurrentUserMetadata>>
}

export function CustomerProfileContent({
  profile,
  appointments,
  metadata,
}: CustomerProfileContentProps) {
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
