import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { TimeOffRequestsClient } from './index'
import {
  getTimeOffRequests,
  getPendingTimeOffRequests,
  getTimeOffBalance,
  getTeamTimeOffCalendar
} from '../api/queries'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'

export async function TimeOffFeature() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Time-off unavailable</EmptyTitle>
            <EmptyDescription>
              {error instanceof Error
                ? error.message
                : 'Please log in to view time-off requests'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  if (!staffProfile || !staffProfile['id']) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Profile not found</EmptyTitle>
            <EmptyDescription>Staff profile not found</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
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
      staffId={staffProfile['id']}
      allRequests={allRequests}
      pendingRequests={pendingRequests}
      balance={balance}
      teamCalendar={teamCalendar}
    />
  )
}
