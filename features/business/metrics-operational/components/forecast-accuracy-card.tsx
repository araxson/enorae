import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

type ForecastAccuracyCardProps = {
  forecastAccuracy: number
}

export function ForecastAccuracyCard({ forecastAccuracy }: ForecastAccuracyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Accuracy</CardTitle>
        <CardDescription>Prediction confidence</CardDescription>
      </CardHeader>
      <CardContent className="flex items-start justify-between">
        <p className="text-2xl font-semibold leading-none tracking-tight">
          {(forecastAccuracy * 100).toFixed(1)}%
        </p>
        <TrendingUp className="size-4 text-primary" aria-hidden="true" />
      </CardContent>
    </Card>
  )
}
