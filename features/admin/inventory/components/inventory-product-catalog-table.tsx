import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ProductCatalogItem } from '../api/queries'
import { formatCurrency } from './inventory-utils'

type InventoryProductCatalogTableProps = {
  products: ProductCatalogItem[]
}

const formatStatus = (value: boolean, fallback: string) =>
  value ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="secondary">{fallback}</Badge>
  )

export function InventoryProductCatalogTable({ products }: InventoryProductCatalogTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Salons</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Available</TableHead>
            <TableHead className="text-right">Alerts</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productId}>
              <TableCell>
                <div>
                  <p className="font-medium leading-tight">{product.productName}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {product.productSku && <p className="text-sm text-muted-foreground">SKU: {product.productSku}</p>}
                    {product.reorderPoint !== null && (
                      <p className="text-sm text-muted-foreground">Reorder ≤ {product.reorderPoint}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.supplierName || 'Unassigned'}</TableCell>
              <TableCell>{product.categoryName || 'Uncategorized'}</TableCell>
              <TableCell className="text-right">{product.salonCount}</TableCell>
              <TableCell className="text-right font-semibold">{product.totalQuantity}</TableCell>
              <TableCell className="text-right">{product.totalAvailable}</TableCell>
              <TableCell className="text-right">
                {product.activeAlerts > 0 ? (
                  <Badge variant="destructive">{product.activeAlerts}</Badge>
                ) : product.lowStockLocations > 0 ? (
                  <Badge variant="secondary">{product.lowStockLocations}</Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-1">
                  <p className="font-semibold">{formatCurrency(product.stockValue)}</p>
                  {product.retailValue > 0 && (
                    <p className="text-sm text-muted-foreground text-xs">
                      Retail {formatCurrency(product.retailValue)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center space-y-1">
                {formatStatus(product.isActive, 'Inactive')}
                <div className="text-xs text-muted-foreground">
                  {product.isTracked ? 'Tracked' : 'Not tracked'}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No products found in catalog</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
