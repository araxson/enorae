'use client'

import {
  Crown,
  Heart,
  AlertTriangle,
  Users,
  UserPlus,
  UserX,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { InsightsSummary } from '@/features/business/insights/api/queries'

interface CustomerSegmentationCardProps {
  summary: InsightsSummary
}

export function CustomerSegmentationCard({ summary }: CustomerSegmentationCardProps) {
  const segmentCards = [
    { label: 'VIP', value: summary.segmentation.vip, icon: Crown, iconClass: 'text-accent' },
    { label: 'Loyal', value: summary.segmentation.loyal, icon: Heart, iconClass: 'text-destructive' },
    { label: 'Regular', value: summary.segmentation.regular, icon: Users, iconClass: 'text-secondary' },
    { label: 'At Risk', value: summary.segmentation.at_risk, icon: AlertTriangle, iconClass: 'text-destructive' },
    { label: 'New', value: summary.segmentation.new, icon: UserPlus, iconClass: 'text-primary' },
    { label: 'Churned', value: summary.segmentation.churned, icon: UserX, iconClass: 'text-muted-foreground' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segmentation</CardTitle>
        <CardDescription>Customer distribution across different segments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {segmentCards.map(({ label, value, icon: Icon, iconClass }) => (
            <Card key={label}>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-2 pt-0">
                <Icon className={cn('size-6', iconClass)} aria-hidden="true" />
                <p className="text-2xl font-semibold leading-none tracking-tight">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
