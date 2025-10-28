import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

import type { CustomerRelationship } from '@/features/staff/analytics/api/queries'
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
        {customerRelationships.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Appointments</TableHead>
                <TableHead className="text-right">Last Visit</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerRelationships.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell className="font-medium">{customer.customer_name}</TableCell>
                  <TableCell className="text-right">{customer.total_appointments}</TableCell>
                  <TableCell className="text-right">
                    {new Date(customer.last_appointment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(customer.total_spent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No customer data available</EmptyTitle>
              <EmptyDescription>Invite customers back to populate this list.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <p className="text-sm text-muted-foreground">Follow up with recent visitors or encourage rebooking to surface top customers.</p>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
