'use client'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface MessageBubbleProps {
  content: string
  isOwn: boolean
  senderName?: string
  timestamp: string
  isRead?: boolean
}

export function MessageBubble({
  content,
  isOwn,
  senderName,
  timestamp,
  isRead = false,
}: MessageBubbleProps) {
  const initials = senderName
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'

  return (
    <Item
      variant={isOwn ? 'muted' : 'outline'}
      size="sm"
      className={cn('items-start gap-3', isOwn && 'ml-auto flex-row-reverse text-right')}
    >
      <ItemMedia className={cn('flex-none', isOwn && 'order-last')}>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{isOwn ? 'You' : initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className={cn('max-w-xl gap-2', isOwn && 'items-end text-right')}>
        {!isOwn && senderName ? <ItemTitle>{senderName}</ItemTitle> : null}
        <p className="mb-0 whitespace-pre-wrap break-words text-sm leading-6">{content}</p>
      </ItemContent>

      <ItemFooter className={cn('gap-2 text-xs text-muted-foreground', isOwn ? 'justify-end' : 'justify-start')}>
        <time dateTime={timestamp} className="font-medium">
          {format(new Date(timestamp), 'MMM dd, HH:mm')}
        </time>
        {isOwn ? (
          <span aria-label={isRead ? 'Message delivered and read' : 'Message sent'} aria-hidden="true">
            {isRead ? '✓✓' : '✓'}
          </span>
        ) : null}
      </ItemFooter>
    </Item>
  )
}
