import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getMessageThreadsByUser } from './api/queries'
import { ThreadList } from './components/thread-list'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export async function Messaging() {
  // SECURITY: Verify session using secure pattern
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const threads = await getMessageThreadsByUser()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Messages</H1>
          <P className="text-muted-foreground">
            Communicate with salons about your appointments
          </P>
        </div>

        <Separator />

        <ThreadList threads={threads} />
      </Stack>
    </Section>
  )
}
