import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MessageForm } from './message-form'
import { MessageList } from './message-list'
import { getThreadById, getThreadMessages } from '../api/queries'
import type { MessageThread } from '../api/types'

interface MessageThreadPageProps {
  threadId: string
}

export async function MessageThreadPage({ threadId }: MessageThreadPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
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
        <ButtonGroup aria-label="Navigation">
          <Button asChild variant="ghost" size="sm">
            <Link href="/staff/messages">
              <ArrowLeft className="mr-2 size-4" />
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

        <MessageList messages={messages} currentUserId={user['id']} />
        <MessageForm threadId={threadId} />
      </div>
    </section>
  )
}
