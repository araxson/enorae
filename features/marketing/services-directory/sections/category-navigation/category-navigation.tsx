'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Tag, TrendingUp } from 'lucide-react'

interface Category {
  name: string
  slug: string
  count: number
}

interface CategoryNavigationProps {
  categories: Category[]
  currentCategory?: string
}

export function CategoryNavigation({ categories, currentCategory }: CategoryNavigationProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No categories available yet</EmptyTitle>
              <EmptyDescription>
                New service categories will appear once salons publish their offerings.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Badge variant="secondary">Check back soon</Badge>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Tag className="size-4 text-primary" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <CardTitle>Service Categories</CardTitle>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary" aria-label={`${categories.length} categories available`}>
              {categories.length} categories
            </Badge>
          </ItemActions>
        </Item>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <Item
            asChild
            className="flex-col gap-1"
            variant={!currentCategory ? 'muted' : 'outline'}
          >
            <Link href="/services" className="no-underline">
              <ItemContent>
                <ItemTitle>All Services</ItemTitle>
                <ItemDescription>
                  {categories.reduce((sum, cat) => sum + cat.count, 0)} services
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>

          {categories.map((category) => {
            const isActive = currentCategory === category.slug
            return (
              <Item
                key={category.slug}
                asChild
                className="flex-col gap-1"
                variant={isActive ? 'muted' : 'outline'}
              >
                <Link href={`/services/${category.slug}`} className="no-underline">
                  <ItemContent>
                    <ItemTitle>{category.name}</ItemTitle>
                    <ItemDescription>{category.count} services</ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

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
            <TrendingUp className="size-4 text-primary" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <CardTitle>Popular Services</CardTitle>
          </ItemContent>
        </Item>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          {services.map((service, index) => (
            <Item key={`${service.name}-${service.category}`} asChild variant="muted">
              <Link href={`/services/${service.categorySlug}`} className="no-underline">
                <ItemMedia variant="icon">
                  <Badge variant="secondary">#{index + 1}</Badge>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <span className="truncate">{service.name}</span>
                  </ItemTitle>
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
      </CardContent>
    </Card>
  )
}
