import { Alert, AlertDescription } from '@/components/ui/alert'
import { TimeOffRequestsClient } from './components/time-off-requests-client'
import {
  getTimeOffRequests,
  getPendingTimeOffRequests,
  getTimeOffBalance,
  getTeamTimeOffCalendar
} from './api/queries'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'

export async function TimeOffRequests() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Please log in to view time-off requests'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!staffProfile || !staffProfile.id) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const [allRequests, pendingRequests, balance, teamCalendar] = await Promise.all([
    getTimeOffRequests(),
    getPendingTimeOffRequests(),
    getTimeOffBalance(),
    getTeamTimeOffCalendar(),
  ])

  return (
    <TimeOffRequestsClient
      staffId={staffProfile.id}
      allRequests={allRequests}
      pendingRequests={pendingRequests}
      balance={balance}
      teamCalendar={teamCalendar}
    />
  )
}
