'use client'

import type { ReactNode, ComponentType } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className={`h-5 w-5 ${iconColor}`} />}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex gap-3 items-center">
                  <Badge
                    variant={index === 0 ? 'default' : 'outline'}
                    className="w-8 justify-center"
                  >
                    #{index + 1}
                  </Badge>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground text-xs">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatValue(item.value)}</div>
                  {item.metric && (
                    <p className="text-sm text-muted-foreground text-xs">{item.metric}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
