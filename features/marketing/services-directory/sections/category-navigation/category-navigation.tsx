'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Tag } from 'lucide-react'
import { MarketingPanel } from '@/features/marketing/components/common'
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
    <MarketingPanel
      variant="outline"
      media={<Tag className="size-4" aria-hidden="true" />}
      mediaVariant="icon"
      title={<span className="text-lg font-semibold tracking-tight">Service Categories</span>}
      actions={
        <Badge variant="secondary" aria-label={`${categories.length} categories available`}>
          {categories.length} categories
        </Badge>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <Item asChild variant={!currentCategory ? 'muted' : 'outline'}>
          <Link href="/services" className="no-underline">
            <ItemContent className="flex flex-col gap-1">
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
            <Item key={category.slug} asChild variant={isActive ? 'muted' : 'outline'}>
              <Link href={`/services/${category.slug}`} className="no-underline">
                <ItemContent className="flex flex-col gap-1">
                  <ItemTitle>{category.name}</ItemTitle>
                  <ItemDescription>{category.count} services</ItemDescription>
                </ItemContent>
              </Link>
            </Item>
          )
        })}
      </div>
    </MarketingPanel>
  )
}
