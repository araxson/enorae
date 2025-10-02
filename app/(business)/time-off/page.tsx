import { TimeOffRequests } from '@/features/time-off-requests'

export const metadata = {
  title: 'Time-Off Requests',
  description: 'Manage staff time-off requests and approvals',
}

export default async function TimeOffPage() {
  return <TimeOffRequests />
}
