import { Scissors, Star, TrendingUp, Award } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
type StaffService = {
  id: string
  proficiency_level?: string | null
  performed_count?: number | null
  rating_average?: number | null
  rating_count?: number | null
}

type ServicesStatsProps = {
  services: StaffService[]
}

export function ServicesStats({ services }: ServicesStatsProps) {
  const totalServices = services.length
  const totalPerformed = services.reduce((sum, service) => sum + (service.performed_count || 0), 0)

  const ratedServices = services.filter(
    (service) => service.rating_average && service.rating_count && service.rating_count > 0
  )
  const avgRating =
    ratedServices.reduce((sum, service) => sum + (service.rating_average || 0), 0) /
      ratedServices.length || 0
  const expertServices = services.filter((service) => service.proficiency_level === 'expert').length

  const items = [
    {
      label: 'Total services',
      value: totalServices,
      icon: Scissors,
      accent: 'text-info',
    },
    {
      label: 'Total performed',
      value: totalPerformed,
      icon: TrendingUp,
      accent: 'text-success',
    },
    {
      label: 'Average rating',
      value: avgRating > 0 ? avgRating.toFixed(1) : '—',
      icon: Star,
      accent: 'text-warning',
    },
    {
      label: 'Expert level',
      value: expertServices,
      icon: Award,
      accent: 'text-accent',
    },
  ] as const

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, accent }) => (
        <Card key={label}>
          <CardHeader className="flex items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>{value}</CardTitle>
              <CardDescription>{label}</CardDescription>
            </div>
            <Icon className={`h-4 w-4 ${accent}`} aria-hidden="true" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
