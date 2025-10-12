import { Section, Stack, Box } from '@/components/layout'
import { Small } from '@/components/ui/typography'
import { AlertsGrid } from './components/alerts-grid'
import { getStockAlerts } from './api/queries'

export async function StockAlerts() {
  const alerts = await getStockAlerts()

  // Calculate counts for filtering
  const unresolvedCount = alerts.filter((a) => !a.is_resolved).length

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="md">
          {unresolvedCount > 0 && (
            <Box className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
              <Small className="font-semibold text-destructive">
                {unresolvedCount} unresolved alert{unresolvedCount > 1 ? 's' : ''} require
                {unresolvedCount === 1 ? 's' : ''} attention
              </Small>
            </Box>
          )}

          <AlertsGrid alerts={alerts} />
        </Stack>
      </Stack>
    </Section>
  )
}
