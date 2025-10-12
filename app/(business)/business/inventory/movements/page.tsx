import { StockMovements } from '@/features/business/inventory-movements'

export const metadata = {
  title: 'Stock Movements',
  description: 'Track inventory movements and audit trail',
}

export default async function StockMovementsPage() {
  return <StockMovements />
}
