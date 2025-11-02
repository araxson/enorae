import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMessageThreadsByUser } from './api/queries'
import { MessageThreadDetail, ThreadList } from './components'
import type { ThreadRouteParams } from './metadata'

export async function Messaging() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const threads = await getMessageThreadsByUser(session.user.id)

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ItemGroup className="gap-2">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Messages</ItemTitle>
            <ItemDescription>Communicate with salons about your appointments.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <Separator />

      <ThreadList threads={threads} />
    </div>
  )
}

export async function MessageThreadFeature({
  params,
}: {
  params: Promise<ThreadRouteParams> | ThreadRouteParams
}) {
  const resolvedParams = await params
  const threadId = resolvedParams['thread-id']

  return <MessageThreadDetail threadId={threadId} />
}

export { generateThreadMetadata } from './metadata'
export * from './types'
