import { Suspense } from 'react'
import { InventoryManagement } from '@/features/business/inventory/products'
import { PageLoading } from '@/components/shared'
export const metadata = { title: 'Inventory Management', description: 'Manage products, stock levels, and suppliers', noIndex: true }
export default async function InventoryPage() {
  return <Suspense fallback={<PageLoading />}><InventoryManagement /></Suspense>
}
