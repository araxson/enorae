import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SupplierOverviewItem } from '../api/queries'
import { formatCurrency } from './inventory-utils'

type InventorySupplierTableProps = {
  suppliers: SupplierOverviewItem[]
}

export function InventorySupplierTable({ suppliers }: InventorySupplierTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Products</TableHead>
            <TableHead className="text-right">Salons</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Stock Value</TableHead>
            <TableHead className="text-center">Alerts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.supplierName}>
              <TableCell>
                <p className="font-medium leading-tight">{supplier.supplierName}</p>
              </TableCell>
              <TableCell className="text-right">{supplier.productCount}</TableCell>
              <TableCell className="text-right">{supplier.salonCount}</TableCell>
              <TableCell className="text-right">{supplier.totalQuantity}</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(supplier.stockValue)}
              </TableCell>
              <TableCell className="text-center">
                {supplier.activeAlerts > 0 ? (
                  <Badge variant="destructive">{supplier.activeAlerts}</Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </TableCell>
            </TableRow>
          ))}
          {suppliers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No suppliers available</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
