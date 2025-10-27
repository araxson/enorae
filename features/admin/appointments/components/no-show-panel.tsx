import { CalendarOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { AppointmentSnapshot } from '@/features/admin/appointments/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'

interface NoShowPanelProps {
  noShows: AppointmentSnapshot['noShows']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function NoShowPanel({ noShows }: NoShowPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <CalendarOff className="h-4 w-4" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>No-show Tracking</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup className="items-center gap-4 text-sm text-muted-foreground">
          <Item variant="muted">
            <ItemContent>
              <ItemDescription>
                Total no-shows: <span className="text-foreground font-semibold">{noShows.count}</span>
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemDescription>
                Rate: <span className="text-foreground font-semibold">{formatPercent(noShows.rate)}</span>
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

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
                <ItemGroup>
                  <Item className="items-start gap-2" variant="muted" size="sm">
                    <ItemContent>
                      <AlertTitle>{item.customerName || 'Unknown'}</AlertTitle>
                      <AlertDescription>
                        {item.startTime ? new Date(item.startTime).toLocaleString() : 'Unknown time'}
                      </AlertDescription>
                      <AlertDescription className="mt-1 space-y-1">
                        {item.staffName ? <div>Staff: {item.staffName}</div> : null}
                        {item.totalPrice ? <div>Estimated value ${item.totalPrice.toFixed(2)}</div> : null}
                      </AlertDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="outline">{item.salonName || 'Unassigned'}</Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
