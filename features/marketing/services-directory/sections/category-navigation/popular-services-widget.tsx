'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { TrendingUp } from 'lucide-react'
import { MarketingPanel } from '@/features/marketing/components/common'

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
    <MarketingPanel
      media={<TrendingUp className="size-4" aria-hidden="true" />}
      mediaVariant="icon"
      title={<span className="text-lg font-semibold tracking-tight">Popular Services</span>}
    >
      <ItemGroup className="gap-2">
        {services.map((service, index) => (
          <Item key={`${service.name}-${service.category}`} asChild variant="muted">
            <Link href={`/services/${service.categorySlug}`} className="no-underline">
              <ItemMedia variant="icon">
                <Badge variant="secondary">#{index + 1}</Badge>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <span className="font-medium">{service.name}</span>
                </ItemTitle>
                <ItemDescription>{service.category}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <div className="flex flex-col items-end gap-1 text-sm">
                  <span>{service.salonCount} salons</span>
                  {service.avgPrice ? <span>${service.avgPrice.toFixed(0)}</span> : null}
                </div>
              </ItemActions>
            </Link>
          </Item>
        ))}
      </ItemGroup>
    </MarketingPanel>
  )
}
