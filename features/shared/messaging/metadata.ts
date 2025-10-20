import 'server-only'

import { getThreadById } from '@/features/shared/messaging/api/queries'

export type ThreadRouteParams = { 'thread-id': string }

export async function generateThreadMetadata({
  params,
}: {
  params: Promise<ThreadRouteParams> | ThreadRouteParams
}) {
  const resolvedParams = await params
  const threadId = resolvedParams['thread-id']
  const thread = await getThreadById(threadId).catch(() => null)

  return {
    title: thread?.subject || 'Message Thread',
    description: 'View and respond to messages',
  }
}
