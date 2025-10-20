'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid, Flex } from '@/components/layout'
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
    <Stack gap="xl">
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Active Alerts</h3>
          <Stack gap="md">
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.severity === 'critical' ? 'destructive' : 'default'}
              >
                <Flex gap="sm" align="center">
                  {alert.severity === 'critical' ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                  <AlertDescription className="flex-1">
                    <strong>{alert.metric}:</strong> {alert.message}
                  </AlertDescription>
                  <Badge variant="outline">{alert.severity}</Badge>
                </Flex>
              </Alert>
            ))}
          </Stack>
        </div>
      )}

      {/* Trend Insights */}
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Trend Analysis</h3>
        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {trends.map((trend, idx) => (
            <Card key={idx} className="p-6">
              <Stack gap="md">
                <Flex justify="between" align="start">
                  <div>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{trend.metric}</h4>
                    <p className="text-sm text-muted-foreground text-sm">{trend.message}</p>
                  </div>
                  {trend.trend === 'up' ? (
                    <TrendingUp className={`h-6 w-6 ${trend.status === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                  ) : trend.trend === 'down' ? (
                    <TrendingDown className={`h-6 w-6 ${trend.status === 'negative' ? 'text-red-500' : 'text-green-500'}`} />
                  ) : (
                    <Minus className="h-6 w-6 text-gray-400" />
                  )}
                </Flex>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${
                    trend.status === 'positive' ? 'text-green-600' :
                    trend.status === 'negative' ? 'text-red-600' :
                    'text-gray-600'
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
              </Stack>
            </Card>
          ))}
        </Grid>
      </div>

      {/* AI Recommendations */}
      <div>
        <Flex justify="between" align="center" className="mb-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">AI-Powered Recommendations</h3>
          <Badge variant="outline" className="gap-1">
            <Lightbulb className="h-3 w-3" />
            {recommendations.length} insights
          </Badge>
        </Flex>
        <Stack gap="lg">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="p-6">
              <Stack gap="md">
                <Flex justify="between" align="start">
                  <div className="flex-1">
                    <Flex gap="sm" align="center" className="mb-2">
                      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{rec.title}</h4>
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                    </Flex>
                    <p className="leading-7 text-sm mb-3">{rec.description}</p>
                    <div className="bg-muted/50 p-3 rounded-md mb-3">
                      <Flex gap="sm" align="center">
                        <Target className="h-4 w-4 text-primary" />
                        <p className="text-sm text-muted-foreground text-sm font-medium">Impact: {rec.impact}</p>
                      </Flex>
                    </div>
                  </div>
                </Flex>

                <div>
                  <p className="text-sm text-muted-foreground text-sm font-medium mb-2">Action Items:</p>
                  <ul className="space-y-1.5">
                    {rec.actionItems.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Stack>
            </Card>
          ))}

          {recommendations.length === 0 && (
            <Card className="p-8">
              <Stack gap="sm" align="center" className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">All Systems Optimal</h4>
                <p className="text-sm text-muted-foreground">Your business metrics are performing well. Keep up the great work!</p>
              </Stack>
            </Card>
          )}
        </Stack>
      </div>

      {/* Growth Opportunities */}
      {opportunities.length > 0 && (
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Growth Opportunities</h3>
          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            {opportunities.map((opp, idx) => (
              <Card key={idx} className="p-6">
                <Stack gap="sm">
                  <Flex gap="sm" align="center">
                    <TrendingUpIcon className="h-5 w-5 text-primary" />
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{opp.title}</h4>
                  </Flex>
                  <p className="leading-7 text-sm">{opp.description}</p>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <p className="text-sm text-muted-foreground text-sm font-medium text-primary">{opp.potential}</p>
                  </div>
                </Stack>
              </Card>
            ))}
          </Grid>
        </div>
      )}
    </Stack>
  )
}
