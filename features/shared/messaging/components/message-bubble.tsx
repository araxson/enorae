'use client'

import { cn } from '@/lib/utils'
import { Stack, Flex } from '@/components/layout'
import { P, Small } from '@/components/ui/typography'
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
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'

  return (
    <Flex
      gap="sm"
      className={cn('w-full', isOwn ? 'justify-end' : 'justify-start')}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      )}

      <Stack gap="xs" className={cn('max-w-[70%]', isOwn && 'items-end')}>
        {!isOwn && senderName && (
          <Small className="text-muted-foreground px-3">{senderName}</Small>
        )}

        <div
          className={cn(
            'rounded-lg px-4 py-2',
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <P className="mb-0 whitespace-pre-wrap break-words">{content}</P>
        </div>

        <Flex gap="xs" className="px-3" align="center">
          <Small className="text-muted-foreground">
            {format(new Date(timestamp), 'MMM dd, HH:mm')}
          </Small>
          {isOwn && (
            <Small className="text-muted-foreground">
              {isRead ? '✓✓' : '✓'}
            </Small>
          )}
        </Flex>
      </Stack>

      {isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">You</AvatarFallback>
        </Avatar>
      )}
    </Flex>
  )
}
