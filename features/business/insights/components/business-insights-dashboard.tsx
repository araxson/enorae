'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import type { TrendInsight, BusinessRecommendation, AnomalyAlert } from '../api/business-insights'

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
        <div>
          <div className="text-2xl font-semibold mb-4">Active Alerts</div>
          <div className="flex flex-col gap-6">
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.severity === 'critical' ? 'destructive' : 'default'}
              >
                <div className="flex flex-wrap items-center gap-4">
                  {alert.severity === 'critical' ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-accent" />
                  ) : (
                    <Info className="h-5 w-5 text-secondary" />
                  )}
                  <div className="flex-1">
                    <AlertDescription>
                      <strong>{alert.metric}:</strong> {alert.message}
                    </AlertDescription>
                  </div>
                  <Badge variant="outline">{alert.severity}</Badge>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Trend Insights */}
      <div>
        <div className="text-2xl font-semibold mb-4">Trend Analysis</div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {trends.map((trend, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xl font-semibold">{trend.metric}</div>
                    <div className="text-sm text-muted-foreground">{trend.message}</div>
                  </div>
                  {trend.trend === 'up' ? (
                    <TrendingUp className={`h-6 w-6 ${trend.status === 'positive' ? 'text-primary' : 'text-destructive'}`} />
                  ) : trend.trend === 'down' ? (
                    <TrendingDown className={`h-6 w-6 ${trend.status === 'negative' ? 'text-destructive' : 'text-primary'}`} />
                  ) : (
                    <Minus className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${
                    trend.status === 'positive' ? 'text-primary' :
                    trend.status === 'negative' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {trend.changePercent.toFixed(1)}%
                  </span>
                  <Badge variant={
                    trend.status === 'positive' ? 'default' :
                    trend.status === 'negative' ? 'destructive' :
                    'secondary'
                  }>
                    {trend.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-2xl font-semibold">AI-Powered Recommendations</div>
          <Badge variant="outline" className="gap-1">
            <Lightbulb className="h-3 w-3" />
            {recommendations.length} insights
          </Badge>
        </div>
        <div className="flex flex-col gap-8">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-4">
                      <div className="text-xl font-semibold">{rec.title}</div>
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <div className="text-sm mb-3">{rec.description}</div>
                    <div className="bg-muted/50 p-3 rounded-md mb-3">
                      <div className="flex items-center gap-4">
                        <Target className="h-4 w-4 text-primary" />
                        <div className="text-sm font-medium text-muted-foreground">Impact: {rec.impact}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Action Items:</div>
                  <ul className="space-y-1.5">
                    {rec.actionItems.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}

          {recommendations.length === 0 && (
            <Card className="p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
                <div className="text-xl font-semibold">All Systems Optimal</div>
                <div className="text-sm text-muted-foreground">Your business metrics are performing well. Keep up the great work!</div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Growth Opportunities */}
      {opportunities.length > 0 && (
        <div>
          <div className="text-2xl font-semibold mb-4">Growth Opportunities</div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {opportunities.map((opp, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <TrendingUpIcon className="h-5 w-5 text-primary" />
                    <div className="text-xl font-semibold">{opp.title}</div>
                  </div>
                  <div className="text-sm">{opp.description}</div>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <div className="text-sm font-medium text-primary">{opp.potential}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
