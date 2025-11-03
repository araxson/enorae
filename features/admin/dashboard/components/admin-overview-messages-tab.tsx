import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from 'lucide-react'
import type { MessagesOverview } from '../api/types'
import { safeFormatDate } from './admin-overview-utils'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type MessagesTabProps = {
  messages: MessagesOverview[]
}

export function AdminOverviewMessagesTab({ messages }: MessagesTabProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Recent messages</CardTitle>
                <CardDescription>
                  Customer and staff communications from the last 24 hours.
                </CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquare aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No messages yet</EmptyTitle>
              <EmptyDescription>
                Inbound and outbound messages will appear as conversations start.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Activate messaging channels to begin tracking conversations.</EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const rows = messages.slice(0, 25)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Recent messages</CardTitle>
              <CardDescription>
                Customer and staff communications from the last 24 hours.
              </CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <ItemGroup>
            {rows.map((msg) => (
              <Item key={msg['id']} variant="outline" size="sm" className="flex-col gap-3">
                <ItemHeader>
                  <ItemTitle>{msg['subject'] || 'No subject'}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                  <ItemDescription>
                    {msg['customer_name'] || 'Unknown customer'} • {msg['salon_name'] || 'Unknown salon'}
                  </ItemDescription>
                </ItemContent>
                <ItemFooter>
                  <ItemDescription>
                    <time className="text-xs text-muted-foreground" dateTime={msg['created_at'] || undefined}>
                      {safeFormatDate(msg['created_at'], 'MMM d, HH:mm')}
                    </time>
                  </ItemDescription>
                </ItemFooter>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
