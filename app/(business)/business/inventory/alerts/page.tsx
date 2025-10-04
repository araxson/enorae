import { StockAlerts } from '@/features/business/inventory/alerts'

export const metadata = {
  title: 'Stock Alerts',
  description: 'Monitor and manage inventory stock alerts',
}

export default async function StockAlertsPage() {
  return <StockAlerts />
}
