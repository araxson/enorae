import { Scissors, Star, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { P } from '@/components/ui/typography'

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
      accent: 'text-blue-500',
    },
    {
      label: 'Total performed',
      value: totalPerformed,
      icon: TrendingUp,
      accent: 'text-green-500',
    },
    {
      label: 'Average rating',
      value: avgRating > 0 ? avgRating.toFixed(1) : '—',
      icon: Star,
      accent: 'text-yellow-500',
    },
    {
      label: 'Expert level',
      value: expertServices,
      icon: Award,
      accent: 'text-purple-500',
    },
  ] as const

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, accent }) => (
        <Card key={label}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-1">
              <P className="text-sm text-muted-foreground">{label}</P>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
            <Icon className={`h-4 w-4 ${accent}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
