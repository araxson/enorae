'use client'

import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Info,
  Target,
  Lightbulb,
  TrendingUpIcon
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { TrendInsight, BusinessRecommendation, AnomalyAlert } from '@/features/business/insights/api/business-insights'

interface BusinessInsightsDashboardProps {
  trends: TrendInsight[]
  recommendations: BusinessRecommendation[]
  alerts: AnomalyAlert[]
  opportunities: Array<{
    type: string
    title: string
    description: string
    potential: string
  }>
}

export function BusinessInsightsDashboard({
  trends,
  recommendations,
  alerts,
  opportunities
}: BusinessInsightsDashboardProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active alerts</CardTitle>
            <CardDescription>Review anomalies that need immediate attention.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {alerts.map((alert) => {
              const Icon =
                alert.severity === 'critical'
                  ? AlertTriangle
                  : alert.severity === 'warning'
                  ? AlertTriangle
                  : Info

              return (
                <Alert
                  key={alert.id}
                  variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <Icon
                      className={`h-5 w-5 ${
                        alert.severity === 'critical'
                          ? ''
                          : alert.severity === 'warning'
                          ? 'text-accent'
                          : 'text-secondary'
                      }`}
                    />
                    <div className="flex-1">
                      <AlertTitle>{alert.metric}</AlertTitle>
                      <AlertDescription>{alert.message}</AlertDescription>
                    </div>
                    <Badge variant="outline">{alert.severity}</Badge>
                  </div>
                </Alert>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Trend Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Trend analysis</CardTitle>
          <CardDescription>Track movement across your key business metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {trends.map((trend, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{trend.metric}</CardTitle>
                      <CardDescription>{trend.message}</CardDescription>
                    </div>
                    {trend.trend === 'up' ? (
                      <TrendingUp
                        className={`h-6 w-6 ${
                          trend.status === 'positive' ? 'text-primary' : 'text-destructive'
                        }`}
                      />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown
                        className={`h-6 w-6 ${
                          trend.status === 'negative' ? 'text-destructive' : 'text-primary'
                        }`}
                      />
                    ) : (
                      <Minus className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex items-baseline gap-2 pt-0">
                  <span
                    className={`text-2xl font-bold ${
                      trend.status === 'positive'
                        ? 'text-primary'
                        : trend.status === 'negative'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {trend.changePercent.toFixed(1)}%
                  </span>
                  <Badge
                    variant={
                      trend.status === 'positive'
                        ? 'default'
                        : trend.status === 'negative'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {trend.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>AI-powered recommendations</CardTitle>
            <CardDescription>Data-driven actions to improve your performance.</CardDescription>
          </div>
          <Badge variant="outline">
            <span className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              {recommendations.length} insights
            </span>
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-4">
                  <CardTitle>{rec.title}</CardTitle>
                  <Badge
                    variant={
                      rec.priority === 'high'
                        ? 'destructive'
                        : rec.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {rec.priority} priority
                  </Badge>
                  <Badge variant="outline">{rec.category}</Badge>
                </div>
                <CardDescription>{rec.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-center gap-4">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Impact: {rec.impact}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Action items</p>
                  <ul className="space-y-1.5">
                    {rec.actionItems.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}

          {recommendations.length === 0 && (
            <Card>
              <CardHeader className="items-center text-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
                <CardTitle>All systems optimal</CardTitle>
                <CardDescription>
                  Your business metrics are performing well. Keep up the great work!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Growth Opportunities */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Growth opportunities</CardTitle>
            <CardDescription>Focus areas with the highest projected upside.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {opportunities.map((opp, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <TrendingUpIcon className="h-5 w-5 text-primary" />
                      <CardTitle>{opp.title}</CardTitle>
                    </div>
                    <CardDescription>{opp.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="rounded-md bg-primary/10 p-2 pt-0 text-sm font-medium text-primary">
                    {opp.potential}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
