'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

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
        {customers.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No reactivation opportunities</EmptyTitle>
              <EmptyDescription>All customers have visited recently.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="space-y-3">
            {customers.slice(0, 5).map((customer) => (
              <Item key={customer.id} variant="outline" className="flex-col gap-2">
                <ItemContent>
                  <ItemTitle className="text-lg font-semibold">{customer.name}</ItemTitle>
                  <ItemDescription>{customer.email}</ItemDescription>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>
                    Last visit {format(new Date(customer.lastVisit), 'MMM d, yyyy')}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <ItemDescription>{customer.daysSinceLastVisit} days ago</ItemDescription>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
