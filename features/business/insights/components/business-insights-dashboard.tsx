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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
      {/* Alerts Section - Proper Alert usage */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Active alerts</h2>
            <p className="text-sm text-muted-foreground">Review anomalies that need immediate attention.</p>
          </div>
          <div className="flex flex-col gap-4">
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
                  <Icon className="h-4 w-4" />
                  <AlertTitle>{alert.metric}</AlertTitle>
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <Badge variant="outline">{alert.severity}</Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content - Use Tabs for better organization */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">
            AI Recommendations ({recommendations.length})
          </TabsTrigger>
          {opportunities.length > 0 && (
            <TabsTrigger value="opportunities">Growth Opportunities</TabsTrigger>
          )}
        </TabsList>

        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Trend analysis</h3>
            <p className="text-sm text-muted-foreground">Track movement across your key business metrics.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {trends.map((trend, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <Item variant="muted" className="flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <ItemContent className="gap-1">
                        <ItemTitle>{trend.metric}</ItemTitle>
                        <ItemDescription>{trend.message}</ItemDescription>
                      </ItemContent>
                      <ItemMedia variant="icon">
                        {trend.trend === 'up' ? (
                          <TrendingUp
                            className={`h-6 w-6 ${
                              trend.status === 'positive' ? 'text-primary' : 'text-destructive'
                            }`}
                            aria-hidden="true"
                          />
                        ) : trend.trend === 'down' ? (
                          <TrendingDown
                            className={`h-6 w-6 ${
                              trend.status === 'negative' ? 'text-destructive' : 'text-primary'
                            }`}
                            aria-hidden="true"
                          />
                        ) : (
                          <Minus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                        )}
                      </ItemMedia>
                    </div>
                    <div className="flex items-baseline gap-2">
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
                    </div>
                  </Item>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Recommendations Tab - Use Accordion for better UX */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">AI-powered recommendations</h3>
              <p className="text-sm text-muted-foreground">Data-driven actions to improve your performance.</p>
            </div>
            <Badge variant="outline">
              <Lightbulb className="mr-1 h-3 w-3" aria-hidden="true" />
              {recommendations.length} insights
            </Badge>
          </div>

          {recommendations.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {recommendations.map((rec, idx) => (
                <AccordionItem key={rec.id} value={`item-${idx}`}>
                  <AccordionTrigger>
                    <div className="flex flex-wrap items-center gap-2 text-left">
                      <span>{rec.title}</span>
                      <Badge
                        variant={
                          rec.priority === 'high'
                            ? 'destructive'
                            : rec.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-sm">{rec.description}</p>
                    <Item variant="outline" className="items-center gap-3">
                      <ItemMedia variant="icon">
                        <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Impact</ItemTitle>
                        <ItemDescription>{rec.impact}</ItemDescription>
                      </ItemContent>
                    </Item>
                    <div>
                      <ItemTitle>Action items</ItemTitle>
                      <ItemGroup className="mt-2 space-y-1.5">
                        {rec.actionItems.map((item, idx) => (
                          <Item key={idx} variant="muted" className="items-start gap-2">
                            <ItemMedia variant="icon">
                              <CheckCircle2
                                className="h-4 w-4 text-primary"
                                aria-hidden="true"
                              />
                            </ItemMedia>
                            <ItemContent>
                              <ItemDescription>{item}</ItemDescription>
                            </ItemContent>
                          </Item>
                        ))}
                      </ItemGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>All systems optimal</AlertTitle>
              <AlertDescription>
                Your business metrics are performing well. Keep up the great work!
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Growth Opportunities Tab */}
        {opportunities.length > 0 && (
          <TabsContent value="opportunities" className="space-y-4">
            <div>
              <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Growth opportunities</h3>
              <p className="text-sm text-muted-foreground">Focus areas with the highest projected upside.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {opportunities.map((opp, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="h-5 w-5" aria-hidden="true" />
                      <CardTitle>{opp.title}</CardTitle>
                    </div>
                    <CardDescription>{opp.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <span className="font-medium">{opp.potential}</span>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
