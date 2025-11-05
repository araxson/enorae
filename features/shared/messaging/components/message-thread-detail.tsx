import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getThreadById, getMessagesBetweenUsers } from '@/features/shared/messaging/api/queries'
import { MessageThread } from './message-thread'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ArrowLeft } from 'lucide-react'

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
    getMessagesBetweenUsers(session.user.id, threadId), // Get messages between current user and other user
  ])

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-6">
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemHeader>
              <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                  <Link href="/customer/messages">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to Messages
                </Link>
              </Button>
              <ItemTitle>{thread.subject || 'Conversation'}</ItemTitle>
            </div>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>
                Thread started{' '}
                {thread.created_at
                  ? new Date(thread.created_at).toLocaleDateString()
                  : 'N/A'}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <MessageThread threadId={threadId} messages={messages} currentUserId={session.user.id} />
      </div>
    </section>
  )
}
