import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type RealtimeMonitoringCardProps = {
  realtimeUpdates: number
  lastUpdate: string | null
}

export function RealtimeMonitoringCard({ realtimeUpdates, lastUpdate }: RealtimeMonitoringCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Monitoring</CardTitle>
        <CardDescription>Live operational updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-col gap-4">
          <Item className="items-center gap-3">
            <Activity className="size-5 text-primary" aria-hidden="true" />
            <ItemContent>
              <ItemDescription>Operational heartbeat</ItemDescription>
            </ItemContent>
          </Item>
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
