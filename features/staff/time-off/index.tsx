import { Section } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TimeOffRequestsClient } from './components/time-off-requests-client'
import { getTimeOffRequests, getPendingTimeOffRequests } from './api/queries'
import { getStaffProfile } from '../appointments/api/queries'

export async function TimeOffRequests() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view time-off requests'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  if (!staffProfile || !staffProfile.id) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </Section>
    )
  }

  const [allRequests, pendingRequests] = await Promise.all([
    getTimeOffRequests(),
    getPendingTimeOffRequests(),
  ])

  return (
    <TimeOffRequestsClient
      staffId={staffProfile.id}
      allRequests={allRequests}
      pendingRequests={pendingRequests}
    />
  )
}
