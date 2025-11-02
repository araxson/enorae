'use client'

import { Fragment, memo } from 'react'
import {
  Crown,
  Heart,
  AlertTriangle,
  Users,
  UserPlus,
  UserX,
  Star,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

import type { CustomerMetrics } from '@/features/business/insights/api/queries'

interface CustomerListItemProps {
  customer: CustomerMetrics
  isLast: boolean
  formatCurrency: (amount: number) => string
  formatPercentage: (value: number) => string
}

const getSegmentIcon = (segment: string) => {
  switch (segment) {
    case 'VIP':
      return <Crown className="size-4 text-accent" />
    case 'Loyal':
      return <Heart className="size-4 text-destructive" />
    case 'Regular':
      return <Users className="size-4 text-secondary" />
    case 'At Risk':
      return <AlertTriangle className="size-4 text-destructive" />
    case 'New':
      return <UserPlus className="size-4 text-primary" />
    case 'Churned':
      return <UserX className="size-4 text-muted-foreground" />
    default:
      return <Users className="size-4 text-muted-foreground" />
  }
}

// PERFORMANCE FIX: Wrap in React.memo to prevent unnecessary re-renders in list
export const CustomerListItem = memo(function CustomerListItem({
  customer,
  isLast,
  formatCurrency,
  formatPercentage,
}: CustomerListItemProps) {
  return (
    <Fragment>
      <Item>
        <ItemMedia variant="icon">
          {getSegmentIcon(customer.segment)}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            {customer.customer_name}
            <Badge variant="outline">
              {customer.segment}
            </Badge>
          </ItemTitle>
          <ItemDescription>
            {customer.total_visits} visits • {formatCurrency(customer.lifetime_value)} LTV • {customer.favorite_service_name} favorite
            {customer.average_rating > 0 && (
              <>
                {' '}• <Star className="inline size-3 fill-accent text-accent" /> {customer.average_rating.toFixed(1)}
              </>
            )}
          </ItemDescription>
          <ItemDescription>
            Last visit: {new Date(customer.last_visit_date).toLocaleDateString()} • Favorite staff: {customer.favorite_staff_name}
          </ItemDescription>
          {customer.cancellation_rate > 20 && (
            <Badge variant="destructive" className="mt-2 w-fit">
              High cancellation rate ({formatPercentage(customer.cancellation_rate)})
            </Badge>
          )}
        </ItemContent>
      </Item>
      {!isLast && <ItemSeparator />}
    </Fragment>
  )
})
