import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/lib/types/database.types'
import { Clock, DollarSign, Sparkles } from 'lucide-react'

type Service = Database['public']['Views']['services']['Row']

interface ServicesGridProps {
  services: Service[]
  categoryName?: string
}

export function ServicesGrid({ services, categoryName }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="flex flex-col gap-6">
          <h3 className="scroll-m-20 text-2xl font-semibold">No services found</h3>
          <p className="text-sm text-muted-foreground">
            {categoryName
              ? `No services available in the ${categoryName} category`
              : 'Try browsing different categories to find services'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        {services.length} service{services.length !== 1 ? 's' : ''}
        {categoryName && ` in ${categoryName}`}
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const hasPrice = service.current_price !== null
  const hasSalePrice = service.sale_price !== null && service.sale_price < (service.current_price || 0)

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {service.category_name && (
              <Badge asChild variant="secondary">
                <Link href={`/services/${service.category_slug}`}>
                  {service.category_name}
                </Link>
              </Badge>
            )}
            {service.is_featured && (
              <Badge variant="default" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
          <CardTitle>{service.name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-col gap-6">
          {service.description && (
            <p className="leading-7 text-muted-foreground text-sm line-clamp-3">{service.description}</p>
          )}

          <div className="flex flex-col gap-4">
            {/* Duration */}
            {service.duration_minutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  {service.duration_minutes} minutes
                </p>
              </div>
            )}

            {/* Price */}
            {hasPrice && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-4">
                  {hasSalePrice ? (
                    <>
                      <p className="text-sm font-medium line-through text-muted-foreground">
                        ${service.current_price?.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        ${service.sale_price?.toFixed(2)}
                      </p>
                      <Badge variant="destructive" className="text-xs">
                        Sale
                      </Badge>
                    </>
                    ) : (
                      <p className="text-sm font-semibold">
                        ${service.current_price?.toFixed(2)}
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href={`/services/${service.category_slug}`}>View Salons</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
