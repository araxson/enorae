import { Building2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Muted } from '@/components/ui/typography'
import { formatCurrency } from './inventory-utils'

type SalonValue = {
  salonId: string
  salonName: string
  totalProducts: number
  totalQuantity: number
  estimatedValue: number
}

type SalonValueTableProps = {
  values: SalonValue[]
}

export function InventorySalonValueTable({ values }: SalonValueTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Salon</TableHead>
          <TableHead className="text-right">Products</TableHead>
          <TableHead className="text-right">Total Quantity</TableHead>
          <TableHead className="text-right">Estimated Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {values.map((salon) => (
          <TableRow key={salon.salonId}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {salon.salonName}
              </div>
            </TableCell>
            <TableCell className="text-right">{salon.totalProducts}</TableCell>
            <TableCell className="text-right">{salon.totalQuantity.toLocaleString()}</TableCell>
            <TableCell className="text-right font-semibold">
              {formatCurrency(salon.estimatedValue)}
            </TableCell>
          </TableRow>
        ))}
        {values.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="py-8 text-center">
              <Muted>No salon data available</Muted>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
