'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Box, Flex } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { OrderList } from './order-list'
import { OrderDetailDialog } from './order-detail-dialog'
import { CreateOrderForm } from './create-order-form'
import type { PurchaseOrderWithDetails } from '../api/queries'
import type { Database } from '@/lib/types/database.types'

type Supplier = Database['public']['Views']['suppliers']['Row']
type Product = {
  id: string
  name: string | null
  cost_price: number | null
}

type PurchaseOrdersClientProps = {
  initialOrders: PurchaseOrderWithDetails[]
  suppliers: Supplier[]
  products: Product[]
}

export function PurchaseOrdersClient({
  initialOrders,
  suppliers,
  products,
}: PurchaseOrdersClientProps) {
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrderWithDetails | null>(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  return (
    <Stack gap="xl">
      <Flex align="center" justify="between">
        <Box>
          <H1>Purchase Orders</H1>
          <P className="text-muted-foreground mt-1">
            Manage inventory purchase orders
          </P>
        </Box>
        <Button onClick={() => setIsCreateFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </Flex>

      <OrderList orders={initialOrders} onView={setViewingOrder} />

      <OrderDetailDialog
        order={viewingOrder}
        open={!!viewingOrder}
        onOpenChange={(open) => !open && setViewingOrder(null)}
      />

      <CreateOrderForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        suppliers={suppliers}
        products={products}
      />
    </Stack>
  )
}
