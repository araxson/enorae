import { generateMetadata as genMeta } from '@/lib/metadata'
import { StaffHelpClient } from './components'
import { getStaffHelpOverview } from './api/queries'

export const staffHelpMetadata = genMeta({
  title: 'Help Library',
  description: 'Browse curated staff resources and training tracks.',
  noIndex: true,
})

export async function StaffHelp() {
  const { summaryCards, quickActions, resourceCategories, learningTracks } = await getStaffHelpOverview()

  return (
    <StaffHelpClient
      summaries={[...summaryCards]}
      quickActions={[...quickActions]}
      resourceCategories={resourceCategories}
      learningTracks={learningTracks}
    />
  )
}

export * from './api/queries'
export type * from './api/types'
