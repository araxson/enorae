'use client'

import {
  Crown,
  Heart,
  AlertTriangle,
  Users,
  UserPlus,
  UserX,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Customer Segmentation</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                Customer distribution across different segments
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {segmentCards.map(({ label, value, icon: Icon, iconClass }) => (
            <Card key={label}>
              <CardHeader className="items-center justify-center pb-2">
                <ItemGroup className="items-center justify-center">
                  <Item className="flex-col items-center gap-2">
                    <ItemMedia>
                      <Icon className={cn('h-6 w-6', iconClass)} aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{label}</ItemTitle>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent className="pt-0 flex items-center justify-center">
                <CardTitle>{value}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
