import { generateMetadata as genMeta } from '@/lib/metadata'
import { StaffHelp } from '@/features/staff/help'

export const metadata = genMeta({
  title: 'Help Library',
  description: 'Browse curated staff resources and training tracks.',
  noIndex: true,
})

export default async function StaffHelpPage() {
  return <StaffHelp />
}

