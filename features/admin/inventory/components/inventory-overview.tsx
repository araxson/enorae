'use client'

import { Stack } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  InventorySummary,
  LowStockAlert,
  SalonInventoryValue,
  TopProduct,
  ProductCatalogItem,
  SupplierOverviewItem,
  InventoryValuationSummary,
} from '../api/queries'
import { InventorySummaryCards } from './inventory-summary-cards'
import { InventoryLowStockTable } from './inventory-low-stock-table'
import { InventorySalonValueTable } from './inventory-salon-value-table'
import { InventoryTopProductsTable } from './inventory-top-products-table'
import { InventoryProductCatalogTable } from './inventory-product-catalog-table'
import { InventorySupplierTable } from './inventory-supplier-table'
import { InventoryValuationBreakdown } from './inventory-valuation-breakdown'

type InventoryOverviewProps = {
  summary: InventorySummary
  lowStockAlerts: LowStockAlert[]
  salonValues: SalonInventoryValue[]
  topProducts: TopProduct[]
  productCatalog: ProductCatalogItem[]
  suppliers: SupplierOverviewItem[]
  valuation: InventoryValuationSummary
}

export function InventoryOverview({
  summary,
  lowStockAlerts,
  salonValues,
  topProducts,
  productCatalog,
  suppliers,
  valuation,
}: InventoryOverviewProps) {
  return (
    <Stack gap="xl">
      <InventorySummaryCards summary={summary} />

      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>Platform-wide product overview with tracking and alert status</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryProductCatalogTable products={productCatalog} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryLowStockTable alerts={lowStockAlerts} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Coverage</CardTitle>
          <CardDescription>Suppliers ranked by inventory value and alert load</CardDescription>
        </CardHeader>
        <CardContent>
          <InventorySupplierTable suppliers={suppliers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Valuation</CardTitle>
          <CardDescription>Category contribution to total stock value</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryValuationBreakdown valuation={valuation} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Value by Salon</CardTitle>
          <CardDescription>Estimated inventory value per location</CardDescription>
        </CardHeader>
        <CardContent>
          <InventorySalonValueTable values={salonValues} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Most stocked products across platform</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTopProductsTable products={topProducts} />
        </CardContent>
      </Card>
    </Stack>
  )
}
