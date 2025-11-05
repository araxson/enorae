
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type TrendIndicatorsCardProps = {
  trendIndicators: unknown
}

export function TrendIndicatorsCard({ trendIndicators }: TrendIndicatorsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Indicators</CardTitle>
        <CardDescription>Performance trends and patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
          {JSON.stringify(trendIndicators, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}