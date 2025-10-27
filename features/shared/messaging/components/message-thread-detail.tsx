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
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-6">
        <ItemGroup>
          <Item variant="muted" size="sm" className="flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/customer/messages" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to Messages
                </Link>
              </Button>
              <ItemTitle>{thread['subject'] || 'Conversation'}</ItemTitle>
            </div>
            <ItemContent>
              <ItemDescription>
                Thread started{' '}
                {thread['created_at']
                  ? new Date(thread['created_at']).toLocaleDateString()
                  : 'N/A'}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <MessageThread threadId={threadId} messages={messages} currentUserId={session.user['id']} />
      </div>
    </section>
  )
}
