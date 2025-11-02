import type { Metadata } from 'next'

export interface ThreadRouteParams {
  'thread-id': string
}

export async function generateThreadMetadata({
  params,
}: {
  params: Promise<ThreadRouteParams> | ThreadRouteParams
}): Promise<Metadata> {
  const resolvedParams = await params
  const threadId = resolvedParams['thread-id']

  return {
    title: 'Message Thread',
    description: 'View and respond to messages in this conversation thread.',
    openGraph: {
      title: 'Message Thread',
      description: 'View and respond to messages',
      type: 'website',
    },
  }
}
