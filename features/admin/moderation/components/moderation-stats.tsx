'use client'

import { MessageSquare, AlertTriangle, Clock, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type ModerationStatsProps = {
  stats: {
    totalReviews: number
    flaggedReviews: number
    pendingReviews: number
    highRiskReviews: number
    averageSentiment: number
    averageQuality: number
  }
}

export function ModerationStats({ stats }: ModerationStatsProps) {
  const countData = [
    {
      name: 'Total',
      value: stats.totalReviews,
      fill: 'hsl(var(--primary))',
      icon: MessageSquare
    },
    {
      name: 'Flagged',
      value: stats.flaggedReviews,
      fill: 'hsl(var(--destructive))',
      icon: AlertTriangle
    },
    {
      name: 'Pending',
      value: stats.pendingReviews,
      fill: 'hsl(var(--accent))',
      icon: Clock
    },
    {
      name: 'High Risk',
      value: stats.highRiskReviews,
      fill: 'hsl(var(--destructive))',
      icon: ShieldAlert
    },
  ]

  const scoreData = [
    {
      name: 'Sentiment',
      value: parseFloat(stats.averageSentiment.toFixed(2)),
      displayValue: stats.averageSentiment.toFixed(2),
      fill: 'hsl(var(--secondary))'
    },
    {
      name: 'Quality',
      value: stats.averageQuality,
      displayValue: `${stats.averageQuality}%`,
      fill: 'hsl(var(--primary))'
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Review Distribution</CardTitle>
          <CardDescription>Counts across moderation states</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: 'Reviews',
                color: 'hsl(var(--primary))'
              }
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
          <CardDescription>Average sentiment and quality scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: 'Score',
                color: 'hsl(var(--primary))'
              }
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
