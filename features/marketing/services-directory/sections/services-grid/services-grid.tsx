import Link from 'next/link'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
    <ItemGroup className="gap-6">
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>
            {services.length} service{services.length !== 1 ? 's' : ''}
            {categoryName && ` in ${categoryName}`}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>Open a service card to see duration, pricing, and booking actions.</ItemDescription>
        </ItemContent>
      </Item>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service['id']} service={service} />
        ))}
      </div>
    </ItemGroup>
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
        <ItemGroup className="gap-3">
          {service['duration_minutes'] && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Clock className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>{service['duration_minutes']} minutes</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {hasPrice && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <DollarSign className="size-4" />
              </ItemMedia>
              <ItemContent>
                {hasSalePrice ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="line-through text-muted-foreground">
                      ${service['current_price']?.toFixed(2)}
                    </span>
                    <ItemTitle>${service['sale_price']?.toFixed(2)}</ItemTitle>
                    <Badge variant="destructive">Sale</Badge>
                  </div>
                ) : (
                  <ItemDescription>${service['current_price']?.toFixed(2)}</ItemDescription>
                )}
              </ItemContent>
            </Item>
          )}
        </ItemGroup>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href={`/services/${service['category_slug']}`}>View Salons</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
