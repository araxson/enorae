'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'

interface AdminInsightCardProps<T> {
  title: string
  description?: string
  emptyLabel: string
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
}

export const AdminInsightCard = <T,>({
  title,
  description,
  emptyLabel,
  items,
  renderItem,
}: AdminInsightCardProps<T>) => (
  <Card>
    <CardHeader>
      <ItemGroup>
        <Item variant="muted" size="sm">
          <ItemContent>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </ItemContent>
        </Item>
      </ItemGroup>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{emptyLabel}</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>No data available yet.</EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          items.map((item, index) => renderItem(item, index))
        )}
      </div>
    </CardContent>
  </Card>
)
