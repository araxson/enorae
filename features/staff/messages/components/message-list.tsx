'use client'
import { Fragment } from 'react'
import { format } from 'date-fns'
import { MessageCircle } from 'lucide-react'
import type { Message } from '@/features/staff/messages/types'
import { cn } from '@/lib/utils'
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemGroup,
  ItemTitle,
  ItemSeparator,
} from '@/components/ui/item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageCircle className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>Start chatting to see conversation history here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ItemGroup className="gap-3">
      {messages.map((message, index) => {
        const isFromMe = message['from_user_id'] === currentUserId

        return (
          <Fragment key={message['id']}>
            <Item
              variant={isFromMe ? 'muted' : 'outline'}
              size="sm"
              className={cn(
                'max-w-xl flex-col gap-2',
                isFromMe ? 'ml-auto items-end text-right' : 'mr-auto items-start'
              )}
            >
              <ItemContent className="gap-2">
                <ItemTitle className="text-xs font-medium text-muted-foreground">
                  {isFromMe ? 'You' : 'Staff member'}
                </ItemTitle>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message['content']}</p>
              </ItemContent>
              {message['created_at'] ? (
                <ItemFooter
                  className={cn(
                    'gap-2 text-xs text-muted-foreground',
                    isFromMe ? 'justify-end' : 'justify-start'
                  )}
                >
                  <time dateTime={message['created_at']}>
                    {format(new Date(message['created_at']), 'PPp')}
                  </time>
                  {message['is_edited'] ? <span aria-label="Message edited">(edited)</span> : null}
                </ItemFooter>
              ) : null}
            </Item>
            {index < messages.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        )
      })}
    </ItemGroup>
  )
}
