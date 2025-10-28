'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Tag } from 'lucide-react'
import { EmptyState } from './empty-state'

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
    return <EmptyState />
  }

  return (
    <Card>
      <CardHeader>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Tag className="size-4" aria-hidden="true" />
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
