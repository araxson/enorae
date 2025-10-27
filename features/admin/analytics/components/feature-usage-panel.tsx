import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/admin-analytics-types'

interface FeatureUsagePanelProps {
  featureUsage: PlatformAnalyticsSnapshot['featureUsage']
}

export function FeatureUsagePanel({ featureUsage }: FeatureUsagePanelProps) {
  const items = featureUsage.items.slice(0, 10)

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <Sparkles className="h-4 w-4" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Feature Usage Signals</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No feature usage telemetry</EmptyTitle>
              <EmptyDescription>Signals will appear once product instrumentation reports recent events.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="space-y-2">
            {items.map((item) => (
              <Item key={item.key} variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>{item.key}</ItemTitle>
                  <ItemDescription>
                    Interaction volume across last 30 days of telemetry.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">
                    {item.count.toLocaleString('en-US')} hits
                  </Badge>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
