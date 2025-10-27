'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import type { DatabaseHealthFullSnapshot } from '@/features/admin/database-health/api/snapshot'

interface HealthOverviewProps {
  snapshot: DatabaseHealthFullSnapshot
}

export function HealthOverview({ snapshot }: HealthOverviewProps) {
  const { overallStatus } = snapshot
  const { healthScore, criticalIssues, warnings, recommendations } = overallStatus

  const getHealthIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-8 w-8 text-primary" />
    if (score >= 70) return <TrendingUp className="h-8 w-8 text-primary" />
    if (score >= 50) return <AlertTriangle className="h-8 w-8 text-accent" />
    return <AlertCircle className="h-8 w-8 text-destructive" />
  }

  const metrics = [
    {
      label: 'Critical Issues',
      value: criticalIssues,
      icon: <AlertCircle className="h-5 w-5" />,
      variant: criticalIssues > 0 ? 'destructive' : 'default',
    },
    {
      label: 'Warnings',
      value: warnings,
      icon: <AlertTriangle className="h-5 w-5" />,
      variant: warnings > 5 ? 'destructive' : warnings > 0 ? 'secondary' : 'default',
    },
    {
      label: 'Recommendations',
      value: recommendations,
      icon: <TrendingUp className="h-5 w-5" />,
      variant: 'default',
    },
  ] as const

  const healthCopy =
    healthScore >= 90
      ? 'Excellent database health'
      : healthScore >= 70
        ? 'Good with minor issues'
        : healthScore >= 50
          ? 'Needs attention'
          : 'Critical attention required'

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {getHealthIcon(healthScore)}
            <CardTitle>Health Score</CardTitle>
          </div>
          <CardDescription>{healthScore}% overall</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{healthCopy}</p>
        </CardContent>
      </Card>

      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {metric.icon}
              <CardTitle>{metric.label}</CardTitle>
            </div>
            <CardDescription>Latest snapshot for {metric.label.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="font-semibold">{metric.value}</div>
            <Badge variant={metric.variant}>
              {metric.value === 0 ? 'None detected' : `${metric.value} found`}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
