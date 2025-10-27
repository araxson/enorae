import { CalendarOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { AppointmentSnapshot } from '@/features/admin/appointments/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface NoShowPanelProps {
  noShows: AppointmentSnapshot['noShows']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function NoShowPanel({ noShows }: NoShowPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CalendarOff className="h-4 w-4 text-muted-foreground" />
          <CardTitle>No-show Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Total no-shows: <strong className="text-foreground">{noShows.count}</strong>
          </span>
          <span>
            Rate: <strong className="text-foreground">{formatPercent(noShows.rate)}</strong>
          </span>
        </div>

        {noShows.recent.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No recent no-show events</EmptyTitle>
              <EmptyDescription>The tracker updates as guests miss scheduled appointments.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-2">
            {noShows.recent.map((item) => (
              <Alert key={item.id}>
                <CalendarOff className="h-4 w-4" />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <AlertTitle>{item.customerName || 'Unknown'}</AlertTitle>
                    <AlertDescription>
                      {item.startTime ? new Date(item.startTime).toLocaleString() : 'Unknown time'}
                    </AlertDescription>
                    <AlertDescription className="mt-1 space-y-1">
                      {item.staffName ? <div>Staff: {item.staffName}</div> : null}
                      {item.totalPrice ? <div>Estimated value ${item.totalPrice.toFixed(2)}</div> : null}
                    </AlertDescription>
                  </div>
                  <Badge variant="outline">{item.salonName || 'Unassigned'}</Badge>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
