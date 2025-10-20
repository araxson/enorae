import { Section, Stack, Flex } from '@/components/layout'
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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Active Sessions</h1>
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
