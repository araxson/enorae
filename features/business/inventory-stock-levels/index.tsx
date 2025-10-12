import { Section, Stack } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StockLevelsTable } from '@/features/business/inventory-products/components/stock-levels-table'
import { getStockLevels, getStockLocations } from './api/queries'
import { transferStock, adjustStock } from './api/mutations'

export async function StockLevels() {
  let stockLevels, locations

  try {
    ;[stockLevels, locations] = await Promise.all([
      getStockLevels(),
      getStockLocations(),
    ])
  } catch (error) {
    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load stock levels'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <StockLevelsTable
          stockLevels={stockLevels}
          locations={locations.map((loc) => ({
            id: loc.id!,
            name: loc.name || 'Unknown',
          }))}
          onTransfer={transferStock}
          onAdjust={adjustStock}
        />
      </Stack>
    </Section>
  )
}
