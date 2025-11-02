'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StaffPerformanceBenchmark } from '@/features/admin/staff/api/queries'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type StaffTopPerformersProps = {
  items: StaffPerformanceBenchmark[]
}

export function StaffTopPerformers({ items }: StaffTopPerformersProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Top performers</CardTitle>
              <p className="text-xs text-muted-foreground">Sorted by customer rating and compliance</p>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No performers yet</EmptyTitle>
                <EmptyDescription>
                  Top performers populate after ratings and compliance scores stabilize.
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
                          <span className="truncate">{item.name || 'Staff member'}</span>
                        </ItemTitle>
                        <ItemDescription>
                          <span className="truncate">{item.salonName || '—'}</span>
                        </ItemDescription>
                      </div>
                    </ItemContent>
                    <ItemActions>
                      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                        <span>
                          Rating {item.averageRating ? item.averageRating.toFixed(2) : '—'}
                        </span>
                        <span>Compliance {item.complianceScore}</span>
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
