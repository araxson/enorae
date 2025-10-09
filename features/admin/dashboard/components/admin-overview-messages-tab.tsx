import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import type { MessagesOverview } from './admin-overview-types'

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
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-3">
            {rows.map((msg) => (
              <div key={msg.id} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold leading-tight">
                    {msg.subject || 'No subject'}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {msg.created_at ? format(new Date(msg.created_at), 'MMM d, HH:mm') : 'N/A'}
                  </span>
                </div>
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground">
                  {msg.customer_name || 'Unknown customer'} • {msg.salon_name || 'Unknown salon'}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
