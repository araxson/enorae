'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Box, Flex } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { OrderList } from './components/order-list'
import { OrderDetailDialog } from './components/order-detail-dialog'
import type { PurchaseOrderWithDetails } from './dal/purchase-orders.queries'

type PurchaseOrdersProps = {
  initialOrders: PurchaseOrderWithDetails[]
}

export function PurchaseOrders({ initialOrders }: PurchaseOrdersProps) {
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrderWithDetails | null>(null)

  return (
    <Stack gap="xl">
      <Flex align="center" justify="between">
        <Box>
          <H1>Purchase Orders</H1>
          <P className="text-muted-foreground mt-1">
            Manage inventory purchase orders
          </P>
        </Box>
        <Button>
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
    </Stack>
  )
}
