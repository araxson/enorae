import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { MessageThreadList } from './message-thread-list'
import type { MessageThread } from '../types'

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
