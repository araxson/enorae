import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
      </Card>
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
        <div>
          <Link href="/staff/messages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{thread['subject']}</CardTitle>
            {thread['customer_id'] && (
              <CardDescription>Customer: {thread['customer_id']}</CardDescription>
            )}
          </CardHeader>
        </Card>

        <MessageList messages={messages} currentUserId={session.user['id']} />
        <MessageForm threadId={threadId} />
      </div>
    </section>
  )
}
