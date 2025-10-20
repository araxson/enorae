'use client'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'

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
    <div className={cn('flex w-full gap-3', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex max-w-xl flex-col space-y-1', isOwn && 'items-end text-right')}>
        {!isOwn && senderName && (
          <small className="text-sm font-medium leading-none px-2 text-muted-foreground">{senderName}</small>
        )}

        <div
          className={cn(
            'rounded-lg px-4 py-2 text-left',
            isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          )}
        >
          <p className="leading-7 mb-0 whitespace-pre-wrap break-words">{content}</p>
        </div>

        <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
          <small className="text-sm font-medium leading-none">{format(new Date(timestamp), 'MMM dd, HH:mm')}</small>
          {isOwn && <small className="text-sm font-medium leading-none">{isRead ? '✓✓' : '✓'}</small>}
        </div>
      </div>

      {isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
