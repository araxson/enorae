import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import {
  getInventorySummary,
  getLowStockAlerts,
  getSalonInventoryValues,
  getTopProducts,
} from './api/queries'
import { InventoryOverview } from './components/inventory-overview'

export async function AdminInventory() {
  const [summary, lowStockAlerts, salonValues, topProducts] = await Promise.all([
    getInventorySummary(),
    getLowStockAlerts(50),
    getSalonInventoryValues(),
    getTopProducts(20),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Inventory Overview</H1>
          <Lead>Platform-wide inventory monitoring and alerts</Lead>
        </Box>

        <InventoryOverview
          summary={summary}
          lowStockAlerts={lowStockAlerts}
          salonValues={salonValues}
          topProducts={topProducts}
        />
      </Stack>
    </Section>
  )
}
