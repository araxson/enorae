'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import type { DatabaseHealthFullSnapshot } from '@/features/admin/database-health/api/queries/snapshot'

interface HealthOverviewProps {
  snapshot: DatabaseHealthFullSnapshot
}

export function HealthOverview({ snapshot }: HealthOverviewProps) {
  const { overallStatus } = snapshot
  const { healthScore, criticalIssues, warnings, recommendations } = overallStatus

  const getHealthIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="size-8 text-primary" />
    if (score >= 70) return <TrendingUp className="size-8 text-primary" />
    if (score >= 50) return <AlertTriangle className="size-8 text-accent" />
    return <AlertCircle className="size-8 text-destructive" />
  }

  const metrics = [
    {
      label: 'Critical Issues',
      value: criticalIssues,
      icon: <AlertCircle className="size-5" />,
      variant: criticalIssues > 0 ? 'destructive' : 'default',
    },
    {
      label: 'Warnings',
      value: warnings,
      icon: <AlertTriangle className="size-5" />,
      variant: warnings > 5 ? 'destructive' : warnings > 0 ? 'secondary' : 'default',
    },
    {
      label: 'Recommendations',
      value: recommendations,
      icon: <TrendingUp className="size-5" />,
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
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">{getHealthIcon(healthScore)}</ItemMedia>
              <ItemContent>
                <ItemTitle>Health Score</ItemTitle>
                <ItemDescription>{healthScore}% overall</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item className="flex-col items-start gap-2">
              <ItemContent>
                <ItemDescription>{healthCopy}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">{metric.icon}</ItemMedia>
                <ItemContent>
                  <ItemTitle>{metric.label}</ItemTitle>
                  <ItemDescription>
                    Latest snapshot for {metric.label.toLowerCase()}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-3">
                <ItemContent>
                  <span className="font-semibold">{metric.value}</span>
                </ItemContent>
                <ItemActions>
                  <Badge variant={metric.variant}>
                    {metric.value === 0 ? 'None detected' : `${metric.value} found`}
                  </Badge>
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
