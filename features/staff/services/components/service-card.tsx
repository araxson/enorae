import { Clock, DollarSign, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { P, Muted } from '@/components/ui/typography'

type StaffService = {
  id: string
  service_name: string
  category_name?: string | null
  effective_duration?: number | null
  effective_price?: number | null
  proficiency_level?: string | null
  performed_count?: number | null
  rating_average?: number | null
  rating_count?: number | null
}

type ServiceCardProps = {
  service: StaffService
}

function getProficiencyColor(level?: string | null) {
  switch (level) {
    case 'expert':
      return 'default'
    case 'intermediate':
      return 'secondary'
    case 'beginner':
      return 'outline'
    default:
      return 'outline'
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{service.service_name}</CardTitle>
          {service.proficiency_level && (
            <Badge variant={getProficiencyColor(service.proficiency_level)} className="capitalize">
              {service.proficiency_level}
            </Badge>
          )}
        </div>
        {service.category_name && <Muted className="text-sm">{service.category_name}</Muted>}
      </CardHeader>
      <CardContent className="space-y-3">
        {service.effective_duration && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <P className="text-sm">{service.effective_duration} minutes</P>
          </div>
        )}
        {service.effective_price && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <P className="text-sm">${service.effective_price}</P>
          </div>
        )}
        {service.performed_count != null && service.performed_count > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <Muted className="text-sm">Performed {service.performed_count} times</Muted>
          </div>
        )}
        {service.rating_average && service.rating_count && service.rating_count > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <P className="text-sm">
              {service.rating_average.toFixed(1)} ({service.rating_count} reviews)
            </P>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
