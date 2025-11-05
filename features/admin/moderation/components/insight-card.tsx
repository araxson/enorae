import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'

type InsightCardProps = {
  title: string
  emptyLabel: string
  items: ModerationReview[]
  renderBadge: (review: ModerationReview) => ReactNode
}

export function InsightCard({ title, emptyLabel, items, renderBadge }: InsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>{title}</CardTitle>
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
                <EmptyDescription>
                  These insights populate automatically as moderation data shifts.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            items.map((review) => (
              <Item
                key={review['id'] ?? `${review['salon_id']}-${review['created_at']}`}
                variant="outline"
                className="items-start gap-3"
              >
                <ItemContent>
                  <div className="min-w-0">
                    <ItemTitle>{review['customer_name'] || 'Anonymous'}</ItemTitle>
                    <ItemDescription>{review['salon_name'] || 'Unknown salon'}</ItemDescription>
                  </div>
                </ItemContent>
                <ItemActions>{renderBadge(review)}</ItemActions>
              </Item>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
