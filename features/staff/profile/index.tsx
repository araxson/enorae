import { getMyStaffProfileDetails } from './api/queries'
import { ProfileClient } from './components'
import { ProfileUnavailableError, ProfileNotFoundError } from './components/profile-error-state'

export type * from './types'

export async function StaffProfile() {
  let details: Awaited<ReturnType<typeof getMyStaffProfileDetails>>

  try {
    details = await getMyStaffProfileDetails()
  } catch (error) {
    return <ProfileUnavailableError error={error} />
  }

  const { profile, metadata, username } = details

  if (!profile) {
    return <ProfileNotFoundError />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ProfileClient profile={profile} metadata={metadata} username={username} />
    </div>
  )
}
