import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getOperationalMetrics, getOperationalSalon } from './api/queries'
import { OperationalDashboard } from './components'

export async function OperationalMetrics() {
  let salon
  try {
    salon = await getOperationalSalon()
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert>
          <AlertTitle>Metrics unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  const metrics = await getOperationalMetrics(salon.id)

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <OperationalDashboard metrics={metrics} />
      </div>
    </section>
  )
}
