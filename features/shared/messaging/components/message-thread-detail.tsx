import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getThreadById, getMessagesBetweenUsers } from '../api/queries'
import { MessageThread } from './message-thread'
import { Section, Stack } from '@/components/layout'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MessageThreadDetailProps {
  threadId: string
}

export async function MessageThreadDetail({ threadId }: MessageThreadDetailProps) {
  // SECURITY: Verify session using secure pattern
  const session = await verifySession()

  if (!session) {
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
          <Link href="/customer/messages">
            <Button variant="ghost" size="sm" className="mb-4">
              ← Back to Messages
            </Button>
          </Link>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{thread.subject || 'Conversation'}</h1>
          <p className="leading-7 text-muted-foreground">
            Thread started {thread.created_at ? new Date(thread.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <Separator />

        <MessageThread threadId={threadId} messages={messages} currentUserId={session.user.id} />
      </Stack>
    </Section>
  )
}
