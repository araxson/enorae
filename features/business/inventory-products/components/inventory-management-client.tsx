'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ProductsTable } from './products-table'
import { InventoryStats } from './inventory-stats'
import { StockAlertsList } from './stock-alerts-list'
import { StockLevelsTable } from './stock-levels-table'
import { PurchaseOrdersTab } from './purchase-orders-tab'
import { ProductFormDialog } from './product-form-dialog'
import type { ProductWithRelations, StockAlertWithProduct } from '../api/queries'
import type { PurchaseOrderWithDetails } from '@/features/business/inventory-purchase-orders/api/queries'
import type { Database } from '@/lib/types/database.types'
import type { StockLevelWithLocation } from '../api/stock-queries'

type ProductCategory = Database['public']['Views']['product_categories']['Row']
type Supplier = Database['public']['Views']['suppliers']['Row']

interface InventoryManagementClientProps {
  salonId: string
  products: ProductWithRelations[]
  categories: ProductCategory[]
  suppliers: Supplier[]
  stats: {
    productsCount: number
    lowStockCount: number
    suppliersCount: number
    pendingOrdersCount: number
  }
  alerts: StockAlertWithProduct[]
  stockLevels: StockLevelWithLocation[]
  purchaseOrders: PurchaseOrderWithDetails[]
}

export function InventoryManagementClient({
  salonId,
  products,
  categories,
  suppliers,
  stats,
  alerts,
  stockLevels,
  purchaseOrders,
}: InventoryManagementClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductWithRelations | null>(null)

  const handleAddProduct = () => {
    setEditProduct(null)
    setDialogOpen(true)
  }

  const handleEditProduct = (product: ProductWithRelations) => {
    setEditProduct(product)
    setDialogOpen(true)
  }

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setEditProduct(null)
    }
    setDialogOpen(open)
  }

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        {/* Actions */}
        <div className="flex items-center justify-end">
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Stats Overview */}
        <InventoryStats stats={stats} />

        {/* Main Content */}
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts {alerts.length > 0 && `(${alerts.length})`}
            </TabsTrigger>
            <TabsTrigger value="stock">Stock Levels</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardContent className="pt-6">
                <ProductsTable products={products} onEdit={handleEditProduct} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <StockAlertsList alerts={alerts} />
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardContent className="pt-6">
                <StockLevelsTable stockLevels={stockLevels} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="pt-6">
                <PurchaseOrdersTab orders={purchaseOrders} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Form Dialog */}
        <ProductFormDialog
          open={dialogOpen}
          onOpenChange={handleCloseDialog}
          salonId={salonId}
          categories={categories}
          suppliers={suppliers}
          editProduct={editProduct}
        />
      </div>
    </section>
  )
}
