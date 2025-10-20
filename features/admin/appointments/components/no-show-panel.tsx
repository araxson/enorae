import { CalendarOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AppointmentSnapshot } from '../api/types'

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
          <ul className="space-y-2">
            {noShows.recent.map((item) => (
              <li key={item.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{item.customerName || 'Unknown'}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.salonName || 'Unassigned'}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {item.staffName ? `Staff: ${item.staffName} · ` : ''}
                  {item.startTime ? new Date(item.startTime).toLocaleString() : 'Unknown time'}
                </div>
                {item.totalPrice && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Estimated value ${item.totalPrice.toFixed(2)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
