'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { StaffRiskBadge } from './staff-risk-badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type StaffInsightListProps = {
  title: string
  description: string
  items: StaffWithMetrics[]
}

export function StaffInsightList({ title, description, items }: StaffInsightListProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{description}</p>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No staff records</EmptyTitle>
                <EmptyDescription>
                  Metrics show up once team members match this condition.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-2">
              <ItemGroup>
                {items.slice(0, 5).map((item) => (
                  <Item key={item.id} variant="outline" size="sm">
                    <ItemContent>
                      <div className="min-w-0">
                        <ItemTitle>
                          <span className="truncate">
                            {item.fullName || item.title || 'Staff member'}
                          </span>
                        </ItemTitle>
                        <ItemDescription>
                          <span className="truncate">{item.salonName || '—'}</span>
                        </ItemDescription>
                      </div>
                    </ItemContent>
                    <ItemActions>
                      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                        <StaffRiskBadge staff={item} />
                        <span>Score {item.compliance.score}</span>
                      </div>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
