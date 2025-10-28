import { Fragment } from 'react'
import { Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { formatCurrency, formatPercentage, getSegmentIcon, getSegmentColor } from './utils'

import type { CustomerMetrics } from './types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface CustomerListProps {
  topCustomers: CustomerMetrics[]
  selectedSegment: string
  onSegmentChange: (segment: string) => void
}

export function CustomerList({
  topCustomers,
  selectedSegment,
  onSegmentChange,
}: CustomerListProps) {
  const segments = ['all', 'vip', 'loyal', 'at risk', 'new'] as const
  const customersBySegment = {
    all: topCustomers,
    vip: topCustomers.filter((c) => c.segment.toLowerCase() === 'vip'),
    loyal: topCustomers.filter((c) => c.segment.toLowerCase() === 'loyal'),
    'at risk': topCustomers.filter((c) => c.segment.toLowerCase() === 'at risk'),
    new: topCustomers.filter((c) => c.segment.toLowerCase() === 'new'),
  }

  const renderPanel = (segment: typeof segments[number]) => {
    const customers = customersBySegment[segment]
    const isAll = segment === 'all'
    const segmentLabel = segment
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
    const title = isAll
      ? 'Top Customers by Lifetime Value'
      : `${segmentLabel} Customers`

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Detailed customer insights and metrics ({customers.length} customers)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <ItemGroup>
              {customers.map((customer, index) => (
                <Fragment key={customer.customer_id}>
                  <Item variant="outline" className="flex-col items-start gap-4">
                    <ItemContent>
                      <ItemHeader>
                        <ItemTitle>{customer.customer_name}</ItemTitle>
                        <Badge
                          variant="outline"
                          className={getSegmentColor(customer.segment)}
                        >
                          {getSegmentIcon(customer.segment)}
                          <span className="ml-1">{customer.segment}</span>
                        </Badge>
                      </ItemHeader>

                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground md:grid-cols-4">
                        <div>
                          <span className="font-medium">{customer.total_visits}</span> visits
                        </div>
                        <div>
                          <span className="font-medium">
                            {formatCurrency(customer.lifetime_value)}
                          </span>{' '}
                          LTV
                        </div>
                        <div>
                          <span className="font-medium">{customer.favorite_service_name}</span>{' '}
                          favorite
                        </div>
                        {customer.average_rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="size-3 fill-star-filled text-star-filled" />
                            <span className="font-medium">{customer.average_rating.toFixed(1)}</span>
                          </div>
                        ) : null}
                      </div>

                      <ItemDescription>
                        Last visit: {new Date(customer.last_visit_date).toLocaleDateString()} • Favorite
                        staff: {customer.favorite_staff_name}
                      </ItemDescription>

                      {customer.cancellation_rate > 20 ? (
                        <Badge variant="destructive">
                          High cancellation rate ({formatPercentage(customer.cancellation_rate)})
                        </Badge>
                      ) : null}
                    </ItemContent>
                  </Item>
                  {index < customers.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              ))}
            </ItemGroup>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No customers in this segment</EmptyTitle>
                <EmptyDescription>Adjust your filters or engage with clients to see insights here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
        <CardFooter>
          Use these insights to tailor perks and retain high-value clients.
        </CardFooter>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="all" value={selectedSegment} onValueChange={onSegmentChange}>
      <TabsList>
        <TabsTrigger value="all">All Customers</TabsTrigger>
        <TabsTrigger value="vip">VIP</TabsTrigger>
        <TabsTrigger value="loyal">Loyal</TabsTrigger>
        <TabsTrigger value="at risk">At Risk</TabsTrigger>
        <TabsTrigger value="new">New</TabsTrigger>
      </TabsList>

      {segments.map((segment) => (
        <TabsContent key={segment} value={segment} className="space-y-4">
          {renderPanel(segment)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
