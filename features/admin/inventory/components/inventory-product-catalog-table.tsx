import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Muted } from '@/components/ui/typography'
import type { ProductCatalogItem } from '../api/queries'
import { formatCurrency } from './inventory-utils'

type InventoryProductCatalogTableProps = {
  products: ProductCatalogItem[]
}

const formatStatus = (value: boolean, fallback: string) =>
  value ? (
    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
      Active
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-muted text-muted-foreground">
      {fallback}
    </Badge>
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
                    {product.productSku && <Muted>SKU: {product.productSku}</Muted>}
                    {product.reorderPoint !== null && (
                      <Muted>Reorder ≤ {product.reorderPoint}</Muted>
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
                  <Muted>—</Muted>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-1">
                  <p className="font-semibold">{formatCurrency(product.stockValue)}</p>
                  {product.retailValue > 0 && (
                    <Muted className="text-xs">
                      Retail {formatCurrency(product.retailValue)}
                    </Muted>
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
                <Muted>No products found in catalog</Muted>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
