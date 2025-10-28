import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type RealtimeMonitoringCardProps = {
  realtimeUpdates: number
  lastUpdate: string | null
}

export function RealtimeMonitoringCard({ realtimeUpdates, lastUpdate }: RealtimeMonitoringCardProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup className="items-start gap-2">
          <Item className="items-center gap-2">
            <ItemMedia>
              <Activity className="h-5 w-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Real-Time Monitoring</ItemTitle>
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemDescription>Live operational updates</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-col gap-4">
          <Item>
            <ItemContent>
              <ItemTitle>Real-time updates</ItemTitle>
            </ItemContent>
            <ItemActions className="flex-none">
              <Badge variant="secondary">{realtimeUpdates} updates</Badge>
            </ItemActions>
          </Item>
          {lastUpdate ? (
            <Item>
              <ItemContent>
                <ItemTitle>Last update</ItemTitle>
              </ItemContent>
              <ItemActions className="flex-none text-muted-foreground">
                <ItemDescription>{new Date(lastUpdate).toLocaleString()}</ItemDescription>
              </ItemActions>
            </Item>
          ) : null}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
