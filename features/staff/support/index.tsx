import { StaffSupportClient } from './components/support-client'
import { getStaffSupportOverview } from './api/queries'

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
