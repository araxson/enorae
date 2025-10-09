import { generateMetadata as genMeta } from '@/lib/metadata'
import { StaffSupport } from '@/features/staff/support'

export const metadata = genMeta({
  title: 'Support Center',
  description: 'Get help, open tickets, and review staff-focused release notes.',
  noIndex: true,
})

export default async function StaffSupportPage() {
  return <StaffSupport />
}

