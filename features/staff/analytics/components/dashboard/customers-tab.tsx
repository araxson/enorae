import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { CustomerRelationship } from '../../api/queries'
import { formatCurrency } from './utils'

interface CustomersTabProps {
  customerRelationships: CustomerRelationship[]
}

export function CustomersTab({ customerRelationships }: CustomersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>Your most loyal customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customerRelationships.length > 0 ? (
            customerRelationships.map((customer) => (
              <div
                key={customer.customer_id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1 space-y-1">
                  <span className="text-sm font-medium leading-tight text-foreground">
                    {customer.customer_name}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {customer.total_appointments} appointments • Last visit:{' '}
                    {new Date(customer.last_appointment_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold leading-tight text-foreground">
                    {formatCurrency(customer.total_spent)}
                  </span>
                  <span className="block text-xs text-muted-foreground">Total spent</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center">
              <CardDescription>No customer data available</CardDescription>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
