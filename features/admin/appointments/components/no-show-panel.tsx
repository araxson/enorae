import { CalendarOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AppointmentSnapshot } from '@/features/admin/appointments/api/types'

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
          <p className="text-sm text-muted-foreground">No recent no-show events.</p>
        ) : (
          <div className="space-y-2">
            {noShows.recent.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{item.customerName || 'Unknown'}</CardTitle>
                    <div className="text-xs">
                      <Badge variant="outline">{item.salonName || 'Unassigned'}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {item.startTime ? new Date(item.startTime).toLocaleString() : 'Unknown time'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 pt-0">
                  {item.staffName ? (
                    <p className="text-xs text-muted-foreground">Staff: {item.staffName}</p>
                  ) : null}
                  {item.totalPrice ? (
                    <p className="text-xs text-muted-foreground">
                      Estimated value ${item.totalPrice.toFixed(2)}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
