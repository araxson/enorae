import { getUserSalon } from '@/features/business/shared/api/salon.queries'
import { getServicePerformance, getServiceRevenue } from './api/queries'
import { ServicePerformanceDashboard } from './components/service-performance-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function ServicePerformance() {
  const salon = await getUserSalon()
  const services = await getServicePerformance(salon.id)
  const revenueByService = await getServiceRevenue(salon.id)

  return (
    <Stack gap="xl">
      <div>
        <H1>Service Performance Analytics</H1>
        <P className="text-muted-foreground">
          Track revenue, popularity, and performance metrics for your services
        </P>
      </div>

      <ServicePerformanceDashboard
        services={services}
        revenueByService={revenueByService}
      />
    </Stack>
  )
}
