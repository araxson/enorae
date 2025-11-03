import { memo } from 'react'
import { Activity } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type RealtimeMonitoringCardProps = {
  realtimeUpdates: number
  lastUpdate: string | null
}

export const RealtimeMonitoringCard = memo(function RealtimeMonitoringCard({ realtimeUpdates, lastUpdate }: RealtimeMonitoringCardProps) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Real-Time Monitoring</ItemTitle>
          <ItemDescription>Live operational updates</ItemDescription>
        </ItemContent>
      </ItemHeader>
      <ItemContent>
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
      </ItemContent>
    </Item>
  )
})
