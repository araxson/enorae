import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import {
  getServiceCosts,
  getServiceDurationAccuracy,
  getServicePairings,
  getServicePerformance,
  getServiceStaffLeaders,
} from '../api/queries'
import { ServicePerformanceDashboard } from './service-performance-dashboard'

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
    <div className="flex flex-col gap-8">
      <ItemGroup className="gap-2">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Service Performance Analytics</ItemTitle>
            <ItemDescription>
              Track revenue, popularity, and performance metrics for your services
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <ServicePerformanceDashboard
        services={services}
        profitability={profitability}
        staffPerformance={staffLeaders}
        pairings={pairings}
        durationAccuracy={durationAccuracy}
      />
    </div>
  )
}
