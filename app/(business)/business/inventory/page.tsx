import { Suspense } from 'react'
import { InventoryManagement, InventoryManagementSkeleton } from '@/features/business/inventory/products'

export const metadata = {
  title: 'Inventory Management',
  description: 'Manage products, stock levels, and suppliers',
}

export default async function InventoryPage() {
  return (
    <Suspense fallback={<InventoryManagementSkeleton />}>
      <InventoryManagement />
    </Suspense>
  )
}
