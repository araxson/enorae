import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
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
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Profile unavailable</EmptyTitle>
                <EmptyDescription>
                  {error instanceof Error
                    ? error.message
                    : 'Please log in to view your profile'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  const { profile, metadata, username } = details

  if (!profile) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Profile not found</EmptyTitle>
                <EmptyDescription>Staff profile not found</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ProfileClient profile={profile} metadata={metadata} username={username} />
    </div>
  )
}
