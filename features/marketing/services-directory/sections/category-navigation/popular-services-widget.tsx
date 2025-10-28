'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { TrendingUp } from 'lucide-react'

interface PopularServicesProps {
  services: Array<{
    name: string
    category: string
    categorySlug: string
    salonCount: number
    avgPrice: number | null
  }>
}

export function PopularServicesWidget({ services }: PopularServicesProps) {
  if (services.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <TrendingUp className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <CardTitle>Popular Services</CardTitle>
          </ItemContent>
        </Item>
      </CardHeader>
      <CardContent>
        <div
          className="group/item-group flex flex-col gap-2"
          data-slot="item-group"
          role="list"
        >
          {services.map((service, index) => (
            <Item key={`${service.name}-${service.category}`} asChild variant="muted">
              <Link href={`/services/${service.categorySlug}`} className="no-underline">
                <ItemMedia variant="icon">
                  <Badge variant="secondary">#{index + 1}</Badge>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{service.name}</ItemTitle>
                  <ItemDescription>{service.category}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground">{service.salonCount} salons</span>
                    {service.avgPrice && <span>${service.avgPrice.toFixed(0)}</span>}
                  </div>
                </ItemActions>
              </Link>
            </Item>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
