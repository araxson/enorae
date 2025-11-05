'use client'

import {
  Crown,
  Heart,
  AlertTriangle,
  Users,
  UserPlus,
  UserX,
} from 'lucide-react'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

import type { InsightsSummary } from '@/features/business/insights/api/queries'

interface CustomerSegmentationCardProps {
  summary: InsightsSummary
}

export function CustomerSegmentationCard({ summary }: CustomerSegmentationCardProps): React.JSX.Element {
  const segmentCards = [
    { label: 'VIP', value: summary.segmentation.vip, icon: Crown, iconClass: 'text-accent' },
    { label: 'Loyal', value: summary.segmentation.loyal, icon: Heart, iconClass: 'text-destructive' },
    { label: 'Regular', value: summary.segmentation.regular, icon: Users, iconClass: 'text-secondary' },
    { label: 'At Risk', value: summary.segmentation.at_risk, icon: AlertTriangle, iconClass: 'text-destructive' },
    { label: 'New', value: summary.segmentation.new, icon: UserPlus, iconClass: 'text-primary' },
    { label: 'Churned', value: summary.segmentation.churned, icon: UserX, iconClass: 'text-muted-foreground' },
  ]

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Customer Segmentation</ItemTitle>
          <ItemDescription>Customer distribution across different segments</ItemDescription>
        </ItemContent>
      </ItemHeader>
      <ItemContent>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {segmentCards.map(({ label, value, icon: Icon, iconClass }) => (
            <Item key={label} variant="outline" className="flex-col gap-2">
              <ItemHeader>
                <ItemTitle>{label}</ItemTitle>
                <ItemActions>
                  <Icon className={cn('size-4', iconClass)} aria-hidden="true" />
                </ItemActions>
              </ItemHeader>
              <ItemContent>
                <p className="text-2xl font-semibold leading-none tracking-tight">{value}</p>
              </ItemContent>
            </Item>
          ))}
        </div>
      </ItemContent>
    </Item>
  )
}
