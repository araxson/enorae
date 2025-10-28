import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type TrendIndicatorsCardProps = {
  trendIndicators: unknown
}

export function TrendIndicatorsCard({ trendIndicators }: TrendIndicatorsCardProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Trend Indicators</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>Performance trends and patterns</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
          {JSON.stringify(trendIndicators, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
