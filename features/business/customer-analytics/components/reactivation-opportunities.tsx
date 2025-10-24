'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

type ReactivationOpportunity = {
  id: string
  name: string
  email: string
  daysSinceLastVisit: number
  lastVisit: string
}

type ReactivationOpportunitiesProps = {
  total: number
  customers: ReactivationOpportunity[]
}

export function ReactivationOpportunities({ total, customers }: ReactivationOpportunitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reactivation Opportunities</CardTitle>
        <CardDescription>
          Customers who have not visited recently but are likely to return with the right incentive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant="secondary">{total} customers to re-engage</Badge>
        <div className="space-y-3">
          {customers.slice(0, 5).map((customer) => (
            <Card key={customer.id}>
              <CardHeader className="pb-2">
                <CardTitle>{customer.name}</CardTitle>
                <CardDescription>{customer.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <p className="text-sm text-muted-foreground">
                  Last visit {format(new Date(customer.lastVisit), 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {customer.daysSinceLastVisit} days ago
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
