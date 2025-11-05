import type { ReactNode } from 'react'
import { ItemGroup } from '@/components/ui/item'
import { cn } from '@/lib/utils'

interface MetricsGridProps {
  children: ReactNode
  /**
   * Maximum number of columns to display
   * @default 4
   */
  maxColumns?: 2 | 3 | 4
  /**
   * Gap between grid items
   * @default 'lg'
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const gapClassMap: Record<NonNullable<MetricsGridProps['gap']>, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

function getColumnClasses(maxColumns: NonNullable<MetricsGridProps['maxColumns']>) {
  switch (maxColumns) {
    case 2:
      return 'grid-cols-1 md:grid-cols-2'
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    default:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
}

/**
 * Standardized grid layout for dashboard metrics.
 *
 * Wraps metric cards in an `ItemGroup` to keep semantics consistent while the
 * responsive column classes control layout across breakpoints.
 */
export function MetricsGrid({
  children,
  maxColumns = 4,
  gap = 'lg',
  className,
}: MetricsGridProps) {
  const gapClass = gapClassMap[gap]
  const columnClasses = getColumnClasses(maxColumns)

  return (
    <ItemGroup className={cn('grid', columnClasses, gapClass, className)}>
      {children}
    </ItemGroup>
  )
}
