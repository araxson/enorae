import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { getPredictedRevenue, getChurnRisk } from '../dal/queries'

export async function AIInsights({ salonId }: { salonId: string }) {
  const [prediction, churnRisks] = await Promise.all([
    getPredictedRevenue(salonId),
    getChurnRisk(salonId)
  ])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Prediction
          </CardTitle>
          <CardDescription>AI-powered 30-day forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${prediction?.predicted_value?.toLocaleString() || '0'}
          </div>
          <p className="text-sm text-muted-foreground">
            Confidence: {(prediction?.confidence * 100 || 0).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Churn Risk Alert
          </CardTitle>
          <CardDescription>Customers at risk of leaving</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{churnRisks.length}</div>
          <p className="text-sm text-muted-foreground">
            High-risk customers needing attention
          </p>
        </CardContent>
      </Card>
    </div>
  )
}