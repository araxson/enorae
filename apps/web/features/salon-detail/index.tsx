import { getSalonBySlug, getSalonServices, getSalonStaff } from './dal/salon.queries'
import { SalonHeader } from './components/salon-header'
import { ServiceList } from './components/service-list'
import { StaffGrid } from './components/staff-grid'

interface SalonDetailProps {
  slug: string
}

export async function SalonDetail({ slug }: SalonDetailProps) {
  const salon = await getSalonBySlug(slug)

  if (!salon || !salon.id) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Salon not found</h1>
      </div>
    )
  }

  const [services, staff] = await Promise.all([
    getSalonServices(salon.id),
    getSalonStaff(salon.id),
  ])

  return (
    <div className="container mx-auto p-6 space-y-8">
      <SalonHeader salon={salon} />
      <ServiceList services={services} salonSlug={slug} />
      <StaffGrid staff={staff} />
    </div>
  )
}