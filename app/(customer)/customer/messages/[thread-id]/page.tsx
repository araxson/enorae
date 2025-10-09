import { getThreadById } from '@/features/shared/messaging/api/queries'
import { MessageThreadDetail } from '@/features/shared/messaging/components/message-thread-detail'

export async function generateMetadata({ params }: { params: Promise<{ 'thread-id': string }> }) {
  const resolvedParams = await params
  const threadId = resolvedParams['thread-id']
  const thread = await getThreadById(threadId).catch(() => null)
  return { title: thread?.subject || 'Message Thread', description: 'View and respond to messages' }
}

export default async function ThreadPage({ params }: { params: Promise<{ 'thread-id': string }> }) {
  const resolvedParams = await params
  const threadId = resolvedParams['thread-id']
  return <MessageThreadDetail threadId={threadId} />
}
