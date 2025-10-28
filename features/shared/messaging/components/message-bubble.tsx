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
    <div className={cn('flex', isOwn ? 'justify-end text-right' : 'justify-start')}>
      <div className="max-w-xl">
        <Item variant={isOwn ? 'muted' : 'outline'} size="sm">
          {!isOwn ? (
            <ItemMedia variant="icon">
              <Avatar>
                <AvatarFallback>
                  <span className="text-xs">{initials}</span>
                </AvatarFallback>
              </Avatar>
            </ItemMedia>
          ) : null}
          <div className={cn('flex-1', isOwn && 'text-right')}>
            <ItemContent>
              {!isOwn && senderName ? <ItemTitle>{senderName}</ItemTitle> : null}
              <p className="mb-0 whitespace-pre-wrap break-words text-sm leading-6">{content}</p>
            </ItemContent>
          </div>
          {isOwn ? (
            <ItemMedia variant="icon">
              <Avatar>
                <AvatarFallback>
                  <span className="text-xs">You</span>
                </AvatarFallback>
              </Avatar>
            </ItemMedia>
          ) : null}
          <ItemFooter>
            <div className={cn('flex w-full items-center gap-2 text-xs text-muted-foreground', isOwn ? 'justify-end' : 'justify-start')}>
              <time dateTime={timestamp} className="font-medium">
                {format(new Date(timestamp), 'MMM dd, HH:mm')}
              </time>
              {isOwn ? (
                <span aria-label={isRead ? 'Message delivered and read' : 'Message sent'} aria-hidden="true">
                  {isRead ? '✓✓' : '✓'}
                </span>
              ) : null}
            </div>
          </ItemFooter>
        </Item>
      </div>
    </div>
  )
}
