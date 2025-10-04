import { StaffCommission } from '@/features/staff/commission'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Commission Tracker',
  description: 'Track your earnings and commission',
  noIndex: true,
})

export default async function CommissionPage() {
  return <StaffCommission />
}
