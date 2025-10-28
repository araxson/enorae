'use client'

import { type ComponentType, type ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { formatCurrency } from '@/features/business/business-common/components/value-formatters'

export type RankingItem = {
  /**
   * Unique identifier for the item
   */
  id: string
  /**
   * Primary name/label
   */
  name: string
  /**
   * Secondary label (e.g., role, category)
   */
  subtitle?: string
  /**
   * Primary metric value (e.g., revenue, count)
   */
  value: number
  /**
   * Optional secondary metric label
   */
  metric?: string
}

type RankingListProps = {
  /**
   * Title of the ranking list
   */
  title: string
  /**
   * Optional icon for the card header
   */
  icon?: ReactNode | ComponentType<{ className?: string }>
  /**
   * Icon color class
   */
  iconColor?: string
  /**
   * Array of ranking items
   */
  items: RankingItem[]
  /**
   * How to display the value
   * - 'currency': Format as currency (default)
   * - 'number': Format as plain number
   */
  valueFormat?: 'currency' | 'number'
  /**
   * Maximum number of items to display
   */
  limit?: number
  /**
   * Empty state message
   */
  emptyMessage?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Ranking list component for displaying top performers, services, etc.
 *
 * @example
 * ```tsx
 * <RankingList
 *   title="Top Services"
 *   icon={Star}
 *   iconColor="text-accent"
 *   items={[
 *     { id: '1', name: 'Haircut', subtitle: '45 bookings', value: 3750, metric: 'revenue' },
 *     { id: '2', name: 'Color', subtitle: '32 bookings', value: 2880, metric: 'revenue' },
 *   ]}
 *   valueFormat="currency"
 *   limit={5}
 * />
 * ```
 */
export function RankingList({
  title,
  icon,
  iconColor = 'text-primary',
  items,
  valueFormat = 'currency',
  limit,
  emptyMessage = 'No data available',
  className,
}: RankingListProps) {
  // Render icon based on type
  const IconComponent =
    icon && typeof icon === 'function' ? icon : icon ? () => icon : null

  // Limit items if specified
  const displayItems = limit ? items.slice(0, limit) : items

  // Format value based on type
  const formatValue = (value: number) => {
    if (valueFormat === 'currency') {
      return formatCurrency(value)
    }
    return value.toLocaleString('en-US')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {valueFormat === 'currency' ? (
          <CardDescription>Values shown in USD</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        {IconComponent ? (
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <IconComponent className={`size-5 ${iconColor}`} aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">Ranking</span>
          </div>
        ) : null}
        {displayItems.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{emptyMessage}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="space-y-3">
            {displayItems.map((item, index) => (
              <Item key={item.id} variant="outline" size="sm" className="items-center">
                <ItemMedia>
                  <Badge variant={index === 0 ? 'default' : 'outline'} className="w-8 justify-center">
                    #{index + 1}
                  </Badge>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{item.name}</ItemTitle>
                  {item.subtitle ? <ItemDescription>{item.subtitle}</ItemDescription> : null}
                </ItemContent>
                <ItemActions>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold">{formatValue(item.value)}</span>
                    {item.metric ? (
                      <span className="text-xs text-muted-foreground">{item.metric}</span>
                    ) : null}
                  </div>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
