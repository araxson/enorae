import { StaffHelpClient } from './components/help-client'
import { getStaffHelpOverview } from './api/queries'

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
