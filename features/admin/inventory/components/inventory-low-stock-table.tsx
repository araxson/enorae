import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
type LowStockAlert = {
  productId: string
  productName: string
  productSku: string | null
  salonId: string
  salonName: string
  locationName: string
  currentQuantity: number
  lowThreshold: number | null
  criticalThreshold: number | null
  alertLevel: 'low' | 'critical'
}

type LowStockTableProps = {
  alerts: LowStockAlert[]
}

export function InventoryLowStockTable({ alerts }: LowStockTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Salon</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Current</TableHead>
          <TableHead className="text-right">Threshold</TableHead>
          <TableHead className="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={`${alert.productId}-${alert.salonId}-${alert.locationName}`}>
            <TableCell>
              <div>
                <p className="font-medium">{alert.productName}</p>
                {alert.productSku && (
                  <p className="text-sm text-muted-foreground text-xs">SKU: {alert.productSku}</p>
                )}
              </div>
            </TableCell>
            <TableCell>{alert.salonName}</TableCell>
            <TableCell>{alert.locationName}</TableCell>
            <TableCell className="text-right font-semibold">
              {alert.currentQuantity}
            </TableCell>
            <TableCell className="text-right">
              {alert.alertLevel === 'critical'
                ? alert.criticalThreshold
                : alert.lowThreshold}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant={alert.alertLevel === 'critical' ? 'destructive' : 'secondary'}>
                {alert.alertLevel === 'critical' ? 'Critical' : 'Low'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
        {alerts.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No low stock alerts</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
