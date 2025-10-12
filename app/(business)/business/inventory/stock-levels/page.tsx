import { StockLevels } from '@/features/business/inventory-stock-levels'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Stock Levels',
  description: 'Manage stock across all locations',
  noIndex: true,
})

export default async function StockLevelsPage() {
  return <StockLevels />
}
