'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
  const pathname = usePathname()

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3 items-center items-center justify-between">
          <div className="flex gap-3 items-center">
            <Tag className="h-5 w-5 text-primary" />
            <CardTitle>Service Categories</CardTitle>
          </div>
          <Badge variant="secondary">{categories.length} categories</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <Button
            asChild
            variant={!currentCategory ? 'default' : 'outline'}
            className={cn('h-auto flex-col gap-1 py-3', !currentCategory && 'ring-2 ring-primary')}
          >
            <Link href="/services" passHref>
              <span>All Services</span>
              <p className="text-muted-foreground">
                {categories.reduce((sum, cat) => sum + cat.count, 0)} services
              </p>
            </Link>
          </Button>

          {categories.map((category) => {
            const isActive = currentCategory === category.slug
            return (
              <Button
                key={category.slug}
                asChild
                variant={isActive ? 'default' : 'outline'}
                className={cn('h-auto flex-col gap-1 py-3', isActive && 'ring-2 ring-primary')}
              >
                <Link href={`/services/${category.slug}`} passHref>
                  <span>{category.name}</span>
                  <p className="text-muted-foreground">{category.count} services</p>
                </Link>
              </Button>
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
        <div className="flex gap-3 items-center">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Popular Services</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {services.map((service, index) => (
            <Button
              key={`${service.name}-${service.category}`}
              asChild
              variant="ghost"
              className="justify-between gap-4 px-3 py-3"
            >
                <Link href={`/services/${service.categorySlug}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="shrink-0">
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      <span className="truncate">{service.name}</span>
                      <p className="text-muted-foreground">{service.category}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end ml-4 shrink-0">
                  <p className="text-muted-foreground">{service.salonCount} salons</p>
                  {service.avgPrice && (
                    <span>
                      ${service.avgPrice.toFixed(0)}
                    </span>
                  )}
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
