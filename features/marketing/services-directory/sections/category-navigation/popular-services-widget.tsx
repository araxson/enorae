'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemMedia variant="icon">
          <TrendingUp className="size-4" aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            <h3 className="text-lg font-semibold tracking-tight">Popular Services</h3>
          </ItemTitle>
        </ItemContent>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="gap-2">
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
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
