import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { MessagesOverview } from './admin-overview-types'
import { safeFormatDate } from './admin-overview-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
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
              <EmptyTitle>No messages yet</EmptyTitle>
              <EmptyDescription>Inbound and outbound messages will appear as conversations start.</EmptyDescription>
            </EmptyHeader>
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
          <ItemGroup className="space-y-3">
            {rows.map((msg) => (
              <Item key={msg['id']} variant="outline" className="flex-col gap-3">
                <ItemContent>
                  <ItemTitle>{msg['subject'] || 'No subject'}</ItemTitle>
                  <ItemDescription>
                    {msg['customer_name'] || 'Unknown customer'} • {msg['salon_name'] || 'Unknown salon'}
                  </ItemDescription>
                  <span className="text-xs text-muted-foreground">
                    {safeFormatDate(msg['created_at'], 'MMM d, HH:mm')}
                  </span>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
