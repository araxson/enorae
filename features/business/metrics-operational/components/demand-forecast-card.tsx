
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type DemandForecastCardProps = {
  predictedDemand: unknown
}

export function DemandForecastCard({ predictedDemand }: DemandForecastCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Forecast</CardTitle>
        <CardDescription>AI-powered demand prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
          {JSON.stringify(predictedDemand, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}