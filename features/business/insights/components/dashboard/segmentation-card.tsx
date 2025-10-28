import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { InsightsSummary } from './types'
import { AlertTriangle, Crown, Heart, TrendingUp, UserPlus, UserX, Users } from 'lucide-react'

interface SegmentationCardProps {
  summary: InsightsSummary
}

export function SegmentationCard({ summary }: SegmentationCardProps) {
  const segments = [
    {
      label: 'VIP',
      count: summary.segmentation.vip,
      icon: Crown,
      variant: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      label: 'Loyal',
      count: summary.segmentation.loyal,
      icon: Heart,
      variant: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    {
      label: 'Regular',
      count: summary.segmentation.regular,
      icon: Users,
      variant: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      label: 'At Risk',
      count: summary.segmentation.at_risk,
      icon: AlertTriangle,
      variant: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      label: 'New',
      count: summary.segmentation.new,
      icon: UserPlus,
      variant: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Churned',
      count: summary.segmentation.churned,
      icon: UserX,
      variant: 'bg-muted',
      iconColor: 'text-muted-foreground',
    },
  ] as const

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemMedia variant="icon">
          <TrendingUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Customer Segmentation</ItemTitle>
          <ItemDescription>
            Customer distribution across different segments
          </ItemDescription>
        </ItemContent>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {segments.map(({ label, count, icon: Icon, variant, iconColor }) => (
            <Item key={label} className={`flex-col items-center gap-2 py-4 ${variant}`}>
              <ItemMedia variant="icon">
                <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
              </ItemMedia>
              <ItemContent className="flex flex-col items-center gap-1">
                <CardTitle>{count}</CardTitle>
                <ItemDescription>{label}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          Tailor campaigns for at-risk and churned segments to rebalance your funnel.
        </AlertDescription>
      </Alert>
    </Item>
  )
}
