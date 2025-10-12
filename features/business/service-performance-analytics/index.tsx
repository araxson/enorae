import { getUserSalon } from '@/features/business/business-common/api/queries'
import {
  getServicePerformance,
  getServiceCosts,
  getServiceStaffLeaders,
  getServicePairings,
  getServiceDurationAccuracy,
} from './api/queries'
import { ServicePerformanceDashboard } from './components/service-performance-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function ServicePerformance() {
  const salon = await getUserSalon()
  if (!salon?.id) {
    throw new Error('Salon not found')
  }
  const services = await getServicePerformance(salon.id)
  const serviceIds = services.map((service) => service.service_id).filter(Boolean) as string[]

  const [costMap, staffLeaders, pairings, durationAccuracy] = await Promise.all([
    getServiceCosts(serviceIds),
    getServiceStaffLeaders(salon.id),
    getServicePairings(salon.id),
    getServiceDurationAccuracy(salon.id, serviceIds),
  ])

  const profitability = services.map((service) => {
    const revenue = service.total_revenue || 0
    const unitCost = (service.service_id && costMap[service.service_id]) || 0
    const totalCost = unitCost * service.total_bookings
    const profit = revenue - totalCost
    const margin = revenue === 0 ? 0 : (profit / revenue) * 100

    return {
      service_id: service.service_id,
      service_name: service.service_name,
      revenue,
      cost: totalCost,
      profit,
      margin,
    }
  })

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
        profitability={profitability}
        staffPerformance={staffLeaders}
        pairings={pairings}
        durationAccuracy={durationAccuracy}
      />
    </Stack>
  )
}
