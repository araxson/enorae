'use client'

import { useState } from 'react'
import { Edit2, Trash2, Package, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stack, Group, Box, Flex } from '@/components/layout'
import { P } from '@/components/ui/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteProduct } from '../actions/inventory.actions'
import type { ProductWithRelations } from '../dal/inventory.queries'

type ProductsTableProps = {
  products: ProductWithRelations[]
  onEdit?: (product: ProductWithRelations) => void
}

export function ProductsTable({ products, onEdit }: ProductsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const result = await deleteProduct(deleteId)
      if (result.error) {
        alert(result.error)
      }
    } catch (error) {
      alert('Failed to delete product')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const getStockStatus = (product: ProductWithRelations) => {
    const totalStock = product.stock_levels?.reduce((sum, level) => sum + level.quantity, 0) || 0
    const reorderPoint = product.reorder_point || 0

    if (totalStock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const }
    } else if (totalStock <= reorderPoint) {
      return { label: 'Low Stock', variant: 'secondary' as const }
    } else {
      return { label: 'In Stock', variant: 'default' as const }
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Retail Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                <Box py="lg" className="text-center">
                  <Stack gap="xs" align="center" className="text-muted-foreground">
                    <Package className="h-8 w-8" />
                    <P>No products found</P>
                  </Stack>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const stockStatus = getStockStatus(product)
              const totalStock = product.stock_levels?.reduce((sum, level) => sum + level.quantity, 0) || 0

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Stack gap="none">
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs">{product.sku || 'N/A'}</code>
                  </TableCell>
                  <TableCell>
                    {product.category?.name || 'Uncategorized'}
                  </TableCell>
                  <TableCell>
                    <Group gap="xs" align="center">
                      <span className="font-medium">{totalStock}</span>
                      {(stockStatus.variant === 'destructive' || stockStatus.variant === 'secondary') && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </Group>
                  </TableCell>
                  <TableCell>{formatCurrency(product.cost_price)}</TableCell>
                  <TableCell>{formatCurrency(product.retail_price)}</TableCell>
                  <TableCell>
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Flex justify="end" gap="xs">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </Flex>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
