import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getMyStaffProfileDetails } from './api/queries'
import { ProfileClient } from './components/profile-client'

// Export types
export type * from './types'

export async function StaffProfile() {
  let details: Awaited<ReturnType<typeof getMyStaffProfileDetails>>

  try {
    details = await getMyStaffProfileDetails()
  } catch (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Profile unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Please log in to view your profile'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const { profile, metadata, username } = details

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Profile not found</AlertTitle>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ProfileClient profile={profile} metadata={metadata} username={username} />
    </div>
  )
}
