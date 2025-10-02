import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Section, Stack } from '@/components/layout'
import { H1, Muted } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getProducts,
  getInventoryStats,
  getStockAlerts,
  getInventorySalon,
} from './dal/inventory.queries'
import { ProductsTable } from './components/products-table'
import { InventoryStats } from './components/inventory-stats'
import { StockAlertsList } from './components/stock-alerts-list'

export async function InventoryManagement() {
  // Get salon from DAL
  let salon
  try {
    salon = await getInventorySalon()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Fetch all data in parallel
  const [products, stats, alerts] = await Promise.all([
    getProducts(salon.id),
    getInventoryStats(salon.id),
    getStockAlerts(salon.id),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <H1>Inventory Management</H1>
            <Muted>Manage products, stock levels, and suppliers</Muted>
          </div>
          <Button>
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
                <ProductsTable products={products} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <StockAlertsList alerts={alerts} />
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Stock levels view coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Purchase orders view coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Stack>
    </Section>
  )
}

export function InventoryManagementSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        {/* Skeleton content */}
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </Stack>
    </Section>
  )
}
