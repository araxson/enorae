'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { CustomerRelationship } from '@/features/staff/analytics/api/queries'

interface CustomerRelationshipsTabProps {
  customerRelationships: CustomerRelationship[]
}

export function CustomerRelationshipsTab({ customerRelationships }: CustomerRelationshipsTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Your most loyal customers</CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerRelationships.length > 0 ? (
              <ItemGroup className="gap-0">
                {customerRelationships.map((customer, index) => (
                  <Fragment key={customer.customer_id}>
                    <Item variant="outline" size="sm">
                      <ItemContent>
                        <ItemTitle>{customer.customer_name}</ItemTitle>
                        <ItemDescription>
                          {customer.total_appointments} appointments • Last visit:{' '}
                          {new Date(customer.last_appointment_date).toLocaleDateString()}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <div className="text-right text-sm leading-tight">
                          <div className="font-semibold">
                            {formatCurrency(customer.total_spent)}
                          </div>
                          <div className="text-xs text-muted-foreground">Total spent</div>
                        </div>
                      </ItemActions>
                    </Item>
                    {index < customerRelationships.length - 1 ? <ItemSeparator /> : null}
                  </Fragment>
                ))}
              </ItemGroup>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No customer data available</EmptyTitle>
                  <EmptyDescription>Engage with clients to populate top customer insights.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
