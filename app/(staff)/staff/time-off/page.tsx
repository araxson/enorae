import { TimeOffRequests } from '@/features/staff/time-off'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Time Off Requests',
  description: 'Manage your time off and vacation requests',
  noIndex: true,
})

export default async function TimeOffPage() {
  return <TimeOffRequests />
}
