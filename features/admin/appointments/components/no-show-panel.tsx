import { CalendarOff } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { AppointmentSnapshot } from '@/features/admin/appointments/api/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface NoShowPanelProps {
  noShows: AppointmentSnapshot['noShows']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function NoShowPanel({ noShows }: NoShowPanelProps) {
  return (
    <div className="h-full">
      <Card>
        <CardHeader>
          <div className="pb-4">
            <ItemGroup>
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <CalendarOff className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>No-show Tracking</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <ItemGroup>
                <Item variant="muted">
                  <ItemContent>
                    <ItemDescription>
                      Total no-shows:{' '}
                      <span className="text-foreground font-semibold">{noShows.count}</span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="muted">
                  <ItemContent>
                    <ItemDescription>
                      Rate:{' '}
                      <span className="text-foreground font-semibold">
                        {formatPercent(noShows.rate)}
                      </span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </div>

            {noShows.recent.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No recent no-show events</EmptyTitle>
                  <EmptyDescription>
                    The tracker updates as guests miss scheduled appointments.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-2">
                {noShows.recent.map((item) => (
                  <Alert key={item.id}>
                    <CalendarOff className="size-4" />
                    <ItemGroup>
                      <Item variant="muted" size="sm">
                        <ItemContent>
                          <div className="space-y-2">
                            <AlertTitle>{item.customerName || 'Unknown'}</AlertTitle>
                            <AlertDescription>
                              <p>
                                {item.startTime
                                  ? new Date(item.startTime).toLocaleString()
                                  : 'Unknown time'}
                              </p>
                              <div className="mt-1 space-y-1">
                                {item.staffName ? <div>Staff: {item.staffName}</div> : null}
                                {item.totalPrice ? (
                                  <div>Estimated value ${item.totalPrice.toFixed(2)}</div>
                                ) : null}
                              </div>
                            </AlertDescription>
                          </div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
