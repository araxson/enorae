import { TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
type Product = {
  productId: string
  productName: string
  productSku: string | null
  totalQuantity: number
  salonsCount: number
}

type TopProductsTableProps = {
  products: Product[]
}

export function InventoryTopProductsTable({ products }: TopProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Total Quantity</TableHead>
          <TableHead className="text-right">Salons</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.productId}>
            <TableCell>
              <div className="flex items-center gap-2">
                {index < 3 && <TrendingUp className="h-4 w-4 text-primary" />}
                <div>
                  <p className="font-medium">{product.productName}</p>
                  {product.productSku && (
                    <p className="text-xs text-muted-foreground">SKU: {product.productSku}</p>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold">
              {product.totalQuantity.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline">{product.salonsCount}</Badge>
            </TableCell>
          </TableRow>
        ))}
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No product data available</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
