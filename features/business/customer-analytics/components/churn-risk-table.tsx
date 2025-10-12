'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type ChurnRisk = {
  id: string
  name: string
  email: string
  phone: string
  daysSinceLastVisit: number
  visitCount: number
}

type ChurnRiskTableProps = {
  customers: ChurnRisk[]
}

export function ChurnRiskTable({ customers }: ChurnRiskTableProps) {
  if (customers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Churn Risk</CardTitle>
          <CardDescription>No at-risk customers in the last 6 months.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Risk</CardTitle>
        <CardDescription>Customers approaching churn thresholds</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Days Since Visit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="space-y-1">
                  <div className="font-medium">{customer.name}</div>
                  <Badge variant="outline">{customer.id.slice(0, 8)}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground space-y-1">
                  {customer.email && <div>{customer.email}</div>}
                  {customer.phone && <div>{customer.phone}</div>}
                </TableCell>
                <TableCell>{customer.visitCount}</TableCell>
                <TableCell>
                  <span className={customer.daysSinceLastVisit > 120 ? 'text-rose-600 font-semibold' : ''}>
                    {customer.daysSinceLastVisit} days
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
