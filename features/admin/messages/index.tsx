import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import {
  getMessageSummary,
  getActiveThreads,
  getActiveUsers,
  getSalonMessageStats,
} from './api/queries'
import { MessagesOverview } from './components/messages-overview'

export async function AdminMessages() {
  const [summary, activeThreads, activeUsers, salonStats] = await Promise.all([
    getMessageSummary(),
    getActiveThreads(20),
    getActiveUsers(20),
    getSalonMessageStats(),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Messages Overview</H1>
          <Lead>Platform-wide messaging activity and engagement</Lead>
        </Box>

        <MessagesOverview
          summary={summary}
          activeThreads={activeThreads}
          activeUsers={activeUsers}
          salonStats={salonStats}
        />
      </Stack>
    </Section>
  )
}
