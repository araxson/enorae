import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { MessagesOverview } from './admin-overview-types'
import { safeFormatDate } from './admin-overview-utils'

type MessagesTabProps = {
  messages: MessagesOverview[]
}

export function AdminOverviewMessagesTab({ messages }: MessagesTabProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent messages</CardTitle>
          <CardDescription>
            Customer and staff communications from the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No messages have been received today.</p>
        </CardContent>
      </Card>
    )
  }

  const rows = messages.slice(0, 25)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent messages</CardTitle>
        <CardDescription>
          Customer and staff communications from the last 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-3">
            {rows.map((msg) => (
              <Card key={msg['id']}>
                <CardHeader className="pb-2">
                  <CardTitle>{msg['subject'] || 'No subject'}</CardTitle>
                  <CardDescription>
                    {msg['customer_name'] || 'Unknown customer'} • {msg['salon_name'] || 'Unknown salon'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {safeFormatDate(msg['created_at'], 'MMM d, HH:mm')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
