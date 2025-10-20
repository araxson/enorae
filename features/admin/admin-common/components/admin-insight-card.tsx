'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
      <CardTitle>{title}</CardTitle>
      {description ? <CardDescription>{description}</CardDescription> : null}
    </CardHeader>
    <CardContent className="space-y-3">
      {items.length === 0 ? (
        <p className="text-muted-foreground">{emptyLabel}</p>
      ) : (
        items.map((item, index) => renderItem(item, index))
      )}
    </CardContent>
  </Card>
)
