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
import { Separator } from '@/components/ui/separator'

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
      return <Crown className="h-4 w-4 text-accent" />
    case 'Loyal':
      return <Heart className="h-4 w-4 text-destructive" />
    case 'Regular':
      return <Users className="h-4 w-4 text-secondary" />
    case 'At Risk':
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    case 'New':
      return <UserPlus className="h-4 w-4 text-primary" />
    case 'Churned':
      return <UserX className="h-4 w-4 text-muted-foreground" />
    default:
      return <Users className="h-4 w-4 text-muted-foreground" />
  }
}

export function CustomerListItem({
  customer,
  isLast,
  formatCurrency,
  formatPercentage,
}: CustomerListItemProps) {
  return (
    <Fragment>
      <article className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{customer.customer_name}</div>
            <Badge variant="outline" className="flex items-center gap-1">
              {getSegmentIcon(customer.segment)}
              {customer.segment}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground md:grid-cols-4">
            <div>
              <span className="font-semibold">{customer.total_visits}</span> visits
            </div>
            <div>
              <span className="font-semibold">
                {formatCurrency(customer.lifetime_value)}
              </span>{' '}
              LTV
            </div>
            <div>
              <span className="font-semibold">{customer.favorite_service_name}</span>{' '}
              favorite
            </div>
            {customer.average_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="font-semibold">
                  {customer.average_rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Last visit: {new Date(customer.last_visit_date).toLocaleDateString()} •
            Favorite staff: {customer.favorite_staff_name}
          </div>

          {customer.cancellation_rate > 20 && (
            <Badge variant="destructive">
              <span className="text-xs">
                High cancellation rate ({formatPercentage(customer.cancellation_rate)})
              </span>
            </Badge>
          )}
        </div>
      </article>
      {!isLast && <Separator />}
    </Fragment>
  )
}
