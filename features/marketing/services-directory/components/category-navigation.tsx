'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Flex, Group, Stack, Grid } from '@/components/layout'
import { cn } from '@/lib/utils'
import { Tag, TrendingUp } from 'lucide-react'
import { H3, Muted } from '@/components/ui/typography'

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
    <Card className="p-6">
      <Stack gap="md">
        <Flex justify="between" align="center">
          <Group gap="sm">
            <Tag className="h-5 w-5 text-primary" />
            <H3>Service Categories</H3>
          </Group>
          <Badge variant="secondary">{categories.length} categories</Badge>
        </Flex>

        <Grid cols={{ base: 2, sm: 3, md: 4, lg: 6 }} gap="sm">
          {/* All Services */}
          <Link href="/services" passHref>
            <Button
              variant={!currentCategory ? 'default' : 'outline'}
              className={cn('w-full h-auto py-3 flex-col gap-1', !currentCategory && 'ring-2 ring-primary')}
            >
              <span className="font-semibold">All Services</span>
              <Muted className="text-xs">
                {categories.reduce((sum, cat) => sum + cat.count, 0)} services
              </Muted>
            </Button>
          </Link>

          {/* Categories */}
          {categories.map((category) => {
            const isActive = currentCategory === category.slug
            return (
              <Link key={category.slug} href={`/services/${category.slug}`} passHref>
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  className={cn(
                    'w-full h-auto py-3 flex-col gap-1',
                    isActive && 'ring-2 ring-primary'
                  )}
                >
                  <span className="font-semibold text-sm">{category.name}</span>
                  <Muted className="text-xs">{category.count} services</Muted>
                </Button>
              </Link>
            )
          })}
        </Grid>
      </Stack>
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
    <Card className="p-6">
      <Stack gap="md">
        <Group gap="sm">
          <TrendingUp className="h-5 w-5 text-primary" />
          <H3>Popular Services</H3>
        </Group>

        <Stack gap="sm">
          {services.map((service, index) => (
            <Link
              key={`${service.name}-${service.category}`}
              href={`/services/${service.categorySlug}`}
            >
              <Flex
                justify="between"
                align="center"
                className="p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Group gap="md" className="flex-1">
                  <Badge variant="secondary" className="shrink-0">
                    #{index + 1}
                  </Badge>
                  <Stack gap="xs" className="flex-1 min-w-0">
                    <span className="font-medium truncate">{service.name}</span>
                    <Muted className="text-xs">{service.category}</Muted>
                  </Stack>
                </Group>
                <Stack gap="xs" align="end" className="shrink-0 ml-4">
                  <Muted className="text-xs">{service.salonCount} salons</Muted>
                  {service.avgPrice && (
                    <span className="text-sm font-semibold">
                      ${service.avgPrice.toFixed(0)}
                    </span>
                  )}
                </Stack>
              </Flex>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
