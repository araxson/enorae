import { Section, Stack, Flex } from '@/components/layout'
import { H1 } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { SessionList } from './components/session-list'
import { getMySessions, getCurrentSessionId } from './api/queries'
import type { Session } from './types'

interface SessionsFeatureProps {
  sessions: Session[]
  currentSessionId: string | null
}

export function SessionsFeature({ sessions, currentSessionId }: SessionsFeatureProps) {
  return (
    <Stack gap="lg">
      <Flex justify="between" align="center">
        <H1>Active Sessions</H1>
        {sessions.filter(s => s.is_active).length > 1 && (
          <Button variant="destructive" size="sm">
            Revoke All Other Sessions
          </Button>
        )}
      </Flex>

      <SessionList sessions={sessions} currentSessionId={currentSessionId} />
    </Stack>
  )
}

export async function StaffSessionsPage() {
  const [sessions, currentSessionId] = await Promise.all([
    getMySessions(),
    getCurrentSessionId(),
  ])

  return (
    <Section size="lg">
      <SessionsFeature sessions={sessions} currentSessionId={currentSessionId} />
    </Section>
  )
}
