import { getThreadById } from '@/features/messaging/dal/messaging.queries'
import { MessageThreadDetail } from '@/features/messaging/components/message-thread-detail'

interface ThreadPageProps {
  params: Promise<{ threadId: string }>
}

export async function generateMetadata({ params }: ThreadPageProps) {
  const { threadId } = await params
  const thread = await getThreadById(threadId)

  return {
    title: thread.subject || 'Message Thread',
    description: 'View and respond to messages',
  }
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { threadId } = await params
  return <MessageThreadDetail threadId={threadId} />
}
