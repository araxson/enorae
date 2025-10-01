import { Badge } from '@enorae/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@enorae/ui'
import { getProducts } from '../dal/queries'

interface ProductsListProps {
  salonId: string
}

export async function ProductsList({ salonId }: ProductsListProps) {
  const products = await getProducts(salonId)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Retail Price</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(products as any[]).map((product: any) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.product_categories.name}</TableCell>
            <TableCell>{product.inventory.quantity}</TableCell>
            <TableCell>${product.unit_price}</TableCell>
            <TableCell>${product.retail_price}</TableCell>
            <TableCell>
              {product.inventory.quantity <= product.inventory.reorder_point ? (
                <Badge variant="destructive">Low Stock</Badge>
              ) : (
                <Badge variant="secondary">In Stock</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}