import { Section, Stack } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getOperationalMetrics, getOperationalSalon } from './api/queries'
import { OperationalDashboard } from './components/operational-dashboard'

export async function OperationalMetrics() {
  let salon
  try {
    salon = await getOperationalSalon()
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

  const metrics = await getOperationalMetrics(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <OperationalDashboard metrics={metrics} />
      </Stack>
    </Section>
  )
}
