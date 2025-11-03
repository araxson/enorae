import { generateMetadata as genMeta } from '@/lib/metadata'
import { StaffSupportClient } from './components'
import { getStaffSupportOverview } from './api/queries'

export const staffSupportMetadata = genMeta({
  title: 'Support Center',
  description: 'Get help, open tickets, and review staff-focused release notes.',
  noIndex: true,
})

export async function StaffSupport() {
  const { summaryCards, quickActions, guideSections, faqItems } = await getStaffSupportOverview()

  return (
    <StaffSupportClient
      summaries={[...summaryCards]}
      quickActions={[...quickActions]}
      guideSections={guideSections}
      faqItems={faqItems}
    />
  )
}

export * from './api/queries'
export * from './api/types'
