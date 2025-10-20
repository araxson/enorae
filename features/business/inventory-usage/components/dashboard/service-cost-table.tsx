import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ServiceCostAnalysis } from '../../api/queries'
import { formatCurrency } from './utils'

interface ServiceCostTableProps {
  serviceCosts: ServiceCostAnalysis[]
}

export function ServiceCostTable({ serviceCosts }: ServiceCostTableProps) {
  if (serviceCosts.length === 0) return null

  const summary = serviceCosts.reduce(
    (acc, service) => {
      acc.totalAppointments += service.total_appointments
      acc.totalCost += service.total_product_cost
      return acc
    },
    { totalAppointments: 0, totalCost: 0 }
  )

  const averageCost = summary.totalAppointments
    ? summary.totalCost / summary.totalAppointments
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            Aggregate product cost per service across the selected reporting window.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Appointments</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right">Avg Cost/Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceCosts.map((service) => (
              <TableRow key={service.service_id}>
                <TableCell className="font-medium">{service.service_name}</TableCell>
                <TableCell className="text-right">{service.total_appointments}</TableCell>
                <TableCell className="text-right">{formatCurrency(service.total_product_cost)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(service.avg_cost_per_service)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-right font-semibold">Totals</TableCell>
              <TableCell className="text-right font-semibold">{summary.totalAppointments}</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(summary.totalCost)}</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(averageCost)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
