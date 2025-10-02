import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getThreadById, getMessagesBetweenUsers } from '../dal/messaging.queries'
import { MessageThread } from './message-thread'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MessageThreadDetailProps {
  threadId: string
}

export async function MessageThreadDetail({ threadId }: MessageThreadDetailProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [thread, messages] = await Promise.all([
    getThreadById(threadId),
    getMessagesBetweenUsers(threadId), // threadId now represents otherUserId
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <Link href="/messages">
            <Button variant="ghost" size="sm" className="mb-4">
              ← Back to Messages
            </Button>
          </Link>
          <H1>{thread.subject || 'Conversation'}</H1>
          <P className="text-muted-foreground">
            Thread started {new Date(thread.created_at).toLocaleDateString()}
          </P>
        </div>

        <Separator />

        <MessageThread threadId={threadId} messages={messages} currentUserId={user.id} />
      </Stack>
    </Section>
  )
}
