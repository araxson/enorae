import { Section, Stack } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { H1, Muted } from '@/components/ui/typography'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { verifySession } from '@/lib/auth/session'
import { MessageForm } from './components/message-form'
import { MessageList } from './components/message-list'
import { MessageThreadList } from './components/message-thread-list'
import { getThreadById, getThreadMessages, getMyMessageThreads } from './api/queries'
import type { MessageThread } from './types'

interface MessagesFeatureProps {
  threads: MessageThread[]
}

export function MessagesFeature({ threads }: MessagesFeatureProps) {
  return (
    <Stack gap="lg">
      <H1>Messages</H1>
      <MessageThreadList threads={threads} />
    </Stack>
  )
}

export async function StaffMessagesPage() {
  const threads = await getMyMessageThreads()

  return (
    <Section size="lg">
      <MessagesFeature threads={threads} />
    </Section>
  )
}

interface StaffMessageThreadPageProps {
  threadId: string
}

export async function StaffMessageThreadPage({ threadId }: StaffMessageThreadPageProps) {
  const session = await verifySession()
  if (!session) {
    notFound()
  }

  const [thread, messages] = await Promise.all([
    getThreadById(threadId),
    getThreadMessages(threadId),
  ])

  if (!thread) {
    notFound()
  }

  return (
    <Section size="lg">
      <Stack gap="lg">
        <div>
          <Link href="/staff/messages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Button>
          </Link>
        </div>

        <div>
          <H1>{thread.subject}</H1>
          {thread.customer_name && (
            <Muted>Conversation with {thread.customer_name}</Muted>
          )}
        </div>

        <MessageList messages={messages} currentUserId={session.user.id} />
        <MessageForm threadId={threadId} />
      </Stack>
    </Section>
  )
}
