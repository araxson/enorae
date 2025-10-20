import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

import { Star } from 'lucide-react'
import type { CustomerMetrics } from './types'
import { formatCurrency, formatPercentage, getSegmentIcon, getSegmentColor } from './utils'

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
          <div className="space-y-4">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <div
                  key={customer.customer_id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{customer.customer_name}</span>
                      <Badge
                        variant="outline"
                        className={getSegmentColor(customer.segment)}
                      >
                        {getSegmentIcon(customer.segment)}
                        <span className="ml-1">{customer.segment}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
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
                      {customer.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-star-filled text-star-filled" />
                          <span className="font-medium">{customer.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Last visit: {new Date(customer.last_visit_date).toLocaleDateString()} •
                      Favorite staff: {customer.favorite_staff_name}
                    </div>

                    {customer.cancellation_rate > 20 && (
                      <Badge variant="destructive" className="text-xs">
                        High cancellation rate ({formatPercentage(customer.cancellation_rate)})
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8 block">
                No customers in this segment
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
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
