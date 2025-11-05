'use client'

import { Fragment } from 'react'
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
import type { CustomerMetrics } from '@/features/business/insights/types'
import { useCurrencyFormatter } from '@/features/business/insights/hooks'

interface CustomerListItemProps {
  customer: CustomerMetrics
  isLast: boolean
}

const getSegmentIcon = (segment: string): React.JSX.Element => {
  switch (segment) {
    case 'VIP':
      return <Crown className="size-4 text-accent" aria-hidden="true" />
    case 'Loyal':
      return <Heart className="size-4 text-destructive" aria-hidden="true" />
    case 'Regular':
      return <Users className="size-4 text-secondary" aria-hidden="true" />
    case 'At Risk':
      return <AlertTriangle className="size-4 text-destructive" aria-hidden="true" />
    case 'New':
      return <UserPlus className="size-4 text-primary" aria-hidden="true" />
    case 'Churned':
      return <UserX className="size-4 text-muted-foreground" aria-hidden="true" />
    default:
      return <Users className="size-4 text-muted-foreground" aria-hidden="true" />
  }
}

export function CustomerListItem({
  customer,
  isLast,
}: CustomerListItemProps): React.JSX.Element {
  const { formatCurrency, formatPercentage } = useCurrencyFormatter()

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
                {' '}• <Star className="inline size-3 fill-accent text-accent" aria-hidden="true" /> {customer.average_rating.toFixed(1)}
              </>
            )}
          </ItemDescription>
          <ItemDescription>
            Last visit: {new Date(customer.last_visit_date).toLocaleDateString()} • Favorite staff: {customer.favorite_staff_name}
          </ItemDescription>
          {customer.cancellation_rate > 20 && (
            <div className="mt-2">
              <Badge variant="destructive">
                High cancellation rate ({formatPercentage(customer.cancellation_rate)})
              </Badge>
            </div>
          )}
        </ItemContent>
      </Item>
      {!isLast && <ItemSeparator />}
    </Fragment>
  )
}
