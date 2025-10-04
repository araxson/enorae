import { BusinessTimeOff } from '@/features/business/time-off'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Time-Off Requests',
  description: 'Review and manage staff time-off requests',
  noIndex: true,
})

export default async function BusinessTimeOffPage() {
  return <BusinessTimeOff />
}
