import { Grid, Box } from '@/components/layout'
import { AlertCard } from './alert-card'
import type { StockAlertWithProduct } from '../api/queries'

interface AlertsGridProps {
  alerts: StockAlertWithProduct[]
}

export function AlertsGrid({ alerts }: AlertsGridProps) {
  if (alerts.length === 0) {
    return (
      <Box className="text-center py-12">
        <p className="leading-7 text-muted-foreground">No stock alerts found</p>
      </Box>
    )
  }

  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </Grid>
  )
}
