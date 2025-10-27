import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { verifySession } from '@/lib/auth/session'
import { MessageForm } from './components/message-form'
import { MessageList } from './components/message-list'
import { MessageThreadList } from './components/message-thread-list'
import { getThreadById, getThreadMessages, getMyMessageThreads } from './api/queries'
import type { MessageThread } from './types'
import { ButtonGroup } from '@/components/ui/button-group'

interface MessagesFeatureProps {
  threads: MessageThread[]
}

export function MessagesFeature({ threads }: MessagesFeatureProps) {
  return (
    <div className="flex flex-col gap-6">
      <ItemGroup>
        <Item variant="muted" size="sm" className="flex-col gap-2">
          <ItemTitle>Messages</ItemTitle>
          <ItemDescription>Review and respond to ongoing conversations.</ItemDescription>
        </Item>
      </ItemGroup>
      <MessageThreadList threads={threads} />
    </div>
  )
}

export async function StaffMessagesPage() {
  const threads = await getMyMessageThreads()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <MessagesFeature threads={threads} />
    </section>
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
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-6">
        <ButtonGroup className="w-fit">
          <Button asChild variant="ghost" size="sm">
            <Link href="/staff/messages">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Link>
          </Button>
        </ButtonGroup>

        <ItemGroup>
          <Item variant="muted" size="sm" className="flex-col gap-2">
            <ItemTitle>{thread['subject']}</ItemTitle>
            {thread['customer_id'] ? (
              <ItemDescription>Customer: {thread['customer_id']}</ItemDescription>
            ) : null}
          </Item>
        </ItemGroup>

        <MessageList messages={messages} currentUserId={session.user['id']} />
        <MessageForm threadId={threadId} />
      </div>
    </section>
  )
}
