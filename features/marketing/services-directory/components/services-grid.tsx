import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/lib/types/database.types'
import { Clock, DollarSign, Sparkles } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type Service = Database['public']['Views']['services_view']['Row']

interface ServicesGridProps {
  services: Service[]
  categoryName?: string
}

export function ServicesGrid({ services, categoryName }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <Empty>
            <EmptyMedia variant="icon">
              <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No services found</EmptyTitle>
              <EmptyDescription>
                {categoryName
                  ? `No services available in the ${categoryName} category`
                  : 'Try browsing different categories to find services.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <Link href="/services-directory">Browse all services</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground">
        {services.length} service{services.length !== 1 ? 's' : ''}
        {categoryName && ` in ${categoryName}`}
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service['id']} service={service} />
        ))}
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const hasPrice = service['current_price'] !== null
  const hasSalePrice = service['sale_price'] !== null && service['sale_price'] < (service['current_price'] || 0)

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {service['category_name'] && (
            <Badge variant="secondary">
              <Link href={`/services/${service['category_slug']}`} className="no-underline">
                {service['category_name']}
              </Link>
            </Badge>
          )}
          {service['is_featured'] && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-primary" />
              <Badge variant="default">Featured</Badge>
            </div>
          )}
        </div>
        <CardTitle>{service['name']}</CardTitle>
        {service['description'] ? (
          <div className="line-clamp-3">
            <CardDescription>{service['description']}</CardDescription>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-col gap-4">
          {service['duration_minutes'] && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {service['duration_minutes']} minutes
              </p>
            </div>
          )}
          {hasPrice && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-4">
                {hasSalePrice ? (
                  <>
                    <p className="line-through text-muted-foreground">
                      ${service['current_price']?.toFixed(2)}
                    </p>
                    <p className="text-primary">
                      ${service['sale_price']?.toFixed(2)}
                    </p>
                    <Badge variant="destructive">Sale</Badge>
                  </>
                ) : (
                  <p>${service['current_price']?.toFixed(2)}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href={`/services/${service['category_slug']}`}>View Salons</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
