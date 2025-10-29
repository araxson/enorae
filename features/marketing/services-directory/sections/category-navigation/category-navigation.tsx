'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
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
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemMedia variant="icon">
          <Tag className="size-4" aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            <h2 className="text-lg font-semibold tracking-tight">Service Categories</h2>
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Badge variant="secondary" aria-label={`${categories.length} categories available`}>
            {categories.length} categories
          </Badge>
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
      </ItemContent>
    </Item>
  )
}
